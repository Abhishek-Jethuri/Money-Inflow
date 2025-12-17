import { ICONS } from "../../../constants/constants";

export interface WidgetData {
  title: string;
  icon: keyof typeof ICONS;
  amount: number;
}

export interface WidgetProps {
  type: "spent" | "balance" | "earnings" | "add-transaction";
  className?: string;
  className2?: {
    transactionBoxShadow?: string;
    transactionWidgetIcon?: string;
  };
  amount?: number;
}
