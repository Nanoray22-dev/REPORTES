import { useEffect, useState } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import { RiLineChartLine, RiHashtag } from "react-icons/ri";
import axios from "axios";
import { Link, Outlet } from "react-router-dom";
import Avatar from "../Avatar";
// import  logo from "/logo.png";

function Dasboard({ username }) {
  const [recentReports, setRecentReports] = useState([]);
  const [pendingReportsCount, setPendingReportsCount] = useState(0);
  const [inProgressReportsCount, setInProgressReportsCount] = useState(0);
  const [completedReportsCount, setCompletedReportsCount] = useState(0);
  const [totalReportsCount, setTotalReportsCount] = useState(0);
  const [recentMessages, setRecentMessages] = useState([]);

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
    fetchRecentMessages();
  }, []);

  const fetchRecentMessages = async () => {
    try {
      const response = await axios.get("/recent-messages"); // Llamar a la nueva ruta del backend
      setRecentMessages(response.data);
    } catch (error) {
      console.error("Error fetching recent messages:", error);
    }
  };

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
    <div className="grid lg:grid-cols-4 xl:grid-cols-6 min-h-screen">
      <Sidebar username={username} />
      <main className="lg:col-span-3 xl:col-span-5 bg-blue-100 p-8 h-[100vh] overflow-y-scroll">
        <Header username={username} />
        {/* Section 1 */}
        <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 mt-10 gap-8">
          {/* Card 1 */}

          <div className="bg-primary-100 p-8 rounded-xl text-blue-300 flex flex-col gap-6">
            <h4 className="text-2xl">Total de Reportes</h4>
            <span className="text-5xl text-center text-black flex px-10">
              {" "}
              <RiLineChartLine className="text-5xl mr-4 " />
              {totalReportsCount}
            </span>
            <span className="py-1 px-3 bg-primary-300/80 rounded-full">
              + since last month
            </span>
          </div>

          {/* State del Reporte */}
          <div className="p-4 bg-white rounded-xl flex flex-col justify-between gap-4 drop-shadow-2xl">
            <div className="flex items-center gap-4 bg-primary-100/10 rounded-xl p-4">
              <span className="bg-primary-100 text-black text-2xl font-bold p-4 rounded-xl">
                {pendingReportsCount}
              </span>
              <div>
                <h3 className="font-bold text-yellow-500">Pendientes</h3>
                <p className="text-gray-500">this month</p>
              </div>
            </div>
            <div className="flex items-center gap-4 bg-primary-100/10 rounded-xl p-4">
              <span className="bg-primary-100 text-black text-2xl font-bold p-4 rounded-xl">
                {completedReportsCount}
              </span>
              <div>
                <h3 className="font-bold text-green-500">Completado</h3>
                <p className="text-gray-500">this month</p>
              </div>
            </div>
            <div className="bg-primary-100/10 rounded-xl p-4">
              <div className="flex items-center gap-4 mb-4">
                <span className="bg-primary-100 text-black text-2xl font-bold p-4 rounded-xl">
                  {inProgressReportsCount}
                </span>
                <div>
                  <h3 className="font-bold text-blue-500">En Progreso</h3>
                  <p className="text-gray-500"> this month</p>
                </div>
              </div>
            </div>
          </div>

          {/* State del Reporte */}

          {/* Mensajes Recientes  */}
          <div className="col-span-1 md:col-span-2 flex flex-col justify-between">
            <h1 className="text-2xl font-bold mb-8">Your recent messages</h1>
            <div className="bg-white p-8 rounded-xl shadow-2xl">
              {recentMessages.map((message) => (
                <div key={message._id} className="flex items-center gap-4 mb-4">
                  {message.sender && (
                    <Avatar
                      userId={message.recipient.userId}
                      username={message.recipient.username}
                      online={message.recipient.online}
                    />
                  )}
                  <div>
                    {message.sender && (
                      <h3 className="font-bold">{message.recipient.username}</h3>
                    )}
                    <p className="text-gray-500">{message.text}</p>
                  </div>
                </div>
              ))}
              <div className="flex justify-end">
                <Link to={'/chat'}
                  href="#"
                  className="hover:text-primary-100 transition-colors hover:underline"
                >
                  See all messages
                </Link>
              </div>
            </div>
          </div>

          {/* Mensajes Recientes  */}
        </section>

        {/* Section 2 */}
        <section className="grid grid-cols-1 md:grid-cols-2 mt-10 gap-8">
          <div>
            {/* Reporte Recientes */}
            <div>
              <h1 className="text-2xl font-bold mb-4">Reportes Recientes</h1>
              {recentReports.slice(-2).map((report, index) => (
                <div
                  key={index}
                  className="bg-white p-8 rounded-xl shadow-2xl mb-8 flex flex-col gap-8"
                >
                  <div className="grid grid-cols-1 xl:grid-cols-4 items-center gap-4 mb-4">
                    <div className="col-span-2 flex items-center gap-4">
                      <img
                        src={report.image}
                        className="w-14 h-14 object-cover rounded-xl"
                        alt="Creator Avatar"
                      />
                      <div>
                        <h3 className="font-bold">{report.title}</h3>
                        <p className="text-gray-500">{""}</p>
                      </div>
                    </div>
                    <div>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${getsColorState(
                          report.state
                        )}`}
                      >
                        {report.state}
                      </span>
                    </div>
                    <div>
                      <span className="font-bold">
                        {" "}
                        {new Date(report.incidentDate).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <div>
                    <p className="text-gray-500">Creado Por:</p>
                    <h3 className="font-bold">{report.createdBy}</h3>
                  </div>
                </div>
              ))}
            </div>
            {/* Reporte Recientes */}

            {/* nada que buscar */}
            <div className="bg-primary-900 text-gray-300 p-8 rounded-xl shadow-2xl flex items-center justify-between flex-wrap xl:flex-nowrap gap-8">
              <div>
                <RiHashtag className="text-4xl -rotate-12" />
              </div>
              <div>
                <h5 className="font-bold text-black">
                  Ver las incidencias reportadas
                </h5>
                {/* <h5>Join slack channel</h5> */}
              </div>

              <div className="w-full xl:w-auto">
                <button className="bg-primary-100 py-2 px-6 rounded-xl text-black w-full">
                  <Link to={"/reporte"}>Ver reportes</Link>
                </button>
              </div>
            </div>
            {/* nada que buscar */}
          </div>

          <div>
            <h1 className="text-2xl font-bold mb-8">Recommended project</h1>
            <div className="bg-white p-8 rounded-xl shadow-2xl mb-8 flex flex-col gap-8">
              <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <img
                    src="https://img.freepik.com/foto-gratis/retrato-mujer-mayor-cerca_23-2149207185.jpg"
                    className="w-14 h-14 object-cover rounded-full"
                  />
                  <div>
                    <h3 className="font-bold">Thomas Martin</h3>
                    <p className="text-gray-500">Updated 10m ago</p>
                  </div>
                </div>
                <div>
                  <span className="bg-primary-100 py-2 px-4 rounded-full text-white">
                    Design
                  </span>
                </div>
              </div>
              <div>
                <h5 className="text-lg font-bold">
                  Need a designer to form branding essentials for my business.
                </h5>
                <p className="text-gray-500">
                  Looking for a talented brand designer to create all the
                  branding materials my new startup.
                </p>
              </div>
              <div className="bg-primary-100/10 flex flex-col md:flex-row items-center justify-between gap-4 py-8 px-4 rounded-lg">
                <div>
                  <sup className="text-sm text-gray-500">&euro;</sup>{" "}
                  <span className="text-2xl font-bold mr-2">8,700</span>
                  <span className="text-sm text-gray-500">/ month</span>
                </div>
                <div>
                  <span className="border border-primary-100 text-primary-100 py-2 px-4 rounded-full">
                    Full time
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Outlet />
    </div>
  );
}

export default Dasboard;
