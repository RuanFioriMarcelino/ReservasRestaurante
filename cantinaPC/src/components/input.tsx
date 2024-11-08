import { ReactNode } from "react";
import { colors } from "../styles/colors";

interface InputProps {
  icon: ReactNode;
  children: ReactNode;
}

function Input({ icon, children }: InputProps) {
  return (
    <div className="w-full h-10 flex p-2 align-middle justify-center border border-laranja-200 rounded-lg bg-white">
      {children}
      {icon != null ? <button className="pl-2">{icon}</button> : null}
    </div>
  );
}

function Field({ ...rest }: any) {
  return (
    <input
      className="flex-1  outline-none text-black font-regular h-full rounded-sm "
      placeholder={colors.white}
      {...rest}
    />
  );
}

Input.Field = Field;

export { Input };
