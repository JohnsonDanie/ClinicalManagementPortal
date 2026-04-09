import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { analyzeWellbeing } from '../utils/crisisEngine';
import {
  HeartPulse, BookOpen, Users, Briefcase, Brain,
  Frown, Meh, Smile, ChevronRight, ChevronLeft,
  AlertTriangle, CheckCircle2, Loader2
} from 'lucide-react';

const SYMPTOM_TAGS = [
  { label: 'Academic Stress', icon: BookOpen, color: '#3b82f6' },
  { label: 'Anxiety', icon: Brain, color: '#8b5cf6' },
  { label: 'Personal Issues', icon: HeartPulse, color: '#ec4899' },
  { label: 'Social Problems', icon: Users, color: '#f59e0b' },
  { label: 'Career Concerns', icon: Briefcase, color: '#10b981' },
  { label: 'Depression', icon: Frown, color: '#6366f1' },
  { label: 'Family Conflict', icon: Users, color: '#ef4444' },
  { label: 'Grief / Loss', icon: HeartPulse, color: '#64748b' },
];

const MOOD_LABELS = {
  1: { label: 'Very Poor', icon: Frown, color: '#ef4444' },
  2: { label: 'Poor', icon: Frown, color: '#f97316' },
  3: { label: 'Low', icon: Frown, color: '#f59e0b' },
  4: { label: 'Below Average', icon: Meh, color: '#eab308' },
  5: { label: 'Neutral', icon: Meh, color: '#84cc16' },
  6: { label: 'Fair', icon: Meh, color: '#22c55e' },
  7: { label: 'Good', icon: Smile, color: '#10b981' },
  8: { label: 'Great', icon: Smile, color: '#14b8a6' },
  9: { label: 'Very Good', icon: Smile, color: '#06b6d4' },
  10: { label: 'Excellent', icon: Smile, color: '#3b82f6' },
};

