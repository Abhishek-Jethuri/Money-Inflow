export interface Category {
  _id: string;
  title: string;
  icon: string;
  color: string;
  isIncome: boolean;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CategoryState {
  category: Category[];
  isError: boolean;
  isSuccess: boolean;
  isLoading: boolean;
  message: string;
}

export interface CategoryData {
  title: string;
  icon: string;
  color: string;
  isIncome: boolean;
}

export interface CategoryUpdateData {
  id: string;
  categoryUpdateData: CategoryData;
}

export interface CategoryResponse {
  data: Category;
  message: string;
}

export interface CategoriesResponse {
  data: Category[];
  message: string;
}
