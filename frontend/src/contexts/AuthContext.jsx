import React, { createContext, useContext, useReducer, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN_START':
    case 'REGISTER_START':
      return { ...state, loading: true, error: null };
    case 'LOGIN_SUCCESS':
    case 'REGISTER_SUCCESS':
      return { 
        ...state, 
        loading: false, 
        user: action.payload.user, 
        token: action.payload.token,
        isAuthenticated: true,
        error: null 
      };
    case 'LOGIN_FAILURE':
    case 'REGISTER_FAILURE':
      return { 
        ...state, 
        loading: false, 
        error: action.payload, 
        isAuthenticated: false 
      };
    case 'LOGOUT':
      return { 
        ...state, 
        user: null, 
        token: null, 
        isAuthenticated: false,
        error: null 
      };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    default:
      return state;
  }
};

const initialState = {
  user: null,
  token: localStorage.getItem('token'),
  isAuthenticated: false,
  loading: false,
  error: null
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Set up axios interceptor for token
  useEffect(() => {
    if (state.token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${state.token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  }, [state.token]);

  // Check if user is logged in on app start
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      try {
        const user = JSON.parse(userData);
        dispatch({ 
          type: 'LOGIN_SUCCESS', 
          payload: { user, token } 
        });
      } catch (error) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
  }, []);

  const login = async (credentials) => {
    dispatch({ type: 'LOGIN_START' });
    
    try {
      // Mock API call - replace with actual API endpoint
  //     const response = await axios.post('http://localhost:5000/api/auth/login', {
  //     employeeId: credentials.employeeId,
  //     password: credentials.password
  // });
      const response = await mockLogin(credentials);
      const { user, token } = response.data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      dispatch({ 
        type: 'LOGIN_SUCCESS', 
        payload: { user, token } 
      });
      
      return { success: true };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Login failed';
      dispatch({ 
        type: 'LOGIN_FAILURE', 
        payload: errorMessage 
      });
      return { success: false, error: errorMessage };
    }
  };

  const register = async (credentials) => {
    dispatch({ type: 'REGISTER_START' });
    
    try {
      // Mock API call - replace with actual API endpoint
      // const response = await axios.post('http://localhost:5000/api/auth/register', {
      //   name: credentials.name,
      //   email: credentials.email,
      //   password: credentials.password,
      //   role: credentials.role
      // });
      const response = await mockRegister(credentials);
      
      const { user, token } = response.data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      dispatch({ 
        type: 'REGISTER_SUCCESS', 
        payload: { user, token } 
      });
      
      return { success: true };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Registration failed';
      dispatch({ 
        type: 'REGISTER_FAILURE', 
        payload: errorMessage 
      });
      return { success: false, error: errorMessage };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    dispatch({ type: 'LOGOUT' });
  };

  const value = {
    ...state,
    login,
    register,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
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

// Mock login function - replace with actual API call
const mockLogin = async (credentials) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (credentials.employeeId === 'admin123' && credentials.password === 'admin123') {
        resolve({
          data: {
            user: {
              id: 1,
              name: 'Admin User',
              employeeId: 'admin123',
              email: 'admin@company.com',
              role: 'admin',
              avatar: null
            },
            token: 'mock-jwt-token-admin'
          }
        });
      } else if (credentials.employeeId === 'emp123' && credentials.password === 'emp123') {
        resolve({
          data: {
            user: {
              id: 2,
              name: 'John Employee',
              employeeId: 'emp123',
              email: 'employee@company.com',
              role: 'employee',
              avatar: null,
              skills: ['React', 'Node.js'],
              team: 'Development',
              weeklyCapacity: 40,
              currentWorkload: 25
            },
            token: 'mock-jwt-token-employee'
          }
        });
      } else {
        reject({
          response: {
            data: {
              message: 'Invalid employee ID or password'
            }
          }
        });
      }
    }, 1000);
  });
};

// Mock register function - replace with actual API call
const mockRegister = async (credentials) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (credentials.email === 'newuser@company.com' && credentials.password === 'newuser123') {
        resolve({
          data: {
            user: {
              id: 3,
              name: 'New User',
              email: 'newuser@company.com',
              role: 'employee',
              avatar: null
            },
            token: 'mock-jwt-token-newuser'
          }
        });
      } else {
        reject({
          response: {
            data: {
              message: 'Registration failed'
            }
          }
        });
      }
    }, 1000);
  });
};
