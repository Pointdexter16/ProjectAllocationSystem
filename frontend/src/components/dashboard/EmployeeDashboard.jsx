import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  CheckSquare, 
  Clock, 
  FolderOpen, 
  Calendar,
  TrendingUp,
  AlertCircle,
  Play,
  Pause,
  CheckCircle
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import { useAuth } from '../../contexts/AuthContext';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

const EmployeeDashboard = () => {
  const { user } = useAuth();
  
  // Derived stats from backend projects
  // const [stats, setStats] = useState({});

  // const [myTasks, setMyTasks] = useState([
  //   {
  //     id: 1,
  //     title: 'Implement user authentication',
  //     project: 'E-commerce Platform',
  //     status: 'in-progress',
  //     priority: 'high',
  //     dueDate: '2024-01-25',
  //     estimatedHours: 8,
  //     completedHours: 5
  //   },
  //   {
  //     id: 2,
  //     title: 'Design product catalog UI',
  //     project: 'E-commerce Platform',
  //     status: 'pending',
  //     priority: 'medium',
  //     dueDate: '2024-01-28',
  //     estimatedHours: 12,
  //     completedHours: 0
  //   },
  //   {
  //     id: 3,
  //     title: 'Fix payment gateway integration',
  //     project: 'Mobile App Redesign',
  //     status: 'in-progress',
  //     priority: 'high',
  //     dueDate: '2024-01-24',
  //     estimatedHours: 6,
  //     completedHours: 3
  //   },
  //   {
  //     id: 4,
  //     title: 'Write unit tests for API',
  //     project: 'Data Analytics Dashboard',
  //     status: 'completed',
  //     priority: 'medium',
  //     dueDate: '2024-01-20',
  //     estimatedHours: 4,
  //     completedHours: 4
  //   }
  // ]);

  const [myProjects, setMyProjects] = useState([]);
  const [loadingProjects, setLoadingProjects] = useState(false);
  const [errorProjects, setErrorProjects] = useState(null);
  // Fetch projects from backend on mount
  useEffect(() => {
    const fetchProjects = async () => {
      setLoadingProjects(true);
      setErrorProjects(null);
      try {
        const employeeId = user?.Staff_id;
        if (!employeeId) {
          setMyProjects([]);
          return;
        }
        const response = await axios.get(`http://localhost:8000/user/project/${employeeId}`);
        const projects = Array.isArray(response.data?.projects) ? response.data.projects : [];
        const normalized = projects.map((p) => ({
          id: p.project_id ?? p.ProjectId ?? p.id,
          name: p.project_name ?? p.ProjectName ?? 'Project',
          status: p.status ?? p.Project_status ?? 'In Progress',
          progress: (p.status ?? p.Project_status) === 'Completed' ? 100 : 0,
          completedTasks: 0,
          tasksCount: 0,
          role: '',
        }));
        setMyProjects(normalized);
      } catch (err) {
        setErrorProjects(err?.response?.data?.detail || 'Failed to fetch projects');
      } finally {
        setLoadingProjects(false);
      }
    };
    fetchProjects();
  }, [user?.Staff_id]);

  // Function to add a new project (POST to backend)
  const addProject = async (newProject) => {
    try {
      const response = await axios.post('http://localhost:8000/admin/employee/projects', {
        ...newProject,
        employeeId: user?.id,
      });
      if (response.data && response.data.project) {
        setMyProjects((prev) => [...prev, response.data.project]);
      }
    } catch (err) {
      alert('Failed to add project: ' + (err.response?.data?.detail || err.message));
    }
  };

  // Compute project status distribution for pie chart
  const normalizeStatus = (s = '') => {
    const v = String(s).toLowerCase();
    if (v.includes('complete')) return 'Completed';
    if (v.includes('progress') || v.includes('active') || v.includes('ongoing')) return 'In Progress';
    if (v.includes('pending') || v.includes('plan') || v.includes('assign')) return 'Pending';
    return 'Other';
  };
  const totalProjects = myProjects.length;
  const activeProjects = myProjects.filter(p => normalizeStatus(p.status) !== 'Completed').length;
  const dist = myProjects.reduce((acc, p) => {
    const k = normalizeStatus(p.status);
    acc[k] = (acc[k] || 0) + 1;
    return acc;
  }, {});
  const pieData = [
    { name: 'Completed', value: dist['Completed'] || 0, color: '#22c55e' },
    { name: 'In Progress', value: dist['In Progress'] || 0, color: '#3b82f6' },
    { name: 'Pending', value: dist['Pending'] || 0, color: '#f59e0b' },
  ];

  // Project list filter state
  const [projectFilter, setProjectFilter] = useState('All');
  const statusForFilter = (s) => {
    const n = normalizeStatus(s);
    return n === 'Pending' ? 'Not Started' : n; // rename Pending -> Not Started for UI filter
  };
  const displayedProjects = myProjects.filter((p) => {
    if (projectFilter === 'All') return true;
    return statusForFilter(p.status) === projectFilter;
  });

  const getStatusBadge = (status) => {
    const variants = {
      'completed': 'success',
      'in-progress': 'default',
      'pending': 'warning'
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

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'in-progress':
        return <Play className="h-4 w-4 text-blue-600" />;
      case 'pending':
        return <Pause className="h-4 w-4 text-orange-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const updateTaskStatus = (taskId, newStatus) => {
    setMyTasks(prev => prev.map(task => 
      task.id === taskId ? { ...task, status: newStatus } : task
    ));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Welcome back, {user?.First_name} {user?.Last_name}!</h1>
          <p className="text-gray-600">Here's your work overview and upcoming tasks</p>
        </div>
        {/* <div className="flex space-x-3">
          <Button variant="outline">
            <Calendar className="h-4 w-4 mr-2" />
            View Schedule
          </Button>
          <Button>
            <Clock className="h-4 w-4 mr-2" />
            Log Time
          </Button>
        </div> */}
      </div>

      {/* Top Cards: Total Projects, Active Projects */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Projects</p>
                <p className="text-2xl font-bold text-gray-900">{totalProjects}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <FolderOpen className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Projects</p>
                <p className="text-2xl font-bold text-gray-900">{activeProjects}</p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <CheckSquare className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Project Status Distribution */}
      <div className="grid grid-cols-1 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Task Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Projects List */}
      <div className="grid grid-cols-1 gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between gap-3">
              <CardTitle>My Projects</CardTitle>
              <div className="ml-auto flex items-center gap-2">
                <label className="text-sm text-gray-600">Select</label>
                <select
                  className="input"
                  value={projectFilter}
                  onChange={(e) => setProjectFilter(e.target.value)}
                >
                  <option value="All">All</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Not Started">Not Started</option>
                  <option value="Completed">Completed</option>
                </select>
                {loadingProjects && <Badge>Loading...</Badge>}
                {errorProjects && <Badge variant="danger">{errorProjects}</Badge>}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {displayedProjects.map((project) => (
                <div key={project.id} className="p-4 border rounded-lg">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-medium text-gray-900">{project.name}</h4>
                      <p className="text-sm text-gray-600">Status: {statusForFilter(project.status)}</p>
                    </div>
                    <span className="text-sm font-medium text-gray-900">{project.progress}%</span>
                  </div>
                  <div className="mb-3">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-600 h-2 rounded-full" 
                        style={{ width: `${project.progress}%` }}
                      ></div>
                    </div>
                  </div>
                  {/* You can add more project details here if API provides */}
                </div>
              ))}
              {!loadingProjects && displayedProjects.length === 0 && (
                <p className="text-sm text-gray-600">No projects assigned.</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      
    </div>
  );
};

export default EmployeeDashboard;
