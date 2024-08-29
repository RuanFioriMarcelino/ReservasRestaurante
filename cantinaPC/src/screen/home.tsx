import NavBar from "../components/nav";

import Drawer from "./drawer";

export default function Home() {
  return (
    <div className="flex w-screen h-screen">
      <Drawer />
      <NavBar />
    </div>
  );
}
