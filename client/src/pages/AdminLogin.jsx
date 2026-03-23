import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AdminLogin({ dark, C }) {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simple admin check - in production, this should call API
    if (credentials.username === 'admin' && credentials.password === 'codingworld123') {
      localStorage.setItem('adminToken', 'true');
      navigate('/admin/dashboard');
    } else {
      setError('Invalid credentials');
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: C.bg,
      padding: '20px'
    }}>
      <div style={{
        maxWidth: 400,
        width: '100%',
        background: C.card,
        border: `1px solid ${C.border}`,
        borderRadius: 20,
        padding: 40,
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: 30 }}>
          <div style={{
            width: 60,
            height: 60,
            borderRadius: 15,
            background: 'linear-gradient(135deg,#00e5ff,#bf5fff)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 24,
            margin: '0 auto 15px',
            color: '#07071a'
          }}>
            🔐
          </div>
          <h2 style={{ color: C.text, marginBottom: 5 }}>Admin Login</h2>
          <p style={{ color: C.muted, fontSize: 13 }}>Enter your credentials to access dashboard</p>
        </div>

        {error && (
          <div style={{
            background: '#ff6b6b22',
            border: '1px solid #ff6b6b44',
            color: '#ff6b6b',
            padding: 10,
            borderRadius: 8,
            fontSize: 13,
            marginBottom: 20,
            textAlign: 'center'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 20 }}>
            <label style={{
              display: 'block',
              fontSize: 12,
              fontWeight: 700,
              color: C.muted,
              marginBottom: 6,
              letterSpacing: '0.5px'
            }}>
              USERNAME
            </label>
            <input
              type="text"
              value={credentials.username}
              onChange={e => setCredentials({ ...credentials, username: e.target.value })}
              style={{
                width: '100%',
                background: dark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)',
                border: `1px solid ${C.border}`,
                borderRadius: 10,
                padding: '12px 15px',
                fontSize: 14,
                color: C.text,
                outline: 'none'
              }}
            />
          </div>

          <div style={{ marginBottom: 25 }}>
            <label style={{
              display: 'block',
              fontSize: 12,
              fontWeight: 700,
              color: C.muted,
              marginBottom: 6,
              letterSpacing: '0.5px'
            }}>
              PASSWORD
            </label>
            <input
              type="password"
              value={credentials.password}
              onChange={e => setCredentials({ ...credentials, password: e.target.value })}
              style={{
                width: '100%',
                background: dark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)',
                border: `1px solid ${C.border}`,
                borderRadius: 10,
                padding: '12px 15px',
                fontSize: 14,
                color: C.text,
                outline: 'none'
              }}
            />
          </div>

          <button
            type="submit"
            style={{
              width: '100%',
              background: 'linear-gradient(135deg,#00e5ff,#0095ff)',
              border: 'none',
              borderRadius: 10,
              padding: '14px',
              fontWeight: 700,
              fontSize: 14,
              color: '#07071a',
              cursor: 'pointer'
            }}
          >
            Login to Dashboard
          </button>
        </form>
      </div>
    </div>
  );
}