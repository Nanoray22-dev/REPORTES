import {useContext, useState} from "react";
import axios from "axios";
import {UserContext} from "./UserContext.jsx";
import image from "/search1.svg";
export default function RegisterAndLoginForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoginOrRegister, setIsLoginOrRegister] = useState('login');
  const {setUsername:setLoggedInUsername, setId} = useContext(UserContext);
  
  async function handleSubmit(ev) {
    ev.preventDefault();
    const url = isLoginOrRegister === 'register' ? 'register' : 'login';
    const {data} = await axios.post(url, {username,password});
    setLoggedInUsername(username);
    setId(data.id);
  }
  return (
    <div className=" min-h-screen flex justify-center items-center relative overflow-hidden bg-cover bg-center bg-no-repeat " style={{backgroundImage: `url('SVG-background-animation.gif')`}}>
  {/* Bubuha en la esquina superior */}
  <div className="absolute top-0 left-0 w-32 h-32 rounded-full -mt-12 -ml-12"></div>
  {/* Contenedor principal */}
  <div className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col md:flex-row items-center w-full md:w-3/4 lg:w-2/3 xl:w-1/2">
    {/* Imagen */}
    <img src={image} alt="Image" className="w-full md:w-1/2 ml-2" />
    {/* Formulario */}
    <form className="w-full md:w-1/2 p-6" onSubmit={handleSubmit}>
      <h2 className="text-3xl font-semibold mb-4">{isLoginOrRegister === 'register' ? 'Register' : 'Login'}</h2>
      {/* Username input */}
      <input
        value={username}
        onChange={(ev) => setUsername(ev.target.value)}
        type="text"
        placeholder="Username"
        className="block w-full rounded-sm p-3 mb-4 border border-gray-300 focus:outline-none focus:border-blue-500"
      />
      {/* Password input */}
      <input
        value={password}
        onChange={(ev) => setPassword(ev.target.value)}
        type="password"
        placeholder="Password"
        className="block w-full rounded-sm p-3 mb-4 border border-gray-300 focus:outline-none focus:border-blue-500"
      />
      {/* Submit button */}
      <button className="bg-blue-500 text-white block w-full rounded-sm p-3 mb-4 hover:bg-blue-600 focus:outline-none focus:bg-blue-600">
        {isLoginOrRegister === 'register' ? 'Register' : 'Login'}
      </button>
      <div className="text-center">
        {/* Toggle between login and register */}
        {isLoginOrRegister === 'register' ? (
          <p>
            Already a member?{" "}
            <button className="text-blue-500 hover:underline focus:outline-none" onClick={() => setIsLoginOrRegister('login')}>
              Login here
            </button>
          </p>
        ) : (
          <p>
            {"Don't have an account? "}
            <button className="text-blue-500 hover:underline focus:outline-none" onClick={() => setIsLoginOrRegister('register')}>
              Register
            </button>
          </p>
        )}
      </div>
    </form>
  </div>
  {/* Bubuha en la esquina inferior */}
  <div className="absolute bottom-0 right-0 w-24 h-24 rounded-full -mb-12 -mr-12"></div>
</div>
  );
}