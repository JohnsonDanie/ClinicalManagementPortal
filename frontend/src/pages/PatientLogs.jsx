import React, { useState } from 'react';
import { 
  Search, Filter, MoreHorizontal, User, 
  Calendar, CheckCircle2, XCircle, Clock,
  MessageSquare, ArrowUpRight, History
} from 'lucide-react';

const PatientLogs = () => {
  const [searchTerm, setSearchTerm] = useState('');

  // Mock patient data
  const patients = [
    { id: 1, name: 'Michael Ross', category: 'Academic', priority: 'Routine', lastSession: 'Oct 12, 2023', status: 'In Progress' },
    { id: 2, name: 'Sarah Jenkins', category: 'Individual', priority: 'Urgent', lastSession: 'Oct 14, 2023', status: 'Needs Follow-up' },
    { id: 3, name: 'David Kim', category: 'Mental Health', priority: 'Emergency', lastSession: 'Oct 15, 2023', status: 'Resolved' },
    { id: 4, name: 'Emily Chen', category: 'Career', priority: 'Routine', lastSession: 'Oct 08, 2023', status: 'Dismissed' },
    { id: 5, name: 'James Wilson', category: 'Personal', priority: 'Urgent', lastSession: 'Oct 11, 2023', status: 'In Progress' },
  ];

  const getStatusStyle = (status) => {
    switch (status) {
      case 'Resolved': return { bg: '#dcfce7', color: '#15803d' };
      case 'Needs Follow-up': return { bg: '#fef3c7', color: '#92400e' };
      case 'Dismissed': return { bg: '#f1f5f9', color: '#64748b' };
      case 'In Progress': return { bg: '#e0e7ff', color: '#4338ca' };
      default: return { bg: '#f1f5f9', color: '#444' };
    }
  };

  const getPriorityStyle = (priority) => {
    switch (priority) {
      case 'Emergency': return { bg: '#fee2e2', color: '#b91c1c' };
      case 'Urgent': return { bg: '#fff7ed', color: '#c2410c' };
      default: return { bg: '#f0fdf4', color: '#166534' };
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '2rem', color: 'var(--primary-blue)', marginBottom: '0.4rem' }}>Patient Management</h1>
          <p style={{ color: 'var(--text-light)' }}>Track student wellness progress and manage follow-up sessions.</p>
        </div>
        <button className="btn-primary">
          <Calendar size={18} /> Schedule New Intake
        </button>
      </div>

      {/* Stats Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.25rem' }}>
        {[
          { label: 'Total Managed', value: '156', icon: User, color: '#3b82f6' },
          { label: 'Pending Follow-up', value: '12', icon: Clock, color: '#f59e0b' },
          { label: 'Emergency Handled', value: '4', icon: Siren, color: '#ef4444' },
          { label: 'Resolved (Month)', value: '42', icon: CheckCircle2, color: '#10b981' },
        ].map((stat) => (
          <div key={stat.label} className="card" style={{ padding: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: `${stat.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <stat.icon size={20} color={stat.color} />
              </div>
            </div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-dark)' }}>{stat.value}</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-light)', marginTop: '0.2rem' }}>{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Main Table Card */}
      <div className="card" style={{ padding: 0 }}>
        <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <Search size={18} color="var(--text-light)" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
            <input 
              type="text" 
              placeholder="Search by student name, ID or record ID..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 2.75rem', borderRadius: '10px', border: '1px solid var(--border-color)', fontSize: '0.9rem', outline: 'none' }}
            />
          </div>
          <button style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.25rem', borderRadius: '10px', border: '1px solid var(--border-color)', color: 'var(--text-light)', fontWeight: 600, fontSize: '0.9rem' }}>
            <Filter size={18} /> Filter By
          </button>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: '#f8fafc' }}>
                <th style={{ padding: '1rem 1.5rem', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-light)', textTransform: 'uppercase' }}>Student Name</th>
                <th style={{ padding: '1rem 1.5rem', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-light)', textTransform: 'uppercase' }}>Category</th>
                <th style={{ padding: '1rem 1.5rem', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-light)', textTransform: 'uppercase' }}>Priority</th>
                <th style={{ padding: '1rem 1.5rem', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-light)', textTransform: 'uppercase' }}>Last Session</th>
                <th style={{ padding: '1rem 1.5rem', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-light)', textTransform: 'uppercase' }}>Status</th>
                <th style={{ padding: '1rem 1.5rem', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-light)', textTransform: 'uppercase', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {patients.map((p) => (
                <tr key={p.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '1rem 1.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--secondary-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary-blue)', fontWeight: 600, fontSize: '0.75rem' }}>
                        {p.name.charAt(0)}
                      </div>
                      <span style={{ fontWeight: 600, fontSize: '0.925rem' }}>{p.name}</span>
                    </div>
                  </td>
                  <td style={{ padding: '1rem 1.5rem', fontSize: '0.9rem', color: 'var(--text-light)' }}>{p.category}</td>
                  <td style={{ padding: '1rem 1.5rem' }}>
                    <span style={{ padding: '0.3rem 0.6rem', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 700, ...getPriorityStyle(p.priority) }}>
                      {p.priority}
                    </span>
                  </td>
                  <td style={{ padding: '1rem 1.5rem', fontSize: '0.9rem', color: 'var(--text-light)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <History size={14} /> {p.lastSession}
                    </div>
                  </td>
                  <td style={{ padding: '1rem 1.5rem' }}>
                    <span style={{ padding: '0.3rem 0.6rem', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 700, ...getStatusStyle(p.status) }}>
                      {p.status}
                    </span>
                  </td>
                  <td style={{ padding: '1rem 1.5rem', textAlign: 'right' }}>
                    <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                      <button style={{ color: 'var(--primary-blue)', p: '0.5rem', borderRadius: '6px', hover: { bg: '#eff6ff' } }} title="View Profile">
                        <User size={18} />
                      </button>
                      <button style={{ color: '#15803d', p: '0.5rem', borderRadius: '6px' }} title="Schedule Follow-up">
                        <Calendar size={18} />
                      </button>
                      <button style={{ color: '#ef4444', p: '0.5rem', borderRadius: '6px' }} title="Dismiss Patient">
                        <XCircle size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PatientLogs;

const Siren = ({ size, color }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M7 12h10" />
    <path d="M5 12h2" />
    <path d="M17 12h2" />
    <path d="M12 7v5" />
    <path d="M12 17v2" />
    <circle cx="12" cy="12" r="10" />
  </svg>
);
