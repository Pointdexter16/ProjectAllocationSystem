import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext'; 
import axios from 'axios';
import '../../styles/projects.css';


import { 
  FolderOpen, 
  Users, 
  Calendar, 
  Plus, 
  Edit, 
  Trash2, 
  UserPlus,
  Search,
  Filter,
  MoreVertical
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import Modal from '../ui/Modal';
import Input from '../ui/Input';
import Select from '../ui/Select';

const ProjectsManagement = () => {
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [projects, setProjects] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loadingProjects, setLoadingProjects] = useState(false);
  const [errorProjects, setErrorProjects] = useState(null);
  const { user } = useAuth();
  const managerId = user?.Staff_id;
  // const managerId = 1; // Replace with dynamic value as needed
  // Fetch projects for a particular manager from backend on mount
  useEffect(() => {
    const fetchProjects = async () => {
      setLoadingProjects(true);
      setErrorProjects(null);
      try {
        const response = await axios.get(`http://localhost:8000/admin/project/${managerId}`);
        // Normalize backend project data to expected frontend property names
        const rawProjects = response.data.projects || [];
        const normalizedProjects = rawProjects.map(project => {
          console.log('Raw project:', project);
          // Map backend 'members' to frontend 'employees' for persistence
          const mappedEmployees = Array.isArray(project.members)
            ? project.members.map((m) => ({
                id: m.Staff_id ?? m.staff_id ?? m.id,
                name: m.EmployeeName ?? m.employeeName ?? '',
              }))
            : (project.employees ?? project.TeamMembers ?? []);

          return {
            id: project.id ?? project.ProjectId ?? project.ProjectID ?? project.project_id,
            name: project.name ?? project.ProjectName ?? '',
            description: project.description ?? project.ProjectDescription ?? '',
            status: project.status ?? project.projectStatus ?? project.ProjectStatus ?? 'Planning',
            priority: project.priority ?? project.projectPriority ?? project.ProjectPriority ?? 'medium',
            startDate: project.startDate ?? project.StartDate ?? '',
            endDate: project.endDate ?? project.EndDate ?? '',
            progress: project.progress ?? project.Progress ?? 0,
            budget: project.budget ?? project.Budget ?? 0,
            manager: project.manager ?? project.Manager ?? '',
            employees: mappedEmployees,
          };
        });
        console.log('Normalized projects:', normalizedProjects);
        setProjects(normalizedProjects);
      } catch (err) {
        console.error('Error fetching projects:', err);
        setErrorProjects(
          err.response?.data?.detail
            ? `Failed to fetch projects: ${err.response.data.detail}`
            : `Failed to fetch projects: ${err.message}`
        );
      } finally {
        setLoadingProjects(false);
      }
    };
   
      fetchProjects();
  
  }, [managerId]);

  // Fetch employees for the manager
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/admin/employees/manager/${managerId}`);
        const raw = response.data.employees || [];
        // Normalize employee shape from backend -> frontend expected fields
        const normalized = raw.map((e) => ({
          id: e.Staff_id,
          name: `${e.First_name ?? ''} ${e.Last_name ?? ''}`.trim(),
          role: e.Job_title || 'Employee',
          department: e.Department || 'General',
          avatar: `${(e.First_name || 'U')[0] ?? 'U'}${(e.Last_name || '')[0] ?? ''}`.toUpperCase(),
          status: (e.EmployeeStatus || 'active').toLowerCase(),
          capacity: { totalHours: 40, allocatedHours: 0, availableHours: 40, utilizationRate: 0 },
          currentProjects: []
        }));
        setEmployees(normalized);
        console.log('Fetched employees (normalized):', normalized);
      } catch (err) {
        console.error('Error fetching employees:', err);
      }
    };
    if (managerId) fetchEmployees();
  }, [managerId]);

  // Function to add a new project (POST to backend)
  const addProject = async (newProject) => {
    try {
      const response = await axios.post('http://localhost:8000/admin/project', newProject);
      if (response.data && response.data.project) {
        setProjects((prev) => [...prev, response.data.project]);
        setSuccessMessage('Project created successfully!');
        setShowSuccessPopup(true);
        setTimeout(() => setShowSuccessPopup(false), 2000);
      }
    } catch (err) {
      alert('Failed to add project: ' + (err.response?.data?.detail || err.message));
    }
  };

  // const [employees, setEmployees] = useState([
  //   { 
  //     id: 1, 
  //     name: 'Alice Johnson', 
  //     role: 'Frontend Developer', 
  //     department: 'Engineering', 
  //     avatar: 'AJ',
  //     status: 'active',
  //     capacity: { totalHours: 40, allocatedHours: 32, availableHours: 8, utilizationRate: 80 },
  //     currentProjects: []
  //   },
  //   { 
  //     id: 2, 
  //     name: 'Bob Wilson', 
  //     role: 'Backend Developer', 
  //     department: 'Engineering', 
  //     avatar: 'BW',
  //     status: 'active',
  //     capacity: { totalHours: 40, allocatedHours: 25, availableHours: 15, utilizationRate: 62.5 },
  //     currentProjects: []
  //   },
  //   { 
  //     id: 3, 
  //     name: 'Carol Davis', 
  //     role: 'UI/UX Designer', 
  //     department: 'Design', 
  //     avatar: 'CD',
  //     status: 'active',
  //     capacity: { totalHours: 40, allocatedHours: 38, availableHours: 2, utilizationRate: 95 },
  //     currentProjects: []
  //   },
  //   { 
  //     id: 4, 
  //     name: 'David Brown', 
  //     role: 'QA Engineer', 
  //     department: 'Quality', 
  //     avatar: 'DB',
  //     status: 'active',
  //     capacity: { totalHours: 40, allocatedHours: 15, availableHours: 25, utilizationRate: 37.5 },
  //     currentProjects: []
  //   },
  //   { 
  //     id: 5, 
  //     name: 'Eva Martinez', 
  //     role: 'DevOps Engineer', 
  //     department: 'Engineering', 
  //     avatar: 'EM',
  //     status: 'active',
  //     capacity: { totalHours: 40, allocatedHours: 30, availableHours: 10, utilizationRate: 75 },
  //     currentProjects: []
  //   },
  //   { 
  //     id: 6, 
  //     name: 'Frank Miller', 
  //     role: 'Mobile Developer', 
  //     department: 'Engineering', 
  //     avatar: 'FM',
  //     status: 'active',
  //     capacity: { totalHours: 40, allocatedHours: 35, availableHours: 5, utilizationRate: 87.5 },
  //     currentProjects: []
  //   },
  //   { 
  //     id: 7, 
  //     name: 'Grace Lee', 
  //     role: 'UI/UX Designer', 
  //     department: 'Design', 
  //     avatar: 'GL',
  //     status: 'active',
  //     capacity: { totalHours: 40, allocatedHours: 20, availableHours: 20, utilizationRate: 50 },
  //     currentProjects: []
  //   },
  //   { 
  //     id: 8, 
  //     name: 'Henry Taylor', 
  //     role: 'Product Manager', 
  //     department: 'Product', 
  //     avatar: 'HT',
  //     status: 'active',
  //     capacity: { totalHours: 40, allocatedHours: 20, availableHours: 20, utilizationRate: 50 },
  //     currentProjects: []
  //   },
  //   { 
  //     id: 9, 
  //     name: 'Ivy Chen', 
  //     role: 'Data Scientist', 
  //     department: 'Analytics', 
  //     avatar: 'IC',
  //     status: 'active',
  //     capacity: { totalHours: 40, allocatedHours: 28, availableHours: 12, utilizationRate: 70 },
  //     currentProjects: []
  //   },
  //   { 
  //     id: 10, 
  //     name: 'Jack Robinson', 
  //     role: 'Frontend Developer', 
  //     department: 'Engineering', 
  //     avatar: 'JR',
  //     status: 'active',
  //     capacity: { totalHours: 40, allocatedHours: 24, availableHours: 16, utilizationRate: 60 },
  //     currentProjects: []
  //   },
  //   { 
  //     id: 11, 
  //     name: 'Kate Williams', 
  //     role: 'Backend Developer', 
  //     department: 'Engineering', 
  //     avatar: 'KW',
  //     status: 'active',
  //     capacity: { totalHours: 40, allocatedHours: 32, availableHours: 8, utilizationRate: 80 },
  //     currentProjects: []
  //   },
  //   { 
  //     id: 12, 
  //     name: 'Leo Garcia', 
  //     role: 'Backend Developer', 
  //     department: 'Engineering', 
  //     avatar: 'LG',
  //     status: 'active',
  //     capacity: { totalHours: 40, allocatedHours: 16, availableHours: 24, utilizationRate: 40 },
  //     currentProjects: []
  //   },
  //   { 
  //     id: 13, 
  //     name: 'Mia Thompson', 
  //     role: 'DevOps Engineer', 
  //     department: 'Engineering', 
  //     avatar: 'MT',
  //     status: 'active',
  //     capacity: { totalHours: 40, allocatedHours: 22, availableHours: 18, utilizationRate: 55 },
  //     currentProjects: []
  //   },
  //   { 
  //     id: 14, 
  //     name: 'Noah Davis', 
  //     role: 'Frontend Developer', 
  //     department: 'Engineering', 
  //     avatar: 'ND',
  //     status: 'active',
  //     capacity: { totalHours: 40, allocatedHours: 18, availableHours: 22, utilizationRate: 45 },
  //     currentProjects: []
  //   },
  //   { 
  //     id: 15, 
  //     name: 'Olivia Wilson', 
  //     role: 'Product Designer', 
  //     department: 'Design', 
  //     avatar: 'OW',
  //     status: 'active',
  //     capacity: { totalHours: 40, allocatedHours: 26, availableHours: 14, utilizationRate: 65 },
  //     currentProjects: []
  //   }
  // ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [selectedProject, setSelectedProject] = useState(null);
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showEmployeesModal, setShowEmployeesModal] = useState(false);
  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const [newProject, setNewProject] = useState({
    name: '',
    description: '',
    status: 'Planning',
    priority: 'medium',
    startDate: '',
    endDate: '',
    budget: '',
    manager: ''
  });
  const [showEditProjectModal, setShowEditProjectModal] = useState(false);
  const [showDeleteProjectModal, setShowDeleteProjectModal] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [deletingProject, setDeletingProject] = useState(null);
  const [projectDropdownOpen, setProjectDropdownOpen] = useState(null);

  const getStatusBadge = (status) => {
  switch ((status || '').toLowerCase()) {
      case 'completed':
        return 'success';
      case 'in progress':
        return 'default';
      case 'planning':
        return 'warning';
      case 'on hold':
        return 'secondary';
      default:
        return 'default';
    }
  };

  const getPriorityBadge = (priority) => {
  switch ((priority || '').toLowerCase()) {
      case 'high':
        return 'danger';
      case 'medium':
        return 'warning';
      case 'low':
        return 'secondary';
      default:
        return 'default';
    }
  };

  const filteredProjects = projects.filter(project => {
  const matchesSearch = (project.name || project.ProjectName || '').toLowerCase().includes((searchTerm || '').toLowerCase()) ||
             ((project.description || project.ProjectDescription || '').toLowerCase().includes((searchTerm || '').toLowerCase()));
  const matchesStatus = statusFilter === 'all' || ((project.status || project.projectStatus || '').toLowerCase() === (statusFilter || '').toLowerCase());
  const matchesPriority = priorityFilter === 'all' || ((project.priority || project.projectPriority || '').toLowerCase() === (priorityFilter || '').toLowerCase());
    
  return matchesSearch && matchesStatus && matchesPriority;
  });

  const handleAssignEmployees = (projectId) => {
    setSelectedProject(projects.find(p => p.id === projectId));
    setSelectedEmployees(projects.find(p => p.id === projectId)?.employees.map(emp => emp.id) || []);
    setShowAssignModal(true);
  };

  const getCapacityStatus = (employee) => {
    if (!employee.capacity || typeof employee.capacity.utilizationRate !== 'number') {
      return 'low'; // Default to low if capacity data is missing
    }
    if (employee.capacity.utilizationRate >= 95) return 'overloaded';
    if (employee.capacity.utilizationRate >= 80) return 'high';
    if (employee.capacity.utilizationRate >= 50) return 'medium';
    return 'low';
  };

  const getCapacityColor = (status) => {
    switch (status) {
      case 'overloaded': return 'var(--danger-500)';
      case 'high': return 'var(--warning-500)';
      case 'medium': return 'var(--primary-500)';
      case 'low': return 'var(--success-500)';
      default: return 'var(--gray-400)';
    }
  };

  const getCapacityLabel = (status) => {
    switch (status) {
      case 'overloaded': return 'Overloaded';
      case 'high': return 'High Load';
      case 'medium': return 'Medium Load';
      case 'low': return 'Available';
      default: return 'Unknown';
    }
  };

  const updateEmployeeCapacity = (employeeId, projectId, allocatedHours, isAssigning = true) => {
    setEmployees(prevEmployees => 
      prevEmployees.map(emp => {
        if (emp.id === employeeId) {
          const currentAllocated = emp.capacity.allocatedHours;
          const newAllocated = isAssigning 
            ? currentAllocated + allocatedHours 
            : Math.max(0, currentAllocated - allocatedHours);
          const newAvailable = emp.capacity.totalHours - newAllocated;
          const newUtilizationRate = Math.round((newAllocated / emp.capacity.totalHours) * 100);

          // Update current projects
          let updatedProjects = [...(emp.currentProjects || [])];
          if (isAssigning) {
            const projectExists = updatedProjects.find(p => p.id === projectId);
            if (!projectExists) {
              const project = projects.find(p => p.id === projectId);
              updatedProjects.push({
                id: projectId,
                name: project?.name || 'Unknown Project',
                role: emp.role,
                allocatedHours: allocatedHours
              });
            }
          } else {
            updatedProjects = updatedProjects.filter(p => p.id !== projectId);
          }

          return {
            ...emp,
            capacity: {
              ...emp.capacity,
              allocatedHours: newAllocated,
              availableHours: newAvailable,
              utilizationRate: newUtilizationRate
            },
            currentProjects: updatedProjects
          };
        }
        return emp;
      })
    );
  };

  const handleSaveAssignment = async () => {
    if (!selectedProject) return;

    const previousEmployees = selectedProject.employees || [];
    const previousIds = previousEmployees.map((e) => e.id ?? e.Staff_id);
    const toAdd = selectedEmployees.filter((id) => !previousIds.includes(id));
    const toRemove = previousIds.filter((id) => !selectedEmployees.includes(id));

    // Prepare payload helpers per backend schema
    const mapStatus = (s) => {
      const val = (s || '').toLowerCase();
      if (val === 'in progress') return 'In Progress';
      if (val === 'completed') return 'Completed';
      return 'Not Started';
    };

    const projectId = selectedProject.id ?? selectedProject.ProjectId;
    const startISO = selectedProject.startDate ? new Date(selectedProject.startDate).toISOString() : new Date().toISOString();
    const endISO = selectedProject.endDate ? new Date(selectedProject.endDate).toISOString() : new Date().toISOString();
    const projStatus = mapStatus(selectedProject.status);

    try {
      // Call backend for additions
      const addPromises = toAdd.map((staffId) =>
        axios.post('http://localhost:8000/admin/member', {
          ProjectId: projectId,
          Staff_id: staffId,
          StartDate: startISO,
          EndDate: endISO,
          Project_status: projStatus,
        })
      );

      // Call backend for removals
      const removePromises = toRemove.map((staffId) =>
        axios.delete(`http://localhost:8000/admin/member/${projectId}/${staffId}`)
      );

      await Promise.all([...addPromises, ...removePromises]);

      // Update capacities locally
      const defaultHoursPerProject = 20;
      previousEmployees.forEach((prevEmp) => {
        if (toRemove.includes(prevEmp.id)) {
          updateEmployeeCapacity(prevEmp.id, projectId, defaultHoursPerProject, false);
        }
      });
      toAdd.forEach((empId) => {
        updateEmployeeCapacity(empId, projectId, defaultHoursPerProject, true);
      });

      // Update local project employees list based on latest selection
      const newEmployees = employees.filter((emp) => selectedEmployees.includes(emp.id));
      const updatedProjects = projects.map((project) =>
        (project.id === projectId ? { ...project, employees: newEmployees } : project)
      );
      setProjects(updatedProjects);

      setSuccessMessage('Team assignment updated successfully');
      setShowSuccessPopup(true);
      setTimeout(() => setShowSuccessPopup(false), 2000);

      setShowAssignModal(false);
      setSelectedProject(null);
      setSelectedEmployees([]);
    } catch (err) {
      console.error('Failed to update team assignment:', err);
      alert('Failed to update team assignment: ' + (err.response?.data?.detail || err.message));
    }
  };

  const handleShowEmployees = (project) => {
    setSelectedProject(project);
    setShowEmployeesModal(true);
  };

  const toggleEmployeeSelection = (employeeId) => {
    setSelectedEmployees(prev => 
      prev.includes(employeeId) 
        ? prev.filter(id => id !== employeeId)
        : [...prev, employeeId]
    );
  };

  const handleCreateProject = () => {
    setNewProject({
      name: '',
      description: '',
      status: 'Planning',
      priority: 'medium',
      startDate: '',
      endDate: '',
      budget: '',
      manager: ''
    });
    setSelectedEmployees([]);
    setShowProjectModal(true);
  };

  const handleSaveNewProject = () => {
    if (!newProject.name || !newProject.description) {
      alert('Please fill in required fields (Name and Description)');
      return;
    }

    // Capitalize priority for backend
    const priorityMap = {
      low: 'Low',
      medium: 'Medium',
      high: 'High'
    };
    const project = {
      ProjectName: newProject.name,
      ProjectDescription: newProject.description,
      StartDate: newProject.startDate,
      EndDate: newProject.endDate,
      projectStatus: newProject.status,
      projectPriority: priorityMap[newProject.priority?.toLowerCase()] || 'Medium',
      progress: 0,
      budget: parseFloat(newProject.budget) || 0,
      Manager_id: user?.Staff_id,
      employee_ids: selectedEmployees
    };

    // Send to backend and update local state only on success
    addProject(project);

    // Update employee capacity for assigned employees (after backend confirms)
    selectedEmployees.forEach(empId => {
      updateEmployeeCapacity(empId, project.id, 20, true); // Default 20 hours allocation
    });

    setShowProjectModal(false);
    setNewProject({
      name: '',
      description: '',
      status: 'Planning',
      priority: 'medium',
      startDate: '',
      endDate: '',
      budget: '',
      manager: ''
    });
    setSelectedEmployees([]);
  };

  const handleEditProject = (project) => {
    setEditingProject({
      ...project,
      budget: project.budget?.toString() || ''
    });
    setSelectedEmployees(project.employees?.map(emp => emp.id) || []);
    setShowEditProjectModal(true);
    setProjectDropdownOpen(null);
  };

  const handleSaveEditProject = () => {
    if (!editingProject.name || !editingProject.description) {
      alert('Please fill in required fields (Name and Description)');
      return;
    }

    const updatedProject = {
      ...editingProject,
      budget: parseFloat(editingProject.budget) || 0,
      employees: employees.filter(emp => selectedEmployees.includes(emp.id))
    };

    setProjects(projects.map(p => p.id === editingProject.id ? updatedProject : p));
    setShowEditProjectModal(false);
    setEditingProject(null);
    setSelectedEmployees([]);
  };

  const handleDeleteProject = (project) => {
    setDeletingProject(project);
    setShowDeleteProjectModal(true);
    setProjectDropdownOpen(null);
  };

  const confirmDeleteProject = async () => {
    if (deletingProject) {
      try {
        await axios.delete(`http://localhost:8000/admin/project/${deletingProject.id}`);
        setProjects(projects.filter(p => p.id !== deletingProject.id));
        setShowDeleteProjectModal(false);
        setDeletingProject(null);
      } catch (err) {
        alert('Failed to delete project: ' + (err.response?.data?.detail || err.message));
      }
    }
  };

  const toggleProjectDropdown = (projectId) => {
    setProjectDropdownOpen(projectDropdownOpen === projectId ? null : projectId);
  };

  return (
    <div className="projects-management">
      {showSuccessPopup && (
        <div style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          background: 'var(--success-500)',
          color: 'white',
          padding: '12px 24px',
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
          zIndex: 9999
        }}>
          {successMessage}
        </div>
      )}
      {/* Header */}
      <div className="projects-header">
        <div className="projects-header-content">
          <h1 className="page-title">Projects Management</h1>
          <p className="page-description">Manage all projects and assign team members</p>
        </div>


        <Button onClick={handleCreateProject}>
          <Plus style={{ width: '16px', height: '16px', marginRight: '8px' }} />
          New Project
        </Button>

      
      </div>

      {/* Filters */}
      <Card className="projects-filters">
        <CardContent>
          <div className="filters-row">
            <div className="search-box">
              <Search style={{ width: '16px', height: '16px' }} />
              <Input
                placeholder="Search projects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>
            <div className="filter-controls">
              <Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="not started">Not Started</option>
                <option value="in progress">In Progress</option>
                <option value="completed">Completed</option>
             
              </Select>
              <Select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
              >
                <option value="all">All Priority</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Projects Grid */}
      <div className="projects-grid">
        {filteredProjects.map((project) => (
          <Card key={project.id} className="project-card">
            <CardHeader>
              <div className="project-card-header">
                <div className="project-info">
                  <CardTitle className="project-title">{project.name}</CardTitle>
                  <div className="project-badges">
                    <Badge variant={getStatusBadge(project.status)}>
                      {project.status}
                    </Badge>
                    <Badge variant={getPriorityBadge(project.priority)}>
                      {project.priority} priority
                    </Badge>
                  </div>
                </div>
                {/* <div className="project-actions">
                  <Button variant="ghost" size="sm">
                    <MoreVertical style={{ width: '16px', height: '16px' }} />
                  </Button>
                </div> */}
              </div>
            </CardHeader>
            <CardContent>
              <p className="project-description">{project.description}</p>
              
              <div className="project-details">
                <div className="project-meta">
                  <div className="meta-item">
                    <Calendar style={{ width: '14px', height: '14px' }} />
                    <span>{new Date(project.startDate).toLocaleDateString()} - {new Date(project.endDate).toLocaleDateString()}</span>
                  </div>
                  {/* <div className="meta-item">
                    <span className="budget">Budget: ${project.budget.toLocaleString()}</span>
                  </div> */}
                </div>

                <div className="progress-section">
                  <div className="progress-header">
                    <span>Progress</span>
                    <span>{project.progress}%</span>
                  </div>
                  <div className="progress-bar">
                    <div 
                      className="progress-fill" 
                      style={{ width: `${project.progress}%` }}
                    ></div>
                  </div>
                </div>

                <div className="team-section">
                  <div className="team-header">
                    <div className="team-info">
                      <Users style={{ width: '16px', height: '16px' }} />
                      <span>Team ({Array.isArray(project.employees) ? project.employees.length : 0})</span>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleShowEmployees(project)}
                    >
                      View All
                    </Button>
                  </div>
                  {/* <div className="team-avatars">
                    {project.employees.slice(0, 4).map((employee) => (
                      <div key={employee.id} className="team-avatar" title={employee.name}>
                        {employee.avatar}
                      </div>
                    ))}
                    {project.employees.length > 4 && (
                      <div className="team-avatar more">
                        +{project.employees.length - 4}
                      </div>
                    )}
                  </div> */}
                </div>

                <div className="project-card-actions">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleAssignEmployees(project.id)}
                  >
                    <UserPlus style={{ width: '14px', height: '14px', marginRight: '4px' }} />
                    Assign Team
                  </Button>
                  <div className="dropdown-container">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => toggleProjectDropdown(project.id)}
                      className="dropdown-trigger"
                    >
                      <MoreVertical style={{ width: '16px', height: '16px' }} />
                    </Button>
                    {projectDropdownOpen === project.id && (
                      <div className="dropdown-menu">
                        {console.log('Dropdown open for project:', project.id, 'State:', projectDropdownOpen)}
                        {/* <button 
                          className="dropdown-item"
                          onClick={() => handleEditProject(project)}
                        >
                          <Edit style={{ width: '14px', height: '14px' }} />
                          Edit Project
                        </button> */}
                        <button 
                          className="dropdown-item delete"
                          onClick={() => handleDeleteProject(project)}
                        >
                          <Trash2 style={{ width: '14px', height: '14px' }} />
                          Delete Project
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

      {/* New Project Modal */}
      <Modal
        isOpen={showProjectModal}
        onClose={() => setShowProjectModal(false)}
        title="Create New Project"
        size="lg"
      >
        <div className="project-modal-content">
          <div className="project-form">
            <div className="form-row">
              <div className="form-group">
                <label>Project Name *</label>
                <Input
                  value={newProject.name}
                  onChange={(e) => setNewProject({...newProject, name: e.target.value})}
                  placeholder="Enter project name"
                />
              </div>
              {/* <div className="form-group">
                <label>Manager</label>
                <Input
                  value={newProject.manager}
                  onChange={(e) => setNewProject({...newProject, manager: e.target.value})}
                  placeholder="Project manager name"
                />
              </div> */}
            </div>
            
            <div className="form-group">
              <label>Description *</label>
              <textarea
                className="form-textarea"
                value={newProject.description}
                onChange={(e) => setNewProject({...newProject, description: e.target.value})}
                placeholder="Project description"
                rows="3"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Status</label>
                <Select
                  value={newProject.status}
                  onChange={(e) => setNewProject({...newProject, status: e.target.value})}
                >
                  <option value="Not Started">Not Started</option>
                  <option value="In Progress">In Progress</option>
                  {/* <option value="On Hold">On Hold</option> */}
                  <option value="Completed">Completed</option>
                </Select>
              </div>
              <div className="form-group">
                <label>Priority</label>
                <Select
                  value={newProject.priority}
                  onChange={(e) => setNewProject({...newProject, priority: e.target.value})}
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </Select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Start Date</label>
                <Input
                  type="date"
                  value={newProject.startDate}
                  onChange={(e) => setNewProject({...newProject, startDate: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label>End Date</label>
                <Input
                  type="date"
                  value={newProject.endDate}
                  onChange={(e) => setNewProject({...newProject, endDate: e.target.value})}
                />
              </div>
            </div>

            {/* <div className="form-group">
              <label>Budget ($)</label>
              <Input
                type="number"
                value={newProject.budget}
                onChange={(e) => setNewProject({...newProject, budget: e.target.value})}
                placeholder="Project budget"
              />
            </div> */}

            {/* <div className="form-group">
              <label>Assign Team Members</label>
              <div className="employees-assignment">
                {employees.map((employee) => {
                  const capacityStatus = getCapacityStatus(employee);
                  return (
                    <div key={employee.id} className={`employee-item ${capacityStatus}`}>
                      <div className="employee-info">
                        <div className="employee-avatar">{employee.avatar}</div>
                        <div className="employee-details">
                          <h4>{employee.name}</h4>
                          <p>{employee.role} • {employee.department}</p>
                          <div className="capacity-indicator">
                            <div className="capacity-bar-small">
                              <div 
                                className="capacity-fill-small" 
                                style={{ 
                                  width: `${employee.capacity?.utilizationRate || 0}%`,
                                  backgroundColor: getCapacityColor(capacityStatus)
                                }}
                              ></div>
                            </div>
                            <span className="capacity-text" style={{ color: getCapacityColor(capacityStatus) }}>
                              {employee.capacity?.utilizationRate || 0}% - {getCapacityLabel(capacityStatus)}
                            </span>
                          </div>
                        </div>
                      </div>
                      <input
                        type="checkbox"
                        checked={selectedEmployees.includes(employee.id)}
                        onChange={() => toggleEmployeeSelection(employee.id)}
                        className="employee-checkbox"
                        disabled={employee.status !== 'active'}
                      />
                    </div>
                  );
                })}
              </div>
            </div> */}
          </div>
          
          <div className="modal-actions">
            <Button variant="outline" onClick={() => setShowProjectModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveNewProject}>
              Create Project
            </Button>
          </div>
        </div>
      </Modal>

      {/* Employee Assignment Modal */}
      <Modal
        isOpen={showAssignModal}
        onClose={() => setShowAssignModal(false)}
        title={`Assign Team - ${selectedProject?.name}`}
        size="lg"
      >
        <div className="assign-modal-content">
          <p className="assign-modal-description">
            Select employees to assign to this project. Check their capacity before assigning:
          </p>
          <div className="employees-list">
            {employees.map((employee) => {
              const capacityStatus = getCapacityStatus(employee);
              return (
                <div key={employee.id} className={`employee-item ${capacityStatus}`}>
                  <div className="employee-info">
                    <div className="employee-avatar">{employee.avatar}</div>
                    <div className="employee-details">
                      <h4>{employee.name}</h4>
                      <p>{employee.role} • {employee.department}</p>
                      <div className="capacity-indicator">
                        <div className="capacity-bar-small">
                          <div 
                            className="capacity-fill-small" 
                            style={{ 
                              width: `${employee.capacity?.utilizationRate || 0}%`,
                              backgroundColor: getCapacityColor(capacityStatus)
                            }}
                          ></div>
                        </div>
                        <span className="capacity-text" style={{ color: getCapacityColor(capacityStatus) }}>
                          {employee.capacity?.utilizationRate || 0}% - {getCapacityLabel(capacityStatus)}
                        </span>
                      </div>
                      <div className="capacity-details">
                        <span>Available: {employee.capacity?.availableHours || 40}h/week</span>
                        <span>Allocated: {employee.capacity?.allocatedHours || 0}h/week</span>
                      </div>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={selectedEmployees.includes(employee.id)}
                    onChange={() => toggleEmployeeSelection(employee.id)}
                    className="employee-checkbox"
                    disabled={employee.status !== 'active'}
                  />
                </div>
              );
            })}
          </div>
          <div className="modal-actions">
            <Button variant="outline" onClick={() => setShowAssignModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveAssignment}>
              Save Assignment
            </Button>
          </div>
        </div>
      </Modal>

      {/* View Employees Modal */}
      <Modal
        isOpen={showEmployeesModal}
        onClose={() => setShowEmployeesModal(false)}
        title={`Team Members - ${selectedProject?.name}`}
        size="md"
      >
        <div className="employees-modal-content">
          {selectedProject?.employees.length > 0 ? (
            <div className="employees-grid">
              {selectedProject.employees.map((employee) => (
                <div key={employee.id} className="employee-card">
                  <div className="employee-avatar large">{employee.avatar}</div>
                  <div className="employee-info">
                    <h4>{employee.name}</h4>
                    <p>{employee.role}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <Users style={{ width: '48px', height: '48px', color: 'var(--gray-400)' }} />
              <p>No team members assigned to this project yet.</p>
            </div>
          )}
        </div>
      </Modal>

      {/* Edit Project Modal */}
      <Modal
        isOpen={showEditProjectModal}
        onClose={() => setShowEditProjectModal(false)}
        title="Edit Project"
        size="lg"
      >
        {editingProject && (
          <div className="project-modal-content">
            <div className="project-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Project Name *</label>
                  <Input
                    value={editingProject.name}
                    onChange={(e) => setEditingProject({...editingProject, name: e.target.value})}
                    placeholder="Enter project name"
                  />
                </div>
                <div className="form-group">
                  <label>Manager</label>
                  <Input
                    value={editingProject.manager}
                    onChange={(e) => setEditingProject({...editingProject, manager: e.target.value})}
                    placeholder="Project manager name"
                  />
                </div>
              </div>
              
              <div className="form-group">
                <label>Description *</label>
                <textarea
                  className="form-textarea"
                  value={editingProject.description}
                  onChange={(e) => setEditingProject({...editingProject, description: e.target.value})}
                  placeholder="Project description"
                  rows="3"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Status</label>
                  <Select
                    value={editingProject.status}
                    onChange={(e) => setEditingProject({...editingProject, status: e.target.value})}
                  >
                    {/* <option value="Planning">Planning</option> */}
                    <option value="In Progress">In Progress</option>
                    {/* <option value="On Hold">On Hold</option> */}
                    <option value="Completed">Completed</option>
                  </Select>
                </div>
                <div className="form-group">
                  <label>Priority</label>
                  <Select
                    value={editingProject.priority}
                    onChange={(e) => setEditingProject({...editingProject, priority: e.target.value})}
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </Select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Start Date</label>
                  <Input
                    type="date"
                    value={editingProject.startDate}
                    onChange={(e) => setEditingProject({...editingProject, startDate: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>End Date</label>
                  <Input
                    type="date"
                    value={editingProject.endDate}
                    onChange={(e) => setEditingProject({...editingProject, endDate: e.target.value})}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Budget ($)</label>
                <Input
                  type="number"
                  value={editingProject.budget}
                  onChange={(e) => setEditingProject({...editingProject, budget: e.target.value})}
                  placeholder="Project budget"
                />
              </div>

              <div className="form-group">
                <label>Assign Team Members</label>
                <div className="employees-assignment">
                  {employees.map((employee) => {
                    const capacityStatus = getCapacityStatus(employee);
                    return (
                      <div key={employee.id} className={`employee-item ${capacityStatus}`}>
                        <div className="employee-info">
                          <div className="employee-avatar">{employee.avatar}</div>
                          <div className="employee-details">
                            <h4>{employee.name}</h4>
                            <p>{employee.role} • {employee.department}</p>
                            <div className="capacity-indicator">
                              <div className="capacity-bar-small">
                                <div 
                                  className="capacity-fill-small" 
                                  style={{ 
                                    width: `${employee.capacity?.utilizationRate || 0}%`,
                                    backgroundColor: getCapacityColor(capacityStatus)
                                  }}
                                ></div>
                              </div>
                              <span className="capacity-text" style={{ color: getCapacityColor(capacityStatus) }}>
                                {employee.capacity?.utilizationRate || 0}% - {getCapacityLabel(capacityStatus)}
                              </span>
                            </div>
                          </div>
                        </div>
                        <input
                          type="checkbox"
                          checked={selectedEmployees.includes(employee.id)}
                          onChange={() => toggleEmployeeSelection(employee.id)}
                          className="employee-checkbox"
                          disabled={employee.status !== 'active'}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
            
            <div className="modal-actions">
              <Button variant="outline" onClick={() => setShowEditProjectModal(false)}>
                Cancel
              </Button>
              <Button onClick={handleSaveEditProject}>
                Save Changes
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Delete Project Confirmation Modal */}
      <Modal
        isOpen={showDeleteProjectModal}
        onClose={() => setShowDeleteProjectModal(false)}
        title="Delete Project"
        size="sm"
      >
        {deletingProject && (
          <div className="delete-modal-content">
            <div className="delete-modal-body">
              <div className="delete-icon">
                <Trash2 style={{ width: '48px', height: '48px', color: 'var(--danger-500)' }} />
              </div>
              <h3>Are you sure you want to delete this project?</h3>
              <p>
                This will permanently remove <strong>{deletingProject.name}</strong> and unassign all team members. 
                This action cannot be undone.
              </p>
            </div>
            
            <div className="modal-actions">
              <Button variant="outline" onClick={() => setShowDeleteProjectModal(false)}>
                Cancel
              </Button>
              <Button variant="danger" onClick={confirmDeleteProject}>
                Delete Project
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ProjectsManagement;
