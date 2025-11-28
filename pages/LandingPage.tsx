import React, { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { Button } from '../components/Button';
import { useNavigate } from 'react-router-dom';
import { Play, TrendingUp, ShieldCheck, Sparkles, AlertCircle } from 'lucide-react';

export const LandingPage = () => {
  const { login, signup } = useApp();
  const navigate = useNavigate();
  const [mode, setMode] = useState<'signin' | 'signup' | 'forgot'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setLoading(true);

    try {
      if (mode === 'forgot') {
        // Mock reset for now or implement Supabase resetPasswordForEmail
        setMessage("If an account exists, a password reset link has been sent.");
        setMode('signin');
      } else if (mode === 'signup') {
        const { error } = await signup(email, password);
        if (error) throw error;
        setMessage("Account created! Please check your email to confirm.");
        setMode('signin');
      } else {
        const { error } = await login(email, password);
        if (error) throw error;
        navigate('/explore');
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center bg-vista-bg overflow-hidden font-sans">
      {/* Dynamic Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-rose-600/20 rounded-full blur-[128px] animate-blob mix-blend-screen" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-violet-600/20 rounded-full blur-[128px] animate-blob animation-delay-2000 mix-blend-screen" />
        <div className="absolute top-[20%] right-[20%] w-[400px] h-[400px] bg-blue-600/10 rounded-full blur-[128px] animate-blob animation-delay-4000 mix-blend-screen" />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/noise.png')] opacity-[0.05]"></div>
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 grid lg:grid-cols-12 gap-12 lg:gap-20 items-center">
        {/* Left: Hero Copy */}
        <div className="lg:col-span-7 space-y-8 animate-slide-up">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm">
            <Sparkles size={14} className="text-yellow-400" />
            <span className="text-xs font-semibold tracking-wide text-slate-300 uppercase">AI-Powered Discovery</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold leading-[1.1] text-white tracking-tight">
            Cinema tailored <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 via-fuchsia-500 to-indigo-500 animate-gradient-x">
              to your soul.
            </span>
          </h1>

          <p className="text-lg md:text-xl text-slate-400 max-w-xl leading-relaxed">
            Stop scrolling, start watching. Our Gemini AI analyzes thousands of data points to predict your next favorite film with uncanny accuracy.
          </p>

          <div className="flex flex-wrap gap-4 pt-4">
             <div className="flex-1 min-w-[140px] p-5 rounded-2xl bg-white/5 border border-white/5 backdrop-blur-md hover:bg-white/10 transition-colors group">
                <TrendingUp className="text-rose-500 mb-3 group-hover:scale-110 transition-transform" size={28} />
                <h3 className="font-bold text-white mb-1">Smart Curation</h3>
                <p className="text-sm text-slate-500 leading-snug">Deep learning recommendations</p>
             </div>
             <div className="flex-1 min-w-[140px] p-5 rounded-2xl bg-white/5 border border-white/5 backdrop-blur-md hover:bg-white/10 transition-colors group">
                <ShieldCheck className="text-violet-500 mb-3 group-hover:scale-110 transition-transform" size={28} />
                <h3 className="font-bold text-white mb-1">Privacy First</h3>
                <p className="text-sm text-slate-500 leading-snug">Your data stays yours</p>
             </div>
          </div>
        </div>

        {/* Right: Glassmorphic Auth Form */}
        <div className="lg:col-span-5 w-full">
          <div className="glass p-8 md:p-10 rounded-3xl shadow-2xl animate-fade-in animation-delay-500">
            <div className="text-center mb-8">
              <div className="w-12 h-12 bg-gradient-to-br from-rose-500 to-violet-600 rounded-xl mx-auto flex items-center justify-center mb-4 shadow-lg shadow-rose-500/20">
                <Play className="text-white fill-white ml-1" size={20} />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">
                {mode === 'signin' ? 'Welcome Back' : mode === 'signup' ? 'Join CineVista' : 'Reset Access'}
              </h2>
              <p className="text-slate-400 text-sm">
                {mode === 'signin' ? 'Sign in to access your personal watchlist.' : 
                 mode === 'signup' ? 'Create an account to start your journey.' : 
                 'Enter your email to recover your account.'}
              </p>
            </div>

            {error && (
              <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center gap-2 text-red-400 text-sm">
                <AlertCircle size={16} />
                {error}
              </div>
            )}

            {message && (
              <div className="mb-4 p-3 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center gap-2 text-green-400 text-sm">
                <ShieldCheck size={16} />
                {message}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider ml-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-5 py-3.5 text-white placeholder-slate-600 focus:ring-2 focus:ring-rose-500/50 focus:border-rose-500 outline-none transition-all"
                  placeholder="name@example.com"
                />
              </div>
              
              {mode !== 'forgot' && (
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider ml-1">Password</label>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-5 py-3.5 text-white placeholder-slate-600 focus:ring-2 focus:ring-rose-500/50 focus:border-rose-500 outline-none transition-all"
                    placeholder="••••••••"
                  />
                </div>
              )}

              <Button type="submit" className="w-full mt-2 shadow-lg shadow-rose-600/20" size="lg" isLoading={loading}>
                {mode === 'signin' ? 'Sign In' : mode === 'signup' ? 'Create Account' : 'Send Reset Link'}
              </Button>
            </form>

            <div className="mt-8 pt-6 border-t border-white/5 flex flex-col items-center space-y-4 text-sm">
              {mode === 'signin' && (
                <>
                  <button onClick={() => setMode('forgot')} className="text-slate-400 hover:text-white transition-colors">
                    Forgot your password?
                  </button>
                  <div className="text-slate-500">
                    Don't have an account? <button onClick={() => setMode('signup')} className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-violet-400 font-bold hover:opacity-80 transition-opacity ml-1">Sign up</button>
                  </div>
                </>
              )}
              {mode === 'signup' && (
                <div className="text-slate-500">
                  Already have an account? <button onClick={() => setMode('signin')} className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-violet-400 font-bold hover:opacity-80 transition-opacity ml-1">Sign in</button>
                </div>
              )}
               {mode === 'forgot' && (
                <button onClick={() => setMode('signin')} className="text-slate-400 hover:text-white transition-colors">Back to Sign In</button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};