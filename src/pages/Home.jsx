import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useFav } from "../hooks/fav";

const EntityList = ({ type }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addFav } = useFav();

  useEffect(() => {
    fetch(`https://www.swapi.tech/api/${type}`)
      .then(res => res.json())
      .then(data => {
        setItems(data.results);
        setLoading(false);
      });
  }, [type]);

  if (loading) return (
    <div className="d-flex justify-content-center">
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  );

  return (
    <div className="row g-4">
      {items.map(item => (
        <div key={item.uid} className="col-md-4">
          <div className="card h-100">
            <div className="card-body">
              <h5 className="card-title">{item.name}</h5>
              <p className="card-text">
                <small className="text-muted">{type}</small>
              </p>
              <div className="d-flex justify-content-between align-items-center">
                <Link 
                  to={`/detail/${type}/${item.uid}`}
                  className="btn btn-primary btn-sm"
                >
                  Details
                </Link>
                <button 
                  className="btn btn-outline-warning btn-sm"
                  onClick={() => addFav({...item, type})}
                >
                  ♥
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export const Home = () => {
  return (
    <div className="container mt-4">
      <h1 className="mb-4">Characters</h1>
      <EntityList type="people" />
      
      <h1 className="my-4">Vehicles</h1>
      <EntityList type="vehicles" />
      
      <h1 className="my-4">Planets</h1>
      <EntityList type="planets" />
    </div>
  );
};