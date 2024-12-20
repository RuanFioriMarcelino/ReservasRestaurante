import { useState } from "react";
import { Button } from "../components/button";

import {
  AlignLeft,
  House,
  StickyNote,
  Users,
  CookingPot,
  Coffee,
  Wallet,
  CalendarDays,
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
        <p className="text-black uppercase ">Doces e salgados</p>
      </div>
      <div className="grid gap-8  pr-2 h-full py-20 border-r-[1px] border-gray-400 ">
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
          title="Calendário"
          isSelected={selectedButton === 4}
          onClick={() => sendRoute(4)}
          to="calendar"
        >
          <CalendarDays size={18} />
        </Button>
        <Button
          title="Cliente"
          isSelected={selectedButton === 5}
          onClick={() => sendRoute(5)}
          to="client"
        >
          <Users size={18} />
        </Button>
        <Button
          title="Comidas"
          isSelected={selectedButton === 6}
          onClick={() => sendRoute(6)}
          to="foods"
        >
          <CookingPot size={18} />
        </Button>

        <Button
          title="Mensagens"
          isSelected={selectedButton === 8}
          onClick={() => sendRoute(8)}
          to="menssenger"
        >
          <Wallet size={18} />
        </Button>
      </div>
    </div>
  );
}
