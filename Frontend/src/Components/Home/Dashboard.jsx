import { useEffect, useState } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import { FaLaptopHouse } from "react-icons/fa";
import axios from "axios";
import { Link, Outlet } from "react-router-dom";
import { Bar, Line } from 'react-chartjs-2';
import 'chart.js/auto';
import 'chartjs-adapter-date-fns';
import Modal from "../Report/Modal";
import "../Styles/dashboard.css";

function Dashboard({ username }) {
  const [recentReports, setRecentReports] = useState([]);
  const [pendingReportsCount, setPendingReportsCount] = useState(0);
  const [inProgressReportsCount, setInProgressReportsCount] = useState(0);
  const [completedReportsCount, setCompletedReportsCount] = useState(0);
  const [totalReportsCount, setTotalReportsCount] = useState(0);
  const [reports, setReports] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);

  useEffect(() => {
    axios
      .get("/report")
      .then((response) => {
        setRecentReports(response.data);
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

  const handleReview = (report) => {
    setSelectedReport(report);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedReport(null);
  };

  const handleUpdateReport = async (reportId, newState) => {
    try {
      const response = await axios.put(`/report/${reportId}`, { state: newState });
      setSelectedReport(response.data);
    } catch (error) {
      console.error("Error updating report state", error);
    }
  };

  const barData = {
    labels: ['Pending', 'In Progress', 'Completed'],
    datasets: [
      {
        label: 'Report States',
        data: [pendingReportsCount, inProgressReportsCount, completedReportsCount],
        backgroundColor: ['#facc15', '#3b82f6', '#10b981'],
      },
    ],
  };

  const lineData = {
    datasets: [
      {
        label: 'Reports Over Time',
        data: recentReports.map(report => ({
          x: new Date(report.incidentDate),
          y: 1
        })),
        fill: false,
        backgroundColor: '#3b82f6',
        borderColor: '#3b82f6',
      },
    ],
  };

  const lineOptions = {
    scales: {
      x: {
        type: 'time',
        time: {
          unit: 'day',
          tooltipFormat: 'll',
          displayFormats: {
            day: 'MMM d',
          },
        },
        title: {
          display: true,
          text: 'Date',
        },
      },
      y: {
        title: {
          display: true,
          text: 'Number of Reports',
        },
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="grid lg:grid-cols-4 xl:grid-cols-6 min-h-screen">
      <Sidebar username={username} />
      <main className="lg:col-span-3 xl:col-span-5 p-8 h-screen overflow-y-scroll">
        <Header username={username} />
        <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 mt-10 gap-8">
          <div className="bg-primary-100 p-8 rounded-xl text-blue-300 flex flex-col items-center justify-center gap-4">
            <h4 className="text-2xl text-orange-300">Total Reports</h4>
            <span className="text-5xl text-white flex items-center">
              <FaLaptopHouse className="text-5xl mr-4" />
              {totalReportsCount}
            </span>
          </div>
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
          <div className="col-span-1 md:col-span-2 flex flex-col justify-evenly">
            <h1 className="text-2xl font-bold ">New reports to review</h1>
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <div className="max-h-60 overflow-y-scroll">
                {reports.length > 0 ? (
                  reports.map((report) => (
                    <div key={report._id} className="bg-gray-100 p-4 rounded-md mb-4 borde">
                      <p className="text-gray-600">Reported by: {report.createdBy}</p>
                      <h3 className="font-bold">{report.title}</h3>
                      <p className="text-gray-600">{report.description}</p>
                      <button
                        onClick={() => handleReview(report)}
                        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
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
                  <button className="hover:text-white transition-colors bg-secondary-100/40 px-2 p-2 rounded-xl mt-4">
                    See all reports
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </section>
        <section className="grid grid-cols-1 md:grid-cols-2 mt-10 gap-8">
          <div>
            <h1 className="text-2xl font-bold mb-4">Recent Reports</h1>
            {recentReports.slice(-2).map((report, index) => (
              <div key={index} className="bg-white p-8 rounded-xl shadow-lg mb-8 boder">
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
          <div>
            <h1 className="text-2xl font-bold mb-4">Gráficos y Visualizaciones</h1>
            <div className="bg-white p-8 rounded-xl shadow-lg mb-8">
              <h2 className="text-xl font-bold mb-4">Report States</h2>
              <Bar data={barData} />
            </div>
            <div className="bg-white p-8 rounded-xl shadow-lg mb-8">
              <h2 className="text-xl font-bold mb-4">Reports Over Time</h2>
              <Line data={lineData} options={lineOptions} />
            </div>
          </div>
        </section>
        <Modal
          isOpen={showModal}
          onClose={handleCloseModal}
          report={selectedReport}
          onUpdateReport={handleUpdateReport}
        />
      </main>
      <Outlet />
    </div>
  );
}

export default Dashboard;
