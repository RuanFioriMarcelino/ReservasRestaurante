import Card from "../components/cardFood";
import BasicModal from "../modals/modalCreateFood";

export default function Foods() {
  return (
    <div className=" flex-col min-h-[500px] ">
      <Card />
      <div className="p-11">
        <BasicModal />
      </div>
    </div>
  );
}
