import { Link } from "react-router-dom";
import "./Access.css";
import "./reset.css";
import "./media-query.css";
import toy from "/undraw_safe_re_kiil.svg";
import Navigation from "../Home/Navigation";
import { FaArrowLeft } from "react-icons/fa";
import { useContext } from "react";
import { UserContext } from "../../UserContext";
function AccessDeniedPage() {
  const { role } = useContext(UserContext);

  return (
    <>
      <title>Acces Denied</title>
      <Navigation />
      <main className="wrapper">
        <div className="wrapper__tittle"></div>
        <div className="wrapper__content">
          <div className="wrapper__content-img">
            <img className="img" src={toy} alt="" />
          </div>
          <div className="wrapper__content-info">
            <h4 className="info__title">Access Denied</h4>
            <p className="info__paragraph">
              The page you are looking for might be temporarily unavailable
            </p>
            <div className=" flex gap-1  justify-end">
              <FaArrowLeft className="mt-1" />
              <Link to={role === "admin" ? "/dashboard" : "/profile"}>
                BACK
              </Link>
            </div>
          </div>
        </div>
      </main>
      {/* <footer className="footer">
    <div className="footer__content">
      <p >
        created by <span className="name">Raysell Concepcion</span>
      </p>
    </div>
    <Outlet/>
  </footer> */}
    </>
  );
}

export default AccessDeniedPage;
