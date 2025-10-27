import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import TaskCard from '../components/TaskCard';
import taskService from '../services/taskService';
import userService from '../services/userService';
import './Dashboard.css';

const Dashboard = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState({ pending: 0, 'in-progress': 0, completed: 0 });
  const [loading, setLoading] = useState(true);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [showUserForm, setShowUserForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [filters, setFilters] = useState({ status: '', search: '' });
  const [users, setUsers] = useState([]);
  const [managers, setManagers] = useState([]);

  const [taskForm, setTaskForm] = useState({
    title: '',
    description: '',
    dueDate: '',
    status: 'pending'
  });

  const [userForm, setUserForm] = useState({
    name: '',
    email: '',
    password: '',
    managerId: ''
  });

  useEffect(() => {
    loadDashboardData();
  }, [filters]);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [tasksRes, statsRes] = await Promise.all([
        taskService.getAllTasks(filters),
        taskService.getTaskStats()
      ]);
      
      setTasks(tasksRes.data || []);
      setStats(statsRes.data || { pending: 0, 'in-progress': 0, completed: 0 });

      // Load users if admin or manager
      if (user.role === 'admin') {
        const [managersRes, usersRes] = await Promise.all([
          userService.getAllManagers(),
          userService.getAllRegularUsers()
        ]);
        setManagers(managersRes.data || []);
        setUsers(usersRes.data || []);
      } else if (user.role === 'manager') {
        const usersRes = await userService.getAllRegularUsers();
        setUsers(usersRes.data || []);
      }
    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    try {
      if (editingTask) {
        await taskService.updateTask(editingTask._id, taskForm);
      } else {
        await taskService.createTask(taskForm);
      }
      setTaskForm({ title: '', description: '', dueDate: '', status: 'pending' });
      setShowTaskForm(false);
      setEditingTask(null);
      loadDashboardData();
    } catch (error) {
      alert(error.response?.data?.message || 'Error saving task');
    }
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setTaskForm({
      title: task.title,
      description: task.description,
      dueDate: task.dueDate.split('T')[0],
      status: task.status
    });
    setShowTaskForm(true);
  };

  const handleDeleteTask = async (id) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await taskService.deleteTask(id);
        loadDashboardData();
      } catch (error) {
        alert(error.response?.data?.message || 'Error deleting task');
      }
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      await taskService.updateTask(id, { status });
      loadDashboardData();
    } catch (error) {
      alert(error.response?.data?.message || 'Error updating status');
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    try {
      if (user.role === 'admin' && showUserForm === 'manager') {
        await userService.createManager(userForm);
      } else {
        await userService.createRegularUser(userForm);
      }
      setUserForm({ name: '', email: '', password: '', managerId: '' });
      setShowUserForm(false);
      loadDashboardData();
    } catch (error) {
      alert(error.response?.data?.message || 'Error creating user');
    }
  };

  const handleDeleteUser = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await userService.deleteUser(id);
        loadDashboardData();
      } catch (error) {
        alert(error.response?.data?.message || 'Error deleting user');
      }
    }
  };

  if (loading) {
    return (
      <div>
        <Navbar />
        <div className="loading-container">Loading...</div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <Navbar />
      
      <div className="dashboard-container">
        <div className="dashboard-header">
          <div>
            <h1>Welcome, {user.name}</h1>
            <p className="subtitle">
              {user.role === 'admin' && 'Manage all users and tasks'}
              {user.role === 'manager' && 'Manage your team and tasks'}
              {user.role === 'user' && 'Manage your tasks'}
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="stats-grid">
          <div className="stat-card stat-pending">
            <div className="stat-value">{stats.pending}</div>
            <div className="stat-label">Pending</div>
          </div>
          <div className="stat-card stat-progress">
            <div className="stat-value">{stats['in-progress']}</div>
            <div className="stat-label">In Progress</div>
          </div>
          <div className="stat-card stat-completed">
            <div className="stat-value">{stats.completed}</div>
            <div className="stat-label">Completed</div>
          </div>
          <div className="stat-card stat-total">
            <div className="stat-value">
              {stats.pending + stats['in-progress'] + stats.completed}
            </div>
            <div className="stat-label">Total Tasks</div>
          </div>
        </div>

        {/* User Management (Admin/Manager only) */}
        {(user.role === 'admin' || user.role === 'manager') && (
          <div className="section">
            <div className="section-header">
              <h2>User Management</h2>
              <div className="button-group">
                {user.role === 'admin' && (
                  <button
                    onClick={() => setShowUserForm('manager')}
                    className="btn-secondary"
                  >
                    + Add Manager
                  </button>
                )}
                <button
                  onClick={() => setShowUserForm('user')}
                  className="btn-secondary"
                >
                  + Add User
                </button>
              </div>
            </div>

            {showUserForm && (
              <div className="form-card">
                <h3>{showUserForm === 'manager' ? 'Create Manager' : 'Create User'}</h3>
                <form onSubmit={handleCreateUser}>
                  <div className="form-row">
                    <input
                      type="text"
                      placeholder="Name"
                      value={userForm.name}
                      onChange={(e) => setUserForm({ ...userForm, name: e.target.value })}
                      required
                    />
                    <input
                      type="email"
                      placeholder="Email"
                      value={userForm.email}
                      onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
                      required
                    />
                  </div>
                  <input
                    type="password"
                    placeholder="Password"
                    value={userForm.password}
                    onChange={(e) => setUserForm({ ...userForm, password: e.target.value })}
                    required
                  />
                  {user.role === 'admin' && showUserForm === 'user' && managers.length > 0 && (
                    <select
                      value={userForm.managerId}
                      onChange={(e) => setUserForm({ ...userForm, managerId: e.target.value })}
                    >
                      <option value="">No Manager</option>
                      {managers.map((m) => (
                        <option key={m._id} value={m._id}>
                          {m.name}
                        </option>
                      ))}
                    </select>
                  )}
                  <div className="form-actions">
                    <button type="submit" className="btn-primary">
                      Create {showUserForm === 'manager' ? 'Manager' : 'User'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowUserForm(false)}
                      className="btn-secondary"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}

            {user.role === 'admin' && managers.length > 0 && (
              <div className="user-list">
                <h3>Managers</h3>
                {managers.map((manager) => (
                  <div key={manager._id} className="user-card">
                    <div>
                      <div className="user-name">{manager.name}</div>
                      <div className="user-email">{manager.email}</div>
                    </div>
                    <button
                      onClick={() => handleDeleteUser(manager._id)}
                      className="btn-delete-small"
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            )}

            {users.length > 0 && (
              <div className="user-list">
                <h3>Regular Users</h3>
                {users.map((u) => (
                  <div key={u._id} className="user-card">
                    <div>
                      <div className="user-name">{u.name}</div>
                      <div className="user-email">{u.email}</div>
                    </div>
                    <button
                      onClick={() => handleDeleteUser(u._id)}
                      className="btn-delete-small"
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tasks Section */}
        <div className="section">
          <div className="section-header">
            <h2>Tasks</h2>
            <button onClick={() => setShowTaskForm(true)} className="btn-primary">
              + Create Task
            </button>
          </div>

          {/* Filters */}
          <div className="filters">
            <input
              type="text"
              placeholder="Search tasks..."
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              className="search-input"
            />
            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              className="filter-select"
            >
              <option value="">All Status</option>
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          {/* Task Form */}
          {showTaskForm && (
            <div className="form-card">
              <h3>{editingTask ? 'Edit Task' : 'Create New Task'}</h3>
              <form onSubmit={handleCreateTask}>
                <input
                  type="text"
                  placeholder="Task Title"
                  value={taskForm.title}
                  onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })}
                  required
                />
                <textarea
                  placeholder="Task Description"
                  value={taskForm.description}
                  onChange={(e) => setTaskForm({ ...taskForm, description: e.target.value })}
                  required
                  rows="4"
                />
                <div className="form-row">
                  <input
                    type="date"
                    value={taskForm.dueDate}
                    onChange={(e) => setTaskForm({ ...taskForm, dueDate: e.target.value })}
                    required
                  />
                  <select
                    value={taskForm.status}
                    onChange={(e) => setTaskForm({ ...taskForm, status: e.target.value })}
                  >
                    <option value="pending">Pending</option>
                    <option value="in-progress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
                <div className="form-actions">
                  <button type="submit" className="btn-primary">
                    {editingTask ? 'Update Task' : 'Create Task'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowTaskForm(false);
                      setEditingTask(null);
                      setTaskForm({ title: '', description: '', dueDate: '', status: 'pending' });
                    }}
                    className="btn-secondary"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Task List */}
          <div className="tasks-grid">
            {tasks.length === 0 ? (
              <div className="empty-state">No tasks found</div>
            ) : (
              tasks.map((task) => (
                <TaskCard
                  key={task._id}
                  task={task}
                  onEdit={handleEditTask}
                  onDelete={handleDeleteTask}
                  onStatusChange={handleStatusChange}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
