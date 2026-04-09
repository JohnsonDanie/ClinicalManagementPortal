import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { ChevronLeft, ChevronRight, Video, UserIcon, CheckCircle2, Info } from 'lucide-react';

const COUNSELORS = [
  { id: 'chen', name: 'Dr. Sarah Chen', title: 'Clinical Lead', specialty: 'Anxiety & Personal Issues', image: 'https://ui-avatars.com/api/?name=SC&background=235291&color=fff&size=80' },
  { id: 'wilson', name: 'Dr. James Wilson', title: 'Residency Advisor', specialty: 'Academic Stress', image: 'https://ui-avatars.com/api/?name=JW&background=235291&color=fff&size=80' },
  { id: 'thorne', name: 'Dr. Marcus Thorne', title: 'Mental Health Lead', specialty: 'Depression & Grief', image: 'https://ui-avatars.com/api/?name=MT&background=235291&color=fff&size=80' },
];

// Generate time slots for each day with some booked/unavailable
const WEEK_DAYS = [
  { day: 'MON', date: '14', slots: ['09:00', '10:30', '14:00'], booked: ['10:30'] },
  { day: 'TUE', date: '15', slots: ['09:00', '11:00', '13:30', '15:00'], booked: ['09:00'] },
  { day: 'WED', date: '16', slots: ['10:00', '11:30', '14:30'], booked: [] },
  { day: 'THU', date: '17', slots: ['09:00', '10:00', '15:30'], booked: ['09:00', '10:00'] },
  { day: 'FRI', date: '18', slots: ['09:30', '11:00', '14:00'], booked: ['14:00'] },
];

