export interface Account {
  _id: string;
  title: string;
  amount: number;
  initialAmount: number;
  numberOfTransactions: number;
  icon?: string;
  currency?: string;
  userId?: string;
  user?: string;
  createdAt: string;
  updatedAt: string;
  __v?: number;
}

export interface AccountState {
  account: Account[];
  isError: boolean;
  isSuccess: boolean;
  isLoading: boolean;
  message: string;
}

export interface AccountData {
  title: string;
  amount: number;
  initialAmount: number;
  currency?: string;
  icon?: string;
}

export interface AccountUpdateData {
  id: string;
  accountUpdateData: AccountData;
}

export interface AccountResponse {
  data: Account;
  message: string;
}

export interface AccountsResponse {
  data: Account[];
  message: string;
}
