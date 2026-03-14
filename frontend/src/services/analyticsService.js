import api from "../api/apiClient";

export const getDashboardStats = async () => {
  const res = await api.get("/analytics/dashboard");
  return res.data;
};

export const getGradeDistribution = async () => {
  const res = await api.get("/analytics/grade-distribution");
  return res.data;
};