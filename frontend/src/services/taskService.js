import api from './api';

const taskService = {
  getAllTasks: async (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.status) params.append('status', filters.status);
    if (filters.dueDate) params.append('dueDate', filters.dueDate);
    if (filters.search) params.append('search', filters.search);
    
    const response = await api.get(`/api/tasks?${params.toString()}`);
    return response.data;
  },

  getTask: async (id) => {
    const response = await api.get(`/api/tasks/${id}`);
    return response.data;
  },

  createTask: async (taskData) => {
    const response = await api.post('/api/tasks', taskData);
    return response.data;
  },

  updateTask: async (id, taskData) => {
    const response = await api.put(`/api/tasks/${id}`, taskData);
    return response.data;
  },

  deleteTask: async (id) => {
    const response = await api.delete(`/api/tasks/${id}`);
    return response.data;
  },

  getTaskStats: async () => {
    const response = await api.get('/api/tasks/stats');
    return response.data;
  }
};

export default taskService;
