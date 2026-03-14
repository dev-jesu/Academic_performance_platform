import api from "../api/apiClient";

const login = async (email, password) => {
  const response = await api.post("/auth/login", { email, password });
  if (response.data.access_token) {
    localStorage.setItem("token", response.data.access_token);
    localStorage.setItem("role", response.data.role);
    localStorage.setItem("user", JSON.stringify(response.data));
  }
  return response.data;
};

const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("role");
  localStorage.removeItem("user");
};

const getCurrentUser = () => {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
};

const authService = {
  login,
  logout,
  getCurrentUser,
};

export default authService;
