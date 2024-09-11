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
          className=" bg-opacity-10 bg-red-700 h-11  rounded-lg w-full justify-center flex hover:bg-opacity-100 text-red-700  items-center hover:text-white transition-all ease-in duration-[45ms] "
        >
          {children}
        </button>
      ) : (
        <button
          {...rest}
          onClick={onClick}
          className=" bg-opacity-10 bg-yellow h-11 rounded-lg w-full justify-center flex  hover:bg-opacity-100 hover:text-white transition-all ease-in duration-[45ms] text-yellow items-center"
        >
          {children}
        </button>
      )}
    </>
  );
}
