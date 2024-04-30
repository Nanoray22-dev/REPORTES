// reportController.js

const Report = require("../Models/Report");



// Controlador para borrar un reporte por su ID
const deleteReport = async (reportId) => {
  try {
    await Report.findByIdAndDelete(reportId);
    return { success: true, message: 'Report deleted successfully' };
  } catch (error) {
    console.error('Error deleting report:', error);
    throw new Error('Error deleting report');
  }
};

// Controlador para editar un reporte por su ID
const updateReport = async (reportId, updatedFields) => {
  try {
    const updatedReport = await Report.findByIdAndUpdate(reportId, updatedFields, { new: true });
    return updatedReport;
  } catch (error) {
    console.error('Error updating report:', error);
    throw new Error('Error updating report');
  }
};

module.exports = {
  deleteReport,
  updateReport,
};
