import { useEffect, useState } from "react";
import { Button } from "../components/button";
import { Input } from "../components/input";
import Content from "./content";

import {
  AlignLeft,
  House,
  StickyNote,
  Users,
  Coffee,
  Wallet,
} from "lucide-react";
import AccountMenu from "../components/accountMenu";
import { useNavigate } from "react-router-dom";

export default function Drawer() {
  const [selectedButton, setSelectedButton] = useState<number | null>(1);
  useEffect(() => {
    console.log(selectedButton, "btn");
  }, [selectedButton]);
  const navigate = useNavigate();

  function sendRoute(a: number) {
    setSelectedButton(a);
    navigate("/list");
  }

  return (
    <div className="flex w-screen">
      <div>
        <div className="text-left pl-10 mb-10 mt-4">
          <h1 className="text-yellow text-5xl  font-bold mb-2">Jô Pães</h1>
          <p className="text-white uppercase">Doces e salgados</p>
          {selectedButton}
        </div>
        <div className="grid gap-6  ">
          <Button
            title="Dashboard"
            btnNumber={1}
            isSelected={selectedButton === 1}
            onClick={() => sendRoute(1)}
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
      <div className="w-full p-6">
        <div className="h-min flex justify-between">
          <Input>
            <Input.Field placeholder="Buscar" />
          </Input>
          <span>
            <AccountMenu />
          </span>
        </div>
        <div>
          <Content />
        </div>
      </div>
    </div>
  );
}
