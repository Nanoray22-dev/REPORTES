import { useState, useEffect } from 'react';
import axios from 'axios';
import Comments from './Comments';
import Navigation from '../Home/Navigation';

const SocialReports = () => {
  const [reports, setReports] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);
  const [comments, setComments] = useState([]);
  const [avatar, setAvatar] = useState(null);
  

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
      <Navigation />
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-extrabold mb-6 text-gray-800">Social Reports</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {reports.map((report) => (
            <div key={report._id} className="bg-white shadow-md rounded-lg overflow-hidden">
              <div className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                  <img
                  src={
                    avatar
                      ? URL.createObjectURL(avatar)
                      : "http://ssl.gstatic.com/accounts/ui/avatar_2x.png"
                  } alt="User Profile" className="h-8 w-8 rounded-full mr-2" />
                    <span className="text-sm font-semibold">{report.createdBy}</span>
                  </div>
                  <button
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-600 transition duration-200"
                    onClick={() => handleViewReport(report._id)}
                  >
                    View Report
                  </button>
                </div>
                <h2 className="text-lg font-semibold mb-2">{report.title}</h2>
                <p className="text-gray-700">{report.description}</p>
              </div>
              {report.image && (
                <img src={report.image} alt="Report Image" className="w-full h-48 object-cover" />
              )}
            </div>
          ))}
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
