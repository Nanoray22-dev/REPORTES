import { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

const CreateReport = ({ onSubmit, onCloseModal }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState([]);
  const [incidentDate, setIncidentDate] = useState("");
  const [, setRedirect] = useState(false);
  const [reports, setReports] = useState([]);
  const [selectedState] = useState("PENDING");

  const handleSubmit = async ({ onCloseModal }) => {
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("state", selectedState);
      formData.append("image", image);
      formData.append("incidentDate", incidentDate);

      const response = await axios.post("/report", formData, {
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
        timer: 1000,
      });

      setRedirect(true);
      setTitle("");
      setDescription("");
      setImage(null);
      onCloseModal();
      setIncidentDate("");

      onSubmit();
      onCloseModal();
    } catch (error) {
      console.error("Error creating report:", error);
      Swal.fire("Error", "Ha ocurrido un error al crear el reporte", "error");
    }
  };

  return (
    <div className="fixed inset-0 z-10 flex items-center justify-center overflow-x-auto overflow-y-auto bg-black bg-opacity-50">
      <div className="flex justify-center items-center h-screen">
        <div className="bg-white  rounded-lg shadow-lg p-24 w-full max-w-lg">
          <h2 className="text-2xl font-semibold mb-8 mr-8">Crear Reporte</h2>
          <form
            onSubmit={(e) => handleSubmit(e)}
            className="space-y-4 p-4 mb-4 px-8"
          >
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-700"
              >
                Título:
              </label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
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
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              ></textarea>
            </div>
            <div>
              <label
                htmlFor="image"
                className="block text-sm font-medium text-gray-700"
              >
                Imagen:
              </label>
              <div className="mt-1 flex justify-between items-center  rounded-md shadow-sm">
                <label
                  htmlFor="image"
                  className="cursor-pointer bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Seleccionar Archivo
                </label>
                <input
                  id="image"
                  type="file"
                  accept="image"
                  onChange={(e) => setImage(e.target.files[0])}
                  multiple
                  className="hidden"
                />
              </div>
            </div>

              <p>Se han seleccionado {image.length } imágenes.</p>

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
    </div>
  );
};

export default CreateReport;
