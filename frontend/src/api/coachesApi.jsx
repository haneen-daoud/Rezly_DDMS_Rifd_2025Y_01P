import axios from "axios";

const BASE_URL = "https://rezly-ddms-rifd-2025y-01p.onrender.com";

const ACCESS_TOKEN = import.meta.env.VITE_API_TOKEN || "";

export const getAllCoachesAPI = async () => {
  try {
    const res = await axios.get(`${BASE_URL}/auth/getAllEmployees?role=Coach`, {
      headers: {
        Authorization: `Bearer ${ACCESS_TOKEN.trim()}`,
      },
    });
    return res.data.employees;
  } catch (err) {
    console.error("Error fetching coaches:", err.response?.data || err.message);
    return [];
  }
};
