import { useEffect, useState } from "react";
import {
  collection,
  query,
  where,
  onSnapshot,
  getDocs,
  doc,
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
  user: string;
  userName: string;
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
}

export function List() {
  const [ordersList, setOrdersList] = useState<OrdersList[]>([]);
  const [foods, setFoods] = useState<Foods[]>([]);
  const [detailedFoods, setDetailedFoods] = useState<any[]>([]);
  const [feedbacks, setFeedbacks] = useState<Record<string, string>>({}); // Feedbacks individuais por pedido
  const [loading, setLoading] = useState<string | null>(null); // Estado de carregamento

  const fetchUserNameById = async (userId: string): Promise<string> => {
    const userCollection = collection(database, "user");
    const userQuery = query(userCollection, where("idUser", "==", userId));
    const userDoc = await getDocs(userQuery);

    if (!userDoc.empty) {
      const userData = userDoc.docs[0].data();
      return userData.name;
    }
    return "Usuário desconhecido";
  };

  const updateOrderStatus = async (orderId: string) => {
    setLoading(orderId); // Indica que estamos carregando a atualização para esse pedido
    setFeedbacks((prev) => ({ ...prev, [orderId]: "" })); // Limpa qualquer feedback anterior para esse pedido

    const orderRef = doc(database, "orders", orderId);
    try {
      // Atualiza o status do pedido para "Produzindo"
      await updateDoc(orderRef, {
        status: "Produzindo",
      });
      const updatedFeedbacks = {
        ...feedbacks,
        [orderId]: "Pedido aceito e agora está sendo produzido!",
      };
      setFeedbacks(updatedFeedbacks);
      localStorage.setItem("feedbacks", JSON.stringify(updatedFeedbacks)); // Persistir no localStorage
    } catch (error) {
      console.error("Erro ao atualizar status do pedido: ", error);
      const updatedFeedbacks = {
        ...feedbacks,
        [orderId]: "Erro ao aceitar o pedido. Tente novamente.",
      };
      setFeedbacks(updatedFeedbacks);
      localStorage.setItem("feedbacks", JSON.stringify(updatedFeedbacks)); // Persistir no localStorage
    } finally {
      setLoading(null); // Remove o carregamento após a atualização
    }
  };

  // Atualizando em tempo real os pedidos
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

        querySnapshot.forEach((doc) => {
          const orderData = doc.data() as OrdersList;
          const orderDate = formatInTimeZone(
            orderData.addedAt.toDate(),
            "America/Sao_Paulo",
            "yyyy-MM-dd"
          );

          // Verificar se o pedido é do dia atual
          if (orderDate === today) {
            fetchUserNameById(orderData.user).then((userName) => {
              list.push({ ...orderData, id: doc.id, userName });
              setOrdersList((prevList) => {
                const updatedList = [...prevList, ...list];
                // Evitar duplicação
                return Array.from(new Set(updatedList.map((a) => a.id))).map(
                  (id) => updatedList.find((a) => a.id === id)!
                );
              });
            });
          }
        });
      });

      // Cleanup function to unsubscribe from the listener when the component unmounts
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
    // Carregar os feedbacks persistidos no localStorage
    const storedFeedbacks = localStorage.getItem("feedbacks");
    if (storedFeedbacks) {
      setFeedbacks(JSON.parse(storedFeedbacks));
    }
  }, []);

  const formatDateTime = (timestamp: any) => {
    const date = timestamp.toDate();
    return date.toLocaleString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="h-full flex flex-col w-full">
      <div className="p-4 flex flex-col gap-4 shadow-lg bg-white rounded-lg text-center">
        <h3 className="text-2xl font-semibold text-gray-800">
          Pedidos de Hoje
        </h3>
        <div className="border-b border-gray-300 mb-4" />

        <div className="gap-4 overflow-y-auto max-w-full flex-wrap grid grid-cols-1 lg:grid-cols-4 max-h-[550px] pr-2">
          {ordersList.map((order) => (
            <div key={order.id} className="rounded-lg w-auto  shadow-xl mb-4">
              <div className="flex flex-row gap-4 p-4 rounded-t-lg bg-gray-400 w-full">
                <img
                  className="w-16 h-20 rounded-lg bg-gray-200 object-cover"
                  alt="Usuário"
                />
                <div className="text-left ">
                  <p className="text-xl font-semibold text-gray-800">
                    {order.userName}
                  </p>
                  <p className="text-sm font-medium text-white bg-black/50 px-4 py-1 rounded-full w-min whitespace-nowrap">
                    {order.paymentMethod}
                  </p>
                  <p className="text-sm text-gray-600">
                    Entregar às:{" "}
                    <span className="font-bold text-gray-800">
                      {formatDateTime(order.addedAt)}
                    </span>
                  </p>
                </div>
              </div>

              <div className="p-3 flex flex-col h-80 justify-between">
                <div className="mb-4 overflow-y-auto items-start w-full">
                  {detailedFoods
                    .filter((food) => food.orderId === order.id)
                    .map((item, index, array) => (
                      <div
                        key={item.productId}
                        className={`flex justify-between mb-2  ${index !== array.length - 1 ? "border-b border-gray-400" : ""}`}
                      >
                        <p className="text-base font-semibold text-gray-800 w-full text-start">
                          {item.name} -{" "}
                          <span className="text-sm text-gray-500 w-full">
                            {item.observation || "Sem observações"}
                          </span>
                        </p>
                        <p className="text-laranja-100 font-semibold whitespace-nowrap">
                          R$ {item.value}
                        </p>
                      </div>
                    ))}
                </div>

                <div className="border-t-2 pt-3">
                  <div className="flex justify-between">
                    <span className="font-semibold text-lg">Total:</span>
                    <span className="text-laranja-100 font-bold text-xl">
                      R$ {order.total}
                    </span>
                  </div>

                  <button
                    onClick={() => updateOrderStatus(order.id)}
                    className="w-full text-white uppercase font-medium p-3 rounded-lg mt-4 bg-gray-400"
                    disabled={loading === order.id}
                  >
                    {loading === order.id ? "Processando..." : "Aceitar"}
                  </button>

                  {/* Exibindo o feedback individual para o pedido */}
                  {feedbacks[order.id] && (
                    <p className="mt-2 text-sm text-green-500">
                      {feedbacks[order.id]}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
