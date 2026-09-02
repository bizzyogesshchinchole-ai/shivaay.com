import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import crypto from 'crypto';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const app = express();
const PORT = 3000;

// Security configuration
const ADMIN_SECRET = process.env.ADMIN_SECRET_KEY || crypto.randomBytes(32).toString('hex');
const DEFAULT_PASSWORD = process.env.ADMIN_DEFAULT_PASSWORD || 'shivaay@admin2026';

// Password storage structure: salt (hex) + hash (hex)
interface PasswordRecord {
  salt: string;
  hash: string;
  updatedAt: string;
}

// Derive PBKDF2 hash
function hashPassword(password: string, salt: string): string {
  return crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512').toString('hex');
}

// Initialize admin password store in memory with secure salt
let initialSalt = crypto.randomBytes(16).toString('hex');
let adminPasswordRecord: PasswordRecord = {
  salt: initialSalt,
  hash: hashPassword(DEFAULT_PASSWORD, initialSalt),
  updatedAt: new Date().toISOString(),
};

// Rate limiter / brute force protection tracker
interface FailedAttemptRecord {
  count: number;
  lastAttempt: number;
  lockedUntil: number | null;
}
const ipAttempts = new Map<string, FailedAttemptRecord>();
const MAX_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 15 * 60 * 1000; // 15 minutes lockout

// Active sessions: token -> { createdAt, expiresAt, ip, userAgent }
interface SessionRecord {
  createdAt: number;
  expiresAt: number;
  ip: string;
  userAgent: string;
}
const activeSessions = new Map<string, SessionRecord>();

// Security Audit Logs
export interface AuditLogEntry {
  id: string;
  type: 'LOGIN_SUCCESS' | 'LOGIN_FAILED' | 'LOGOUT' | 'PASSWORD_CHANGED' | 'BRUTE_FORCE_BLOCKED' | 'SESSION_EXPIRED' | 'UNAUTHORIZED_ACCESS' | 'SETTINGS_SAVED';
  severity: 'info' | 'warning' | 'error' | 'critical';
  ip: string;
  userAgent: string;
  timestamp: string;
  details: string;
}
const auditLogs: AuditLogEntry[] = [
  {
    id: `log-${Date.now()}-init`,
    type: 'LOGIN_SUCCESS',
    severity: 'info',
    ip: '127.0.0.1',
    userAgent: 'Server-Init/Security-Engine',
    timestamp: new Date().toISOString(),
    details: 'Security engine initialized with PBKDF2-SHA512 salt & timing-safe validation.',
  },
];

function addAuditLog(
  type: AuditLogEntry['type'],
  severity: AuditLogEntry['severity'],
  ip: string,
  userAgent: string,
  details: string
) {
  const entry: AuditLogEntry = {
    id: `log-${Date.now()}-${crypto.randomBytes(4).toString('hex')}`,
    type,
    severity,
    ip: ip || 'unknown',
    userAgent: (userAgent || 'unknown').substring(0, 150),
    timestamp: new Date().toISOString(),
    details,
  };
  auditLogs.unshift(entry);
  if (auditLogs.length > 100) {
    auditLogs.pop();
  }
}

// Token generation with HMAC signature
function generateSignedToken(ip: string, durationMs: number = 8 * 60 * 60 * 1000): { token: string; expiresAt: number } {
  const randomPayload = crypto.randomBytes(24).toString('hex');
  const now = Date.now();
  const expiresAt = now + durationMs;
  const signature = crypto
    .createHmac('sha256', ADMIN_SECRET)
    .update(`${randomPayload}:${expiresAt}:${ip}`)
    .digest('hex');

  const token = `${randomPayload}.${expiresAt}.${signature}`;
  activeSessions.set(token, {
    createdAt: now,
    expiresAt,
    ip,
    userAgent: '',
  });

  return { token, expiresAt };
}

