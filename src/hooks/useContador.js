import { useEffect, useState } from "react";
import { useRevelado } from "../lib/revelar";

// Cuenta desde 0 hasta el valor con una curva suave (o salta directo si se pidió menos movimiento)
export default function useContador(valor, duracion = 900) {
  const [actual, setActual] = useState(0);
  // Espera a que la sección aparezca en pantalla
  const visible = useRevelado();

  useEffect(() => {
    if (!visible || valor == null || Number.isNaN(valor)) return;
    const quieto = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (quieto) {
      setActual(valor);
      return;
    }
    let id;
    const inicio = performance.now();
    const desde = 0;
    const paso = (t) => {
      const p = Math.min((t - inicio) / duracion, 1);
      const curva = 1 - Math.pow(1 - p, 3);
      setActual(desde + (valor - desde) * curva);
      if (p < 1) id = requestAnimationFrame(paso);
    };
    id = requestAnimationFrame(paso);
    return () => cancelAnimationFrame(id);
  }, [valor, duracion, visible]);

  return Math.round(actual);
}