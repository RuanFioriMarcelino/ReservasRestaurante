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
  const [selectedButton, setSelectedButton] = useState<number | null>(null);
  return (
    <div>
      <div className="text-left pl-10 mb-10">
        <h1 className="text-yellow text-4xl font-bold">Jô Pães</h1>
        <p className="text-white uppercase">Doces e salgados</p>
      </div>
      <div className="grid gap-8  ">
        <Button
          title="Dashboard"
          btnNumber={1}
          isSelected={selectedButton === 1}
          onClick={() => setSelectedButton(1)}
        >
          <House size={18} />
        </Button>
        <Button
          title="Lista de Pedidos"
          btnNumber={2}
          isSelected={selectedButton === 2}
          onClick={() => setSelectedButton(2)}
        >
          <AlignLeft size={18} />
        </Button>
        <Button
          title="Detalhe dos Pedidos"
          btnNumber={3}
          isSelected={selectedButton === 3}
          onClick={() => setSelectedButton(3)}
        >
          <StickyNote size={18} />
        </Button>
        <Button
          title="Cliente"
          btnNumber={4}
          isSelected={selectedButton === 4}
          onClick={() => setSelectedButton(4)}
        >
          <Users size={18} />
        </Button>
        <Button
          title="Comidas"
          btnNumber={5}
          isSelected={selectedButton === 5}
          onClick={() => setSelectedButton(5)}
        >
          <Coffee size={18} />
        </Button>
        <Button
          title="Carteira"
          btnNumber={6}
          isSelected={selectedButton === 6}
          onClick={() => setSelectedButton(6)}
        >
          <Wallet size={18} />
        </Button>
      </div>
    </div>
  );
}
