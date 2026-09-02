import React, { useState, useEffect } from 'react';
import { authService, AuditLogItem, SecurityStatus } from '../../services/authService';
import { useStore } from '../../context/StoreContext';
import {
  ShieldCheck,
  Lock,
  KeyRound,
  Eye,
  EyeOff,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Server,
  Activity,
  Trash2,
  RefreshCw,
  LogOut,
  Sliders,
  Cpu,
  Zap,
} from 'lucide-react';

export const SecurityManagement: React.FC = () => {
  const { addToast } = useStore();

  // Change Password state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  // Audit Logs state
  const [auditLogs, setAuditLogs] = useState<AuditLogItem[]>([]);
  const [isLoadingLogs, setIsLoadingLogs] = useState(false);
  const [securityStatus, setSecurityStatus] = useState<SecurityStatus | null>(null);

  const fetchLogsAndStatus = async () => {
    setIsLoadingLogs(true);
    try {
      const [logsRes, statusRes] = await Promise.all([
        authService.getAuditLogs(),
        authService.getStatus(),
      ]);
      if (logsRes.success && logsRes.logs) {
        setAuditLogs(logsRes.logs);
      }
      setSecurityStatus(statusRes);
    } catch {
      // Offline fallback
    } finally {
      setIsLoadingLogs(false);
    }
  };

  useEffect(() => {
    fetchLogsAndStatus();
  }, []);

  // Password strength calculation
  const getPasswordStrength = (pass: string) => {
    if (!pass) return { score: 0, label: 'None', color: 'bg-slate-200' };
    let score = 0;
    if (pass.length >= 8) score++;
    if (pass.length >= 12) score++;
    if (/[A-Z]/.test(pass) && /[a-z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;

    if (score <= 2) return { score: 1, label: 'Weak', color: 'bg-rose-500' };
    if (score === 3 || score === 4) return { score: 2, label: 'Moderate', color: 'bg-amber-500' };
    return { score: 3, label: 'Strong (Enterprise Grade)', color: 'bg-emerald-500' };
  };

  const strength = getPasswordStrength(newPassword);

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError(null);

    if (!currentPassword) {
      setPasswordError('Please enter your current administrator password.');
      return;
    }
    if (newPassword.length < 8) {
      setPasswordError('New password must be at least 8 characters long.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError('New passwords do not match. Please re-enter carefully.');
      return;
    }

    setIsChangingPassword(true);
    const res = await authService.changePassword(currentPassword, newPassword);
    setIsChangingPassword(false);

    if (res.success) {
      addToast('success', res.message || 'Password changed successfully!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      fetchLogsAndStatus();
    } else {
      setPasswordError(res.message);
    }
  };

  const handleClearLogs = async () => {
    if (window.confirm('Are you sure you want to clear the security audit logs?')) {
      const ok = await authService.clearAuditLogs();
      if (ok) {
        addToast('info', 'Security audit logs reset.');
        fetchLogsAndStatus();
      }
    }
  };

  return (
    <div className="space-y-8 text-xs text-slate-700">
      {/* Top Security Status Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 rounded-3xl p-6 sm:p-8 text-white border border-slate-800 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white">Cryptographic Security Engine</h2>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-[10px] font-mono text-emerald-400 font-bold">
                  ACTIVE & PROTECTED
                </span>
              </div>
              <p className="text-slate-400 text-xs">
                Zero plaintext storage, constant-time validation, and HMAC-signed session tokens.
              </p>
            </div>
          </div>

          <button
            onClick={fetchLogsAndStatus}
            disabled={isLoadingLogs}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-semibold transition-all self-start sm:self-auto"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoadingLogs ? 'animate-spin' : ''}`} />
            <span>Refresh Security Health</span>
          </button>
        </div>

        {/* 4-Pillar Security Matrix */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
          <div className="bg-slate-950/60 p-4 rounded-2xl border border-slate-800 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Password Hashing</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            </div>
            <p className="font-bold text-sm text-white">PBKDF2-SHA512</p>
            <p className="text-[10px] text-slate-400">100,000 cryptographic rounds + 16-byte random salt</p>
          </div>

          <div className="bg-slate-950/60 p-4 rounded-2xl border border-slate-800 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Side-Channel Defense</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            </div>
            <p className="font-bold text-sm text-white">Timing-Safe Equal</p>
            <p className="text-[10px] text-slate-400">Constant-time execution prevents timing attacks</p>
          </div>

          <div className="bg-slate-950/60 p-4 rounded-2xl border border-slate-800 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Brute-Force Rate Limiter</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            </div>
            <p className="font-bold text-sm text-white">5 Attempts / 15m</p>
            <p className="text-[10px] text-slate-400">IP throttling with automatic backoff lockout</p>
          </div>

          <div className="bg-slate-950/60 p-4 rounded-2xl border border-slate-800 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Inactivity Shield</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            </div>
            <p className="font-bold text-sm text-white">15m Auto-Lock</p>
            <p className="text-[10px] text-slate-400">Automatic screen locking when idle</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Change Master Password Form */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <KeyRound className="w-4 h-4 text-slate-700" />
              <h3 className="font-bold text-sm text-slate-900">Update Administrator Password</h3>
            </div>

            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              {/* Current Password */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Current Password</label>
                <div className="relative">
                  <input
                    type={showCurrent ? 'text' : 'password'}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Enter current password..."
                    className="w-full pl-3 pr-9 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-mono text-xs focus:ring-1 focus:ring-slate-900"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrent(!showCurrent)}
                    className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600"
                  >
                    {showCurrent ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {/* New Password */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">New Master Password</label>
                <div className="relative">
                  <input
                    type={showNew ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter strong new password (min. 8 chars)..."
                    className="w-full pl-3 pr-9 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-mono text-xs focus:ring-1 focus:ring-slate-900"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNew(!showNew)}
                    className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600"
                  >
                    {showNew ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>

                {/* Strength Meter */}
                {newPassword && (
                  <div className="mt-2 space-y-1">
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="text-slate-500 font-medium">Strength:</span>
                      <span className="font-bold text-slate-700">{strength.label}</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden flex gap-1">
                      <div
                        className={`h-full rounded-full transition-all ${
                          strength.score >= 1 ? strength.color : 'bg-transparent'
                        } ${strength.score >= 1 ? 'w-1/3' : 'w-0'}`}
                      />
                      <div
                        className={`h-full rounded-full transition-all ${
                          strength.score >= 2 ? strength.color : 'bg-transparent'
                        } ${strength.score >= 2 ? 'w-1/3' : 'w-0'}`}
                      />
                      <div
                        className={`h-full rounded-full transition-all ${
                          strength.score >= 3 ? strength.color : 'bg-transparent'
                        } ${strength.score >= 3 ? 'w-1/3' : 'w-0'}`}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Confirm New Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-type new password..."
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-mono text-xs focus:ring-1 focus:ring-slate-900"
                />
              </div>

              {passwordError && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600 mt-0.5" />
                  <span>{passwordError}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={isChangingPassword || !currentPassword || !newPassword || !confirmPassword}
                className="w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white font-bold rounded-xl shadow-xs transition-all flex items-center justify-center gap-2"
              >
                {isChangingPassword ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Deriving Salt & Hashing...</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Save & Deploy New Password</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Quick Security Recommendations */}
          <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-5 space-y-2">
            <h4 className="font-bold text-amber-900 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-amber-600" /> Security Recommendations
            </h4>
            <ul className="list-disc list-inside space-y-1 text-amber-800 text-[11px] leading-relaxed">
              <li>Always change the default password (<code className="bg-amber-100 px-1 rounded font-mono">shivaay@admin2026</code>) before sharing the live link.</li>
              <li>Use a password with a mix of symbols, numbers, and upper/lower case letters.</li>
              <li>Use the <strong>Lock Panel Now</strong> button whenever leaving your workstation.</li>
            </ul>
          </div>
        </div>

        {/* Right Column: Security Audit Trail & Access Logs */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-slate-700" />
                <h3 className="font-bold text-sm text-slate-900">Security Audit Trail & Access Logs</h3>
              </div>

              {auditLogs.length > 0 && (
                <button
                  onClick={handleClearLogs}
                  className="text-xs text-slate-400 hover:text-rose-600 font-semibold flex items-center gap-1 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Clear Logs</span>
                </button>
              )}
            </div>

            <p className="text-slate-500 text-[11px]">
              Every administrative login, failed attempt, session revocation, and security mutation is recorded server-side for compliance.
            </p>

            {/* Logs List */}
            <div className="space-y-2.5 max-h-[460px] overflow-y-auto pr-1">
              {auditLogs.length === 0 ? (
                <div className="text-center py-10 text-slate-400 text-xs">
                  No security events recorded yet.
                </div>
              ) : (
                auditLogs.map((log) => {
                  const isSuccess = log.type === 'LOGIN_SUCCESS' || log.type === 'PASSWORD_CHANGED';
                  const isCritical = log.type === 'BRUTE_FORCE_BLOCKED' || log.severity === 'critical';
                  const isWarning = log.type === 'LOGIN_FAILED' || log.type === 'UNAUTHORIZED_ACCESS';

                  return (
                    <div
                      key={log.id}
                      className={`p-3 rounded-xl border text-xs transition-all ${
                        isCritical
                          ? 'bg-rose-50 border-rose-200 text-rose-950'
                          : isWarning
                          ? 'bg-amber-50 border-amber-200 text-amber-950'
                          : isSuccess
                          ? 'bg-emerald-50/60 border-emerald-200 text-emerald-950'
                          : 'bg-slate-50 border-slate-200 text-slate-800'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <div className="flex items-center gap-2">
                          <span
                            className={`px-2 py-0.5 rounded-full font-mono text-[9px] font-bold ${
                              isCritical
                                ? 'bg-rose-200 text-rose-900'
                                : isWarning
                                ? 'bg-amber-200 text-amber-900'
                                : isSuccess
                                ? 'bg-emerald-200 text-emerald-900'
                                : 'bg-slate-200 text-slate-700'
                            }`}
                          >
                            {log.type}
                          </span>
                          <span className="font-mono text-[10px] text-slate-500">
                            IP: {log.ip}
                          </span>
                        </div>

                        <span className="text-[10px] text-slate-400 font-mono">
                          {new Date(log.timestamp).toLocaleTimeString('en-IN', {
                            hour: '2-digit',
                            minute: '2-digit',
                            second: '2-digit',
                          })}
                        </span>
                      </div>

                      <p className="text-[11px] font-medium leading-relaxed">{log.details}</p>

                      {log.userAgent && (
                        <p className="text-[9px] text-slate-400 truncate mt-1 font-mono">
                          Client: {log.userAgent}
                        </p>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
