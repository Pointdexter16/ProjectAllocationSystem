import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Building2, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  
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
      newErrors.email = 'Email is required';
    } else {
      const emailRegex = /^\S+@\S+\.[\w-]{2,}$/;
      if (!emailRegex.test(formData.email)) {
        newErrors.email = 'Please enter a valid email address';
      }
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
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
      const message = result.error || 'Login failed';
      toast.error(message);
      // Map common backend errors to field-specific errors
      const lower = String(message).toLowerCase();
      const mapped = {};
      if (lower.includes('password')) {
        mapped.password = message;
      }
      if (lower.includes('user not found') || lower.includes('email') || lower.includes('user')) {
        mapped.email = message;
      }
      // Only show a global error if it wasn't mapped to a field
      if (!mapped.password && !mapped.email) {
        mapped.global = message;
      }
      setErrors(mapped);
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
                label="Email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                error={errors.email}
                required
                placeholder="you@example.com"
              />
              
              <div style={{ position: 'relative' }}>
                <Input
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  error={errors.password}
                  required
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  style={{
                    position: 'absolute',
                    right: 10,
                    top: 34,
                    background: 'transparent',
                    border: 'none',
                    padding: 4,
                    cursor: 'pointer'
                  }}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              {errors.global && !errors.email && !errors.password && (
                <p style={{ color: 'var(--danger-500)', marginTop: 8 }}>{errors.global}</p>
              )}
              
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