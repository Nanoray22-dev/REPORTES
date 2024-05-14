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

            <div className="flex items-center mt-4 sm:mt-0 -mx-1.5 sm:w-1/2">
              <a
                className="mx-1.5 dark:hover:text-blue-400 text-gray-400 transition-colors duration-300 transform hover:text-blue-500"
                href="#"
              >
                <svg
                  className="w-10 h-10 fill-current"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M18.6668 6.67334C18.0002 7.00001 17.3468 7.13268 16.6668 7.33334C15.9195 6.49001 14.8115 6.44334 13.7468 6.84201C12.6822 7.24068 11.9848 8.21534 12.0002 9.33334V10C9.83683 10.0553 7.91016 9.07001 6.66683 7.33334C6.66683 7.33334 3.87883 12.2887 9.3335 14.6667C8.0855 15.498 6.84083 16.0587 5.3335 16C7.53883 17.202 9.94216 17.6153 12.0228 17.0113C14.4095 16.318 16.3708 14.5293 17.1235 11.85C17.348 11.0351 17.4595 10.1932 17.4548 9.34801C17.4535 9.18201 18.4615 7.50001 18.6668 6.67268V6.67334Z" />
                </svg>
              </a>

              <a
                className="mx-1.5 dark:hover:text-blue-400 text-gray-400 transition-colors duration-300 transform hover:text-blue-500"
                href="#"
              >
                <svg
                  className="w-8 h-8"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M13 20H5C4.46957 20 3.96086 19.7893 3.58579 19.4142C3.21071 19.0391 3 18.5304 3 18V6C3 5.46957 3.21071 4.96086 3.58579 4.58579C3.96086 4.21071 4.46957 4 5 4H13M17 16L21 12M21 12L17 8M21 12L13 12"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </a>

              <a
                className="mx-1.5 dark:hover:text-blue-400 text-gray-400 transition-colors duration-300 transform hover:text-blue-500"
                href="#"
              >
                <svg
                  className="w-8 h-8"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M16 3H8C6.346 3 5 4.346 5 6v12C5 19.654 6.346 21 8 21H16C17.654 21 19 19.654 19 18V6C19 4.346 17.654 3 16 3ZM16 18H8C7.447 18 7 17.553 7 17V7C7 6.447 7.447 6 8 6H16C16.553 6 17 6.447 17 7V17C17 17.553 16.553 18 16 18Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M12 13L16 17L20 13"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default ChangePassword;
