import { useContext } from "react";
import { Routes, Route } from "react-router-dom";
import InicioDeSession from "./InicioDeSession";
import { UserContext } from "./UserContext";
import Chat from "./Chat";
import Dashboard from "./Components/Home/Dashboard";
import ReportForm from "./Components/Report/ReportForm";
import UserTable from "./Components/Profile/UserTable";
import EditUserForm from "./Components/Profile/UserEditForm";
import AccessDeniedPage from "./Components/Security/AccessDeniedPage";
import Profile from "./Components/Profile/Profile";

export default function Rutas() {
  const { username } = useContext(UserContext);

  if (username) {
    return (
      <Routes>
        <Route path="/dashboard" element={<Dashboard username={username} />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/reporte" element={<ReportForm />} />
        <Route path="/residente" element={<UserTable />} />
        <Route path="/editar" element={<EditUserForm />} />
        <Route path="/profile" element={<Profile />} />

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
