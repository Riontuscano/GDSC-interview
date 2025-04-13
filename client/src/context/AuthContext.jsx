import { createContext, useState, useContext, useEffect, useRef } from 'react';

const API_URL = 'http://localhost:5500/api';
const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);
  
  // For debouncing API requests
  const requestTimeoutRef = useRef(null);

  useEffect(() => {
    // Check if user is stored in localStorage
    const storedUser = localStorage.getItem('user');
    
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
    
    setLoading(false);
    
    // Clean up any pending requests
    return () => {
      if (requestTimeoutRef.current) {
        clearTimeout(requestTimeoutRef.current);
      }
    };
  }, []);
  
  // Helper function to make API requests with debouncing
  const makeRequest = async (endpoint, options) => {
    if (requestTimeoutRef.current) {
      clearTimeout(requestTimeoutRef.current);
    }
    
    return new Promise((resolve, reject) => {
      requestTimeoutRef.current = setTimeout(async () => {
        try {
          const response = await fetch(`${API_URL}${endpoint}`, options);
          const data = await response.json();
          
          if (!response.ok) {
            throw new Error(data.message || 'Request failed');
          }
          
          resolve(data);
        } catch (error) {
          reject(error);
        }
      }, 100); // Small delay to prevent multiple rapid requests
    });
  };

  // Register a new user
  const register = async (userData) => {
    try {
      const data = await makeRequest('/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });
      
      // Save the token and user to localStorage and state
      localStorage.setItem('token', data.data.token);
      localStorage.setItem('user', JSON.stringify({
        id: data.data._id,
        firstName: data.data.firstName,
        lastName: data.data.lastName,
        email: data.data.email,
      }));
      
      setToken(data.data.token);
      setCurrentUser({
        id: data.data._id,
        firstName: data.data.firstName,
        lastName: data.data.lastName,
        email: data.data.email,
      });
      
      return data.data;
    } catch (error) {
      throw error;
    }
  };

  // Login user
  const login = async (email, password) => {
    try {
      const data = await makeRequest('/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      
      // Save the token and user to localStorage and state
      localStorage.setItem('token', data.data.token);
      localStorage.setItem('user', JSON.stringify({
        id: data.data._id,
        firstName: data.data.firstName,
        lastName: data.data.lastName,
        email: data.data.email,
      }));
      
      setToken(data.data.token);
      setCurrentUser({
        id: data.data._id,
        firstName: data.data.firstName,
        lastName: data.data.lastName,
        email: data.data.email,
      });
      
      return data.data;
    } catch (error) {
      throw error;
    }
  };

  // Logout user
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setCurrentUser(null);
  };

  // Get user profile
  const getUserProfile = async () => {
    try {
      const data = await makeRequest('/auth/me', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      
      return data.data;
    } catch (error) {
      throw error;
    }
  };

  // Update user profile
  const updateUserProfile = async (userData) => {
    try {
      const data = await makeRequest('/users/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(userData),
      });
      
      // Update the user in localStorage and state
      localStorage.setItem('user', JSON.stringify({
        ...currentUser,
        firstName: data.data.firstName,
        lastName: data.data.lastName,
        email: data.data.email,
      }));
      
      setCurrentUser({
        ...currentUser,
        firstName: data.data.firstName,
        lastName: data.data.lastName,
        email: data.data.email,
      });
      
      return data.data;
    } catch (error) {
      throw error;
    }
  };

  const value = {
    currentUser,
    token,
    loading,
    register,
    login,
    logout,
    getUserProfile,
    updateUserProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}; 