import Card from "../components/cards";
import UserProfile from "../components/getUser";
import Icon1 from "../assets/IconOrder.png";
import Icon2 from "../assets/iconDelivered.png";
import Icon3 from "../assets//IconOrderCancel.png";
import Icon4 from "../assets/IconOrderReceita.png";
import GetTotalOrders from "../components/getTotalOrders";

type Props = {
  totalOrders: number;
  totalDeliveries: number;
  totalCanceled: number;
  totalRevenue: number;
};

export function Dashboard({ totalOrders: propTotalOrders }: Props) {
  const ordersArray = GetTotalOrders();
  const localTotalOrders = ordersArray.length; // Get the number of orders

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
      <div className="my-6 flex justify-between">
        <Card value={localTotalOrders} title="Total de pedidos">
          {<img src={Icon1} />}
        </Card>
        <Card value={localTotalOrders} title="Total entregue">
          {<img src={Icon2} />}
        </Card>
        <Card value={localTotalOrders} title="Total cancelado">
          {<img src={Icon3} />}
        </Card>
        <Card value={localTotalOrders} title="Receita total">
          {<img src={Icon4} />}
        </Card>
      </div>
    </div>
  );
}
