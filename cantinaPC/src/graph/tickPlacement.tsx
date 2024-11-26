import { BarChart } from "@mui/x-charts/BarChart";
import { axisClasses } from "@mui/x-charts/ChartsAxis";
import useFirestoreWeeklyOrders from "../hook/useWeeklyOrders";



function valueFormatter(value: number | null): string {
  return `${value} Pratos`; // Example of formatting a value
}

const chartSetting = {
  yAxis: [
    {
      label: "Quantidade",
    },
  ],
  series: [
    { dataKey: "total", label: "Pedidos da semana anterior", valueFormatter },
  ],
  height: 300,
  sx: {
    [`& .${axisClasses.directionY} .${axisClasses.label}`]: {
      transform: "translateX(-10px)",
    },
  },

};

export default function TickPlacementBars() {
  const ordersData = useFirestoreWeeklyOrders();
  console.log(ordersData, "Pedidos");
  return (
    <div style={{ width: "100%" }}>
      <BarChart
        dataset={ordersData}
        xAxis={[
          {
            scaleType: "band",
            dataKey: "day",
          },
        ]}
        {...chartSetting}
      />
    </div>
  );
}
