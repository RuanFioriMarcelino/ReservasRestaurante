import { MoveUp } from "lucide-react";

import { ReactNode } from "react";

export default function Card({ children }: { children: ReactNode }) {
  return (
    <div className="bg-white gap-6 w-min flex items-center justify-center py-4 px-9 rounded-lg shadow shadow-black/20  cursor-pointer">
      <div className="w-16">{children}</div>

      <span>
        <p className="text-3xl font-bold text-slate-700 ">75</p>
        <p className="w-max">Total de pedidos</p>
        <span className="flex items-center justify-center gap-2 ">
          <div className="bg-green-100 w-min p-1 rounded-full">
            <MoveUp color="green" size={10} />
          </div>
          <span className="text-sm text-gray-500">4% (30 days)</span>
        </span>
      </span>
    </div>
  );
}
