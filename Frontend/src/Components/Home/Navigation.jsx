// Navigation.jsx
import axios from "axios";
import { useContext, useState } from "react";
import { Link, Outlet } from "react-router-dom";
import { UserContext } from "../../UserContext";
import { TiHomeOutline } from "react-icons/ti";
import { TbReportSearch, TbSettingsPlus } from "react-icons/tb";
import { AiOutlineLock, AiOutlineUsergroupAdd } from "react-icons/ai";
import { MdOutlineContactSupport } from "react-icons/md";
import { RiLogoutBoxRLine } from "react-icons/ri";
import { MdOutlineContactMail } from "react-icons/md";
import { TreeNode } from "./TreeNode";
const Navigation = () => {
  const { setId, setUsername } = useContext(UserContext);
  const [, setWs] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleMouseLeave = () => {
    setIsOpen(false);
  };

  function logout() {
    axios.post("/logout").then(() => {
      setWs(null);
      setId(null);
      setUsername(null);
    });
  }
  return (
    <>
      <nav className="bg-white w-full p-4 shadow-md ">
        <div className="flex justify-between items-center">
          <div className="text-xl font-bold text-gray-500">
            Fix<span className="text-orange-400">Oasis</span>{" "}
          </div>

          <ul className="flex space-x-4 text-black">
            <li className="flex gap-1 text-black">
              <TiHomeOutline className="mt-1" />
              <Link className="hover:text-black" to="/dashboard">
                Home
              </Link>
            </li>
            <li className="flex gap-1">
              <TbReportSearch className="mt-1" />
              <Link className="hover:text-black" to="/reporte">
                Reports
              </Link>
            </li>
            <li className="flex gap-1">
              <AiOutlineUsergroupAdd className="mt-1" />
              <Link className="hover:text-black" to="/residente">
                Residents
              </Link>
            </li>
            <li className="flex gap-1">
              <MdOutlineContactSupport className="mt-1" />
              <Link className="hover:text-black" to="/">
                {" "}
                Contacto
              </Link>
            </li>

            <div className="">
              <button
                onClick={toggleMenu}
                className="flex items-center gap-1 text-black  px-2 rounded-xl hover:bg-primary-900/50 transition-colors"
              >
                <TbSettingsPlus /> Settings
              </button>
              {isOpen && (
                <div
                  className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1"
                  onMouseLeave={handleMouseLeave}
                >
                  {" "}
                  <TreeNode
                    className="hover:text-black no-underline"
                    icon={<MdOutlineContactMail />}
                    label="My Profile"
                    to="/profile"
                  />
                  <TreeNode
                    className="hover:text-black"
                    icon={<AiOutlineLock />}
                    label="Change Password"
                    to="/change-password"
                  />
                  <button onClick={logout} className="w-48 hover:text-black">
                    <TreeNode icon={<RiLogoutBoxRLine />} label="Logout" />
                  </button>
                </div>
              )}
            </div>
          </ul>
        </div>
        <Outlet />
      </nav>
    </>
  );
};

export default Navigation;
