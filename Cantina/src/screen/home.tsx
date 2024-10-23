import {
  Image,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import AvatarBar from "../components/avatarBar";

import React, { useEffect, useState } from "react";
import {
  collection,
  doc,
  onSnapshot,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import { auth, database } from "../config/firebaseconfig";
import { MaterialIcons } from "@expo/vector-icons";
import { colors } from "../styles/colors";

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
  const [scroll, setScroll] = useState(false);
  const date = new Date().getDate();
  const month = new Date().getMonth() + 1;
  const [refreshing, setRefreshing] = React.useState(false);
  const user = auth.currentUser;
  const userUID = user?.uid.toString();

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

    return unsubscribeCart;
  }, [userUID]);

  useEffect(() => {
    const productCollection = query(
      collection(database, "products"),
      where("category", "==", "food")
    );
    const unsubscribe = onSnapshot(productCollection, (query) => {
      const list: Foods[] = [];
      query.forEach((doc) => {
        list.push({ ...doc.data(), id: doc.id } as Foods);
      });
      setFoods(list);
      if (list.length <= 4) {
        setScroll(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const addForCart = async (foodId: any) => {
    try {
      const user = auth.currentUser;
      if (!user) return;

      const userDoc = doc(database, "cart", user.uid);
      const dataCollection = collection(userDoc, "data");
      const foodDoc = doc(dataCollection, `${foodId}`);
      await setDoc(foodDoc, {
        addedAt: new Date(),
        quantity: 1,
      });
      console.log("Produto adicionado ao carrinho com sucesso!");
    } catch (error) {
      console.error("Erro ao adicionar produto ao carrinho: ", error);
    }
  };

  return (
    <SafeAreaView className="flex-1">
      <AvatarBar />
      <Text className="text-center text-laranja-200 font-bold text-2xl mt-2 ">
        Cardápio dia {date}/{month < 10 ? "0" + month : month}
      </Text>
      <ScrollView
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
        bounces={false}
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
        {foods.map((food) => (
          <View
            key={food.id}
            className="w-[45%] h-52 p-2 justify-end rounded-[25] bg-slate-50 mt-20 shadow-lg shadow-slate-950"
          >
            <View className="relative items-center  ">
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
              <View className="flex justify-end items-center gap-1 w-full">
                <Text className="text-xl font-bold text-laranja-200">
                  {food.name}
                </Text>

                <Text className="font-light h-10 text-ellipsis overflow-hidden">
                  {food.description}
                </Text>
                <View className="flex flex-row gap-2 ">
                  <View className="bg-laranja-200 px-2 py-1 rounded-xl">
                    <TouchableOpacity onPress={() => addForCart(food.id)}>
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
    </SafeAreaView>
  );
}
