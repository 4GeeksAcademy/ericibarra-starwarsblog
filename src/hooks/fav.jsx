import { createContext, useContext, useState } from "react";

const FavContext = createContext();

export const FavProvider = ({ children }) => {
  const [favs, setFavs] = useState([]);

  const addFav = (item) => {
    if (!favs.some(f => f.uid === item.uid)) {
      setFavs([...favs, item]);
    }
  };

  const remFav = (uid) => {
    setFavs(favs.filter(f => f.uid !== uid));
  };

  return (
    <FavContext.Provider value={{ favs, addFav, remFav }}>
      {children}
    </FavContext.Provider>
  );
};

export const useFav = () => useContext(FavContext);