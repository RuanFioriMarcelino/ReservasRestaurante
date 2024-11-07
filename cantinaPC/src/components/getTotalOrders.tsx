import { collection, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
import { database } from "../config/firebaseconfig";

interface Orders {
  id: string;
}

export default function GetTotalOrders() {
  const [orders, setOrders] = useState<Orders[]>([]);

  useEffect(() => {
    const productCollection = collection(database, "orders");

    const unsubscribe = onSnapshot(productCollection, (query) => {
      const list: Orders[] = [];
      query.forEach((doc) => {
        list.push({ ...doc.data(), id: doc.id } as Orders);
      });
      setOrders(list);
    });

    return () => unsubscribe();
  }, []);

  return orders;
}
