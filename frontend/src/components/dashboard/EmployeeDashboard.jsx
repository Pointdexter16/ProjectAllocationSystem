import React, { useState, useEffect } from 'react';
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
  
  const [stats, setStats] = useState({
    tasksCompleted: 28,
    tasksInProgress: 5,
    tasksPending: 12,
    hoursWorked: 32,
    weeklyCapacity: 40,
    utilizationRate: 80
  });

  const [myTasks, setMyTasks] = useState([
    {
      id: 1,
      title: 'Implement user authentication',
      project: 'E-commerce Platform',
      status: 'in-progress',
      priority: 'high',
      dueDate: '2024-01-25',
      estimatedHours: 8,
      completedHours: 5
    },
    {
      id: 2,
      title: 'Design product catalog UI',
      project: 'E-commerce Platform',
      status: 'pending',
      priority: 'medium',
      dueDate: '2024-01-28',
      estimatedHours: 12,
      completedHours: 0
    },
    {
      id: 3,
      title: 'Fix payment gateway integration',
      project: 'Mobile App Redesign',
      status: 'in-progress',
      priority: 'high',
      dueDate: '2024-01-24',
      estimatedHours: 6,
      completedHours: 3
    },
    {
      id: 4,
      title: 'Write unit tests for API',
      project: 'Data Analytics Dashboard',
      status: 'completed',
      priority: 'medium',
      dueDate: '2024-01-20',
      estimatedHours: 4,
      completedHours: 4
    }
  ]);

  const [myProjects, setMyProjects] = useState([
    {
      id: 1,
      name: 'E-commerce Platform',
      role: 'Frontend Developer',
      progress: 65,
      tasksCount: 8,
      completedTasks: 5
    },
    {
      id: 2,
      name: 'Mobile App Redesign',
      role: 'UI/UX Developer',
      progress: 40,
      tasksCount: 6,
      completedTasks: 2
    },
    {
      id: 3,
      name: 'Data Analytics Dashboard',
      role: 'Frontend Developer',
      progress: 85,
      tasksCount: 4,
      completedTasks: 3
    }
  ]);

  const weeklyHours = [
    { day: 'Mon', hours: 8 },
    { day: 'Tue', hours: 7.5 },
    { day: 'Wed', hours: 8 },
    { day: 'Thu', hours: 6 },
    { day: 'Fri', hours: 2.5 },
    { day: 'Sat', hours: 0 },
    { day: 'Sun', hours: 0 }
  ];

  const taskStatusData = [
    { name: 'Completed', value: stats.tasksCompleted, color: '#22c55e' },
    { name: 'In Progress', value: stats.tasksInProgress, color: '#3b82f6' },
    { name: 'Pending', value: stats.tasksPending, color: '#f59e0b' }
  ];

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
          <h1 className="text-2xl font-bold text-gray-900">Welcome back, {user?.name}!</h1>
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

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Tasks Completed</p>
                <p className="text-2xl font-bold text-gray-900">{stats.tasksCompleted}</p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <CheckSquare className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-sm text-green-600">+3 this week</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">In Progress</p>
                <p className="text-2xl font-bold text-gray-900">{stats.tasksInProgress}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <Play className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <span className="text-sm text-gray-600">{stats.tasksPending} pending</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Hours This Week</p>
                <p className="text-2xl font-bold text-gray-900">{stats.hoursWorked}</p>
              </div>
              <div className="bg-purple-100 p-3 rounded-full">
                <Clock className="h-6 w-6 text-purple-600" />
              </div>
            </div>
            <div className="mt-4">
              <div className="flex justify-between text-sm mb-1">
                <span>of {stats.weeklyCapacity}h capacity</span>
                <span>{stats.weeklyCapacity - stats.hoursWorked}h remaining</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-purple-600 h-2 rounded-full" 
                  style={{ width: `${(stats.hoursWorked / stats.weeklyCapacity) * 100}%` }}
                ></div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Projects</p>
                <p className="text-2xl font-bold text-gray-900">{myProjects.length}</p>
              </div>
              <div className="bg-orange-100 p-3 rounded-full">
                <FolderOpen className="h-6 w-6 text-orange-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <span className="text-sm text-gray-600">Across {myProjects.length} teams</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Weekly Hours Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={weeklyHours}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="hours" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Task Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={taskStatusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {taskStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Tasks and Projects */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>My Tasks</CardTitle>
              <Button variant="outline" size="sm">View All</Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {myTasks.slice(0, 4).map((task) => (
                <div key={task.id} className="flex items-start space-x-4 p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="mt-1">
                    {getStatusIcon(task.status)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-900 truncate">{task.title}</h4>
                      <div className="flex space-x-2">
                        <Badge variant={getStatusBadge(task.status)}>
                          {task.status.replace('-', ' ')}
                        </Badge>
                        <Badge variant={getPriorityBadge(task.priority)}>
                          {task.priority}
                        </Badge>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{task.project}</p>
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>
                      <span>{task.completedHours}h / {task.estimatedHours}h</span>
                    </div>
                    {task.status === 'in-progress' && (
                      <div className="mt-2">
                        <div className="w-full bg-gray-200 rounded-full h-1.5">
                          <div 
                            className="bg-blue-600 h-1.5 rounded-full" 
                            style={{ width: `${(task.completedHours / task.estimatedHours) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    )}
                    {task.status === 'pending' && (
                      <div className="mt-2 flex space-x-2">
                        <Button 
                          size="sm" 
                          onClick={() => updateTaskStatus(task.id, 'in-progress')}
                        >
                          Start Task
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>My Projects</CardTitle>
              <Button variant="outline" size="sm">View Details</Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {myProjects.map((project) => (
                <div key={project.id} className="p-4 border rounded-lg">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-medium text-gray-900">{project.name}</h4>
                      <p className="text-sm text-gray-600">{project.role}</p>
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
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>{project.completedTasks} / {project.tasksCount} tasks completed</span>
                    <span>{project.tasksCount - project.completedTasks} remaining</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Deadlines */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Upcoming Deadlines</CardTitle>
            {/* <Button variant="outline" size="sm">
              <Calendar className="h-4 w-4 mr-2" />
              Calendar View
            </Button> */}
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {myTasks
              .filter(task => task.status !== 'completed')
              .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
              .slice(0, 5)
              .map((task) => {
                const daysUntilDue = Math.ceil((new Date(task.dueDate) - new Date()) / (1000 * 60 * 60 * 24));
                const isOverdue = daysUntilDue < 0;
                const isUrgent = daysUntilDue <= 2 && daysUntilDue >= 0;
                
                return (
                  <div key={task.id} className={`flex items-center justify-between p-3 rounded-lg border ${
                    isOverdue ? 'bg-red-50 border-red-200' : 
                    isUrgent ? 'bg-orange-50 border-orange-200' : 
                    'bg-gray-50 border-gray-200'
                  }`}>
                    <div className="flex items-center space-x-3">
                      {(isOverdue || isUrgent) && (
                        <AlertCircle className={`h-4 w-4 ${isOverdue ? 'text-red-500' : 'text-orange-500'}`} />
                      )}
                      <div>
                        <p className="font-medium text-gray-900">{task.title}</p>
                        <p className="text-sm text-gray-600">{task.project}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`text-sm font-medium ${
                        isOverdue ? 'text-red-600' : 
                        isUrgent ? 'text-orange-600' : 
                        'text-gray-900'
                      }`}>
                        {isOverdue ? `${Math.abs(daysUntilDue)} days overdue` :
                         daysUntilDue === 0 ? 'Due today' :
                         daysUntilDue === 1 ? 'Due tomorrow' :
                         `Due in ${daysUntilDue} days`}
                      </p>
                      <p className="text-xs text-gray-500">{new Date(task.dueDate).toLocaleDateString()}</p>
                    </div>
                  </div>
                );
              })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmployeeDashboard;
