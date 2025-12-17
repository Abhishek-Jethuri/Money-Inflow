import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import HighchartsWrapper from "../../components/common/chart/HighChartsWrapper";
import "./overview.scss";
import { getDashboard } from "../../features/dashboard/dashboardSlice";
import CategoryTransactions from "../../components/home/categoryTransaction/CategoryTransactions";
import type { DashboardData } from "../../features/dashboard/types";
import Card from "../../components/common/card/Card";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useAppDispatch, useAppSelector } from "../../app/hooks";

const Overview: React.FC = () => {
  const dashboard = useAppSelector((state) => state.dashboard.dashboard);
  const isLoading = useAppSelector((state) => state.dashboard.isLoading);
  const [chartData, setChartData] = useState<DashboardData | null>(null);

  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  useEffect(() => {
    const date = {
      startDate: dashboard?.startDate || new Date(),
      endDate: dashboard?.endDate || new Date(),
    };
    if (!dashboard || !dashboard.categoriesData) {
      dispatch(getDashboard(date));
    }
  }, [dispatch, dashboard]);

  useEffect(() => {
    if (dashboard) {
      setChartData(dashboard);
    }
  }, [dashboard]);

  const handleCardClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    title: string
  ) => {
    e.preventDefault();
    if (dashboard) {
      navigate(
        `${title}?startDate=${dashboard.startDate}&endDate=${dashboard.endDate}`
      );
    }
  };

  if (isLoading || !dashboard || !dashboard.categoriesData) {
    return (
      <div className="overview-container">
        <div className="overview-category-bottom">
          <Card>
            <div className="card-padding">
              <div className="overview-category-bottom">
                <Skeleton height={300} borderRadius={12} />
              </div>
            </div>
          </Card>
          <div className="overview-category-cards">
            {[...Array(6)].map((_, i) => (
              <div key={i} style={{ marginBottom: 20 }}>
                <Card>
                  <div className="card-padding">
                    <Skeleton height={80} borderRadius={12} />
                  </div>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="overview-container">
      <div className="overview-category-top">
        <h2
          className="overview-category-title"
          style={{ color: "var(--purple-100)" }}
        >
          Expense
        </h2>
      </div>
      <div className="overview-category-bottom">
        <Card>
          <div className="card-padding">
            <div className="overview-category-bottom">
              <HighchartsWrapper
                chartType="categories"
                data={chartData?.categoriesData || []}
              />
            </div>
          </div>
        </Card>
        <div className="overview-category-cards">
          {dashboard?.categoriesData !== undefined &&
            dashboard?.categoriesData.map((item, index) => {
              const transactionlength = `${item?.transactions?.length}
              ${item?.transactions?.length > 1 ? "transactions" : "transaction"} `;

              return (
                <Link
                  key={index}
                  to={`${item.title}?startDate=${dashboard.startDate}&endDate=${dashboard.endDate}`}
                  className="overview-category-cards-link"
                  onClick={(e) => handleCardClick(e, item.title)}
                >
                  <Card>
                    <div className="card-padding">
                      <CategoryTransactions
                        title={item?.title}
                        color={item?.color}
                        icon={item?.icon}
                        amount={item?.totalAmount}
                        subTitle={transactionlength}
                        key={index}
                      ></CategoryTransactions>
                    </div>
                  </Card>
                </Link>
              );
            })}
        </div>
      </div>
    </div>
  );
};

export default Overview;
