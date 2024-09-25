import { ReactNode } from "react";

type Props = {
  button: boolean;
  children: ReactNode;
  onClick: () => void;
};

export function Button({ button, children, onClick, ...rest }: Props) {
  return (
    <>
      {button ? (
        <button
          {...rest}
          onClick={onClick}
          className="bg-red-900 w-full   text-white h-11 rounded-lg justify-center flex hover:bg-opacity-100 hover:text-white transition-all ease-in duration-[45ms] 
          items-center"
        >
          {children}
        </button>
      ) : (
        <button
          {...rest}
          onClick={onClick}
          className="bg-amber-600 w-full text-white h-11 rounded-lg  justify-center flex  hover:bg-opacity-100 hover:text-white transition-all ease-in duration-[45ms]  items-center"
        >
          {children}
        </button>
      )}
    </>
  );
}
