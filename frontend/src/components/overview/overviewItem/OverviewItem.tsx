import React from "react";
import HighchartsWrapper from "../../common/chart/HighChartsWrapper";
import "./overViewItem.scss";
import { useNavigate, useParams } from "react-router-dom";
import CategoryTransactions from "../../home/categoryTransaction/CategoryTransactions";
import moment from "moment";
import { useEffect } from "react";
import { ICONS } from "../../../constants/constants";
import Card from "../../common/card/Card";
import Icon from "../../common/icon/Icon";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";

const OverviewItem: React.FC = () => {
  const dashboard = useAppSelector((state) => state.dashboard.dashboard);

  const routeParams = useParams<{ userId: string }>();

  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  useEffect(() => {
    // TODO: Fetch dashboard data if needed
  }, [dispatch]);

  const categoryDetails = dashboard?.categoriesData?.filter((category) => {
    return category?.title === routeParams.userId;
  });

  const transactions =
    categoryDetails?.flatMap(
      (item) =>
        item?.transactions?.map((transaction) => ({
          ...transaction,
          date: transaction?.date,
          amount: transaction?.amount,
          title: transaction?.title,
        })) || []
    ) || [];

  const hasValidData =
    transactions.length > 0 && transactions[0]?.date && transactions[0]?.amount;

  return (
    <div className="overview-container">
      <div className="overview-category-top">
        <button
          className="btn"
          style={{ background: "none", cursor: "pointer" }}
          onClick={() => navigate(-1)}
        >
          <div className="overview-items-title">
            <Icon
              icon={ICONS.LEFT}
              color={"var(--purple-100)"}
              size={32}
            ></Icon>
            <h2 style={{ color: "var(--purple-100)" }}>Back</h2>
          </div>
        </button>
      </div>
      <div className="overview-category-bottom">
        <Card>
          <div className="card-padding">
            <div className="overview-category-bottom">
              <div>
                {hasValidData ? (
                  <HighchartsWrapper
                    chartType="overview-item"
                    data={transactions}
                  />
                ) : (
                  <div
                    style={{
                      padding: "20px",
                      textAlign: "center",
                      color: "#666",
                    }}
                  >
                    {transactions.length === 0
                      ? "No transaction data available"
                      : "Invalid transaction data format"}
                    <br />
                  </div>
                )}
              </div>
            </div>
          </div>
        </Card>
        <div className="overview-category-cards">
          {categoryDetails !== undefined &&
            categoryDetails?.map((item) => {
              return item?.transactions?.map((transaction, ind) => {
                return (
                  <Card key={ind}>
                    <div className="card-padding">
                      <CategoryTransactions
                        title={transaction?.title}
                        color={item?.color || ""}
                        icon={item.icon || ""}
                        amount={transaction?.amount}
                        subTitle={moment(transaction?.date).format("MMM-YYYY")}
                        key={ind}
                      ></CategoryTransactions>
                    </div>
                  </Card>
                );
              });
            })}
        </div>
      </div>
    </div>
  );
};

export default OverviewItem;
