import api from "../api/apiClient";

const upsertAssessment = async (data) => {
  const response = await api.post("/assessments", data);
  return response.data;
};

const assessmentService = {
  upsertAssessment,
};

export default assessmentService;
