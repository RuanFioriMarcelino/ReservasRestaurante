import { useState } from "react";
import { Button } from "../components/button";

import {
  AlignLeft,
  House,
  StickyNote,
  Users,
  Coffee,
  Wallet,
} from "lucide-react";

export default function Drawer() {
  const button = Number(localStorage.getItem("button"));
  const [selectedButton, setSelectedButton] = useState<number | null>(button);

  function sendRoute(a: number) {
    setSelectedButton(a);
    localStorage.setItem("button", `${a}`);
  }

  return (
    <div className="w-min h-full ">
      <div className="text-left pl-10 mt-4">
        <h1 className="text-yellow text-5xl  font-bold mb-2">Jô Pães</h1>
        <p className="text-slate-100 uppercase">Doces e salgados</p>
      </div>
      <div className="grid gap-4 border-r-[1px] pr-2 h-full pt-10 border-gray-400 ">
        <Button
          title="Dashboard"
          isSelected={selectedButton === 1}
          onClick={() => sendRoute(1)}
          to="/"
        >
          <House size={18} />
        </Button>
        <Button
          title="Lista de Pedidos"
          isSelected={selectedButton === 2}
          onClick={() => sendRoute(2)}
          to="list"
        >
          <AlignLeft size={18} />
        </Button>
        <Button
          title="Detalhe dos Pedidos"
          isSelected={selectedButton === 3}
          onClick={() => sendRoute(3)}
          to="details"
        >
          <StickyNote size={18} />
        </Button>
        <Button
          title="Cliente"
          isSelected={selectedButton === 4}
          onClick={() => sendRoute(4)}
          to="client"
        >
          <Users size={18} />
        </Button>
        <Button
          title="Comidas"
          isSelected={selectedButton === 5}
          onClick={() => sendRoute(5)}
          to="foods"
        >
          <Coffee size={18} />
        </Button>
        <Button
          title="Carteira"
          isSelected={selectedButton === 6}
          onClick={() => sendRoute(6)}
          to="wallet"
        >
          <Wallet size={18} />
        </Button>
      </div>
    </div>
  );
}
