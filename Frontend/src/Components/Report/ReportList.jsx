import { useState, useContext } from "react";
import logo from "/logo.png";
import { UserContext } from "../../UserContext";

const ReportList = ({
  report,
  handleStateChange,
  handleDelete,
  handleCloseModal,
}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");
  const { role } = useContext(UserContext);

  const handleStateChangeAndCloseModal = async (e, reportId) => {
    await handleStateChange(e, reportId);
    handleCloseModal();
  };

  const handleDeleteAndCloseModal = async (reportId) => {
    await handleDelete(reportId);
    handleCloseModal();
  };

  const openModal = (image) => {
    setSelectedImage(image);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  const imagesArray = Array.isArray(report.image)
    ? report.image
    : [report.image];

  return (
    <>
    <title>View Report</title>

    <div key={report._id} className="bg-white rounded-lg shadow-lg p-6 mb-4">
      <div className="flex items-center mb-4">
        <img src={logo} alt="Logo" className="h-16 w-16 mr-4 rounded-full" />
        <div>
          <h3 className="text-lg font-semibold text-gray-800">{report.title}</h3>
          <p className="text-sm text-gray-500">Reporte hecho por: {report.createdBy}</p>
          <p className="text-sm text-gray-500">Fecha: {new Date(report.createdAt).toLocaleDateString()}</p>
        </div>
      </div>
      <div className="overflow-auto max-h-48 mb-4">
        <p className="text-gray-600 mb-4 max-w-[400px]">{report.description}</p>
      </div>
      {imagesArray && imagesArray.length > 0 && (
        <div className="mt-4">
          <div className="flex flex-wrap -mx-2">
            {imagesArray.map((image, index) => (
              <div key={index} className="w-1/2 sm:w-1/3 p-2">
                <img
                  src={image}
                  alt={`Report Image ${index + 1}`}
                  className="h-24 w-full object-cover rounded-lg cursor-pointer hover:opacity-75 transition-opacity"
                  onClick={() => openModal(image)}
                />
              </div>
            ))}
          </div>
        </div>
      )}
     {modalOpen && (
        <div className="fixed top-0 left-0 z-50 w-full h-full bg-black bg-opacity-50 flex items-center justify-center">
          <div className="relative max-w-full max-h-full">
            <button
              className="absolute top-2 right-2 bg-red-500 text-white px-4 py-2 rounded-lg"
              onClick={closeModal}
            >
              Cerrar
            </button>
            <img
              src={selectedImage}
              alt="Report Image"
              className="max-w-full max-h-full"
              style={{ maxHeight: "80vh", maxWidth: "80vw" }}
            />
          </div>
        </div>
      )}
      <div className="flex mt-6 items-center">
        {role === "admin" && (
          <select
            value={report.state}
            onChange={(e) => handleStateChangeAndCloseModal(e, report._id)}
            className="flex-1 p-2 mr-4 border rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          >
            <option value="PENDING">Pendiente</option>
            <option value="IN_PROGRESS">En Progreso</option>
            <option value="COMPLETED">Completado</option>
            <option value="CLOSED">Cerrado</option>
            <option value="REJECTED">Rechazado</option>
          </select>
        )}
        <button
          onClick={() => handleDeleteAndCloseModal(report._id)}
          className="bg-red-500 text-white px-4 py-2 rounded-lg mr-2 hover:bg-red-600 transition-colors"
        >
          Borrar
        </button>
        <button
          onClick={handleCloseModal}
          className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
        >
          Cerrar
        </button>
      </div>
    </div>
    </>
    
  );
};

export default ReportList;
