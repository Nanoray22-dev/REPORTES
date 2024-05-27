import { useContext } from "react";
import { UserContext } from "./UserContext";
import { Routes, Route, Navigate } from "react-router-dom";
import InicioDeSession from "./Components/Content/InicioDeSession";
import Chat from "./Components/Content/Chat";
import Dashboard from "./Components/Home/Dashboard";
import ReportForm from "./Components/Report/ReportForm";
import UserTable from "./Components/Profile/UserTable";
import EditUserForm from "./Components/Profile/UserEditForm";
import AccessDeniedPage from "./Components/Security/AccessDeniedPage";
import Profile from "./Components/Profile/Profile";
import ChangePassword from "./Components/Security/ChangePassword";
import AssignReport from "./Components/Report/AssignReport";
import SocialReports from "./Components/Profile/SocialReports";

export default function Rutas() {
  const { username , role} = useContext(UserContext);

  if (username) {
    return (
      <Routes>
      <Route path="/dashboard" element={role === "admin" ? <Dashboard username={username} /> : <Navigate to="/access-denied" />} />
      <Route path="/reporte" element={<ReportForm />} />
      <Route path="/residente" element={role === "admin" ? <UserTable /> : <Navigate to="/access-denied" />} />
      <Route path="/editar" element={<EditUserForm />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/change-password" element={<ChangePassword />} />
      <Route path="/chat" element={<Chat />} />
      <Route path="/assign" element={<AssignReport  />} />
      <Route path="/comment" element={<SocialReports  />} />
      <Route path="/access-denied" element={<AccessDeniedPage />} />
    </Routes>
    );
  }

  return (
    <>
      <InicioDeSession />
    </>
  );
}
