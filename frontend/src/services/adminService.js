import api from "../api/apiClient";

const getDashboard = async () => {
  const response = await api.get("/admin/dashboard");
  return response.data;
};

const getStudents = async (search = "", department = "", limit = 10, offset = 0) => {
  const params = new URLSearchParams();
  if (search) params.append("search", search);
  if (department) params.append("department", department);
  params.append("limit", limit);
  params.append("offset", offset);
  
  const response = await api.get(`/admin/registry?${params.toString()}`);
  return response.data;
};

const getStudentDetails = async (studentId) => {
  const response = await api.get(`/admin/students/${studentId}`);
  return response.data;
};

const getMentorDetails = async (mentorId) => {
  const response = await api.get(`/admin/mentors/${mentorId}/students`);
  return response.data;
};

const getGradeDistribution = async (department = null) => {
  const url = department ? `/analytics/grade-distribution?department=${department}` : "/analytics/grade-distribution";
  const response = await api.get(url);
  return response.data;
};

const createStudent = async (studentData) => {
  const response = await api.post("/admin/students", studentData);
  return response.data;
};

const createMentor = async (mentorData) => {
  const response = await api.post("/admin/mentors", mentorData);
  return response.data;
};
const deleteStudent = async (studentId) => {
  const response = await api.delete(`/admin/students/${studentId}`);
  return response.data;
};

const deleteMentor = async (mentorId) => {
  const response = await api.delete(`/admin/mentors/${mentorId}`);
  return response.data;
};

const resetPassword = async (user_id, user_type, new_password) => {
  const response = await api.post("/admin/reset-password", { user_id, user_type, new_password });
  return response.data;
};

const adminService = {
  getDashboard,
  getStudents,
  getStudentDetails,
  getMentorDetails,
  getGradeDistribution,
  createStudent,
  createMentor,
  deleteStudent,
  deleteMentor,
  resetPassword,
};

export default adminService;
