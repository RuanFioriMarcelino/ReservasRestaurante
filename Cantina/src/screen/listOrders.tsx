import {
  View,
  Text,
  TouchableOpacity,
  Image,
  SafeAreaView,
  ScrollView,
} from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import AvatarBar from "../components/avatarBar";
import { auth, collection, database } from "../config/firebaseconfig";
import {
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import { colors } from "../styles/colors";
import { Feather, MaterialIcons } from "@expo/vector-icons";

interface OrdersList {
  id: string;
  addedAt: string;
  orderDetails: string; // Assumindo que isto é um array de IDs de produtos ou algo similar
  paymentMethod: string;
  total: string;
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

  useEffect(() => {
    const fetchOrders = async () => {
      const q = collection(database, "orders");
      const querySnapshot = await getDocs(q);
      const list: OrdersList[] = [];

      querySnapshot.forEach((doc) => {
        list.push({ ...doc.data(), id: doc.id } as OrdersList);
      });
      setOrdersList(list);
    };
    fetchOrders();
  }, []);

  useEffect(() => {
    const fetchFoods = async () => {
      const q = collection(database, "products");
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
      // Supondo que orderDetails seja uma string separada por vírgulas
      const productIds = order.orderDetails.split(",");

      return productIds.map((id) => ({
        productId: id.trim(), // Remova espaços em branco extras, se houver
        orderId: order.id,
        addedAt: order.addedAt,
        paymentMethod: order.paymentMethod,
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

  return (
    <SafeAreaView>
      <AvatarBar />
      <Text className="text-center text-laranja-200 font-bold text-2xl mt-2">
        Meu Pedidos
      </Text>
      <ScrollView
        contentContainerStyle={{
          gap: 15,
          padding: 10,
        }}
      >
        {foods.map((item) => (
          <View
            key={item.id}
            className="bg-laranja-100 h-28 flex-row rounded-lg shadow-[0px_20px_10px_12px_#1a202c]"
          >
            <Text className="self-center text-2xl px-2 text-white font-bold">
              1
            </Text>
            <Image
              source={{}}
              style={{
                width: 80,
                borderRadius: 10,
                backgroundColor: "white",
              }}
            />
            <View className="flex-1 flex-row justify-evenly items-center ">
              <View className="flex-1 p-2 gap-4">
                <Text className="text-white text-xl font-medium">
                  {item.id}
                </Text>
                <TouchableOpacity activeOpacity={0.5} className="mt-2">
                  <View className="flex flex-row items-center justify-center gap-2 rounded-xl bg-laranja-200 p-1">
                    <Feather
                      name="alert-circle"
                      size={15}
                      color={colors.white}
                    />
                    <Text className="text-white font-medium">Observação</Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
