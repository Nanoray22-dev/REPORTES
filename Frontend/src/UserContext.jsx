import { createContext, useEffect, useState } from "react";
import axios from "axios";

export const UserContext = createContext({});

export function UserContextProvider({ children }) {
  const [username, setUsername] = useState(null);
  const [id, setId] = useState(null);
  const [role, setRole] = useState(null); 
  

  useEffect(() => {
    axios.get('https://backoasis-production.up.railway.app/profile').then(response => {
      setId(response.data.userId);
      setUsername(response.data.username);
      setRole(response.data.role); 
    });
  }, []);

  return (
    <UserContext.Provider value={{ username, setUsername, id, setId, role, setRole }}>
      {children}
    </UserContext.Provider>
  );
}
