import Card from "../components/cards";

export function Dashboard() {
  return (
    <div>
      <h1 className="text-gray-800 font-bold text-xl">DASHBOARD</h1>
      <p className="text-gray-300">
        Olá, Lucas. Bem Vindo ao Jô Pães Dashboard!
      </p>
      <div className="my-6 flex  justify-between">
        <Card />
        <Card />
        <Card />
        <Card />
      </div>
    </div>
  );
}
