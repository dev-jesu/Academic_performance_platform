import api from "../api/apiClient";

const createEnrollment = async (data) => {
  const response = await api.post("/enrollments", data);
  return response.data;
};

const getEnrollments = async () => {
  const response = await api.get("/enrollments");
  return response.data;
};

const enrollmentService = {
  createEnrollment,
  getEnrollments,
};

export default enrollmentService;
