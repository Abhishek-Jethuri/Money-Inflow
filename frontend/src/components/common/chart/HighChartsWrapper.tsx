import React from "react";
import { getChartOptions } from "./chartOptionsHelper";
import ReactECharts from "echarts-for-react";
import type { ChartType, ChartData } from "./types";

interface HighchartsWrapperProps {
  chartType: ChartType;
  data: ChartData[];
}

const HighchartsWrapper: React.FC<HighchartsWrapperProps> = ({
  chartType,
  data,
}) => {
  const chartOptions = getChartOptions(chartType, data);

  return <ReactECharts option={chartOptions} />;
};

export default HighchartsWrapper;
