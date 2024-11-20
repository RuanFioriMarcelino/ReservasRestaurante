import Card from "../components/card";
import Icon1 from "../assets/IconOrder.png";
import Icon2 from "../assets/iconDelivered.png";
import Icon3 from "../assets//IconOrderCancel.png";
import Icon4 from "../assets/IconOrderReceita.png";
import GetTotaValue from "../hook/getTotalValue";
import UserProfile from "../hook/getUser";
import useFirestoreCollectionForToday from "../hook/getOrder";

export function Dashboard() {
  const ordersArray = useFirestoreCollectionForToday("orders").length;
  const pedidosEntreguesHoje = useFirestoreCollectionForToday(
    "orders",
    "Entregue"
  ).length;

  const totalValue = GetTotaValue();

  const a = 0;

  return (
    <div>
      <h1 className="text-gray-800 font-bold text-xl">DASHBOARD</h1>
      <p className="text-gray-400 flex">
        Olá,
        <span className="ml-1 ">
          <UserProfile />
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
        <Card value={`${a}`} title="Total cancelado">
          {<img src={Icon3} width="70px" height="70px" />}
        </Card>
        <Card value={"R$ " + totalValue} title="Receita total">
          {<img src={Icon4} width="70px" height="70px" />}
        </Card>
      </div>
    </div>
  );
}
