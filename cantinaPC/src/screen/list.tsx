import { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { database } from "../config/firebaseconfig";

interface OrdersList {
  id: string;
  addedAt: string;
  orderDetails: any[];
  paymentMethod: string;
  total: string;
  observation: string;
  user: string;
  userName: string;
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

  useEffect(() => {
    const fetchOrders = async () => {
      const ordersCollection = collection(database, "orders");
      const querySnapshot = await getDocs(ordersCollection);
      const list: OrdersList[] = [];

      for (const doc of querySnapshot.docs) {
        const orderData = doc.data();
        const userName = await fetchUserNameById(orderData.user);
        list.push({ ...orderData, id: doc.id, userName } as OrdersList);
      }
      setOrdersList(list);
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

  const formatDateTime = (timestamp: any) => {
    const date = new Date(timestamp);
    return date.toLocaleString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="h-full flex flex-col w-full">
      <div className="p-2 flex flex-col gap-2 shadow-sm shadow-gray-300 bg-white rounded-sm text-center">
        <h3>Horario</h3>

        <div className="border-b border-gray-300 flex" />

        <div className=" gap-4 overflow-y-auto max-w-full flex-wrap grid grid-cols-1 lg:grid-cols-4 max-h-[550px] pr-2">
          {ordersList.map((order) => (
            <div key={order.id} className="bg-yellow/30 rounded-md w-auto">
              <div className="bg-yellow flex flex-row gap-2 p-2 rounded-t-md">
                <img
                  className="w-14 h-[70px] rounded-sm bg-gray-300 items-center justify-center flex border-white border-2 text-xs"
                  src=""
                  alt="imagem do produto"
                  width="40px"
                />
                <div className="text-start">
                  <p className=" text-xl font-medium ">{order.userName}</p>
                  <p className="text-sm font-normal text-white  bg-black/50 w-min px-1 rounded-md">
                    {order.paymentMethod}
                  </p>
                  <p className="text-sm font-normal text-white ">
                    Entregar:{" "}
                    <span className="font-bold text-xs">
                      {formatDateTime(order.addedAt)}
                    </span>
                  </p>
                </div>
              </div>
              <div className="p-2 text-start justify-between flex flex-col h-56">
                <div>
                  {detailedFoods
                    .filter((food) => food.orderId === order.id)
                    .map((item) => (
                      <div key={item.productId} className="flex-row">
                        <p className="text-base font-bold">
                          {item.name} -{" "}
                          <span className="font-normal">
                            {item.observation || "Sem observações"}
                          </span>
                        </p>
                        <p className="text-laranja-100">R$ {item.value}</p>
                      </div>
                    ))}
                </div>
                <div className="border-t border-yellow">
                  Total:{" "}
                  <span className="text-laranja-100 font-bold">
                    R$ {order.total}
                  </span>
                  <div>
                    <button className="w-full text-white uppercase font-regular bg-yellow p-2 rounded-lg hover:bg-opacity-65 hover:scale-y-105 transition-all duration-75 ease-in">
                      <p className="text-white font-medium">Aceitar</p>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
