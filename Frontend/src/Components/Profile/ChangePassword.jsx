import { useState } from 'react';
import axios from 'axios';
import Navigation from '../Home/Navigation';
import { useNavigate } from 'react-router-dom'; // Importa useNavigate para la redirección

function ChangePassword() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [notification, setNotification] = useState(null);
  const navigate = useNavigate(); // Obtiene la función navigate para la redirección

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (newPassword !== confirmNewPassword) {
      setNotification('Las contraseñas no coinciden');
      return;
    }

    try {
      const response = await axios.post('/change-password', {
        currentPassword,
        newPassword,
      });
      setNotification(response.data.message);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
      // Redirige al perfil después de 2 segundos
      setTimeout(() => {
        navigate('/profile');
      }, 1500);
    } catch (error) {
      if (error.response) {
        setNotification(error.response.data.error);
      } else {
        setNotification('Error al procesar la solicitud. Inténtalo de nuevo más tarde.');
      }
    }
  };

  return (
    <>
      <Navigation />
      <div className="max-w-md mx-auto mt-8 p-6 bg-white shadow-md rounded-md">
        <h2 className="text-2xl font-bold mb-4">Cambiar Contraseña</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="currentPassword" className="block font-semibold">Contraseña Actual:</label>
            <input
              type="password"
              id="currentPassword"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:border-blue-500"
            />
          </div>
          <div>
            <label htmlFor="newPassword" className="block font-semibold">Nueva Contraseña:</label>
            <input
              type="password"
              id="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:border-blue-500"
            />
          </div>
          <div>
            <label htmlFor="confirmNewPassword" className="block font-semibold">Confirmar Nueva Contraseña:</label>
            <input
              type="password"
              id="confirmNewPassword"
              value={confirmNewPassword}
              onChange={(e) => setConfirmNewPassword(e.target.value)}
              required
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:border-blue-500"
            />
          </div>
          <button type="submit" className="w-full bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600">Cambiar Contraseña</button>
        </form>
        {notification && <p className="text-green-500 mt-4">{notification}</p>}
      </div>
    </>
  );
}

export default ChangePassword;
