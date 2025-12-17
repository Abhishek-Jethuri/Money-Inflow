import type { DashboardData } from "../../../features/dashboard/types";

export interface RecentTransactionCardProps {
  dashboard: DashboardData | null;
  navigate: (path: string) => void;
  isLoading: boolean;
}
