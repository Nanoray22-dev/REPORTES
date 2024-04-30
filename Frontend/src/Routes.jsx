import { useContext } from "react";
import { Routes, Route, } from "react-router-dom";
import InicioDeSession from "./InicioDeSession";
import { UserContext } from "./UserContext";
import Chat from "./Chat";
import Dashboard from "./Components/Dashboard";
// import Navigation from "./Components/Navigation";
import ReportForm from "./Components/ReportForm";

export default function Rutas() {
  const { username } = useContext(UserContext);

  if (username) {
    return (

      <Routes>
        <Route path="/dashboard" element={<Dashboard  username={username}/>} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/reporte" element={ <ReportForm /> } />

        <Route />
      </Routes>

    );
  }

  return (
    <>
    {/* <Routes>
      <Route path="/login" element={<InicioDeSession />} />
       
    </Routes> */}
    <InicioDeSession />
   </>
  );
}
