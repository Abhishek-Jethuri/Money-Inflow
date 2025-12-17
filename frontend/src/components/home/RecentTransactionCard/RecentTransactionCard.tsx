import React from "react";
import { BsArrowRight } from "react-icons/bs";
import "./RecentTransactionCard.scss";
import Card from "../../common/card/Card";
import CategoryTransactions from "../categoryTransaction/CategoryTransactions";
import moment from "moment";
import type { RecentTransactionCardProps } from "./types";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const RecentTransactionCard: React.FC<RecentTransactionCardProps> = ({
  dashboard,
  navigate,
  isLoading,
}) => {
  const recentTransactions = dashboard?.recentTransactions;

  if (isLoading) {
    return (
      <Card className="transaction-card">
        <div className="transaction-card__content">
          <div className="transaction-card__header">
            <Skeleton width={160} height={24} />
          </div>
          <label className="transaction-card__body">
            {[...Array(4)].map((_, i) => (
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
          <h2>{"Recent Transactions"}</h2>
        </div>
        <label className="transaction-card__body">
          {recentTransactions && recentTransactions.length > 0 ? (
            recentTransactions.slice(0, 4).map((item, index) => {
              const category = item.category;
              return (
                <CategoryTransactions
                  title={item.title}
                  color={category.color}
                  icon={category.icon}
                  amount={item.amount}
                  subTitle={
                    item.date ? moment(String(item.date)).fromNow() : ""
                  }
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
          onClick={() => navigate("/transactions")}
        >
          <h4>View all</h4>
          <BsArrowRight />
        </div>
      </div>
    </Card>
  );
};

export default RecentTransactionCard;