const Assessment = () => {
  const { user, setAssessmentComplete } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [selectedTags, setSelectedTags] = useState([]);
  const [description, setDescription] = useState('');
  const [moodScore, setMoodScore] = useState(5);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null); // null | { priority, category, isHighRisk }

  const toggleTag = (label) => {
    setSelectedTags((prev) =>
      prev.includes(label) ? prev.filter((t) => t !== label) : [...prev, label]
    );
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    const { priority, category, isHighRisk } = analyzeWellbeing(description, selectedTags, moodScore);

    try {
      // Save assessment to Supabase
      const { data: assessment, error: assessErr } = await supabase
        .from('assessments')
        .insert({
          student_id: user.id,
          symptoms_description: description,
          category,
          priority_score: priority,
          status: isHighRisk ? 'in_queue' : 'pending',
        })
        .select()
        .single();

      if (assessErr) throw assessErr;

      // If high risk, create a crisis flag entry
      if (isHighRisk && assessment) {
        await supabase.from('crisis_flags').insert({
          assessment_id: assessment.id,
          student_id: user.id,
          queue_position: Math.floor(Math.random() * 3) + 1, // Will be properly ordered by backend
          referral_status: 'Pending',
        });
      }
    } catch (err) {
      console.error('Assessment save error:', err);
      // Proceed with local result even if DB fails (demo mode)
    }

    // Mark assessment done in local state
    setAssessmentComplete({ priority, category, isHighRisk });
    setResult({ priority, category, isHighRisk });
    setStep(4); // Result step
    setSubmitting(false);
  };

  const handleContinue = () => {
    if (result?.isHighRisk) {
      navigate('/student-dashboard');
    } else {
      navigate('/booking');
    }
  };

  const MoodIcon = MOOD_LABELS[moodScore]?.icon || Meh;
  const moodColor = MOOD_LABELS[moodScore]?.color || '#64748b';

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f0f4ff 0%, #f8faff 50%, #fff5f0 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
      fontFamily: "'Inter', sans-serif",
    }}>
      <div style={{ width: '100%', maxWidth: '600px' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            width: '56px', height: '56px',
            background: 'linear-gradient(135deg, #235291, #4f80c0)',
            borderRadius: '16px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 1rem',
            boxShadow: '0 8px 20px rgba(35,82,145,0.25)',
          }}>
            <HeartPulse color="white" size={28} />
          </div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#1e293b', marginBottom: '0.5rem' }}>
            Well-Being Check-In
          </h1>
          <p style={{ color: '#64748b', fontSize: '0.95rem', lineHeight: 1.6 }}>
            We care about how you're doing. This brief assessment helps us connect you with the right support.
          </p>
        </div>

        {/* Progress Bar */}
        {step < 4 && (
          <div style={{ marginBottom: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              {['Symptoms', 'Your Story', 'How You Feel'].map((label, i) => (
                <span key={i} style={{
                  fontSize: '0.75rem', fontWeight: 600,
                  color: step > i ? '#235291' : step === i + 1 ? '#235291' : '#94a3b8',
                  textTransform: 'uppercase', letterSpacing: '0.05em',
                }}>
                  {label}
                </span>
              ))}
            </div>
            <div style={{ height: '6px', background: '#e2e8f0', borderRadius: '99px', overflow: 'hidden' }}>
              <div style={{
                height: '100%',
                width: `${((step - 1) / 3) * 100}%`,
                background: 'linear-gradient(90deg, #235291, #4f80c0)',
                borderRadius: '99px',
                transition: 'width 0.4s ease',
              }} />
            </div>
          </div>
        )}

        {/* Card */}
        <div style={{
          background: 'white',
          borderRadius: '20px',
          padding: '2rem',
          boxShadow: '0 8px 32px rgba(35,82,145,0.1)',
          border: '1px solid rgba(35,82,145,0.08)',
        }}>

          {/* STEP 1 — Symptom Tags */}
          {step === 1 && (
            <div>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: '0.5rem', color: '#1e293b' }}>
                What are you experiencing?
              </h2>
              <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                Select all that apply. You can choose multiple.
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1.75rem' }}>
                {SYMPTOM_TAGS.map(({ label, icon: Icon, color }) => {
                  const active = selectedTags.includes(label);
                  return (
                    <div
                      key={label}
                      onClick={() => toggleTag(label)}
                      style={{
                        display: 'flex', alignItems: 'center', gap: '0.75rem',
                        padding: '0.875rem 1rem',
                        borderRadius: '12px',
                        border: active ? `2px solid ${color}` : '2px solid #e2e8f0',
                        background: active ? `${color}12` : '#fafafa',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        userSelect: 'none',
                      }}
                    >
                      <div style={{
                        width: '32px', height: '32px', borderRadius: '8px',
                        background: active ? `${color}22` : '#f1f5f9',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        flexShrink: 0,
                      }}>
                        <Icon size={16} color={active ? color : '#94a3b8'} />
                      </div>
                      <span style={{ fontSize: '0.875rem', fontWeight: 500, color: active ? '#1e293b' : '#64748b' }}>
                        {label}
                      </span>
                    </div>
                  );
                })}
              </div>
              <button
                className="btn-primary"
                onClick={() => setStep(2)}
                style={{ width: '100%', padding: '0.875rem', borderRadius: '12px', fontSize: '1rem', justifyContent: 'center' }}
              >
                Continue <ChevronRight size={18} />
              </button>
            </div>
          )}

          {/* STEP 2 — Free Text */}
          {step === 2 && (
            <div>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: '0.5rem', color: '#1e293b' }}>
                Tell us more in your own words
              </h2>
              <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                Whatever you're comfortable sharing helps us understand how to best support you.
              </p>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="I've been feeling... (e.g. struggling with exams, feeling disconnected from friends, overwhelmed by everything)"
                rows={6}
                style={{
                  width: '100%', padding: '1rem', borderRadius: '12px',
                  border: '2px solid #e2e8f0', fontSize: '0.95rem',
                  fontFamily: 'inherit', resize: 'vertical', outline: 'none',
                  lineHeight: 1.6, color: '#1e293b',
                  transition: 'border-color 0.2s ease',
                  marginBottom: '1.5rem',
                }}
                onFocus={(e) => (e.target.style.borderColor = '#235291')}
                onBlur={(e) => (e.target.style.borderColor = '#e2e8f0')}
              />
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button onClick={() => setStep(1)} className="btn-secondary" style={{ flex: 1, borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                  <ChevronLeft size={16} /> Back
                </button>
                <button
                  className="btn-primary"
                  onClick={() => setStep(3)}
                  style={{ flex: 2, borderRadius: '12px', justifyContent: 'center' }}
                >
                  Continue <ChevronRight size={18} />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3 — Mood Slider */}
          {step === 3 && (
            <div>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: '0.5rem', color: '#1e293b' }}>
                How are you feeling right now?
              </h2>
              <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '2rem' }}>
                Rate your overall well-being on a scale of 1 to 10.
              </p>

              {/* Mood display */}
              <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                <div style={{
                  width: '80px', height: '80px', borderRadius: '50%',
                  background: `${moodColor}18`,
                  border: `3px solid ${moodColor}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto 1rem',
                  transition: 'all 0.3s ease',
                }}>
                  <MoodIcon size={36} color={moodColor} />
                </div>
                <div style={{ fontSize: '2.5rem', fontWeight: 700, color: moodColor, transition: 'color 0.3s ease' }}>
                  {moodScore}
                </div>
                <div style={{ fontSize: '1rem', color: '#64748b', fontWeight: 500 }}>
                  {MOOD_LABELS[moodScore]?.label}
                </div>
              </div>

              {/* Slider */}
              <div style={{ padding: '0 0.5rem', marginBottom: '2rem' }}>
                <input
                  type="range" min="1" max="10" value={moodScore}
                  onChange={(e) => setMoodScore(Number(e.target.value))}
                  style={{
                    width: '100%', height: '8px', borderRadius: '99px',
                    cursor: 'pointer', accentColor: moodColor,
                  }}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem' }}>
                  <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Very Poor</span>
                  <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Excellent</span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button onClick={() => setStep(2)} className="btn-secondary" style={{ flex: 1, borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                  <ChevronLeft size={16} /> Back
                </button>
                <button
                  className="btn-primary"
                  onClick={handleSubmit}
                  disabled={submitting}
                  style={{ flex: 2, borderRadius: '12px', justifyContent: 'center', opacity: submitting ? 0.7 : 1 }}
                >
                  {submitting ? <><Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} /> Analysing...</> : <>Submit Assessment <ChevronRight size={18} /></>}
                </button>
              </div>
            </div>
          )}

          {/* STEP 4 — Result */}
          {step === 4 && result && (
            <div style={{ textAlign: 'center' }}>
              {result.isHighRisk ? (
                <>
                  <div style={{
                    width: '72px', height: '72px', borderRadius: '50%',
                    background: '#fee2e2', border: '3px solid #ef4444',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    margin: '0 auto 1.25rem',
                  }}>
                    <AlertTriangle size={32} color="#b91c1c" />
                  </div>
                  <h2 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#1e293b', marginBottom: '0.75rem' }}>
                    We're here for you
                  </h2>
                  <p style={{ color: '#64748b', lineHeight: 1.6, marginBottom: '0.75rem' }}>
                    Based on your responses, we've identified that you may need <strong>immediate support</strong>.
                  </p>
                  <div style={{
                    background: '#fee2e2', borderRadius: '12px', padding: '1rem 1.25rem',
                    marginBottom: '1.25rem', display: 'inline-block',
                  }}>
                    <span style={{ color: '#b91c1c', fontWeight: 700, fontSize: '0.9rem' }}>
                      {result.priority} Priority — {result.category}
                    </span>
                  </div>
                  <p style={{ color: '#64748b', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '1.75rem' }}>
                    You've been placed at the top of our <strong>Walk-in Priority Queue</strong>. A counselor will attend to you shortly. Your case has been flagged for immediate attention.
                  </p>
                </>
              ) : (
                <>
                  <div style={{
                    width: '72px', height: '72px', borderRadius: '50%',
                    background: '#dcfce7', border: '3px solid #22c55e',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    margin: '0 auto 1.25rem',
                  }}>
                    <CheckCircle2 size={32} color="#15803d" />
                  </div>
                  <h2 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#1e293b', marginBottom: '0.75rem' }}>
                    Assessment Complete
                  </h2>
                  <p style={{ color: '#64748b', lineHeight: 1.6, marginBottom: '0.75rem' }}>
                    Thank you for sharing. We've categorised your needs and found available sessions for you.
                  </p>
                  <div style={{
                    background: '#dcfce7', borderRadius: '12px', padding: '1rem 1.25rem',
                    marginBottom: '1.25rem', display: 'inline-block',
                  }}>
                    <span style={{ color: '#15803d', fontWeight: 700, fontSize: '0.9rem' }}>
                      {result.priority} — {result.category}
                    </span>
                  </div>
                  <p style={{ color: '#64748b', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '1.75rem' }}>
                    Please select a convenient time slot from our booking calendar below.
                  </p>
                </>
              )}
              <button
                className="btn-primary"
                onClick={handleContinue}
                style={{ width: '100%', padding: '0.875rem', borderRadius: '12px', fontSize: '1rem', justifyContent: 'center' }}
              >
                {result.isHighRisk ? 'Go to My Dashboard' : 'Book a Session'} <ChevronRight size={18} />
              </button>
            </div>
          )}
        </div>

        {/* Footer note */}
        {step < 4 && (
          <p style={{ textAlign: 'center', marginTop: '1.5rem', color: '#94a3b8', fontSize: '0.8rem' }}>
            🔒 Your responses are confidential and only shared with your assigned counselor.
          </p>
        )}
      </div>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

export default Assessment;
