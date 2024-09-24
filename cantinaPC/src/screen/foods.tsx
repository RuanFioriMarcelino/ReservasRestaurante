import Card from "../components/cardProduct";
import ModalCreateFood from "../modals/modalCreateFood";

export default function Foods() {
  return (
    <div className=" flex-col min-h-[500px] ">
      <Card type="food" />
      <div className="">
        <ModalCreateFood />
      </div>
    </div>
  );
}
