import { useEffect, useState } from "react";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  updateDoc,
} from "firebase/firestore";
import { database } from "../config/firebaseconfig";
import { formatInTimeZone } from "date-fns-tz";

interface OrdersList {
  id: string;
  addedAt: any;
  orderDetails: any[];
  paymentMethod: string;
  total: string;
  observation: string;
  user: any[];
  userName: string;
  userImage: string;
  status: string;
  pickupTime: string;
  quantity: number;
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

export function useOrders() {
  const [ordersList, setOrdersList] = useState<OrdersList[]>([]);
  const [foods, setFoods] = useState<Foods[]>([]);
  const [detailedFoods, setDetailedFoods] = useState<any[]>([]);
  const [feedbacks, setFeedbacks] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState<string | null>(null);
  console.log(ordersList);

  const updateOrderStatus = async (orderId: string) => {
    setLoading(orderId);
    setFeedbacks((prev) => ({ ...prev, [orderId]: "" }));

    const orderRef = doc(database, "orders", orderId);
    try {
      await updateDoc(orderRef, {
        status: "Produzindo",
      });
      const updatedFeedbacks = {
        ...feedbacks,
        [orderId]: "Pedido aceito e agora está sendo produzido!",
      };
      setFeedbacks(updatedFeedbacks);
      localStorage.setItem("feedbacks", JSON.stringify(updatedFeedbacks));
    } catch (error) {
      console.error("Erro ao atualizar status do pedido: ", error);
      const updatedFeedbacks = {
        ...feedbacks,
        [orderId]: "Erro ao aceitar o pedido. Tente novamente.",
      };
      setFeedbacks(updatedFeedbacks);
      localStorage.setItem("feedbacks", JSON.stringify(updatedFeedbacks));
    } finally {
      setLoading(null);
    }
  };

  const fetchUserById = async (
    userId: string
  ): Promise<{ name: string; photoURL: string }> => {
    try {
      const userRef = doc(database, "user", userId);
      const userDoc = await getDoc(userRef);

      if (userDoc.exists()) {
        const userData = userDoc.data();
        return {
          name: userData.name,
          photoURL: userData.photoURL || "",
        };
      }
      return { name: "Usuário desconhecido", photoURL: "" };
    } catch (error) {
      console.error("Erro ao buscar usuário: ", error);
      return { name: "Erro ao buscar usuário", photoURL: "" };
    }
  };

  useEffect(() => {
    const fetchOrders = () => {
      const ordersCollection = collection(database, "orders");
      const today = formatInTimeZone(
        new Date(),
        "America/Sao_Paulo",
        "yyyy-MM-dd"
      );

      const q = query(ordersCollection);
      const unsubscribe = onSnapshot(q, async (querySnapshot) => {
        const list: OrdersList[] = [];

        const promises = querySnapshot.docs.map(async (doc) => {
          const orderData = doc.data() as OrdersList;
          const orderDate = formatInTimeZone(
            orderData.addedAt.toDate(),
            "America/Sao_Paulo",
            "yyyy-MM-dd"
          );

          if (orderDate === today) {
            const user: any = orderData.user; // Replace 'any' with the correct type if known
            const userId = (user as { id: string }).id;
            const { name, photoURL } = await fetchUserById(userId);
            list.push({
              ...orderData,
              id: doc.id,
              userName: name,
              userImage: photoURL,
            });
          }
        });

        await Promise.all(promises);

        list.sort((a, b) => {
          const timeA = a.pickupTime.split(":").map(Number);
          const timeB = b.pickupTime.split(":").map(Number);
          return timeA[0] - timeB[0] || timeA[1] - timeB[1];
        });

        setOrdersList((prevList) => {
          const updatedList = [...prevList, ...list];
          return Array.from(new Set(updatedList.map((a) => a.id))).map(
            (id) => updatedList.find((a) => a.id === id)!
          );
        });
      });

      return () => unsubscribe();
    };

    fetchOrders();
  }, []);

  useEffect(() => {
    const fetchFoods = async () => {
      const productsCollection = collection(database, "products");
      const querySnapshot = await getDocs(productsCollection);
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
          `Order ${order.id} has orderDetails of type ${typeof order.orderDetails}`
        );
        return [];
      }
      return order.orderDetails.map((detail) => ({
        productId: detail.id,
        orderId: order.id,
        addedAt: order.addedAt,
        paymentMethod: order.paymentMethod,
        observation: detail.observation || "",
        quantity: detail.quantity || "Quantidade não informada",
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

  useEffect(() => {
    const storedFeedbacks = localStorage.getItem("feedbacks");
    if (storedFeedbacks) {
      setFeedbacks(JSON.parse(storedFeedbacks));
    }
  }, []);

  return { ordersList, detailedFoods, feedbacks, updateOrderStatus, loading };
}
