import React from "react";
import { BsArrowRight } from "react-icons/bs";
import "./transactionCard.scss";
import Card from "../../common/card/Card";
import CategoryTransactions from "../categoryTransaction/CategoryTransactions";
import type { PeriodExpensesCardProps } from "./types";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const PeriodExpensesCard: React.FC<PeriodExpensesCardProps> = ({
  dashboard,
  navigate,
  isLoading,
}) => {
  const categoriesData = dashboard?.categoriesData;

  if (isLoading) {
    return (
      <Card className="transaction-card">
        <div className="transaction-card__content">
          <div className="transaction-card__header">
            <Skeleton width={160} height={24} />
          </div>
          <label className="transaction-card__body">
            {Array(4).map((_, i) => (
              <div style={{ marginBottom: 16 }} key={i}>
                <Skeleton height={48} borderRadius={12} />
              </div>
            ))}
          </label>
          <div className="transaction-card__footer">
            <Skeleton width={80} height={20} />
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="transaction-card">
      <div className="transaction-card__content">
        <div className="transaction-card__header">
          <h2>{"Period Expenses"}</h2>
        </div>
        <label className="transaction-card__body">
          {categoriesData && categoriesData.length > 0 ? (
            categoriesData.slice(0, 4).map((item, index) => {
              const transactionLengthText = `${item.transactions.length} transaction${
                item.transactions.length === 1 ? "" : "s"
              }`;
              return (
                <CategoryTransactions
                  title={String(item.title)}
                  color={String(item.color || "")}
                  icon={item.icon}
                  amount={Number(item.totalAmount || 0)}
                  subTitle={transactionLengthText}
                  key={index}
                />
              );
            })
          ) : (
            <div className="transaction-card__empty">
              <h3 className="transaction-card__body-title">
                Nothing spent yet!
              </h3>
              <p>Your wallet is still in hibernation mode. 🐻💤</p>
            </div>
          )}
        </label>
        <div
          className="transaction-card__footer"
          onClick={() => navigate("/overview")}
        >
          <h4>View all</h4>
          <BsArrowRight />
        </div>
      </div>
    </Card>
  );
};

export default PeriodExpensesCard;
