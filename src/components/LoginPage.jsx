import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

export default function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login(email, password);
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-mhc-navy flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo / Brand */}
        <div className="text-center mb-8 animate-fade-up">
          <img src="/naiMHC-logo.svg" alt="NAI Merin Hunter Codman" className="h-14 mx-auto mb-3" />
          <h1 className="text-2xl font-display text-white tracking-tight">Fund Dashboard</h1>
          <p className="text-mhc-muted text-sm font-body">Portfolio Analytics</p>
        </div>

        {/* Card */}
        <div className="bg-mhc-card border border-mhc-border rounded-xl p-8">
          <h2 className="text-white text-lg font-semibold mb-6">Sign in to your account</h2>

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-3 mb-4 text-red-400 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-mhc-muted text-sm mb-1.5">Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full bg-mhc-navy border border-mhc-border rounded-lg px-4 py-2.5 text-white placeholder-mhc-muted/50 focus:outline-none focus:border-mhc-accent transition"
                placeholder="you@mhc.com"
                required
              />
            </div>
            <div>
              <label className="block text-mhc-muted text-sm mb-1.5">Password</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full bg-mhc-navy border border-mhc-border rounded-lg px-4 py-2.5 text-white placeholder-mhc-muted/50 focus:outline-none focus:border-mhc-accent transition"
                placeholder="••••••••"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-mhc-accent hover:bg-mhc-accent/90 text-mhc-navy font-semibold rounded-lg py-2.5 transition disabled:opacity-50"
            >
              {loading ? 'Signing in…' : 'Sign In'}
            </button>
          </form>
        </div>

        <p className="text-center text-mhc-muted/60 text-xs mt-6">
          Powered by CRElytic &middot; &copy; {new Date().getFullYear()}
        </p>
      </div>
    </div>
  );
}
