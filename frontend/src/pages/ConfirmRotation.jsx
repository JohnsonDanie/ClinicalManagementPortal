import React from 'react';
import { Info, HelpCircle, CheckCircle } from 'lucide-react';

const ConfirmRotation = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', maxWidth: '1000px', margin: '0 auto' }}>
      <div>
        <span className="pill" style={{ marginBottom: '1.5rem', display: 'inline-block' }}>REVIEW DETAILS</span>
        <h1 style={{ fontSize: '2.5rem', color: 'var(--primary-blue)', marginBottom: '1rem', fontWeight: 700 }}>Confirm Your Session</h1>
        <p style={{ color: 'var(--text-light)', fontSize: '1.1rem', maxWidth: '600px', lineHeight: 1.6 }}>
          Please verify the following counseling session details before finalizing your schedule.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '2rem' }}>
        
        {/* Left Column - Details */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <div className="card" style={{ backgroundColor: '#f8fafc', border: 'none', padding: '2rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2.5rem' }}>
              <div>
                <p style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-light)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>FACILITY</p>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-dark)', marginBottom: '0.25rem' }}>Nile University Student Services</h3>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-light)' }}>Block B, Student Services Wing</p>
              </div>
              <div>
                <p style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-light)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>ASSIGNED COUNSELOR</p>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-dark)', marginBottom: '0.25rem' }}>Dr. Helena Vance</h3>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-light)' }}>Senior Clinical Counselor</p>
              </div>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '3rem' }}>
              <div>
                <p style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-light)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>DATE & TIME</p>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-dark)', marginBottom: '0.25rem' }}>Monday, Oct 24, 2023</h3>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-light)' }}>10:00 AM — 11:30 AM (90 Mins)</p>
              </div>
              <div>
                <p style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-light)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>SESSION CATEGORY</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <div style={{ width: '24px', height: '24px', backgroundColor: 'var(--primary-blue)', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '12px' }}>👤</div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 500, color: 'var(--text-dark)' }}>Individual Therapy</h3>
                </div>
              </div>
            </div>

            <div style={{ backgroundColor: 'var(--white)', padding: '1.5rem', borderRadius: 'var(--radius-md)', display: 'flex', gap: '1rem', border: '1px solid var(--border-color)' }}>
              <Info color="var(--primary-blue)" size={24} style={{ flexShrink: 0 }} />
              <div>
                <h4 style={{ fontWeight: 600, marginBottom: '0.5rem' }}>Check-in Instructions</h4>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-light)', lineHeight: 1.5 }}>
                  Please arrive at Student Services 5 minutes before your scheduled time.<br />
                  Have your student QR code or ID card ready for a quick check-in at the front desk.
                </p>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem' }}>
            <button className="btn-primary" style={{ padding: '1rem 2rem', fontSize: '1rem' }}>
              Confirm Appointment <CheckCircle size={18} />
            </button>
            <button className="btn-secondary" style={{ padding: '1rem 2rem', fontSize: '1rem' }}>
              Cancel & Return
            </button>
          </div>
        </div>

        {/* Right Column - Summary & Assistance */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          <div className="card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', background: 'linear-gradient(135deg, var(--primary-blue), #1c4173)', color: 'white' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.5rem' }}>Appointment Summary</h3>
            <p style={{ fontSize: '0.95rem', lineHeight: 1.6, opacity: 0.9 }}>
              This appointment connects you with <strong>Nile University Student Services</strong>, where you will meet with <strong>Dr. Helena Vance</strong> for your scheduled session.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.2)', paddingBottom: '0.75rem' }}>
                <span style={{ fontSize: '0.9rem', opacity: 0.8 }}>Facility</span>
                <span style={{ fontWeight: 600 }}>Student Services</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.2)', paddingBottom: '0.75rem' }}>
                <span style={{ fontSize: '0.9rem', opacity: 0.8 }}>Counselor</span>
                <span style={{ fontWeight: 600 }}>Dr. Helena Vance</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.2)', paddingBottom: '0.75rem' }}>
                <span style={{ fontSize: '0.9rem', opacity: 0.8 }}>Category</span>
                <span style={{ fontWeight: 600 }}>Individual</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.9rem', opacity: 0.8 }}>Status</span>
                <span style={{ fontWeight: 600 }}>Pending Confirmation</span>
              </div>
            </div>
            <p style={{ fontSize: '0.85rem', lineHeight: 1.5, marginTop: '0.5rem', color: 'rgba(255,255,255,0.7)', fontStyle: 'italic' }}>
              Confirming this appointment will secure your slot and notify your assigned counselor.
            </p>
          </div>

          <div className="card" style={{ backgroundColor: '#f8fafc', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--primary-blue)' }}>
              <div style={{ width: '32px', height: '32px', backgroundColor: 'var(--primary-blue)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                 <HelpCircle size={18} />
              </div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 600 }}>Need Assistance?</h3>
            </div>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-light)', lineHeight: 1.5 }}>
              If you have any questions regarding this session, please contact the Student Support Office or message your counselor directly.
            </p>
            <button style={{ color: 'var(--primary-blue)', fontWeight: 600, fontSize: '0.85rem', letterSpacing: '0.05em', alignSelf: 'flex-start', marginTop: '0.5rem' }}>CONTACT OFFICE</button>
          </div>

        </div>
      </div>
      
      <div style={{ marginTop: '2rem', paddingTop: '2rem', borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', color: 'var(--text-light)', fontSize: '0.85rem' }}>
        <span>© 2026 Nile University • Clinical Management Portal</span>
        <div style={{ display: 'flex', gap: '2rem' }}>
          <span>PRIVACY POLICY</span>
          <span>SUPPORT CENTER</span>
          <span>ETHICS GUIDELINES</span>
        </div>
      </div>
    </div>
  );
};

export default ConfirmRotation;
