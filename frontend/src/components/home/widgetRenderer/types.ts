import type { DashboardData } from "../../../features/dashboard/types";

export interface WidgetsRendererProps {
  dashboard: DashboardData | null;
  show: boolean;
  handleShow: () => void;
  setShow: (show: boolean) => void;
  isLoading: boolean;
}
