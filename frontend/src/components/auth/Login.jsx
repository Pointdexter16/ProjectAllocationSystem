import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Building2 } from 'lucide-react';
import toast from 'react-hot-toast';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  
  const [errors, setErrors] = useState({});
  
  const { login, loading } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email) {
      newErrors.email = 'Employee ID is required';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } 
    // else if (formData.password.length < 6) {
    //   newErrors.password = 'Password must be at least 6 characters';
    // }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    const result = await login(formData);
    
    if (result.success) {
    toast.success('Login successful!');
    const user = JSON.parse(localStorage.getItem('user'));
      navigate('/dashboard'); 
    
    }
    else {
      toast.error(result.error || 'Login failed');
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-header">
          <div className="login-logo">
            <div className="login-logo-icon">
              <Building2 style={{ width: '32px', height: '32px', color: 'white' }} />
            </div>
          </div>
          <h1 className="login-title">
            Project Allocation System
          </h1>
          <p className="login-subtitle">
            Sign in to manage your projects and tasks
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Sign In</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="login-form">
              <Input
                label="email"
                type="text"
                name="email"
                value={formData.email}
                onChange={handleChange}
                error={errors.email}
                required
                placeholder="Enter your employee ID"
              />
              
              <Input
                label="Password"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                error={errors.password}
                required
                placeholder="Enter your password"
              />
              
              <Button
                type="submit"
                className="w-full"
                loading={loading}
                disabled={loading}
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </Button>
            </form>

            <div className="login-signup-link">
              <p className="login-signup-text">
                Don&apos;t have an account?{' '}
                <button
                  type="button"
                  onClick={() => navigate('/signup')}
                  className="login-signup-btn"
                >
                  Create Account
                </button>
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="login-footer">
          <p> 2024 Project Allocation System. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default Login;