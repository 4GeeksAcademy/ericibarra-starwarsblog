import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useFav } from "../hooks/fav";

const FavoriteCard = ({ favorite, removeFavorite }) => {
  const [details, setDetails] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(true);

  useEffect(() => {
    const fetchDetails = async () => {
      // Create a unique cache key for each favorite detail
      const cacheKey = `starWarsDetail-${favorite.type}-${favorite.uid}`;
      const cachedDetails = localStorage.getItem(cacheKey);
      if (cachedDetails) {
        setDetails(JSON.parse(cachedDetails));
        setLoadingDetails(false);
        return;
      }
      try {
        const response = await fetch(favorite.url);
        const data = await response.json();
        const fetchedDetails = data.result.properties;
        setDetails(fetchedDetails);
        localStorage.setItem(cacheKey, JSON.stringify(fetchedDetails));
      } catch (error) {
        console.error("Error fetching details:", error);
      } finally {
        setLoadingDetails(false);
      }
    };

    fetchDetails();
  }, [favorite.url, favorite.type, favorite.uid]);

  const detailFields = {
    people: ["gender", "hair_color", "eye_color"],
    vehicles: ["model", "vehicle_class", "manufacturer"],
    planets: ["population", "terrain", "climate"]
  };

  const fields = detailFields[favorite.type] || [];

  const formatField = (field) =>
    field.replace(/_/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase());

  return (
    <div className="card h-100">
      <div className="card-body">
        <h5 className="card-title">{favorite.name}</h5>
        {loadingDetails ? (
          <p>Loading details...</p>
        ) : details ? (
          <>
            {fields.map((field, index) => (
              <div key={index}>
                <strong>{formatField(field)}</strong>: {details[field]}
              </div>
            ))}
          </>
        ) : (
          <p>Details not available</p>
        )}
        <div className="d-flex justify-content-between align-items-center mt-3">
          <Link
            to={`/detail/${favorite.type}/${favorite.uid}`}
            className="btn btn-primary btn-sm"
          >
            Details
          </Link>
          <button
            className="btn btn-danger btn-sm"
            onClick={() => removeFavorite(favorite.uid)}
          >
            Remove
          </button>
        </div>
      </div>
    </div>
  );
};

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
        {favs.map((favorite) => (
          <div key={favorite.uid} className="col-md-4">
            <FavoriteCard favorite={favorite} removeFavorite={remFav} />
          </div>
        ))}
      </div>
    </div>
  );
};
