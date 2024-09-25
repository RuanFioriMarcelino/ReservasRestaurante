import Card from "../components/cardProduct";
import ModalCreateFood from "../modals/modalCreateFood";

export default function Foods() {
  return (
    <div className=" flex-col flex gap-4 min-h-[500px] ">
      <ModalCreateFood />
      <Card type="food" />
    </div>
  );
}
