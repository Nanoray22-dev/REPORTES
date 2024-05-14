import { useState } from "react";
import axios from "axios";
import Navigation from "../Home/Navigation";
import { useNavigate, Link } from "react-router-dom";
import image from "/undraw_vault_re_s4my.svg";
function ChangePassword() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [notification, setNotification] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmNewPassword) {
      setNotification("Las contraseñas no coinciden");
      return;
    }

    try {
      const response = await axios.post("/change-password", {
        currentPassword,
        newPassword,
      });
      setNotification(response.data.message);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
      // Redirige al perfil
      setTimeout(() => {
        navigate("/profile");
      }, 1500);
    } catch (error) {
      if (error.response) {
        setNotification(error.response.data.error);
      } else {
        setNotification(
          "Error al procesar la solicitud. Inténtalo de nuevo más tarde."
        );
      }
    }
  };

  return (
    <>
      <Navigation />
      <div className="max-w-2xl mx-auto mt-8 p-8 bg-white shadow-lg rounded-md">
        <h2 className="text-2xl font-bold mb-4 text-center">Cambiar Contraseña</h2>
        <div className="">
          <form onSubmit={handleSubmit} className="space-y-4 ">
            <div className=" justify-center flex">
              <label htmlFor="currentPassword" className="block font-semibold">
                Contraseña Actual:
              </label>
              <input
                type="password"
                id="currentPassword"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
                className="input-field form-control w-fit"
              />
            </div>
            <div className=" justify-center flex">
              <label htmlFor="newPassword" className="block font-semibold">
                Nueva Contraseña:
              </label>
              <input
                type="password"
                id="newPassword"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                className="input-field form-control w-fit"
              />
            </div>
            <div className=" justify-center flex ">
              <label
                htmlFor="confirmNewPassword"
                className="block font-semibold"
              >
                Confirmar Nueva Contraseña:
              </label>
              <input
                type="password"
                id="confirmNewPassword"
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
                required
                className="input-field form-control w-fit"
              />
            </div>
            <div className="flex justify-between items-center">
              <button type="submit" className="btn-primary p-2">
                Cambiar Contraseña
              </button>
              <Link to="/profile" className="btn-secondary p-2 justify-end">
                Volver al perfil
              </Link>
            </div>
          </form>
        </div>

        <div className=" justify-center items-center flex">
          <img className="img w-80 h-auto" src={image} alt="" />
        </div>

        {notification && <p className="text-red-500 mt-4">{notification}</p>}
      </div>
    </>
  );
}

export default ChangePassword;
