import type { ICONS } from "../../../constants/constants";

export interface CategoryTransactionsProps {
  title: string;
  color: string;
  icon: keyof typeof ICONS;
  amount: number;
  subTitle: string;
  key?: string | number;
}
