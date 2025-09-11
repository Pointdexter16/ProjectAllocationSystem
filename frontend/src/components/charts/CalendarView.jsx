import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import { Calendar, ChevronLeft, ChevronRight, Grid, List, Clock, Briefcase } from 'lucide-react';

const CalendarView = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState('monthly'); // 'weekly' or 'monthly'

  // Sample events/projects data
  const events = [
    {
      id: 1,
      title: 'E-commerce Platform Kickoff',
      date: new Date('2024-01-15'),
      type: 'project-start',
      priority: 'high',
      team: 'Frontend Team'
    },
    {
      id: 2,
      title: 'Mobile App Design Review',
      date: new Date('2024-02-05'),
      type: 'milestone',
      priority: 'medium',
      team: 'Design Team'
    },
    {
      id: 3,
      title: 'Analytics Dashboard Demo',
      date: new Date(),
      type: 'demo',
      priority: 'high',
      team: 'Backend Team'
    },
    {
      id: 4,
      title: 'API Integration Testing',
      date: new Date('2024-02-20'),
      type: 'testing',
      priority: 'medium',
      team: 'QA Team'
    },
    {
      id: 5,
      title: 'User Testing Session',
      date: new Date('2024-03-05'),
      type: 'testing',
      priority: 'low',
      team: 'QA Team'
    },
    {
      id: 6,
      title: 'Sprint Planning',
      date: new Date(),
      type: 'meeting',
      priority: 'medium',
      team: 'All Teams'
    }
  ];

  // Active projects data
  const activeProjects = [
    {
      id: 1,
      name: 'E-commerce Platform',
      progress: 65,
      status: 'In Progress',
      priority: 'high',
      team: 'Frontend Team',
      currentPhase: 'Frontend Development',
      deadline: new Date('2024-02-15'),
      todayTasks: [
        'Complete product listing component',
        'Review shopping cart functionality',
        'Fix responsive design issues'
      ]
    },
    {
      id: 2,
      name: 'Data Analytics Dashboard',
      progress: 80,
      status: 'In Progress',
      priority: 'high',
      team: 'Backend Team',
      currentPhase: 'Integration Testing',
      deadline: new Date('2024-01-30'),
      todayTasks: [
        'Test API endpoints',
        'Validate data visualization',
        'Performance optimization'
      ]
    },
    {
      id: 3,
      name: 'Mobile App Redesign',
      progress: 25,
      status: 'Planning',
      priority: 'medium',
      team: 'Design Team',
      currentPhase: 'User Research',
      deadline: new Date('2024-03-01'),
      todayTasks: [
        'Conduct user interviews',
        'Analyze competitor apps',
        'Create user personas'
      ]
    }
  ];

  const getMonthDays = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    
    return days;
  };

  const getWeekDays = (date) => {
    const startOfWeek = new Date(date);
    const day = startOfWeek.getDay();
    const diff = startOfWeek.getDate() - day;
    startOfWeek.setDate(diff);

    const days = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      days.push(day);
    }
    
    return days;
  };

  const getEventsForDate = (date) => {
    if (!date) return [];
    return events.filter(event => 
      event.date.toDateString() === date.toDateString()
    );
  };

  const getTodaysProjects = () => {
    const today = new Date();
    return activeProjects.filter(project => {
      const projectStart = new Date(project.deadline);
      projectStart.setMonth(projectStart.getMonth() - 2); // Assume 2 months duration
      return today >= projectStart && today <= project.deadline && project.status === 'In Progress';
    });
  };

  const getTodaysEvents = () => {
    const today = new Date();
    const todayStr = today.toDateString();
    
    return events.filter(event => {
      const eventDate = new Date(event.date);
      return eventDate.toDateString() === todayStr;
    });
  };

  const getEventTypeColor = (type) => {
    const colors = {
      'project-start': '#22c55e',
      'milestone': '#3b82f6',
      'demo': '#8b5cf6',
      'testing': '#f59e0b',
      'meeting': '#ef4444'
    };
    return colors[type] || '#6b7280';
  };

  const getEventTypeLabel = (type) => {
    const labels = {
      'project-start': 'Project Start',
      'milestone': 'Milestone',
      'demo': 'Demo',
      'testing': 'Testing',
      'meeting': 'Meeting'
    };
    return labels[type] || type;
  };

  const getPriorityBadge = (priority) => {
    const variants = {
      'high': 'danger',
      'medium': 'warning',
      'low': 'success'
    };
    return variants[priority] || 'secondary';
  };

  const navigateDate = (direction) => {
    const newDate = new Date(currentDate);
    if (viewMode === 'monthly') {
      newDate.setMonth(newDate.getMonth() + direction);
    } else {
      newDate.setDate(newDate.getDate() + (direction * 7));
    }
    setCurrentDate(newDate);
  };

  const formatDateHeader = () => {
    if (viewMode === 'monthly') {
      return currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    } else {
      const weekDays = getWeekDays(currentDate);
      const startDate = weekDays[0];
      const endDate = weekDays[6];
      return `${startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${endDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
    }
  };

  const isToday = (date) => {
    if (!date) return false;
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const renderMonthlyView = () => {
    const days = getMonthDays(currentDate);
    const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    return (
      <div className="calendar-monthly">
        {/* Week day headers */}
        <div className="calendar-weekdays">
          {weekDays.map(day => (
            <div key={day} className="calendar-weekday-header">
              {day}
            </div>
          ))}
        </div>
        
        {/* Calendar grid */}
        <div className="calendar-grid">
          {days.map((date, index) => {
            const dayEvents = getEventsForDate(date);
            return (
              <div 
                key={index} 
                className={`calendar-day ${!date ? 'calendar-day-empty' : ''} ${isToday(date) ? 'calendar-day-today' : ''}`}
              >
                {date && (
                  <>
                    <div className="calendar-day-number">
                      {date.getDate()}
                    </div>
                    <div className="calendar-day-events">
                      {dayEvents.slice(0, 2).map(event => (
                        <div
                          key={event.id}
                          className="calendar-event"
                          style={{ backgroundColor: getEventTypeColor(event.type) }}
                        >
                          <span className="calendar-event-title">
                            {event.title.length > 15 ? `${event.title.substring(0, 15)}...` : event.title}
                          </span>
                        </div>
                      ))}
                      {dayEvents.length > 2 && (
                        <div className="calendar-event-more">
                          +{dayEvents.length - 2} more
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderWeeklyView = () => {
    const days = getWeekDays(currentDate);
    const weekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    return (
      <div className="calendar-weekly">
        <div className="calendar-week-grid">
          {days.map((date, index) => {
            const dayEvents = getEventsForDate(date);
            return (
              <div key={index} className={`calendar-week-day ${isToday(date) ? 'calendar-day-today' : ''}`}>
                <div className="calendar-week-header">
                  <div className="calendar-week-day-name">{weekDays[index]}</div>
                  <div className="calendar-week-day-number">{date.getDate()}</div>
                </div>
                <div className="calendar-week-events">
                  {dayEvents.map(event => (
                    <div
                      key={event.id}
                      className="calendar-week-event"
                      style={{ borderLeftColor: getEventTypeColor(event.type) }}
                    >
                      <div className="calendar-week-event-title">{event.title}</div>
                      <div className="calendar-week-event-meta">
                        <Badge variant={getPriorityBadge(event.priority)} size="sm">
                          {event.priority}
                        </Badge>
                        <span className="calendar-week-event-team">{event.team}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderTodaysProjects = () => {
    const todaysProjects = getTodaysProjects();
    const todaysEvents = getTodaysEvents();

    return (
      <div className="calendar-todays-section">
        {/* Today's Projects */}
        <div className="calendar-todays-projects">
          <div className="calendar-todays-header">
            <Briefcase className="w-5 h-5 text-primary-600" />
            <h4 className="calendar-todays-title">Today's Active Projects</h4>
          </div>
          {todaysProjects.length > 0 ? (
            <div className="calendar-todays-projects-grid">
              {todaysProjects.map(project => (
                <div key={project.id} className="calendar-todays-project-card">
                  <div className="calendar-todays-project-header">
                    <div className="calendar-todays-project-info">
                      <h5 className="calendar-todays-project-name">{project.name}</h5>
                      <div className="calendar-todays-project-meta">
                        <Badge variant={getPriorityBadge(project.priority)} size="sm">
                          {project.priority}
                        </Badge>
                        <span className="calendar-todays-project-team">{project.team}</span>
                      </div>
                    </div>
                    <div className="calendar-todays-project-progress-circle">
                      <svg className="calendar-progress-ring" width="40" height="40">
                        <circle
                          className="calendar-progress-ring-background"
                          stroke="var(--gray-200)"
                          strokeWidth="3"
                          fill="transparent"
                          r="16"
                          cx="20"
                          cy="20"
                        />
                        <circle
                          className="calendar-progress-ring-progress"
                          stroke={project.priority === 'high' ? 'var(--danger-500)' : 
                                 project.priority === 'medium' ? 'var(--warning-500)' : 'var(--success-500)'}
                          strokeWidth="3"
                          fill="transparent"
                          r="16"
                          cx="20"
                          cy="20"
                          strokeDasharray={`${(project.progress / 100) * 100.53} 100.53`}
                          strokeDashoffset="0"
                          transform="rotate(-90 20 20)"
                        />
                      </svg>
                      <span className="calendar-progress-text">{project.progress}%</span>
                    </div>
                  </div>
                  
                  <div className="calendar-todays-project-phase">
                    <span className="calendar-current-phase-label">Current Phase:</span>
                    <span className="calendar-current-phase">{project.currentPhase}</span>
                  </div>

                  <div className="calendar-todays-project-tasks">
                    <h6 className="calendar-tasks-title">Today's Tasks:</h6>
                    <ul className="calendar-tasks-list">
                      {project.todayTasks.map((task, index) => (
                        <li key={index} className="calendar-task-item">
                          <div className="calendar-task-checkbox"></div>
                          <span className="calendar-task-text">{task}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="calendar-todays-project-deadline">
                    <Clock className="w-4 h-4 text-gray-500" />
                    <span className="calendar-deadline-text">
                      Due: {project.deadline.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="calendar-no-projects">
              <p>No active projects for today</p>
            </div>
          )}
        </div>

        {/* Today's Events */}
        {todaysEvents.length > 0 && (
          <div className="calendar-todays-events">
            <div className="calendar-todays-header">
              <Calendar className="w-5 h-5 text-primary-600" />
              <h4 className="calendar-todays-title">Today's Events</h4>
            </div>
            <div className="calendar-todays-events-list">
              {todaysEvents.map(event => (
                <div key={event.id} className="calendar-todays-event">
                  <div 
                    className="calendar-event-indicator"
                    style={{ backgroundColor: getEventTypeColor(event.type) }}
                  ></div>
                  <div className="calendar-event-details">
                    <span className="calendar-event-title">{event.title}</span>
                    <div className="calendar-event-meta">
                      <Badge variant={getPriorityBadge(event.priority)} size="sm">
                        {event.priority}
                      </Badge>
                      <span className="calendar-event-team">{event.team}</span>
                      <span className="calendar-event-type">{getEventTypeLabel(event.type)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <Card className="calendar-container">
      <CardHeader>
        <div className="calendar-header">
          <div className="calendar-title-section">
            <Calendar className="w-5 h-5 text-primary-600" />
            <CardTitle>Project Calendar</CardTitle>
          </div>
          <div className="calendar-controls">
            <div className="calendar-view-toggle">
              <Button
                variant={viewMode === 'weekly' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('weekly')}
              >
                <List className="w-4 h-4 mr-2" />
                Weekly
              </Button>
              <Button
                variant={viewMode === 'monthly' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('monthly')}
              >
                <Grid className="w-4 h-4 mr-2" />
                Monthly
              </Button>
            </div>
            <div className="calendar-navigation">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigateDate(-1)}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <span className="calendar-date-label">
                {formatDateHeader()}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigateDate(1)}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {viewMode === 'monthly' ? renderMonthlyView() : renderWeeklyView()}
        {renderTodaysProjects()}
        {/* Event Legend */}
        <div className="calendar-legend">
          <h4 className="calendar-legend-title">Event Types</h4>
          <div className="calendar-legend-items">
            {Object.entries({
              'project-start': 'Project Start',
              'milestone': 'Milestone',
              'demo': 'Demo',
              'testing': 'Testing',
              'meeting': 'Meeting'
            }).map(([type, label]) => (
              <div key={type} className="calendar-legend-item">
                <div 
                  className="calendar-legend-color"
                  style={{ backgroundColor: getEventTypeColor(type) }}
                ></div>
                <span className="calendar-legend-label">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CalendarView;
