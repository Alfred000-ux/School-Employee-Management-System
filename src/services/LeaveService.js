import axios from "axios";

// Change this URL to match your JSON server or backend
const API_URL = "http://localhost:3001/leaveRequests";

const LeaveService = {

  // Get all leaves
  getAllLeaves: async () => {
    try {
      const response = await axios.get(API_URL);
      return response.data;
    } catch (error) {
      console.error("Error fetching leave requests:", error);
      throw error;
    }
  },

  // Get a single leave request
  getLeaveById: async (id) => {
    try {
      const response = await axios.get(`${API_URL}/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching leave request:", error);
      throw error;
    }
  },

  // Create a new leave request
  createLeave: async (data) => {
    try {
      const response = await axios.post(API_URL, data);
      return response.data;
    } catch (error) {
      console.error("Error creating leave request:", error);
      throw error;
    }
  },

  // Update an existing leave request (approve/reject/edit)
  updateLeave: async (id, data) => {
    try {
      const response = await axios.put(`${API_URL}/${id}`, data);
      return response.data;
    } catch (error) {
      console.error("Error updating leave request:", error);
      throw error;
    }
  },

  // Delete a leave request
  deleteLeave: async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      return true;
    } catch (error) {
      console.error("Error deleting leave request:", error);
      throw error;
    }
  }

};

export default LeaveService;