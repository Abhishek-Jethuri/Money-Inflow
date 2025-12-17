import type { DashboardData } from "../../../features/dashboard/types";

export interface User {
  name: string;
}

export interface ProfileCardProps {
  avatar: string;
  userProfile: DashboardData | null;
  user: User | null;
  isLoading: boolean;
}
