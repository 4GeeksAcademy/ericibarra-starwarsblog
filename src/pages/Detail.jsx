import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useFav } from "../hooks/fav";

export const Detail = () => {
  const { type, uid } = useParams();
  const [entity, setEntity] = useState(null);
  const { favs, remFav } = useFav();

  useEffect(() => {
    fetch(`https://www.swapi.tech/api/${type}/${uid}`)
      .then(res => res.json())
      .then(data => setEntity(data.result));
  }, [type, uid]);

  if (!entity) return (
    <div className="d-flex justify-content-center">
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  );

  const isFav = favs.some(f => f.uid === uid);

  return (
    <div className="container mt-4">
      <h1>{entity.properties.name}</h1>
      <div className="list-group my-4">
        {Object.entries(entity.properties).map(([key, value]) => (
          <div key={key} className="list-group-item">
            <strong>{key}:</strong> {value}
          </div>
        ))}
      </div>
      
      {isFav && (
        <button 
          className="btn btn-danger"
          onClick={() => remFav(uid)}
        >
          Remove from Favs
        </button>
      )}
    </div>
  );
};