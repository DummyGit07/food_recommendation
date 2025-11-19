import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

export async function fetchRecommendations(latitude, longitude, location) {
  try {
    const response = await axios.post(`${API_BASE_URL}/recommend`, {
      latitude,
      longitude,
      location,
    });
    return response.data;
  } catch (error) {
    console.error("API fetch error:", error);
    throw error;
  }
}
