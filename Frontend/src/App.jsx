import axios from "axios";
import {UserContextProvider} from "./UserContext";
import Routes from "./Routes";
import { BrowserRouter  } from 'react-router-dom';
import { useState } from "react";

function App() {
  axios.defaults.baseURL = 'http://localhost:4040';
  axios.defaults.withCredentials = true;
  const [username, setUsername] = useState(""); 
  return (
    <BrowserRouter>
    <UserContextProvider>
      <Routes  setUsername={setUsername}/>
    </UserContextProvider>
    </BrowserRouter>
  )
}

export default App