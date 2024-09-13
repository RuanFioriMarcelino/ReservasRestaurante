import { useState, useEffect } from "react";
import { SafeAreaView, ScrollView, Text, View } from "react-native";
import { collection, onSnapshot, getDoc, doc } from "firebase/firestore";
import { auth, database } from "../config/firebaseconfig";
import AvatarBar from "../components/avatarBar";

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
}

interface Usuario {
  idUser: string;
  nome: string;
}

export default function Cart() {
  const [productsCart, setProductsCart] = useState<ProductsCart[]>([]);
  const [foods, setFoods] = useState<Foods[]>([]);
  const user = auth.currentUser;
  const userUID = user?.uid.toString();
  const [usuario, setUsuario] = useState<Usuario | null>(null);

  useEffect(() => {
    if (!userUID) return; // Verifica se o userUID existe antes de continuar

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

    return () => unsubscribeCart(); // Cleanup function
  }, [userUID]);

  useEffect(() => {
    if (productsCart.length === 0) return; // Verifica se productsCart não está vazio

    const fetchFoods = async () => {
      const foodsList: Foods[] = [];
      for (const item of productsCart) {
        const docRef = doc(database, "foods", item.foodId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data() as Foods;
          foodsList.push({ ...data, id: docSnap.id });
        } else {
          console.log("Nenhum documento encontrado!");
        }
      }
      setFoods(foodsList);
    };

    fetchFoods();
  }, [productsCart]);

  return (
    <SafeAreaView className="flex-1">
      <AvatarBar />
      <ScrollView>
        {foods.map((product) => (
          <View key={product.id}>
            <Text>{product.name}</Text>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
