import React, { useState } from 'react';
import { 
  Bell, CheckCircle2, AlertCircle, Info, 
  Trash2, X, MessageSquare, Calendar
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Notifications = () => {
  const { user } = useAuth();
  const isCounselor = user?.user_metadata?.role === 'counselor';

  const [notifications, setNotifications] = useState([
    { 
      id: 1, 
      type: 'success', 
      title: isCounselor ? 'Session Completed' : 'Appointment Confirmed', 
      message: isCounselor ? 'You have successfully logged the session for Michael Ross.' : 'Your appointment with Dr. Helena Vance on Monday at 10:00 AM is confirmed.',
      time: '1h ago', 
      isRead: false 
    },
    { 
      id: 2, 
      type: 'priority', 
      title: isCounselor ? 'Emergency Assignment' : 'Counselor Assigned', 
      message: isCounselor ? 'An Emergency priority student was auto-assigned to you.' : 'A counselor has been assigned to your walk-in intake. Please wait for contact.', 
      time: '3h ago', 
      isRead: true 
    },
    { 
      id: 3, 
      type: 'info', 
      title: 'Portal Update', 
      message: 'New features have been added to the Digital Queue system.', 
      time: 'Yesterday', 
      isRead: true 
    },
  ]);

  const markAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, isRead: true })));
  };

  const removeNotification = (id) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  const getIcon = (type) => {
    switch(type) {
      case 'success': return <CheckCircle2 size={20} color="#10b981" />;
      case 'priority': return <AlertCircle size={20} color="#ef4444" />;
      case 'info': return <Info size={20} color="#3b82f6" />;
      default: return <Bell size={20} />;
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '2rem', color: 'var(--primary-blue)', marginBottom: '0.4rem' }}>Notifications</h1>
          <p style={{ color: 'var(--text-light)' }}>Stay updated on your clinic activity and assignments.</p>
        </div>
        <button 
          onClick={markAllRead}
          style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--primary-blue)', background: 'transparent', transition: 'opacity 0.2s' }}
          onMouseEnter={e => e.currentTarget.style.opacity = 0.7}
          onMouseLeave={e => e.currentTarget.style.opacity = 1}
        >
          Mark all as read
        </button>
      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: '1rem', borderBottom: '1px solid var(--border-color)' }}>
        <button style={{ paddingBottom: '0.75rem', borderBottom: '2px solid var(--primary-blue)', color: 'var(--primary-blue)', fontWeight: 700, fontSize: '0.9rem' }}>
          All Notifications
        </button>
        <button style={{ paddingBottom: '0.75rem', borderBottom: '2px solid transparent', color: 'var(--text-light)', fontWeight: 500, fontSize: '0.9rem' }}>
          Unread
        </button>
      </div>

      {/* Notification List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {notifications.length > 0 ? (
          notifications.map((n) => (
            <div key={n.id} className="card" style={{ 
              padding: '1.25rem', display: 'flex', gap: '1rem',
              opacity: n.isRead ? 0.75 : 1,
              borderLeft: n.isRead ? '4px solid var(--border-color)' : `4px solid ${n.type === 'priority' ? '#ef4444' : 'var(--primary-blue)'}`,
              transition: 'all 0.2s'
            }}>
              <div style={{ 
                width: '40px', height: '40px', borderRadius: '10px', 
                background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', 
                flexShrink: 0 
              }}>
                {getIcon(n.type)}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                  <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-dark)' }}>{n.title}</h3>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-light)' }}>{n.time}</span>
                </div>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-light)', lineHeight: 1.5 }}>{n.message}</p>
              </div>
              <button 
                onClick={() => removeNotification(n.id)}
                style={{ color: 'var(--text-light)', p: '0.4rem', borderRadius: '50%' }}
                className="close-hover"
              >
                <X size={16} />
              </button>
            </div>
          ))
        ) : (
          <div style={{ textAlign: 'center', padding: '4rem 2rem', color: 'var(--text-light)' }}>
            <Bell size={48} style={{ opacity: 0.2, marginBottom: '1rem' }} />
            <h3>No notifications yet</h3>
            <p>We'll notify you when something important happens.</p>
          </div>
        )}
      </div>

      <style>{`
        .close-hover:hover {
          background: #fee2e2;
          color: #ef4444;
        }
      `}</style>
    </div>
  );
};

export default Notifications;
