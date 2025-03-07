import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useFav } from "../hooks/fav";

function formatField(field) {
  return field.replace(/_/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
}

const EntityCard = ({ item, type }) => {
  // Se obtienen funciones y estado de favoritos del hook
  const { addFav, remFav, favs } = useFav();
  const [details, setDetails] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(true);

  useEffect(() => {
    const getDetails = async () => {

      const cacheKey = `starWarsDetail-${type}-${item.uid}`;
      const cachedDetail = localStorage.getItem(cacheKey);
      if (cachedDetail) {
        setDetails(JSON.parse(cachedDetail));
        setLoadingDetails(false);
        return;
      }
      try {
        const response = await fetch(item.url);
        const data = await response.json();
        const entityDetails = data.result.properties;
        setDetails(entityDetails);
        localStorage.setItem(cacheKey, JSON.stringify(entityDetails));
      } catch (error) {
        console.error("Error fetching details:", error);
      } finally {
        setLoadingDetails(false);
      }
    };
    getDetails();
  }, [item.url, type, item.uid]);

  const detailFields = {
    people: ["gender", "hair_color", "eye_color"],
    vehicles: ["model", "vehicle_class", "manufacturer"],
    planets: ["population", "terrain", "climate"]
  };
  const fieldsToShow = detailFields[type] || [];

  const isFavorite = favs.some((fav) => fav.uid === item.uid && fav.type === type);

  return (
    <div className="card h-100">
      <div className="card-body">
        <h5 className="card-title">{item.name}</h5>
        {loadingDetails ? (
          <p>CLoading details...</p>
        ) : details ? (
          fieldsToShow.map((field, index) => (
            <div key={index}>
              <strong>{formatField(field)}</strong>: {details[field]}
            </div>
          ))
        ) : (
          <p>Details not available</p>
        )}
        <div className="d-flex justify-content-between align-items-center mt-3">
          <Link to={`/detail/${type}/${item.uid}`} className="btn btn-primary btn-sm">
            Details
          </Link>
          <button
            className={`btn btn-sm ${isFavorite ? "btn-warning" : "btn-outline-warning"}`}
            onClick={() => {
              if (isFavorite) {
                remFav(item.uid);
              } else {
                addFav({ ...item, type });
              }
            }}
          >
            ♥
          </button>
        </div>
      </div>
    </div>
  );
};

const EntityList = ({ type }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getData = async () => {
      const cacheKey = `starWarsData-${type}`;
      const cachedData = localStorage.getItem(cacheKey);
      if (cachedData) {
        setItems(JSON.parse(cachedData));
        setLoading(false);
        return;
      }
      try {
        const response = await fetch(`https://www.swapi.tech/api/${type}`);
        const data = await response.json();
        const results = data.results;
        setItems(results);
        localStorage.setItem(cacheKey, JSON.stringify(results));
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    getData();
  }, [type]);

  if (loading) return <p>Loading...</p>;

  return (
    <div className="d-flex flex-nowrap overflow-x-auto pb-3" style={{ gap: "1rem" }}>
      {items.map((item) => (
        <div key={item.uid} style={{ minWidth: "300px" }}>
          <EntityCard item={item} type={type} />
        </div>
      ))}
    </div>
  );
};

export const Home = () => {
  return (
    <div className="container mt-4">
      <h1 className="mb-4">Characters</h1>
      <div className="scroll-container" style={{ overflowX: "auto" }}>
        <EntityList type="people" />
      </div>

      <h1 className="my-4">Vehicles</h1>
      <div className="scroll-container" style={{ overflowX: "auto" }}>
        <EntityList type="vehicles" />
      </div>

      <h1 className="my-4">Planets</h1>
      <div className="scroll-container" style={{ overflowX: "auto" }}>
        <EntityList type="planets" />
      </div>
    </div>
  );
};
