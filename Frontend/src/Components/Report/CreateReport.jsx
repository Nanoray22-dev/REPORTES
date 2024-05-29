import { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

const CreateReport = ({ onSubmit, onCloseModal }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState([]);
  const [incidentDate, setIncidentDate] = useState("");
  const [reports, setReports] = useState([]);
  const [selectedState] = useState("PENDING");

  const handleSubmit = async () => {
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("state", selectedState);
      formData.append("image", image);
      formData.append("incidentDate", incidentDate);

      const response = await axios.post("https://backoasis-production.up.railway.app/report", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("Report created:", response.data);

      setReports([...reports, response.data]);
      Swal.fire({
        title: "Reporte creado",
        text: "El reporte se ha creado con éxito",
        icon: "success",
        showConfirmButton: false,
        timer: 1500,
      });


      setTitle("");
      setDescription("");
      setImage(null);
      setIncidentDate("");

      onSubmit(response.data);
      onCloseModal();
    } catch (error) {
      console.error("Error creating report:", error);
      Swal.fire("Error", "Ha ocurrido un error al crear el reporte", "error");
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
  };
  
  

  return (
    <div className="fixed inset-0 z-10 flex items-center justify-center overflow-x-auto overflow-y-auto bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-lg">
        <h2 className="text-2xl font-semibold mb-8 text-center">
          Crear Reporte
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4 p-4 mb-4 px-8">
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700"
            >
              Título:
            </label>
            <input
              className="title bg-gray-100 border border-gray-300 p-2 mb-4 w-full rounded-md outline-none"
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700"
            >
              Descripción:
            </label>
            <textarea
              className="description bg-gray-100 sec p-3 h-32 border border-gray-300 rounded-md outline-none min-w-full"
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              placeholder="Describe todo sobre este reporte aquí"
            ></textarea>
          </div>
          <div>
            <div className="mt-1 flex justify-between items-center rounded-md shadow-sm">
              <label id="select-image">
                <svg
                  className="mr-2 cursor-pointer hover:text-gray-700 border rounded-full p-1 h-7"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                  />
                </svg>
                <input
                  id="image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
              <div className="count ml-auto text-gray-400 text-xs font-semibold">0/300</div>
            </div>
          </div>
          {image && image instanceof File && (
            <div className="flex items-center">
              <img
                src={URL.createObjectURL(image)}
                alt="Vista previa de la imagen"
                className="w-20 h-20 object-cover rounded-md"
              />
              <p className="ml-2 text-sm text-gray-600">{image.name}</p>
            </div>
          )}
          <div>
            <label
              htmlFor="incidentDate"
              className="block text-sm font-medium text-gray-700"
            >
              Fecha de la incidencia:
            </label>
            <input
              type="date"
              id="incidentDate"
              value={incidentDate}
              onChange={(e) => setIncidentDate(e.target.value)}
              required
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg mr-2 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-100"
            >
              Crear Reporte
            </button>
            <button
              onClick={onCloseModal}
              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-100"
            >
              Cerrar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateReport;
