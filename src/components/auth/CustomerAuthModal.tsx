import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { ChakkiIcon } from '../common/BrandLogo';
import {
  X,
  Wheat,
  User,
  Mail,
  Phone,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  ShieldCheck,
  Award,
} from 'lucide-react';
import { INITIAL_CUSTOMERS } from '../../data/initialData';

export const CustomerAuthModal: React.FC = () => {
  const {
    isAuthModalOpen,
    setIsAuthModalOpen,
    authModalMode,
    setAuthModalMode,
    customerLogin,
    customerRegister,
    navigateTo,
  } = useStore();

  const [identifier, setIdentifier] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [dietary, setDietary] = useState<string[]>(['Traditional Whole Wheat']);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  if (!isAuthModalOpen) return null;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier.trim()) {
      setErrorMessage('Please enter your mobile number or email address.');
      return;
    }
    setLoading(true);
    setErrorMessage('');
    const res = await customerLogin(identifier);
    setLoading(false);
    if (res.success) {
      setIsAuthModalOpen(false);
      navigateTo('account');
    } else {
      setErrorMessage(res.message);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !email.trim() || !phone.trim()) {
      setErrorMessage('Please fill in all required fields.');
      return;
    }
    setLoading(true);
    setErrorMessage('');
    const res = await customerRegister({
      fullName,
      email,
      phone,
      dietaryPreferences: dietary,
    });
    setLoading(false);
    if (res.success) {
      setIsAuthModalOpen(false);
      navigateTo('account');
    } else {
      setErrorMessage(res.message);
    }
  };

  const handleSelectDemoUser = async (demoUser: typeof INITIAL_CUSTOMERS[0]) => {
    setLoading(true);
    const res = await customerLogin(demoUser.email);
    setLoading(false);
    if (res.success) {
      setIsAuthModalOpen(false);
      navigateTo('account');
    }
  };

  const toggleDietary = (pref: string) => {
    setDietary((prev) =>
      prev.includes(pref) ? prev.filter((p) => p !== pref) : [...prev, pref]
    );
  };

  const dietaryOptions = [
    'Traditional Whole Wheat',
    'High Fiber Millet Diet',
    'Diabetic-Friendly Rotis',
    'Stone-Ground Coarse',
    'Pure Khapli Wheat',
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div
        className="relative bg-white rounded-3xl shadow-2xl max-w-md w-full border border-slate-200 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Ribbon */}
        <div className="bg-slate-900 px-6 py-6 text-white relative">
          <button
            onClick={() => setIsAuthModalOpen(false)}
            className="absolute top-5 right-5 p-1.5 rounded-full bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-11 h-11 flex items-center justify-center shrink-0">
              <ChakkiIcon />
            </div>
            <div>
              <h3 className="font-bold text-lg text-white font-serif tracking-wide">
                {authModalMode === 'login' ? 'Customer Sign In' : 'Join Shivaay Grain Club'}
              </h3>
              <p className="text-xs text-slate-300">
                {authModalMode === 'login'
                  ? 'Access your fresh flour orders, milling stats & saved addresses'
                  : 'Get freshly milled artisanal flours delivered to your doorstep'}
              </p>
            </div>
          </div>
        </div>

        {/* Form Body */}
        <div className="p-6 space-y-5">
          {errorMessage && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-600"></span>
              <span>{errorMessage}</span>
            </div>
          )}

          {authModalMode === 'login' ? (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Mobile Number or Email
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder="e.g. 9876543210 or name@example.com"
                    required
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400 transition-all font-medium"
                  />
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  Instant login via verified credentials or OTP simulation.
                </p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-2"
              >
                <span>{loading ? 'Authenticating...' : 'Sign In to My Account'}</span>
                <ArrowRight className="w-4 h-4 text-emerald-400" />
              </button>
            </form>
          ) : (
            <form onSubmit={handleRegister} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Siddharth Rao"
                    required
                    className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400"
                  />
                  <User className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Email
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@example.com"
                      required
                      className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/10"
                    />
                    <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Phone Number
                  </label>
                  <div className="relative">
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      required
                      className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/10"
                    />
                    <Phone className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Flour & Dietary Preferences
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {dietaryOptions.map((opt) => {
                    const isSelected = dietary.includes(opt);
                    return (
                      <button
                        type="button"
                        key={opt}
                        onClick={() => toggleDietary(opt)}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold border transition-all ${
                          isSelected
                            ? 'bg-emerald-50 border-emerald-300 text-emerald-800 shadow-sm'
                            : 'bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-300'
                        }`}
                      >
                        {isSelected ? '✓ ' : '+ '}
                        {opt}
                      </button>
                    );
                  })}
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-2 mt-2"
              >
                <span>{loading ? 'Creating Profile...' : 'Register & Start Fresh'}</span>
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              </button>
            </form>
          )}

          {/* Mode Switcher */}
          <div className="text-center pt-2">
            {authModalMode === 'login' ? (
              <p className="text-xs text-slate-500">
                New customer?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setErrorMessage('');
                    setAuthModalMode('register');
                  }}
                  className="font-bold text-slate-900 hover:underline"
                >
                  Create an account
                </button>
              </p>
            ) : (
              <p className="text-xs text-slate-500">
                Already registered?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setErrorMessage('');
                    setAuthModalMode('login');
                  }}
                  className="font-bold text-slate-900 hover:underline"
                >
                  Sign in here
                </button>
              </p>
            )}
          </div>

          {/* Quick Demo Customer Switcher */}
          <div className="pt-4 border-t border-slate-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-500" />
                <span>Instant Demo Profiles</span>
              </span>
              <span className="text-[10px] text-slate-400 font-medium">1-Click Test</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {INITIAL_CUSTOMERS.map((cust) => (
                <button
                  key={cust.id}
                  type="button"
                  onClick={() => handleSelectDemoUser(cust)}
                  className="p-2.5 text-left rounded-xl bg-slate-50 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-200 transition-all group"
                >
                  <p className="text-xs font-bold text-slate-900 group-hover:text-emerald-900 truncate">
                    {cust.fullName}
                  </p>
                  <p className="text-[10px] text-slate-500 truncate">{cust.email}</p>
                  <div className="mt-1 flex items-center gap-1">
                    <Award className="w-2.5 h-2.5 text-amber-600" />
                    <span className="text-[9px] font-semibold text-emerald-700">
                      {cust.loyaltyTier}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="bg-slate-50 px-6 py-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Encrypted local session</span>
          </span>
          <span>Shivaay Agri Products</span>
        </div>
      </div>
    </div>
  );
};
