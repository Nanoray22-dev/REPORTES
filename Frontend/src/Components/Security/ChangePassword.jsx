import { useContext, useState } from "react";
import axios from "axios";
import Navigation from "../Home/Navigation";
import { useNavigate, Link } from "react-router-dom";
import { UserContext } from "../../UserContext";
import "../Security/Change.css";

function ChangePassword() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [notification, setNotification] = useState(null);
  const [email, setEmail] = useState("");
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  const { username } = useContext(UserContext);
  // const [formData, setFormData] = useState({
  //   from: "onboarding@resend.dev",
  //   to: "",
  //   subject: "",
  //   html: "",
  // });

  const openModal = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  // const handleChange = (e) => {
  //   const { name, value } = e.target;
  //   setFormData({ ...formData, [name]: value });
  // };

  const handleSend = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('/api/sendPasswordRecoveryEmail', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email })
      });
      
      const data = await response.json();


      console.log(data.message);
    } catch (error) {
      console.error('Error:', error);
    }
  };

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
      <section className="bg-gray-50 dark:bg-gray-50">
        <div className="container px-6 py-24 mx-auto lg:py-32">
          <div className="lg:flex">
            <div className="lg:w-1/2">
              <img
                className="w-36 h-auto sm:h-8 rounded-full"
                src="/logo.png"
                alt=""
              />

              <h1 className="mt-4 font-medium lg:text-xl text-black dark:text-black md:text-lg">
                {username}
              </h1>

              <h1 className="mt-4 text-2xl font-medium text-gray-800 capitalize lg:text-3xl dark:text-black">
                Make your new password
              </h1>
            </div>

            <div className="mt-8 lg:w-1/2 lg:mt-0">
              <form className="w-full lg:max-w-xl" onSubmit={handleSubmit}>
                <h1 className="mb-3 font-bold text-2xl">
                  Change for new Password
                </h1>
                <div className="relative flex items-center">
                  <span className="absolute">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-6 h-6 mx-3 text-gray-300 dark:text-gray-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                      />
                    </svg>
                  </span>

                  <input
                    type="password"
                    id="currentPassword"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    required
                    className="block w-full py-3 text-gray-700 bg-white border rounded-lg px-11 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 dark:focus:border-blue-300 focus:ring-blue-300 focus:outline-none focus:ring focus:ring-opacity-40"
                    placeholder="Current Password"
                  />
                </div>

                <div className="relative flex items-center mt-4">
                  <span className="absolute">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-6 h-6 mx-3 text-gray-300 dark:text-gray-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                      />
                    </svg>
                  </span>

                  <input
                    type="password"
                    id="newPassword"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    className="block w-full px-10 py-3 text-gray-700 bg-white border rounded-lg dark:bg-gray-900 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 dark:focus:border-blue-300 focus:ring-blue-300 focus:outline-none focus:ring focus:ring-opacity-40"
                    placeholder="New Password"
                  />
                </div>

                <div className="relative flex items-center mt-4">
                  <span className="absolute">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-6 h-6 mx-3 text-gray-300 dark:text-gray-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                      />
                    </svg>
                  </span>

                  <input
                    type="password"
                    id="confirmNewPassword"
                    value={confirmNewPassword}
                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                    required
                    className="block w-full px-10 py-3 text-gray-700 bg-white border rounded-lg dark:bg-gray-900 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 dark:focus:border-blue-300 focus:ring-blue-300 focus:outline-none focus:ring focus:ring-opacity-40"
                    placeholder="Confirm New Password"
                  />
                </div>

                <div className="mt-8 md:flex md:items-center">
                  <button
                    type="submit"
                    className="w-full px-6 py-3 text-sm font-medium tracking-wide text-white capitalize transition-colors duration-300 transform bg-blue-500 rounded-lg md:w-1/2 hover:bg-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-50"
                  >
                    Change Password
                  </button>

                  <a
                    href="#"
                    onClick={openModal}
                    className="inline-block mt-4 text-center text-blue-500 md:mt-0 md:mx-6 hover:underline dark:text-blue-400"
                  >
                    Forgot your password?
                  </a>
                </div>
              </form>
              {showModal && (
                <div className="fixed z-10 inset-0 overflow-y-auto">
                  <div className="flex items-center justify-center min-h-screen">
                    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>

                    <div className="relative bg-white rounded-lg max-w-md mx-auto p-8">
                      <div
                        className="absolute top-0 right-0 cursor-pointer"
                        onClick={closeModal}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-6 w-6 text-gray-500 hover:text-gray-700"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </div>
                      <h2 className="text-xl font-bold mb-4">Reset Password</h2>
                      <form onSubmit={handleSend}>
                        <label htmlFor="email">Correo electrónico:</label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                        />
                        <button type="submit">
                          Enviar Correo de Recuperación
                        </button>
                      </form>
                      {notification && <p>{notification}</p>}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
          {notification && (
            <p className="text-green-500 mt-4 ">{notification}</p>
          )}
          <div className="mt-8 md:mt-24 sm:flex sm:items-center">
            <h3 className="text-blue-500 dark:text-blue-400 sm:w-1/2">
              <Link to={"/profile"}> Back to profile</Link>
            </h3>
           
          </div>
        </div>
      </section>
    </>
  );
}

export default ChangePassword;
