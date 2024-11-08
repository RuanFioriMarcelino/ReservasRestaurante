import useFirestoreCollection from "../hook/getOrder";

export default function GetTotalOrders() {
  const orders = useFirestoreCollection("orders");

  return orders;
}
