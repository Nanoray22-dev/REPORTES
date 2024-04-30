import { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

const CreateReport = ({ onSubmit, onCloseModal }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
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
    <div className="fixed inset-0 z-10 flex items-center justify-center overflow-x-auto overflow-y-auto outline-none focus:outline-none">
      <div className="flex justify-center items-center h-screen">
        <div className="bg-white rounded-lg shadow-md p-8">
          <form onSubmit={(e) => handleSubmit(e)}>
            <div>
              <label htmlFor="title">Título:</label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            <div>
              <label htmlFor="description">Descripción:</label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              ></textarea>
            </div>
            <div>
              <label htmlFor="image">Imagen:</label>
              <input
                type="file"
                id="image"
                accept="image"
                onChange={(e) => setImage(e.target.files[0])}
                multiple
                
              />
            </div>
            <div>
              <label htmlFor="incidentDate">Fecha de la incidencia:</label>
              <input
                type="date"
                id="incidentDate"
                value={incidentDate}
                onChange={(e) => setIncidentDate(e.target.value)}
                required
              />
            </div>
            <button type="submit">Crear Reporte</button>
          </form>
          <button
            onClick={onCloseModal}
            className="bg-red-500 text-white px-4 py-2 rounded-lg mt-4"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateReport;
