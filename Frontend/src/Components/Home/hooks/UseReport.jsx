import  { useState } from "react";

function UseReport() {
  const [pendingReportsCount, setPendingReportsCount] = useState(0);
  const [inProgressReportsCount, setInProgressReportsCount] = useState(0);
  const [completedReportsCount, setCompletedReportsCount] = useState(0);
  const [totalReportsCount, setTotalReportsCount] = useState(0);
  const [reports, setReports] = useState([]);
  const [reportsByDay, setReportsByDay] = useState({});
  const [reportsByWeek, setReportsByWeek] = useState({});
  const [reportsByMonth, setReportsByMonth] = useState({});
  return {
    pendingReportsCount,
    setPendingReportsCount,
    inProgressReportsCount,
    setInProgressReportsCount,
    completedReportsCount,
    setCompletedReportsCount,
    totalReportsCount,
    setTotalReportsCount,
    reports,
    setReports,
    reportsByDay,
    setReportsByDay,
    reportsByWeek,
    setReportsByWeek,
    reportsByMonth,
    setReportsByMonth,
  };
}

export default UseReport;
