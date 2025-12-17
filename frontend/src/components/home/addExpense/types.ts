export interface CategoryValue {
  label: string;
  value: string;
}

export interface AccountValue {
  label: string;
  value: string;
}

export interface CategoryOption {
  value: string;
  label: string;
}

export interface AccountOption {
  value: string;
  label: string;
}

export interface GroupedCategoryOptions {
  expense: CategoryOption[];
  income: CategoryOption[];
}

export interface TransactionData {
  _id?: string;
  title?: string;
  amount?: number;
  category?: {
    _id: string;
    title: string;
  };
  account?: {
    _id: string;
    title: string;
  };
  date?: string;
  description?: string;
  isIncome?: boolean;
}

export interface AddExpenseProps {
  show: boolean;
  setShow: (show: boolean) => void;
  action: string;
  updateData?: TransactionData;
}
