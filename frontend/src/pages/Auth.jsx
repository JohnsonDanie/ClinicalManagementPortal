import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { ShieldCheck } from 'lucide-react';

const Auth = () => {
  const [error, setError] = useState(null);
  const [isRedirecting, setIsRedirecting] = useState(true);
  const { signInWithCampusOne } = useAuth();

  const handleSSO = async () => {
    setError(null);
    setIsRedirecting(true);
    try {
      await signInWithCampusOne();
    } catch (err) {
      setError(err.message || 'Campus One SSO connection failed. Please check your connection and try again.');
      setIsRedirecting(false);
    }
  };

  useEffect(() => {
    handleSSO();
  }, []);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--secondary-bg)', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
      <div className="card" style={{ width: '100%', maxWidth: '450px', padding: '3rem 2.5rem', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem' }}>
        
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
          <div style={{ 
            width: '64px', height: '64px', borderRadius: '16px', 
            backgroundColor: 'var(--accent-light-blue)', color: 'var(--primary-blue)', 
            display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem'
          }}>
            <ShieldCheck size={36} />
          </div>
          <h1 style={{ fontSize: '1.75rem', color: 'var(--primary-blue)', fontWeight: 700, margin: 0 }}>Clinical Portal</h1>
          <p style={{ color: 'var(--text-light)', fontSize: '0.95rem', margin: 0 }}>Nile University Wellness Services</p>
        </div>

        {isRedirecting ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', marginTop: '1rem' }}>
            <div style={{ 
              width: '40px', height: '40px', borderRadius: '50%', 
              border: '3px solid var(--border-color)', borderTopColor: 'var(--primary-blue)', 
              animation: 'spin 1s linear infinite' 
            }} />
            <p style={{ color: 'var(--text-light)', fontSize: '0.9rem', fontWeight: 500 }}>Connecting to Campus One SSO...</p>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', width: '100%', marginTop: '1rem' }}>
            {error && (
              <div style={{
                padding: '1rem',
                background: '#fee2e2',
                border: '1px solid #fca5a5',
                borderRadius: '8px',
                color: '#b91c1c',
                fontSize: '0.85rem',
                textAlign: 'center',
                lineHeight: 1.5
              }}>
                {error}
              </div>
            )}
            
            <button 
              type="button" 
              onClick={handleSSO}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.75rem',
                padding: '0.75rem',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid #1e499d',
                backgroundColor: '#1e499d',
                color: 'white',
                fontWeight: 600,
                fontSize: '0.95rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#163573'}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#1e499d'}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 13c0 5-3.5 7.5-7.66 9.7a1 1 0 0 1-.68 0C7.5 20.5 4 18 4 13V6a1 1 0 0 1 .76-.97l8-2a1 1 0 0 1 .48 0l8 2A1 1 0 0 1 20 6z" />
                <path d="m9 12 2 2 4-4" />
              </svg>
              Retry Campus One Sign In
            </button>
          </div>
        )}

        <div style={{ borderTop: '1px solid var(--border-color)', width: '100%', paddingTop: '1.5rem', marginTop: '1rem' }}>
          <p style={{ color: 'var(--text-light)', fontSize: '0.8rem', margin: 0 }}>
            Secure single sign-on provided by Campus One
          </p>
        </div>
      </div>
    </div>
  );
};

export default Auth;
