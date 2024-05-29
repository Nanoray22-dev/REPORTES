import { useContext, useState } from "react";
import axios from "axios";
import { UserContext } from "../../UserContext.jsx";
import logo from "/logo.png";
import PreLoader from "../Helpers/PreLoader.jsx";
import { useNavigate } from "react-router-dom";
import Swal from 'sweetalert2';

export default function RegisterAndLoginForm({notification}) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoginOrRegister, setIsLoginOrRegister] = useState("login");
  const { setUsername: setLoggedInUsername, setId, setRole } = useContext(UserContext);
  const [isLoading, setIsLoading] = useState(false);
  const [usernameError, setUsernameError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const navigate = useNavigate();

  const api = axios.create({
    baseURL : import.meta.env.VITE_API
  })
  async function handleSubmit(ev) {
    ev.preventDefault();
    setIsLoading(true);
    const url = isLoginOrRegister === "register" ? "register" : "login";
    try {
      const { data } = await api.post(url, { username, password });
      setLoggedInUsername(username);
      setId(data.id);
      setRole(data.role);
      setIsLoading(false);

      if (data.role === 'admin') {
        navigate('/dashboard');
      } else {
        navigate('/profile');
      }
    } catch (error) {
      setIsLoading(false);
      setUsernameError(false);
      setPasswordError(false);

      if (error.response) {
        if (error.response.status === 404) {
          setUsernameError(true);
          Swal.fire({
            position: "top-end",
            icon: 'error',
            title: 'Usuario no encontrado',
            text: 'Intente con otro usuario.',
            showConfirmButton: false,
          });
        } else if (error.response.status === 401) {
          setUsernameError(true);
          setPasswordError(true);
          Swal.fire({
            position: "top-end",
            icon: 'error',
            title: 'Credenciales incorrectas',
            text: 'Verifique su nombre de usuario y contraseña.',
            showConfirmButton: false,
            timer: 1500
          });
        } else {
          Swal.fire({
            position: "top-end",
            icon: 'error',
            title: 'Error',
            text: 'User not exits.',
            showConfirmButton: false,
            timer: 1500
          });
        }
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo conectar con el servidor. Inténtelo de nuevo más tarde.',
          showConfirmButton: false,
          timer: 1500
        });
      }
    }
  }

  return (
    <>
    <title>FixOasis</title>

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
              <div className="flex items-center h-full px-20 bg-gray-900 bg-opacity-60">
              <div>
                <h2 className="text-6xl font-extrabold text-white">
                  Fix<span className="text-orange-400">Oasis</span>
                </h2>
                <p className="text-white ml-3 font-medium text-xm">
                Turn your voice into action! 
                </p>
                <p className="max-w-xl mt-5 text-xl text-white font-medium leading-relaxed">
                  FixOasis gives you the opportunity to improve your environment with just a few clicks. 
                  Log in now to report issues, collaborate with other residents, 
                  and make Residencial Oasis an even better place to live. 
                  Your participation makes a difference!
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
                  className="h-24 w-24 lg:ml-36 ml-32 md:ml-20  xs:ml-20 mb-4 rounded-full"
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
                      htmlFor="username"
                      className="block mb-2 text-sm text-gray-600 dark:text-gray-200"
                    >
                      Username
                    </label>
                    <input
                      value={username}
                      onChange={(ev) => setUsername(ev.target.value)}
                      type="text"
                      id="username"
                      placeholder="example Ramon"
                      className={`block w-full px-4 py-2 mt-2 text-black placeholder-gray-400 bg-white border rounded-md dark:placeholder-gray-600 dark:bg-gray-900 dark:text-gray-900 focus:outline-none focus:ring focus:ring-opacity-40 ${
                        usernameError ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-200 dark:border-gray-700 focus:border-blue-400 dark:focus:border-blue-400 focus:ring-blue-400'
                      }`}
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
                      id="password"
                      placeholder="Put your Password"
                      className={`block w-full px-4 py-2 mt-2 text-gray-700 placeholder-gray-400 bg-white border rounded-md dark:placeholder-gray-600 dark:bg-gray-900 dark:text-gray-900 focus:outline-none focus:ring focus:ring-opacity-40 form-control${
                        passwordError ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-200 dark:border-gray-700 focus:border-green-400 dark:focus:border-green-400 focus:ring-green-400 form-control'
                      }`}
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
    </>
   
  );
}
