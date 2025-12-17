import type { AxiosResponse } from "axios";
import type { ICONS } from "../../constants/constants";

export interface AccountDetail {
  title: string;
  balance: string;
  totalIncome: number;
  totalExpense: number;
}

export interface CategoryData {
  title: string;
  color: string;
  icon: keyof typeof ICONS;
  transactions: Transaction[];
  totalAmount: number;
}

export interface Transaction {
  title: string;
  amount: number;
  date: string;
  category: {
    color: string;
    icon: keyof typeof ICONS;
  };
}

export interface ChangesData {
  [key: string]: number | string;
}

export interface AccountBalance {
  accountId: string;
  accountName: string;
  balance: number;
  currency: string;
}

export interface CategoryWithMostSpent {
  categoryId: string;
  categoryName: string;
  totalSpent: number;
  percentage: number;
}

export interface DashboardData {
  periodChange: number;
  totalBalance: number;
  periodEarnings: number;
  periodExpenses: number;
  recentTransactions: Transaction[];
  changesData: ChangesData;
  accountDetails: AccountDetail[];
  accountBalance: AccountBalance[];
  categoriesData: CategoryData[];
  totalTransactionsCount: number;
  categoryWithMostSpent: CategoryWithMostSpent;
  savingsRate: number;
  userPersona: string;
  startDate: Date;
  endDate: Date;
}

export interface DashboardState {
  dashboard: DashboardData | null;
  startDate: Date | null;
  endDate: Date | null;
  isError: boolean;
  isSuccess: boolean;
  isLoading: boolean;
  message: string;
}

export interface DateRange {
  startDate: Date | null;
  endDate: Date | null;
}

export interface DashboardParams {
  startDate: Date | null;
  endDate: Date | null;
}

export interface DashboardResponse extends AxiosResponse {
  data: DashboardData;
  message: string;
}
