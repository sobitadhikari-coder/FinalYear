// src/contexts/AuthProvider.jsx

import { useState, useEffect, useCallback } from 'react';
import { isLoggedIn, setTokens, removeTokens, getStoredRole } from '../utils/token';
import { login as loginApi, register as registerApi } from '../api/auth';
import { getSharedProfile, getTeacherProfile } from '../api/profile';
import { AuthContext } from './AuthContext';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [isVerified, setIsVerified] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchUserData = useCallback(async () => {
    const sharedProfile = await getSharedProfile();
    setUser(sharedProfile);
    const storedRole = getStoredRole();
    if (storedRole) {
      setRole(storedRole);
    } else {
      setRole(sharedProfile.role || 'student');
    }
    if (storedRole === 'teacher') {
      try {
        const teacherProfile = await getTeacherProfile();
        setIsVerified(teacherProfile.is_verified);
      } catch {
        setIsVerified(false);
      }
    }
  }, []);

  useEffect(() => {
    const initAuth = async () => {
      if (isLoggedIn()) {
        const storedRole = getStoredRole();
        if (storedRole) setRole(storedRole);
        try {
          await fetchUserData();
        } catch {
          removeTokens();
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    initAuth();
  }, [fetchUserData]);

  const login = useCallback(async (identifier, password) => {
    const response = await loginApi(identifier, password);
    const { user: userData, tokens } = response;
    const userRole = userData.role;

    // Store tokens immediately so the next API call is authenticated
    setTokens(tokens.access, tokens.refresh, userRole);

    let verified = false;
    if (userRole === 'teacher') {
      try {
        const teacherProfile = await getTeacherProfile();
        verified = teacherProfile.is_verified;
      } catch {
        verified = false;
      }
    }

    // Set all state at once – React will batch these, and the effect in LoginPage
    // will see the final isVerified value immediately.
    setUser(userData);
    setRole(userRole);
    setIsVerified(verified);

    return response;
  }, []);

  const register = useCallback(async (data) => {
    const response = await registerApi(data);
    return response;
  }, []);

  const logout = useCallback(() => {
    removeTokens();
    setUser(null);
    setRole(null);
    setIsVerified(false);
  }, []);

  const updateUserState = useCallback((updatedUser) => {
    setUser(updatedUser);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        isVerified,
        loading,
        login,
        register,
        logout,
        updateUserState,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};