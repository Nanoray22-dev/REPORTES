import { useEffect, useState } from "react";
import axios from "axios";
import { saveAs } from "file-saver";
import { Outlet } from "react-router-dom";
import Swal from "sweetalert2";
import ReportList from "./ReportList";
import CreateReport from "./CreateReport";
import Navigation from "../Home/Navigation";

const ReportForm = ({ handleSubmit }) => {
  const [reports, setReports] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6; // Número de elementos por página
  const [searchTerm, setSearchTerm] = useState("");
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

    fetchReports();
  }, []);

  const handleDelete = async (reportId) => {
    const confirmDelete = await Swal.fire({
      title: "¿Estás seguro?",
      text: "Esta acción no se puede deshacer",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, borrarlo",
      cancelButtonText: "Cancelar",
    });

    if (confirmDelete.value) {
      try {
        await axios.delete(`/report/${reportId}`);
        const updatedReports = reports.filter(
          (report) => report._id !== reportId
        );
        setReports(updatedReports);
        Swal.fire({
          title: "Reporte borrado",
          text: "El reporte se ha borrado exitosamente",
          icon: "success",
          showConfirmButton: false,
          timer: 1000,
        });
      } catch (error) {
        console.error("Error deleting report:", error);
        Swal.fire(
          "Error",
          "Ha ocurrido un error al borrar el reporte",
          "error"
        );
      }
    }
  };

  const handleStateChange = async (e, reportId) => {
    const newState = e.target.value;
    try {
      await axios.put(`/report/${reportId}`, { state: newState });
      const updatedReports = reports.map((report) =>
        report._id === reportId ? { ...report, state: newState } : report
      );
      setReports(updatedReports);
      Swal.fire({
        title: "Estado actualizado",
        text: "El estado del reporte se ha actualizado correctamente",
        icon: "success",
        showConfirmButton: false,
        timer: 1500,
        position: "top-end",
      });
    } catch (error) {
      console.error("Error updating report state:", error);
      Swal.fire({
        title: "No tienes acceso para actualizar estado",
        icon: "error",
        showConfirmButton: false,
        timer: 2000,
        position: "top-end",
      });
    }
  };

  const handleView = (report) => {
    setSelectedReport(report);
  };

  const handleCloseModal = () => {
    setSelectedReport(null);
    setShowModal(false);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleExport = () => {
    try {
      const jsonReport = JSON.stringify(reports, null, 2);
      const blob = new Blob([jsonReport], { type: "application/json" });
      saveAs(blob, "reports.json");
    } catch (error) {
      console.error(error);
      Swal.fire(
        "Error",
        "Ha ocurrido un error al exportar los reportes",
        "error"
      );
    }
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  // const currentItems = reports.slice(indexOfFirstItem, indexOfLastItem);
  const filteredReports = reports.filter((report) =>
    report.createdBy.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getsColorState = (state) => {
    switch (state) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-800";
      case "IN_PROGRESS":
        return "bg-blue-100 text-blue-800";
      case "COMPLETED":
        return "bg-green-100 text-green-800";
      case "CLOSED":
        return "bg-gray-100 text-gray-800";
      case "REJECTED":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <>
      <Navigation />
      <div className="container mx-auto">
        <div className="mb-4 flex items-center justify-between p-2">
          <h2 className="text-2xl font-bold mt-4 uppercase">Incidencias</h2>
          <div className="">
            <button
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mr-3"
              onClick={handleExport}
            >
              Exportar Reportes
            </button>
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-4"
              onClick={() => setShowModal(true)}
            >
              + Crear Reporte
            </button>
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearchChange}
              placeholder="Search by username..."
              className="p-2 mb-4 border border-gray-300 rounded-md"
            />
          </div>
        </div>

        {showModal && (
          <CreateReport
            onSubmit={handleSubmit}
            onCloseModal={handleCloseModal}
          />
        )}

        <div className="max-h-[450px] overflow-y-auto">
          <table className="w-full bg-white shadow-md rounded-lg">
            <thead className="bg-gray-200 text-gray-700 uppercase text-xs">
              <tr>
                <th className="px-6 py-3 bg-gray-50 text-left">Creado por</th>
                <th className="px-6 py-3 bg-gray-50 text-left">Imagen</th>
                <th className="px-6 py-3 bg-gray-50 text-left">Fecha</th>
                <th className="px-6 py-3 bg-gray-50 text-left">Estado</th>
                <th className="px-6 py-3 bg-gray-50 text-left">Acción</th>
              </tr>
            </thead>
            <tbody className="text-gray-600 text-sm font-light">
              {filteredReports
                .slice(indexOfFirstItem, indexOfLastItem)
                .map((report, index) => (
                  <tr
                    key={index}
                    className="border-b border-gray-200 hover:bg-gray-100"
                  >
                    <td className="px-6 py-4 whitespace-no-wrap">
                      {report.createdBy}
                    </td>
                    <td className="px-6 py-4">
                      {report.image && (
                        <img
                          src={report.image}
                          alt="Reporte"
                          className="h-12 w-12 rounded-full"
                        />
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {new Date(report.incidentDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${getsColorState(
                          report.state
                        )}`}
                      >
                        {report.state}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                        onClick={() => handleView(report)}
                      >
                        Ver
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
        <div>
          <h4 className="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
            In total there are {reports.length} Reports
          </h4>
        </div>

        <div className="flex justify-center items-center mt-8 mb-4 space-x-4">
          <button
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1}
            className={`bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-l ${
              currentPage === 1 ? "cursor-not-allowed" : ""
            }`}
          >
            &#8592; {/* Flecha hacia la izquierda */}
          </button>
          <div className="flex items-center">
            <div className="bg-gray-200 text-gray-700 font-bold py-2 px-4 rounded">
              {currentPage}
            </div>
            <span className="text-gray-700 mx-2">de</span>
            <div className="bg-gray-200 text-gray-700 font-bold py-2 px-4 rounded">
              {Math.ceil(reports.length / itemsPerPage)}
            </div>
          </div>
          <button
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={indexOfLastItem >= reports.length}
            className={`bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-r ${
              indexOfLastItem >= reports.length ? "cursor-not-allowed" : ""
            }`}
          >
            &#8594; {/* Flecha hacia la derecha */}
          </button>
        </div>

        {selectedReport && (
          <div className="fixed inset-0 z-10 flex items-center justify-center overflow-x-auto overflow-y-auto outline-none focus:outline-none">
            <div className="flex justify-center items-center h-screen">
              <div className="">
                <ReportList
                  report={selectedReport}
                  handleStateChange={handleStateChange}
                  handleDelete={handleDelete}
                  handleCloseModal={handleCloseModal}
                  users={users}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      <Outlet />
    </>
  );
};

export default ReportForm;
