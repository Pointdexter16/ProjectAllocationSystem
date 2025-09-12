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
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'employee',
    staff_id: '', // Assuming you enter this manually or generate it elsewhere
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
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.first_name) newErrors.first_name = 'First name is required';
    if (!formData.last_name) newErrors.last_name = 'Last name is required';
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.password) newErrors.password = 'Password is required';
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    if (!formData.staff_id) newErrors.staff_id = 'Staff ID is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const payload = {
      first_name: formData.first_name,
      last_name: formData.last_name,
      email: formData.email,
      password: formData.password,
      role: formData.role,
      staff_id: Number(formData.staff_id),
    };

    const result = await register(payload);
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

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-header">
          <div className="login-logo">
            <div className="login-logo-icon">
              <Building2 style={{ width: '32px', height: '32px', color: 'white' }} />
            </div>
          </div>
          <h1 className="login-title">Project Allocation System</h1>
          <p className="login-subtitle">Create your account to get started</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Create Account</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="role-selection">
              <p className="role-selection-label">Select Account Type:</p>
              <div className="role-buttons">
                <Button
                  type="button"
                  variant={formData.role === 'employee' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleRoleChange('employee')}
                >
                  <User className="w-4 h-4 mr-2" /> Employee
                </Button>
                <Button
                  type="button"
                  variant={formData.role === 'manager' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleRoleChange('manager')}
                >
                  <UserCheck className="w-4 h-4 mr-2" /> Manager
                </Button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="login-form">
              <Input
                label="First Name"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                error={errors.first_name}
                required
              />

              <Input
                label="Last Name"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                error={errors.last_name}
                required
              />

              <Input
                label="Email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                error={errors.email}
                required
              />

              <Input
                label="Password"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                error={errors.password}
                required
              />

              <Input
                label="Confirm Password"
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                error={errors.confirmPassword}
                required
              />

              <Input
                label="Staff ID"
                type="number"
                name="staff_id"
                value={formData.staff_id}
                onChange={handleChange}
                error={errors.staff_id}
                required
              />

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Creating...' : 'Create Account'}
              </Button>
            </form>

            <div className="signup-login-link">
              <p>
                Already have an account?{' '}
                <button onClick={() => navigate('/login')} className="signup-login-btn">
                  Sign In
                </button>
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="login-footer">
          <p>© 2024 Project Allocation System. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
