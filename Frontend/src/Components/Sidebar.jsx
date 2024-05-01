import { useContext, useState } from "react";
// Icons
import {
  RiHome3Line,
  RiWalletLine,
  RiPieChartLine,
  RiMore2Fill,
  RiCloseFill,
  RiPassportLine,
} from "react-icons/ri";
import axios from "axios";
import { UserContext } from "../UserContext";
import { Link, Outlet } from "react-router-dom";
import logo from "/logo.png";

const Sidebar = ({ username }) => {
  const { id, setId, setUsername } = useContext(UserContext);
  const [ws, setWs] = useState(null);

  function logout() {
    axios.post("/logout").then(() => {
      setWs(null);
      setId(null);
      setUsername(null);
    });
  }
  const [showMenu, setShowMenu] = useState(false);
  return (
    <>
      <div
        className={`bg-primary-900 h-full fixed lg:static w-[80%] md:w-[40%] lg:w-full transition-all z-50 duration-300 ${
          showMenu ? "left-0" : "-left-full"
        }`}
      >
        {/* Profile */}
        <div className="flex flex-col items-center justify-center p-8 gap-2 h-[30vh] ">
          <img
            src={logo}
            className="w-24 h-24 object-cover rounded-full ring-2 ring-blue-300 bg-blue-50"
          />
          <h1 className="text-xl text-black font-bold">{username}</h1>
          <p className="bg-primary-100 py-2 px-4 rounded-full text-black">
            {/* Username */}
          </p>
        </div>
        {/* Nav */}
        <div className="bg-blue-200 p-8 rounded-tr-[100px] h-[70vh] overflow-y-scroll flex flex-col justify-between gap-8">
          <nav className="flex flex-col gap-8">
            <Link
              to="/reporte"
              href="#"
              className="flex items-center gap-4 text-black py-2 px-4 rounded-xl hover:bg-primary-900/50 transition-colors"
            >
              <RiHome3Line /> Reportes
            </Link>
            <Link to="/residente"
              href="#"
              className="flex items-center gap-4 text-black py-2 px-4 rounded-xl hover:bg-primary-900/50 transition-colors"
            >
              <RiPassportLine /> Residentes
            </Link>

            <Link
              to="/dashboard"
              href="#"
              className="flex items-center gap-4 text-black py-2 px-4 rounded-xl hover:bg-primary-900/50 transition-colors"
            >
              <RiWalletLine /> Invoices
            </Link>
            <Link
              to="/chat"
              href="#"
              className="flex items-center gap-4 text-black py-2 px-4 rounded-xl hover:bg-primary-900/50 transition-colors"
            >
              <RiPieChartLine /> ChatReports
            </Link>
          </nav>
          <Outlet />
          <div className="bg-primary-900/50 text-black p-4 rounded-xl">
            <p className="text-gray-400">Having troubles?</p>
            <a href="#">Contact us</a>
            <button
              onClick={logout}
              className="text-sm bg-blue-100 py-1 px-3  text-gray-500 border rounded-sm"
            >
              logout
            </button>
          </div>
        </div>
      </div>
      {/* Button mobile */}
      <button
        onClick={() => setShowMenu(!showMenu)}
        className="lg:hidden fixed right-4 bottom-4 text-2xl bg-primary-900 p-2.5 rounded-full text-white z-50"
      >
        {showMenu ? <RiCloseFill /> : <RiMore2Fill />}
      </button>
    </>
  );
};

export default Sidebar;
