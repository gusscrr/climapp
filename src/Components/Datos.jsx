import { useEffect, useState } from "react";
import useContador from "../hooks/useContador";
import { useRevelado } from "../lib/revelar";

// Número que cuenta hasta su valor al aparecer
export function Contador({ valor, sufijo = "" }) {
  const n = useContador(valor);
  return (
    <span className="tabular-nums">
      {n}
      {sufijo}
    </span>
  );
}

// Activa las barras un instante después de aparecer en pantalla, para que crezcan desde cero
function useEncendido(retraso = 0) {
  const [encendido, setEncendido] = useState(false);
  const visible = useRevelado();
  useEffect(() => {
    if (!visible) return;
    const id = setTimeout(() => setEncendido(true), 120 + retraso);
    return () => clearTimeout(id);
  }, [retraso, visible]);
  return encendido;
}

// Barra fina que se llena (0 a 1)
export function Barra({ valor, retraso = 0, color = "bg-acento", className = "mt-2.5" }) {
  const encendido = useEncendido(retraso);
  const p = Math.max(0, Math.min(valor ?? 0, 1));
  return (
    <div className={`h-1 overflow-hidden rounded-full bg-linea ${className}`}>
      <div
        className={`dato-barra h-full rounded-full ${color}`}
        style={{ width: encendido ? `${p * 100}%` : "0%" }}
      />
    </div>
  );
}

// Escala con degradado y un punto que se desliza hasta el valor (0 a 1)
export function Indicador({ valor, degradado, retraso = 0, className = "mt-3" }) {
  const encendido = useEncendido(retraso);
  const p = Math.max(0, Math.min(valor ?? 0, 1));
  return (
    <div className={`relative h-1.5 rounded-full ${className}`} style={{ background: degradado }}>
      <span
        className="dato-punto absolute top-1/2 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-[3px] border-superficie bg-texto"
        style={{ left: encendido ? `${p * 100}%` : "0%", opacity: encendido ? 1 : 0 }}
      />
    </div>
  );
}

// Rango mínimo–máximo con un punto en la temperatura actual
export function Rango({ actual, min, max, retraso = 0 }) {
  const encendido = useEncendido(retraso);
  const p = max > min ? Math.max(0, Math.min((actual - min) / (max - min), 1)) : 0.5;
  return (
    <div className="relative mt-2.5 h-1 rounded-full bg-linea">
      <div
        className="dato-barra absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-acento/40 to-acento"
        style={{ width: encendido ? "100%" : "0%" }}
      />
      <span
        className="dato-punto absolute top-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-superficie bg-texto"
        style={{ left: encendido ? `${p * 100}%` : "0%", opacity: encendido ? 1 : 0 }}
      />
    </div>
  );
}

// Medidor por segmentos que se encienden de a uno
export function Segmentos({ nivel, total = 6, retraso = 0 }) {
  const encendido = useEncendido(retraso);
  return (
    <div className="mt-2.5 flex gap-1">
      {Array.from({ length: total }, (_, i) => (
        <span
          key={i}
          className={`dato-segmento h-1 flex-1 rounded-full ${
            encendido && i < nivel ? "bg-acento" : "bg-linea"
          }`}
          style={{ transitionDelay: `${i * 90}ms` }}
        />
      ))}
    </div>
  );
}

// Dato con entrada escalonada
export function Dato({ nombre, indice = 0, children, extra }) {
  return (
    <div className="aparecer min-w-0" style={{ animationDelay: `${150 + indice * 80}ms` }}>
      <dt className="text-xs text-suave">{nombre}</dt>
      <dd className="mt-1 whitespace-nowrap text-base font-medium">{children}</dd>
      {extra}
    </div>
  );
}