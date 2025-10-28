import api from './api';

const userService = {
  // Manager operations
  createManager: async (userData) => {
    const response = await api.post('/users/managers', userData);
    return response.data;
  },

  getAllManagers: async () => {
    const response = await api.get('/users/managers');
    return response.data;
  },

  // Regular user operations
  createRegularUser: async (userData) => {
    const response = await api.post('/users/regular-users', userData);
    return response.data;
  },

  getAllRegularUsers: async () => {
    const response = await api.get('/users/regular-users');
    return response.data;
  },

  // Admin operations
  assignManagerToUser: async (userId, managerId) => {
    const response = await api.put('/users/assign-manager', { userId, managerId });
    return response.data;
  },

  deleteUser: async (id) => {
    const response = await api.delete(`/users/${id}`);
    return response.data;
  }
};

export default userService;
