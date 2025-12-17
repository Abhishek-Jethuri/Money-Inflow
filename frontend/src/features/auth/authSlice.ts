import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import {
  register as registerUser,
  login as loginUser,
  logout as logoutUser,
} from "./authService"; // Adjust the path if necessary
import { toast } from "react-toastify";
import type { User } from "./types";

interface AuthState {
  user: User | null;
  isError: boolean;
  isSuccess: boolean;
  isLoading: boolean;
  message: string;
}

const user = localStorage.getItem("user")
  ? JSON.parse(localStorage.getItem("user")!)
  : null;

const initialState: AuthState = {
  user,
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: "",
};

export const register = createAsyncThunk(
  "auth/register",
  async (user: Record<string, string>, thunkAPI) => {
    try {
      return await registerUser(
        user as unknown as {
          username: string;
          password: string;
          [key: string]: string;
        }
      );
    } catch (error) {
      const axiosError = error as {
        response?: { data?: { message?: string } } & { message?: string };
      };
      return thunkAPI.rejectWithValue(
        axiosError?.response?.data?.message ||
          (axiosError as Record<string, unknown>).message ||
          String(error)
      );
    }
  }
);

export const login = createAsyncThunk(
  "auth/login",
  async (user: Record<string, string>, thunkAPI) => {
    try {
      return await loginUser(
        user as unknown as {
          username: string;
          password: string;
          [key: string]: string;
        }
      );
    } catch (error) {
      const axiosError = error as {
        response?: { data?: { message?: string } } & { message?: string };
      };
      return thunkAPI.rejectWithValue(
        axiosError?.response?.data?.message ||
          (axiosError as Record<string, unknown>).message ||
          String(error)
      );
    }
  }
);

export const logout = createAsyncThunk(
  "auth/logout",
  async (userId: Record<string, unknown>, thunkAPI) => {
    try {
      await logoutUser(userId);
    } catch (error) {
      const axiosError = error as {
        response?: { data?: { message?: string } } & { message?: string };
      };
      return thunkAPI.rejectWithValue(
        axiosError?.response?.data?.message ||
          (axiosError as Record<string, unknown>).message ||
          String(error)
      );
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(register.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(
        register.fulfilled,
        (state, action: PayloadAction<Record<string, unknown>>) => {
          state.isLoading = false;
          state.isSuccess = true;
          state.user = action.payload as unknown as User;
        }
      )
      .addCase(register.rejected, (state, action: PayloadAction<unknown>) => {
        state.isLoading = false;
        state.isError = true;
        state.message = String(action.payload || "");
        toast.error(state.message);
        state.user = null;
      })
      .addCase(login.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(
        login.fulfilled,
        (state, action: PayloadAction<Record<string, unknown>>) => {
          state.isLoading = false;
          state.isSuccess = true;
          state.user = action.payload as unknown as User;
        }
      )
      .addCase(login.rejected, (state, action: PayloadAction<unknown>) => {
        state.isLoading = false;
        state.isError = true;
        state.message = String(action.payload || "");
        toast.error(state.message);
        state.user = null;
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
      });
  },
});

export const { reset } = authSlice.actions;
export default authSlice.reducer;
