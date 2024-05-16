import { useState, useEffect } from "react";
import axios from "axios";
import EditUserForm from "./UserEditForm";
import Navigation from "../Home/Navigation";
import { RiSearch2Line } from "react-icons/ri";
import { FaUserEdit } from "react-icons/fa";
import ColumnSelector from "./ColumnSelector";

const UserTable = () => {
  const [users, setUsers] = useState([]);
  const [editUserId, setEditUserId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState(null);

  const [selectedColumns, setSelectedColumns] = useState([
    "username",
    "email",
    "address",
    "phone",
    "age",
    "residenceType",
    "role",
  ]);

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

  const handleUserUpdated = (updatedUser) => {
    setUsers((prevUsers) =>
      prevUsers.map((user) => (user._id === updatedUser._id ? updatedUser : user))
    );
  };

  const handleSort = (field) => {
    if (sortBy === field) {
      setUsers([...users.reverse()]);
    } else {
      const sortedUsers = [...users].sort((a, b) =>
        a[field].localeCompare(b[field])
      );
      setUsers(sortedUsers);
      setSortBy(field);
    }
  };

  const filteredUsers = users.filter((user) =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleColumn = (column) => {
    setSelectedColumns((prevSelectedColumns) =>
      prevSelectedColumns.includes(column)
        ? prevSelectedColumns.filter((col) => col !== column)
        : [...prevSelectedColumns, column]
    );
  };

  return (
    <>
      <Navigation />
      <div className="container mx-auto">
        <div className="mb-4 flex p-2">
          <h2 className="text-2xl font-bold mt-4 uppercase">Residents</h2>

          <div className="relative ml-auto mt-4">
            <div className="relative">
              <RiSearch2Line className="absolute top-1/2 -translate-y-1/2 left-2" />
              <input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                type="text"
                className="bg-gray-200 outline-none py-2 pl-8 pr-4 rounded-xl w-full md:w-auto"
                placeholder={`Search by username`}
              />
            </div>
          </div>
        </div>

        <ColumnSelector
          selectedColumns={selectedColumns}
          onChange={toggleColumn}
        />

        <div className="max-h-[450px] overflow-y-auto">
          <table className="min-w-full bg-gray-50/50">
            <thead className="sticky top-0 bg-white">
              <tr>
                {selectedColumns.includes("username") && (
                  <th
                    className="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort("username")}
                  >
                    Username
                  </th>
                )}
                {selectedColumns.includes("email") && (
                  <th
                    className="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort("email")}
                  >
                    Email
                  </th>
                )}
                {selectedColumns.includes("address") && (
                  <th
                    className="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort("address")}
                  >
                    Address
                  </th>
                )}
                {selectedColumns.includes("phone") && (
                  <th
                    className="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort("phone")}
                  >
                    Phone
                  </th>
                )}
                {selectedColumns.includes("age") && (
                  <th
                    className="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort("age")}
                  >
                    Age
                  </th>
                )}
                {selectedColumns.includes("residenceType") && (
                  <th
                    className="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort("residenceType")}
                  >
                    Residence 
                  </th>
                )}
                {selectedColumns.includes("role") && (
                  <th
                    className="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort("role")}
                  >
                    Role
                  </th>
                )}
                <th className="px-6 py-3 bg-gray-50"></th>
              </tr>
            </thead>

            <tbody>
              {filteredUsers.map((user) => (
                <tr
                  key={user._id}
                  className="border-t border-gray-200 hover:bg-gray-300"
                >
                  {selectedColumns.includes("username") && (
                    <td className="px-6 py-4 whitespace-no-wrap">
                      {user.username}
                    </td>
                  )}
                  {selectedColumns.includes("email") && (
                    <td className="px-6 py-4 whitespace-no-wrap">{user.email}</td>
                  )}
                  {selectedColumns.includes("address") && (
                    <td className="px-6 py-4 whitespace-no-wrap">{user.address}</td>
                  )}
                  {selectedColumns.includes("phone") && (
                    <td className="px-6 py-4 whitespace-no-wrap">{user.phone}</td>
                  )}
                  {selectedColumns.includes("age") && (
                    <td className="px-6 py-4 whitespace-no-wrap">{user.age}</td>
                  )}
                  {selectedColumns.includes("residenceType") && (
                    <td className="px-6 py-4 whitespace-no-wrap">
                      {user.residenceType}
                    </td>
                  )}
                  {selectedColumns.includes("role") && (
                    <td className="px-6 py-4 whitespace-no-wrap">{user.role}</td>
                  )}
                  <td className="px-6 py-4 whitespace-no-wrap">
                    <button
                      onClick={() => openModal(user._id)}
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      <FaUserEdit className="text-xl" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div>
          <h4 className="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
            In total there are {users.length} users
          </h4>
        </div>

        {isModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-75">
            <div className="bg-white p-6 rounded-lg">
              <button onClick={closeModal} className="absolute  mb-24">
                Cerrar
              </button>
              <EditUserForm userId={editUserId} closeModal={closeModal} onUserUpdated={handleUserUpdated} />
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default UserTable;
