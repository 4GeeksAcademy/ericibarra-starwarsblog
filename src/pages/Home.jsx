import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useFav } from "../hooks/fav";

const EntityList = ({ type }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const { addFav } = useFav();

  useEffect(() => {
    setLoading(true);
    fetch(`https://www.swapi.tech/api/${type}?page=${page}&limit=10`)
      .then(res => res.json())
      .then(data => {
        setItems(data.results);
        setLoading(false);
      })
      .catch(error => {
        console.error("Error fetching data:", error);
        setLoading(false);
      });
  }, [type, page]);

  return (
    <div>
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

      <div className="d-flex justify-content-center my-4">
        <button 
          className="btn btn-primary mx-2"
          onClick={() => setPage(p => Math.max(1, p - 1))}
          disabled={page === 1}
        >
          Previous
        </button>
        <span className="mx-2">Page {page}</span>
        <button 
          className="btn btn-primary mx-2"
          onClick={() => setPage(p => p + 1)}
        >
          Next
        </button>
      </div>
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