import { useContext } from "react";
import { Routes, Route, } from "react-router-dom";
import InicioDeSession from "./InicioDeSession";
import { UserContext } from "./UserContext";
import Chat from "./Chat";
import Dashboard from "./Components/Dashboard";
import ReportForm from "./Components/Report/ReportForm";
import UserTable from "./Components/Profile/UserTable";
import EditUserForm from "./Components/Profile/UserEditForm";
import AccessDeniedPage from "./AccessDeniedPage";
// import Navigation from "./Components/Navigation";

export default function Rutas() {
  const { username } = useContext(UserContext);

  if (username) {
    return (
      <Routes>
        <Route path="/dashboard" element={<Dashboard username={username } />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/reporte" element={<ReportForm />} />
        <Route path="/residente" element={<UserTable />} />
        <Route path="/editar" element={<EditUserForm />} />
        <Route path="/access-denied" element={<AccessDeniedPage />} />

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
