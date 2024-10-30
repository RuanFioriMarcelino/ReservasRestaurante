import {
  View,
  Text,
  TouchableOpacity,
  Image,
  SafeAreaView,
  ScrollView,
  RefreshControl,
} from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import AvatarBar from "../components/avatarBar";
import { auth, collection, database } from "../config/firebaseconfig";
import { documentId, getDocs, query, where } from "firebase/firestore";

import { AntDesign } from "@expo/vector-icons";
import { colors } from "../styles/colors";

interface OrdersList {
  id: string;
  addedAt: string;
  orderDetails: string[]; // Assumindo que isto é um array de IDs de produtos ou algo similar
  paymentMethod: string;
  total: string;
  status: string;
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
  status: string;
  addedAt: string;
}

export default function ListOrders() {
  const [ordersList, setOrdersList] = useState<OrdersList[]>([]);
  const [foods, setFoods] = useState<Foods[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchOrders = async () => {
    const q = collection(database, "orders");
    const querySnapshot = await getDocs(q);
    const list: OrdersList[] = [];

    querySnapshot.forEach((doc) => {
      list.push({ ...doc.data(), id: doc.id } as OrdersList);
    });
    setOrdersList(list);
  };

  const fetchFoods = async () => {
    const allFoods: Foods[] = [];

    for (const item of ordersList) {
      const productPromises = item.orderDetails.map(async (productId) => {
        const q = query(
          collection(database, "products"),
          where(documentId(), "==", productId)
        );

        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
          allFoods.push({
            ...doc.data(),
            id: doc.id,
            addedAt: item.addedAt,
            status: item.status,
          } as Foods);
        });
      });

      await Promise.all(productPromises);
    }

    setFoods(allFoods);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    if (ordersList.length > 0) {
      fetchFoods();
    }
  }, [ordersList]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchOrders();
    await fetchFoods();
    setRefreshing(false);
  }, [ordersList]);

  function formatFirestoreDateTime(timestamp: any) {
    if (timestamp && timestamp.seconds) {
      const date = new Date(timestamp.seconds * 1000); // Converte para milissegundos
      return date.toLocaleString("pt-BR", {
        dateStyle: "short", // Formato de data curto (dd/mm/aaaa)
        timeStyle: "short", // Formato de hora curto (hh:mm)
      });
    }
    return ""; // Retorna vazio se não houver data
  }

  return (
    <SafeAreaView className="flex-1">
      <AvatarBar />
      <Text className="text-center text-laranja-200 font-bold text-2xl mt-2">
        Meu Pedidos
      </Text>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          gap: 15,
          padding: 10,
        }}
        className="rounded-3xl"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {foods.map((item, order) => (
          <View
            key={item.id}
            className="bg-laranja-100 h-28 flex-row rounded-lg shadow-md shadow-black"
          >
            <Text className="self-center text-2xl px-2 text-white font-bold">
              {order + 1}
            </Text>
            <Image
              source={{ uri: item.imgURL }}
              style={{
                width: 80,
                borderRadius: 10,
                backgroundColor: "white",
              }}
            />
            <View className="flex-1 ">
              <View className="flex-1 p-2 gap-1">
                <Text className="text-white text-xl font-medium">
                  {item.name}
                </Text>
                <View className="flex flex-row gap-1 items-center">
                  <AntDesign
                    name="clockcircleo"
                    size={12}
                    color={colors.white}
                  />
                  <Text className="text-white">
                    {formatFirestoreDateTime(item.addedAt)}
                  </Text>
                </View>

                <View className="flex-row rounded-xl bg-laranja-200 p-1 ">
                  <Text className="text-white ">Status: </Text>
                  <Text
                    className={`${
                      item.status == "Processando"
                        ? "text-red-900"
                        : "text-green-600"
                    } font-bold`}
                  >
                    {item.status}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
