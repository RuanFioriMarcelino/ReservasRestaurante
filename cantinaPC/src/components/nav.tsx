import AccountMenu from "./accountMenu";
import { Input } from "./input";
import { Search } from "lucide-react";

export default function NavBar() {
  console.log(Search);
  return (
    <div className="w-full  h-min ">
      <div className="h-min flex justify-between">
        <Input icon={<Search />}>
          <Input.Field placeholder="Buscar" />
        </Input>
        <span>
          <AccountMenu />
        </span>
      </div>
    </div>
  );
}
