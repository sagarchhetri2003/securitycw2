import api from "../axios"; // ✅ correct path to your axios.jsx

export const registerUser = async (formData) => {
  const res = await api.post("/register", formData); // CSRF token added automatically
  return res.data;
};

export const updateUserProfile = async (userId, formData) => {
  const res = await api.put(`/user/update/${userId}`, formData); // CSRF token added automatically
  return res.data;
};
