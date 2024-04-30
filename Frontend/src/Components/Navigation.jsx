// Navigation.jsx
import axios from "axios";
// import { Link, Outlet } from "react-router-dom";

import { useState } from "react";

const Navigation = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("/report", { title, description });
      console.log("report created", response.data);
    } catch (error) {
      console.log("error", error);
    }
  };
  return (
    <>
      {/* <nav className="bg-white w-full p-4 shadow-md">
        <div className="flex justify-between items-center">

          <div className="text-xl font-bold">FixOasis </div>


          <ul className="flex space-x-4">
            <li>
              <Link to="dashboard">Inicio</Link>
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
      </nav> */}

      <form onSubmit={handleSubmit}>
        <div className="pt-12">
          <label htmlFor="description">
            <input
              type="text"
              id="description"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </label>
        </div>
        <div>
          <label htmlFor="description">
            <textarea
              value={description}
              id="description"
              cols="30"
              rows="10"
              onChange={(e) => setDescription(e.target.value)}
              required
            ></textarea>
          </label>
        </div>
      </form>
    </>
  );
};

export default Navigation;
