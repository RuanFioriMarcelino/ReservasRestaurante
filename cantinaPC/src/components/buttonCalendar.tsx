import { Ban, CircleCheck } from "lucide-react";

type Props = {
  button: boolean;

  onClick: () => void;
};

export function Button({ button, onClick, ...rest }: Props) {
  return (
    <>
      {!button ? (
        <button
          {...rest}
          onClick={onClick}
          className="w-full flex-col h-full rounded-lg justify-evenly flex bg-yellow shadow-sm shadow-gray  text-white transition-all ease-in duration-[45ms] 
          items-center hover:bg-opacity-65 hover:scale-105 font-medium"
        >
          <CircleCheck color="white" />
          <p>À venda</p>
        </button>
      ) : (
        <button
          {...rest}
          onClick={onClick}
          className="w-full flex-col h-full rounded-lg justify-evenly flex bg-black/10  bg-white shadow-sm shadow-gray-400   transition-all ease-in duration-[45ms]  hover:bg-opacity-65 hover:scale-105 font-mediu items-center"
        >
          <Ban color="black " />
          <p>Vender</p>
        </button>
      )}
    </>
  );
}
