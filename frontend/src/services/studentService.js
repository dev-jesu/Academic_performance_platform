import api from "../api/apiClient";

const getPerformance = async (studentId) => {
  const response = await api.get(`/students/${studentId}/performance`);
  return response.data;
};

const studentService = {
  getPerformance,
};

export default studentService;
