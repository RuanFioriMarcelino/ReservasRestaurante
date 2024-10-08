import React, { useState, useEffect } from "react";
import {
  Image,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  collection,
  onSnapshot,
  getDoc,
  doc,
  deleteDoc,
} from "firebase/firestore";
import { auth, database } from "../config/firebaseconfig";
import AvatarBar from "../components/avatarBar";
import { AntDesign, Feather, MaterialIcons } from "@expo/vector-icons";
import { colors } from "../styles/colors";

interface ProductsCart {
  id: string;
  addedAt: string;
  quantity: string;
  foodId: string;
}

interface Foods {
  id: string;
  name: string;
  description: string;
  valor: string;
  imgURL: string;
  order: number;
  idCart: string;
}

export default function Cart() {
  const [productsCart, setProductsCart] = useState<ProductsCart[]>([]);
  const [foods, setFoods] = useState<Foods[]>([]);
  const user = auth.currentUser;
  const userUID = user?.uid.toString();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  useEffect(() => {
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

    return () => unsubscribeCart();
  }, [userUID]);

  useEffect(() => {
    if (productsCart.length === 0) {
      setFoods([]);
      return;
    }

    const fetchFoods = async () => {
      const foodsList: Foods[] = [];
      for (const item of productsCart) {
        const docRef = doc(database, "foods", item.foodId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data() as Foods;
          foodsList.push({ ...data, id: docSnap.id, idCart: item.id });
        } else {
          console.log("Nenhum documento encontrado!");
        }
      }
      setFoods(foodsList);
    };

    fetchFoods();
  }, [productsCart]);

  async function deleteProduto(id: string) {
    if (!userUID) return;
    const taskDocRef = doc(database, "cart", `${userUID}`, "data", id);
    await deleteDoc(taskDocRef);
  }

  return (
    <SafeAreaView className="flex-1 w-screen">
      <AvatarBar />
      <Text className="text-center text-laranja-200 font-bold text-2xl mt-2">
        Carrinho
      </Text>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          gap: 15,
          padding: 10,
          height: "100%",
        }}
        className="rounded-3xl"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {foods.map((product, order) => (
          <View
            key={product.id}
            className="bg-laranja-100 h-28 flex-row rounded-lg shadow-[0px_20px_10px_12px_#1a202c]"
          >
            <Text className="self-center text-2xl px-2 text-white font-bold">
              {order + 1}
            </Text>
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
            <View className="flex-1 flex-row justify-evenly items-center ">
              <View className="flex-1 p-2 gap-4">
                <Text className="text-white text-xl font-medium">
                  {product.name}
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
              <View className="flex-row items-center">
                <View className="items-center justify-center px-2">
                  <TouchableOpacity>
                    <View className="p-1 bg-laranja-200 rounded-full">
                      <MaterialIcons
                        name="add"
                        size={20}
                        color={colors.white}
                      />
                    </View>
                  </TouchableOpacity>
                  <Text className="text-white">1</Text>
                  <TouchableOpacity>
                    <View className="p-1 bg-laranja-200 rounded-full">
                      <MaterialIcons
                        name="remove"
                        size={20}
                        color={colors.white}
                      />
                    </View>
                  </TouchableOpacity>
                </View>
                <TouchableOpacity onPress={() => deleteProduto(product.idCart)}>
                  <View className="bg-laranja-200 h-full justify-center px-4 rounded-r-lg">
                    <AntDesign name="delete" color={colors.white} size={20} />
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
