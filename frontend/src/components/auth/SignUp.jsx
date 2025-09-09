import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Building2, Mail, Lock, User, UserCheck } from 'lucide-react';
import toast from 'react-hot-toast';

const SignUp = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'employee'
  });
  const [errors, setErrors] = useState({});
  
  const { register, loading } = useAuth();
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
    
    if (!formData.firstName) {
      newErrors.firstName = 'First name is required';
    } else if (formData.firstName.length < 2) {
      newErrors.firstName = 'First name must be at least 2 characters';
    }
    
    if (!formData.lastName) {
      newErrors.lastName = 'Last name is required';
    } else if (formData.lastName.length < 2) {
      newErrors.lastName = 'Last name must be at least 2 characters';
    }
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    const result = await register({
      name: `${formData.firstName} ${formData.lastName}`,
      email: formData.email,
      password: formData.password,
      role: formData.role
    });
    
    if (result.success) {
      toast.success('Account created successfully!');
      navigate('/dashboard');
    } else {
      toast.error(result.error);
    }
  };

  const handleRoleChange = (role) => {
    setFormData(prev => ({
      ...prev,
      role
    }));
  };

  const navigateToLogin = () => {
    navigate('/login');
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
            Create your account to get started
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Create Account</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Role Selection */}
            <div className="role-selection">
              <p className="role-selection-label">Select Account Type:</p>
              <div className="role-buttons">
                <Button
                  type="button"
                  variant={formData.role === 'employee' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleRoleChange('employee')}
                  className="role-btn"
                >
                  <User className="w-4 h-4 mr-2" />
                  Employee
                </Button>
                <Button
                  type="button"
                  variant={formData.role === 'admin' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleRoleChange('admin')}
                  className="role-btn"
                >
                  <UserCheck className="w-4 h-4 mr-2" />
                  Admin
                </Button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="login-form">
              <Input
                label="First Name"
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                error={errors.firstName}
                required
                placeholder="Enter your first name"
              />

              <Input
                label="Last Name"
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                error={errors.lastName}
                required
                placeholder="Enter your last name"
              />

              <Input
                label="Email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                error={errors.email}
                required
                placeholder="Enter your email"
              />
              
              <Input
                label="Password"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                error={errors.password}
                required
                placeholder="Create a password"
              />

              <Input
                label="Confirm Password"
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                error={errors.confirmPassword}
                required
                placeholder="Confirm your password"
              />
              
              <Button
                type="submit"
                className="w-full"
                loading={loading}
                disabled={loading}
              >
                {loading ? 'Creating Account...' : 'Create Account'}
              </Button>
            </form>

            <div className="signup-login-link">
              <p className="signup-login-text">
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={navigateToLogin}
                  className="signup-login-btn"
                >
                  Sign In
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

export default SignUp;