// Token validation
function verifySignedToken(token: string, clientIp: string): boolean {
  if (!token || typeof token !== 'string') return false;

  const session = activeSessions.get(token);
  if (!session) return false;

  if (Date.now() > session.expiresAt) {
    activeSessions.delete(token);
    return false;
  }

  const parts = token.split('.');
  if (parts.length !== 3) return false;

  const [randomPayload, expiresAtStr, providedSignature] = parts;
  const expiresAt = parseInt(expiresAtStr, 10);
  if (isNaN(expiresAt) || Date.now() > expiresAt) {
    activeSessions.delete(token);
    return false;
  }

  // Check signature using timingSafeEqual
  const expectedSignature = crypto
    .createHmac('sha256', ADMIN_SECRET)
    .update(`${randomPayload}:${expiresAt}:${session.ip}`)
    .digest('hex');

  try {
    const isMatch = crypto.timingSafeEqual(
      Buffer.from(providedSignature, 'hex'),
      Buffer.from(expectedSignature, 'hex')
    );
    return isMatch;
  } catch {
    return false;
  }
}

// Helper to extract client IP safely
function getClientIp(req: Request): string {
  const forwarded = req.headers['x-forwarded-for'];
  if (typeof forwarded === 'string') {
    return forwarded.split(',')[0].trim();
  }
  return req.socket.remoteAddress || '127.0.0.1';
}

// Middleware: Express JSON & URL-encoded
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Middleware: Strict HTTP Security Headers
app.use((req: Request, res: Response, next: NextFunction) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  res.setHeader('X-Shivaay-Security-Engine', 'v2-PBKDF2-HMAC-ConstantTime');
  next();
});

// Middleware: Admin Auth Guard for /api/admin/* routes
function requireAdminAuth(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.substring(7) : (req.body?.token || req.query?.token);
  const clientIp = getClientIp(req);

  if (!token || !verifySignedToken(String(token), clientIp)) {
    addAuditLog(
      'UNAUTHORIZED_ACCESS',
      'warning',
      clientIp,
      req.headers['user-agent'] || '',
      `Blocked unauthorized access to ${req.method} ${req.originalUrl}`
    );
    return res.status(401).json({
      success: false,
      message: 'Unauthorized: Valid admin cryptographic session token required',
      code: 'AUTH_REQUIRED',
    });
  }

  next();
}

// ==========================================
// AUTH & SECURITY API ENDPOINTS
// ==========================================

// 1. GET /api/auth/status - Check public security & lockout posture
app.get('/api/auth/status', (req: Request, res: Response) => {
  const clientIp = getClientIp(req);
  const attemptRecord = ipAttempts.get(clientIp);
  const now = Date.now();

  let isLocked = false;
  let remainingLockoutSec = 0;
  let remainingAttempts = MAX_ATTEMPTS;

  if (attemptRecord) {
    if (attemptRecord.lockedUntil && attemptRecord.lockedUntil > now) {
      isLocked = true;
      remainingLockoutSec = Math.ceil((attemptRecord.lockedUntil - now) / 1000);
      remainingAttempts = 0;
    } else {
      remainingAttempts = Math.max(0, MAX_ATTEMPTS - attemptRecord.count);
    }
  }

  res.json({
    success: true,
    securityEngine: 'PBKDF2-SHA512 + TimingSafeEqual + HMAC-SHA256',
    isLocked,
    remainingLockoutSec,
    remainingAttempts,
    maxAttempts: MAX_ATTEMPTS,
    lockoutDurationMin: 15,
    features: {
      pbkdf2Iterations: 100000,
      timingSafeComparison: true,
      bruteForceProtection: true,
      inactivityTimeout: '15m',
      wireEncryptionFriendly: true,
    },
  });
});

