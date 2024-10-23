import { View, Text } from "react-native";
import React, { useEffect, useState } from "react";
import AvatarBar from "../components/avatarBar";
import { auth, collection, database } from "../config/firebaseconfig";
import { onSnapshot, query, where } from "firebase/firestore";

interface OrdersList {
  id: string;
  addedAt: string;
  orderDetails: string;
}

export default function ListOrders() {
  const [ordersList, setOrdersList] = useState<OrdersList[]>([]);
  const [foods, setFoods] = useState<string[]>([]);

  const user = auth.currentUser?.uid.toString();

  const fetchProductsCart = useEffect(() => {
    if (!user) return;

    const productCartCollection = query(
      collection(database, "orders"),
      where("user", "==", `${user}`)
    );

    const unsubscribeCart = onSnapshot(
      productCartCollection,
      (querySnapshotCart) => {
        const list: OrdersList[] = [];
        querySnapshotCart.forEach((doc) => {
          list.push({ ...doc.data(), id: doc.id } as OrdersList);
        });
        setOrdersList(list);
      }
    );
    return unsubscribeCart;
  }, [user]);

  useEffect(() => {
    const a = ordersList.map((item) => item.orderDetails);
    setFoods(a);
  }, [ordersList]);

  console.log("Lista de pedidos: ", ordersList);
  return (
    <View>
      <AvatarBar />
      <Text className="text-center text-laranja-200 font-bold text-2xl mt-2">
        Meu Pedidos
      </Text>
    </View>
  );
}
