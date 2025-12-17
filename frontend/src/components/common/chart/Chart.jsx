// import {
//   BarChart,
//   Bar,
//   Cell,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   Legend,
//   ResponsiveContainer,
// } from "recharts";
// const data = [
//   { name: "January", Total: 1200 },
//   { name: "February", Total: 2100 },
//   { name: "March", Total: 800 },
//   { name: "April", Total: 1600 },
//   { name: "May", Total: 900 },
//   { name: "June", Total: 1700 },
//   { name: "July", Total: 1200 },
//   { name: "August", Total: 100 },
//   { name: "September", Total: 900 },
//   { name: "October", Total: 200 },
//   { name: "November", Total: 1600 },
//   { name: "Decemeber", Total: 200 },
// ];
// const Chart = ({ aspect, title }) => {
//   return (
//     <div className="chart">
//       <div className="title">{title}</div>
//       <ResponsiveContainer width="100%" aspect={aspect}>
//         <BarChart width={150} height={40} data={data}>
//           <Bar dataKey="Total" fill="#8884d8" />
//           <XAxis tickLine="false" />
//         </BarChart>
//       </ResponsiveContainer>
//     </div>
//   );
// };

// export default Chart;

const getRating = (product) => {
  return [product?.title, product?.rating];
};

const graphicData = ({ data, category }) => {
  const filteredData = data?.products.filter(
    (product) => product.category === category
  );
  return filteredData?.map((product) => getRating(product));
};

export const options = {
  // chart: {
  //   type: "column",
  //   // height: (4 / 5 * 40) + '%' // 16:9 ratio
  // },
  // title: {
  //   text: "smartphones",
  // },
  // subtitle: {
  //   text: "smartphones",
  // },
  // colors:["#4318FF", "#39B8FF"],
  // xAxis: {
  //   // type: "category",
  //   // labels: {
  //   //   rotation: -45,
  //   // },
  //   type: "numeric",
  //   categories: ["SEP", "OCT", "NOV", "DEC", "JAN", "FEB"],
  //   labels: {
  //     style: {
  //       colors: "#A3AED0",
  //       fontSize: "12px",
  //       fontWeight: "500",
  //     },
  //   },
  //   axisBorder: {
  //     show: false,
  //   },
  //   axisTicks: {
  //     show: false,
  //   },
  // },
  // yAxis: {
  //   min: 0,
  //   title: {
  //     text: "Рейтинг",
  //   },
  // },
  // legend: {
  //   enabled: true,
  // },
  // tooltip: {
  //   pointFormat: `Рейтинг: <b>{point.y:.1f}</b>`,
  // },
  // series: [
  //   {
  //     name: "Revenue",
  //     data: [50, 64, 48, 66, 49, 68],
  //   },
  //   {
  //     name: "Profit",
  //     data: [30, 40, 24, 46, 20, 46],
  //   },
  // ],
};
