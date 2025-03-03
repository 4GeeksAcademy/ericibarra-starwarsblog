import { Link } from "react-router-dom";
import { useFav } from "../hooks/fav";

export const Navbar = () => {
  const { favs } = useFav();
  
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container">
        <Link className="navbar-brand" to="/">Star Wars DB</Link>
        <div className="d-flex">
          <Link className="btn btn-outline-warning position-relative" to="/favs">
            Favs
            <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
              {favs.length}
            </span>
          </Link>
        </div>
      </div>
    </nav>
  );
};