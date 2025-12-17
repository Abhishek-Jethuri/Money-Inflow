import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import overviewService from "./overviewService";
import { toast } from "react-toastify";
import type {
  OverviewState,
  OverviewRequestData,
  OverviewResponse,
} from "./types";

const initialState: OverviewState = {
  overview: [],
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: "",
};

export const getOverview = createAsyncThunk<
  OverviewResponse,
  OverviewRequestData
>("overview/getAll", async (data, thunkAPI) => {
  try {
    return await overviewService.getOverview(
      { startDate: data.date, endDate: data.date },
      data.id
    );
  } catch (error) {
    return thunkAPI.rejectWithValue(error);
  }
});

export const overviewSlice = createSlice({
  name: "overview",
  initialState,
  reducers: {
    overviewReset: (_state) => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(getOverview.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getOverview.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.overview = action.payload.data;
        state.message = action.payload.message;
      })
      .addCase(getOverview.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload as string;
        toast.error(state.message);
      });
  },
});

export const { overviewReset } = overviewSlice.actions;
export default overviewSlice.reducer;
