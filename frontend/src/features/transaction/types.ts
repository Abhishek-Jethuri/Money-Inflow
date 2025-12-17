export interface TransactionData {
  _id: string;
  title: string;
  amount: number;
  category: {
    _id: string;
    title: string;
    icon: string;
    color: string;
  };
  account: {
    _id: string;
    title: string;
    currency: string;
  };
  date: string;
  description?: string;
  isIncome: boolean;
  type: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface TransactionState {
  transaction: TransactionData[];
  isError: boolean;
  isSuccess: boolean;
  isLoading: boolean;
  isFetching: boolean;
  isCreating: boolean;
  isDeleting: boolean;
  isUpdating: boolean;
  message: string;
}

export interface CreateTransactionData {
  title: string;
  amount: string;
  account: string;
  date: string;
  category: string;
  description: string;
  isIncome: boolean;
  type: string;
}

export interface UpdateTransactionData {
  id: string;
  transactionUpdateData: CreateTransactionData;
}

export interface DeleteTransactionData {
  id?: string;
  ids?: string[];
}

export interface GetTransactionsData {
  startDate: string;
  endDate: string;
}

export interface TransactionResponse {
  data: TransactionData;
  message: string;
}

export interface TransactionsResponse {
  data: TransactionData[];
  message: string;
}

export interface DeleteTransactionResponse {
  id?: string;
  ids?: string[];
  message: string;
}

export interface DeleteTransactionsSelectedResponse {
  ids: string[];
  message: string;
}
