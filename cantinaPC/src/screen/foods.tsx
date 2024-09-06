import { Link } from "react-router-dom";

export default function Foods() {
  return (
    <div>
      <Link to={"/foods/createFoods"}>criar comida</Link>
    </div>
  );
}
