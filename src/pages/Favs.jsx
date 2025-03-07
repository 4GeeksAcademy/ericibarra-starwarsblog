import { Link } from "react-router-dom";
import { useFav } from "../hooks/fav";

export const Favs = () => {
  const { favs, remFav } = useFav();

  if (favs.length === 0) {
    return (
      <div className="container mt-4">
        <h1 className="mb-4">Favs</h1>
        <div className="alert alert-info">
          No favorites added yet. Start adding some!
        </div>
      </div>
    );
  }
  return (
    <div className="container mt-4">
      <h1 className="mb-4">Favs</h1>
      <div className="row g-4">
        {favs.map(f => (
          <div key={f.uid} className="col-md-4">
            <div className="card h-100">
              <div className="card-body">
                <h5 className="card-title">{f.name}</h5>
                <div className="d-flex justify-content-between align-items-center">
                  <Link 
                    to={`/detail/${f.type}/${f.uid}`}
                    className="btn btn-primary btn-sm"
                  >
                    Details
                  </Link>
                  <button 
                    className="btn btn-danger btn-sm"
                    onClick={() => remFav(f.uid)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};