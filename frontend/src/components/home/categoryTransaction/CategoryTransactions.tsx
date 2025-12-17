import React from "react";
import { ICONS } from "../../../constants/constants";
import { useCurrency } from "../../../utils/currency";
import "./categoryTransactions.scss";
import type { CategoryTransactionsProps } from "./types";
import Icon from "../../common/icon/Icon";

const CategoryTransactions: React.FC<CategoryTransactionsProps> = ({
  title,
  color,
  icon,
  amount,
  subTitle,
}) => {
  const { format } = useCurrency();

  return (
    <div className="cat-tran-container">
      <div className="cat-tran-left">
        <Icon icon={ICONS[icon]} color={color} size={28}></Icon>
        <div className="cat-tran-header">
          <div className="title">{title}</div>
          <div className="sub-title">{subTitle}</div>
        </div>
      </div>
      <div className="cat-tran-right">
        <div className="sub-title">{format(amount)}</div>
      </div>
    </div>
  );
};

const CategoryTransactionsMemoized = React.memo(CategoryTransactions);
export default CategoryTransactionsMemoized;
