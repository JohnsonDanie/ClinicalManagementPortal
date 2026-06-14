import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const AuthContext = createContext();

const mapCampusOneRole = (coRole) => {
  const role = coRole?.toLowerCase();
  if (role === 'student') return 'student';
  if (['staff', 'consultant', 'therapist', 'counselor'].includes(role)) return 'counselor';
  if (['admin', 'administrator'].includes(role)) return 'admin';
  if (['desk_officer', 'desk-officer', 'officer', 'desk_officer_role'].includes(role)) return 'desk_officer';
  return 'student'; // default/fallback
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [assessmentResult, setAssessmentResult] = useState(null);
  const [providerToken, setProviderToken] = useState(null);

  useEffect(() => {
    // 1. Check active sessions and sets the user
    supabase.auth.getSession()
      .then(({ data: { session } }) => {
        if (session?.user) {
          const allowedDomains = ['builtbysalih.com', 'nileuniversity.edu.ng'];
          const userDomain = session.user.email?.split('@')[1];

          if (!allowedDomains.includes(userDomain)) {
            supabase.auth.signOut();
            setUser(null);
            setProviderToken(null);
            setLoading(false);
            return;
          }
          setProviderToken(session.provider_token || null);
          fetchProfile(session.user);
        } else {
          setProviderToken(null);
          setLoading(false);
        }
      })
      .catch((err) => {
        // Ensure loading is always cleared — a hanging getSession() causes a permanent blank screen
        console.error('Session check failed:', err);
        setLoading(false);
      });

    // 2. Listen for changes on auth state (logged in, signed out, etc.)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        const allowedDomains = ['builtbysalih.com', 'nileuniversity.edu.ng'];
        const userDomain = session.user.email?.split('@')[1];
        
        if (!allowedDomains.includes(userDomain)) {
          await supabase.auth.signOut();
          setUser(null);
          setProviderToken(null);
          setLoading(false);
          alert("Unauthorized Domain: Please use your university email.");
          return;
        }
        setProviderToken(session.provider_token || null);
        fetchProfile(session.user);
      } else {
        setUser(null);
        setProviderToken(null);
        setLoading(false);
      }
    });

    const savedAssessment = localStorage.getItem('assessmentResult');
    if (savedAssessment) {
      setAssessmentResult(JSON.parse(savedAssessment));
    }

    return () => subscription.unsubscribe();
  }, []);

  const fetchProfile = async (authUser) => {
    try {
      let { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authUser.id)
        .single();
      
      if (error && error.code === 'PGRST116') {
        // PGRST116 is row-not-found; auto-provision profile from Campus One claims
        const metadata = authUser.user_metadata || {};
        const mappedRole = mapCampusOneRole(metadata.role || 'student');
        const newProfile = {
          id: authUser.id,
          full_name: metadata.name || metadata.full_name || authUser.email?.split('@')[0] || 'Unknown User',
          role: mappedRole,
          email: authUser.email,
        };
        const { data: inserted, error: insertError } = await supabase
          .from('profiles')
          .insert(newProfile)
          .select()
          .single();
        if (insertError) throw insertError;
        profile = inserted;
      } else if (error) {
        throw error;
      }

      // Merge Auth and Database Profile
      setUser({
        ...authUser,
        user_metadata: {
          ...authUser.user_metadata,
          role: profile.role,
          name: profile.full_name,
          title: profile.title
        }
      });
    } catch (err) {
      console.error('Error fetching profile:', err);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    return data;
  };

  const signup = async (email, password, role, fullName) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: window.location.origin,
        data: {
          role: role,
          full_name: fullName,
        }
      }
    });
    if (error) throw error;

    // FIX-02: Create the profiles row immediately so fetchProfile() never fails
    if (data.user) {
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: data.user.id,
          full_name: fullName,
          role: role,
          email: email,
        });
      if (profileError) {
        // Non-fatal: profile may already exist via DB trigger
        console.warn('Profile row creation warning:', profileError.message);
      }
    }

    setAssessmentResult(null);
    localStorage.removeItem('assessmentResult');
    return data;
  };

  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    setUser(null);
    setAssessmentResult(null);
    localStorage.removeItem('assessmentResult');
  };

  const setAssessmentComplete = (result) => {
    setAssessmentResult(result);
    localStorage.setItem('assessmentResult', JSON.stringify(result));
  };

  const signInWithGoogle = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin,
        queryParams: {
          prompt: 'select_account',
        },
      }
    });
    if (error) throw error;
    return data;
  };

  const signInWithCampusOne = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'custom:campus-one',
      options: {
        redirectTo: window.location.origin,
        scopes: 'openid profile email academic roles offline_access',
      }
    });
    if (error) throw error;
    return data;
  };

  const sendCampusOneNotification = async (title, body, type = 'info', targetUrl = '') => {
    if (!providerToken) {
      console.warn('No active Campus One provider token found in session.');
      return;
    }
    const response = await fetch('https://auth.campusone.com.ng/api/apps/notifications', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${providerToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        title,
        body,
        type,
        targetUrl
      })
    });
    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.message || 'Failed to dispatch notification to Campus One.');
    }
    return await response.json();
  };

  const isAllowedDomain = (email) => {
    const allowedDomains = ['builtbysalih.com', 'nileuniversity.edu.ng'];
    const domain = email.split('@')[1];
    return allowedDomains.includes(domain);
  };

  const value = {
    user,
    loading,
    login,
    signup,
    logout,
    signInWithGoogle,
    signInWithCampusOne,
    isAllowedDomain,
    assessmentResult,
    setAssessmentComplete,
    providerToken,
    sendCampusOneNotification,
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
