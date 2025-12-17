import axiosConfig from "../../app/axiosConfig";
import type { CategoryData } from "./types";

const API_URL = "/api/v1/";

const createCategory = async (categoryData: CategoryData) => {
  const response = await axiosConfig.post(
    API_URL + "add-category",
    categoryData
  );

  return response.data;
};

const getCategories = async () => {
  const response = await axiosConfig.get(API_URL + "get-categories");

  return response.data;
};

const deleteCategory = async (categoryId: string) => {
  const response = await axiosConfig.delete(
    API_URL + "delete-category/" + categoryId
  );

  return response.data;
};

const deleteCategorysSelected = async (categorySelectedIds: string[]) => {
  const pairs = categorySelectedIds.map((value) => encodeURIComponent(value));
  const query_string = pairs.join("&");

  const response = await axiosConfig.delete(
    API_URL + "delete-categorys/" + query_string
  );

  return response.data;
};

const updateCategory = async (
  categoryId: string,
  categoryUpdateData: CategoryData
) => {
  const response = await axiosConfig.put(
    API_URL + "update-category/" + categoryId,
    categoryUpdateData
  );

  return response.data;
};

const categoryService = {
  createCategory,
  getCategories,
  deleteCategory,
  deleteCategorysSelected,
  updateCategory,
};

export default categoryService;
