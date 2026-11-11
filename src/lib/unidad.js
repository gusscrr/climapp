import { createContext, useContext } from "react";

// Unidad de temperatura elegida: "C" o "F"
export const ContextoUnidad = createContext("C");

export const useUnidad = () => useContext(ContextoUnidad);

// Convierte grados Celsius a la unidad elegida
export const aUnidad = (celsius, unidad) => (unidad === "F" ? (celsius * 9) / 5 + 32 : celsius);