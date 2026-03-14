import api from "../api/apiClient";

const getDashboard = async (mentorId) => {
  const response = await api.get(`/mentors/${mentorId}/dashboard`);
  return response.data;
};

const getMentorStudents = async (mentorId) => {
  const response = await api.get(`/mentors/${mentorId}/students`);
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
