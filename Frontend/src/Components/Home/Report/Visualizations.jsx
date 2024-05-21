import React from "react";
import { useState } from "react";
import { Bar, Line } from "react-chartjs-2";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const Visualizations = ({ recentReports, pendingReportsCount, inProgressReportsCount, completedReportsCount }) => {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());

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
        data: [pendingReportsCount, inProgressReportsCount, completedReportsCount],
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
    <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
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
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getColorState(report.state)}`}>
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

        <div className="mt-10">
          <h1 className="text-2xl font-bold mb-4">Filter Reports by Date</h1>
          <DatePicker
            selected={startDate}
            onChange={handleDateChange}
            startDate={startDate}
            endDate={endDate}
            selectsRange
            inline
          />
        </div>
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
  );
};

export default Visualizations;
