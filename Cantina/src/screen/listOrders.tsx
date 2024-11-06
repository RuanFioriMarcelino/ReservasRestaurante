import {
  View,
  Text,
  TouchableOpacity,
  Image,
  SafeAreaView,
  ScrollView,
  RefreshControl,
} from "react-native";
import React, { useEffect, useState } from "react";
import AvatarBar from "../components/avatarBar";
import { auth, collection, database } from "../config/firebaseconfig";
import { getDocs, query, where } from "firebase/firestore";
import { colors } from "../styles/colors";

interface OrdersList {
  id: string;
  addedAt: string;
  orderDetails: string;
  paymentMethod: string;
  total: string;
  observation: string;
}

interface Foods {
  id: string;
  name: string;
  description: string;
  value: string;
  imgURL: string;
  order: number;
  quantity: number;
  idCart: string;
}

export default function ListOrders() {
  const [ordersList, setOrdersList] = useState<OrdersList[]>([]);
  const [foods, setFoods] = useState<Foods[]>([]);
  const [detailedFoods, setDetailedFoods] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchOrders = async () => {
    const user = auth.currentUser?.uid;
    const q = query(
      collection(database, "orders"),
      where("user", "==", `${user}`)
    );
    const querySnapshot = await getDocs(q);
    const list: OrdersList[] = [];

    querySnapshot.forEach((doc) => {
      list.push({ ...doc.data(), id: doc.id } as OrdersList);
    });
    setOrdersList(list);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchOrders();
    setRefreshing(false);
  };

  useEffect(() => {
    const fetchFoods = async () => {
      const q = query(collection(database, "products"));
      const querySnapshot = await getDocs(q);
      const list: Foods[] = [];

      querySnapshot.forEach((doc) => {
        list.push({ ...doc.data(), id: doc.id } as Foods);
      });
      setFoods(list);
    };
    fetchFoods();
  }, []);

  useEffect(() => {
    const orderProductDetails = ordersList.flatMap((order) => {
      if (!Array.isArray(order.orderDetails)) {
        console.warn(
          `Order ${
            order.id
          } has orderDetails of type ${typeof order.orderDetails}`
        );
        return [];
      }

      return order.orderDetails.map((id, index) => ({
        productId: id,
        orderId: order.id,
        addedAt: order.addedAt,
        paymentMethod: order.paymentMethod,
        observation: order.orderDetails[index] || "", // Access by index
      }));
    });

    const matchedFoods = orderProductDetails
      .map((detail) => {
        const food = foods.find((f) => f.id === detail.productId);
        return food ? { ...food, ...detail } : null;
      })
      .filter((item) => item !== null);

    setDetailedFoods(matchedFoods);
  }, [ordersList, foods]);

  console.log("Produtos detalhados: ", detailedFoods);
  console.log("Orders data:", ordersList);

  const formatDateTime = (timestamp: any) => {
    const date = timestamp.toDate();
    return date.toLocaleString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  return (
    <SafeAreaView className="flex-1">
      <AvatarBar />
      <Text className="text-center text-laranja-200 font-bold text-2xl mt-2">
        Meus Pedidos
      </Text>
      <ScrollView
        contentContainerStyle={{
          gap: 15,
          padding: 10,
        }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {ordersList.map((order) => (
          <View
            key={order.id}
            className="bg-white rounded-lg shadow-md shadow-black p-4 mb-4 "
          >
            <Text className="text-black font-bold text-xs">
              Pedido #{order.id}
            </Text>

            {detailedFoods
              .filter((food) => food.orderId === order.id)
              .map((item) => (
                <View
                  key={item.productId}
                  className="flex-row mt-1 items-center"
                >
                  <Image
                    source={{ uri: item.imgURL }}
                    style={{
                      width: 80,
                      height: 80,
                      borderRadius: 10,
                      backgroundColor: colors.laranja[100],
                    }}
                  />
                  <View className="flex-1 ml-4">
                    <Text className="text-laranja-100 text-base font-bold">
                      {item.name}
                    </Text>
                    <Text className="text-black">
                      {item.observation || "Sem observações"} // Display
                      observation
                    </Text>
                    <Text className="text-laranja-100">R$ {item.value}</Text>
                  </View>
                </View>
              ))}
            <View className="w-full border-b my-2 border-gray-300"></View>
            <Text className="text-black">
              Data:{" "}
              <Text className="text-laranja-100">
                {formatDateTime(order.addedAt)}
              </Text>
            </Text>
            <View className="flex flex-row items-center">
              <Text className="text-black">Método de Pagamento: </Text>
              <View className="bg-laranja-100 rounded-lg px-1">
                <Text className="font-medium">{order.paymentMethod}</Text>
              </View>
            </View>
            <Text className="text-black text-xl">
              Total:{" "}
              <Text className="text-laranja-100 font-bold">
                R$ {order.total}
              </Text>
            </Text>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
