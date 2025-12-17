export interface Transaction {
  _id: string;
  title: string;
  description?: string;
  category: { title: string; icon: string; color: string };
  date: string;
  account: { title: string };
  amount: number;
  isIncome: boolean;
}
