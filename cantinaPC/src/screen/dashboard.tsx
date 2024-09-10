import Card from "../components/cards";
import UserProfile from "../components/getUser";
import Icon1 from "../assets/IconOrder.png";
import Icon2 from "../assets/iconDelivered.png";
import Icon3 from "../assets//IconOrderCancel.png";
import Icon4 from "../assets/IconOrderReceita.png";

export function Dashboard() {
  return (
    <div>
      <h1 className="text-gray-800 font-bold text-xl">DASHBOARD</h1>
      <p className="text-gray-300 flex">
        Olá,
        <span className="ml-1 ">
          <UserProfile />
        </span>
        . Bem Vindo ao Jô Pães Dashboard!
      </p>
      <div className="my-6 flex  justify-between">
        <Card children={<img src={Icon1} />} />
        <Card children={<img src={Icon2} />} />
        <Card children={<img src={Icon3} />} />
        <Card children={<img src={Icon4} />} />
      </div>
    </div>
  );
}
