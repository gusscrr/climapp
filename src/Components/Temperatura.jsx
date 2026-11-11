import { LocateFixed, Star } from "lucide-react";
import { aUnidad, useUnidad } from "../lib/unidad";
import { favoritas, mismaCiudad } from "../lib/favoritas";
import useFavoritas from "../hooks/useFavoritas";
import { IconoTemperatura } from "./Estados";
import IconoClima from "./IconoClima";
import { Barra, Contador, Dato, Rango } from "./Datos";

// Nubosidad siempre como "Parcialmente nuboso"; el resto, el texto del servicio
function describir(estado) {
  if (!estado) return "";
  if (estado.id >= 801 && estado.id <= 804) return "Parcialmente nuboso";
  if (estado.id === 800) return "Despejado";
  const d = estado.description ?? "";
  return d ? d[0].toUpperCase() + d.slice(1) : "";
}

export default function Temperatura({ clima, ciudad, onMiUbicacion }) {
  const { main, weather, name, sys } = clima;
  const estado = weather?.[0];
  const descripcion = describir(estado);
  const unidad = useUnidad();
  const t = (c) => Math.round(aUnidad(c, unidad));
  const lista = useFavoritas();
  // Lugar que se puede guardar: la ciudad buscada o tu ubicación actual
  const lugar = ciudad ?? {
    nombre: name,
    region: "",
    pais: sys?.country ?? "",
    lat: clima.coord?.lat,
    lon: clima.coord?.lon,
  };
  const esFavorita = lista.some((f) => mismaCiudad(f, lugar));

  return (
    <section aria-labelledby="titulo-temp" className="flex flex-col">
      <div className="flex items-center justify-between gap-3">
        <h1
          id="titulo-temp"
          className="flex min-w-0 items-center gap-1.5 text-sm font-medium text-suave"
        >
          <span className="shrink-0 text-acento">
            <IconoTemperatura className="h-[18px] w-[18px]" />
          </span>
          <span className="truncate">
            {ciudad ? ciudad.nombre : name}
            {(ciudad?.pais ?? sys?.country) ? `, ${ciudad?.pais ?? sys.country}` : ""}
          </span>
        </h1>
        <div className="flex shrink-0 items-center gap-1.5">
          {/* Estrella: guarda la ciudad (también tu ubicación) en favoritas */}
          <button
            type="button"
            onClick={() => favoritas.alternar(lugar)}
            aria-pressed={esFavorita}
            aria-label={esFavorita ? "Quitar de favoritas" : "Guardar en favoritas"}
            title={esFavorita ? "Quitar de favoritas" : "Guardar en favoritas"}
            className={`grid h-7 w-7 place-items-center rounded-full border transition-colors ${
              esFavorita
                ? "border-acento/40 text-acento"
                : "border-linea text-suave hover:border-suave/50 hover:text-texto"
            }`}
          >
            <Star
              size={13}
              strokeWidth={2.2}
              className={esFavorita ? "estrella-on fill-current" : ""}
              aria-hidden="true"
            />
          </button>
          {ciudad && (
            <button
              type="button"
              onClick={onMiUbicacion}
              aria-label="Volver a mi ubicación"
              title="Volver a mi ubicación"
              className="inline-flex h-7 w-7 shrink-0 items-center justify-center gap-1.5 rounded-full border border-linea text-xs text-suave transition-colors hover:border-suave/50 hover:text-texto sm:w-auto sm:px-2.5"
            >
              <LocateFixed size={12} strokeWidth={2.2} aria-hidden="true" />
              {/* En celular queda solo el ícono, así entra el nombre de la ciudad */}
              <span className="hidden sm:inline">Mi ubicación</span>
            </button>
          )}
        </div>
      </div>

      <div className="mt-8 flex items-start gap-4">
        <p className="text-[5.5rem] font-light leading-[0.85] tracking-[-0.05em] sm:text-[7rem] lg:text-[8.5rem]">
          {t(main.temp)}
          <span className="ml-1 align-top text-[0.3em] font-normal tracking-normal text-suave">
            °{unidad}
          </span>
        </p>
        <IconoClima
          id={estado?.id}
          icono={estado?.icon}
          strokeWidth={1.2}
          className="mt-1 h-14 w-14 shrink-0 text-acento sm:h-16 sm:w-16 lg:mt-2 lg:h-[76px] lg:w-[76px]"
        />
      </div>

      <p className="mt-5 text-lg text-texto/90">{descripcion}</p>

      <dl className="mt-8 grid grid-cols-3 gap-4 border-t border-linea pt-5 md:mt-auto">
        <Dato
          nombre="Sensación"
          indice={0}
          extra={<Barra valor={(main.feels_like + 10) / 50} retraso={150} />}
        >
          <Contador valor={t(main.feels_like)} sufijo="°" />
        </Dato>
        <Dato nombre="Humedad" indice={1} extra={<Barra valor={main.humidity / 100} retraso={230} />}>
          <Contador valor={main.humidity} sufijo="%" />
        </Dato>
        <Dato
          nombre="Mín / Máx"
          indice={2}
          extra={<Rango actual={main.temp} min={main.temp_min} max={main.temp_max} retraso={310} />}
        >
          <Contador valor={t(main.temp_min)} sufijo="°" /> /{" "}
          <Contador valor={t(main.temp_max)} sufijo="°" />
        </Dato>
      </dl>
    </section>
  );
}