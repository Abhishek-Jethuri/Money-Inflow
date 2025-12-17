import axiosConfig from "../../app/axiosConfig";
import type {
  CreateTransactionData,
  TransactionResponse,
  TransactionsResponse,
  DeleteTransactionData,
  DeleteTransactionResponse,
  DeleteTransactionsSelectedResponse,
} from "./types";

const API_URL = "/api/v1/";

const createTransaction = async (
  transactionData: CreateTransactionData
): Promise<TransactionResponse> => {
  const response = await axiosConfig.post(
    API_URL + "add-transaction",
    transactionData
  );

  return response.data;
};

const getTransactions = async (
  startDate: string,
  endDate: string
): Promise<TransactionsResponse> => {
  const config = {
    params: {
      startDate,
      endDate,
    },
  };

  const response = await axiosConfig.get(API_URL + "get-transactions", config);

  return response.data;
};

const deleteTransaction = async (
  data: DeleteTransactionData
): Promise<DeleteTransactionResponse> => {
  let response;

  if (data.id) {
    response = await axiosConfig.delete(
      API_URL + "delete-transaction/" + data.id
    );
  } else if (data.ids && Array.isArray(data.ids) && data.ids.length > 0) {
    response = await axiosConfig.post(
      API_URL + "delete-multiple-transactions",
      { ids: data.ids }
    );
  }

  return response?.data;
};

const updateTransaction = async (
  transactionId: string,
  transactionUpdateData: CreateTransactionData
): Promise<TransactionResponse> => {
  const response = await axiosConfig.put(
    API_URL + "update-transaction/" + transactionId,
    transactionUpdateData
  );

  return response.data;
};

const deleteTransactionsSelected = async (
  transactionSelectedIds: string[]
): Promise<DeleteTransactionsSelectedResponse> => {
  const pairs = transactionSelectedIds.map(function (value) {
    return encodeURIComponent(value);
  });
  const query_string = pairs.join("&");

  const response = await axiosConfig.delete(
    API_URL + "delete-transactions/" + query_string
  );

  return response.data;
};

const transactionService = {
  createTransaction,
  getTransactions,
  deleteTransaction,
  updateTransaction,
  deleteTransactionsSelected,
};

export default transactionService;
