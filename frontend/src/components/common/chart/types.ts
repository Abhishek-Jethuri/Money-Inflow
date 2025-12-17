export interface ChartData {
  month?: string;
  year?: number;
  expenses?: number;
  incomes?: number;
  title?: string;
  totalAmount?: number;
  icon?: string;
  color?: string;
  date?: string;
  amount?: number;
  transactions?: TransactionData[];
  accountTitle?: string;
  totalBalance?: number;
}

export interface TransactionData {
  title?: string;
  amount?: number;
  date?: string;
  accountTitle?: string;
  totalBalance?: number;
  isIncome?: boolean;
}

export interface ChartOptions {
  tooltip?: Record<string, unknown>;
  width?: string;
  grid?: Record<string, unknown>;
  type?: string;
  barWidth?: string;
  margin?: number;
  title?: Record<string, unknown>;
  color?: string[];
  xAxis?: Record<string, unknown>;
  yAxis?: Record<string, unknown>;
  plotOptions?: Record<string, unknown>;
  itemStyle?: Record<string, unknown>;
  toolbox?: Record<string, unknown>;
  responsive?: boolean;
  maintainAspectRatio?: boolean;
  legend?: Record<string, unknown>;
  series?: Record<string, unknown>[];
  voidLabelOverlap?: boolean;
}

export interface AccumulatedData {
  year: number;
  month: string;
  value: number;
}

export type ChartType = "changes" | "categories" | "overview-item" | "line";
