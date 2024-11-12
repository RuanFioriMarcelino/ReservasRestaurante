import React, { useState, useEffect, useCallback } from "react";
import {
  Alert,
  FlatList,
  Image,
  Modal,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import {
  collection,
  onSnapshot,
  getDoc,
  doc,
  deleteDoc,
  updateDoc,
} from "firebase/firestore";
import { auth, database } from "../config/firebaseconfig";
import AvatarBar from "../components/avatarBar";
import { AntDesign, Feather, MaterialIcons } from "@expo/vector-icons";
import { colors } from "../styles/colors";
import { Button } from "../components/button";
import { Loading } from "../components/loading";
import SkeletonLoader from "../components/skeletonLoader";
import ModalOverlay from "../components/modal";

interface ProductsCart {
  id: string;
  addedAt: string;
  quantity: number;
  foodId: string;
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
  observation: string;
}

export default function Cart({ navigation }: any) {
  const [productsCart, setProductsCart] = useState<ProductsCart[]>([]);
  const [foods, setFoods] = useState<Foods[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentObservation, setCurrentObservation] = useState("");
  const [selectedProductId, setSelectedProductId] = useState("");
  const [selectedPickupTime, setSelectedPickupTime] = useState<string>("");
  const [timeModalVisible, setTimeModalVisible] = useState(false);

  const allowedTimes = [
    "11:30",
    "11:45",
    "12:00",
    "12:15",
    "12:30",
    "12:45",
    "13:00",
  ];

  const handleSelectTime = (time: string) => {
    setSelectedPickupTime(time);
    setTimeModalVisible(false);
  };

  const user = auth.currentUser;
  const userUID = user?.uid.toString();
  const values = foods.map((item) => parseFloat(item.value) * item.quantity);
  const sum = values.reduce((acc, curr) => acc + curr, 0);

  const fetchProductsCart = useCallback(() => {
    if (!userUID) return;

    const productCartCollection = collection(
      database,
      "cart",
      `${userUID}`,
      "data"
    );

    const unsubscribeCart = onSnapshot(
      productCartCollection,
      (querySnapshotCart) => {
        const list: ProductsCart[] = [];
        querySnapshotCart.forEach((doc) => {
          list.push({ ...doc.data(), id: doc.id } as ProductsCart);
        });
        setProductsCart(list);
      }
    );

    return unsubscribeCart;
  }, [userUID]);

  const fetchFoods = useCallback(async () => {
    if (productsCart.length === 0) {
      setFoods([]);
      setLoading(false);
      return;
    }

    const foodsList: Foods[] = [];
    for (const item of productsCart) {
      const docRef = doc(database, "products", item.id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data() as Foods;
        foodsList.push({
          ...data,
          id: docSnap.id,
          idCart: item.id,
          quantity: item.quantity,
          observation: item.observation,
        });
      } else {
        console.log("Nenhum documento encontrado!");
      }
    }
    setFoods(foodsList);
    setLoading(false);
  }, [productsCart]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchProductsCart();
    await fetchFoods();
    setRefreshing(false);
  }, [fetchProductsCart, fetchFoods]);

  useEffect(() => {
    const unsubscribeCart = fetchProductsCart();
    return () => unsubscribeCart && unsubscribeCart();
  }, [fetchProductsCart]);

  useEffect(() => {
    fetchFoods();
  }, [productsCart, fetchFoods]);

  async function deleteProduto(id: string) {
    if (!userUID) return;
    const taskDocRef = doc(database, "cart", `${userUID}`, "data", id);
    await deleteDoc(taskDocRef);
    setProductsCart((prev) => prev.filter((item) => item.id !== id));
  }

  const editTask = async (id: string, operation: number, quantity: number) => {
    const qtt = quantity + operation;
    const taskdocRef = doc(database, "cart", `${userUID}`, "data", id);
    await updateDoc(taskdocRef, {
      quantity: qtt,
    });
  };

  const handleObs = (productId: string, observation: string) => {
    setSelectedProductId(productId);
    setCurrentObservation(observation);
    setModalVisible(true);
  };

  const handleFinalizeOrder = () => {
    // Check if a valid pickup time is selected (between 11:30 and 13:00)
    if (!selectedPickupTime) {
      Alert.alert("Horário", "Por favor, selecione um horário para retirada.");
      return;
    }

    const pickupTime = new Date(`2024-11-11T${selectedPickupTime}:00`);
    const start = new Date("2024-11-11T11:30:00");
    const end = new Date("2024-11-11T13:00:00");

    if (pickupTime >= start && pickupTime <= end) {
      navigation.navigate("Payment", {
        orderDetails: foods.map((item) => ({
          id: item.id,
          observation: item.observation,
        })),
        total: sum,
        pickupTime: selectedPickupTime,
      });
    } else {
      Alert.alert(
        "Horário incorreto!",
        "O horário selecionado deve estar entre 11:30 e 13:00."
      );
    }
  };

  return (
    <>
      <SafeAreaView className="flex-1 ">
        <AvatarBar />
        <Text className="text-center text-laranja-100 font-bold text-2xl mt-2">
          Carrinho
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
          {loading
            ? Array.from({ length: 3 }).map((_, index) => (
                <SkeletonLoader key={index} />
              ))
            : foods.map((product, order) => (
                <View
                  key={product.id}
                  className="bg-zinc-50 h-28 flex-row rounded-lg shadow-md shadow-black"
                >
                  <Text className="self-center text-2xl px-2 text-laranja-200 font-bold">
                    {order + 1}
                  </Text>
                  {product.imgURL ? (
                    <Image
                      source={{
                        uri: product.imgURL,
                      }}
                      style={{
                        width: 80,
                        borderRadius: 10,
                        backgroundColor: "white",
                      }}
                    />
                  ) : (
                    <View className="w-20 justify-center bg-laranja-200/50 rounded-lg">
                      <Loading />
                    </View>
                  )}

                  <View className="flex-1 flex-row justify-evenly items-center ">
                    <View className="flex-1 p-2 gap-4">
                      <Text className="text-laranja-200 text-xl font-medium">
                        {product.name}
                      </Text>
                      <TouchableOpacity
                        activeOpacity={0.5}
                        className="mt-2"
                        onPress={() =>
                          handleObs(product.idCart, product.observation)
                        }
                      >
                        <View className="flex flex-row items-center justify-center gap-2 rounded-xl bg-laranja-100 p-1">
                          <Feather
                            name="alert-circle"
                            size={15}
                            color={colors.white}
                          />
                          <Text className="text-white font-medium">
                            Observação
                          </Text>
                        </View>
                      </TouchableOpacity>
                    </View>
                    <View className="flex-row items-center">
                      <View className="items-center justify-center px-2">
                        <TouchableOpacity
                          onPress={() =>
                            editTask(product.idCart, +1, product.quantity)
                          }
                        >
                          <View className="p-1 bg-laranja-100 rounded-full">
                            <MaterialIcons
                              name="add"
                              size={20}
                              color={colors.white}
                            />
                          </View>
                        </TouchableOpacity>
                        <Text className="text-laranja-100">
                          {product.quantity}
                        </Text>
                        {product.quantity > 1 ? (
                          <TouchableOpacity
                            onPress={() =>
                              editTask(product.idCart, -1, product.quantity)
                            }
                          >
                            <View className="p-1 bg-laranja-100 rounded-full">
                              <MaterialIcons
                                name="remove"
                                size={20}
                                color={colors.white}
                              />
                            </View>
                          </TouchableOpacity>
                        ) : (
                          <TouchableOpacity activeOpacity={1}>
                            <View className="p-1 bg-laranja-100 rounded-full">
                              <MaterialIcons
                                name="remove"
                                size={20}
                                color={colors.white}
                              />
                            </View>
                          </TouchableOpacity>
                        )}
                      </View>
                      <TouchableOpacity
                        onPress={() => deleteProduto(product.idCart)}
                      >
                        <View className="bg-laranja-100 h-full justify-center px-4 rounded-r-lg">
                          <AntDesign
                            name="delete"
                            color={colors.white}
                            size={20}
                          />
                        </View>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              ))}
        </ScrollView>

        {productsCart.length === 0 ? null : (
          <View className="p-6 bg-slate-50 shadow-2xl shadow-black rounded-t-3xl gap-2">
            <View>
              <Text>Total</Text>
              <Text className="text-laranja-100 font-bold text-2xl">
                R$ {sum}
              </Text>
            </View>

            <Button
              title="SELECIONAR HORÁRIO PARA RETIRADA"
              isLoading={false}
              bgcolor={colors.laranja[100]}
              textColor={colors.white}
              onPress={() => setTimeModalVisible(true)}
            />

            <Button
              title="FINALIZAR O PEDIDO"
              isLoading={false}
              bgcolor={colors.laranja[100]}
              textColor={colors.white}
              onPress={handleFinalizeOrder}
            />
          </View>
        )}
      </SafeAreaView>

      <ModalOverlay
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View className="flex-1 items-center justify-center  bg-black/50">
          <View className=" gap-2 p-5 bg-slate-50 rounded-xl w-[300]">
            <Text className="font-bold text-2xl mb-4">Editar Observação</Text>
            <TextInput
              className="h-10 border-gray-600 border-[1px] p-2 mb-4 w-full"
              value={currentObservation}
              onChangeText={setCurrentObservation}
            />
            <Button
              title="Salvar"
              bgcolor={colors.laranja[200]}
              textColor={colors.white}
              onPress={async () => {
                if (!userUID || !selectedProductId) return;
                await updateDoc(
                  doc(database, "cart", userUID, "data", selectedProductId),
                  {
                    observation: currentObservation,
                  }
                );
                setModalVisible(false);
                fetchProductsCart();
                fetchFoods();
              }}
            />
            <Button
              bgcolor={colors.laranja[100]}
              textColor={colors.white}
              title="Cancelar"
              onPress={() => setModalVisible(false)}
            />
          </View>
        </View>
      </ModalOverlay>
      <ModalOverlay
        visible={timeModalVisible}
        onRequestClose={() => setTimeModalVisible(false)}
      >
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            paddingHorizontal: 40,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
          }}
        >
          <View
            style={{ backgroundColor: "#FFF", padding: 20, borderRadius: 10 }}
          >
            <Text style={{ fontSize: 18, marginBottom: 10 }}>
              Escolha o Horário
            </Text>
            <FlatList
              data={allowedTimes}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => handleSelectTime(item)}
                  style={{ padding: 10, alignItems: "center" }}
                >
                  <Text className="text-lg border-b border-black w-full text-center py-1">
                    {item}
                  </Text>
                </TouchableOpacity>
              )}
            />
            <Button
              title="Cancelar"
              bgcolor={colors.laranja[100]}
              textColor="#FFFFFF"
              onPress={() => setTimeModalVisible(false)}
            />
          </View>
        </View>
      </ModalOverlay>
    </>
  );
}
