// Client-Side Security & Authentication Engine for Admin Panel

export interface SecurityStatus {
  isLocked: boolean;
  remainingLockoutSec: number;
  remainingAttempts: number;
  maxAttempts: number;
  lockoutDurationMin: number;
  securityEngine: string;
  features: {
    pbkdf2Iterations: number;
    timingSafeComparison: boolean;
    bruteForceProtection: boolean;
    inactivityTimeout: string;
    wireEncryptionFriendly: boolean;
  };
}

export interface AuditLogItem {
  id: string;
  type: 'LOGIN_SUCCESS' | 'LOGIN_FAILED' | 'LOGOUT' | 'PASSWORD_CHANGED' | 'BRUTE_FORCE_BLOCKED' | 'SESSION_EXPIRED' | 'UNAUTHORIZED_ACCESS' | 'SETTINGS_SAVED';
  severity: 'info' | 'warning' | 'error' | 'critical';
  ip: string;
  userAgent: string;
  timestamp: string;
  details: string;
}

export interface LoginResult {
  success: boolean;
  message: string;
  token?: string;
  expiresAt?: number;
  expiresInSeconds?: number;
  locked?: boolean;
  remainingLockoutSec?: number;
  remainingAttempts?: number;
}

const TOKEN_STORAGE_KEY = 'shv_admin_session_token_v2';
const TOKEN_EXPIRY_KEY = 'shv_admin_session_exp_v2';

export const authService = {
  // Get stored session token (validated against expiry)
  getToken(): string | null {
    try {
      const token = sessionStorage.getItem(TOKEN_STORAGE_KEY) || localStorage.getItem(TOKEN_STORAGE_KEY);
      const expiry = sessionStorage.getItem(TOKEN_EXPIRY_KEY) || localStorage.getItem(TOKEN_EXPIRY_KEY);

      if (!token || !expiry) return null;

      const expNum = parseInt(expiry, 10);
      if (isNaN(expNum) || Date.now() > expNum) {
        this.clearSession();
        return null;
      }

      return token;
    } catch {
      return null;
    }
  },

  // Save session token
  saveSession(token: string, expiresAt: number, rememberDevice: boolean = false) {
    try {
      if (rememberDevice) {
        localStorage.setItem(TOKEN_STORAGE_KEY, token);
        localStorage.setItem(TOKEN_EXPIRY_KEY, String(expiresAt));
      } else {
        sessionStorage.setItem(TOKEN_STORAGE_KEY, token);
        sessionStorage.setItem(TOKEN_EXPIRY_KEY, String(expiresAt));
      }
    } catch {
      // Storage fallback
    }
  },

  // Clear session
  clearSession() {
    try {
      sessionStorage.removeItem(TOKEN_STORAGE_KEY);
      sessionStorage.removeItem(TOKEN_EXPIRY_KEY);
      localStorage.removeItem(TOKEN_STORAGE_KEY);
      localStorage.removeItem(TOKEN_EXPIRY_KEY);
    } catch {
      // Storage fallback
    }
  },

  // Check auth status & security parameters from server
  async getStatus(): Promise<SecurityStatus> {
    try {
      const res = await fetch('/api/auth/status');
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {
      console.warn('[Security Engine] Offline or direct client mode', e);
    }

    return {
      isLocked: false,
      remainingLockoutSec: 0,
      remainingAttempts: 5,
      maxAttempts: 5,
      lockoutDurationMin: 15,
      securityEngine: 'PBKDF2-SHA512 + TimingSafeEqual + HMAC-SHA256',
      features: {
        pbkdf2Iterations: 100000,
        timingSafeComparison: true,
        bruteForceProtection: true,
        inactivityTimeout: '15m',
        wireEncryptionFriendly: true,
      },
    };
  },

  // Perform secure login
  async login(password: string, rememberDevice: boolean = false): Promise<LoginResult> {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          password,
          rememberDurationHours: rememberDevice ? 24 : 8,
        }),
      });

      const data = await res.json();

      if (res.ok && data.success && data.token) {
        this.saveSession(data.token, data.expiresAt, rememberDevice);
        return {
          success: true,
          message: data.message || 'Access granted.',
          token: data.token,
          expiresAt: data.expiresAt,
          expiresInSeconds: data.expiresInSeconds,
        };
      }

      return {
        success: false,
        message: data.message || 'Authentication failed.',
        locked: data.locked,
        remainingLockoutSec: data.remainingLockoutSec,
        remainingAttempts: data.remainingAttempts,
      };
    } catch (err: any) {
      // Fallback for isolated preview mode if backend fetch fails
      return {
        success: false,
        message: err.message || 'Unable to connect to security server. Please retry.',
      };
    }
  },

  // Verify active session token with server
  async verifySession(): Promise<boolean> {
    const token = this.getToken();
    if (!token) return false;

    try {
      const res = await fetch('/api/auth/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ token }),
      });

      if (res.ok) {
        const data = await res.json();
        return Boolean(data.valid);
      } else {
        this.clearSession();
        return false;
      }
    } catch {
      // If network offline, check local token expiry
      return this.getToken() !== null;
    }
  },

  // Logout admin
  async logout(): Promise<void> {
    const token = this.getToken();
    if (token) {
      try {
        await fetch('/api/auth/logout', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ token }),
        });
      } catch {
        // Ignored
      }
    }
    this.clearSession();
  },

  // Change master password
  async changePassword(currentPassword: string, newPassword: string): Promise<{ success: boolean; message: string }> {
    const token = this.getToken();
    if (!token) {
      return { success: false, message: 'Session expired. Please log in again.' };
    }

    try {
      const res = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        if (data.token) {
          this.saveSession(data.token, data.expiresAt);
        }
        return { success: true, message: data.message };
      }

      return { success: false, message: data.message || 'Failed to update password.' };
    } catch (err: any) {
      return { success: false, message: err.message || 'Network error occurred while updating password.' };
    }
  },

  // Fetch security audit logs
  async getAuditLogs(): Promise<{ success: boolean; logs: AuditLogItem[]; activeSessionsCount?: number; lastPasswordChange?: string }> {
    const token = this.getToken();
    if (!token) {
      return { success: false, logs: [] };
    }

    try {
      const res = await fetch('/api/admin/audit-logs', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        return await res.json();
      }
    } catch {
      // Ignored
    }

    return { success: false, logs: [] };
  },

  // Clear audit logs
  async clearAuditLogs(): Promise<boolean> {
    const token = this.getToken();
    if (!token) return false;

    try {
      const res = await fetch('/api/admin/clear-logs', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return res.ok;
    } catch {
      return false;
    }
  },
};
