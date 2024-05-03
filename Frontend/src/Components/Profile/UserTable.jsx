import { useState, useEffect } from "react";
import axios from "axios";
import EditUserForm from "./UserEditForm";
import Navigation from "../Home/Navigation";


const UserTable = () => {
  const [users, setUsers] = useState([]);
  const [editUserId, setEditUserId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("/users");
        setUsers(response.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);


  
  const openModal = (userId) => {
    setEditUserId(userId);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setEditUserId(null);
    setIsModalOpen(false);
  };

  return (
    <>
    <Navigation   />
    <div className="container mx-auto">
      <h2 className="text-2xl font-bold mb-4">Lista de Usuarios</h2>
      <table className="min-w-full">
        <thead>
          <tr>
            <th className="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">Username</th>
            <th className="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">Email</th>
            <th className="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">Address</th>
            <th className="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">Phone</th>
            <th className="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">Age</th>
            <th className="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">Residence Type</th>
            <th className="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">Role</th>

            <th className="px-6 py-3 bg-gray-50"></th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id} className="border-t border-gray-200">
              <td className="px-6 py-4 whitespace-no-wrap">{user.username}</td>
              <td className="px-6 py-4 whitespace-no-wrap">{user.email}</td>
              <td className="px-6 py-4 whitespace-no-wrap">{user.address}</td>
              <td className="px-6 py-4 whitespace-no-wrap">{user.phone}</td>
              <td className="px-6 py-4 whitespace-no-wrap">{user.age}</td>
              <td className="px-6 py-4 whitespace-no-wrap">{user.residenceType}</td>
              <td className="px-6 py-4 whitespace-no-wrap">{user.role}</td>


              <td className="px-6 py-4 whitespace-no-wrap">
                <button onClick={() => openModal(user._id)} className="text-indigo-600 hover:text-indigo-900">Editar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {isModalOpen && <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-75">
        <div className="bg-white p-6 rounded-lg">
          <button onClick={closeModal} className="absolute  mb-24  ">Cerrar</button>
          <EditUserForm userId={editUserId} closeModal={closeModal}/>
        </div>
      </div>}
    </div>
    </>
  );
};

export default UserTable;
