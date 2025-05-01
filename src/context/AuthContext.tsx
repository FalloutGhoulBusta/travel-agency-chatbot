import React, { createContext, useContext, useState, useEffect } from 'react';
//import Cookies from 'js-cookie';

interface AuthContextProps {
  isLoggedIn: boolean;
  checkLoginStatus: () => Promise<void>;
  redirectToLogin: () => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const checkLoginStatus = async () => {
    try {
      const response = await fetch('http://localhost:5173/travel-agency/php/get_login_status.php', {
        credentials: 'include',
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch login status');
      }

      const data = await response.json();
      setIsLoggedIn(data.isLoggedIn);
    } catch (error) {
      console.error('Error checking login status:', error);
      setIsLoggedIn(false);
    }
  };

  const redirectToLogin = () => {
    // signal parent window to handle login redirect
    window.parent.postMessage({ type: 'login' }, '*');
  };

  useEffect(() => {
    checkLoginStatus();
  }, []);

  return (
    <AuthContext.Provider value={{ isLoggedIn, checkLoginStatus, redirectToLogin }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

