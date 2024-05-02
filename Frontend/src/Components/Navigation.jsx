// Navigation.jsx
import axios from "axios";
import { Link, Outlet } from "react-router-dom";



const Navigation = () => {
  
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
              <a href="#">Sobre Nosotros</a>
            </li>
            <li>
              <a href="#">Servicios</a>
            </li>
            <li>
              <a href="#">Contacto</a>
            </li>
          </ul>
        </div>
        <Outlet />
      </nav>

     
    </>
  );
};

export default Navigation;
