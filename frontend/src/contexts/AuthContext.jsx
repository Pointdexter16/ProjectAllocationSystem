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
        token: action.payload.token || null,
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

  // Set axios Authorization header when token changes
  useEffect(() => {
    if (state.token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${state.token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  }, [state.token]);

  // Restore session on app start
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
      const response = await axios.post('http://localhost:8000/user/login', {
        email: credentials.email,
        password: credentials.password,
      });

      // const { user, token } = response.data;
      const { token, Email, First_name, Last_name, Job_role, Staff_id } = response.data;

      // Manually create a user object
      const user = { Email, First_name, Last_name, Job_role, Staff_id };
      console.log("User", user);

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      dispatch({ type: 'LOGIN_SUCCESS', payload: { user, token } });

      return { success: true };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Login failed';
      dispatch({ type: 'LOGIN_FAILURE', payload: errorMessage });
      return { success: false, error: errorMessage };
    }
  };

  const register = async (credentials) => {
  dispatch({ type: 'REGISTER_START' });
  try {
    const endpoint = 'http://localhost:8000/user';

    // Build payload dynamically
    const payload = {
      First_name: credentials.First_name,
      Last_name: credentials.Last_name,
      Email: credentials.Email,
      Password_hash: credentials.Password_hash,
      Job_role: credentials.Job_role,
      Staff_id: credentials.Staff_id,
    };
   
    // Include optional fields only for employees
    if (credentials.Job_role === 'employee') {
      payload.Joining_date = credentials.Joining_date
        ? new Date(credentials.Joining_date).toISOString()
        : new Date().toISOString();
      payload.Job_title = credentials.Job_title || '';
      payload.EmployeeStatus = credentials.EmployeeStatus || 'active';
      payload.Manager_id = credentials.Manager_id ? Number(credentials.Manager_id) : null;
    }

    const response = await axios.post(endpoint, payload);

    const user = response.data;

    // Usually, registration APIs don’t return a token,
    // so token remains null or you might login automatically after registration.

    localStorage.setItem('user', JSON.stringify(user));
    dispatch({ type: 'REGISTER_SUCCESS', payload: { user, token: null } });

    return { success: true };
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'Registration failed';
    dispatch({ type: 'REGISTER_FAILURE', payload: errorMessage });
    return { success: false, error: errorMessage };
  }
};


  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    dispatch({ type: 'LOGOUT' });
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        register,
        logout,
      }}
    >
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