// Navigation.jsx
import axios from "axios";
import { useContext, useState } from "react";
import { Link, Outlet } from "react-router-dom";
import { UserContext } from "../UserContext";



const Navigation = () => {
  const { id, setId, setUsername } = useContext(UserContext);
  const [ws, setWs] = useState(null);

  function logout() {
    axios.post("/logout").then(() => {
      setWs(null);
      setId(null);
      setUsername(null);
    });
  }
  return (
    <>
      <nav className="bg-white w-full p-4 shadow-md">
        <div className="flex justify-between items-center">

          <div className="text-xl font-bold">FixOasis </div>


          <ul className="flex space-x-4">
            <li>
              <Link to="/dashboard">Inicio</Link>
            </li>
            <li>
              <Link to="/reporte">Reportes</Link>
            </li>
            <li>
              <Link to="/residente">Residente</Link>
            </li>
            <li>
              <Link to="/chat"> Contacto</Link>
            </li>
            <button
              onClick={logout}
              className="text-sm bg-blue-100 py-1 px-3  text-gray-500 border rounded-sm"
            >
              logout
            </button>
          </ul>
        </div>
        <Outlet />
      </nav>

     
    </>
  );
};

export default Navigation;
