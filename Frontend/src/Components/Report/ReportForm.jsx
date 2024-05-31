import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { saveAs } from "file-saver";
import { Outlet } from "react-router-dom";
import Swal from "sweetalert2";
import ReportList from "./ReportList";
import CreateReport from "./CreateReport";
import Navigation from "../Home/Navigation";
import { RiSearch2Line } from "react-icons/ri";
import { TbEyeSearch, TbReportOff, TbSend } from "react-icons/tb";
import { MdArrowBackIosNew, MdArrowForwardIos } from "react-icons/md";
import { HiMiniInboxArrowDown } from "react-icons/hi2";
import { LuFilePlus2 } from "react-icons/lu";
import { UserContext } from "../../UserContext";
import { IoCalendarOutline } from "react-icons/io5";

const ReportForm = ({ handleSubmit, users }) => {
  const [reports, setReports] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const [searchTerm, setSearchTerm] = useState("");
  const [dateFilter, setDateFilter] = useState("all");
  const { role } = useContext(UserContext);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await axios.get("https://backoasis-production.up.railway.app/report");
        setReports(response.data);
      } catch (error) {
        console.error("Error fetching reports:", error);
      }
    };

    fetchReports();
  }, []);


  const loadReports = async () => {
    try {
      const response = await axios.get("https://backoasis-production.up.railway.app/report");
      setReports(response.data);
    } catch (error) {
      console.error("Error fetching reports:", error);
    }
  };

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
        await axios.delete(`https://backoasis-production.up.railway.app/report/${reportId}`);
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
      await axios.put(`https://backoasis-production.up.railway.app/report/${reportId}`, { state: newState });
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

  // Función para filtrar los reportes según el rango de fechas seleccionado
  const filterReportsByDate = (reports) => {
    const now = new Date();
    return reports.filter((report) => {
      const reportDate = new Date(report.incidentDate);
      switch (dateFilter) {
        case "last_day":
          return reportDate >= new Date(now.setDate(now.getDate() - 1));
        case "last_7_days":
          return reportDate >= new Date(now.setDate(now.getDate() - 7));
        case "last_30_days":
          return reportDate >= new Date(now.setDate(now.getDate() - 30));
        case "last_month":
          return reportDate >= new Date(now.setMonth(now.getMonth() - 1));
        case "last_year":
          return reportDate >= new Date(now.setFullYear(now.getFullYear() - 1));
        default:
          return true;
      }
    });
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const filteredReports = reports.filter((report) =>
    report.createdBy.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredAndDateFilteredReports = filterReportsByDate(filteredReports);

  const getsColorState = (state) => {
    switch (state) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-800";
      case "PROGRESS":
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

  const handleReportCreated = async (newReport) => {
    try {
      await axios.post("https://backoasis-production.up.railway.app/report", newReport);
      setShowModal(false);
      await loadReports(); 
    } catch (error) {
      console.error("Error creating report:", error);
      Swal.fire("Error", "Ha ocurrido un error al crear el reporte", "error");
    }
  };

  return (
    <>
      <title>Reports</title>

      <Navigation />
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between p-4 gap-4">
          <div className="flex flex-col md:flex-row gap-4">
            <button
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
              onClick={handleExport}
            >
              <span className="flex gap-2">
                <HiMiniInboxArrowDown className="text-xl" />
                Export Report
              </span>
            </button>
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              onClick={() => setShowModal(true)}
            >
              <span className="flex gap-2">
                <LuFilePlus2 className="text-xl" /> New Report
              </span>
            </button>
          </div>
          <div className="flex items-center gap-2">
            <IoCalendarOutline className="text-xl mt-2 md:mt-0" />
            <select
              className="form-select form-control w-full md:w-auto bg-gray-200 outline-none rounded-xl"
              aria-label="Default select example"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
            >
              <option value="all">All</option>
              <option value="last_day">Last Day</option>
              <option value="last_7_days">Last 7 Days</option>
              <option value="last_30_days">Last 30 Days</option>
              <option value="last_month">Last Month</option>
              <option value="last_year">Last Year</option>
            </select>
          </div>
          <div className="relative w-full md:w-auto">
            <RiSearch2Line className="absolute top-1/2 transform -translate-y-1/2 left-2" />
            <input
              value={searchTerm}
              onChange={handleSearchChange}
              type="text"
              className="bg-gray-200 outline-none py-2 pl-8 pr-4 rounded-xl w-full"
              placeholder="Search for username"
            />
          </div>
        </div>

        {showModal && (
          <CreateReport
            onSubmit={handleSubmit}
            onCloseModal={handleCloseModal}
            onReportCreated={handleReportCreated}
          />
        )}
        <div>
          <h4 className="px-6 py-3 bg-gray-50 text-left text-xl leading-4 font-bold text-gray-500 uppercase tracking-wider rounded-md">
            {role === "admin" ? "Reports of all residents" : "Your Reports"}
          </h4>
        </div>
        <div className="max-h-[450px] overflow-y-auto">
          <table className="w-full bg-gray-200 shadow-md rounded-lg">
            <thead className="bg-gray-200 text-gray-700 uppercase text-xs">
              <tr>
                <th className="px-6 py-3 bg-gray-50 text-left">Username</th>
                <th className="px-6 py-3 bg-gray-50 text-left hidden md:table-cell">Image</th>
                <th className="px-6 py-3 bg-gray-50 text-left hidden md:table-cell">Date</th>
                <th className="px-6 py-3 bg-gray-50 text-left hidden md:table-cell">State</th>
                <th className="px-6 py-3 bg-gray-50 text-left">Action</th>
              </tr>
            </thead>
            <tbody className="text-gray-600 text-sm font-light">
              {filteredAndDateFilteredReports
                .reverse()
                .slice(indexOfFirstItem, indexOfLastItem)
                .map((report, index) => (
                  <tr
                    key={index}
                    className="border-b border-gray-200 hover:bg-gray-100"
                  >
                    <td className="px-6 py-4 whitespace-no-wrap">
                      {report.createdBy}
                    </td>
                    <td className="px-6 py-4 hidden md:table-cell">
                      {report.image && (
                        <img
                          src={report.image}
                          alt="Reporte"
                          className="h-12 w-12 rounded-full"
                        />
                      )}
                    </td>
                    <td className="px-6 py-4 hidden md:table-cell">
                      {new Date(report.incidentDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 hidden md:table-cell">
                      <span
                        className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${getsColorState(
                          report.state
                        )}`}
                      >
                        {report.state}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="dropdown">
                        <button
                          className="btn btn-primary dropdown-toggle"
                          type="button"
                          data-bs-toggle="dropdown"
                          aria-expanded="false"
                        >
                          Action
                        </button>
                        <ul className="dropdown-menu">
                          <li>
                            <button
                              className="dropdown-item flex gap-2"
                              type="button"
                              onClick={() => handleView(report)}
                            >
                              <TbEyeSearch className="text-xl" />
                              See report
                            </button>
                          </li>
                          <li>
                            <hr className="dropdown-divider" />
                          </li>
                          <li>
                            <button
                              className="dropdown-item flex gap-2 text-red-500"
                              type="button"
                              onClick={() => handleDelete(report._id)}
                            >
                              <TbReportOff className="text-xl text-red-300" />
                              Delete
                            </button>
                          </li>
                          <li>
                            <hr className="dropdown-divider" />
                          </li>
                          <li>
                            <button
                              className="dropdown-item flex gap-2"
                              type="button"
                            >
                              <TbSend className="text-xl" />
                              Send to
                            </button>
                          </li>
                        </ul>
                      </div>
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
        <div className="flex justify-between mt-2">
          <div className="flex items-center">
            <p className="font-medium">Page</p>
            <div className="text-gray-700 font-bold ml-2 rounded">
              {currentPage}
            </div>
            <span className="text-gray-700 mx-2">of</span>
            <div className="text-gray-700 font-bold rounded">
              {Math.ceil(filteredAndDateFilteredReports.length / itemsPerPage)}
            </div>
          </div>

          <div className="space-x-2">
            <button
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
              className={`bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-l ${
                currentPage === 1 ? "cursor-not-allowed" : ""
              }`}
            >
              <MdArrowBackIosNew />
            </button>

            <button
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={
                indexOfLastItem >= filteredAndDateFilteredReports.length
              }
              className={`bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-r ${
                indexOfLastItem >= filteredAndDateFilteredReports.length
                  ? "cursor-not-allowed"
                  : ""
              }`}
            >
              <MdArrowForwardIos />
            </button>
          </div>
        </div>

        {selectedReport && (
          <div className="fixed inset-0 z-10 flex items-center justify-center overflow-x-auto overflow-y-auto outline-none focus:outline-none">
            <div className="flex justify-center items-center h-screen">
              <div>
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
