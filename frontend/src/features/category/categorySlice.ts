import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import categoryService from "./categoryService";
import { toast } from "react-toastify";
import type {
  CategoryState,
  CategoryData,
  CategoryUpdateData,
  CategoryResponse,
  CategoriesResponse,
} from "./types";

const initialState: CategoryState = {
  category: [],
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: "",
};

export const createCategory = createAsyncThunk<CategoryResponse, CategoryData>(
  "category/create",
  async (categoryData, thunkAPI) => {
    try {
      return await categoryService.createCategory(categoryData);
    } catch (error) {
      const validationError = error as {
        name?: string;
        errors?: Record<string, { message: string }>;
        response?: { data?: unknown };
        message?: string;
      };
      if (validationError.name === "ValidationError") {
        const errors: Record<string, string> = {};

        Object.keys(validationError.errors || {}).forEach((key) => {
          errors[key] = validationError.errors?.[key].message || "";
        });

        return thunkAPI.rejectWithValue(error);
      }

      const message =
        (validationError.response && validationError.response.data) ||
        validationError.message ||
        String(error);
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const getCategories = createAsyncThunk<CategoriesResponse, void>(
  "category/getAll",
  async (_, thunkAPI) => {
    try {
      return await categoryService.getCategories();
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const deleteCategory = createAsyncThunk<
  { id: string; message: string },
  string
>("category/delete", async (id, thunkAPI) => {
  try {
    return await categoryService.deleteCategory(id);
  } catch (error) {
    const axiosError = error as {
      response?: { data?: unknown };
      message?: string;
    };
    const message =
      (axiosError.response && axiosError.response.data) ||
      axiosError.message ||
      String(error);
    return thunkAPI.rejectWithValue(message);
  }
});

export const updateCategory = createAsyncThunk<
  CategoryResponse,
  CategoryUpdateData
>("category/update", async (data, thunkAPI) => {
  try {
    return await categoryService.updateCategory(
      data.id,
      data.categoryUpdateData
    );
  } catch (error) {
    const validationError = error as {
      name?: string;
      errors?: Record<string, { message: string }>;
      response?: { data?: unknown };
      message?: string;
    };
    if (validationError.name === "ValidationError") {
      const errors: Record<string, string> = {};

      Object.keys(validationError.errors || {}).forEach((key) => {
        errors[key] = validationError.errors?.[key].message || "";
      });

      return thunkAPI.rejectWithValue(error);
    }
    const message =
      (validationError.response && validationError.response.data) ||
      validationError.message ||
      String(error);
    return thunkAPI.rejectWithValue(message);
  }
});

export const categorySlice = createSlice({
  name: "category",
  initialState,
  reducers: {
    categoryReset: (_state) => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(createCategory.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createCategory.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.category.unshift(action.payload.data);
        state.message = action.payload.message;
        toast.success(state.message);
      })
      .addCase(createCategory.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload as string;
        toast.error(state.message);
      })
      .addCase(getCategories.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getCategories.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.category = action.payload.data;
        state.message = action.payload.message;
      })
      .addCase(getCategories.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload as string;
        toast.error(state.message);
      })
      .addCase(deleteCategory.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.category = state.category.filter(
          (category) => category._id !== action.payload.id
        );
        state.message = action.payload.message;
        toast.success(state.message);
      })
      .addCase(deleteCategory.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload as string;
        toast.error(state.message);
      })
      .addCase(updateCategory.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateCategory.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.category = state.category.map((category) =>
          category._id === action.payload.data._id
            ? action.payload.data
            : category
        );
        state.message = action.payload.message;
        toast.success(state.message);
      })
      .addCase(updateCategory.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload as string;
        toast.error(state.message);
      });
  },
});

export const { categoryReset } = categorySlice.actions;
export default categorySlice.reducer;
