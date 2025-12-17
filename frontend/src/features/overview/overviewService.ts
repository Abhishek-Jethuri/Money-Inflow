import axiosConfig from "../../app/axiosConfig";
import type { OverviewResponse } from "./types";

const API_URL = "/api/v1/";

const getOverview = async (
  date: { startDate: string; endDate: string },
  id: string
): Promise<OverviewResponse> => {
  const { startDate, endDate } = date;
  const config = {
    params: {
      startDate,
      endDate,
      id,
    },
  };

  const response = await axiosConfig.get(API_URL + "get-overview", config);

  return response.data;
};

const overviewService = {
  getOverview,
};

export default overviewService;
