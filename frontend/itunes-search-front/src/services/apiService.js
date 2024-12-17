import axios from "axios";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const fetchAlbumsByArtist = async (artist) => {
  try {
    const response = await apiClient.get("/albums", {
      params: { artist },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching albums:", error);
    throw error;
  }
};
