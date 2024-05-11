import { useState, useEffect } from "react";
import axios from "axios";
import EditUserForm from "./UserEditForm";
import Navigation from "../Home/Navigation";
import { RiSearch2Line } from "react-icons/ri";

const UserTable = () => {
  const [users, setUsers] = useState([]);
  const [editUserId, setEditUserId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState(null);

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

  const filteredUsers = users.filter((user) =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

  return (
    <>
      <Navigation />
      <div className="container mx-auto ">
        <div className=" mb-4 flex  p-2">
          <h2 className="text-2xl font-bold mt-4 uppercase">Residents</h2>

          <div className="relative ml-auto mt-4">
            <RiSearch2Line className="absolute top-1/2 -translate-y-1/2 left-2" />
            <input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              type="text"
              className="bg-gray-200 outline-none py-2 pl-8 pr-4 rounded-xl w-full md:w-auto"
              placeholder="Search for username"
            />
          </div>
        </div>
        <div className="max-h-[450px] overflow-y-auto">
          <table className="min-w-full">
            <thead className="sticky top-0 bg-white">
              <tr>
                <th
                  className="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider cursor-pointer flex gap-2"
                  onClick={() => handleSort("username")}
                >
                  Username
                </th>
                <th
                  className="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort("email")}
                >
                  Email
                </th>
                <th
                  className="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort("address")}
                >
                  Address
                </th>
                <th
                  className="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort("phone")}
                >
                  Phone
                </th>
                <th
                  className="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort("age")}
                >
                  Age
                </th>
                <th
                  className="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort("residenceType")}
                >
                  Residence
                </th>
                <th
                  className="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort("role")}
                >
                  Role
                </th>

                <th className="px-6 py-3 bg-gray-50"></th>
              </tr>
            </thead>

            <tbody className="">
              {filteredUsers.map((user) => (
                <tr
                  key={user._id}
                  className="border-t border-gray-200 hover:bg-gray-300"
                >
                  <td className="px-6 py-4 whitespace-no-wrap">
                    {user.username}
                  </td>
                  <td className="px-6 py-4 whitespace-no-wrap">{user.email}</td>
                  <td className="px-6 py-4 whitespace-no-wrap">
                    {user.address}
                  </td>
                  <td className="px-6 py-4 whitespace-no-wrap">{user.phone}</td>
                  <td className="px-6 py-4 whitespace-no-wrap">{user.age}</td>
                  <td className="px-6 py-4 whitespace-no-wrap">
                    {user.residenceType}
                  </td>
                  <td className="px-6 py-4 whitespace-no-wrap">{user.role}</td>

                  <td className="px-6 py-4 whitespace-no-wrap">
                    <button
                      onClick={() => openModal(user._id)}
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      Editar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div>
          <h4 className="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
            In total there are {users.length} user
          </h4>
        </div>

        {isModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-75">
            <div className="bg-white p-6 rounded-lg">
              <button onClick={closeModal} className="absolute  mb-24  ">
                Cerrar
              </button>
              <EditUserForm userId={editUserId} closeModal={closeModal} />
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default UserTable;
