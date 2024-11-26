import Card from "../components/card";
import Icon1 from "../assets/IconOrder.png";
import Icon2 from "../assets/iconDelivered.png";
import Icon3 from "../assets/IconOrderCancel.png";
import Icon4 from "../assets/IconOrderReceita.png";
import GetTotaValue from "../hook/getTotalValue";
import useUserProfile from "../hook/getUser";
import useFirestoreCollectionForToday from "../hook/getOrder";
import { PieChart } from "@mui/x-charts/PieChart";
import { useProductOrders } from "../hook/getFoodSale";
import TickPlacementBars from "../graph/tickPlacement";

export function Dashboard() {
  const ordersArray = useFirestoreCollectionForToday("orders").length;
  const pedidosEntreguesHoje = useFirestoreCollectionForToday(
    "orders",
    "Entregue"
  ).length;

  const { userName, isLoading } = useUserProfile();
  const totalValue = GetTotaValue();
  const { productCounts } = useProductOrders();
  console.log(productCounts);
  return (
    <div className="">
      <h1 className="text-gray-800 font-bold text-xl">DASHBOARD</h1>
      <p className="text-gray-400 flex">
        Olá,
        <span className="ml-1 ">
          {isLoading ? "Carregando..." : userName || "Usuário não encontrado"}
        </span>
        . Bem Vindo ao Jô Pães Dashboard!
      </p>
      <div className="my-6 grid xl:grid-cols-4 md:grid-cols-2 flex-wrap gap-4">
        <Card value={`${ordersArray}`} title="Total de pedidos">
          <img src={Icon1} width="70px" height="70px" alt="Total de pedidos" />
        </Card>
        <Card value={`${pedidosEntreguesHoje}`} title="Total entregue">
          <img src={Icon2} width="70px" height="70px" alt="Total entregue" />
        </Card>
        <Card value={`${0}`} title="Total cancelado">
          <img src={Icon3} width="70px" height="70px" alt="Total cancelado" />
        </Card>
        <Card value={"R$ " + totalValue.toFixed(2)} title="Receita total">
          <img src={Icon4} width="70px" height="70px" alt="Receita total" />
        </Card>
      </div>

      <div className=" flex grid-cols-2 2xl:grid-cols-1 gap-4">
        <div className="bg-white rounded-lg shadow shadow-black/20 h-min py-4 text-center w-5/12 items-center flex flex-col">
          <p className="text-xl font-medium mb-4">Pratos do Dia</p>
          <PieChart
            className="text-center align-middle "
            series={[
              {
                data: productCounts.map((item, index) => ({
                  id: index, 
                  value: item.totalOrdered,
                  label: item.name,
                })),
                innerRadius: 30,
                outerRadius: 100,
                paddingAngle: 5,
                cornerRadius: 5,
                startAngle: -45,
                endAngle: 225,
                cx: 150,
              },
            ]}
            width={480}
            height={250}
          />
        </div>
        <div className="w-9/12 bg-white rounded-lg shadow shadow-black/20">
          <TickPlacementBars />
        </div>
      </div>
    </div>
  );
}
