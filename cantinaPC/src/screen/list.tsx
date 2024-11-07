import { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { auth, database } from "../config/firebaseconfig";

interface OrdersList {
  id: string;
  addedAt: string; // Certifique-se de que o tipo é correto
  orderDetails: any[]; // Defina o tipo correto aqui
  paymentMethod: string;
  total: string;
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
}

export function List() {
  const [ordersList, setOrdersList] = useState<OrdersList[]>([]);
  const [foods, setFoods] = useState<Foods[]>([]);
  const [detailedFoods, setDetailedFoods] = useState<any[]>([]);

  useEffect(() => {
    const fetchOrders = async () => {
      const user = auth.currentUser?.uid;
      const q = query(
        collection(database, "orders"),
        where("user", "==", `${user}`)
      );
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
    const date = new Date(timestamp); // Ajuste aqui se necessário
    return date.toLocaleString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="h-full flex flex-col">
      <h1>essa é a lista</h1>
      <div className="flex-1 w-full bg-white shadow-sm shadow-black rounded-lg text-center p-2 flex flex-col gap-2">
        <h3>Horario</h3>
        <div className="border-b border-gray-300 w-full" />
        <div className="flex-1 flex overflow-y-auto">
          {ordersList.map((order) => (
            <div key={order.id} className="bg-yellow/30 rounded-sm w-60 m-2">
              <p className="text-gray-700 font-medium text-xs -mt-[10px] ml-2 absolute">
                Pedido #{order.id}
              </p>
              <div className="bg-yellow flex flex-row gap-2 p-2 rounded-t-sm">
                <img
                  className="w-12 h-14 rounded-sm bg-gray-300 items-center justify-center flex border-white border-2 text-xs"
                  src="" // Ajuste para a URL correta
                  alt="imagem do produto"
                  width="40px"
                />

                <div className="text-start">
                  <p className="text-white font-medium leading-5">Joana</p>
                  <p className="text-sm font-normal leading-5">
                    {order.paymentMethod}
                  </p>
                  <p className="text-sm font-normal leading-4 lea">
                    Entregar:{" "}
                    <span className="font-bold text-xs">
                      {formatDateTime(order.addedAt)}
                    </span>
                  </p>
                </div>
              </div>

              <div className="p-2 text-start">
                {detailedFoods
                  .filter((food) => food.orderId === order.id)
                  .map((item) => (
                    <div key={item.productId} className="flex-row">
                      <div className="">
                        <p className="text-base font-bold">
                          {item.name} -{" "}
                          <span className="font-normal">
                            {item.observation || "Sem observações"}
                          </span>
                        </p>

                        <p className="text-laranja-100">R$ {item.value}</p>
                      </div>
                    </div>
                  ))}
                Total:{" "}
                <span className="text-laranja-100 font-bold">
                  R$ {order.total}
                </span>
                <button className="bg-yellow w-full h-9 rounded-sm">
                  <p className="text-white font-medium">Aceitar</p>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
