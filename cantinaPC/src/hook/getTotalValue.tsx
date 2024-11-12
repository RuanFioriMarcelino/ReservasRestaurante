import { format, toZonedTime } from "date-fns-tz";
import useFirestoreCollection from "./getOrder";
import { useEffect, useState } from "react";

interface Orders {
  id: string;
  total: number;
  addedAt: any; // Assuming this is a Firestore Timestamp
}

export default function GetTotalValue() {
  const orders = useFirestoreCollection<Orders>("orders");
  const [totalOrders, setTotalOrders] = useState<number>(0);

  useEffect(() => {
    const timeZone = "America/Sao_Paulo";
    const today = new Date();
    const todayInBrasilia = toZonedTime(today, timeZone);
    const todayString = format(todayInBrasilia, "yyyy-MM-dd");

    let total = 0;

    orders.forEach((order) => {
      const orderDate = order.addedAt.toDate();
      const orderDateInBrasilia = toZonedTime(orderDate, timeZone);
      const orderDateString = format(orderDateInBrasilia, "yyyy-MM-dd");

      if (orderDateString === todayString) {
        total += order.total;
      }
    });

    setTotalOrders(total);
  }, [orders]);

  return totalOrders;
}
