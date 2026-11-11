import { Droplet } from "lucide-react";
import IconoClima from "./IconoClima";
import { Contador } from "./Datos";
import { aUnidad, useUnidad } from "../lib/unidad";

// Próximos días: cada fila con su rango de temperatura sobre una escala común
export default function Dias({ dias }) {
  const unidad = useUnidad();
  if (!dias?.length) return null;
  const t = (c) => Math.round(aUnidad(c, unidad));

  const min = Math.min(...dias.map((d) => d.min));
  const max = Math.max(...dias.map((d) => d.max));
  const escala = Math.max(max - min, 1);

  return (
    <section aria-labelledby="titulo-dias" className="panel flex flex-col p-6 sm:p-8">
      <h2 id="titulo-dias" className="text-sm font-medium text-suave">
        Próximos días
      </h2>

      {/* Las filas se reparten en todo el alto, así no queda espacio vacío */}
      <ul className="mt-3 flex flex-1 flex-col justify-between divide-y divide-linea">
        {dias.map((d, i) => {
          const desde = ((d.min - min) / escala) * 100;
          const ancho = Math.max(((d.max - d.min) / escala) * 100, 6);
          return (
            <li
              key={d.clave}
              className="aparecer grid grid-cols-[3rem_1.75rem_3rem_2.25rem_1fr_2.25rem] items-center gap-2 py-3 sm:gap-3"
              style={{ animationDelay: `${200 + i * 70}ms` }}
            >
              <span className={`text-sm ${i === 0 ? "font-medium" : ""}`}>{d.nombre}</span>
              <IconoClima
                id={d.estado?.id}
                icono={d.estado?.icon?.replace("n", "d")}
                size={22}
                strokeWidth={1.6}
                className="text-acento"
              />
              <span
                className={`flex items-center gap-0.5 text-[11px] tabular-nums ${
                  d.lluvia >= 20 ? "text-acento" : "text-transparent"
                }`}
              >
                <Droplet size={11} strokeWidth={2} aria-hidden="true" />
                {d.lluvia}%
              </span>
              <span className="text-right text-sm tabular-nums text-suave">
                <Contador valor={t(d.min)} sufijo="°" />
              </span>
              <span className="relative h-1 rounded-full bg-linea">
                <span
                  className="dia-rango absolute inset-y-0 rounded-full bg-gradient-to-r from-acento/50 to-acento"
                  style={{
                    left: `${desde}%`,
                    width: `${ancho}%`,
                    animationDelay: `${350 + i * 70}ms`,
                  }}
                />
              </span>
              <span className="text-sm font-medium tabular-nums">
                <Contador valor={t(d.max)} sufijo="°" />
              </span>
            </li>
          );
        })}
      </ul>
    </section>
  );
}