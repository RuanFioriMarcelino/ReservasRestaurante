import { Outlet } from "react-router-dom";
import Drawer from "./screen/drawer";
import NavBar from "./components/nav";

function App() {
  return (
    <>
      <div className="bg-stone-50  h-screen ">
        <div className=" border-orange-300 flex">
          <Drawer />
          <div className="w-full py-6 px-4 ">
            <NavBar />
            <div className="flex flex-col mt-7 ">
              <Outlet />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
