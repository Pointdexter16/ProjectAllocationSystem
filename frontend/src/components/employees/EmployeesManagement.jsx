import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useEmployees } from '../../contexts/EmployeeContext';
import { useAuth } from '../../contexts/AuthContext';
import '../../styles/employees.css';
import { 
  Users, 
  Plus, 
  Edit, 
  Trash2, 
  Search,
  Filter,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Briefcase,
  MoreVertical
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import Modal from '../ui/Modal';
import Input from '../ui/Input';
import Select from '../ui/Select';

const EmployeesManagement = () => {
  const { employees, addEmployee, updateEmployee, deleteEmployee, setEmployees } = useEmployees();
  const { user } = useAuth();
  const managerId = user?.Staff_id;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [availabilityFilter, setAvailabilityFilter] = useState('all');
  const [newEmployee, setNewEmployee] = useState({
    name: '',
    email: '',
    phone: '',
    role: '',
    department: 'Engineering',
    status: 'active',
    joinDate: '',
    salary: '',
    location: '',
    skills: []
  });
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [showEmployeeModal, setShowEmployeeModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [deletingEmployee, setDeletingEmployee] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(null);

  useEffect(() => {
    const fetchEmployees = async () => {
      if (!managerId) return; // wait until auth is ready
      setLoading(true);
      setError(null);
      try {
        // Fetch employees under this manager only
        const endpoint = `http://localhost:8000/admin/employees/manager/${managerId}`;
        const response = await axios.get(endpoint);
        const raw = response.data?.employees ?? [];
        // Normalize to frontend minimal shape based on available backend fields
        const baseNormalized = (Array.isArray(raw) ? raw : []).map((e) => ({
          id: e.Staff_id,
          name: `${e.First_name ?? ''} ${e.Last_name ?? ''}`.trim(),
          email: e.Email ?? '',
          role: e.Job_title ?? 'Employee',
          status: (e.EmployeeStatus ?? 'active').toLowerCase(),
          avatar: `${(e.First_name || 'U')[0] ?? 'U'}${(e.Last_name || '')[0] ?? ''}`.toUpperCase(),
          managerId: e.Manager_id ?? null,
        }));
        // Fetch projects for each employee in parallel and attach
        const projResults = await Promise.all(
          baseNormalized.map((emp) =>
            axios
              .get(`http://localhost:8000/user/project/${emp.id}`)
              .then((res) => ({ id: emp.id, projects: res.data?.projects ?? [] }))
              .catch(() => ({ id: emp.id, projects: [] }))
          )
        );
        const projMap = {};
        projResults.forEach(({ id, projects }) => {
          projMap[id] = (projects || []).map((p) => ({
            id: p.ProjectId ?? p.project_id ?? p.id,
            name: p.ProjectName ?? p.project_name ?? p.name ?? 'Project',
          }));
        });
        const normalized = baseNormalized.map((emp) => ({
          ...emp,
          currentProjects: projMap[emp.id] ?? [],
        }));
        setEmployees(normalized);
      } catch (err) {
        setError('Failed to fetch employees');
      } finally {
        setLoading(false);
      }
    };
    fetchEmployees();
  }, [managerId, setEmployees]);

  const getStatusBadge = (status) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'success';
      case 'on-leave':
        return 'warning';
      case 'inactive':
        return 'secondary';
      default:
        return 'default';
    }
  };

  const getDepartmentColor = (department) => {
    const colors = {
      'Engineering': 'var(--primary-600)',
      'Design': 'var(--purple-600)',
      'Product': 'var(--orange-600)',
      'Quality': 'var(--success-600)',
      'Analytics': 'var(--indigo-600)',
      'Marketing': 'var(--pink-600)'
    };
    return colors[department] || 'var(--gray-600)';
  };

  const getAvailabilityStatus = (utilizationRate) => {
    if (utilizationRate >= 95) return 'overloaded';
    if (utilizationRate >= 80) return 'high-load';
    if (utilizationRate >= 50) return 'medium-load';
    return 'available';
  };

  const handleCreateEmployee = () => {
    setNewEmployee({
      name: '',
      email: '',
      phone: '',
      role: '',
      department: 'Engineering',
      status: 'active',
      joinDate: '',
      salary: '',
      location: '',
      skills: []
    });
    setShowAddModal(true);
  };

  const generateAvatar = (name) => {
    const names = name.split(' ');
    return names.map(n => n.charAt(0)).join('').toUpperCase();
  };

  const handleSaveNewEmployee = () => {
    if (!newEmployee.name || !newEmployee.email || !newEmployee.role) {
      alert('Please fill in required fields (Name, Email, and Role)');
      return;
    }

    const employee = {
      id: employees.length + 1,
      name: newEmployee.name,
      email: newEmployee.email,
      phone: newEmployee.phone,
      role: newEmployee.role,
      department: newEmployee.department,
      status: newEmployee.status,
      joinDate: newEmployee.joinDate || new Date().toISOString().split('T')[0],
      salary: parseFloat(newEmployee.salary) || 0,
      location: newEmployee.location,
      avatar: generateAvatar(newEmployee.name),
      skills: newEmployee.skills,
      capacity: {
        totalHours: 40,
        allocatedHours: 0,
        availableHours: 40,
        utilizationRate: 0
      },
      currentProjects: []
    };

    addEmployee(employee);
    setShowAddModal(false);
    setNewEmployee({
      name: '',
      email: '',
      phone: '',
      role: '',
      department: 'Engineering',
      status: 'active',
      joinDate: '',
      salary: '',
      location: '',
      skills: []
    });
  };

  const handleEditEmployee = (employee) => {
    setEditingEmployee({
      ...employee,
      skills: employee.skills || []
    });
    setShowEditModal(true);
    setDropdownOpen(null);
  };

  const handleSaveEditEmployee = () => {
    if (!editingEmployee.name || !editingEmployee.email || !editingEmployee.role) {
      alert('Please fill in required fields (Name, Email, and Role)');
      return;
    }

    updateEmployee(editingEmployee.id, {
      ...editingEmployee,
      avatar: generateAvatar(editingEmployee.name)
    });
    
    setShowEditModal(false);
    setEditingEmployee(null);
  };

  const handleDeleteEmployee = (employee) => {
    setDeletingEmployee(employee);
    setShowDeleteModal(true);
    setDropdownOpen(null);
  };

  const confirmDeleteEmployee = () => {
    if (deletingEmployee) {
      deleteEmployee(deletingEmployee.id);
      setShowDeleteModal(false);
      setDeletingEmployee(null);
    }
  };

  const toggleDropdown = (employeeId) => {
    setDropdownOpen(dropdownOpen === employeeId ? null : employeeId);
  };

  const filteredEmployees = employees.filter(employee => {
    const matchesSearch = (employee.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (employee.role || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (employee.email || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || employee.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleViewEmployee = (employee) => {
    setSelectedEmployee(employee);
    setShowEmployeeModal(true);
  };

  const departments = [...new Set(employees.map(emp => emp.department))];

  return (
    <div className="employees-management">
      {/* Header */}
      <div className="employees-header">
        <div className="employees-header-content">
          <h1 className="page-title">Employee Management</h1>
          <p className="page-description">Manage team members and their project assignments</p>
        </div>
        {/* Backend-managed data only: hide manual Add Employee to avoid mismatch */}
        {/* <Button onClick={handleCreateEmployee}>
          <Plus style={{ width: '16px', height: '16px', marginRight: '8px' }} />
          Add Employee
        </Button> */}
      </div>

      {/* Stats Cards */}
      <div className="employee-stats">
        <Card className="stat-card">
          <CardContent>
            <div className="stat-content">
              <div className="stat-info">
                <h3>Total Employees</h3>
                <p className="stat-number">{employees.length}</p>
              </div>
              <div className="stat-icon">
                <Users style={{ width: '24px', height: '24px', color: 'var(--primary-600)' }} />
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* <Card className="stat-card">
          <CardContent>
            <div className="stat-content">
              <div className="stat-info">
                <h3>Active</h3>
                <p className="stat-number">{employees.filter(emp => emp.status === 'active').length}</p>
              </div>
              <div className="stat-icon">
                <Briefcase style={{ width: '24px', height: '24px', color: 'var(--success-600)' }} />
              </div>
            </div>
          </CardContent>
        </Card> */}
        
        {/* <Card className="stat-card">
          <CardContent>
            <div className="stat-content">
              <div className="stat-info">
                <h3>Departments</h3>
                <p className="stat-number">{departments.length}</p>
              </div>
              <div className="stat-icon">
                <Filter style={{ width: '24px', height: '24px', color: 'var(--orange-600)' }} />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="stat-card">
          <CardContent>
            <div className="stat-content">
              <div className="stat-info">
                <h3>On Leave</h3>
                <p className="stat-number">{employees.filter(emp => emp.status === 'on-leave').length}</p>
              </div>
              <div className="stat-icon">
                <Calendar style={{ width: '24px', height: '24px', color: 'var(--warning-600)' }} />
              </div>
            </div>
          </CardContent>
        </Card> */}
      </div>

      {/* Filters */}
      <Card className="employees-filters">
        <CardContent>
          <div className="filters-row">
            <div className="search-box">
              <Search style={{ width: '16px', height: '16px' }} />
              <Input
                placeholder="Search employees..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>
            <div className="filter-controls">
              {/* <Select
                value={departmentFilter}
                onChange={(e) => setDepartmentFilter(e.target.value)}
              >
                <option value="all">All Departments</option>
                {departments.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </Select> */}
              <Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </Select>
              {/* <Select
                value={availabilityFilter}
                onChange={(e) => setAvailabilityFilter(e.target.value)}
              >
                <option value="all">All Availability</option>
                <option value="available">Available (&lt; 50%)</option>
                <option value="medium-load">Medium Load (50-79%)</option>
                <option value="high-load">High Load (80-94%)</option>
                <option value="overloaded">Overloaded (≥ 95%)</option>
              </Select>*/}
            </div>
          </div> 
        </CardContent>
      </Card>

      {/* Employees Grid */}
      <div className="employees-grid">
        {filteredEmployees.map((employee) => (
          <Card key={employee.id} className="employee-card">
            <CardContent>
              <div className="employee-card-header">
                <div className="employee-basic-info">
                  <div className="employee-avatar" style={{ backgroundColor: 'var(--primary-600)' }}>
                    {employee.avatar}
                  </div>
                  <div className="employee-info">
                    <h3 className="employee-name">{employee.name}</h3>
                    <p className="employee-role">{employee.role}</p>
                    <div className="employee-badges">
                      <Badge variant={getStatusBadge(employee.status)}>
                        {employee.status.replace('-', ' ')}
                      </Badge>
                      {/* Only fields from backend shown */}
                    </div>
                  </div>
                </div>
                {/* Hide per-employee actions (Edit/Delete) as no backend endpoints are wired here */}
              </div>

              <div className="employee-details">
                <div className="contact-info">
                  <div className="contact-item">
                    <Mail style={{ width: '14px', height: '14px' }} />
                    <span>{employee.email}</span>
                  </div>
                  {/* Backend does not provide phone in the listed endpoints */}
                </div>

                {/* Hide skills section (no backend data) */}

                {/* Hide capacity & workload (no backend data) */}

                {/* Projects summary (show only if available) */}
                {(employee.currentProjects && employee.currentProjects.length > 0) && (
                  <div className="projects-section">
                    <h4>Projects ({employee.currentProjects.length})</h4>
                    <div className="projects-list">
                      {employee.currentProjects.slice(0, 3).map((project) => (
                        <div key={project.id} className="project-item">
                          <span className="project-name">{project.name}</span>
                        </div>
                      ))}
                      {employee.currentProjects.length > 3 && (
                        <div className="project-item more">+{employee.currentProjects.length - 3} more</div>
                      )}
                    </div>
                  </div>
                )}

                <div className="employee-card-actions">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleViewEmployee(employee)}
                  >
                    View Details
                  </Button>
                  {/* Hide Edit/Delete actions (no wired backend for these in scope) */}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Employee Details Modal */}
      <Modal
        isOpen={showEmployeeModal}
        onClose={() => setShowEmployeeModal(false)}
        title={selectedEmployee?.name}
        size="lg"
      >
        {selectedEmployee && (
          <div className="employee-modal-content">
            <div className="employee-modal-header">
              <div className="employee-avatar large" style={{ backgroundColor: 'var(--primary-600)' }}>
                {selectedEmployee.avatar}
              </div>
              <div className="employee-modal-info">
                <h2>{selectedEmployee.name}</h2>
                <p className="role">{selectedEmployee.role}</p>
                <div className="badges">
                  <Badge variant={getStatusBadge(selectedEmployee.status)}>
                    {selectedEmployee.status.replace('-', ' ')}
                  </Badge>
                  {/* No department in backend payload */}
                </div>
              </div>
            </div>

            <div className="employee-modal-details">
              <div className="detail-section">
                <h3>Contact Information</h3>
                <div className="detail-grid">
                  <div className="detail-item">
                    <Mail style={{ width: '16px', height: '16px' }} />
                    <span>{selectedEmployee.email}</span>
                  </div>
                  {/* Hide phone/location/join date (not in backend response) */}
                </div>
              </div>

              {/* Hide skills section */}

              {/* Hide projects detailed section */}
            </div>
          </div>
        )}
      </Modal>

      {/* Add Employee Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add New Employee"
        size="lg"
      >
        <div className="employee-form-content">
          <div className="employee-form">
            <div className="form-row">
              <div className="form-group">
                <label>Full Name *</label>
                <Input
                  value={newEmployee.name}
                  onChange={(e) => setNewEmployee({...newEmployee, name: e.target.value})}
                  placeholder="Enter full name"
                />
              </div>
              <div className="form-group">
                <label>Email *</label>
                <Input
                  type="email"
                  value={newEmployee.email}
                  onChange={(e) => setNewEmployee({...newEmployee, email: e.target.value})}
                  placeholder="employee@company.com"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Phone</label>
                <Input
                  type="tel"
                  value={newEmployee.phone}
                  onChange={(e) => setNewEmployee({...newEmployee, phone: e.target.value})}
                  placeholder="+1 (555) 123-4567"
                />
              </div>
              <div className="form-group">
                <label>Role *</label>
                <Input
                  value={newEmployee.role}
                  onChange={(e) => setNewEmployee({...newEmployee, role: e.target.value})}
                  placeholder="Job title/role"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Department</label>
                <Select
                  value={newEmployee.department}
                  onChange={(e) => setNewEmployee({...newEmployee, department: e.target.value})}
                >
                  <option value="Engineering">Engineering</option>
                  <option value="Design">Design</option>
                  <option value="Product">Product</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Sales">Sales</option>
                  <option value="HR">HR</option>
                  <option value="Finance">Finance</option>
                </Select>
              </div>
              <div className="form-group">
                <label>Status</label>
                <Select
                  value={newEmployee.status}
                  onChange={(e) => setNewEmployee({...newEmployee, status: e.target.value})}
                >
                  <option value="active">Active</option>
                  <option value="on-leave">On Leave</option>
                  <option value="inactive">Inactive</option>
                </Select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Join Date</label>
                <Input
                  type="date"
                  value={newEmployee.joinDate}
                  onChange={(e) => setNewEmployee({...newEmployee, joinDate: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label>Salary ($)</label>
                <Input
                  type="number"
                  value={newEmployee.salary}
                  onChange={(e) => setNewEmployee({...newEmployee, salary: e.target.value})}
                  placeholder="Annual salary"
                />
              </div>
            </div>

            <div className="form-group">
              <label>Location</label>
              <Input
                value={newEmployee.location}
                onChange={(e) => setNewEmployee({...newEmployee, location: e.target.value})}
                placeholder="City, State/Country"
              />
            </div>
          </div>
          
          <div className="modal-actions">
            <Button variant="outline" onClick={() => setShowAddModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveNewEmployee}>
              Add Employee
            </Button>
          </div>
        </div>
      </Modal>

      {/* Edit Employee Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="Edit Employee"
        size="lg"
      >
        {editingEmployee && (
          <div className="employee-form-content">
            <div className="employee-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Full Name *</label>
                  <Input
                    value={editingEmployee.name}
                    onChange={(e) => setEditingEmployee({...editingEmployee, name: e.target.value})}
                    placeholder="Enter full name"
                  />
                </div>
                <div className="form-group">
                  <label>Email *</label>
                  <Input
                    type="email"
                    value={editingEmployee.email}
                    onChange={(e) => setEditingEmployee({...editingEmployee, email: e.target.value})}
                    placeholder="employee@company.com"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Phone</label>
                  <Input
                    type="tel"
                    value={editingEmployee.phone}
                    onChange={(e) => setEditingEmployee({...editingEmployee, phone: e.target.value})}
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
                <div className="form-group">
                  <label>Role *</label>
                  <Input
                    value={editingEmployee.role}
                    onChange={(e) => setEditingEmployee({...editingEmployee, role: e.target.value})}
                    placeholder="Job title/role"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Department</label>
                  <Select
                    value={editingEmployee.department}
                    onChange={(e) => setEditingEmployee({...editingEmployee, department: e.target.value})}
                  >
                    <option value="Engineering">Engineering</option>
                    <option value="Design">Design</option>
                    <option value="Product">Product</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Sales">Sales</option>
                    <option value="HR">HR</option>
                    <option value="Finance">Finance</option>
                  </Select>
                </div>
                <div className="form-group">
                  <label>Status</label>
                  <Select
                    value={editingEmployee.status}
                    onChange={(e) => setEditingEmployee({...editingEmployee, status: e.target.value})}
                  >
                    <option value="active">Active</option>
                    <option value="on-leave">On Leave</option>
                    <option value="inactive">Inactive</option>
                  </Select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Join Date</label>
                  <Input
                    type="date"
                    value={editingEmployee.joinDate}
                    onChange={(e) => setEditingEmployee({...editingEmployee, joinDate: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>Salary ($)</label>
                  <Input
                    type="number"
                    value={editingEmployee.salary}
                    onChange={(e) => setEditingEmployee({...editingEmployee, salary: e.target.value})}
                    placeholder="Annual salary"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Location</label>
                <Input
                  value={editingEmployee.location}
                  onChange={(e) => setEditingEmployee({...editingEmployee, location: e.target.value})}
                  placeholder="City, State/Country"
                />
              </div>
            </div>
            
            <div className="modal-actions">
              <Button variant="outline" onClick={() => setShowEditModal(false)}>
                Cancel
              </Button>
              <Button onClick={handleSaveEditEmployee}>
                Save Changes
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Delete Employee Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete Employee"
        size="sm"
      >
        {deletingEmployee && (
          <div className="delete-modal-content">
            <div className="delete-modal-body">
              <div className="delete-icon">
                <Trash2 style={{ width: '48px', height: '48px', color: 'var(--danger-500)' }} />
              </div>
              <h3>Are you sure you want to delete this employee?</h3>
              <p>
                This will permanently remove <strong>{deletingEmployee.name}</strong> from the system. 
                This action cannot be undone.
              </p>
            </div>
            
            <div className="modal-actions">
              <Button variant="outline" onClick={() => setShowDeleteModal(false)}>
                Cancel
              </Button>
              <Button variant="danger" onClick={confirmDeleteEmployee}>
                Delete Employee
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default EmployeesManagement;
