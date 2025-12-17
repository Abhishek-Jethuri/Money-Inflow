import React from "react";
import "./widgets.scss";
import { ICONS } from "../../../constants/constants";
import { useCurrency } from "../../../utils/currency";
import type { WidgetProps, WidgetData } from "./types";
import Icon from "../icon/Icon";

export const Widget: React.FC<WidgetProps> = ({
  type,
  className,
  className2,
  amount,
}) => {
  const { format } = useCurrency();
  let data: WidgetData;

  switch (type) {
    case "spent":
      data = {
        title: "Period Expenses",
        icon: "BAR_CHART",
        amount: Math.abs(amount || 0),
      };
      break;
    case "balance":
      data = {
        title: "Balance",
        icon: "BANK",
        amount: amount || 0,
      };
      break;
    case "earnings":
      data = {
        title: "Period Earnings",
        icon: "RUPEE",
        amount: amount || 0,
      };
      break;
    case "add-transaction":
      data = {
        title: "Add Transaction",
        icon: "ADD",
        amount: 682.5,
      };
      break;
    default:
      data = {
        title: "Unknown",
        icon: "BAR_CHART",
        amount: 0,
      };
  }

  return (
    <div
      className={`widget ${
        className === "transaction"
          ? className2?.transactionBoxShadow
          : className === "add-transaction"
            ? "add-transaction-background"
            : ""
      }`}
    >
      <div className="left">
        <div
          className={`icon-container ${
            className !== undefined ? className2?.transactionWidgetIcon : ""
          }`}
        >
          <Icon icon={ICONS[data.icon]} color={"white"} size={28}></Icon>
        </div>
      </div>
      <div className="right">
        <h3
          className={`${className === "add-transaction" ? "add-transaction-title" : "title"}`}
        >
          {data.title}
        </h3>
        {className !== "add-transaction" && (
          <h4
            className={`amount ${className === "add-transaction" ? "add-transaction-title" : ""}`}
          >
            {format(data.amount)}
          </h4>
        )}
      </div>
    </div>
  );
};

const WidgetMemoized = React.memo(Widget);
export default WidgetMemoized;
