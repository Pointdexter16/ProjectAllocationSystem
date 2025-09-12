import React, { useState, useEffect } from 'react';
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

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalEmployees: 24,
    activeProjects: 8,
    completedTasks: 156,
    pendingTasks: 42,
    totalWorkHours: 1920,
    utilizationRate: 78
  });

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

  const projectStatusData = [
    { name: 'Completed', value: 12, color: '#22c55e' },
    { name: 'In Progress', value: 8, color: '#3b82f6' },
    { name: 'Planning', value: 5, color: '#f59e0b' },
    { name: 'On Hold', value: 2, color: '#ef4444' }
  ];

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

  return (
    <div className="admin-dashboard">
      {/* Header */}
      <div className="dashboard-header">
        <div className="dashboard-header-content">
          <h1 className="page-title">Admin Dashboard</h1>
          <p className="page-description">Overview of projects, teams, and resource allocation</p>
        </div>
        <div className="dashboard-actions">
          <Button variant="outline">
            <Plus style={{ width: '16px', height: '16px', marginRight: '8px' }} />
            New Project
          </Button>
          <Button>
            <Users style={{ width: '16px', height: '16px', marginRight: '8px' }} />
            Add Employee
          </Button>
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
            {/* <div className="stat-trend">
              <TrendingUp style={{ width: '16px', height: '16px', color: 'var(--success-500)', marginRight: '4px' }} />
              <span className="trend-text trend-positive">+2 this month</span>
            </div> */}
          </CardContent>
        </Card>

        <Card className="stat-card">
          <CardContent>
            <div className="stat-content">
              <div className="stat-info">
                <p className="stat-label">Active Projects</p>
                <p className="stat-value">{stats.activeProjects}</p>
              </div>
              <div className="stat-icon stat-icon-green">
                <FolderOpen style={{ width: '24px', height: '24px' }} />
              </div>
            </div>
            {/* <div className="stat-trend">
              <TrendingUp style={{ width: '16px', height: '16px', color: 'var(--success-500)', marginRight: '4px' }} />
              <span className="trend-text trend-positive">+1 this week</span>
            </div> */}
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
      <div className="dashboard-content">
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
      </div>
    </div>
  );
};

export default AdminDashboard;
