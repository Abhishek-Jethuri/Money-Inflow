import type { DashboardData } from "../../../features/dashboard/types";

export interface PeriodExpensesCardProps {
  dashboard: DashboardData | null;
  navigate: (path: string) => void;
  isLoading: boolean;
}
