import { useOrders } from "../hook/getOrderList";

export function List() {
  const { ordersList, detailedFoods, feedbacks, updateOrderStatus, loading } =
    useOrders();

  return (
    <div className="h-full flex flex-col w-full">
      <div className="p-4 flex flex-col gap-4 shadow-lg bg-white rounded-lg text-center">
        <h3 className="text-2xl font-semibold text-gray-800">
          Pedidos de Hoje - {ordersList.length}
        </h3>
        <div className="border-b border-gray-300 mb-4" />

        <div className="gap-4 overflow-y-auto max-w-full flex-wrap grid grid-cols-1 lg:grid-cols-4 max-h-[490px] pr-2">
          {ordersList.map((order) => (
            <div key={order.id} className="rounded-lg w-auto shadow-xl mb-4">
              <div className="flex flex-row gap-4 p-4 rounded-t-lg bg-gray-400 w-auto">
                <img
                  src={order.userImage || "/path/to/default/image.jpg"}
                  className="w-16 h-20 rounded-lg bg-gray-200 object-cover"
                  alt="Usuário"
                />
                <div className="text-left">
                  <p className="text-xl font-semibold text-gray-800">
                    {order.userName}
                  </p>
                  <p className="text-sm font-medium text-white bg-black/50 px-4 py-1 rounded-full w-min whitespace-nowrap">
                    {order.paymentMethod}
                  </p>
                  <p className="text-sm text-gray-600 whitespace-nowrap w-min">
                    Entregar às:{" "}
                    <span className="font-bold text-gray-800">
                      {order.pickupTime}
                    </span>
                  </p>
                </div>
              </div>

              <div className="p-3 flex flex-col h-72 justify-between">
                <div className="mb-4 overflow-y-auto items-start w-full">
                  {detailedFoods
                    .filter((food) => food.orderId === order.id)
                    .map((item, index, array) => (
                      <div
                        key={item.productId}
                        className={`flex justify-between mb-2 ${index !== array.length - 1 ? "border-b border-gray-400" : ""}`}
                      >
                        <p className="text-lg font-semibold text-gray-800 w-full text-start whitespace-break-spaces">
                          {item.quantity === "Quantidade não informada"
                            ? `${item.quantity} - `
                            : `${item.quantity}x - `}
                          {item.name} -{" "}
                          <span className="text-base text-gray-500 w-full">
                            {item.observation || "Sem observações"}
                          </span>
                        </p>
                        <p className="text-laranja-100 font-semibold whitespace-nowrap">
                          R$ {item.value}
                        </p>
                      </div>
                    ))}
                </div>

                <div className="pt-3">
                  <div className="flex justify-between border-b-2 border-gray-400">
                    <span className="font-semibold text-lg">
                      Total:{" "}
                      <span className="text-laranja-100 font-bold text-xl">
                        R$ {order.total}
                      </span>
                    </span>
                  </div>

                  {feedbacks[order.id] ? (
                    <p className="mt-2 text-sm text-green-500">
                      {feedbacks[order.id]}
                    </p>
                  ) : (
                    <button
                      onClick={() => updateOrderStatus(order.id)}
                      className="w-full text-white uppercase font-medium p-3 rounded-lg mt-4 bg-gray-400"
                      disabled={loading === order.id}
                    >
                      {loading === order.id ? "Processando..." : "Aceitar"}
                    </button>
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
