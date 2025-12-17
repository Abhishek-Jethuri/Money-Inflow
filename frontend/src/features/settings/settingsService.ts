import axiosConfig from "../../app/axiosConfig";
import type { UserProfile } from "./types";

const API_URL = "/api/v1/";

const getProfile = async () => {
  const response = await axiosConfig.get(`${API_URL}get-profile`);
  return response.data;
};

const updateProfile = async (profileData: Partial<UserProfile>) => {
  const response = await axiosConfig.put(
    `${API_URL}update-profile`,
    profileData
  );
  return response.data;
};

const settingsService = {
  getProfile,
  updateProfile,
};

export default settingsService;
