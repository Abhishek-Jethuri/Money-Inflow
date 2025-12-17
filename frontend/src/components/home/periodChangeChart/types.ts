import type { DashboardData } from "../../../features/dashboard/types";

export interface PeriodChangeChartProps {
  periodChange: number;
  chartData: DashboardData | null;
  isLoading: boolean;
}
