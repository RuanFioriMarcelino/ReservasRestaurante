import AccountMenu from "./accountMenu";
import { Input } from "./input";
import { Search } from "lucide-react";

export default function NavBar() {
  return (
    <div className="w-full h-min justify-between flex ">
      <div className="h-min w-5/12 flex gap-8">
   {/*      <Input icon={<Search />}>
          <Input.Field placeholder="Buscar" />
        </Input> */}
      </div>
      <span>
        <AccountMenu />
      </span>
    </div>
  );
}
