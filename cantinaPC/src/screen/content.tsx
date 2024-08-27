import { useSearchParams } from "react-router-dom";
import { useEffect } from "react";
import { Dashboard } from "./dashboard";
import { List } from "./list";

type Componente = () => JSX.Element;

const ComponentA = () => (
  <div>
    <Dashboard />
  </div>
);
const ComponentB = () => (
  <div>
    <List />
  </div>
);

const renderizarComponente = (tipo: "A" | "B"): JSX.Element => {
  const componentes: Record<string, Componente> = {
    A: ComponentA,
    B: ComponentB,
  };

  const ComponenteEscolhido =
    componentes[tipo] || (() => <div>Componente não encontrado</div>);

  return <ComponenteEscolhido />;
};

export default function Content() {
  const [URLSearchParams, SetURLSearchParams] = useSearchParams();
  useEffect(() => {
    SetURLSearchParams({ filter: "dashboard" });
    console.log(URLSearchParams.get("filter"));
  }, [URLSearchParams, SetURLSearchParams]);

  const tipoComponente = "B";
  return <div>{renderizarComponente(tipoComponente)}</div>;
}
