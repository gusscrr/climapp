import { Sunrise, Sunset } from "lucide-react";
import { duracion, horaCiudad, nivelUV } from "../lib/clima";
import { Contador, Indicador } from "./Datos";

const DEGRADE_UV =
  "linear-gradient(90deg, rgb(var(--aire-1)), rgb(var(--aire-3)), rgb(var(--aire-4)), rgb(var(--aire-5)), rgb(167 139 250))";

// Ícono del título: los rayos giran despacio y el centro respira
function IconoSol() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-4 w-4 overflow-visible"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <g className="wx-rayos">
        <path d="M12 2v2" />
        <path d="M12 20v2" />
        <path d="m4.93 4.93 1.41 1.41" />
        <path d="m17.66 17.66 1.41 1.41" />
        <path d="M2 12h2" />
        <path d="M20 12h2" />
        <path d="m6.34 17.66-1.41 1.41" />
        <path d="m19.07 4.93-1.41 1.41" />
      </g>
      <circle cx="12" cy="12" r="4" className="wx-nucleo" />
    </svg>
  );
}

// Arco del sol: el sol recorre el cielo según la hora real de la ciudad
export default function Sol({ clima }) {
  const { sunrise, sunset } = clima.sys ?? {};
  if (!sunrise || !sunset) return null;
  const desfase = clima.timezone ?? 0;
  const ahora = Date.now() / 1000;

  const luz = sunset - sunrise;
  const p = Math.max(0, Math.min((ahora - sunrise) / luz, 1));
  const esDeDia = ahora >= sunrise && ahora <= sunset;

  // Semicírculo: centro (100, 96), radio 80
  const ang = Math.PI * (1 - p);
  const sx = 100 + 80 * Math.cos(ang);
  const sy = 96 - 80 * Math.sin(ang);
  const arco = "M20 96 A80 80 0 0 1 180 96";

  const uv = Math.round(clima.uv?.actual ?? 0);
  const uvMax = Math.round(clima.uv?.max ?? 0);
  const nivel = nivelUV(uv);

  let estado;
  if (ahora < sunrise) estado = `Sale en ${duracion(sunrise - ahora)}`;
  else if (esDeDia) estado = `Se pone en ${duracion(sunset - ahora)}`;
  else estado = "El sol ya se puso";

  return (
    <section aria-labelledby="titulo-sol" className="panel flex flex-col p-6 sm:p-8">
      <h2 id="titulo-sol" className="flex items-center gap-1.5 text-sm font-medium text-suave">
        Sol
        <span className="text-acento">
          <IconoSol />
        </span>
      </h2>

      <div className="relative mx-auto mt-6 w-full max-w-[18rem]">
        <svg viewBox="0 0 200 104" className="w-full overflow-visible" aria-hidden="true">
          <defs>
            <linearGradient id="cielo" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgb(var(--acento))" stopOpacity="0.16" />
              <stop offset="100%" stopColor="rgb(var(--acento))" stopOpacity="0" />
            </linearGradient>
            <clipPath id="recorrido">
              <rect x="0" y="0" height="104" className="sol-recorte" style={{ "--ancho": `${sx}px` }} />
            </clipPath>
          </defs>
          {/* Horizonte */}
          <line x1="8" y1="96" x2="192" y2="96" className="stroke-linea" strokeWidth="1" />
          {/* Arco completo punteado */}
          <path d={arco} fill="none" className="stroke-linea" strokeWidth="1.5" strokeDasharray="3 4" />
          {/* Parte recorrida */}
          <g clipPath="url(#recorrido)">
            <path d={`${arco} Z`} fill="url(#cielo)" />
            <path d={arco} fill="none" stroke="rgb(var(--acento))" strokeWidth="2" strokeLinecap="round" />
          </g>
          {/* Sol */}
          <g
            className="sol-astro"
            style={{ "--giro": `${-p * 180}deg` }}
          >
            <circle cx={sx} cy={sy} r="13" fill="rgb(var(--acento))" opacity={esDeDia ? 0.16 : 0} className="sol-halo" />
            <circle
              cx={sx}
              cy={sy}
              r="6"
              className={esDeDia ? "fill-acento" : "fill-superficie stroke-suave"}
              strokeWidth="1.5"
            />
          </g>
        </svg>
      </div>

      <p className="mb-6 mt-4 text-center text-sm text-texto/90">{estado}</p>

      {/* Índice UV */}
      <div className="mb-6 border-t border-linea pt-5">
        <div className="flex items-baseline justify-between gap-3">
          <span className="text-xs text-suave">Índice UV</span>
          <span className="text-xs text-suave">máx. hoy {uvMax}</span>
        </div>
        <p className="mt-1 flex items-baseline gap-2">
          <span className="text-2xl font-medium tabular-nums">
            <Contador valor={uv} />
          </span>
          <span className={`text-sm font-medium ${nivel.color}`}>{nivel.nombre}</span>
        </p>
        <Indicador valor={uv / 11} degradado={DEGRADE_UV} retraso={250} />
        <p className="mt-2.5 text-xs text-suave">{nivel.consejo}</p>
      </div>

      {/* Cada columna toma el ancho de su contenido, así nada se corta en celular */}
      <dl className="mt-auto flex justify-between gap-3 border-t border-linea pt-5">
        <div>
          <dt className="flex items-center gap-1 text-xs text-suave">
            <Sunrise size={13} strokeWidth={2} aria-hidden="true" />
            Salida
          </dt>
          <dd className="mt-1 text-base font-medium tabular-nums">{horaCiudad(sunrise, desfase)}</dd>
        </div>
        <div>
          <dt className="flex items-center gap-1 text-xs text-suave">
            <Sunset size={13} strokeWidth={2} aria-hidden="true" />
            Puesta
          </dt>
          <dd className="mt-1 text-base font-medium tabular-nums">{horaCiudad(sunset, desfase)}</dd>
        </div>
        <div>
          <dt className="whitespace-nowrap text-xs text-suave">Horas de luz</dt>
          <dd className="mt-1 whitespace-nowrap text-base font-medium">{duracion(luz)}</dd>
        </div>
      </dl>
    </section>
  );
}