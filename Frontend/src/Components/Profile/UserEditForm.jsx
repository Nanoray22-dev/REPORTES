import { useState, useEffect } from "react";
import axios from "axios";

const EditUserForm = ({ userId }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        if (!userId) {
          return; // Salir de la función si userId es null o undefined
        }
        const response = await axios.get(`/users/${userId}`); // Verificar la URL según tu configuración
        console.log("Response from API:", response); // Depurar la respuesta de la API
        setUser(response.data);
        console.log("User data:", response.data); // Depurar los datos del usuario
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    fetchUser();
  }, [userId]); // Agregar userId como dependencia para que se vuelva a cargar cuando cambie

  const handleSubmit = async (event) => {
    event.preventDefault();
  
    try {
      const response = await axios.put(`/users/${userId}`, user);
      console.log("User updated successfully:", response.data);
      // Agregar cualquier lógica adicional después de la actualización exitosa
    } catch (error) {
      console.error("Error updating user:", error);
      // Agregar lógica para manejar errores de actualización
    }
  };

  if (!user) {
    return <div>Loading...</div>; // Mostrar un mensaje de carga mientras se obtienen los datos del usuario
  }

  // Verificar si user es null antes de acceder a sus propiedades
  return (
    <div>
      <h2>Editar Usuario</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="username">Username:</label>
        <input
          type="text"
          id="username"
          name="username"
          value={user.username || ""}
          onChange={(event) => setUser({ ...user, username: event.target.value })}
        />
        <label htmlFor="email">Email:</label>
        <input
          type="email"
          id="email"
          name="email"
          value={user.email || ""}
          onChange={(event) => setUser({ ...user, email: event.target.value })}
        />
        <label htmlFor="address">Address:</label>
        <input
          type="text"
          id="address"
          name="address"
          value={user.address || ""}
          onChange={(event) => setUser({ ...user, address: event.target.value })}
        />
        <label htmlFor="phone">Phone:</label>
        <input
          type="tel"
          id="phone"
          name="phone"
          value={user.phone || ""}
          onChange={(event) => setUser({ ...user, phone: event.target.value })}
        />
        <label htmlFor="age">Age:</label>
        <input
          type="number"
          id="age"
          name="age"
          value={user.age || ""}
          onChange={(event) => setUser({ ...user, age: event.target.value })}
        />
        <label htmlFor="residenceType">Residence Type:</label>
        <select
          id="residenceType"
          name="residenceType"
          value={user.residenceType || ""}
          onChange={(event) => setUser({ ...user, residenceType: event.target.value })}
        >
          <option value="casa">Casa</option>
          <option value="apartamento">Apartamento</option>
          <option value="duplex">duplex</option>
          <option value="no residente">no residente</option>

          {/* Agregar más opciones según sea necesario */}
        </select>
        <button type="submit">Guardar Cambios</button>
      </form>
    </div>
  );
};

export default EditUserForm;
