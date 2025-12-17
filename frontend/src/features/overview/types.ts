export interface OverviewData {
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

export interface OverviewState {
  overview: OverviewData[];
  isError: boolean;
  isSuccess: boolean;
  isLoading: boolean;
  message: string;
}

export interface OverviewRequestData {
  date: string;
  id: string;
}

export interface OverviewResponse {
  data: OverviewData[];
  message: string;
}
