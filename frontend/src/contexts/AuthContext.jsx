import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [assessmentResult, setAssessmentResult] = useState(null); // { priority, category, isHighRisk, assignedCounselor }

  // Simulated counselor pool for auto-assignment
  const counselorPool = [
    { id: 'c1', name: 'Dr. Sarah Miller', isAvailable: true, email: 'miller@nile.edu' },
    { id: 'c2', name: 'Dr. James Wilson', isAvailable: false, email: 'wilson@nile.edu' },
  ];

  useEffect(() => {
    const savedUser = localStorage.getItem('mockSession');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }

    const savedAssessment = localStorage.getItem('assessmentResult');
    if (savedAssessment) {
      setAssessmentResult(JSON.parse(savedAssessment));
    }

    setLoading(false);
  }, []);

  const login = async (email, password, role) => {
    const mockupUser = {
      id: role === 'counselor' ? 'c1' : Math.random().toString(36).substr(2, 9),
      email: email,
      user_metadata: {
        role: role,
        name: role === 'student' ? 'Alex (Student)' : 'Dr. Sarah Miller',
        isAvailable: role === 'counselor' ? true : undefined,
      },
    };
    setUser(mockupUser);
    localStorage.setItem('mockSession', JSON.stringify(mockupUser));
  };

  const signup = async (email, password, role, fullName) => {
    const mockupUser = {
      id: Math.random().toString(36).substr(2, 9),
      email: email,
      user_metadata: {
        role: role,
        name: fullName || (role === 'student' ? 'New Student' : 'New Counselor'),
        isAvailable: role === 'counselor' ? true : undefined,
      },
    };
    setUser(mockupUser);
    localStorage.setItem('mockSession', JSON.stringify(mockupUser));

    setAssessmentResult(null);
    localStorage.removeItem('assessmentResult');
  };

  const logout = async () => {
    setUser(null);
    setAssessmentResult(null);
    localStorage.removeItem('mockSession');
    localStorage.removeItem('assessmentResult');
  };

  const setAssessmentComplete = (result) => {
    let finalResult = { ...result };

    // Auto-assignment logic for Emergency
    if (result.priority === 'Emergency') {
      const freeCounselor = counselorPool.find(c => c.isAvailable);
      if (freeCounselor) {
        finalResult.assignedCounselor = freeCounselor;
      }
    }

    setAssessmentResult(finalResult);
    localStorage.setItem('assessmentResult', JSON.stringify(finalResult));
  };

  const value = {
    user,
    loading,
    login,
    signup,
    logout,
    assessmentResult,
    setAssessmentComplete,
    counselorPool,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
