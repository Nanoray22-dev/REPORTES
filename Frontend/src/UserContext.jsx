import { createContext, useEffect, useState } from "react";
import axios from "axios";

export const UserContext = createContext({});

export function UserContextProvider({ children }) {
  const [username, setUsername] = useState(null);
  const [id, setId] = useState(null);
  const [role, setRole] = useState(null); // Agregar estado para el rol del usuario

  useEffect(() => {
    axios.get('/profile').then(response => {
      setId(response.data.userId);
      setUsername(response.data.username);
      setRole(response.data.role); // Establecer el estado del rol del usuario
    });
  }, []);

  return (
    <UserContext.Provider value={{ username, setUsername, id, setId, role, setRole }}>
      {children}
    </UserContext.Provider>
  );
}
