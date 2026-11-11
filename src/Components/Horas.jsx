import { useEffect, useRef, useState } from "react";
import { Droplet } from "lucide-react";
import { aKmh, horaCiudad } from "../lib/clima";
import IconoClima from "./IconoClima";
import { aUnidad, useUnidad } from "../lib/unidad";

const MIN_ANCHO = 60; // ancho mínimo de cada columna en px
const ALTO = 44; // alto de la curva

// Próximas 12 horas: tira deslizable con una curva de temperatura que se dibuja al cargar
export default function Horas({ clima, pronostico }) {
  // Las columnas ocupan todo el ancho disponible; en pantallas chicas se desliza
  const caja = useRef(null);
  const unidad = useUnidad();
  const [disponible, setDisponible] = useState(0);
  useEffect(() => {
    const el = caja.current;
    if (!el) return;
    const medir = () => setDisponible(el.clientWidth);
    medir();
    const obs = new ResizeObserver(medir);
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  if (!pronostico?.length) return null;
  const desfase = clima.timezone ?? 0;

  const horas = [
    {
      dt: clima.dt,
      etiqueta: "Ahora",
      temp: Math.round(aUnidad(clima.main.temp, unidad)),
      estado: clima.weather?.[0],
      lluvia: null,
      viento: aKmh(clima.wind?.speed),
    },
    ...pronostico.slice(0, 12).map((h) => ({
      dt: h.dt,
      etiqueta: horaCiudad(h.dt, desfase),
      temp: Math.round(aUnidad(h.main.temp, unidad)),
      estado: h.weather?.[0],
      lluvia: Math.round((h.pop ?? 0) * 100),
      viento: aKmh(h.wind?.speed),
    })),
  ];

  const ANCHO = Math.max(MIN_ANCHO, Math.floor(disponible / horas.length) || MIN_ANCHO);
  const temps = horas.map((h) => h.temp);
  const min = Math.min(...temps);
  const max = Math.max(...temps);
  const y = (t) => (max === min ? ALTO / 2 : 6 + (1 - (t - min) / (max - min)) * (ALTO - 12));
  const puntos = horas.map((h, i) => [i * ANCHO + ANCHO / 2, y(h.temp)]);
  // Curva suave entre puntos
  const camino = puntos.reduce((d, [px, py], i) => {
    if (i === 0) return `M${px} ${py}`;
    const [ax, ay] = puntos[i - 1];
    const cx = (ax + px) / 2;
    return `${d} C${cx} ${ay} ${cx} ${py} ${px} ${py}`;
  }, "");
  const total = horas.length * ANCHO;

  return (
    <section aria-labelledby="titulo-horas" className="panel p-6 sm:p-8">
      <h2 id="titulo-horas" className="text-sm font-medium text-suave">
        Próximas horas
      </h2>

      <div ref={caja} className="mt-5 overflow-x-auto pb-1 [mask-image:linear-gradient(to_right,black_85%,transparent)] md:[mask-image:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <ol className="relative flex" style={{ width: total }}>
          {/* Curva de temperatura */}
          <svg
            className="pointer-events-none absolute left-0 top-[86px]"
            width={total}
            height={ALTO}
            viewBox={`0 0 ${total} ${ALTO}`}
            fill="none"
            aria-hidden="true"
          >
            <defs>
              <linearGradient id="relleno-curva" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="rgb(var(--acento))" stopOpacity="0.18" />
                <stop offset="100%" stopColor="rgb(var(--acento))" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path
              d={`${camino} L${puntos.at(-1)[0]} ${ALTO} L${puntos[0][0]} ${ALTO} Z`}
              fill="url(#relleno-curva)"
              className="curva-relleno"
            />
            <path
              d={camino}
              stroke="rgb(var(--acento))"
              strokeWidth="2"
              strokeLinecap="round"
              pathLength="1"
              className="curva-linea"
            />
            {puntos.map(([px, py], i) => (
              <circle
                key={i}
                cx={px}
                cy={py}
                r={i === 0 ? 3.5 : 2.5}
                className={`curva-punto ${i === 0 ? "fill-texto" : "fill-superficie stroke-acento"}`}
                strokeWidth="1.5"
                style={{ animationDelay: `${300 + i * 70}ms` }}
              />
            ))}
          </svg>

          {horas.map((h, i) => (
            <li
              key={h.dt}
              className="aparecer flex shrink-0 flex-col items-center text-center"
              style={{ width: ANCHO, animationDelay: `${i * 50}ms` }}
            >
              <span className={`text-xs ${i === 0 ? "font-medium text-texto" : "text-suave"}`}>
                {h.etiqueta}
              </span>
              <IconoClima
                id={h.estado?.id}
                icono={h.estado?.icon}
                size={26}
                strokeWidth={1.6}
                className="mt-3 text-acento"
              />
              <span className="mt-2 text-base font-medium tabular-nums">{h.temp}°</span>
              {/* espacio para la curva */}
              <span className="h-[64px]" aria-hidden="true" />
              <span
                className={`flex items-center gap-0.5 text-[11px] tabular-nums ${
                  h.lluvia >= 20 ? "text-acento" : "text-suave/70"
                }`}
              >
                <Droplet size={11} strokeWidth={2} aria-hidden="true" />
                {h.lluvia == null ? "—" : `${h.lluvia}%`}
              </span>
              <span className="mt-1 text-[11px] tabular-nums text-suave">{h.viento} km/h</span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}