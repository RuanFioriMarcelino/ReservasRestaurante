import useFirestoreCollection from "./getOrder";

export default function GetTotalOrders() {
  const orders = useFirestoreCollection("orders");

  return orders;
}