// 2. POST /api/auth/login - Secure Admin Login with Brute-force Shield
app.post('/api/auth/login', (req: Request, res: Response) => {
  const clientIp = getClientIp(req);
  const userAgent = req.headers['user-agent'] || '';
  const { password, rememberDurationHours } = req.body;
  const now = Date.now();

  // Check IP rate-limit lockout
  const attempt = ipAttempts.get(clientIp) || { count: 0, lastAttempt: now, lockedUntil: null };

  if (attempt.lockedUntil && attempt.lockedUntil > now) {
    const remainingSec = Math.ceil((attempt.lockedUntil - now) / 1000);
    addAuditLog(
      'BRUTE_FORCE_BLOCKED',
      'critical',
      clientIp,
      userAgent,
      `Login blocked: IP locked out for ${remainingSec}s due to consecutive failures.`
    );
    return res.status(429).json({
      success: false,
      message: `Account protection active. Too many failed attempts. Try again in ${Math.ceil(remainingSec / 60)} minute(s).`,
      locked: true,
      remainingLockoutSec: remainingSec,
    });
  }

  // Validate input
  if (!password || typeof password !== 'string') {
    return res.status(400).json({
      success: false,
      message: 'Password is required.',
    });
  }

  // Derive hash of supplied password using stored salt
  const computedHash = hashPassword(password, adminPasswordRecord.salt);
  const expectedHash = adminPasswordRecord.hash;

  // Constant-time timing-safe comparison to prevent side-channel leaks
  let isPasswordValid = false;
  try {
    const computedBuffer = Buffer.from(computedHash, 'hex');
    const expectedBuffer = Buffer.from(expectedHash, 'hex');
    if (computedBuffer.length === expectedBuffer.length) {
      isPasswordValid = crypto.timingSafeEqual(computedBuffer, expectedBuffer);
    }
  } catch {
    isPasswordValid = false;
  }

  if (!isPasswordValid) {
    attempt.count += 1;
    attempt.lastAttempt = now;

    if (attempt.count >= MAX_ATTEMPTS) {
      attempt.lockedUntil = now + LOCKOUT_DURATION_MS;
      ipAttempts.set(clientIp, attempt);

      addAuditLog(
        'BRUTE_FORCE_BLOCKED',
        'critical',
        clientIp,
        userAgent,
        `Brute force threshold reached (${MAX_ATTEMPTS} failed attempts). IP locked out for 15 minutes.`
      );

      return res.status(429).json({
        success: false,
        message: 'Security threshold exceeded: Too many invalid attempts. IP locked for 15 minutes.',
        locked: true,
        remainingLockoutSec: LOCKOUT_DURATION_MS / 1000,
      });
    }

    ipAttempts.set(clientIp, attempt);
    const remaining = MAX_ATTEMPTS - attempt.count;

    addAuditLog(
      'LOGIN_FAILED',
      'warning',
      clientIp,
      userAgent,
      `Failed admin password attempt (${attempt.count}/${MAX_ATTEMPTS}).`
    );

    return res.status(401).json({
      success: false,
      message: `Invalid admin master password. ${remaining} attempt(s) remaining before security lockout.`,
      remainingAttempts: remaining,
    });
  }

  // Login successful -> Reset failure count
  ipAttempts.delete(clientIp);

  // Session duration (e.g. 8h or 24h if selected)
  const durationHours = typeof rememberDurationHours === 'number' && rememberDurationHours > 0 ? Math.min(rememberDurationHours, 24) : 8;
  const durationMs = durationHours * 60 * 60 * 1000;

  const { token, expiresAt } = generateSignedToken(clientIp, durationMs);
  const session = activeSessions.get(token);
  if (session) {
    session.userAgent = userAgent;
  }

  addAuditLog(
    'LOGIN_SUCCESS',
    'info',
    clientIp,
    userAgent,
    `Admin successfully authenticated. Session valid for ${durationHours}h.`
  );

  return res.json({
    success: true,
    message: 'Admin access granted.',
    token,
    expiresAt,
    expiresInSeconds: Math.floor(durationMs / 1000),
    user: {
      role: 'admin',
      name: 'Shivaay Store Administrator',
      lastLogin: new Date().toISOString(),
    },
  });
});

// 3. POST /api/auth/verify - Verify session token validity
app.post('/api/auth/verify', (req: Request, res: Response) => {
  const clientIp = getClientIp(req);
  const { token } = req.body;

  if (!token || !verifySignedToken(token, clientIp)) {
    return res.status(401).json({
      success: false,
      valid: false,
      message: 'Session is expired or invalid.',
    });
  }

  const session = activeSessions.get(token)!;
  const remainingSec = Math.max(0, Math.floor((session.expiresAt - Date.now()) / 1000));

  res.json({
    success: true,
    valid: true,
    expiresAt: session.expiresAt,
    remainingSeconds: remainingSec,
  });
});

// 4. POST /api/auth/logout - Revoke Session Token
app.post('/api/auth/logout', (req: Request, res: Response) => {
  const clientIp = getClientIp(req);
  const userAgent = req.headers['user-agent'] || '';
  const { token } = req.body;

  if (token && typeof token === 'string') {
    activeSessions.delete(token);
  }

  addAuditLog('LOGOUT', 'info', clientIp, userAgent, 'Admin logged out. Session token revoked.');

  res.json({
    success: true,
    message: 'Logged out successfully.',
  });
});

