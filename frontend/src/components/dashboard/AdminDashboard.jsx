import React, { useState, useEffect, use } from 'react';
import axios from 'axios'; // Add this import
import CreateProjectModal from '../projects/CreateProjectModal';
// import NewProjectModal from '../projects/newProjectmodal';

import { 
  Users, 
  FolderOpen, 
  CheckSquare, 
  Clock, 
  TrendingUp, 
  AlertTriangle,
  Plus,
  MoreVertical
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import GanttChart from '../charts/GanttChart';
import '../../styles/dashboard.css';
import { useNavigate } from 'react-router-dom';


// Utility to calculate project status distribution percentages
function projectStatusDistribution(projects) {
  const total = projects.length;
  if (total === 0) return {};
  const statusCounts = {};
  projects.forEach(p => {
    const status = p.status || p.projectStatus;
    statusCounts[status] = (statusCounts[status] || 0) + 1;
  });
  const statusPercentages = {};
  Object.entries(statusCounts).forEach(([status, count]) => {
    statusPercentages[status] = Math.round((count / total) * 100 * 100) / 100;
  });
  return statusPercentages;
}

const AdminDashboard = () => {
  // Hardcode managerId for demo; replace with dynamic value as needed
  const managerId = 111;
  const [projects, setProjects] = useState([]);
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/admin/project/${managerId}`);
        // Map backend fields to frontend structure
        const fetchedProjects = response.data.projects.map(project => ({
          id: project.ProjectId,
          name: project.ProjectName,
          status: project.projectStatus,
          priority: project.projectPriority,
          // Add other fields as needed
        }));
        setProjects(fetchedProjects);
      } catch (error) {
        console.error('Failed to fetch projects for pie chart:', error);
      }
    };
    fetchProjects();
  }, [managerId]);
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalEmployees: 0,
    totalProjects: 0,
    activeProjects: 0,
    completedTasks: 156,
    pendingTasks: 42,
    totalWorkHours: 1920,
    utilizationRate: 78
  });
  const [showProjectModal, setShowProjectModal] = useState(false);
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
  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const [employees, setEmployees] = useState([]); // Populate with your employee data
  

  const [recentProjects, setRecentProjects] = useState([
    {
      id: 1,
      name: 'E-commerce Platform',
      status: 'In Progress',
      progress: 65,
      team: 5,
      deadline: '2024-02-15',
      priority: 'high'
    },
    {
      id: 2,
      name: 'Mobile App Redesign',
      status: 'Planning',
      progress: 25,
      team: 3,
      deadline: '2024-03-01',
      priority: 'medium'
    },
    {
      id: 3,
      name: 'Data Analytics Dashboard',
      status: 'In Progress',
      progress: 80,
      team: 4,
      deadline: '2024-01-30',
      priority: 'high'
    }
  ]);

  const [teamWorkload, setTeamWorkload] = useState([
    { name: 'Frontend Team', current: 32, capacity: 40, utilization: 80 },
    { name: 'Backend Team', current: 28, capacity: 35, utilization: 80 },
    { name: 'Design Team', current: 18, capacity: 25, utilization: 72 },
    { name: 'QA Team', current: 15, capacity: 20, utilization: 75 }
  ]);

  const statusPercentages = projectStatusDistribution(projects);
  const statusColors = {
    'Completed': '#22c55e',
    'In Progress': '#3b82f6',
    'Planning': '#f59e0b',
    'On Hold': '#ef4444'
  };
  const projectStatusData = Object.entries(statusPercentages).map(([status, percent]) => ({
    name: status,
    value: percent,
    color: statusColors[status] || '#6b7280'
  }));

  const getStatusBadge = (status) => {
    const variants = {
      'In Progress': 'default',
      'Planning': 'warning',
      'Completed': 'success',
      'On Hold': 'danger'
    };
    return variants[status] || 'secondary';
  };

  const getPriorityBadge = (priority) => {
    const variants = {
      'high': 'danger',
      'medium': 'warning',
      'low': 'success'
    };
    return variants[priority] || 'secondary';
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
  const handleNewProjectClick = () => {
    navigate('');
  };
//   Fetching total employees 
  useEffect(() => {
    const fetchTotalEmployees = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/admin/employee_count/${managerId}`);
        setStats(prev => ({
          ...prev,
          totalEmployees: response.data.employee_count
        }));
      } catch (error) {
        console.error('Failed to fetch total employees:', error);
      }
    };

    const fetchTotalProjects = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/admin/project/${managerId}`);
        // Assuming response.data.projects is an array
        setStats(prev => ({
          ...prev,
          totalProjects: Array.isArray(response.data.projects) ? response.data.projects.length : 0
        }));
      } catch (error) {
        console.error('Failed to fetch total projects:', error);
      }
    };

    fetchTotalEmployees();
    fetchTotalProjects();
  }, [managerId]);

  useEffect(() => {
    // Fetch other stats like activeProjects, completedTasks, etc. similarly
    const fetchOtherStats = async () => {
      // Example for fetching active projects
      try {
        const response = await axios.get('http://localhost:8000/admin/project_count');
        setStats(prev => ({
          ...prev,
          activeProjects: response.data.active_count // Use active_count for active projects
        }));
      } catch (error) {
        console.error('Failed to fetch active projects:', error);
      }
    };

    fetchOtherStats();
    
  }, []);

  return (
    <div className="admin-dashboard">
      {/* Header */}
      <div className="dashboard-header">
        <div className="dashboard-header-content">
          <h1 className="page-title">Admin Dashboard</h1>
          <p className="page-description">Overview of projects, teams, and resource allocation</p>
        </div>
        <div className="dashboard-actions">
          {/* <Button variant="outline">
            <Plus style={{ width: '16px', height: '16px', marginRight: '8px' }} />
            New Project
          </Button> */}



          {/* <Button onClick={() => setShowProjectModal(true)}>
          <Plus style={{ width: '16px', height: '16px', marginRight: '8px' }} />
          New Project
        </Button> */}

        
{/* <Button onClick={() => setShowProjectModal(true)}>New Project</Button> */}




        
          {/* <Button>
            <Users style={{ width: '16px', height: '16px', marginRight: '8px' }} />
            Add Employee
          </Button> */}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="dashboard-stats">
        <Card className="stat-card">
          <CardContent>
            <div className="stat-content">
              <div className="stat-info">
                <p className="stat-label">Total Employees</p>
                <p className="stat-value">{stats.totalEmployees}</p>
              </div>
              <div className="stat-icon stat-icon-blue">
                <Users style={{ width: '24px', height: '24px' }} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="stat-card">
          <CardContent>
            <div className="stat-content">
              <div className="stat-info">
                <p className="stat-label">Total Projects</p>
                <p className="stat-value">{stats.totalProjects}</p>
              </div>
              <div className="stat-icon stat-icon-green">
                <FolderOpen style={{ width: '24px', height: '24px' }} />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* <Card className="stat-card">
          <CardContent>
            <div className="stat-content">
              <div className="stat-info">
                <p className="stat-label">Tasks Completed</p>
                <p className="stat-value">{stats.completedTasks}</p>
              </div>
              <div className="stat-icon stat-icon-purple">
                <CheckSquare style={{ width: '24px', height: '24px' }} />
              </div>
            </div>
            <div className="stat-trend">
              <span className="trend-text">{stats.pendingTasks} pending</span>
            </div>
          </CardContent>
        </Card> */}

        {/* <Card className="stat-card">
          <CardContent>
            <div className="stat-content">
              <div className="stat-info">
                <p className="stat-label">Team Utilization</p>
                <p className="stat-value">{stats.utilizationRate}%</p>
              </div>
              <div className="stat-icon stat-icon-orange">
                <Clock style={{ width: '24px', height: '24px' }} />
              </div>
            </div>
            <div className="stat-progress">
              <div className="progress-bar">
                <div 
                  className="progress-fill progress-fill-orange" 
                  style={{ width: `${stats.utilizationRate}%` }}
                ></div>
              </div>
            </div>
          </CardContent>
        </Card> */}
      </div>

      
      {/* Charts Section */}
      <div className="dashboard-charts">
        <div className="dashboard-chart-full">
          <GanttChart />
        </div>
      </div>

      <div className="dashboard-chart-full">
        <Card>
          <CardHeader>
            <CardTitle>Project Status Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={projectStatusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {projectStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>


      {/* Recent Projects and Team Workload */}
      {/* <div className="dashboard-content">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Recent Projects</CardTitle>
              <Button variant="outline" size="sm">View All</Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentProjects.map((project) => (
                <div key={project.id} className="project-item">
                  <div className="project-content">
                    <div className="project-header">
                      <h4 className="project-title">{project.name}</h4>
                      <Button variant="outline" size="sm" className="project-menu">
                        <MoreVertical style={{ width: '16px', height: '16px' }} />
                      </Button>
                    </div>
                    <div className="project-meta">
                      <Badge variant={getStatusBadge(project.status)}>
                        {project.status}
                      </Badge>
                      <Badge variant={getPriorityBadge(project.priority)}>
                        {project.priority}
                      </Badge>
                      <span className="project-team">{project.team} members</span>
                      <span className="project-deadline">Due: {new Date(project.deadline).toLocaleDateString()}</span>
                    </div>
                    <div className="project-progress">
                      <div className="progress-header">
                        <span>Progress</span>
                        <span>{project.progress}%</span>
                      </div>
                      <div className="progress-bar">
                        <div 
                          className="progress-fill progress-fill-blue" 
                          style={{ width: `${project.progress}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Team Workload</CardTitle>
              <Button variant="outline" size="sm">Manage Teams</Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {teamWorkload.map((team, index) => (
                <div key={index} className="team-item">
                  <div className="team-header">
                    <h4 className="team-name">{team.name}</h4>
                    <div className="team-utilization">
                      {team.utilization > 85 && (
                        <AlertTriangle style={{ width: '16px', height: '16px', color: 'var(--warning-500)' }} />
                      )}
                      <span className="utilization-percent">{team.utilization}%</span>
                    </div>
                  </div>
                  <div className="team-capacity">
                    <span className="capacity-current">{team.current}h / {team.capacity}h per week</span>
                    <span className="capacity-available">{team.capacity - team.current}h available</span>
                  </div>
                  <div className="progress-bar">
                    <div 
                      className={`progress-fill ${
                        team.utilization > 85 ? 'progress-fill-danger' : 
                        team.utilization > 75 ? 'progress-fill-warning' : 'progress-fill-success'
                      }`}
                      style={{ width: `${team.utilization}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div> */}

      {/* Create Project Modal */}
      {showProjectModal && (
        <CreateProjectModal
          isOpen={showProjectModal}
          onClose={() => setShowProjectModal(false)}
          newProject={newProject}
          setNewProject={setNewProject}
          employees={employees}
          selectedEmployees={selectedEmployees}
          setSelectedEmployees={setSelectedEmployees}
          handleSaveNewProject={() => {
            // Your logic to save the new project
            setShowProjectModal(false);
            // Optionally reset newProject and selectedEmployees
          }}
        />
      )}
    </div>
  );
};

export default AdminDashboard;

