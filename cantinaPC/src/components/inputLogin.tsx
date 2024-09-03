import { ReactNode } from "react";
import { colors } from "../styles/colors";

function Input({ children }: { children: ReactNode }) {
  return (
    <div className="w-full h-10 flex p-2 align-middle justify-center border border-laranja-200 rounded-lg bg-white">
      {children}
    </div>
  );
}

function Field({ ...rest }: any) {
  return (
    <input
      className="flex-1 text-black font-regular h-full rounded-sm "
      placeholderTextColor={colors.white}
      {...rest}
    />
  );
}

Input.Field = Field;

export { Input };
