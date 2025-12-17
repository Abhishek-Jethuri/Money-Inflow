import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import accountService from "./accountservice";
import { toast } from "react-toastify";
import type {
  AccountState,
  AccountData,
  AccountUpdateData,
  AccountResponse,
  AccountsResponse,
} from "./types";

const initialState: AccountState = {
  account: [],
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: "",
};

export const createAccount = createAsyncThunk<AccountResponse, AccountData>(
  "account/create",
  async (accountData, thunkAPI) => {
    try {
      return await accountService.createAccount(accountData);
    } catch (error) {
      const axiosError = error as {
        name?: string;
        errors?: Record<string, { message: string }>;
        response?: { data?: { message?: string } };
        message?: string;
      };
      console.error("Error in createAccount thunk:", error);
      if (axiosError.name === "ValidationError") {
        const errors: Record<string, string> = {};

        Object.keys(axiosError.errors || {}).forEach((key) => {
          errors[key] = axiosError.errors?.[key].message || "";
        });

        return thunkAPI.rejectWithValue(error);
      }

      const message =
        (axiosError.response &&
          axiosError.response.data &&
          axiosError.response.data.message) ||
        axiosError.message ||
        String(error);
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const getAccounts = createAsyncThunk<AccountsResponse, void>(
  "account/getAll",
  async (_, thunkAPI) => {
    try {
      return await accountService.getAccounts();
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const deleteAccount = createAsyncThunk<
  { id: string; message: string },
  string
>("account/delete", async (id, thunkAPI) => {
  try {
    return await accountService.deleteAccount(id);
  } catch (error) {
    const axiosError = error as {
      response?: { data?: { message?: string } };
      message?: string;
    };
    const message =
      (axiosError.response &&
        axiosError.response.data &&
        axiosError.response.data.message) ||
      axiosError.message ||
      String(error);
    return thunkAPI.rejectWithValue(message);
  }
});

export const updateAccount = createAsyncThunk<
  AccountResponse,
  AccountUpdateData
>("account/update", async (data, thunkAPI) => {
  try {
    return await accountService.updateAccount(data.id, data.accountUpdateData);
  } catch (error) {
    const axiosError = error as {
      name?: string;
      errors?: Record<string, { message: string }>;
      response?: { data?: { message?: string } };
      message?: string;
    };
    if (
      axiosError.name === "ValidationError" ||
      axiosError.name === "CastError"
    ) {
      const errors: Record<string, string> = {};

      Object.keys(axiosError.errors || {}).forEach((key) => {
        errors[key] = axiosError.errors?.[key].message || "";
      });

      return thunkAPI.rejectWithValue(error);
    }
    const message =
      (axiosError.response &&
        axiosError.response.data &&
        axiosError.response.data.message) ||
      axiosError.message ||
      String(error);
    return thunkAPI.rejectWithValue(message);
  }
});

export const accountSlice = createSlice({
  name: "account",
  initialState,
  reducers: {
    accountReset: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(createAccount.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createAccount.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.account.unshift(action.payload.data);
        state.message = action.payload.message;
        toast.success(state.message);
      })
      .addCase(createAccount.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload as string;
        toast.error(state.message);
      })
      .addCase(getAccounts.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAccounts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.account = action.payload.data;
        state.message = action.payload.message;
      })
      .addCase(getAccounts.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload as string;
        toast.error(state.message);
      })
      .addCase(deleteAccount.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteAccount.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.account = state.account.filter(
          (account) => account._id !== action.payload.id
        );
        state.message = action.payload.message;
        toast.success(state.message);
      })
      .addCase(deleteAccount.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload as string;
        toast.error(state.message);
      })
      .addCase(updateAccount.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateAccount.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.account = state.account.map((account) =>
          account._id === action.payload.data._id
            ? action.payload.data
            : account
        );
        state.message = action.payload.message;
        toast.success(state.message);
      })
      .addCase(updateAccount.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload as string;
        toast.error(state.message);
      });
  },
});

export const { accountReset } = accountSlice.actions;
export default accountSlice.reducer;
