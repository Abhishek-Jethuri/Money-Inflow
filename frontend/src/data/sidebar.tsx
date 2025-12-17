import type { ICONS } from "../constants/constants";

export type SidebarOptionType = {
  id: string;
  name: string;
  to: string;
  icon: keyof typeof ICONS;
};

export const SidebarData: SidebarOptionType[] = [
  { id: "1", name: "Home", to: "/", icon: "HOME" },
  { id: "2", name: "Categories", to: "categories", icon: "CATEGORY" },
  { id: "3", name: "Transactions", to: "transactions", icon: "BANK" },
  { id: "4", name: "Wallets", to: "wallets", icon: "WALLET" },
  { id: "5", name: "Overview", to: "overview", icon: "PIE_CHART" },
  { id: "6", name: "Settings", to: "settings", icon: "SETTINGS" },
];
