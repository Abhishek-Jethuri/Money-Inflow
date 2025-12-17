import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import moment from "moment";
import type { DashboardState, DateRange, DashboardResponse } from "./types";
import dashboardService from "./dashboardService";

const initialState: DashboardState = {
  dashboard: null,
  startDate: moment().startOf("month").toDate(),
  endDate: moment().endOf("month").toDate(),
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: "",
};

export const getDashboard = createAsyncThunk<DashboardResponse, DateRange>(
  "dashboard/getAll",
  async (data, thunkAPI) => {
    try {
      const response = await dashboardService.getDashboard({
        startDate: data.startDate,
        endDate: data.endDate,
      });
      return response;
    } catch (error) {
      const axiosError = error as {
        response?: { data?: unknown };
        message?: string;
      };
      return thunkAPI.rejectWithValue(
        axiosError.response?.data || axiosError.message || String(error)
      );
    }
  }
);

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {
    dashboardReset: () => initialState,
    setDateRange: (state, action) => {
      state.startDate = action.payload.startDate;
      state.endDate = action.payload.endDate;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getDashboard.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getDashboard.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.dashboard = action.payload.data;
        state.message = action.payload.message;
      })
      .addCase(getDashboard.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload as string;
        toast.error(state.message);
      });
  },
});

export const { dashboardReset, setDateRange } = dashboardSlice.actions;
export default dashboardSlice.reducer;
