import { useState, useEffect } from "react";
import axios from "axios";
import Comments from "./Comments";
import Navigation from "../Home/Navigation";

const SocialReports = () => {
  const [reports, setReports] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [avatar, setAvatar] = useState(null);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await axios.get("/reports");
        const sortedReports = response.data.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setReports(sortedReports);
      } catch (error) {
        console.error("Error fetching reports:", error);
      }
    };

    fetchReports();
  }, []);

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
      <Navigation />
      <div className="container mx-auto p-4 max-w-3xl">
        <h1 className="text-2xl font-bold mb-4 text-gray-800">
          Social Reports
        </h1>
        <input
          type="text"
          placeholder="Search reports..."
          className="w-full mb-4 p-2 border border-gray-300 rounded-lg"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <div className="space-y-4">
          {filteredReports.map((report) => (
            <div
              key={report._id}
              className="p-4 bg-white shadow-md rounded-lg max-w-md mx-auto"
            >
              <div className="flex items-center mb-3">
                <img
                  src={
                    avatar
                      ? URL.createObjectURL(avatar)
                      : "http://ssl.gstatic.com/accounts/ui/avatar_2x.png"
                  }
                  alt="Profile"
                  className="w-8 h-8 rounded-full mr-2"
                />
                <div>
                  <h3 className="font-bold text-sm">
                    {report.createdBy}
                  </h3>
                  <p className="text-xs text-gray-600">
                    {new Date(report.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
              <h2 className="text-md font-semibold mb-1">{report.title}</h2>
              <div className="overflow-auto max-h-48">
                <Description text={report.description} />
              </div>
              {report.image && (
                <img
                  src={report.image}
                  alt="Report"
                  className="w-full max-h-60 object-cover mb-3 rounded-lg"
                />
              )}
              <Comments reportId={report._id} />
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default SocialReports;

const Description = ({ text }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const limit = 100; // Limit to 100 characters

  return (
    <div>
      <p className="mb-2 text-sm">
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
