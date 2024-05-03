import { Link } from "react-router-dom"
import './Access.css'
import './reset.css'
import './media-query.css'
import toy from '/Scarecrow.png';
import notFound from '/not-found.png';
function AccessDeniedPage() {
  return (
    <>
     <main className="wrapper">
    <div className="wrapper__tittle">
      <h5 className="tittle">404 NOT FOUND</h5>
    </div>
    <div className="wrapper__content">
      <div className="wrapper__content-img">
        <img className="img" src={toy} alt="" />
      </div>
      <div className="wrapper__content-info">
        <h4 className="info__title">I have bad news for you</h4>
        <p className="info__paragraph">
          The page you are looking for might be removed or is temporarily
          unavailable
        </p>
        <button className="info__button">
          <Link to={'/dashboard'}>BACK TO HOMEPAGE</Link>
        </button>
      </div>
    </div>
  </main>
  <footer className="footer">
    <div className="footer__content">
      <p >
        created by <span className="name">Raysell Concepcion</span>
        <span className="dev">- devChallenge.io</span>
      </p>
    </div>
  </footer>
    </>
   
  )
}

export default AccessDeniedPage