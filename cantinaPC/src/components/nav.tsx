import AccountMenu from "./accountMenu";
import { Input } from "./input";

export default function NavBar() {
  return (
    <div className="w-full  h-min ">
      <div className="h-min flex justify-between">
        <Input>
          <Input.Field placeholder="Buscar" />
        </Input>
        <span>
          <AccountMenu />
        </span>
      </div>
    </div>
  );
}
