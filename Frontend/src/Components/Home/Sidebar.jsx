import { useContext, useState } from "react";
// Icons
import {
  RiWalletLine,
  RiMore2Fill,
  RiCloseFill,
  RiLogoutBoxRLine,
} from "react-icons/ri";
import { AiOutlineLock, AiOutlineUsergroupAdd } from "react-icons/ai";
import { TbReportSearch } from "react-icons/tb";
import { PiChats } from "react-icons/pi";
import { FcVoicePresentation } from "react-icons/fc";
import { TbSettingsPlus } from "react-icons/tb";
import axios from "axios";
import { UserContext } from "../../UserContext";
import { Link, Outlet } from "react-router-dom";
import logo from "/logo.png";
import { TreeNode } from "./TreeNode";

const Sidebar = ({ username }) => {
  const { id, setId, setUsername } = useContext(UserContext);
  const [ws, setWs] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleMouseLeave = () => {
    setIsOpen(false)
  }

  function logout() {
    axios.post("/logout").then(() => {
      setWs(null);
      setId(null);
      setUsername(null);
      setIsLoggedIn(false);
    });
  }
  return (
    <>
      <div
        className={`bg-primary-300/10 h-full fixed lg:static w-[80%] md:w-[40%] lg:w-full transition-all z-50 duration-300 ${
          showMenu ? "left-0" : "-left-full"
        }`}
      >
        {/* Profile */}
        <div className="flex flex-col items-center justify-center p-8 gap-2 h-[30vh] ">
          <img
            src={logo}
            className="w-24 h-24 object-cover rounded-full ring-2 ring-blue-300 bg-blue-50"
          />
          <h1 className="text-xl  text-gray-500  tracking-wider font-bold uppercase ">
            {"fix"}
            <span className="text-orange-400">oasis</span>
          </h1>

        </div>
        {/* Nav */}
        <div className="bg-white p-8 rounded-tr-[100px] h-[70vh] overflow-y-scroll flex flex-col justify-between gap-8">
          <nav className="flex flex-col gap-8">
            <Link
              to="/reporte"
              href="#"
              className="flex items-center gap-4 text-black py-2 px-4 rounded-xl hover:bg-primary-900/50 transition-colors"
            >
              <TbReportSearch /> Reports
            </Link>
            <Link
              to="/residente"
              href="#"
              className="flex items-center gap-4 text-black py-2 px-4 rounded-xl hover:bg-primary-900/50 transition-colors"
            >
              <AiOutlineUsergroupAdd /> Residents
            </Link>

            <Link
              to="/profile"
              href="#"
              className="flex items-center gap-4 text-black py-2 px-4 rounded-xl hover:bg-primary-900/50 transition-colors"
            >
              <FcVoicePresentation /> My Profile
            </Link>
            <Link
              to="/chat"
              href="#"
              className="flex items-center gap-4 text-black py-2 px-4 rounded-xl hover:bg-primary-900/50 transition-colors"
            >
              <PiChats /> ChatReports
            </Link>

            <div className="relative" >
              <button
                onClick={toggleMenu}
                
                className="flex items-center gap-2 text-black py-2 px-4 rounded-xl hover:bg-primary-900/50 transition-colors"
              >
                <TbSettingsPlus /> Settings
              </button>
              {isOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1" onMouseLeave={handleMouseLeave}>
                  <button onClick={logout} className="w-48" >
                    <TreeNode icon={<RiLogoutBoxRLine />} label="Logout" />
                  </button>
                  <TreeNode
                    icon={<AiOutlineLock />}
                    label="Change Password"
                    to="/change-password"
                  />
                </div>
              )}
            </div>
          </nav>
          <Outlet />
          <div className="bg-primary-100 text-black p-4 rounded-xl">
            <p className="text-gray-400">Having troubles?</p>
            <a href="#">Contact us</a>
            {/* <button
              onClick={logout}
              className="text-sm bg-blue-100 py-1 px-3  text-gray-500 border rounded-sm "
            >
              logout
            </button> */}
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