const BookingCalendar = () => {
  const { user, assessmentResult } = useAuth();
  const navigate = useNavigate();

  const [sessionType, setSessionType] = useState('virtual');
  const [selectedCounselor, setSelectedCounselor] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null); // { day, time }
  const [confirming, setConfirming] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  const handleConfirm = async () => {
    if (!selectedSlot || !selectedCounselor) return;
    setConfirming(true);
    try {
      // In a real system this would save to a bookings table
      await new Promise((r) => setTimeout(r, 900)); // Simulate async
      setConfirmed(true);
    } catch (e) {
      console.error(e);
    }
    setConfirming(false);
  };

  if (confirmed) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', gap: '1.5rem', textAlign: 'center' }}>
        <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: '#dcfce7', border: '3px solid #22c55e', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <CheckCircle2 size={40} color="#15803d" />
        </div>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#1e293b', marginBottom: '0.5rem' }}>Appointment Confirmed!</h1>
          <p style={{ color: '#64748b', maxWidth: '400px' }}>
            Your <strong>{sessionType}</strong> session with <strong>{COUNSELORS.find(c => c.id === selectedCounselor)?.name}</strong> on <strong>{WEEK_DAYS.find(d => d.day === selectedSlot.day)?.day}, Apr {WEEK_DAYS.find(d => d.day === selectedSlot.day)?.date}</strong> at <strong>{selectedSlot.time} AM</strong> has been booked.
          </p>
        </div>
        <button className="btn-primary" onClick={() => navigate('/student-dashboard')} style={{ borderRadius: '12px', padding: '0.875rem 2rem' }}>
          Back to My Dashboard
        </button>
      </div>
    );
  }

  const counselorObj = COUNSELORS.find(c => c.id === selectedCounselor);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Header */}
      <div>
        <p style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--primary-blue)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>SELF-SERVICE BOOKING</p>
        <h1 style={{ fontSize: '2rem', color: 'var(--text-dark)', marginBottom: '0.5rem' }}>Book Your Session</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <p style={{ color: 'var(--text-light)' }}>Only conflict-free slots with buffer time are shown.</p>
          {assessmentResult && (
            <span style={{ background: '#dcfce7', color: '#15803d', fontSize: '0.75rem', fontWeight: 600, padding: '0.2rem 0.6rem', borderRadius: '99px' }}>
              {assessmentResult.category} Support
            </span>
          )}
        </div>
      </div>

      {/* Buffer info banner */}
      <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '12px', padding: '0.875rem 1.25rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <Info size={18} color="#3b82f6" style={{ flexShrink: 0 }} />
        <p style={{ fontSize: '0.875rem', color: '#1d4ed8' }}>
          Greyed-out slots are either booked or within the required 30-minute buffer window between sessions.
        </p>
      </div>

      <div style={{ display: 'flex', gap: '1.5rem' }}>
        {/* Left Panel */}
        <div style={{ width: '300px', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

          {/* Session Type */}
          <div className="card">
            <p style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-light)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1rem' }}>Session Type</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {[{ type: 'virtual', label: 'Virtual Consult', sub: 'Video call with counselor', Icon: Video }, { type: 'in-person', label: 'In-Person Clinic', sub: 'Visit the counseling center', Icon: UserIcon }].map(({ type, label, sub, Icon }) => (
                <div key={type} onClick={() => setSessionType(type)} style={{
                  padding: '0.875rem', borderRadius: '12px', cursor: 'pointer',
                  border: sessionType === type ? '2px solid var(--primary-blue)' : '2px solid #e2e8f0',
                  background: sessionType === type ? '#eff6ff' : '#fafafa',
                  display: 'flex', alignItems: 'center', gap: '0.75rem',
                  transition: 'all 0.2s ease',
                }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: sessionType === type ? '#dbeafe' : '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon size={18} color={sessionType === type ? 'var(--primary-blue)' : '#94a3b8'} />
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.9rem', color: '#1e293b' }}>{label}</div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{sub}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Counselor Selection */}
          <div className="card">
            <p style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-light)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1rem' }}>Select Counselor</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {COUNSELORS.map((c) => (
                <div key={c.id} onClick={() => setSelectedCounselor(c.id)} style={{
                  display: 'flex', alignItems: 'center', gap: '0.875rem',
                  padding: '0.75rem', borderRadius: '12px', cursor: 'pointer',
                  border: selectedCounselor === c.id ? '2px solid var(--primary-blue)' : '2px solid transparent',
                  background: selectedCounselor === c.id ? '#eff6ff' : 'transparent',
                  transition: 'all 0.2s ease',
                }}>
                  <img src={c.image} alt={c.name} style={{ width: '42px', height: '42px', borderRadius: '50%', flexShrink: 0 }} />
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.875rem', color: '#1e293b' }}>{c.name}</div>
                    <div style={{ fontSize: '0.7rem', color: '#64748b' }}>{c.specialty}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Panel — Calendar */}
        <div className="card" style={{ flex: 1, padding: 0, overflow: 'hidden' }}>
          {/* Day headers */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', borderBottom: '1px solid var(--border-color)' }}>
            {WEEK_DAYS.map((d, i) => (
              <div key={i} style={{ padding: '1.25rem', textAlign: 'center', borderRight: i < 4 ? '1px solid var(--border-color)' : 'none' }}>
                <p style={{ fontSize: '0.7rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '0.25rem' }}>{d.day}</p>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1e293b' }}>Apr {d.date}</h3>
              </div>
            ))}
          </div>

          {/* Slots */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', padding: '1rem', gap: '0', minHeight: '200px' }}>
            {WEEK_DAYS.map((d, di) => (
              <div key={di} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', padding: '0 0.5rem', borderRight: di < 4 ? '1px solid var(--border-color)' : 'none' }}>
                {d.slots.map((time) => {
                  const isBooked = d.booked.includes(time);
                  const isSelected = selectedSlot?.day === d.day && selectedSlot?.time === time;
                  return (
                    <div
                      key={time}
                      onClick={() => !isBooked && setSelectedSlot({ day: d.day, time })}
                      style={{
                        padding: '0.625rem 0.5rem',
                        borderRadius: '8px',
                        textAlign: 'center',
                        fontSize: '0.8rem',
                        fontWeight: 600,
                        cursor: isBooked ? 'not-allowed' : 'pointer',
                        transition: 'all 0.2s ease',
                        background: isSelected ? 'var(--primary-blue)' : isBooked ? '#f1f5f9' : '#eff6ff',
                        color: isSelected ? 'white' : isBooked ? '#cbd5e1' : 'var(--primary-blue)',
                        border: isSelected ? '2px solid var(--primary-blue)' : '2px solid transparent',
                        textDecoration: isBooked ? 'line-through' : 'none',
                      }}
                    >
                      {time} AM
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Confirm Bar */}
      {selectedSlot && selectedCounselor && (
        <div style={{
          background: 'linear-gradient(135deg, #235291, #3b6cb7)',
          borderRadius: '16px', padding: '1.5rem 2rem',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          color: 'white', animation: 'slideUp 0.3s ease',
        }}>
          <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center' }}>
            <img src={counselorObj?.image} style={{ width: '56px', height: '56px', borderRadius: '12px', border: '2px solid rgba(255,255,255,0.3)' }} />
            <div>
              <p style={{ fontSize: '0.75rem', fontWeight: 600, color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>Selected Session</p>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '0.25rem' }}>
                {sessionType === 'virtual' ? 'Virtual' : 'In-Person'} with {counselorObj?.name}
              </h3>
              <p style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.85)' }}>
                {selectedSlot.day}, Apr {WEEK_DAYS.find(d => d.day === selectedSlot.day)?.date} &nbsp;•&nbsp; {selectedSlot.time} AM
              </p>
            </div>
          </div>
          <button
            onClick={handleConfirm}
            disabled={confirming}
            style={{
              background: 'white', color: 'var(--primary-blue)',
              padding: '0.875rem 2rem', borderRadius: '12px', fontWeight: 700,
              fontSize: '0.95rem', opacity: confirming ? 0.7 : 1,
            }}
          >
            {confirming ? 'Confirming…' : 'Confirm Appointment'}
          </button>
        </div>
      )}

      <style>{`
        @keyframes slideUp {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default BookingCalendar;
