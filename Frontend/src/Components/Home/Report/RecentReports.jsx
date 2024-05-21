import React from "react";
import { Link } from "react-router-dom";

const RecentReports = ({ reports, handleReview, recentReports }) => {
  return (
    <div className="col-span-1 md:col-span-2 flex flex-col justify-evenly">
      <h1 className="text-2xl font-bold">
        New reports to review{" "}
        <span className="bg-gray-300 rounded-full py-1 px-3">{reports.length}</span>
      </h1>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="max-h-60 overflow-y-scroll">
          {reports.length > 0 ? (
            reports.map((report) => (
              <div
                key={report._id}
                className="bg-gray-100 p-4 rounded-lg mb-4 border border-gray-300"
              >
                <p className="text-gray-600">Reported by: {report.createdBy}</p>
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
  );
};

export default RecentReports;
