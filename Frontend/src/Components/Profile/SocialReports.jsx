import { useState, useEffect } from "react";
import axios from "axios";
import Comments from "./Comments";
import Navigation from "../Home/Navigation";
import { Spinner } from "@chakra-ui/react";
import logo from "/logo.png";
import { FaArrowUp } from "react-icons/fa";
const SocialReports = ({avatar}) => {
  const [reports, setReports] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showScrollButton, setShowScrollButton] = useState(false);

  useEffect(() => {
    fetchReports();
    const socket = new WebSocket("ws://localhost:4040");

    socket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      if (message.type === "new-report") {
        setReports((prevReports) =>
          prevReports.filter((report) => report._id === message.reportId)
        );
        fetchReports();
      }
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowScrollButton(true);
      } else {
        setShowScrollButton(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const fetchReports = async () => {
    try {
      const response = await axios.get("/reports");
      const sortedReports = response.data.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
      setReports(sortedReports);
    } catch (error) {
      setError("Error fetching reports. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const filteredReports = reports.filter((report) => {
    const title = report.title?.toLowerCase() || "";
    const description = report.description?.toLowerCase() || "";
    const username = report.createdBy?.toLowerCase() || "";
    const search = searchTerm.toLowerCase();
    return (
      title.includes(search) ||
      description.includes(search) ||
      username.includes(search)
    );
  });

  return (
    <>
    <title>Social Report</title>

      <Navigation />
      <div className="container mx-auto p-4 max-w-3xl">
        <div className="flex">
          <img
            src={logo}
            alt="Logo"
            className="h-24 w-24 mr-2 mb-4 rounded-full"
          />
          <h1 className="text-3xl font-bold mb-4 my-auto text-gray-800">
            Social Reports
          </h1>
        </div>
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search reports..."
            className="w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        {filteredReports.length > 0 && (
          <div className="text-right text-gray-600 mb-4">
            {filteredReports.length} report(s) found
          </div>
        )}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Spinner size="xl" />
          </div>
        ) : error ? (
          <div className="text-center text-red-500">{error}</div>
        ) : (
          <div className="space-y-4">
            {filteredReports.map((report) => (
              <ReportCard key={report._id} report={report} avatar={avatar} />
            ))}
          </div>
        )}
        {showScrollButton && (
          <button
            onClick={scrollToTop}
            className="fixed bottom-10 right-10 p-3 bg-blue-500 text-white rounded-full shadow-lg hover:bg-blue-700 transition"
          >
            <FaArrowUp />Top
          </button>
        )}
      </div>
    </>
  );
};

const ReportCard = ({ report, avatar }) => (
  <div className="p-4 bg-white shadow-lg rounded-lg max-w-2xl mx-auto transition transform hover:-translate-y-1 hover:shadow-xl">
    <div className="flex items-center mb-3">
      <img
        src={
          avatar
            ? URL.createObjectURL(avatar)
            : "http://ssl.gstatic.com/accounts/ui/avatar_2x.png"
        }
        alt="Profile"
        className="w-10 h-10 rounded-full mr-3"
      />
      <div>
        <h3 className="font-bold text-lg">{report.createdBy}</h3>
        <p className="text-sm text-gray-600">
          {new Date(report.createdAt).toLocaleString()}
        </p>
      </div>
    </div>
    <h2 className="text-xl font-semibold mb-2">{report.title}</h2>
    <Description text={report.description} />
    {report.image && (
      <img
        src={report.image}
        alt="Report"
        className="w-full max-h-80 object-cover mb-3 rounded-lg"
      />
    )}
    <Comments reportId={report._id} />
  </div>
);

const Description = ({ text }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const limit = 100;

  return (
    <div>
      <p className="mb-2 text-base text-gray-700">
        {text?.length > limit && !isExpanded
          ? `${text.slice(0, limit)}...`
          : text}
      </p>
      {text?.length > limit && (
        <button
          className="text-blue-500 hover:underline text-sm"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? "Read Less" : "Read More"}
        </button>
      )}
    </div>
  );
};

export default SocialReports;
