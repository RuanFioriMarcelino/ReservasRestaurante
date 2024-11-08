import React, { useEffect, useState, useCallback } from "react";
import {
  Image,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  Modal,
  TextInput,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import {
  collection,
  doc,
  onSnapshot,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import { auth, database } from "../config/firebaseconfig";
import { signOut } from "firebase/auth";
import AvatarBar from "../components/avatarBar";
import SkeletonLoaderHome from "../components/skeletonLoaderHome";
import { colors } from "../styles/colors";
import { StatusBar } from "expo-status-bar";
import ModalOverlay from "../components/modal";
import { Button } from "../components/button";
import { Loading } from "../components/loading";

interface Foods {
  id: string;
  name: string;
  description: string;
  genre: string;
  value: string;
  imgURL: string;
  cart: boolean;
}

interface ProductsCart {
  id: string;
  cart: boolean;
}

export default function Home() {
  const [foods, setFoods] = useState<Foods[]>([]);
  const [productsCart, setProductsCart] = useState<ProductsCart[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedFood, setSelectedFood] = useState<Foods | null>(null);
  const [observation, setObservation] = useState("");
  const userUID = auth.currentUser?.uid;

  const currentDate = new Date();
  const formattedDate = `${currentDate.getDate()}/${(currentDate.getMonth() + 1)
    .toString()
    .padStart(2, "0")}`;

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  useEffect(() => {
    if (!userUID) return;
    const productCartCollection = collection(database, "cart", userUID, "data");

    const unsubscribeCart = onSnapshot(
      productCartCollection,
      (querySnapshotCart) => {
        const list: ProductsCart[] = querySnapshotCart.docs.map(
          (doc) => ({ ...doc.data(), id: doc.id } as ProductsCart)
        );
        setProductsCart(list);
      }
    );

    return () => unsubscribeCart();
  }, [userUID]);

  useEffect(() => {
    const productCollection = query(
      collection(database, "products"),
      where("category", "==", "food")
    );

    const unsubscribe = onSnapshot(productCollection, (querySnapshot) => {
      const list: Foods[] = querySnapshot.docs.map(
        (doc) => ({ ...doc.data(), id: doc.id } as Foods)
      );
      setFoods(list);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const openModal = (food: Foods) => {
    setSelectedFood(food);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedFood(null);
    setObservation("");
  };

  const addForCart = async () => {
    if (!selectedFood || !userUID) return;

    try {
      const foodDoc = doc(database, "cart", userUID, "data", selectedFood.id);
      await setDoc(foodDoc, {
        addedAt: new Date(),
        quantity: 1,
        observation,
      });
      console.log("Produto adicionado ao carrinho com sucesso!");
      closeModal();
    } catch (error) {
      console.error("Erro ao adicionar produto ao carrinho: ", error);
    }
  };

  const handleSignOut = () => {
    signOut(auth)
      .then(() => {
        console.log("Usuário deslogado com sucesso!");
      })
      .catch((error) => {
        console.error("Erro ao deslogar: ", error);
      });
  };

  return (
    <SafeAreaView className="flex-1">
      <AvatarBar />
      <Text className="text-center text-laranja-200 font-bold text-2xl mt-2">
        Cardápio dia {formattedDate}
      </Text>

      {/* Botão de Deslogar */}
      <TouchableOpacity
        onPress={handleSignOut}
        className="bg-red-500 p-2 rounded-full m-4"
        style={{ alignSelf: "center" }}
      >
        <Text className="text-laranja-100 font-bold">Deslogar</Text>
      </TouchableOpacity>

      <ScrollView
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          flexDirection: "row",
          flexWrap: "wrap",
          gap: 10,
          justifyContent: "center",
          paddingTop: 10,
          height: "100%",
        }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {loading
          ? Array.from({ length: 4 }).map((_, index) => (
              <SkeletonLoaderHome key={index} />
            ))
          : foods.map((food) => (
              <View
                key={food.id}
                className="w-[45%] h-52 p-2 justify-end rounded-[25] bg-slate-50 mt-20 shadow-lg shadow-slate-950"
              >
                <View className="relative items-center">
                  {food.imgURL ? (
                    <Image
                      source={{
                        uri: food.imgURL,
                      }}
                      style={{
                        width: 150,
                        height: 150,
                        position: "absolute",
                        bottom: 100,
                        borderRadius: 100,
                      }}
                    />
                  ) : (
                    <View
                      style={{
                        width: 140,
                        height: 140,
                      }}
                      className="absolute bottom-28 bg-gray-300 rounded-full justify-center"
                    >
                      <Loading />
                    </View>
                  )}
                  <View className="flex justify-end items-center gap-1 w-full">
                    <Text className="text-xl font-bold text-laranja-200">
                      {food.name}
                    </Text>

                    <Text className="font-light h-10  " numberOfLines={2}>
                      {food.description}
                    </Text>
                    <View className="flex flex-row gap-2">
                      <View className="bg-laranja-200 px-2 py-1 rounded-xl">
                        <TouchableOpacity onPress={() => openModal(food)}>
                          <MaterialIcons
                            name="shopping-cart"
                            size={25}
                            color={colors.white}
                          />
                        </TouchableOpacity>
                      </View>
                      <Text className="font-medium text-2xl text-laranja-200">
                        R${food.value}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            ))}
      </ScrollView>

      <ModalOverlay
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View className="flex-1 items-center justify-center  bg-black/50">
          <View className="gap-2 p-5 bg-slate-50 rounded-xl w-[300]">
            <Text className="font-bold text-2xl mb-4">
              Adicione uma Observação
            </Text>
            <TextInput
              className="h-10 border-gray-600 border-[1px] p-2 mb-4"
              placeholder="Escreva sua observação aqui"
              value={observation}
              onChangeText={setObservation}
            />
            <Button
              bgcolor={colors.laranja[200]}
              textColor={colors.white}
              title="Adicionar ao Carrinho"
              onPress={addForCart}
            />
            <Button
              bgcolor={colors.laranja[100]}
              textColor={colors.white}
              title="Cancelar"
              onPress={closeModal}
            />
          </View>
        </View>
      </ModalOverlay>
    </SafeAreaView>
  );
}
