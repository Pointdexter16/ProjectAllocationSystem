import React, { useState, useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import Badge from '../ui/Badge';
import { Calendar, ChevronLeft, ChevronRight, ChevronDown, ChevronRight as ChevronRightIcon } from 'lucide-react';
import Button from '../ui/Button';

const GanttChart = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [expandedProjects, setExpandedProjects] = useState(new Set()); // Default expanded
  
  // Enhanced project data with phases
  const projects = [
    {
      id: 1,
      name: 'E-commerce Platform',
      startDate: new Date('2024-01-15'),
      endDate: new Date('2024-02-15'),
      progress: 65,
      status: 'In Progress',
      priority: 'high',
      team: 'Frontend Team',
      phases: [
        {
          id: 11,
          name: 'Planning & Analysis',
          startDate: new Date('2024-01-15'),
          endDate: new Date('2024-01-20'),
          progress: 100,
          status: 'Completed',
          color: '#22c55e'
        },
        {
          id: 12,
          name: 'UI/UX Design',
          startDate: new Date('2024-01-18'),
          endDate: new Date('2024-01-28'),
          progress: 90,
          status: 'In Progress',
          color: '#3b82f6'
        },
        {
          id: 13,
          name: 'Frontend Development',
          startDate: new Date('2024-01-25'),
          endDate: new Date('2024-02-08'),
          progress: 60,
          status: 'In Progress',
          color: '#f59e0b'
        },
        {
          id: 14,
          name: 'Testing & QA',
          startDate: new Date('2024-02-05'),
          endDate: new Date('2024-02-12'),
          progress: 20,
          status: 'Planning',
          color: '#8b5cf6'
        },
        {
          id: 15,
          name: 'Deployment',
          startDate: new Date('2024-02-10'),
          endDate: new Date('2024-02-15'),
          progress: 0,
          status: 'Planning',
          color: '#ef4444'
        }
      ]
    },
    {
      id: 2,
      name: 'Mobile App Redesign',
      startDate: new Date('2024-02-01'),
      endDate: new Date('2024-03-01'),
      progress: 25,
      status: 'Planning',
      priority: 'medium',
      team: 'Design Team',
      phases: [
        {
          id: 21,
          name: 'User Research',
          startDate: new Date('2024-02-01'),
          endDate: new Date('2024-02-08'),
          progress: 80,
          status: 'In Progress',
          color: '#22c55e'
        },
        {
          id: 22,
          name: 'Wireframing',
          startDate: new Date('2024-02-06'),
          endDate: new Date('2024-02-15'),
          progress: 40,
          status: 'In Progress',
          color: '#3b82f6'
        },
        {
          id: 23,
          name: 'Prototyping',
          startDate: new Date('2024-02-12'),
          endDate: new Date('2024-02-22'),
          progress: 0,
          status: 'Planning',
          color: '#f59e0b'
        },
        {
          id: 24,
          name: 'Final Design',
          startDate: new Date('2024-02-20'),
          endDate: new Date('2024-03-01'),
          progress: 0,
          status: 'Planning',
          color: '#8b5cf6'
        }
      ]
    },
    {
      id: 3,
      name: 'Data Analytics Dashboard',
      startDate: new Date('2024-01-10'),
      endDate: new Date('2024-01-30'),
      progress: 80,
      status: 'In Progress',
      priority: 'high',
      team: 'Backend Team',
      phases: [
        {
          id: 31,
          name: 'Data Architecture',
          startDate: new Date('2024-01-10'),
          endDate: new Date('2024-01-15'),
          progress: 100,
          status: 'Completed',
          color: '#22c55e'
        },
        {
          id: 32,
          name: 'Backend APIs',
          startDate: new Date('2024-01-14'),
          endDate: new Date('2024-01-22'),
          progress: 95,
          status: 'In Progress',
          color: '#3b82f6'
        },
        {
          id: 33,
          name: 'Dashboard UI',
          startDate: new Date('2024-01-20'),
          endDate: new Date('2024-01-28'),
          progress: 70,
          status: 'In Progress',
          color: '#f59e0b'
        },
        {
          id: 34,
          name: 'Integration Testing',
          startDate: new Date('2024-01-26'),
          endDate: new Date('2024-01-30'),
          progress: 30,
          status: 'In Progress',
          color: '#8b5cf6'
        }
      ]
    }
  ];

  // Generate date range for the timeline
  const generateDateRange = () => {
    const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 2, 0);
    const dates = [];
    
    for (let d = new Date(startOfMonth); d <= endOfMonth; d.setDate(d.getDate() + 1)) {
      dates.push(new Date(d));
    }
    
    return dates;
  };

  const dateRange = generateDateRange();
  const daysInView = dateRange.length;

  // Calculate position and width for project bars
  const calculateBarPosition = (item) => {
    const startDate = new Date(item.startDate);
    const endDate = new Date(item.endDate);
    const viewStart = dateRange[0];
    const viewEnd = dateRange[dateRange.length - 1];

    // Calculate start position
    const startDiff = Math.max(0, (startDate - viewStart) / (1000 * 60 * 60 * 24));
    const startPercent = (startDiff / daysInView) * 100;

    // Calculate width
    const itemDuration = (endDate - startDate) / (1000 * 60 * 60 * 24);
    const visibleDuration = Math.min(
      itemDuration,
      (viewEnd - Math.max(startDate, viewStart)) / (1000 * 60 * 60 * 24)
    );
    const widthPercent = (visibleDuration / daysInView) * 100;

    return {
      left: `${Math.max(0, startPercent)}%`,
      width: `${Math.max(1, widthPercent)}%`
    };
  };

  const getStatusColor = (status) => {
    const colors = {
      'In Progress': '#3b82f6',
      'Planning': '#f59e0b',
      'Completed': '#22c55e',
      'On Hold': '#ef4444'
    };
    return colors[status] || '#6b7280';
  };

  const getPriorityBadge = (priority) => {
    const variants = {
      'high': 'danger',
      'medium': 'warning',
      'low': 'success'
    };
    return variants[priority] || 'secondary';
  };

  const toggleProjectExpansion = (projectId) => {
    const newExpanded = new Set(expandedProjects);
    if (newExpanded.has(projectId)) {
      newExpanded.delete(projectId);
    } else {
      newExpanded.add(projectId);
    }
    setExpandedProjects(newExpanded);
  };

  const navigateMonth = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + direction);
    setCurrentDate(newDate);
  };

  const formatMonth = (date) => {
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  return (
    <Card className="gantt-chart-container">
      <CardHeader>
        <div className="gantt-header">
          <div className="gantt-title-section">
            <Calendar className="w-5 h-5 text-primary-600" />
            <CardTitle>Project Timeline - Gantt Chart</CardTitle>
          </div>
          <div className="gantt-navigation">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigateMonth(-1)}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <span className="gantt-month-label">
              {formatMonth(currentDate)} - {formatMonth(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigateMonth(1)}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="gantt-chart">
          {/* Timeline Header */}
          <div className="gantt-timeline-header">
            <div className="gantt-project-column">
              <span className="gantt-column-title">Project / Phase</span>
            </div>
            <div className="gantt-timeline-dates">
              {dateRange.filter((_, index) => index % 7 === 0).map((date, index) => (
                <div key={index} className="gantt-week-header">
                  <span className="gantt-week-label">
                    Week {Math.floor(index) + 1}
                  </span>
                  <span className="gantt-date-range">
                    {date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Project Rows */}
          <div className="gantt-projects">
            {projects.map((project) => {
              const isExpanded = expandedProjects.has(project.id);
              const projectBarPosition = calculateBarPosition(project);
              
              return (
                <div key={project.id} className="gantt-project-group">
                  {/* Project Header Row */}
                  <div className="gantt-project-row gantt-project-header">
                    <div className="gantt-project-info">
                      <div className="gantt-project-header-content">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleProjectExpansion(project.id)}
                          className="gantt-expand-btn"
                        >
                          {isExpanded ? (
                            <ChevronDown className="w-4 h-4" />
                          ) : (
                            <ChevronRightIcon className="w-4 h-4" />
                          )}
                        </Button>
                        <div className="gantt-project-details">
                          <div className="gantt-project-name">{project.name}</div>
                          <div className="gantt-project-meta">
                            <Badge variant={getPriorityBadge(project.priority)} size="sm">
                              {project.priority}
                            </Badge>
                            <span className="gantt-team-name">{project.team}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="gantt-timeline-row">
                      <div
                        className="gantt-project-bar gantt-project-summary"
                        style={{
                          ...projectBarPosition,
                          backgroundColor: getStatusColor(project.status),
                        }}
                      >
                        <div
                          className="gantt-progress-bar"
                          style={{
                            width: `${project.progress}%`,
                            backgroundColor: `${getStatusColor(project.status)}dd`
                          }}
                        />
                        <span className="gantt-progress-text">
                          {project.progress}%
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Phase Rows */}
                  {isExpanded && project.phases.map((phase) => {
                    const phaseBarPosition = calculateBarPosition(phase);
                    return (
                      <div key={phase.id} className="gantt-project-row gantt-phase-row">
                        <div className="gantt-project-info gantt-phase-info">
                          <div className="gantt-phase-content">
                            <div className="gantt-phase-indent"></div>
                            <div className="gantt-phase-details">
                              <div className="gantt-phase-name">{phase.name}</div>
                              <div className="gantt-phase-meta">
                                <Badge 
                                  variant={phase.status === 'Completed' ? 'success' : 
                                          phase.status === 'In Progress' ? 'default' : 'secondary'} 
                                  size="sm"
                                >
                                  {phase.status}
                                </Badge>
                                <span className="gantt-phase-duration">
                                  {Math.ceil((new Date(phase.endDate) - new Date(phase.startDate)) / (1000 * 60 * 60 * 24))} days
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="gantt-timeline-row">
                          <div
                            className="gantt-project-bar gantt-phase-bar"
                            style={{
                              ...phaseBarPosition,
                              backgroundColor: phase.color,
                            }}
                          >
                            <div
                              className="gantt-progress-bar"
                              style={{
                                width: `${phase.progress}%`,
                                backgroundColor: `${phase.color}dd`
                              }}
                            />
                            <span className="gantt-progress-text">
                              {phase.progress}%
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default GanttChart;
