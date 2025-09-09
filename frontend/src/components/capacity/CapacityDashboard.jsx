import React, { useState, useEffect } from 'react';
import { useEmployees } from '../../contexts/EmployeeContext';
import '../../styles/capacity.css';
import { 
  Users, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle,
  Clock,
  BarChart3,
  Filter,
  Download
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import Select from '../ui/Select';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const CapacityDashboard = () => {
  const { employees } = useEmployees();

  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [capacityFilter, setCapacityFilter] = useState('all');

  const getCapacityStatus = (utilizationRate) => {
    if (utilizationRate >= 95) return 'overloaded';
    if (utilizationRate >= 80) return 'high';
    if (utilizationRate >= 50) return 'medium';
    return 'low';
  };

  const getCapacityColor = (status) => {
    switch (status) {
      case 'overloaded': return '#ef4444';
      case 'high': return '#f59e0b';
      case 'medium': return '#3b82f6';
      case 'low': return '#10b981';
      default: return '#6b7280';
    }
  };

  const filteredEmployees = employees.filter(employee => {
    const matchesDepartment = departmentFilter === 'all' || employee.department === departmentFilter;
    const capacityStatus = getCapacityStatus(employee.capacity.utilizationRate);
    const matchesCapacity = capacityFilter === 'all' || capacityStatus === capacityFilter;
    
    return matchesDepartment && matchesCapacity;
  });

  // Calculate statistics
  const totalEmployees = employees.length;
  const overloadedEmployees = employees.filter(emp => emp.capacity.utilizationRate >= 95).length;
  const availableEmployees = employees.filter(emp => emp.capacity.utilizationRate < 80).length;
  const avgUtilization = employees.reduce((sum, emp) => sum + emp.capacity.utilizationRate, 0) / totalEmployees;
  const totalAvailableHours = employees.reduce((sum, emp) => sum + emp.capacity.availableHours, 0);

  // Chart data
  const departmentData = employees.reduce((acc, emp) => {
    const dept = acc.find(d => d.department === emp.department);
    if (dept) {
      dept.employees += 1;
      dept.totalCapacity += emp.capacity.totalHours;
      dept.allocatedHours += emp.capacity.allocatedHours;
      dept.availableHours += emp.capacity.availableHours;
    } else {
      acc.push({
        department: emp.department,
        employees: 1,
        totalCapacity: emp.capacity.totalHours,
        allocatedHours: emp.capacity.allocatedHours,
        availableHours: emp.capacity.availableHours,
        utilization: emp.capacity.utilizationRate
      });
    }
    return acc;
  }, []);

  const capacityDistribution = [
    { name: 'Available (< 80%)', value: employees.filter(emp => emp.capacity.utilizationRate < 80).length, color: '#10b981' },
    { name: 'High Load (80-94%)', value: employees.filter(emp => emp.capacity.utilizationRate >= 80 && emp.capacity.utilizationRate < 95).length, color: '#f59e0b' },
    { name: 'Overloaded (≥ 95%)', value: employees.filter(emp => emp.capacity.utilizationRate >= 95).length, color: '#ef4444' }
  ];

  const departments = [...new Set(employees.map(emp => emp.department))];

  return (
    <div className="capacity-dashboard">
      {/* Header */}
      <div className="capacity-header">
        <div className="capacity-header-content">
          <h1 className="page-title">Team Capacity Dashboard</h1>
          <p className="page-description">Monitor team workload and resource allocation</p>
        </div>
        <div className="capacity-actions">
          <Button variant="outline">
            <Download style={{ width: '16px', height: '16px', marginRight: '8px' }} />
            Export Report
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="capacity-metrics">
        <Card className="metric-card">
          <CardContent>
            <div className="metric-content">
              <div className="metric-info">
                <h3>Total Team Members</h3>
                <p className="metric-number">{totalEmployees}</p>
              </div>
              <div className="metric-icon">
                <Users style={{ width: '24px', height: '24px', color: 'var(--primary-600)' }} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="metric-card">
          <CardContent>
            <div className="metric-content">
              <div className="metric-info">
                <h3>Average Utilization</h3>
                <p className="metric-number">{avgUtilization.toFixed(1)}%</p>
              </div>
              <div className="metric-icon">
                <BarChart3 style={{ width: '24px', height: '24px', color: 'var(--success-600)' }} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="metric-card">
          <CardContent>
            <div className="metric-content">
              <div className="metric-info">
                <h3>Available Hours/Week</h3>
                <p className="metric-number">{totalAvailableHours}h</p>
              </div>
              <div className="metric-icon">
                <Clock style={{ width: '24px', height: '24px', color: 'var(--primary-600)' }} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="metric-card">
          <CardContent>
            <div className="metric-content">
              <div className="metric-info">
                <h3>Overloaded Members</h3>
                <p className="metric-number" style={{ color: overloadedEmployees > 0 ? 'var(--danger-600)' : 'var(--success-600)' }}>
                  {overloadedEmployees}
                </p>
              </div>
              <div className="metric-icon">
                <AlertTriangle style={{ width: '24px', height: '24px', color: overloadedEmployees > 0 ? 'var(--danger-600)' : 'var(--success-600)' }} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="capacity-charts">
        <Card className="chart-card">
          <CardHeader>
            <CardTitle>Department Capacity Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={departmentData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="department" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="allocatedHours" fill="#3b82f6" name="Allocated Hours" />
                <Bar dataKey="availableHours" fill="#10b981" name="Available Hours" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="chart-card">
          <CardHeader>
            <CardTitle>Capacity Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={capacityDistribution}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}`}
                >
                  {capacityDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="capacity-filters">
        <CardContent>
          <div className="filters-row">
            <div className="filter-group">
              <label>Department:</label>
              <Select
                value={departmentFilter}
                onChange={(e) => setDepartmentFilter(e.target.value)}
              >
                <option value="all">All Departments</option>
                {departments.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </Select>
            </div>
            <div className="filter-group">
              <label>Capacity Status:</label>
              <Select
                value={capacityFilter}
                onChange={(e) => setCapacityFilter(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="low">Available (&lt; 80%)</option>
                <option value="medium">Medium Load (50-79%)</option>
                <option value="high">High Load (80-94%)</option>
                <option value="overloaded">Overloaded (≥ 95%)</option>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Employee Capacity List */}
      <Card className="capacity-list">
        <CardHeader>
          <CardTitle>Individual Capacity Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="capacity-table">
            <div className="table-header">
              <div className="col-employee">Employee</div>
              <div className="col-department">Department</div>
              <div className="col-capacity">Capacity</div>
              <div className="col-utilization">Utilization</div>
              <div className="col-projects">Current Projects</div>
            </div>
            {filteredEmployees.map((employee) => {
              const capacityStatus = getCapacityStatus(employee.capacity.utilizationRate);
              return (
                <div key={employee.id} className={`table-row ${capacityStatus}`}>
                  <div className="col-employee">
                    <div className="employee-info">
                      <div className="employee-avatar">{employee.name.split(' ').map(n => n[0]).join('')}</div>
                      <div>
                        <h4>{employee.name}</h4>
                        <p>{employee.role}</p>
                      </div>
                    </div>
                  </div>
                  <div className="col-department">
                    <Badge variant="secondary">{employee.department}</Badge>
                  </div>
                  <div className="col-capacity">
                    <div className="capacity-info">
                      <span>{employee.capacity.allocatedHours}h / {employee.capacity.totalHours}h</span>
                      <span className="available">({employee.capacity.availableHours}h available)</span>
                    </div>
                  </div>
                  <div className="col-utilization">
                    <div className="utilization-info">
                      <div className="utilization-bar">
                        <div 
                          className="utilization-fill" 
                          style={{ 
                            width: `${employee.capacity.utilizationRate}%`,
                            backgroundColor: getCapacityColor(capacityStatus)
                          }}
                        ></div>
                      </div>
                      <span style={{ color: getCapacityColor(capacityStatus) }}>
                        {employee.capacity.utilizationRate}%
                      </span>
                    </div>
                  </div>
                  <div className="col-projects">
                    <div className="projects-summary">
                      {employee.currentProjects.map((project, index) => (
                        <div key={project.id} className="project-summary">
                          <span className="project-name">{project.name}</span>
                          <span className="project-hours">({project.allocatedHours}h)</span>
                        </div>
                      ))}
                    </div>
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

export default CapacityDashboard;
