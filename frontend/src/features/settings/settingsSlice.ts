import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import settingsService from "./settingsService";
import type { UserProfile } from "./types";

interface SettingsState {
  profile: UserProfile;
  isLoading: boolean;
  isError: boolean;
  isSuccess: boolean;
  message: string;
}

const initialState: SettingsState = {
  profile: {
    _id: "",
    user: "",
    currency: "",
    language: "",
    theme: "light",
    timezone: "",
    notifications: {
      email: false,
      push: false,
    },
  },
  isLoading: false,
  isError: false,
  isSuccess: false,
  message: "",
};

export const updateProfile = createAsyncThunk(
  "settings/updateProfile",
  async (profileData: Partial<UserProfile>, thunkAPI) => {
    try {
      return await settingsService.updateProfile(profileData);
    } catch (error) {
      const axiosError = error as {
        response?: { data?: { message?: string } };
        message?: string;
      };
      const message =
        axiosError.response?.data?.message ||
        axiosError.message ||
        String(error);
      return thunkAPI.rejectWithValue(message);
    }
  }
);
export const getProfile = createAsyncThunk(
  "settings/getProfile",
  async (_, thunkAPI) => {
    try {
      return await settingsService.getProfile();
    } catch (error) {
      const axiosError = error as {
        response?: { data?: { message?: string } };
        message?: string;
      };
      const message =
        axiosError.response?.data?.message ||
        axiosError.message ||
        String(error);
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const settingsSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {
    settingsReset: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(getProfile.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.profile = action.payload;
        state.message = action.payload.message;
      })
      .addCase(getProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload as string;
        toast.error(state.message);
      })
      .addCase(updateProfile.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.profile = action.payload;
        toast.success("Profile updated successfully");
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload as string;
        toast.error(state.message);
      });
  },
});

export const { settingsReset } = settingsSlice.actions;
export default settingsSlice.reducer;
