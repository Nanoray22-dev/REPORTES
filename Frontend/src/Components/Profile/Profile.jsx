import { useEffect, useState } from "react";
import Navigation from "../Home/Navigation";
import axios from "axios";
import "../Styles/Loader.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { HiCamera } from "react-icons/hi";
import { Menu, Button, Text, rem } from "@mantine/core";
import {
  IconSettings,
  IconSearch,
  IconPhoto,
  IconMessageCircle,
  IconTrash,
  IconArrowsLeftRight,
} from "@tabler/icons-react";
import { Link } from "react-router-dom";

function Profile({ username, setIsLoggedIn }) {
  const [user, setUser] = useState(null);
  const [avatar, setAvatar] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token"); // Obtener el token de localStorage o de donde lo almacenes
        const response = await axios.get("/user", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUser(response.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  const notifySuccess = () => toast.success("User data updated successfully");
  const notifyError = () => toast.error("Error updating user data");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      await axios.put(`/users/${user._id}`, user, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("User data updated successfully");
      setShowAlert(true);
      notifySuccess();
    } catch (error) {
      console.error("Error updating user data:", error);
      notifyError();
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setUser({ ...user, [name]: value });
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Realizar acciones con el archivo, como subirlo al servidor o previsualizarlo
      setAvatar(file);
    }
  };

  if (!user) {
    return (
      <div className="grid place-items-center h-screen">
        <div className="loader"></div>
      </div>
    );
  }

  return (
    <>
      <Navigation setIsLoggedIn={setIsLoggedIn}  />
      <ToastContainer />

      {/* Include the above in your HEAD tag */}
      <div className="container mx-auto py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Avatar y Estadísticas */}
          <div className="md:col-span-1  rounded-md shadow-md bg-blue-50">
            <div className="p-8">
              <Menu shadow="md" width={200}>
                <Menu.Target>
                  <Button>My Actions</Button>
                </Menu.Target>

                <Menu.Dropdown>
                  <Menu.Label>Application</Menu.Label>
                  <Menu.Item
                    leftSection={
                      <IconSettings
                        style={{ width: rem(14), height: rem(14) }}
                      />
                    }
                  >
                    Change my password
                  </Menu.Item>
                  <Menu.Item
                    leftSection={
                      <IconMessageCircle
                        style={{ width: rem(14), height: rem(14) }}
                      />
                    }
                  >
                    <Link className="text-black hover:text-black" to={'/chat'}>
                     Messages
                    </Link>
                  </Menu.Item>
                 
                 

                  <Menu.Divider />

                  <Menu.Label>Danger zone</Menu.Label>
                  <Menu.Item
                    leftSection={
                      <IconArrowsLeftRight
                        style={{ width: rem(14), height: rem(14) }}
                      />
                    }
                  >
                    Transfer my data
                  </Menu.Item>
                  <Menu.Item
                    color="red"
                    leftSection={
                      <IconTrash style={{ width: rem(14), height: rem(14) }} />
                    }
                  >
                    Delete my account
                  </Menu.Item>
                </Menu.Dropdown>
              </Menu>
              <div className="p-8 relative">
                <img
                  src={
                    avatar
                      ? URL.createObjectURL(avatar)
                      : "http://ssl.gstatic.com/accounts/ui/avatar_2x.png"
                  }
                  className="w-32 h-32 mx-auto rounded-full mb-4"
                  alt="avatar"
                />
                <label
                  htmlFor="fileInput"
                  className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 flex items-center justify-center cursor-pointer bg-white rounded-full p-2 shadow-md"
                >
                  <HiCamera className="w-6 h-6 text-gray-600" />
                  <input
                    type="file"
                    id="fileInput"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                </label>
              </div>
              <hr className="my-6" />
              <ul className="list-none p-0">
                <li className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span>Activity</span>
                  <span className="badge bg-blue-500 text-white rounded-full px-3 py-1">
                    125
                  </span>
                </li>
                <li className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span>Shares</span>
                  <span className="badge bg-blue-500 text-white rounded-full px-3 py-1">
                    13
                  </span>
                </li>
                <li className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span>Likes</span>
                  <span className="badge bg-blue-500 text-white rounded-full px-3 py-1">
                    37
                  </span>
                </li>
                <li className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span>Followers</span>
                  <span className="badge bg-blue-500 text-white rounded-full px-3 py-1">
                    78
                  </span>
                </li>
              </ul>
            </div>
          </div>

          {/* Formulario de Perfil */}
          <div className="md:col-span-2 bg-white rounded-md shadow-md p-8">
            {loading && (
              <div className="text-center text-gray-600 mb-4">
                Updating user data...
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="form-group row">
                <label htmlFor="username" className="col-sm-2 col-form-label">
                  Full Name:
                </label>
                <div className="col-sm-10">
                  <input
                    type="text"
                    className="form-control"
                    id="username"
                    name="username"
                    value={user.username}
                    onChange={handleChange}
                    placeholder="Full Name"
                  />
                </div>
              </div>
              <div className="form-group row">
                <label htmlFor="email" className="col-sm-2 col-form-label">
                  Email:
                </label>
                <div className="col-sm-10">
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    name="email"
                    value={user.email}
                    onChange={handleChange}
                    placeholder="Email"
                  />
                </div>
              </div>
              <div className="form-group row">
                <label htmlFor="phone" className="col-sm-2 col-form-label">
                  Phone:
                </label>
                <div className="col-sm-10">
                  <input
                    type="text"
                    className="form-control"
                    id="phone"
                    name="phone"
                    value={user.phone}
                    onChange={handleChange}
                    placeholder="Phone"
                  />
                </div>
              </div>
              <div className="form-group row">
                <label htmlFor="address" className="col-sm-2 col-form-label">
                  Address:
                </label>
                <div className="col-sm-10">
                  <input
                    type="text"
                    className="form-control"
                    id="address"
                    name="address"
                    value={user.address}
                    onChange={handleChange}
                    placeholder="Address"
                  />
                </div>
              </div>
              <div className="form-group row">
                <label htmlFor="age" className="col-sm-2 col-form-label">
                  Age:
                </label>
                <div className="col-sm-10">
                  <input
                    type="text"
                    className="form-control"
                    id="age"
                    name="age"
                    value={user.age}
                    onChange={handleChange}
                    placeholder="Age"
                  />
                </div>
              </div>
              <div className="form-group row">
                <label
                  htmlFor="type_residence"
                  className="col-sm-2 col-form-label"
                >
                  Residence Type:
                </label>
                <div className="col-sm-10">
                  <select
                    id="residenceType"
                    name="residenceType"
                    value={user.residenceType}
                    onChange={handleChange}
                    className="mt-1 block w-full border-gray-300 rounded-md form-control"
                  >
                    <option value="casa">Casa</option>
                    <option value="apartamento">Apartamento</option>
                    <option value="duplex">Duplex</option>
                    <option value="no residente">No Residente</option>
                  </select>
                </div>
              </div>
              <div className="form-group row">
                <label htmlFor="role" className="col-sm-2 col-form-label">
                  Role:
                </label>
                <div className="col-sm-10">
                  <select
                    id="role"
                    name="role"
                    value={user.role}
                    onChange={handleChange}
                    className="mt-1 block w-full border-gray-300 rounded-md form-control"
                  >
                    <option value="admin">Admin</option>
                    <option value="usuario">Usuario</option>{" "}
                  </select>
                </div>
              </div>

              {/* Agregar más campos de formulario aquí */}

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="bg-blue-500 text-white py-2 px-6 rounded-md mr-2 hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
                >
                  Save
                </button>
                <button
                  type="reset"
                  className="bg-gray-300 text-gray-700 py-2 px-6 rounded-md hover:bg-gray-400 focus:outline-none focus:bg-gray-400"
                >
                  Reset
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* /.container */}
    </>
  );
}

export default Profile;
