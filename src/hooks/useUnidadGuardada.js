import { useEffect, useState } from "react";

const CLAVE = "climapp-unidad";

// Recuerda si elegiste °C o °F
export default function useUnidadGuardada() {
  const [unidad, setUnidad] = useState(() => {
    try {
      return localStorage.getItem(CLAVE) === "F" ? "F" : "C";
    } catch {
      return "C";
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(CLAVE, unidad);
    } catch {
      // sin almacenamiento: no pasa nada
    }
  }, [unidad]);

  return [unidad, setUnidad];
}