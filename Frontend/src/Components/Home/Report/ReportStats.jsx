import React from "react";

const ReportStats = ({ pendingReportsCount, completedReportsCount, inProgressReportsCount }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md flex flex-col gap-6 hover:shadow-lg transition-transform transform hover:scale-105">
      <div className="flex items-center gap-4 bg-gray-100 rounded-lg p-4">
        <span className="bg-orange-500 text-white text-2xl font-bold p-4 rounded-lg">
          {pendingReportsCount}
        </span>
        <div>
          <h3 className="font-bold text-orange-500">Pending</h3>
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
        <span className="bg-blue-500 text-white text-2xl font-bold p-4 rounded-lg">
          {inProgressReportsCount}
        </span>
        <div>
          <h3 className="font-bold text-blue-500">Progress</h3>
          <p className="text-gray-500">this month</p>
        </div>
      </div>
    </div>
  );
};

export default ReportStats;
