import { useContext } from "react";
import { FavoritosContext } from "../context/favoritosContext";

export const useFavoritos = () => useContext(FavoritosContext);
