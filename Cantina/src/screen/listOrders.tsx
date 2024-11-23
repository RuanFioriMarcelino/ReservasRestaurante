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
import { query, where, onSnapshot, getDocs } from "firebase/firestore";
import { colors } from "../styles/colors";
import { Loading } from "../components/loading";

interface OrdersList {
  id: string;
  addedAt: string;
  orderDetails: string;
  paymentMethod: string;
  total: number;
  observation: string;
  status: string;
  pickupTime: string;
  quantity: number;
}

interface Foods {
  id: string;
  name: string;
  description: string;
  value: number;
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
  console.log(
    "Order: ",
    ordersList.map((item) => item.orderDetails)
  );
  // Função para buscar os pedidos
  const fetchOrders = () => {
    const user = auth.currentUser?.uid;
    console.log(user, "teste");
    const q = query(
      collection(database, "orders"),
      where("userID", "==", `${user}`)
    );

    // Usando onSnapshot() para escutar mudanças em tempo real
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const list: OrdersList[] = [];
      querySnapshot.forEach((doc) => {
        list.push({ ...doc.data(), id: doc.id } as OrdersList);
      });
      setOrdersList(list); // Atualiza a lista de pedidos
    });

    // Retorna a função de desinscrição para limpar quando o componente for desmontado
    return unsubscribe;
  };

  // Refresh quando puxar a tela
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

  // Usar useEffect para escutar mudanças nos pedidos
  useEffect(() => {
    const unsubscribe = fetchOrders(); // Inicia o listener de pedidos
    return () => unsubscribe(); // Limpa o listener quando o componente é desmontado
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
      return order.orderDetails.map((detail) => ({
        productId: detail.id,
        orderId: order.id,
        addedAt: order.addedAt,
        pickupTime: detail.pickupTime,
        paymentMethod: order.paymentMethod,
        observation: detail.observation || "",
        quantity: detail.quantity,
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
                  {item.imgURL ? (
                    <Image
                      source={{ uri: item.imgURL }}
                      style={{
                        width: 80,
                        height: 80,
                        borderRadius: 10,
                      }}
                      className="bg-gray-400"
                    />
                  ) : (
                    <View className="w-20 h-20 bg-gray-400 justify-center rounded-[10px]">
                      <Loading />
                    </View>
                  )}
                  <View className="flex-1 ml-4">
                    <Text className="text-laranja-100 text-base font-bold">
                      {item.quantity}x - {item.name}
                    </Text>
                    <Text className="text-black">
                      {item.observation || "Sem observações"}
                    </Text>
                    <Text className="text-laranja-100">R$ {item.value}</Text>
                  </View>
                </View>
              ))}
            <View className="w-full border-b my-2 border-gray-300"></View>
            <Text className="text-black">
              Horário de Retirada:{" "}
              <Text className="text-laranja-100">{order.pickupTime}</Text>
            </Text>
            <View className="flex flex-row items-center">
              <Text className="text-black">Método de Pagamento: </Text>
              <View className="bg-gray-300 rounded-lg px-2">
                <Text className="font-medium">{order.paymentMethod}</Text>
              </View>
            </View>
            <View className="flex flex-row items-center">
              <Text className="text-black">Status: </Text>
              <View className="bg-gray-300 rounded-lg px-2">
                <Text className="font-medium">{order.status}</Text>
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
