import type { DashboardData } from "../../../features/dashboard/types";

export interface AccountSpendingProps {
  dashboard: DashboardData | null;
  currentSlide: number;
  handleSlideChange: (swiper: { activeIndex: number }) => void;
  navigate: (path: string) => void;
  isLoading: boolean;
}
