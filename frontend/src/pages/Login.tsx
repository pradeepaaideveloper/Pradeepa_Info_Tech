import React, { useState } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { authEndpoints } from '../services/endpoints';
import { Mail, Lock, AlertCircle, Loader } from 'lucide-react';

const Login: React.FC = () => {
  const { t } = useTranslation();
  const { login } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isSessionExpired = searchParams.get('expired') === 'true';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await authEndpoints.login({ email, password });
      const { access_token, user } = response.data;
      
      // Save session in AuthContext
      login(access_token, user);
      
      // Navigate based on user role
      if (user.role === 'admin') {
        navigate('/admin');
      } else if (user.role === 'cashier') {
        navigate('/pos');
      } else {
        navigate('/');
      }
    } catch (err: any) {
      console.error('Login error:', err);
      const errMsg = err.response?.data?.error?.message || 'Login failed. Please verify credentials.';
      setError(errMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto my-12 animate-fade-in-up">
      <div className="glassmorphism p-8 rounded-3xl shadow-2xl relative overflow-hidden">
        {/* Glow decorative blur */}
        <div className="absolute -top-10 -right-10 w-24 h-24 bg-sky-500/10 rounded-full blur-2xl"></div>
        
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold font-display text-slate-100">
            {t('login.title', 'Welcome Back')}
          </h2>
          <p className="text-slate-400 text-sm mt-2">
            {t('login.subtitle', 'Sign in to access courses and e-commerce services')}
          </p>
        </div>

        {isSessionExpired && (
          <div className="flex items-center gap-2 p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-xs text-amber-400 mb-6">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>Session expired. Please log in again.</span>
          </div>
        )}

        {error && (
          <div className="flex items-center gap-2 p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl text-sm text-rose-400 mb-6 animate-pulse-subtle">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {/* Email Field */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
              {t('login.email', 'Email Address')}
            </label>
            <div className="relative">
              <Mail className="w-5 h-5 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full pl-11 pr-4 py-3 bg-slate-900/60 border border-slate-700/80 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-all text-sm"
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                {t('login.password', 'Password')}
              </label>
              <Link to="/forgot-password" className="text-xs text-sky-400 hover:text-sky-300">
                {t('login.forgot_password', 'Forgot password?')}
              </Link>
            </div>
            <div className="relative">
              <Lock className="w-5 h-5 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-11 pr-4 py-3 bg-slate-900/60 border border-slate-700/80 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-all text-sm"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 bg-sky-600 hover:bg-sky-500 disabled:bg-sky-700 disabled:opacity-50 text-white rounded-xl font-bold shadow-lg shadow-sky-600/20 hover:shadow-sky-500/30 transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
          >
            {isLoading ? (
              <>
                <Loader className="w-4 h-4 animate-spin" />
                <span>Logging In...</span>
              </>
            ) : (
              <span>Sign In</span>
            )}
          </button>
        </form>

        <div className="text-center mt-8 pt-6 border-t border-slate-800 text-sm text-slate-400">
          <span>{t('login.no_account', "Don't have an account?")} </span>
          <Link to="/register" className="text-sky-400 hover:text-sky-300 font-bold">
            {t('login.register_here', 'Create Account')}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
