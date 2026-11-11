import { useCallback, useEffect, useRef, useState } from "react";
import { API_KEY, traerClima } from "../lib/clima";

// estado: "pedir" | "cargando" | "bloqueada" | "listo" | "error"
// Siempre arranca en "pedir": al entrar o recargar se muestra la pantalla de permiso
export default function useClima() {
  const [estado, setEstado] = useState(API_KEY ? "pedir" : "error");
  const [error, setError] = useState(API_KEY ? null : "clave");
  const [esperandoPermiso, setEsperandoPermiso] = useState(false);
  const [datos, setDatos] = useState(null);
  const [actualizado, setActualizado] = useState(null);
  const [actualizando, setActualizando] = useState(false);
  const coords = useRef(null);
  // null = mi ubicación; si no, la ciudad elegida en el buscador
  const [ciudad, setCiudad] = useState(null);

  const cargar = useCallback(async (lat, lon, silencioso = false) => {
    coords.current = { lat, lon };
    if (silencioso) setActualizando(true);
    else setEstado("cargando");
    try {
      const nuevos = await traerClima(lat, lon);
      setDatos(nuevos);
      setActualizado(new Date());
      setError(null);
      setEstado("listo");
    } catch (e) {
      setError(e.message);
      if (!silencioso) setEstado("error");
    } finally {
      setActualizando(false);
    }
  }, []);

  // Abre el aviso del navegador para pedir la ubicación
  const pedirUbicacion = useCallback(() => {
    if (!API_KEY) return;
    if (!("geolocation" in navigator)) {
      setEstado("bloqueada");
      return;
    }
    setEsperandoPermiso(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setEsperandoPermiso(false);
        setCiudad(null);
        cargar(pos.coords.latitude, pos.coords.longitude);
      },
      (err) => {
        setEsperandoPermiso(false);
        if (err.code === err.PERMISSION_DENIED) setEstado("bloqueada");
        else {
          setError("ubicacion");
          setEstado("error");
        }
      },
      { enableHighAccuracy: false, timeout: 15000, maximumAge: 600000 },
    );
  }, [cargar]);

  // Ver el clima de otra ciudad
  const verCiudad = useCallback(
    (c) => {
      setCiudad(c);
      cargar(c.lat, c.lon);
    },
    [cargar],
  );

  const actualizar = useCallback(() => {
    if (coords.current) cargar(coords.current.lat, coords.current.lon, true);
  }, [cargar]);

  // Se refresca solo cada 10 minutos
  useEffect(() => {
    if (estado !== "listo") return;
    const id = setInterval(actualizar, 10 * 60 * 1000);
    return () => clearInterval(id);
  }, [estado, actualizar]);

  return {
    estado,
    error,
    datos,
    actualizado,
    actualizando,
    esperandoPermiso,
    ciudad,
    actualizar,
    pedirUbicacion,
    verCiudad,
  };
}