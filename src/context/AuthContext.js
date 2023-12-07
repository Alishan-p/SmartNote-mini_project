// src/context/AuthContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children,history }) => {
  const [isAuthenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    // Check session storage for authentication status on component mount
    const storedAuthStatus = sessionStorage.getItem('isAuthenticated');
    if (storedAuthStatus) {
      setAuthenticated(JSON.parse(storedAuthStatus));
    }
  }, []);

  const login = (email, password) => {
    // Hardcoded email and password for demonstration purposes
    const hardcodedEmail = 'smartnote@gmail.com';
    const hardcodedPassword = '123456';

    // Check if provided credentials match hardcoded values
    if (email === hardcodedEmail && password === hardcodedPassword) {
      setAuthenticated(true);
      // Save authentication status to session storage
      sessionStorage.setItem('isAuthenticated', true);
    } else {
      setAuthenticated(false);
    }
  };

  const logout = () => {
    // Perform logout logic here
    setAuthenticated(false);
    // Remove authentication status from session storage on logout
    sessionStorage.removeItem('isAuthenticated');
    // Redirect to the login page after logout
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
