import { MoveUp } from "lucide-react";
import { ReactNode } from "react";

type Props = {
  value: string;
  children?: ReactNode;
  title: string;
};

export default function Card({ value, title, children }: Props) {
  return (
    <div className="bg-white gap-6 flex items-center justify-around px-4 py-4 rounded-lg shadow shadow-black/20 cursor-pointer w-full">
      <div className="">{children}</div>

      <span className="flex-col">
        <p className="text-3xl font-bold text-slate-700">{value}</p>
        <p className="w-max">{title}</p>
       {/*  <span className="flex items-center justify-center gap-2">
          <div className="bg-green-100 w-min p-1 rounded-full">
            <MoveUp color="green" size={10} />
          </div>
          <span className="text-sm text-gray-500">4% (30 days)</span>
        </span> */}
      </span>
    </div>
  );
}
