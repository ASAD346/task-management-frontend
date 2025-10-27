import React from 'react';
import './TaskCard.css';

const TaskCard = ({ task, onEdit, onDelete, onStatusChange }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'status-completed';
      case 'in-progress':
        return 'status-in-progress';
      default:
        return 'status-pending';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="task-card">
      <div className="task-header">
        <h3 className="task-title">{task.title}</h3>
        <span className={`task-status ${getStatusColor(task.status)}`}>
          {task.status}
        </span>
      </div>
      
      <p className="task-description">{task.description}</p>
      
      <div className="task-meta">
        <div className="task-date">
          <span className="meta-label">Due:</span>
          <span className="meta-value">{formatDate(task.dueDate)}</span>
        </div>
        {task.creatorId && (
          <div className="task-creator">
            <span className="meta-label">Created by:</span>
            <span className="meta-value">{task.creatorId.name || 'Unknown'}</span>
          </div>
        )}
      </div>

      <div className="task-actions">
        {onStatusChange && (
          <select
            value={task.status}
            onChange={(e) => onStatusChange(task._id, e.target.value)}
            className="status-select"
          >
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        )}
        <button onClick={() => onEdit(task)} className="btn-edit">
          Edit
        </button>
        <button onClick={() => onDelete(task._id)} className="btn-delete">
          Delete
        </button>
      </div>
    </div>
  );
};

export default TaskCard;
