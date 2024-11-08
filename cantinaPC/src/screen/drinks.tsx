import Card from "../components/cardProduct";
import ModalCreateDrinks from "../modals/modalCreateDrinks";

export default function Drinks() {
  return (
    <div className="flex-col gap-4 flex min-h-[500px]">
      <div className="">
        <ModalCreateDrinks />
      </div>
      <Card type="drink" />
    </div>
  );
}
