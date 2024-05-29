import { useState, useEffect } from "react";
import axios from "axios";
import EditUserForm from "./UserEditForm";
import Navigation from "../Home/Navigation";
import { RiSearch2Line } from "react-icons/ri";
import { FaUserEdit } from "react-icons/fa";
import Selector from "./Selector";

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
        const response = await axios.get("https://backoasis-production.up.railway.app/users");
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

  const handleColumnChange = (selectedColumns) => {
    setSelectedColumns(selectedColumns);
  };

  return (
<>
  <title>Residents</title>
  
  <Navigation />
  <div className="container mx-auto px-4 sm:px-6 lg:px-8">
    <div className="mb-4 flex flex-wrap items-center p-2">
      <h2 className="text-2xl font-bold mt-4 uppercase">Residents</h2>
  
      <div className="relative ml-auto mt-4 flex items-center gap-2">
        <div className="relative flex-1 min-w-0 md:w-auto">
          <RiSearch2Line className="absolute top-1/2 -translate-y-1/2 left-2" />
          <input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            type="text"
            className="bg-gray-200 outline-none py-2 pl-8 pr-4 rounded-xl w-full md:w-auto"
            placeholder="Search by username"
          />
        </div>
  
        <Selector
          selectedColumns={selectedColumns}
          onChange={handleColumnChange}
        />
      </div>
    </div>
  
    <div className="max-h-[450px] overflow-y-auto">
      <table className="min-w-full bg-gray-50/50">
        <thead className="sticky top-0 bg-white">
          <tr>
            {selectedColumns.includes("username") && (
              <th
                className="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider cursor-pointer "
                onClick={() => handleSort("username")}
              >
                Username
              </th>
            )}
            {selectedColumns.includes("email") && (
              <th
                className="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider cursor-pointer hidden md:table-cell"
                onClick={() => handleSort("email")}
              >
                Email
              </th>
            )}
            {selectedColumns.includes("address") && (
              <th
                className="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider cursor-pointer hidden md:table-cell"
                onClick={() => handleSort("address")}
              >
                Address
              </th>
            )}
            {selectedColumns.includes("phone") && (
              <th
                className="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider cursor-pointer hidden md:table-cell"
                onClick={() => handleSort("phone")}
              >
                Phone
              </th>
            )}
            {selectedColumns.includes("age") && (
              <th
                className="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider cursor-pointer hidden md:table-cell"
                onClick={() => handleSort("age")}
              >
                Age
              </th>
            )}
            {selectedColumns.includes("residenceType") && (
              <th
                className="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider cursor-pointer hidden md:table-cell"
                onClick={() => handleSort("residenceType")}
              >
                Residence Type
              </th>
            )}
            {selectedColumns.includes("role") && (
              <th
                className="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider cursor-pointer hidden md:table-cell"
                onClick={() => handleSort("role")}
              >
                Role
              </th>
            )}
            <th className="px-6 py-3 bg-gray-50"></th>
          </tr>
        </thead>
  
        <tbody>
          {filteredUsers.reverse().map((user) => (
            <tr
              key={user._id}
              className="border-t border-gray-200 hover:bg-gray-300"
            >
              {selectedColumns.includes("username") && (
                <td className="px-6 py-4 whitespace-nowrap">
                  {user.username}
                </td>
              )}
              {selectedColumns.includes("email") && (
                <td className="px-6 py-4 whitespace-nowrap hidden md:table-cell">
                  {user.email ? user.email : "No Email"}
                </td>
              )}
              {selectedColumns.includes("address") && (
                <td className="px-6 py-4 whitespace-nowrap hidden md:table-cell">
                  {user.address ? user.address : "No address"}
                </td>
              )}
              {selectedColumns.includes("phone") && (
                <td className="px-6 py-4 whitespace-nowrap hidden md:table-cell">
                  {user.phone ? user.phone : "No Phone"}
                </td>
              )}
              {selectedColumns.includes("age") && (
                <td className="px-6 py-4 whitespace-nowrap hidden md:table-cell">
                  {user.age}
                </td>
              )}
              {selectedColumns.includes("residenceType") && (
                <td className="px-6 py-4 whitespace-nowrap hidden md:table-cell">
                  {user.residenceType}
                </td>
              )}
              {selectedColumns.includes("role") && (
                <td className="px-6 py-4 whitespace-nowrap hidden md:table-cell">
                  {user.role}
                </td>
              )}
              <td className="px-6 py-4 whitespace-nowrap">
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
        <div className="bg-white p-6 rounded-lg relative max-w-lg mx-auto">
          <button
            onClick={closeModal}
            className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
          >
            Close
          </button>
          <EditUserForm
            userId={editUserId}
            closeModal={closeModal}
            onUserUpdated={handleUserUpdated}
          />
        </div>
      </div>
    )}
  </div>
</>

  );
};

export default UserTable;
