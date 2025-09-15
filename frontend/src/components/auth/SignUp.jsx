import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Building2, User, UserCheck } from 'lucide-react';
import toast from 'react-hot-toast';
import axios from 'axios';

const SignUp = () => {
  const [formData, setFormData] = useState({
    First_name: '',
    Last_name: '',
    Email: '',
    Password_hash: '',
    confirmPassword: '',
    Job_role: '',
    Staff_id: '',
    Joining_date: '',
    EmployeeJobRole: '',
    EmployeeStatus: 'active',
    Manager_id: '',  // will be selected from dropdown
  });

  const [managers, setManagers] = useState([]);
  const [errors, setErrors] = useState({});
  const { register, loading } = useAuth();
  const navigate = useNavigate();

  // Fetch managers for dropdown
  useEffect(() => {
    const fetchManagers = async () => {
      try {
        const res = await axios.get('http://localhost:8000/admin/'); // your router_admin endpoint
        setManagers(res.data); // expects [{staff_id, first_name, last_name}, ...]
      } catch (error) {
        console.error('Failed to fetch managers', error);
      }
    };
    fetchManagers();
  }, []);



  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleRoleChange = (role) => {
    setFormData(prev => ({ ...prev, Job_role: role }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.First_name) newErrors.First_name = 'First name is required';
    if (!formData.Last_name) newErrors.Last_name = 'Last name is required';
    if (!formData.Email) newErrors.Email = 'Email is required';
    if (!formData.Password_hash) newErrors.Password_hash = 'Password is required';
    if (formData.Password_hash !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    if (!formData.Staff_id) newErrors.Staff_id = 'Staff ID is required';
    if (formData.Job_role === 'employee' && !formData.EmployeeJobRole) newErrors.EmployeeJobRole = 'Employee Job Role is required';
    if (formData.Job_role === 'employee' && !formData.Manager_id) newErrors.Manager_id = 'Manager is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  if (!validateForm()) return;

  const payload = {
    First_name: formData.First_name,
    Last_name: formData.Last_name,
    Email: formData.Email,
    Password_hash: formData.Password_hash,
    Job_role: formData.Job_role,
    Staff_id: Number(formData.Staff_id),
  };

  if (formData.Job_role === 'employee') {
    payload.EmployeeJobRole = formData.EmployeeJobRole;
    payload.Joining_date = formData.Joining_date || null;
    payload.EmployeeStatus = formData.EmployeeStatus;
    payload.Manager_id = Number(formData.Manager_id);
  }

  // 1️⃣ Register the user
  const result = await register(payload);

  if (result.success) {
    try {
      // 2️⃣ Auto-login after registration
      await login({ email: formData.Email, password: formData.Password_hash });

      toast.success('Account created successfully!');
      navigate('/dashboard'); // redirect to dashboard
    } catch (loginError) {
      toast.success('Please login manually.');
      navigate('/login');
    }
  } else {
    toast.error(result.error);
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
                  variant={formData.Job_role === 'employee' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleRoleChange('employee')}
                >
                  <User className="w-4 h-4 mr-2" /> Employee
                </Button>
                <Button
                  type="button"
                  variant={formData.Job_role === 'manager' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleRoleChange('manager')}
                >
                  <UserCheck className="w-4 h-4 mr-2" /> Manager
                </Button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="login-form">
              <Input label="First Name" name="First_name" value={formData.First_name} onChange={handleChange} error={errors.First_name} required />
              <Input label="Last Name" name="Last_name" value={formData.Last_name} onChange={handleChange} error={errors.Last_name} required />
              <Input label="Email" type="email" name="Email" value={formData.Email} onChange={handleChange} error={errors.Email} required />
              <Input label="Password" type="password" name="Password_hash" value={formData.Password_hash} onChange={handleChange} error={errors.Password_hash} required />
              <Input label="Confirm Password" type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} error={errors.confirmPassword} required />
              <Input label="Staff ID" type="number" name="Staff_id" value={formData.Staff_id} onChange={handleChange} error={errors.Staff_id} required />

              {formData.Job_role === 'employee' && (
                <>
                  <label className="block mb-2 font-medium">Job Role</label>
                  <select name="EmployeeJobRole" value={formData.EmployeeJobRole} onChange={handleChange} className="input">
                    <option value="">Select Job Role</option>
                    <option value="Frontend">Frontend</option>
                    <option value="Backend">Backend</option>
                    <option value="BFF">BFF</option>
                  </select>
                  {errors.EmployeeJobRole && <p className="text-red-500">{errors.EmployeeJobRole}</p>}

                  <Input label="Joining Date" type="date" name="Joining_date" value={formData.Joining_date} onChange={handleChange} />

                  <label className="block mb-2 font-medium">Select Manager</label>
                  <select name="Manager_id" value={formData.Manager_id} onChange={handleChange} className="input">
                    <option value="">Select Manager</option>
                    {managers.map(manager => (
                      <option key={manager.staff_id} value={manager.staff_id}>
                        {manager.first_name} {manager.last_name} (ID: {manager.staff_id})
                      </option>
                    ))}
                  </select>
                  {errors.Manager_id && <p className="text-red-500">{errors.Manager_id}</p>}
                </>
              )}

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Creating...' : 'Create Account'}
              </Button>
            </form>

            <div className="signup-login-link">
              <p>Already have an account? <button onClick={() => navigate('/login')} className="signup-login-btn">Sign In</button></p>
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
