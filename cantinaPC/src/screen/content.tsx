/* import { useSearchParams } from "react-router-dom";
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
 */
/* type Componente = () => JSX.Element;

const ComponenteA = () => <div>Este é o Componente A</div>;
const ComponenteB = () => <div>Este é o Componente B</div>;
const ComponenteC = () => <div>Este é o Componente C</div>;

const renderizarComponente = (tipo: "A" | "B" | "C"): JSX.Element => {
  const componentes = {
    A: ComponenteA,
    B: ComponenteB,
    C: ComponenteC,
  };

  const ComponenteEscolhido =
    componentes[tipo] || (() => <div>Componente não encontrado</div>);

  return <ComponenteEscolhido />;
};

// Exemplo de uso
export default function Content() {
  return <div>{renderizarComponente("B")}</div>;
}
 */

import { useSearchParams, useNavigate } from "react-router-dom";

export default function Content() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Define o componente baseado no parâmetro de consulta

  const tipoComponente = searchParams.get("filter")?.toUpperCase() || "A";

  // Função para atualizar o componente e a URL
  const handleNavigation = (tipo: "A" | "BOCETA") => {
    navigate(`?filter=${tipo.toLowerCase()}`);
  };
  console.log("Tipo de componente:", tipoComponente);
  return (
    <div>
      <div>
        <button onClick={() => handleNavigation("A")}>
          Mostrar Componente A
        </button>
        <button onClick={() => handleNavigation("BOCETA")}>
          Mostrar Componente B
        </button>
      </div>
      {renderizarComponente(tipoComponente)}
    </div>
  );
}

function renderizarComponente(tipo: string): JSX.Element {
  switch (tipo) {
    case "A":
      return <ComponenteA />;
    case "BOCETA":
      return <ComponenteB />;
    default:
      return <div>Componente padrão esse</div>;
  }
}

function ComponenteA() {
  return <div>Componente AAAA</div>;
}

function ComponenteB() {
  return <div>testeeee</div>;
}
