import { useState } from "react";
import { CloudRain, Snowflake, X } from "lucide-react";
import { horaCiudad } from "../lib/clima";

// Cartel que aparece solo cuando llueve o va a llover en las próximas horas
export default function AvisoLluvia({ aviso, desfase }) {
  const [cerrado, setCerrado] = useState(false);
  if (!aviso || cerrado) return null;

  const Icono = aviso.nieve ? Snowflake : CloudRain;
  const que = aviso.nieve ? "Nieve" : "Lluvia";
  let titulo;
  let detalle;
  if (aviso.ahora) {
    titulo = aviso.nieve ? "Está nevando" : "Está lloviendo";
    detalle = aviso.hasta
      ? `Pararía cerca de las ${horaCiudad(aviso.hasta, desfase)}`
      : "Seguiría durante las próximas horas";
  } else {
    titulo = `${que} probable desde las ${horaCiudad(aviso.desde, desfase)}`;
    detalle = `${aviso.prob}% de probabilidad. ${aviso.nieve ? "Abrigate bien." : "Llevá paraguas."}`;
  }

  return (
    <div
      role="status"
      className="aviso-lluvia panel flex items-center gap-3 px-4 py-3 sm:px-5"
    >
      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-acento/15 text-acento">
        <Icono size={18} strokeWidth={2} className="aviso-icono" aria-hidden="true" />
      </span>
      <p className="min-w-0 flex-1 text-sm">
        <span className="font-medium">{titulo}</span>
        <span className="block text-xs text-suave sm:ml-2 sm:inline">{detalle}</span>
      </p>
      <button
        type="button"
        onClick={() => setCerrado(true)}
        aria-label="Cerrar aviso"
        className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-suave transition-colors hover:bg-linea/60 hover:text-texto"
      >
        <X size={15} strokeWidth={2} />
      </button>
    </div>
  );
}