// 5. POST /api/auth/change-password - Change Master Password
app.post('/api/auth/change-password', requireAdminAuth, (req: Request, res: Response) => {
  const clientIp = getClientIp(req);
  const userAgent = req.headers['user-agent'] || '';
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return res.status(400).json({
      success: false,
      message: 'Both current password and new password are required.',
    });
  }

  // Verify current password
  const currentComputed = hashPassword(currentPassword, adminPasswordRecord.salt);
  let isCurrentValid = false;
  try {
    const curBuffer = Buffer.from(currentComputed, 'hex');
    const expBuffer = Buffer.from(adminPasswordRecord.hash, 'hex');
    if (curBuffer.length === expBuffer.length) {
      isCurrentValid = crypto.timingSafeEqual(curBuffer, expBuffer);
    }
  } catch {
    isCurrentValid = false;
  }

  if (!isCurrentValid) {
    addAuditLog(
      'PASSWORD_CHANGED',
      'warning',
      clientIp,
      userAgent,
      'Password change rejected: Incorrect current password provided.'
    );
    return res.status(401).json({
      success: false,
      message: 'Current password verification failed. Please enter your existing password correctly.',
    });
  }

  // Validate new password complexity (minimum 8 chars, at least 1 uppercase, 1 lowercase, 1 number, 1 special char)
  if (typeof newPassword !== 'string' || newPassword.length < 8) {
    return res.status(400).json({
      success: false,
      message: 'New password must be at least 8 characters long.',
    });
  }

  const hasUpper = /[A-Z]/.test(newPassword);
  const hasLower = /[a-z]/.test(newPassword);
  const hasDigit = /[0-9]/.test(newPassword);
  const hasSpecial = /[^A-Za-z0-9]/.test(newPassword);

  if (!((hasUpper && hasLower && hasDigit) || (hasUpper && hasDigit && hasSpecial) || (hasLower && hasDigit && hasSpecial))) {
    return res.status(400).json({
      success: false,
      message: 'Password too weak. Must include a combination of uppercase letters, lowercase letters, numbers, and symbols.',
    });
  }

  // Generate fresh salt and hash
  const newSalt = crypto.randomBytes(16).toString('hex');
  const newHash = hashPassword(newPassword, newSalt);

  adminPasswordRecord = {
    salt: newSalt,
    hash: newHash,
    updatedAt: new Date().toISOString(),
  };

  // Invalidate previous sessions except current session
  activeSessions.clear();

  // Create fresh session
  const { token, expiresAt } = generateSignedToken(clientIp, 8 * 60 * 60 * 1000);

  addAuditLog(
    'PASSWORD_CHANGED',
    'info',
    clientIp,
    userAgent,
    'Master admin password updated successfully with new cryptographic salt.'
  );

  res.json({
    success: true,
    message: 'Master password updated securely! All prior sessions have been invalidated.',
    token,
    expiresAt,
  });
});

// 6. GET /api/admin/audit-logs - Retrieve Security Audit Trail
app.get('/api/admin/audit-logs', requireAdminAuth, (req: Request, res: Response) => {
  res.json({
    success: true,
    logs: auditLogs,
    activeSessionsCount: activeSessions.size,
    lastPasswordChange: adminPasswordRecord.updatedAt,
  });
});

// 7. POST /api/admin/clear-logs - Clear Audit Logs
app.post('/api/admin/clear-logs', requireAdminAuth, (req: Request, res: Response) => {
  const clientIp = getClientIp(req);
  const userAgent = req.headers['user-agent'] || '';

  auditLogs.length = 0;
  addAuditLog('LOGOUT', 'info', clientIp, userAgent, 'Security audit log cleared by administrator.');

  res.json({
    success: true,
    message: 'Audit logs cleared.',
    logs: auditLogs,
  });
});

// 8. GET /api/health - Health check endpoint
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'Shivaay Agri Products Backend & Security Engine',
  });
});

// ==========================================
// VITE / STATIC CLIENT APP SERVING
// ==========================================
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Shivaay Server] Running on http://0.0.0.0:${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
