import React from 'react';
import Modal from '../ui/Modal';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Button from '../ui/Button';

const CreateProjectModal = ({
  isOpen,
  onClose,
  newProject,
  setNewProject,
  employees,
  selectedEmployees,
  setSelectedEmployees,
  handleSaveNewProject
}) => (
  <Modal
    isOpen={isOpen}
    onClose={onClose}
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
              onChange={e => setNewProject({ ...newProject, name: e.target.value })}
              placeholder="Enter project name"
            />
          </div>
          <div className="form-group">
            <label>Manager</label>
            <Input
              value={newProject.manager}
              onChange={e => setNewProject({ ...newProject, manager: e.target.value })}
              placeholder="Project manager name"
            />
          </div>
        </div>
        <div className="form-group">
          <label>Description *</label>
          <textarea
            className="form-textarea"
            value={newProject.description}
            onChange={e => setNewProject({ ...newProject, description: e.target.value })}
            placeholder="Project description"
            rows="3"
          />
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>Status</label>
            <Select
              value={newProject.status}
              onChange={e => setNewProject({ ...newProject, status: e.target.value })}
            >
              <option value="Planning">Planning</option>
              <option value="In Progress">In Progress</option>
              <option value="On Hold">On Hold</option>
              <option value="Completed">Completed</option>
            </Select>
          </div>
          <div className="form-group">
            <label>Priority</label>
            <Select
              value={newProject.priority}
              onChange={e => setNewProject({ ...newProject, priority: e.target.value })}
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
              onChange={e => setNewProject({ ...newProject, startDate: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label>End Date</label>
            <Input
              type="date"
              value={newProject.endDate}
              onChange={e => setNewProject({ ...newProject, endDate: e.target.value })}
            />
          </div>
        </div>
        <div className="form-group">
          <label>Budget ($)</label>
          <Input
            type="number"
            value={newProject.budget}
            onChange={e => setNewProject({ ...newProject, budget: e.target.value })}
            placeholder="Project budget"
          />
        </div>
        <div className="form-group">
          <label>Assign Team Members</label>
          <div className="employees-assignment">
            {employees.map(employee => (
              <div key={employee.id} className={`employee-item`}>
                <div className="employee-info">
                  <div className="employee-avatar">{employee.avatar}</div>
                  <div className="employee-details">
                    <h4>{employee.name}</h4>
                    <p>{employee.role} • {employee.department}</p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={selectedEmployees.includes(employee.id)}
                  onChange={() =>
                    setSelectedEmployees(prev =>
                      prev.includes(employee.id)
                        ? prev.filter(id => id !== employee.id)
                        : [...prev, employee.id]
                    )
                  }
                  className="employee-checkbox"
                  disabled={employee.status !== 'active'}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="modal-actions">
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button onClick={handleSaveNewProject}>
          Create Project
        </Button>
      </div>
    </div>
  </Modal>
);

export default CreateProjectModal;
