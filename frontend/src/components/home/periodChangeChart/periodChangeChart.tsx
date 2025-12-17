import React from "react";
import Card from "../../common/card/Card";
import HighchartsWrapper from "../../common/chart/HighChartsWrapper";
import { useCurrency } from "../../../utils/currency";
import "./periodChangeChart.scss";
import type { PeriodChangeChartProps } from "./types";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const PeriodChangeChart: React.FC<PeriodChangeChartProps> = ({
  periodChange,
  chartData,
  isLoading,
}) => {
  const { format } = useCurrency();

  if (isLoading) {
    return (
      <div className="chart-container">
        <Card>
          <div className="card-padding">
            <div className="top">
              <Skeleton width={120} height={24} style={{ marginBottom: 8 }} />
              <Skeleton width={80} height={36} />
            </div>
            <div className="bottom" style={{ marginTop: 24 }}>
              <Skeleton height={180} borderRadius={12} />
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="chart-container">
      <Card>
        <div className="card-padding">
          <div className="top">
            <h3>Period Change</h3>
            <h1>{format(periodChange)}</h1>
          </div>
          <div className="bottom">
            {chartData?.changesData &&
            Object.keys(chartData.changesData).length > 0 ? (
              <HighchartsWrapper
                chartType="changes"
                data={Object.entries(chartData.changesData).map(
                  ([key, value]) => ({
                    month: key.split(" ")[0],
                    year: parseInt(key.split(" ")[1]),
                    expenses: typeof value === "number" ? value : 0,
                  })
                )}
              />
            ) : (
              <div className="empty-placeholder">
                <p>Nada. Zilch. Zero. This chart is basically a vacation. 🏖️</p>
                <p> No transactions during this period</p>
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default PeriodChangeChart;
