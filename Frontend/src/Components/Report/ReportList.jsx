import { useState } from "react";
import logo from "../../../public/logo.png"

const ReportList = ({
  report,
  handleStateChange,
  handleDelete,
  handleCloseModal,
}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");
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
  
  const imagesArray = Array.isArray(report.image) ? report.image : [report.image];
  
  return (
    <div key={report._id} className="bg-white rounded-lg shadow-lg p-8 mb-4">
      <div className="flex items-center mb-4">
        <img src={logo} alt="Logo" className="h-24 w-24 mr-4 rounded-full" />
        <div>
          <h3 className="text-lg font-semibold">{report.title}</h3>
          <p className="text-sm text-gray-500">
             Reporte hecho por: {report.createdBy}
          </p>
          <p className="text-sm text-gray-500">
            Fecha: {new Date(report.createdAt).toLocaleDateString()}
          </p>
        </div>
      </div>
      <div className="overflow-auto max-h-48">
        <p className="text-gray-600 mb-4 max-w-[400px]">{report.description}</p>
      </div>

      {imagesArray && imagesArray.length > 0 && (
        <div className="mt-4">
          <div className="flex flex-wrap -mx-2">
            {imagesArray.map((image, index) => (
              <div key={index} className="w-full  p-2">
                <img
                  src={image}
                  alt={`Report Image ${index + 1}`}
                  className="h-24 w-full object-cover rounded-lg cursor-pointer"
                  onClick={() => openModal(image)}
                />
              </div>
            ))}
            <div className="w-full p-2 text-center">
              <p className="text-blue-500 hover:underline cursor-pointer" onClick={() => {/* Aquí puedes implementar la lógica para ver más imágenes */}}>
                Ver más fotos ({imagesArray.length})
              </p>
            </div>
          </div>
        </div>
      )}

      {modalOpen && (
        <div className="fixed top-0 left-0 z-50 w-full h-full bg-black bg-opacity-50 flex items-center justify-center">
          <div className="relative max-w-full max-h-full">
            <button className="absolute top-2 right-2 bg-red-500 text-white px-4 py-2 rounded-lg" onClick={closeModal}>
              Cerrar
            </button>
            <img src={selectedImage} alt="Report Image" className="max-w-full max-h-full" style={{ maxHeight: '80vh', maxWidth: '80vw' }} />
          </div>
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