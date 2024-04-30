import logo from "../../public/logo.png"

const ReportList = ({
  report,
  handleStateChange,
  handleDelete,
  handleCloseModal,
}) => {
  const handleStateChangeAndCloseModal = async (e, reportId) => {
    await handleStateChange(e, reportId);
    handleCloseModal();
  };

  const handleDeleteAndCloseModal = async (reportId) => {
    await handleDelete(reportId);
    handleCloseModal();
  };
  

  return (
    <div key={report._id} className="bg-white rounded-lg shadow-lg p-8 mb-4">
      <div className="flex items-center mb-4">
        <img src={logo} alt="Logo" className="h-24 w-24 mr-4 rounded-full" />
        <div>
          <h3 className="text-lg font-semibold">{report.title}</h3>
          <p className="text-sm text-gray-500">
            Descripción del reporte: {report.createdBy}
          </p>
          <p className="text-sm text-gray-500">
            Fecha: {new Date(report.createdAt).toLocaleDateString()}
          </p>
        </div>
      </div>
      <div className="overflow-auto max-h-48">
        <p className="text-gray-600 mb-4 max-w-[400px]">{report.description}</p>
      </div>

      {report.image && (
        <div className="mt-4">
          <img
            src={report.image}
            alt="Report Image"
            className="h-48 w-full object-cover rounded-lg"
          />
        </div>
      )}

      <div className="flex mt-6">
        <select
          value={report.state}
          onChange={(e) => handleStateChangeAndCloseModal(e, report._id)}
          className="flex-1 p-2 mr-4 border rounded-md bg-gray-100"
        >
          <option value="PENDING">Pendiente</option>
          <option value="IN_PROGRESS">En Progreso</option>
          <option value="COMPLETED">Completado</option>
          <option value="CLOSED">Tardia</option>
          <option value="REJECTED">Rechazado</option>
        </select>
        <button
          onClick={() => handleDeleteAndCloseModal(report._id)}
          className="bg-red-500 text-white px-4 py-2 rounded-lg mr-2"
        >
          Borrar
        </button>
        <button
          onClick={handleCloseModal}
          className="bg-red-500 text-white px-4 py-2 rounded-lg"
        >
          Cerrar
        </button>
      </div>
    </div>
  );
};

export default ReportList;
