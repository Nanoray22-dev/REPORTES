import { useEffect, useState } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import { RiHashtag } from "react-icons/ri";
import { FaLaptopHouse } from "react-icons/fa";
import axios from "axios";
import { Link, Outlet } from "react-router-dom";
// import  logo from "/logo.png";

function Dasboard({ username }) {
  const [recentReports, setRecentReports] = useState([]);
  const [pendingReportsCount, setPendingReportsCount] = useState(0);
  const [inProgressReportsCount, setInProgressReportsCount] = useState(0);
  const [completedReportsCount, setCompletedReportsCount] = useState(0);
  const [totalReportsCount, setTotalReportsCount] = useState(0);
  // const [recentMessages, setRecentMessages] = useState([]);
  const [reports, setReports] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);

  useEffect(() => {
    axios
      .get("/report")
      .then((response) => {
        setRecentReports(response.data);
        // Calcular la cantidad de reportes pendientes y en progreso
        const pendingCount = response.data.filter(
          (report) => report.state === "PENDING"
        ).length;
        const inProgressCount = response.data.filter(
          (report) => report.state === "IN_PROGRESS"
        ).length;
        const completedReportsCount = response.data.filter(
          (report) => report.state === "COMPLETED"
        ).length;
        setPendingReportsCount(pendingCount);
        setInProgressReportsCount(inProgressCount);
        setCompletedReportsCount(completedReportsCount);
        setTotalReportsCount(response.data.length);
      })
      .catch((error) => {
        console.log("Error", error);
      });

  }, []);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await axios.get("/report");
        if (!response.data) {
          throw new Error("Failed to fetch reports");
        }
        const data = response.data.filter((report) => {
          // Filtrar los reportes hechos en las últimas 24 horas
          const reportDate = new Date(report.createdAt);
          const now = new Date();
          const twentyFourHoursAgo = now - 24 * 60 * 60 * 1000;
          return reportDate > twentyFourHoursAgo;
        });
        setReports(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchReports();
  }, []);

  // const fetchRecentMessages = async () => {
  //   try {
  //     const response = await axios.get("/recent-messages"); // Llamar a la nueva ruta del backend
  //     setRecentMessages(response.data);
  //   } catch (error) {
  //     console.error("Error fetching recent messages:", error);
  //   }
  // };

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

  const handleReview = (reportId) => {
    //  la lógica para manejar la revisión del reporte
    console.log(`Reviewing report with ID: ${reportId}`);
  };
  const openModal = (report) => {
    setSelectedReport(report);
    setShowModal(true);
  };

  return (
    <div className="grid lg:grid-cols-4 xl:grid-cols-6 min-h-screen">
      {/* Sidebar */}
      <Sidebar username={username} />

      {/* Main Content */}
      <main className="lg:col-span-3 xl:col-span-5 p-8 h-screen overflow-y-scroll">
        {/* Header */}
        <Header username={username} />

        {/* Section 1 */}
        <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 mt-10 gap-8">
          {/* Total Reports Card */}
          <div className="bg-primary-100 p-8 rounded-xl text-blue-300 flex flex-col items-center justify-center gap-4">
            <h4 className="text-2xl text-orange-300">Total Reports</h4>
            <span className="text-5xl text-white flex items-center">
              <FaLaptopHouse className="text-5xl mr-4" />
              {totalReportsCount}
            </span>
          </div>

          {/* Report State */}
          <div className="bg-white p-8 rounded-xl flex flex-col gap-4 shadow-lg">
            <div className="flex items-center gap-4 bg-primary-100/10 rounded-xl p-4">
              <span className="bg-primary-100 text-white text-2xl font-bold p-4 rounded-xl">
                {pendingReportsCount}
              </span>
              <div>
                <h3 className="font-bold text-yellow-500">Pending</h3>
                <p className="text-gray-500">this month</p>
              </div>
            </div>
            <div className="flex items-center gap-4 bg-primary-100/10 rounded-xl p-4">
              <span className="bg-primary-100 text-white text-2xl font-bold p-4 rounded-xl">
                {completedReportsCount}
              </span>
              <div>
                <h3 className="font-bold text-green-500">Completed</h3>
                <p className="text-gray-500">this month</p>
              </div>
            </div>
            <div className="bg-primary-100/10 rounded-xl p-4">
              <div className="flex items-center gap-4 mb-4">
                <span className="bg-primary-100 text-white text-2xl font-bold p-4 rounded-xl">
                  {inProgressReportsCount}
                </span>
                <div>
                  <h3 className="font-bold text-blue-500">In Progress</h3>
                  <p className="text-gray-500">this month</p>
                </div>
              </div>
            </div>
          </div>

          {/* New Reports to Review */}
          <div className="col-span-1 md:col-span-2 flex flex-col justify-between">
            <h1 className="text-2xl font-bold mb-8">New reports to review</h1>
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <div className="max-h-60 overflow-y-scroll">
                {reports.length > 0 ? (
                  reports.map((report) => (
                    <div key={report._id} className="bg-gray-100 p-4 rounded-md mb-4">
                      <p className="text-gray-600">Reported by: {report.createdBy}</p>
                      <h3 className="font-bold text-lg">{report.title}</h3>
                      <button
                        onClick={() => {
                          handleReview(report._id);
                          openModal(report);
                        }}
                        className="mt-2 px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600 transition-colors"
                      >
                        Review
                      </button>
                    </div>
                  ))
                ) : (
                  <p>No reports to review</p>
                )}
              </div>
              <div className="flex justify-end">
                <Link to="/reporte">
                  <button className="hover:text-white transition-colors bg-customOrange-100/40 px-2 p-2 rounded-xl">
                    See all reports
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Section 2 */}
        <section className="grid grid-cols-1 md:grid-cols-2 mt-10 gap-8">
          {/* Recent Reports */}
          <div>
            <h1 className="text-2xl font-bold mb-4">Recent Reports</h1>
            {recentReports.slice(-2).map((report, index) => (
              <div key={index} className="bg-white p-8 rounded-xl shadow-lg mb-8">
                {/* Report Details */}
                <div className="grid grid-cols-1 xl:grid-cols-4 items-center gap-4 mb-4">
                  <div className="col-span-2 flex items-center gap-4">
                    <img src={report.image} className="w-14 h-14 object-cover rounded-xl" alt="Creator Avatar" />
                    <div>
                      <h3 className="font-bold">{report.title}</h3>
                      <p className="text-gray-500">{""}</p>
                    </div>
                  </div>
                  <div>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getsColorState(report.state)}`}>
                      {report.state}
                    </span>
                  </div>
                  <div>
                    <span className="font-bold">
                      {new Date(report.incidentDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <div>
                  <p className="text-gray-500">Created by:</p>
                  <h3 className="font-bold">{report.createdBy}</h3>
                </div>
              </div>
            ))}
          </div>

          {/* Recommended Project */}
          <div>
            <h1 className="text-2xl font-bold mb-8">Recommended Project</h1>
            <div className="bg-white p-8 rounded-xl shadow-lg mb-8">
              <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <img src="https://img.freepik.com/foto-gratis/retrato-mujer-mayor-cerca_23-2149207185.jpg" className="w-14 h-14 object-cover rounded-full" alt="Creator Avatar" />
                  <div>
                    <h3 className="font-bold">Thomas Martin</h3>
                    <p className="text-gray-500">Updated 10m ago</p>
                  </div>
                </div>
                <div>
                  <span className="bg-primary-100 py-2 px-4 rounded-full text-white">Design</span>
                </div>
              </div>
              <div>
                <h5 className="text-lg font-bold">Need a designer to form branding essentials for my business.</h5>
                <p className="text-gray-500">Looking for a talented brand designer to create all the branding materials my new startup.</p>
              </div>
              <div className="bg-primary-100/10 flex flex-col md:flex-row items-center justify-between gap-4 py-8 px-4 rounded-lg">
                <div>
                  <sup className="text-sm text-gray-500">&euro;</sup>
                  <span className="text-2xl font-bold mr-2">8,700</span>
                  <span className="text-sm text-gray-500">/ month</span>
                </div>
                <div>
                  <span className="border border-primary-100 text-primary-100 py-2 px-4 rounded-full">Full time</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Outlet */}
      <Outlet />
    </div>
  );
}

export default Dasboard;
