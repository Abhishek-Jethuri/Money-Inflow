import moment from "moment";
import { ICONS } from "../../../constants/constants";
import type {
  ChartType,
  ChartData,
  ChartOptions,
  AccumulatedData,
} from "./types";

export const getChartOptions = (
  chartType: ChartType,
  data: ChartData[]
): ChartOptions => {
  const pathSymbols = {
    reindeer:
      "path://M1.112,32.559l2.998,1.205l-2.882,2.268l-2.215-0.012L1.112,32.559z M37.803,23.96 c0.158-0.838,0.5-1.509,0.961-1.904c-0.096-0.037-0.205-0.071-0.344-0.071c-0.777-0.005-2.068-0.009-3.047-0.009 c-0.633,0-1.217,0.066-1.754,0.18l2.199,1.804H37.803z M39.738,23.036c-0.111,0-0.377,0.325-0.537,0.924h1.076 C40.115,23.361,39.854,23.036,39.738,23.036z M39.934,39.867c-0.166,0-0.674,0.705-0.674,1.986s0.506,1.986,0.674,1.986 s0.672-0.705,0.672-1.986S40.102,39.867,39.934,39.867z M38.963,38.889c-0.098-0.038-0.209-0.07-0.348-0.073 c-0.082,0-0.174,0-0.268-0.001l-7.127,4.671c0.879,0.821,2.42,1.417,4.348,1.417c0.979,0,2.27-0.006,3.047-0.01 c0.139,0,0.25-0.034,0.348-0.072c-0.646-0.555-1.07-1.643-1.07-2.967C37.891,40.529,38.316,39.441,38.963,38.889z M32.713,23.96 l-12.37-10.116l-4.693-0.004c0,0,4,8.222,4.827,10.121H32.713z M59.311,32.374c-0.248,2.104-5.305,3.172-8.018,3.172H39.629 l-25.325,16.61L9.607,52.16c0,0,6.687-8.479,7.95-10.207c1.17-1.6,3.019-3.699,3.027-6.407h-2.138 c-5.839,0-13.816-3.789-18.472-5.583c-2.818-1.085-2.396-4.04-0.031-4.04h0.039l-3.299-11.371h3.617c0,0,4.352,5.696,5.846,7.5 c2,2.416,4.503,3.678,8.228,3.87h30.727c2.17,0,4.311,0.417,6.252,1.046c3.49,1.175,5.863,2.7,7.199,4.027 C59.145,31.584,59.352,32.025,59.311,32.374z M22.069,30.408c0-0.815-0.661-1.475-1.469-1.475c-0.812,0-1.471,0.66-1.471,1.475 s0.658,1.475,1.471,1.475C21.408,31.883,22.069,31.224,22.069,30.408z M27.06,30.408c0-0.815-0.656-1.478-1.466-1.478 c-0.812,0-1.471,0.662-1.471,1.478s0.658,1.477,1.471,1.477C26.404,31.885,27.06,31.224,27.06,30.408z M32.055,30.408 c0-0.815-0.66-1.475-1.469-1.475c-0.808,0-1.466,0.66-1.466,1.475s0.658,1.475,1.466,1.475 C31.398,31.883,32.055,31.224,32.055,30.408z M37.049,30.408c0-0.815-0.658-1.478-1.467-1.478c-0.812,0-1.469,0.662-1.469,1.478 s0.656,1.477,1.469,1.477C36.389,31.885,37.049,31.224,37.049,30.408z M42.039,30.408c0-0.815-0.656-1.478-1.465-1.478 c-0.811,0-1.469,0.662-1.469,1.478s0.658,1.477,1.469,1.477C41.383,31.885,42.039,31.224,42.039,30.408z M55.479,30.565 c-0.701-0.436-1.568-0.896-2.627-1.347c-0.613,0.289-1.551,0.476-2.73,0.476c-1.527,0-1.639,2.263,0.164,2.316 C52.389,32.074,54.627,31.373,55.479,30.565z",
  };

  let chartOptions: ChartOptions = {};

  if (chartType === "changes") {
    chartOptions = {
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "shadow",
        },
        borderRadius: 10,
      },
      width: "95%",
      grid: {
        left: 0,
        right: 0,
        top: "15%",
        bottom: "15%",
        containLabel: true,
      },
      type: "bar",
      barWidth: "20%",
      margin: 0,
      title: {
        text: "Changes",
        left: "center",
      },
      color: ["#5432D380", "#F392F2"],
      xAxis: {
        axisLine: {
          show: false,
        },
        type: "category",
        axisTick: {
          alignWithLabel: true,
        },
        data: Array.from(
          new Set(data?.map((item) => `${item.month} ${item.year}`))
        ),
      },
      yAxis: {
        axisLabel: {
          formatter: (val: number) => `${val > 1000 ? val / 1000 + "K " : val}`,
        },
      },
      plotOptions: {
        column: {
          borderRadius: 10,
        },
      },
      itemStyle: {
        borderRadius: 10,
        borderColor: "#fff",
        borderWidth: 5,
      },
      toolbox: {
        feature: {
          dataZoom: {
            yAxisIndex: "true",
          },
          brush: {
            type: ["lineX", "clear"],
          },
        },
        bottom: 0,
        left: "right",
      },
      responsive: true,
      maintainAspectRatio: false,
      legend: {
        bottom: "5%",
        left: "center",
        icon: "circle",
      },
      series: [
        {
          name: "Expense",
          type: "bar",
          symbol: pathSymbols.reindeer,
          data: [
            ...(data?.map((item) => {
              return Math.abs(item?.expenses || 0);
            }) || []),
          ],
        },
        {
          name: "Income",
          type: "bar",
          data: [
            ...(data?.map((item) => {
              return item?.incomes || 0;
            }) || []),
          ],
        },
      ],
    };
  }

  if (chartType === "categories") {
    chartOptions = {
      tooltip: {
        show: true,
        borderRadius: 10,
        formatter: function (params: Record<string, unknown>) {
          let res = "";
          res +=
            `<svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" viewBox="0 0 24 24"><path fill="${
              params.color
            }" d="${ICONS[String((params.data as Record<string, string>).icon) as keyof typeof ICONS]}"/></svg>` +
            "</br>";
          res += `<b>${params.name}: ${params.percent}%</b>` + "</br>";
          res +=
            "Total Amount : " +
            (params.value as number).toLocaleString() +
            "</br>";
          return res;
        },
      },
      plotOptions: {
        pie: {
          allowPointSelect: true,
          borderWidth: 2,
          cursor: "pointer",
          dataLabels: {
            enabled: true,
            useHTML: true,
            formatter: function (this: Record<string, unknown>) {
              return `<span class="pie-chart-icon"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="${
                (this.point as Record<string, string>).color
              }" class="bi bi-apple" viewBox="0 0 24 24">
  <path d="${ICONS[String((this.point as Record<string, string>).icon) as keyof typeof ICONS]}"/>
    </svg><b>${((this.point as Record<string, number>).percentage as number).toFixed(2) + "%"} </b> </span>`;
            },
            distance: 10,
          },
          showInLegend: true,
          borderRadius: 10,
        },
      },
      itemStyle: {
        borderRadius: 10,
        borderColor: "#fff",
        borderWidth: 2,
      },
      voidLabelOverlap: false,
      legend: {
        type: "scroll",
        bottom: 0,
        left: "center",
        icon: "circle",
        orient: "horizontal",
        align: "left",
        height: "180px",
      },
      series: [
        {
          type: "pie",
          radius: ["40%", "80%"],
          top: "10%",
          bottom: "10%",
          colorByPoint: true,
          data: data?.map((item) => ({
            name: item?.title,
            value: Math.abs(item?.totalAmount || 0),
            icon: item?.icon,
            itemStyle: {
              color:
                item?.color === "var(--purple-100)"
                  ? "#5563f5"
                  : item?.color === "var(--purple-200)"
                    ? "#4318ff"
                    : item?.color,
            },
            label: {
              fontWeight: "bold",
              overflow: "break",
            },
          })),
        },
      ],
    };
  }

  if (chartType === "overview-item") {
    const accumulatedValuesByWeek: Record<string, number> = {};
    let accumulatedData: AccumulatedData[] = [];
    const seriesData: number[] = [];
    const xAxisData: string[] = [];

    const overviewData = () => {
      (data || []).forEach((item) => {
        const year = moment(item?.date).format("YYYY");
        const month = moment(item?.date).format("MMM");
        const value = Math.abs(item?.amount || 0);
        const key = `${year}-${month}`;
        if (accumulatedValuesByWeek[key]) {
          accumulatedValuesByWeek[key] += value;
        } else {
          accumulatedValuesByWeek[key] = value;
        }
      });

      accumulatedData = Object.entries(accumulatedValuesByWeek).map(
        ([date, value]) => {
          const [year, month] = date.split("-");
          return {
            year: parseInt(year),
            month: month,
            value,
          };
        }
      );

      const months = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ];

      const sorter = (a: AccumulatedData, b: AccumulatedData) => {
        if (a.year !== b.year) {
          return a.year - b.year;
        } else {
          return months.indexOf(a.month) - months.indexOf(b.month);
        }
      };

      if (Array.isArray(accumulatedData)) {
        accumulatedData.sort(sorter);
        accumulatedData.forEach((item) => {
          const formattedDate = `${item?.month}-${item?.year}`;
          seriesData.push(item?.value);
          xAxisData.push(formattedDate);
        });
      }
    };

    overviewData();

    chartOptions = {
      tooltip: {
        trigger: "axis",
        axisPointer: { type: "shadow" },
        borderRadius: 10,
      },
      width: "95%",
      grid: {
        left: 0,
        right: 0,
        top: "15%",
        bottom: "15%",
        containLabel: true,
      },
      type: "bar",
      barWidth: "20%",
      margin: 0,
      title: {
        text: "Changes",
        left: "center",
      },
      color: ["#5432D380", "#F392F2"],
      xAxis: {
        axisLine: { show: false },
        type: "category",
        axisTick: { alignWithLabel: true },
        data: xAxisData,
      },
      yAxis: {
        axisLabel: {
          formatter: (val: number) => `${val > 1000 ? val / 1000 + "K " : val}`,
        },
      },
      plotOptions: {
        column: {
          borderRadius: 10,
        },
      },
      itemStyle: {
        borderRadius: 10,
        borderColor: "#fff",
        borderWidth: 5,
      },
      toolbox: {
        feature: {
          dataZoom: { yAxisIndex: "true" },
          brush: { type: ["lineX", "clear"] },
        },
        bottom: 0,
        left: "right",
      },
      responsive: true,
      maintainAspectRatio: false,
      legend: {
        bottom: "5%",
        left: "center",
        icon: "circle",
      },
      series: [
        {
          name: "Category",
          type: "bar",
          data: seriesData,
        },
      ],
    };
  }

  return chartOptions;
};
