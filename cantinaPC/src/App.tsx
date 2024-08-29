import { Outlet } from "react-router-dom";
import Drawer from "./screen/drawer";
import NavBar from "./components/nav";

function App() {
  return (
    <>
      <div className="bg-black_ h-screen ">
        <div className=" border-orange-300 flex">
          <Drawer />
          <div className="w-full p-6">
            <NavBar />
            <div className="pt-8">
              <Outlet />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
