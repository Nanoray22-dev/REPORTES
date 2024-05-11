import axios from "axios";
import {UserContextProvider} from "./UserContext";
import Routes from "./Routes";
import { BrowserRouter  } from 'react-router-dom';
import { useState } from "react";
import '@mantine/core/styles.css';
import { MantineProvider } from '@mantine/core';

function App() {
  axios.defaults.baseURL = 'http://localhost:4040';
  axios.defaults.withCredentials = true;
  const [username, setUsername] = useState(""); 
  return (
    <BrowserRouter>
    <UserContextProvider>
      <MantineProvider>
      <Routes  setUsername={setUsername}/>
      </MantineProvider>
    </UserContextProvider>
    </BrowserRouter>
  )
}

export default App