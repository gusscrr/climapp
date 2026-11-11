import { useEffect, useState } from "react";
import { aKmh, direccion, intensidadViento } from "../lib/clima";
import { IconoViento } from "./Estados";
import { Barra, Contador, Dato, Segmentos } from "./Datos";

const NIVELES = ["Calma", "Suave", "Moderada", "Fuerte", "Temporal", "Muy fuerte"];

const MARCAS = Array.from({ length: 72 }, (_, i) => i * 5);
const CARDINALES = [
  { letra: "N", angulo: 0 },
  { letra: "E", angulo: 90 },
  { letra: "S", angulo: 180 },
  { letra: "O", angulo: 270 },
];

function polar(angulo, radio) {
  const r = ((angulo - 90) * Math.PI) / 180;
  return [100 + radio * Math.cos(r), 100 + radio * Math.sin(r)];
}

function Brujula({ grados, kmh }) {
  // La flecha apunta hacia donde va el viento (opuesto a de dónde viene)
  const destino = (grados + 180) % 360;
  const [angulo, setAngulo] = useState(destino - 120);

  useEffect(() => {
    const id = requestAnimationFrame(() => setAngulo(destino));
    return () => cancelAnimationFrame(id);
  }, [destino]);

  const vaiven = kmh < 2 ? 0 : Math.min(1 + kmh / 12, 5);

  return (
    <div className="relative mx-auto aspect-square w-full max-w-[17rem] overflow-hidden rounded-full">
      <svg viewBox="0 0 200 200" className="absolute inset-0 h-full w-full" aria-hidden="true">
        {MARCAS.map((a) => {
          const mayor = a % 90 === 0;
          const media = a % 30 === 0;
          if (mayor) return null;
          const [x1, y1] = polar(a, 92);
          const [x2, y2] = polar(a, media ? 84 : 88);
          return (
            <line
              key={a}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke="currentColor"
              strokeWidth={media ? 1.4 : 0.8}
              strokeLinecap="round"
              className={media ? "text-suave/60" : "text-linea"}
            />
          );
        })}
        {CARDINALES.map(({ letra, angulo: a }) => {
          const [x, y] = polar(a, 88);
          return (
            <text
              key={letra}
              x={x}
              y={y}
              textAnchor="middle"
              dominantBaseline="central"
              className={`text-[10px] font-medium ${letra === "N" ? "fill-texto" : "fill-suave"}`}
            >
              {letra}
            </text>
          );
        })}
      </svg>

      {/* Aguja */}
      <div className="aguja absolute inset-0" style={{ transform: `rotate(${angulo}deg)` }}>
        <div
          className={vaiven ? "vaiven h-full w-full" : "h-full w-full"}
          style={{ "--vaiven": `${vaiven}deg` }}
        >
          <svg viewBox="0 0 200 200" className="h-full w-full" aria-hidden="true">
            <line x1="100" y1="160" x2="100" y2="38" className="stroke-acento" strokeWidth="2.5" strokeLinecap="round" />
            <circle cx="100" cy="164" r="4" className="fill-superficie stroke-acento" strokeWidth="2.5" />
            <path d="M100 22 L109 42 L100 37 L91 42 Z" className="fill-acento" strokeLinejoin="round" />
          </svg>
        </div>
      </div>

      {/* Centro: velocidad */}
      <div className="absolute inset-[29%] grid place-items-center rounded-full bg-superficie ring-1 ring-linea">
        <p className="text-center leading-none">
          <span className="block text-[2.5rem] font-medium tracking-[-0.04em] sm:text-[2.75rem]">{kmh}</span>
          <span className="mt-1 block text-sm text-suave">km/h</span>
        </p>
      </div>
    </div>
  );
}

export default function WindCard({ clima }) {
  const { wind } = clima;
  const kmh = aKmh(wind.speed);
  const rafagas = wind.gust ? aKmh(wind.gust) : null;
  const dir = direccion(wind.deg);
  const intensidad = intensidadViento(kmh);

  return (
    <section aria-labelledby="titulo-viento" className="flex flex-col">
      <h2 id="titulo-viento" className="flex items-center gap-1.5 text-sm font-medium text-suave">
        Viento
        <span className="text-acento">
          <IconoViento className="h-[15px] w-[17px]" />
        </span>
      </h2>

      <div className="my-6">
        <Brujula grados={wind.deg ?? 0} kmh={kmh} />
      </div>

      <p className="sr-only">
        Viento de {kmh} kilómetros por hora desde el {dir.nombre}.
      </p>

      <dl className="mt-8 grid grid-cols-3 gap-4 border-t border-linea pt-5 md:mt-auto">
        <Dato
          nombre="Viene del"
          indice={3}
          extra={
            <div className="mt-2 flex h-2.5 items-center">
              <svg
                viewBox="0 0 24 24"
                className="dato-flecha h-4 w-4 text-acento"
                style={{ "--giro": `${((wind.deg ?? 0) + 180) % 360}deg` }}
                aria-hidden="true"
              >
                <path d="M12 3 L18 19 L12 15 L6 19 Z" fill="currentColor" />
              </svg>
            </div>
          }
        >
          <span className="capitalize">{dir.nombre}</span>{" "}
          {/* En celulares chicos los grados bajan a otra línea para no pisar Ráfagas */}
          <span className="block text-sm text-suave min-[400px]:inline min-[400px]:text-base md:block md:text-sm lg:inline lg:text-base">
            <Contador valor={wind.deg ?? 0} sufijo="°" />
          </span>
        </Dato>
        <Dato
          nombre="Ráfagas"
          indice={4}
          extra={<Barra valor={rafagas != null ? rafagas / 100 : 0} retraso={470} />}
        >
          {rafagas != null ? <Contador valor={rafagas} sufijo=" km/h" /> : "—"}
        </Dato>
        <Dato
          nombre="Intensidad"
          indice={5}
          extra={<Segmentos nivel={NIVELES.indexOf(intensidad) + 1} retraso={550} />}
        >
          {intensidad}
        </Dato>
      </dl>
    </section>
  );
}