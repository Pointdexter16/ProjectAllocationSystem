import React, { createContext, useContext, useState } from 'react';

const EmployeeContext = createContext();

export const useEmployees = () => {
  const context = useContext(EmployeeContext);
  if (!context) {
    throw new Error('useEmployees must be used within an EmployeeProvider');
  }
  return context;
};

export const EmployeeProvider = ({ children }) => {
  const [employees, setEmployees] = useState([
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
        totalHours: 40,
        allocatedHours: 32,
        availableHours: 8,
        utilizationRate: 80
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
      joinDate: '2023-02-20',
      salary: 80000,
      location: 'San Francisco, CA',
      avatar: 'BW',
      skills: ['Node.js', 'Python', 'PostgreSQL', 'AWS'],
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
      joinDate: '2023-04-05',
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
      skills: ['Docker', 'Kubernetes', 'AWS', 'CI/CD'],
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
      joinDate: '2023-06-18',
      salary: 78000,
      location: 'Miami, FL',
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
      name: 'Henry Taylor',
      email: 'henry.taylor@company.com',
      phone: '+1 (555) 789-0123',
      role: 'Product Manager',
      department: 'Product',
      status: 'active',
      joinDate: '2023-07-22',
      salary: 95000,
      location: 'Boston, MA',
      avatar: 'HT',
      skills: ['Product Strategy', 'Agile', 'Analytics', 'User Research'],
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

  const addEmployee = (employee) => {
    setEmployees(prev => [...prev, employee]);
  };

  const updateEmployee = (employeeId, updates) => {
    setEmployees(prev => 
      prev.map(emp => emp.id === employeeId ? { ...emp, ...updates } : emp)
    );
  };

  const deleteEmployee = (employeeId) => {
    setEmployees(prev => prev.filter(emp => emp.id !== employeeId));
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
              updatedProjects.push({
                id: projectId,
                name: `Project ${projectId}`,
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

  const value = {
    employees,
    setEmployees,
    addEmployee,
    updateEmployee,
    deleteEmployee,
    updateEmployeeCapacity
  };

  return (
    <EmployeeContext.Provider value={value}>
      {children}
    </EmployeeContext.Provider>
  );
};
