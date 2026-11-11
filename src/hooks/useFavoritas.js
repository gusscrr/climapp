import { useSyncExternalStore } from "react";
import { favoritas } from "../lib/favoritas";

// Lista de ciudades favoritas, siempre actualizada en todos los componentes
export default function useFavoritas() {
  return useSyncExternalStore(favoritas.suscribir, favoritas.obtener, () => []);
}