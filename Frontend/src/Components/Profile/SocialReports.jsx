import { useState, useEffect } from 'react';
import axios from 'axios';
import Comments from './Comments';
import Navigation from '../Home/Navigation';

const SocialReports = () => {
  const [reports, setReports] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);
  const [comments, setComments] = useState([]);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await axios.get('/report');
        setReports(response.data);
      } catch (error) {
        console.error('Error fetching reports:', error);
      }
    };

    fetchReports();
  }, []);

  const handleViewReport = async (reportId) => {
    try {
      const response = await axios.get(`/report/${reportId}`);
      setSelectedReport(response.data);
      setComments(response.data.comments);
    } catch (error) {
      console.error('Error fetching report details:', error);
    }
  };

  return (
    <>
  <Navigation/>
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-extrabold mb-6 text-gray-800">Social Reports</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
          <thead className="bg-gray-800 text-white">
            <tr>
              <th className="w-1/3 py-3 px-4 text-left">Title</th>
              <th className="w-1/3 py-3 px-4 text-left">Created By</th>
              <th className="w-1/3 py-3 px-4 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {reports.map((report) => (
              <tr key={report._id} className="border-b hover:bg-gray-100">
                <td className="py-3 px-4">{report.title}</td>
                <td className="py-3 px-4">{report.createdBy}</td>
                <td className="py-3 px-4 text-center">
                  <button
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-600 transition duration-200"
                    onClick={() => handleViewReport(report._id)}
                  >
                    View Report
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedReport && (
        <div className="mt-8 p-6 bg-gray-100 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4">Report Details</h2>
          <p className="mb-2"><strong>Title:</strong> {selectedReport.title}</p>
          <p className="mb-2"><strong>Description:</strong> {selectedReport.description}</p>
          <p className="mb-2"><strong>Created By:</strong> {selectedReport.createdBy.username}</p>
          <h3 className="text-xl font-semibold mt-6 mb-4">Comments</h3>
          <Comments
            reportId={selectedReport._id}
            comments={comments}
            setComments={setComments}
          />
        </div>
      )}
    </div>
    </>
  
  );
};

export default SocialReports;
