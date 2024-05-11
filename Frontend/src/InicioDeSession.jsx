import { useContext, useState } from "react";
import axios from "axios";
import { UserContext } from "./UserContext.jsx";
import logo from "/logo.png";
import PreLoader from "./Components/Helpers/PreLoader.jsx";


export default function RegisterAndLoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [notification, setNotification] = useState(null);
  const [isLoginOrRegister, setIsLoginOrRegister] = useState("login");
  const { setUsername: setLoggedInUsername, setId } = useContext(UserContext);
  const [isLoading, setIsLoading] = useState(false); // Estado para controlar la carga
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Estado para controlar si el usuario está autenticado o no

  async function handleSubmit(ev) {
    ev.preventDefault();
    setIsLoading(true); // Activar el preloader al enviar la solicitud
    const url = isLoginOrRegister === "register" ? "register" : "login";
    try {
      const { data } = await axios.post(url, { username, password });
      setLoggedInUsername(username);
      setId(data.id);
      setIsLoggedIn(true); // Actualizar el estado para indicar que el usuario está autenticado
      setIsLoading(false); // Desactivar el preloader después de la respuesta exitosa
    } catch (error) {
      setIsLoading(false); // Desactivar el preloader en caso de error también
      if (error.response.status === 404) {
        setNotification("Usuario no encontrado. Intente con otro usuario.");
      } else if (error.response.status === 401) {
        setNotification(
          "Credenciales incorrectas. Verifique su nombre de usuario y contraseña."
        );
      } else {
        setNotification(
          "Se produjo un error al procesar su solicitud. Inténtelo de nuevo más tarde."
        );
      }
    }
  }

  if (isLoggedIn) {
    // Si el usuario está autenticado, redirigir a otra página o mostrar el contenido correspondiente
    return <div>Usuario autenticado. Bienvenido.</div>;
  }

  return (
    <div className="bg-gray-900">
      {isLoading ? (
        <PreLoader />
      ) : (
        <div className="flex justify-center h-screen">
          <div
            className="hidden bg-cover lg:block lg:w-2/3"
            style={{
              backgroundImage:
                "url(https://images.unsplash.com/photo-1616763355603-9755a640a287?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80)",
            }}
          >
            <div className="flex items-center h-full px-20 bg-gray-900 bg-opacity-40">
              <div>
                <h2 className="text-5xl font-bold text-gray-400">
                  Fix<span className="text-orange-400">Oais</span>
                </h2>
                <p className="max-w-xl mt-3 text-gray-300">
                  Lorem ipsum dolor sit, amet consectetur adipisicing elit. In
                  autem ipsa, nulla laboriosam dolores, repellendus perferendis
                  libero suscipit nam temporibus molestiae
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center w-full max-w-md px-6 mx-auto lg:w-2/6">
            <div className="flex-1">
              <div className="text-center">
                <img
                  src={logo}
                  alt="Logo"
                  className="h-24 w-24 ml-36 mb-4 rounded-full"
                />
                <h2 className="text-3xl font-semibold mb-2 text-white">
                  {isLoginOrRegister === "register" ? "Register" : "Login"}
                </h2>
              </div>
              <div className="mt-8">
                {notification && (
                  <div className="mb-4 text-center text-red-500">
                    {notification}
                  </div>
                )}
                <form onSubmit={handleSubmit}>
                  <div>
                    <label
                      htmlFor="text"
                      className="block mb-2 text-sm text-gray-600 dark:text-gray-200"
                    >
                      Username
                    </label>
                    <input
                      value={username}
                      onChange={(ev) => setUsername(ev.target.value)}
                      type="text"
                      placeholder="example Ramon"
                      className="block w-full px-4 py-2 mt-2 text-black placeholder-gray-400 bg-white border border-gray-200 rounded-md dark:placeholder-gray-600 dark:bg-gray-900 dark:text-gray-900 dark:border-gray-700 focus:border-blue-400 dark:focus:border-blue-400 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40"
                    />
                  </div>
                  <div className="mt-6">
                    <div className="flex justify-between mb-2">
                      <label
                        htmlFor="password"
                        className="text-sm text-gray-600 dark:text-gray-200"
                      >
                        Password
                      </label>
                      <a
                        href="#"
                        className="text-sm text-gray-400 focus:text-blue-500 hover:text-blue-500 hover:underline"
                      >
                        Forgot password?
                      </a>
                    </div>
                    <input
                      value={password}
                      onChange={(ev) => setPassword(ev.target.value)}
                      type="password"
                      placeholder="Put your Password"
                      className="block w-full px-4 py-2 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-md dark:placeholder-gray-600 dark:bg-gray-900 dark:text-gray-900 dark:border-gray-700 focus:border-blue-400 dark:focus:border-blue-400 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40"
                    />
                  </div>
                  <p className="mt-3 text-gray-500 dark:text-gray-300">
                    Sign in to access your account
                  </p>
                  <div className="mt-6">
                    <button className="w-full px-4 py-2 tracking-wide text-white transition-colors duration-200 transform bg-blue-500 rounded-md hover:bg-blue-400 focus:outline-none focus:bg-blue-400 focus:ring focus:ring-blue-300 focus:ring-opacity-50">
                      {isLoginOrRegister === "register" ? "Register" : "Login"}
                    </button>
                  </div>
                </form>
                {isLoginOrRegister === "register" ? (
                  <p className="mt-6 text-sm text-center text-gray-400">
                    Already a member{" "}
                    <button
                      onClick={() => setIsLoginOrRegister("login")}
                      className="text-blue-500 focus:outline-none focus:underline hover:underline"
                    >
                      Login Here
                    </button>
                    .
                  </p>
                ) : (
                  <p className="mt-6 text-sm text-center text-gray-400">
                    Don&#x27;t have an account yet?{" "}
                    <button
                      onClick={() => setIsLoginOrRegister("register")}
                      className="text-blue-500 focus:outline-none focus:underline hover:underline"
                    >
                      Register
                    </button>
                    .
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
