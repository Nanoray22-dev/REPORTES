import { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";

const AssignReport = () => {
  const [selectedUser, setSelectedUser] = useState("");
  const [reportId, setReportId] = useState("");
  const [reports, setReports] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await axios.get("/report");
        setReports(response.data);
      } catch (error) {
        console.error("Error fetching reports:", error);
      }
    };

    const fetchUsers = async () => {
      try {
        const response = await axios.get("/users");
        setUsers(response.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchReports();
    fetchUsers();
  }, []);

  const handleAssign = async () => {
    try {
        console.log("Selected user:", selectedUser);
        console.log("Selected report:", reportId);
      // Verificar si se ha seleccionado un usuario y un reporte
      if (!selectedUser || !reportId) {
        Swal.fire(
          "Error",
          "Por favor selecciona un usuario y un informe",
          "error"
        );
        return;
      }

      // Envía una solicitud al servidor para asignar el informe al usuario seleccionado
      await axios.post(`/assign-report/${reportId}`, { userId: selectedUser });

      // Muestra un mensaje de éxito
      Swal.fire({
        title: "Informe asignado",
        text: "El informe ha sido asignado al usuario correctamente",
        icon: "success",
      });

      // Puedes realizar alguna acción adicional después de la asignación, como actualizar la lista de informes
    } catch (error) {
      console.error("Error al asignar informe:", error);
      // Si ocurre un error, muestra un mensaje de error al usuario
      Swal.fire("Error", "Ha ocurrido un error al asignar el informe", "error");
    }
  };

  return (
    <div>
      <h2>Asignar Informe</h2>
      <select
        value={selectedUser}
        onChange={(e) => setSelectedUser(e.target.value)}
      >
        <option value="">Selecciona un usuario</option>
        {/* Mapear la lista de usuarios y generar opciones para cada uno */}
        {users.map((user) => (
          <option key={user.id} value={user.id}>
            {user.username}
          </option>
        ))}
      </select>
      <select value={reportId} onChange={(e) => setReportId(e.target.value)}>
        <option value="">Selecciona un informe</option>
        {reports.map((report) => (
          <option key={report.id} value={report.id}>
            {report.title}
          </option>
        ))}
      </select>
      <button onClick={handleAssign}>Asignar Informe</button>
    </div>
  );
};

export default AssignReport;
