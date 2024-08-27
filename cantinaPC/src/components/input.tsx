import { ReactNode } from "react";
import { colors } from "../styles/colors";
import { Search } from "lucide-react";

function Input({ children }: { children: ReactNode }) {
  return (
    <div className="w-2/4 h-10 flex p-2 align-middle border border-laranja-200 rounded-lg bg-white">
      {children}
      <button className="pl-2">
        <Search color={colors.black_} />
      </button>
    </div>
  );
}

function Field({ ...rest }: any) {
  return (
    <input
      className="flex-1 text-black font-regular h-full rounded-sm"
      placeholderTextColor={colors.white}
      {...rest}
    />
  );
}

Input.Field = Field;

export { Input };
