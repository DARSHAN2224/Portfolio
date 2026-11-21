'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AdminLogin() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === 'admin123' || password === process.env.NEXT_PUBLIC_ADMIN_PASS) {
      if (typeof window !== 'undefined') {
        localStorage.setItem('isAdmin', 'true');
      }
      router.push('/admin/dashboard');
    } else {
      setError(true);
      setPassword('');
    }
  };

  return (
    <div className="admin-login-wrap" style={{
      minHeight: '100vh',
      backgroundColor: '#0a0f1d',
      color: '#f2f0e9',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'JetBrains Mono, monospace',
      padding: '20px'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '420px',
        padding: '36px',
        backgroundColor: '#111827',
        border: '1px solid rgba(255, 128, 107, 0.4)',
        borderRadius: '16px',
        boxShadow: '0 12px 32px rgba(0,0,0,0.5)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div style={{ fontSize: '32px', marginBottom: '12px' }}>🔒</div>
          <h1 style={{ fontSize: '20px', letterSpacing: '2px', color: '#ff806b', textTransform: 'uppercase', margin: '0 0 8px 0' }}>
            Darshan-OS Core
          </h1>
          <p style={{ fontSize: '11px', color: '#8892b0', margin: 0, textTransform: 'uppercase', letterSpacing: '1px' }}>
            Admin Authorization Required
          </p>
        </div>

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '11px', color: '#a78bfa', marginBottom: '6px', textTransform: 'uppercase' }}>
              Passkey Sequence
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              autoFocus
              style={{
                width: '100%',
                backgroundColor: '#050807',
                border: error ? '1px solid #ff4b4b' : '1px solid rgba(255, 255, 255, 0.15)',
                borderRadius: '8px',
                padding: '12px',
                color: '#ff806b',
                fontFamily: 'inherit',
                fontSize: '16px',
                textAlign: 'center',
                outline: 'none',
                boxSizing: 'border-box'
              }}
            />
          </div>

          {error && (
            <p style={{ color: '#ff4b4b', fontSize: '12px', textAlign: 'center', margin: 0 }}>
              ACCESS DENIED. INCORRECT SEQUENCE.
            </p>
          )}

          <button
            type="submit"
            style={{
              padding: '12px',
              backgroundColor: 'rgba(255, 128, 107, 0.15)',
              border: '1px solid #ff806b',
              color: '#ff806b',
              borderRadius: '8px',
              fontFamily: 'inherit',
              fontWeight: 'bold',
              cursor: 'pointer',
              letterSpacing: '1px',
              textTransform: 'uppercase',
              fontSize: '13px',
              transition: 'all 0.2s'
            }}
          >
            Authenticate
          </button>

          <Link
            href="/"
            style={{
              textAlign: 'center',
              fontSize: '12px',
              color: '#8892b0',
              textDecoration: 'none',
              marginTop: '8px'
            }}
          >
            ← Return to Desktop Safe Mode
          </Link>
        </form>
      </div>
    </div>
  );
}
