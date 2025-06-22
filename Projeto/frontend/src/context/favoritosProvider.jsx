import { useState } from "react";
import { FavoritosContext } from "./favoritosContext";

export function FavoritosProvider({ children }) {
  const [favoritos, setFavoritos] = useState([]);

  const toggleFavorito = (prato) => {
    setFavoritos((prev) =>
      prev.some((f) => f._id === prato._id)
        ? prev.filter((f) => f._id !== prato._id)
        : [...prev, prato]
    );
  };

  const removerFavorito = (id) => {
    setFavoritos((prev) => prev.filter((prato) => prato._id !== id));
  };

  return (
    <FavoritosContext.Provider value={{ favoritos, toggleFavorito, removerFavorito }}>
      {children}
    </FavoritosContext.Provider>
  );
}
