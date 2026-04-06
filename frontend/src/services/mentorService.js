import api from "../api/apiClient";

const getDashboard = async (mentorId) => {
  const response = await api.get(`/mentors/${mentorId}/dashboard`);
  return response.data;
};

const getMentorStudents = async (mentorId, search = "", department = "") => {
  const params = new URLSearchParams();
  if (search) params.append("search", search);
  if (department) params.append("department", department);
  const response = await api.get(`/mentors/${mentorId}/students?${params.toString()}`);
  return response.data;
};

const getMentor = async (mentorId) => {
  const response = await api.get(`/mentors/${mentorId}`);
  return response.data;
};

const mentorService = {
  getDashboard,
  getMentorStudents,
  getMentor,
};

export default mentorService;
