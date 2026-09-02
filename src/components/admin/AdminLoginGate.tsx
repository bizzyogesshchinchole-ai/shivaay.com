import React, { useState, useEffect } from 'react';
import { authService, SecurityStatus } from '../../services/authService';
import { BrandLogo } from '../common/BrandLogo';
import {
  ShieldCheck,
  Lock,
  Eye,
  EyeOff,
  AlertTriangle,
  ArrowLeft,
  KeyRound,
  CheckCircle2,
  Cpu,
  Server,
  Zap,
  Clock,
  RefreshCw,
} from 'lucide-react';

interface AdminLoginGateProps {
  onAuthenticated: () => void;
  onReturnToStore: () => void;
}

export const AdminLoginGate: React.FC<AdminLoginGateProps> = ({
  onAuthenticated,
  onReturnToStore,
}) => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberDevice, setRememberDevice] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [capsLockActive, setCapsLockActive] = useState(false);
  const [securityStatus, setSecurityStatus] = useState<SecurityStatus | null>(null);
  const [lockoutCountdown, setLockoutCountdown] = useState<number>(0);

  // Load server security status on mount
  useEffect(() => {
    let isMounted = true;
    const fetchStatus = async () => {
      const status = await authService.getStatus();
      if (isMounted) {
        setSecurityStatus(status);
        if (status.isLocked && status.remainingLockoutSec > 0) {
          setLockoutCountdown(status.remainingLockoutSec);
        }
      }
    };
    fetchStatus();
    return () => {
      isMounted = false;
    };
  }, []);

  // Lockout countdown timer
  useEffect(() => {
    if (lockoutCountdown <= 0) return;
    const timer = setInterval(() => {
      setLockoutCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          // Refresh status
          authService.getStatus().then((st) => setSecurityStatus(st));
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [lockoutCountdown]);

  // Caps lock detection
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.getModifierState && e.getModifierState('CapsLock')) {
      setCapsLockActive(true);
    } else {
      setCapsLockActive(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim() || lockoutCountdown > 0) return;

    setIsLoading(true);
    setErrorMessage(null);

    const result = await authService.login(password, rememberDevice);
    setIsLoading(false);

    if (result.success) {
      onAuthenticated();
    } else {
      setErrorMessage(result.message);
      if (result.locked && result.remainingLockoutSec) {
        setLockoutCountdown(result.remainingLockoutSec);
      }
      // Re-fetch security parameters
      const status = await authService.getStatus();
      setSecurityStatus(status);
    }
  };

  // Quick fill helper for review
  const handleUseDemoKey = () => {
    setPassword('shivaay@admin2026');
    setErrorMessage(null);
  };

  const isLockedOut = lockoutCountdown > 0;

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden text-slate-100">
      {/* Background Decorative Ambient Glows */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md relative z-10 space-y-6">
        {/* Back Link */}
        <div className="flex items-center justify-between">
          <button
            onClick={onReturnToStore}
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Storefront</span>
          </button>

          <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-900/80 border border-slate-800 text-[10px] font-mono text-emerald-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>TLS-1.3 Encrypted</span>
          </div>
        </div>

        {/* Security Card */}
        <div className="bg-slate-900/90 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
          {/* Brand Logo & Header Icon */}
          <div className="flex justify-center pb-2">
            <BrandLogo size="md" variant="light" />
          </div>

          <div className="text-center space-y-2 border-t border-slate-800/80 pt-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-slate-800 to-slate-700 border border-slate-700/80 flex items-center justify-center mx-auto text-emerald-400 shadow-inner">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h1 className="text-xl font-bold text-white tracking-tight">Admin Security Gate</h1>
            <p className="text-xs text-slate-400 max-w-xs mx-auto">
              Protected by server-side PBKDF2 salt hashing, constant-time verification & HMAC session validation.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-slate-400" />
                  <span>Master Administrator Password</span>
                </label>
                {capsLockActive && (
                  <span className="text-[10px] text-amber-400 font-semibold flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" /> Caps Lock On
                  </span>
                )}
              </div>

              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={handleKeyDown}
                  disabled={isLockedOut || isLoading}
                  placeholder="Enter administrator password..."
                  className="w-full pl-3.5 pr-10 py-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all font-mono disabled:opacity-50 disabled:cursor-not-allowed"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-slate-500 hover:text-slate-300 focus:outline-none"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember Device Option */}
            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center gap-2 text-slate-400 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberDevice}
                  onChange={(e) => setRememberDevice(e.target.checked)}
                  disabled={isLockedOut}
                  className="rounded bg-slate-950 border-slate-800 text-emerald-500 focus:ring-0 focus:ring-offset-0"
                />
                <span>Remember this secure device (24h)</span>
              </label>
            </div>

            {/* Error Message & Lockout Notice */}
            {errorMessage && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            {isLockedOut && (
              <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs space-y-1.5">
                <div className="flex items-center gap-2 font-bold">
                  <Clock className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Brute-Force Rate Limiter Active</span>
                </div>
                <p className="text-[11px] text-amber-200/80">
                  Multiple consecutive invalid attempts detected. Access is temporarily locked for safety.
                </p>
                <div className="font-mono text-sm font-bold text-amber-400 pt-1">
                  Unlocking in: {Math.floor(lockoutCountdown / 60)}m {lockoutCountdown % 60}s
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading || isLockedOut || !password.trim()}
              className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-xs shadow-lg shadow-emerald-950 transition-all flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Verifying Cryptographic Credentials...</span>
                </>
              ) : isLockedOut ? (
                <>
                  <Lock className="w-4 h-4" />
                  <span>Rate Limited (Locked)</span>
                </>
              ) : (
                <>
                  <KeyRound className="w-4 h-4" />
                  <span>Authenticate & Unlock Admin Panel</span>
                </>
              )}
            </button>
          </form>

          {/* Demo Helper Banner */}
          <div className="pt-2 border-t border-slate-800/80">
            <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800 flex items-center justify-between text-[11px]">
              <div className="text-slate-400">
                <span className="font-semibold text-slate-300">Default Demo Key:</span>{' '}
                <code className="font-mono text-emerald-400 px-1 py-0.5 bg-slate-900 rounded">
                  shivaay@admin2026
                </code>
              </div>
              <button
                type="button"
                onClick={handleUseDemoKey}
                className="text-xs font-bold text-emerald-400 hover:underline shrink-0 ml-2"
              >
                Auto Fill
              </button>
            </div>
            <p className="text-[10px] text-slate-500 mt-1.5 text-center">
              You can change this password at any time inside <span className="text-slate-400 font-semibold">Store Settings &rarr; Security</span>.
            </p>
          </div>
        </div>

        {/* Security Posture Specs */}
        <div className="grid grid-cols-3 gap-2 text-center text-[10px] text-slate-400 font-medium">
          <div className="p-2 rounded-xl bg-slate-900/60 border border-slate-800/60">
            <Server className="w-3.5 h-3.5 text-emerald-400 mx-auto mb-1" />
            <span>PBKDF2-SHA512</span>
          </div>
          <div className="p-2 rounded-xl bg-slate-900/60 border border-slate-800/60">
            <Cpu className="w-3.5 h-3.5 text-blue-400 mx-auto mb-1" />
            <span>Timing-Safe Match</span>
          </div>
          <div className="p-2 rounded-xl bg-slate-900/60 border border-slate-800/60">
            <Zap className="w-3.5 h-3.5 text-amber-400 mx-auto mb-1" />
            <span>Anti Brute-Force</span>
          </div>
        </div>
      </div>
    </div>
  );
};
