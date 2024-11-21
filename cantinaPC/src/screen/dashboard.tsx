import Card from "../components/card";
import Icon1 from "../assets/IconOrder.png";
import Icon2 from "../assets/iconDelivered.png";
import Icon3 from "../assets/IconOrderCancel.png";
import Icon4 from "../assets/IconOrderReceita.png";
import GetTotaValue from "../hook/getTotalValue";
import useUserProfile from "../hook/getUser"; // Use o hook corretamente
import useFirestoreCollectionForToday from "../hook/getOrder";

export function Dashboard() {
  const ordersArray = useFirestoreCollectionForToday("orders").length;
  const pedidosEntreguesHoje = useFirestoreCollectionForToday(
    "orders",
    "Entregue"
  ).length;

  const { userName, isLoading } = useUserProfile();

  const totalValue = GetTotaValue();

  return (
    <div>
      <h1 className="text-gray-800 font-bold text-xl">DASHBOARD</h1>
      <p className="text-gray-400 flex">
        Olá,
        <span className="ml-1 ">
          {isLoading ? "Carregando..." : userName || "Usuário não encontrado"}
        </span>
        . Bem Vindo ao Jô Pães Dashboard!
      </p>
      <div className="my-6 grid grid-cols-1 lg:grid-cols-4 gap-6 ">
        <Card value={`${ordersArray}`} title="Total de pedidos">
          {<img src={Icon1} width="70px" height="70px" />}
        </Card>
        <Card value={`${pedidosEntreguesHoje}`} title="Total entregue">
          {<img src={Icon2} width="70px" height="70px" />}
        </Card>
        <Card value={`${0}`} title="Total cancelado">
          {<img src={Icon3} width="70px" height="70px" />}
        </Card>
        <Card value={"R$ " + totalValue} title="Receita total">
          {<img src={Icon4} width="70px" height="70px" />}
        </Card>
      </div>
    </div>
  );
}
