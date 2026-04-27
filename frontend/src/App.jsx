import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import Layout from './components/Layout';
import AdminLayout from './components/AdminLayout';
import Dashboard from './pages/Dashboard';
import Schedule from './pages/Schedule';
import ConfirmRotation from './pages/ConfirmRotation';
import Auth from './pages/Auth';
import StudentDashboard from './pages/StudentDashboard';
import Assessment from './pages/Assessment';
import BookingCalendar from './pages/BookingCalendar';
import PatientLogs from './pages/PatientLogs';
import Notifications from './pages/Notifications';
import Settings from './pages/Settings';
import AvailabilitySettings from './pages/AvailabilitySettings';
import ResourceCMS from './pages/ResourceCMS';
import SystemOversight from './pages/SystemOversight';
import PostSessionSurvey from './pages/PostSessionSurvey';
import './App.css';

// ── Protected Route ────────────────────────────────────────────────────────
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/auth" replace />;
  if (allowedRoles && !allowedRoles.includes(user.user_metadata?.role)) {
    return <Navigate to={user.user_metadata?.role === 'student' ? '/student-dashboard' : '/dashboard'} replace />;
  }
  return children;
};

// ── Assessment Guard: redirects students to /assessment if not yet done ────
const StudentRoute = ({ children }) => {
  const { user, loading, assessmentResult } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/auth" replace />;
  if (user.user_metadata?.role !== 'student') return <Navigate to="/dashboard" replace />;
  if (!assessmentResult) return <Navigate to="/assessment" replace />;
  return children;
};

// ── Role-based root redirect ───────────────────────────────────────────────
const MainRedirect = () => {
  const { user, assessmentResult } = useAuth();
  
  if (!user) return <Navigate to="/auth" replace />;

  const role = user.user_metadata?.role;

  if (role === 'student') {
    if (!assessmentResult) return <Navigate to="/assessment" replace />;
    return <Navigate to="/student-dashboard" replace />;
  }
  
  if (role === 'desk_officer' || role === 'admin') {
    return <Navigate to="/admin" replace />;
  }
  
  if (role === 'counselor') {
    return <Navigate to="/dashboard" replace />;
  }

  // Fallback for unknown roles: if we're already at /auth, don't redirect back to /auth
  return <div style={{ padding: '2rem', textAlign: 'center' }}>
    <h3>Account Configuration Required</h3>
    <p>Your account does not have a designated role. Please contact an administrator.</p>
    <button onClick={() => window.location.href = '/auth'} className="btn-secondary">Back to Login</button>
  </div>;
};

// ── App ────────────────────────────────────────────────────────────────────
function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        Loading...
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        <Route path="/auth" element={user ? <MainRedirect /> : <Auth />} />

        <Route
          path="/assessment"
          element={
            user?.user_metadata?.role === 'student'
              ? <Assessment />
              : <Navigate to="/auth" replace />
          }
        />

        <Route path="/" element={user ? <Layout /> : <Navigate to="/auth" />}>
          <Route index element={<MainRedirect />} />

          {/* SHARED PAGES */}
          <Route path="notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
          <Route path="settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />

          {/* COUNSELOR ONLY */}
          <Route path="dashboard" element={<ProtectedRoute allowedRoles={['counselor']}><Dashboard /></ProtectedRoute>} />
          <Route path="schedule" element={<ProtectedRoute allowedRoles={['counselor']}><Schedule /></ProtectedRoute>} />
          <Route path="patient-logs" element={<ProtectedRoute allowedRoles={['counselor']}><PatientLogs /></ProtectedRoute>} />
          <Route path="availability" element={<ProtectedRoute allowedRoles={['counselor']}><AvailabilitySettings /></ProtectedRoute>} />

          {/* STUDENT ONLY */}
          <Route path="student-dashboard" element={<StudentRoute><StudentDashboard /></StudentRoute>} />
          <Route path="booking" element={<StudentRoute><BookingCalendar /></StudentRoute>} />
          <Route path="survey" element={<StudentRoute><PostSessionSurvey /></StudentRoute>} />
          <Route path="confirm-rotation" element={<ProtectedRoute allowedRoles={['student', 'counselor']}><ConfirmRotation /></ProtectedRoute>} />
        </Route>

        <Route path="/admin" element={user ? <AdminLayout /> : <Navigate to="/auth" />}>
          <Route index element={<ProtectedRoute allowedRoles={['desk_officer', 'admin']}><ResourceCMS /></ProtectedRoute>} />
          <Route path="oversight" element={<ProtectedRoute allowedRoles={['admin']}><SystemOversight /></ProtectedRoute>} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
