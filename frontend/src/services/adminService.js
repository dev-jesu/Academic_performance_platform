import api from "../api/apiClient";

const getDashboard = async () => {
  const response = await api.get("/admin/dashboard");
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

const adminService = {
  getDashboard,
  getStudentDetails,
  getMentorDetails,
  getGradeDistribution,
  createStudent,
  createMentor,
};

export default adminService;
