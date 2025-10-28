import api from './api';

const userService = {
  // Manager operations
  createManager: async (userData) => {
    const response = await api.post('/api/users/managers', userData);
    return response.data;
  },

  getAllManagers: async () => {
    const response = await api.get('/api/users/managers');
    return response.data;
  },

  // Regular user operations
  createRegularUser: async (userData) => {
    const response = await api.post('/api/users/regular-users', userData);
    return response.data;
  },

  getAllRegularUsers: async () => {
    const response = await api.get('/api/users/regular-users');
    return response.data;
  },

  // Admin operations
  assignManagerToUser: async (userId, managerId) => {
    const response = await api.put('/api/users/assign-manager', { userId, managerId });
    return response.data;
  },

  deleteUser: async (id) => {
    const response = await api.delete(`/api/users/${id}`);
    return response.data;
  }
};

export default userService;
