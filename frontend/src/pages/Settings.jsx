import React, { useState } from 'react';
import { 
  User, Bell, Shield, Eye, Palette, 
  Globe, HelpCircle, LogOut, ChevronRight,
  Camera, Check, Save
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Settings = () => {
  const { user, logout } = useAuth();
  const [success, setSuccess] = useState(false);

  const handleSave = () => {
    setSuccess(true);
    setTimeout(() => setSuccess(false), 2000);
  };

  const sections = [
    { 
      id: 'profile', icon: User, label: 'Account Profile', 
      desc: 'Update your personal info and role details.' 
    },
    { 
      id: 'notifications', icon: Bell, label: 'Notification Preferences', 
      desc: 'Manage how you receive alerts and reports.' 
    },
    { 
      id: 'security', icon: Shield, label: 'Security & Privacy', 
      desc: 'Update password and authentication settings.' 
    },
    { 
      id: 'appearance', icon: Palette, label: 'Display & Appearance', 
      desc: 'Choose your theme and interface layout.' 
    },
  ];

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', display: 'flex', gap: '3rem' }}>
      
      {/* Sidebar Nav */}
      <div style={{ width: '280px', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <h1 style={{ fontSize: '1.8rem', color: 'var(--primary-blue)', marginBottom: '1.5rem', fontWeight: 800 }}>Settings</h1>
        
        {sections.map((sec) => (
          <button 
            key={sec.id}
            style={{
              display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem 1.25rem',
              borderRadius: '12px', border: 'none', background: sec.id === 'profile' ? 'var(--secondary-bg)' : 'transparent',
              color: sec.id === 'profile' ? 'var(--primary-blue)' : 'var(--text-light)',
              fontWeight: 600, textAlign: 'left', transition: 'all 0.2s', cursor: 'pointer'
            }}
          >
            <sec.icon size={20} />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '0.9rem' }}>{sec.label}</div>
            </div>
            <ChevronRight size={16} opacity={0.5} />
          </button>
        ))}

        <hr style={{ margin: '1.5rem 0', border: 'none', borderTop: '1px solid var(--border-color)' }} />
        
        <button 
          onClick={logout}
          style={{
            display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.75rem 1.25rem',
            color: '#ef4444', fontWeight: 600, background: 'transparent', border: 'none', cursor: 'pointer'
          }}
        >
          <LogOut size={20} />
          <span>Sign Out</span>
        </button>
      </div>

      {/* Main Content Area */}
      <div style={{ flex: 1 }}>
        <div className="card" style={{ padding: '2.5rem' }}>
          
          <div style={{ marginBottom: '2.5rem', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <div style={{ position: 'relative' }}>
              <div style={{ width: '100px', height: '100px', borderRadius: '50%', background: 'var(--primary-blue)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '2rem', fontWeight: 800 }}>
                {user?.user_metadata?.name?.charAt(0) || 'U'}
              </div>
              <button style={{ position: 'absolute', bottom: 4, right: 4, width: '32px', height: '32px', borderRadius: '50%', background: 'white', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: 'var(--shadow-sm)' }}>
                <Camera size={16} color="var(--primary-blue)" />
              </button>
            </div>
            <div>
              <h2 style={{ fontSize: '1.4rem', color: 'var(--text-dark)', marginBottom: '0.25rem' }}>{user?.user_metadata?.name || 'User Profile'}</h2>
              <p style={{ color: 'var(--text-light)', fontSize: '0.9rem' }}>{user?.email}</p>
              <span className="pill" style={{ marginTop: '0.75rem', display: 'inline-block', textTransform: 'uppercase' }}>{user?.user_metadata?.role || 'Guest'}</span>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              <div className="form-group">
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-light)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Full Name</label>
                <input type="text" defaultValue={user?.user_metadata?.name} style={{ width: '100%', padding: '0.875rem', borderRadius: '10px', border: '1px solid var(--border-color)', background: '#f8fafc' }} />
              </div>
              <div className="form-group">
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-light)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Professional Title</label>
                <input type="text" defaultValue={user?.user_metadata?.role === 'counselor' ? 'Senior Clinical Counselor' : 'Student'} style={{ width: '100%', padding: '0.875rem', borderRadius: '10px', border: '1px solid var(--border-color)', background: '#f8fafc' }} />
              </div>
            </div>

            <div className="form-group">
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-light)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Bio / Clinic Note</label>
              <textarea rows={4} style={{ width: '100%', padding: '0.875rem', borderRadius: '10px', border: '1px solid var(--border-color)', background: '#f8fafc', resize: 'none' }} placeholder="Write a short description for your public profile..." />
            </div>

            <hr style={{ border: 'none', borderTop: '1px solid var(--border-color)' }} />

            <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '1rem' }}>
              {success && (
                <span style={{ color: '#10b981', fontSize: '0.85rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Check size={16} /> All changes saved successfully
                </span>
              )}
              <button 
                onClick={handleSave}
                style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.75rem 2rem', borderRadius: '10px', background: 'var(--primary-blue)', color: 'white', fontWeight: 700, border: 'none', cursor: 'pointer' }}
              >
                <Save size={18} /> Save Changes
              </button>
            </div>
          </div>

        </div>

        <div className="card" style={{ marginTop: '1.5rem', background: '#fef2f2', border: '1px solid #fee2e2' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
            <Globe size={20} color="#ef4444" />
            <div>
              <h4 style={{ color: '#991b1b', marginBottom: '0.25rem' }}>Language & Region</h4>
              <p style={{ fontSize: '0.8rem', color: '#b91c1c', opacity: 0.8 }}>Your profile is currently set to English (UK) and GMT+1 timezone.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
