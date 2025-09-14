import React, { useState, useEffect } from 'react';
import { useEmployees } from '../../contexts/EmployeeContext';
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
  const { employees, addEmployee, updateEmployee, deleteEmployee } = useEmployees();
  const [removedLocalState] = useState([
    {
      id: 1,
      name: 'Alice Johnson',
      email: 'alice.johnson@company.com',
      phone: '+1 (555) 123-4567',
      role: 'Frontend Developer',
      department: 'Engineering',
      status: 'active',
      joinDate: '2023-01-15',
      salary: 75000,
      location: 'New York, NY',
      avatar: 'AJ',
      skills: ['React', 'JavaScript', 'CSS', 'TypeScript'],
      capacity: {
        totalHours: 40, // Total weekly capacity
        allocatedHours: 32, // Currently allocated hours
        availableHours: 8, // Available hours
        utilizationRate: 80 // Percentage utilization
      },
      currentProjects: [
        { id: 1, name: 'E-commerce Platform', role: 'Lead Developer', allocatedHours: 20 },
        { id: 3, name: 'Data Analytics Dashboard', role: 'Frontend Developer', allocatedHours: 12 }
      ]
    },
    {
      id: 2,
      name: 'Bob Wilson',
      email: 'bob.wilson@company.com',
      phone: '+1 (555) 234-5678',
      role: 'Backend Developer',
      department: 'Engineering',
      status: 'active',
      joinDate: '2022-08-20',
      salary: 80000,
      location: 'San Francisco, CA',
      avatar: 'BW',
      skills: ['Node.js', 'Python', 'MongoDB', 'AWS'],
      capacity: {
        totalHours: 40,
        allocatedHours: 25,
        availableHours: 15,
        utilizationRate: 62.5
      },
      currentProjects: [
        { id: 1, name: 'E-commerce Platform', role: 'Backend Developer', allocatedHours: 25 }
      ]
    },
    {
      id: 3,
      name: 'Carol Davis',
      email: 'carol.davis@company.com',
      phone: '+1 (555) 345-6789',
      role: 'UI/UX Designer',
      department: 'Design',
      status: 'active',
      joinDate: '2023-03-10',
      salary: 70000,
      location: 'Austin, TX',
      avatar: 'CD',
      skills: ['Figma', 'Adobe XD', 'Sketch', 'Prototyping'],
      capacity: {
        totalHours: 40,
        allocatedHours: 38,
        availableHours: 2,
        utilizationRate: 95
      },
      currentProjects: [
        { id: 1, name: 'E-commerce Platform', role: 'UI/UX Designer', allocatedHours: 18 },
        { id: 2, name: 'Mobile App Redesign', role: 'Lead Designer', allocatedHours: 20 }
      ]
    },
    {
      id: 4,
      name: 'David Brown',
      email: 'david.brown@company.com',
      phone: '+1 (555) 456-7890',
      role: 'QA Engineer',
      department: 'Quality',
      status: 'active',
      joinDate: '2022-11-05',
      salary: 65000,
      location: 'Seattle, WA',
      avatar: 'DB',
      skills: ['Selenium', 'Jest', 'Cypress', 'Manual Testing'],
      capacity: {
        totalHours: 40,
        allocatedHours: 15,
        availableHours: 25,
        utilizationRate: 37.5
      },
      currentProjects: [
        { id: 1, name: 'E-commerce Platform', role: 'QA Engineer', allocatedHours: 15 }
      ]
    },
    {
      id: 5,
      name: 'Eva Martinez',
      email: 'eva.martinez@company.com',
      phone: '+1 (555) 567-8901',
      role: 'DevOps Engineer',
      department: 'Engineering',
      status: 'active',
      joinDate: '2023-05-12',
      salary: 85000,
      location: 'Denver, CO',
      avatar: 'EM',
      skills: ['Docker', 'Kubernetes', 'AWS', 'Jenkins'],
      capacity: {
        totalHours: 40,
        allocatedHours: 30,
        availableHours: 10,
        utilizationRate: 75
      },
      currentProjects: [
        { id: 1, name: 'E-commerce Platform', role: 'DevOps Engineer', allocatedHours: 15 },
        { id: 4, name: 'API Integration Platform', role: 'DevOps Engineer', allocatedHours: 15 }
      ]
    },
    {
      id: 6,
      name: 'Frank Miller',
      email: 'frank.miller@company.com',
      phone: '+1 (555) 678-9012',
      role: 'Mobile Developer',
      department: 'Engineering',
      status: 'active',
      joinDate: '2022-12-01',
      salary: 78000,
      location: 'Los Angeles, CA',
      avatar: 'FM',
      skills: ['React Native', 'Swift', 'Kotlin', 'Flutter'],
      capacity: {
        totalHours: 40,
        allocatedHours: 35,
        availableHours: 5,
        utilizationRate: 87.5
      },
      currentProjects: [
        { id: 2, name: 'Mobile App Redesign', role: 'Mobile Developer', allocatedHours: 35 }
      ]
    },
    {
      id: 7,
      name: 'Grace Lee',
      email: 'grace.lee@company.com',
      phone: '+1 (555) 789-0123',
      role: 'UI/UX Designer',
      department: 'Design',
      status: 'on-leave',
      joinDate: '2023-02-14',
      salary: 72000,
      location: 'Chicago, IL',
      avatar: 'GL',
      skills: ['Figma', 'User Research', 'Wireframing', 'Prototyping'],
      capacity: {
        totalHours: 40,
        allocatedHours: 0,
        availableHours: 0,
        utilizationRate: 0
      },
      currentProjects: [
        { id: 2, name: 'Mobile App Redesign', role: 'UI/UX Designer', allocatedHours: 0 }
      ]
    },
    {
      id: 8,
      name: 'Henry Taylor',
      email: 'henry.taylor@company.com',
      phone: '+1 (555) 890-1234',
      role: 'Product Manager',
      department: 'Product',
      status: 'active',
      joinDate: '2021-09-15',
      salary: 95000,
      location: 'Boston, MA',
      avatar: 'HT',
      skills: ['Product Strategy', 'Agile', 'Analytics', 'Leadership'],
      capacity: {
        totalHours: 40,
        allocatedHours: 20,
        availableHours: 20,
        utilizationRate: 50
      },
      currentProjects: [
        { id: 2, name: 'Mobile App Redesign', role: 'Product Manager', allocatedHours: 20 }
      ]
    }
  ]);

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
    const matchesSearch = employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         employee.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         employee.department.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDepartment = departmentFilter === 'all' || employee.department === departmentFilter;
    const matchesStatus = statusFilter === 'all' || employee.status === statusFilter;
    
    const availabilityStatus = getAvailabilityStatus(employee.capacity.utilizationRate);
    const matchesAvailability = availabilityFilter === 'all' || availabilityStatus === availabilityFilter;
    
    return matchesSearch && matchesDepartment && matchesStatus && matchesAvailability;
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
        <Button onClick={handleCreateEmployee}>
          <Plus style={{ width: '16px', height: '16px', marginRight: '8px' }} />
          Add Employee
        </Button>
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
                <option value="on-leave">On Leave</option>
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
                  <div className="employee-avatar" style={{ backgroundColor: getDepartmentColor(employee.department) }}>
                    {employee.avatar}
                  </div>
                  <div className="employee-info">
                    <h3 className="employee-name">{employee.name}</h3>
                    <p className="employee-role">{employee.role}</p>
                    <div className="employee-badges">
                      <Badge variant={getStatusBadge(employee.status)}>
                        {employee.status.replace('-', ' ')}
                      </Badge>
                      {/* <Badge variant="secondary">{employee.department}</Badge> */}
                    </div>
                  </div>
                </div>
                {/* <div className="employee-actions">
                  <Button variant="ghost" size="sm">
                    <MoreVertical style={{ width: '16px', height: '16px' }} />
                  </Button>
                </div> */}
              </div>

              <div className="employee-details">
                <div className="contact-info">
                  <div className="contact-item">
                    <Mail style={{ width: '14px', height: '14px' }} />
                    <span>{employee.email}</span>
                  </div>
                  <div className="contact-item">
                    <Phone style={{ width: '14px', height: '14px' }} />
                    <span>{employee.phone}</span>
                  </div>
                  {/* <div className="contact-item">
                    <MapPin style={{ width: '14px', height: '14px' }} />
                    <span>{employee.location}</span>
                  </div> */}
                </div>

                {/* <div className="skills-section">
                  <h4>Skills</h4>
                  <div className="skills-list">
                    {employee.skills.slice(0, 3).map((skill, index) => (
                      <span key={index} className="skill-tag">{skill}</span>
                    ))}
                    {employee.skills.length > 3 && (
                      <span className="skill-tag more">+{employee.skills.length - 3}</span>
                    )}
                  </div>
                </div> */}

                <div className="capacity-section">
                  <h4>Capacity & Workload</h4>
                  <div className="capacity-info">
                    {/* <div className="capacity-stats">
                      <span className="capacity-label">Allocated: {employee.capacity.allocatedHours}h</span>
                      <span className="capacity-label">Available: {employee.capacity.availableHours}h</span>
                    </div> */}
                    <div className="capacity-bar">
                      <div 
                        className="capacity-fill" 
                        style={{ 
                          width: `${employee.capacity.utilizationRate}%`,
                          backgroundColor: employee.capacity.utilizationRate > 90 ? 'var(--danger-500)' : 
                                         employee.capacity.utilizationRate > 75 ? 'var(--warning-500)' : 
                                         'var(--success-500)'
                        }}
                      ></div>
                    </div>
                    <span className="utilization-rate">{employee.capacity.utilizationRate}% utilized</span>
                  </div>
                </div>

                <div className="projects-section">
                  <h4>Current Projects ({employee.currentProjects.length})</h4>
                  <div className="projects-list">
                    {employee.currentProjects.slice(0, 2).map((project) => (
                      <div key={project.id} className="project-item">
                        <span className="project-name">{project.name}</span>
                        <span className="project-role">{project.role} ({project.allocatedHours}h)</span>
                      </div>
                    ))}
                    {employee.currentProjects.length > 2 && (
                      <div className="project-item more">
                        +{employee.currentProjects.length - 2} more projects
                      </div>
                    )}
                  </div>
                </div>

                <div className="employee-card-actions">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleViewEmployee(employee)}
                  >
                    View Details
                  </Button>
                  <div className="dropdown-container">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => toggleDropdown(employee.id)}
                      className="dropdown-trigger"
                    >
                      <MoreVertical style={{ width: '16px', height: '16px' }} />
                    </Button>
                    {dropdownOpen === employee.id && (
                      <div className="dropdown-menu">
                        <button 
                          className="dropdown-item"
                          onClick={() => handleEditEmployee(employee)}
                        >
                          <Edit style={{ width: '14px', height: '14px' }} />
                          Edit Employee
                        </button>
                        <button 
                          className="dropdown-item delete"
                          onClick={() => handleDeleteEmployee(employee)}
                        >
                          <Trash2 style={{ width: '14px', height: '14px' }} />
                          Delete Employee
                        </button>
                      </div>
                    )}
                  </div>
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
              <div className="employee-avatar large" style={{ backgroundColor: getDepartmentColor(selectedEmployee.department) }}>
                {selectedEmployee.avatar}
              </div>
              <div className="employee-modal-info">
                <h2>{selectedEmployee.name}</h2>
                <p className="role">{selectedEmployee.role}</p>
                <div className="badges">
                  <Badge variant={getStatusBadge(selectedEmployee.status)}>
                    {selectedEmployee.status.replace('-', ' ')}
                  </Badge>
                  <Badge variant="secondary">{selectedEmployee.department}</Badge>
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
                  <div className="detail-item">
                    <Phone style={{ width: '16px', height: '16px' }} />
                    <span>{selectedEmployee.phone}</span>
                  </div>
                  <div className="detail-item">
                    <MapPin style={{ width: '16px', height: '16px' }} />
                    <span>{selectedEmployee.location}</span>
                  </div>
                  <div className="detail-item">
                    <Calendar style={{ width: '16px', height: '16px' }} />
                    <span>Joined: {new Date(selectedEmployee.joinDate).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              <div className="detail-section">
                <h3>Skills & Expertise</h3>
                <div className="skills-grid">
                  {selectedEmployee.skills.map((skill, index) => (
                    <span key={index} className="skill-tag large">{skill}</span>
                  ))}
                </div>
              </div>

              <div className="detail-section">
                <h3>Current Projects</h3>
                <div className="projects-detailed">
                  {selectedEmployee.currentProjects.map((project) => (
                    <div key={project.id} className="project-detailed">
                      <h4>{project.name}</h4>
                      <p>{project.role}</p>
                    </div>
                  ))}
                </div>
              </div>
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
