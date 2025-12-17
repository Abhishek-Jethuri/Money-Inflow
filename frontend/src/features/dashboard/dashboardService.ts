import axiosConfig from "../../app/axiosConfig";
import type { DashboardParams, DashboardResponse } from "./types";

const API_URL = "/api/v1/";

const getDashboard = async ({
  startDate,
  endDate,
}: DashboardParams): Promise<DashboardResponse> => {
  const config = {
    params: {
      startDate,
      endDate,
    },
  };

  const response = await axiosConfig.get<DashboardResponse>(
    `${API_URL}get-dashboard`,
    config
  );

  return response.data;
};

const dashboardService = {
  getDashboard,
};

export default dashboardService;
