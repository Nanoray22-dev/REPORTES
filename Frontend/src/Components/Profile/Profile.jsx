import { useEffect, useState } from "react";
import Navigation from "../Home/Navigation";
import axios from "axios";
// import Swal from "sweetalert2";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Profile({ username }) {
  const [user, setUser] = useState(null);
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
      // Swal.fire({
      //   position: "top-end",
      //   icon: "success",
      //   title: "Your work has been saved",
      //   showConfirmButton: false,
      //   timer: 1500,
      // });
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

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Navigation />
      <ToastContainer />
      <link
        href="//maxcdn.bootstrapcdn.com/bootstrap/4.1.1/css/bootstrap.min.css"
        rel="stylesheet"
        id="bootstrap-css"
      />
      <script src="//maxcdn.bootstrapcdn.com/bootstrap/4.1.1/js/bootstrap.min.js"></script>
      <script src="//cdnjs.cloudflare.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>
      {/* Include the above in your HEAD tag */}

      <div className="container">
        <div className="row">
          <div className="col-md-10">
            <h1>{username}</h1>
          </div>
        </div>
        <div className="row mt-4">
          <div className="col-md-3">
            <div className="text-center">
              <img
                src="http://ssl.gstatic.com/accounts/ui/avatar_2x.png"
                className="avatar img-circle img-thumbnail"
                alt="avatar"
              />
              <input
                type="file"
                className="text-center center-block file-upload"
              />
            </div>
            <hr />
            <ul className="list-group">
              <li className="list-group-item text-muted">
                Activity <i className="fa fa-dashboard fa-1x ml-2"></i>
              </li>
              <li className="list-group-item d-flex justify-content-between align-items-center">
                Shares{" "}
                <span className="badge badge-primary badge-pill">125</span>
              </li>
              <li className="list-group-item d-flex justify-content-between align-items-center">
                Likes <span className="badge badge-primary badge-pill">13</span>
              </li>
              <li className="list-group-item d-flex justify-content-between align-items-center">
                Posts <span className="badge badge-primary badge-pill">37</span>
              </li>
              <li className="list-group-item d-flex justify-content-between align-items-center">
                Followers{" "}
                <span className="badge badge-primary badge-pill">78</span>
              </li>
            </ul>
          </div>
          <div className="col-md-9">
            {loading && <div className="loading">Updating user data...</div>}

            <form className="mt-4" onSubmit={handleSubmit}>
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
              <div className="form-group row">
                <div className="col-sm-10 offset-sm-2">
                  <button type="submit" className="btn btn-success mr-2">
                    <i className="glyphicon glyphicon-ok-sign"></i> Save
                  </button>
                  <button type="reset" className="btn btn-secondary">
                    <i className="glyphicon glyphicon-repeat"></i> Reset
                  </button>
                </div>
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
