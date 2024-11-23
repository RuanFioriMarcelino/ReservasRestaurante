import * as React from "react";
import Stack from "@mui/material/Stack";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Radio from "@mui/material/Radio";
import { BarChart } from "@mui/x-charts/BarChart";
import { axisClasses } from "@mui/x-charts/ChartsAxis";
import useFirestoreWeeklyOrders from "../hook/useWeeklyOrders";

type TickParamsSelectorProps = {
  tickPlacement: "end" | "start" | "middle" | "extremities";
  tickLabelPlacement: "tick" | "middle";
  setTickPlacement: React.Dispatch<
    React.SetStateAction<"end" | "start" | "middle" | "extremities">
  >;
  setTickLabelPlacement: React.Dispatch<
    React.SetStateAction<"tick" | "middle">
  >;
};

function valueFormatter(value: number | null): string {
  return `${value} Pratos`; // Example of formatting a value
}

// Use valueFormatter in your object
const chartSetting = {
  yAxis: [
    {
      label: "Quantidade",
    },
  ],
  series: [
    { dataKey: "total", label: "Total de pedidos neste dia", valueFormatter },
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
