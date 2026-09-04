import React, { useState } from 'react';
import { 
  Lock, 
  Eye, 
  EyeOff, 
  X, 
  ShieldCheck, 
  AlertCircle, 
  Loader2, 
  ArrowRight,
  Building2
} from 'lucide-react';
import { loginAdmin } from '../services/adminAuthService';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: () => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
}) => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) {
      setErrorMessage('Please enter your admin password.');
      return;
    }

    setIsLoading(true);
    setErrorMessage('');

    try {
      const result = await loginAdmin(password.trim());
      setIsLoading(false);

      if (result.success) {
        setPassword('');
        setErrorMessage('');
        onLoginSuccess();
      } else {
        setErrorMessage(result.error || 'Incorrect password. Please try again.');
      }
    } catch {
      setIsLoading(false);
      setErrorMessage('Connection error. Please try again.');
    }
  };

  const handleClose = () => {
    setPassword('');
    setErrorMessage('');
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-150"
      id="admin-login-modal-backdrop"
    >
      <div 
        className="relative w-full max-w-md rounded-2xl bg-[#001226] border border-[#C5A028]/50 p-6 sm:p-8 shadow-2xl shadow-black overflow-hidden"
        onClick={(e) => e.stopPropagation()}
        id="admin-login-card"
      >
        {/* Top Gold Accent Bar */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#C5A028] to-transparent" />

        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-2 rounded-lg bg-[#001A33] text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer border border-slate-700/60"
          aria-label="Close modal"
          id="admin-login-close-btn"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Icon */}
        <div className="w-14 h-14 rounded-full bg-[#001A33] border-2 border-[#C5A028] flex items-center justify-center text-[#C5A028] mx-auto mb-4 shadow-lg shadow-black/80">
          <Lock className="w-6 h-6 text-[#C5A028]" />
        </div>

        {/* Title */}
        <div className="text-center space-y-1.5 mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#001A33] border border-[#C5A028]/40 text-[#C5A028] text-[10px] font-bold uppercase tracking-wider">
            <ShieldCheck className="w-3.5 h-3.5" />
            Authorized Access Only
          </div>
          <h3 className="font-['Cinzel'] text-xl sm:text-2xl font-bold text-white tracking-tight">
            Admin Portal Login
          </h3>
          <p className="text-xs text-slate-400 max-w-xs mx-auto">
            Please enter your management credentials to access the enquiry records & settings.
          </p>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div 
            className="mb-4 p-3 rounded-lg bg-red-950/80 border border-red-500/50 text-red-300 text-xs flex items-center gap-2.5 animate-in fade-in"
            id="admin-login-error"
          >
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            <span className="font-medium">{errorMessage}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4" id="admin-login-form">
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
              Admin Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                autoFocus
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full px-4 py-3 rounded-lg bg-[#001A33] border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-[#C5A028] text-sm pr-11 transition-colors tracking-wide"
                id="admin-password-input"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-white transition-colors cursor-pointer"
                title={showPassword ? 'Hide password' : 'Show password'}
                id="admin-toggle-password-btn"
                tabIndex={-1}
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4 text-slate-300" />
                ) : (
                  <Eye className="w-4 h-4 text-slate-400" />
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 rounded-lg bg-[#C5A028] hover:bg-[#e0b83e] text-[#001A33] font-bold text-xs uppercase tracking-wider transition-all duration-150 shadow-lg shadow-[#C5A028]/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-2"
            id="admin-login-submit-btn"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Authenticating...</span>
              </span>
            ) : (
              <>
                <span>LOGIN TO ADMIN PORTAL</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </form>

        {/* Corporate Legal Note */}
        <div className="mt-6 pt-4 border-t border-slate-800/80 text-center text-[10px] text-slate-500 flex items-center justify-center gap-1.5">
          <Building2 className="w-3 h-3 text-[#C5A028]" />
          <span>ELITE GROUP – SS CHIT FUNDS • Management Console</span>
        </div>
      </div>
    </div>
  );
};
