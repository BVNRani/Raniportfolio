// src/pages/LoginPage.jsx
import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { GraduationCap, LogIn, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';

export default function LoginPage({ onCancel }) {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) return toast.error('Please enter email and password');
    setLoading(true);
    try {
      await login(email, password);
      toast.success('Welcome back, Dr. Rani!');
    } catch (err) {
      toast.error('Invalid credentials. Please check your email and password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      {/* Background decorative elements */}
      <div style={{ position: 'fixed', top: '10%', left: '5%', width: 200, height: 200, borderRadius: '50%', background: 'rgba(180,140,60,0.06)', pointerEvents: 'none' }} />
      <div style={{ position: 'fixed', bottom: '15%', right: '8%', width: 300, height: 300, borderRadius: '50%', background: 'rgba(30,58,122,0.4)', pointerEvents: 'none' }} />

      <div className="login-card">
        {onCancel && (
          <button onClick={onCancel}
            style={{ display:'flex', alignItems:'center', gap:6, fontSize:13, color:'#A09890', background:'transparent', border:'none', cursor:'pointer', padding:'0 0 20px', fontWeight:600 }}>
            <ArrowLeft size={14} /> Back to Portfolio
          </button>
        )}
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <div style={{
            width: 64, height: 64, borderRadius: 16,
            background: 'linear-gradient(135deg, #0A1F44, #1E3A7A)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 20px',
            boxShadow: '0 8px 24px rgba(10,31,68,0.2)'
          }}>
            <GraduationCap size={32} color="#D4AF37" />
          </div>
          <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 28, fontWeight: 700, color: '#0A1F44', marginBottom: 6 }}>
            Academic Portfolio
          </h1>
          <p style={{ color: '#A09890', fontSize: 14 }}>Dr. Venkata Naga Rani Bandaru</p>
          <p style={{ color: '#A09890', fontSize: 13 }}>Vishnu Institute of Technology</p>
        </div>

        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              className="form-input"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="your@email.com"
              autoComplete="email"
            />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              className="form-input"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete="current-password"
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', justifyContent: 'center', padding: '13px 20px', fontSize: 15, marginTop: 8 }}
            disabled={loading}
          >
            <LogIn size={17} />
            {loading ? 'Signing in…' : 'Sign In to Portfolio'}
          </button>
        </form>

        <div style={{ marginTop: 28, padding: 16, background: '#F8F7F4', borderRadius: 10, border: '1px solid #E2E0DC' }}>
          <p style={{ fontSize: 12, color: '#A09890', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 8 }}>Setup Required</p>
          <p style={{ fontSize: 12.5, color: '#6A6560', lineHeight: 1.6 }}>
            1. Create a project at <code style={{ background: '#E2E0DC', padding: '1px 4px', borderRadius: 4 }}>supabase.com</code><br />
            2. Add <code style={{ background: '#E2E0DC', padding: '1px 4px', borderRadius: 4 }}>VITE_SUPABASE_URL</code> and <code style={{ background: '#E2E0DC', padding: '1px 4px', borderRadius: 4 }}>VITE_SUPABASE_ANON_KEY</code> to <code style={{ background: '#E2E0DC', padding: '1px 4px', borderRadius: 4 }}>.env</code><br />
            3. Create a user in Supabase → Authentication → Users
          </p>
        </div>
      </div>
    </div>
  );
}
