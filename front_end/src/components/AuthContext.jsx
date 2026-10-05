import React, { createContext, useState, useContext, useEffect } from 'react';
import Cookies from 'js-cookie';
import { syncLocalCart } from '../service/CartLocal';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = Cookies.get('token');
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  const login = async (token) => {
    Cookies.set('token', token, { secure: true, sameSite: 'strict' });
    setIsLoggedIn(true);
    await syncLocalCart(token)
  };

  const logout = () => {
    Cookies.remove('token');
    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);