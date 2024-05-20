import { useEffect, useState } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import { FaArrowUp, FaLaptopHouse, FaBell } from "react-icons/fa";
import axios from "axios";
import { Link, Outlet } from "react-router-dom";
import { Bar, Line } from "react-chartjs-2";
import "chart.js/auto";
import "chartjs-adapter-date-fns";
import Modal from "../Report/Modal";
import "../Styles/dashboard.css";
import { io } from "socket.io-client";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

// Asegúrate de que el cliente esté conectando al puerto correcto.
const socket = io();

function Dashboard({ username }) {
  const [recentReports, setRecentReports] = useState([]);
  const [pendingReportsCount, setPendingReportsCount] = useState(0);
  const [inProgressReportsCount, setInProgressReportsCount] = useState(0);
  const [completedReportsCount, setCompletedReportsCount] = useState(0);
  const [totalReportsCount, setTotalReportsCount] = useState(0);
  const [reports, setReports] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [notifications, setNotifications] = useState([]);

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

    socket.on("connect", () => {
      console.log("Connected to server");
    });

    socket.on("new-report", (report) => {
      console.log("New report received:", report);
      setNotifications((prevNotifications) => [...prevNotifications, report]);
    });

    socket.on("disconnect", () => {
      console.log("Disconnected from server");
    });

    fetchReports();
  }, []);

  useEffect(() => {
    socket.on("new-report", (report) => {
      setNotifications((prev) => [...prev, report]);
    });

    return () => {
      socket.off("new-report");
    };
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
      const response = await axios.put(`/report/${reportId}`, {
        state: newState,
      });
      setSelectedReport(response.data);
    } catch (error) {
      console.error("Error updating report state", error);
    }
  };

  const handleDateChange = (dates) => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);
  };

  const barData = {
    labels: ["Pending", "In Progress", "Completed"],
    datasets: [
      {
        label: "Report States",
        data: [
          pendingReportsCount,
          inProgressReportsCount,
          completedReportsCount,
        ],
        backgroundColor: ["#facc15", "#3b82f6", "#10b981"],
      },
    ],
  };

  const lineData = {
    datasets: [
      {
        label: "Reports Over Time",
        data: recentReports.map((report) => ({
          x: new Date(report.incidentDate),
          y: 1,
        })),
        fill: false,
        backgroundColor: "#3b82f6",
        borderColor: "#3b82f6",
      },
    ],
  };

  const lineOptions = {
    scales: {
      x: {
        type: "time",
        time: {
          unit: "day",
          tooltipFormat: "ll",
          displayFormats: {
            day: "MMM d",
          },
        },
        title: {
          display: true,
          text: "Date",
        },
      },
      y: {
        title: {
          display: true,
          text: "Number of Reports",
        },
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="grid lg:grid-cols-4 xl:grid-cols-6 min-h-screen bg-gray-50 text-gray-900">
      <Sidebar username={username} />
      <main className="lg:col-span-3 xl:col-span-5 p-8 h-screen overflow-y-scroll">
        <div className="  ">
          <Header username={username} />
          <section className="flex justify-end">
            <FaBell className="text-2xl text-gray-600 hover:text-gray-800 cursor-pointer" />
            {notifications.length > 0 && (
              <span className="bg-red-500 text-white rounded-full px-2 py-1 ml-2">
                {notifications.length}
              </span>
            )}
          </section>
        </div>

        <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 mt-10 gap-8">
          <div className="bg-white text-black p-6 rounded-lg shadow-md transition-transform transform hover:scale-105">
            <h4 className="text-2xl font-bold">Total Reports</h4>
            <span className="text-5xl flex items-center my-4">
              <FaLaptopHouse className="text-5xl mr-4 text-blue-500" />
              {totalReportsCount}
            </span>
            <p className="text-sm text-gray-500">Updated: {"lastUpdated"}</p>
            <div className="flex items-center mt-4">
              <span className="text-green-500 flex items-center">
                <FaArrowUp className="mr-1" /> 5%
              </span>
              <span className="text-gray-500 ml-2">since last month</span>
            </div>
            <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600 transition-colors">
              View Details
            </button>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md flex flex-col gap-6 transition-transform transform hover:scale-105">
            <div className="flex items-center gap-4 bg-gray-100 rounded-lg p-4">
              <span className="bg-blue-500 text-white text-2xl font-bold p-4 rounded-lg">
                {pendingReportsCount}
              </span>
              <div>
                <h3 className="font-bold text-blue-500">Pending</h3>
                <p className="text-gray-500">this month</p>
              </div>
            </div>
            <div className="flex items-center gap-4 bg-gray-100 rounded-lg p-4">
              <span className="bg-green-500 text-white text-2xl font-bold p-4 rounded-lg">
                {completedReportsCount}
              </span>
              <div>
                <h3 className="font-bold text-green-500">Completed</h3>
                <p className="text-gray-500">this month</p>
              </div>
            </div>
            <div className="flex items-center gap-4 bg-gray-100 rounded-lg p-4">
              <span className="bg-orange-500 text-white text-2xl font-bold p-4 rounded-lg">
                {inProgressReportsCount}
              </span>
              <div>
                <h3 className="font-bold text-orange-500">In Progress</h3>
                <p className="text-gray-500">this month</p>
              </div>
            </div>
          </div>

          <div className="col-span-1 md:col-span-2 flex flex-col justify-evenly">
            <h1 className="text-2xl font-bold mb-4">
              New reports to review{" "}
              <span className="bg-gray-300 rounded-full py-1 px-3">
                {reports.length}
              </span>
            </h1>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="max-h-60 overflow-y-scroll">
                {reports.length > 0 ? (
                  reports.map((report) => (
                    <div
                      key={report._id}
                      className="bg-gray-100 p-4 rounded-lg mb-4 border border-gray-300"
                    >
                      <p className="text-gray-600">
                        Reported by: {report.createdBy}
                      </p>
                      <h3 className="font-bold">{report.title}</h3>
                      <p className="text-gray-600">{report.description}</p>
                      <button
                        onClick={() => handleReview(report)}
                        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                      >
                        Review
                      </button>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500">No reports to review</p>
                )}
              </div>
              <div className="flex justify-end">
                <Link to="/reporte">
                  <button className="hover:text-white transition-colors bg-gray-200 px-4 py-2 rounded-lg mt-4">
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
              <div
                key={index}
                className="bg-white p-6 rounded-lg shadow-md mb-8 border border-gray-300"
              >
                <div className="grid grid-cols-1 xl:grid-cols-4 items-center gap-4 mb-4">
                  <div className="col-span-2 flex items-center gap-4">
                    <img
                      src={report.image}
                      className="w-14 h-14 object-cover rounded-lg"
                      alt="Creator Avatar"
                    />
                    <div>
                      <h3 className="font-bold">{report.title}</h3>
                      <p className="text-gray-500">{""}</p>
                    </div>
                  </div>
                  <div>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getsColorState(
                        report.state
                      )}`}
                    >
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

            <section className="grid grid-cols-1 mt-10 gap-8 ">
              <div>
                <h1 className="text-2xl font-bold mb-4">
                  Filter Reports by Date
                </h1>
                <DatePicker
                  selected={startDate}
                  onChange={handleDateChange}
                  startDate={startDate}
                  endDate={endDate}
                  selectsRange
                  inline
                  className=""
                />
              </div>
            </section>
          </div>

          <div>
            <h1 className="text-2xl font-bold mb-4">Visualizations</h1>
            <div className="bg-white p-6 rounded-lg shadow-md mb-8">
              <h2 className="text-xl font-bold mb-4">Report States</h2>
              <Bar data={barData} />
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md mb-8">
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
