import { Link } from "react-router-dom"


function AccessDeniedPage() {
  return (
    <div>AccessDeniedPage
    <Link to={'/dashboard'}>
      Volver al Inicio
    </Link>
    </div>
  )
}

export default AccessDeniedPage