import { CONTAMINANTES, NIVELES_AIRE, formatoValor } from "../lib/clima";
import { Barra } from "./Datos";
import {
  Combustion,
  HojaAire,
  Industria,
  Ozono,
  ParticulasFinas,
  ParticulasGruesas,
  Transito,
} from "./IconosAire";

// Cada contaminante con su ícono animado (de dónde viene)
const ICONOS_CONTAMINANTES = {
  pm2_5: ParticulasFinas,
  pm10: ParticulasGruesas,
  o3: Ozono,
  no2: Transito,
  so2: Industria,
  co: Combustion,
};

const TEXTO = {
  1: "text-aire-1",
  2: "text-aire-2",
  3: "text-aire-3",
  4: "text-aire-4",
  5: "text-aire-5",
};
const PUNTO = {
  1: "bg-aire-1",
  2: "bg-aire-2",
  3: "bg-aire-3",
  4: "bg-aire-4",
  5: "bg-aire-5",
};

const DEGRADE =
  "linear-gradient(90deg, rgb(var(--aire-1)), rgb(var(--aire-2)), rgb(var(--aire-3)), rgb(var(--aire-4)), rgb(var(--aire-5)))";

function Escala({ nivel }) {
  const posicion = ((nivel - 0.5) / 5) * 100;
  return (
    <div role="img" aria-label={`Nivel ${nivel} de 5`}>
      <div className="relative h-1.5 rounded-full" style={{ background: DEGRADE }}>
        <span
          className="absolute top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-[3px] border-superficie bg-texto ring-1 ring-linea"
          style={{ left: `${posicion}%` }}
        />
      </div>
      <div className="mt-3 hidden text-xs text-suave sm:flex" aria-hidden="true">
        {NIVELES_AIRE.map((n) => (
          <span
            key={n.nivel}
            className={`flex-1 text-center ${n.nivel === nivel ? "font-medium text-texto" : ""}`}
          >
            {n.nombre}
          </span>
        ))}
      </div>
    </div>
  );
}

function Contaminante({ clave, nombre, detalle, valor, limite, indice }) {
  const Icono = ICONOS_CONTAMINANTES[clave];
  const proporcion = valor / limite;
  const supera = proporcion > 1;
  const ancho = Math.max(Math.min(proporcion, 1) * 100, 2);

  return (
    <div className="py-4">
      <div className="flex items-center justify-between gap-3">
        <dt className="flex min-w-0 items-center gap-2.5">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-fondo/70 text-acento ring-1 ring-linea">
            <Icono />
          </span>
          <span className="min-w-0">
            <span className="block truncate font-medium leading-tight">{nombre}</span>
            <span className="block truncate text-xs text-suave">{detalle}</span>
          </span>
        </dt>
        <dd className="shrink-0 text-right">
          <span className="font-medium">{formatoValor(valor)}</span>
          <span className="ml-1 text-xs text-suave">μg/m³</span>
        </dd>
      </div>
      {/* La barra crece desde cero al aparecer, una detrás de otra */}
      <Barra
        valor={ancho / 100}
        retraso={200 + indice * 90}
        color={supera ? "bg-aire-4" : "bg-acento"}
        className="mt-3"
      />
      <p className={`mt-2 text-xs ${supera ? "text-aire-4" : "text-suave"}`}>
        {supera
          ? `${proporcion.toLocaleString("es-AR", { maximumFractionDigits: 1 })} veces la guía OMS`
          : `${Math.round(proporcion * 100)}% de la guía OMS`}
      </p>
    </div>
  );
}

export default function CalidadAire({ aire }) {
  if (!aire) {
    return (
      <section className="panel p-6 sm:p-8">
        <h2 className="text-sm font-medium text-suave">Calidad del aire</h2>
        <p className="mt-3">No hay datos de calidad del aire para esta zona.</p>
      </section>
    );
  }

  const nivel = aire.main.aqi;
  const info = NIVELES_AIRE[nivel - 1] ?? NIVELES_AIRE[0];

  return (
    <section aria-labelledby="titulo-aire" className="panel p-6 sm:p-8">
      <div className="grid gap-8 md:grid-cols-[1fr_1.3fr] md:items-end md:gap-14">
        <div>
          <h2 id="titulo-aire" className="flex items-center gap-1.5 text-sm font-medium text-suave">
            <span className="text-acento">
              <HojaAire size={17} />
            </span>
            Calidad del aire
          </h2>
          <p className="mt-4 flex items-center gap-3 text-3xl font-medium tracking-tight sm:text-4xl">
            <span className="relative grid h-2.5 w-2.5 place-items-center" aria-hidden="true">
              <span className={`ax-latido absolute inset-0 rounded-full ${PUNTO[nivel]}`} />
              <span className={`relative h-2.5 w-2.5 rounded-full ${PUNTO[nivel]}`} />
            </span>
            <span className={TEXTO[nivel]}>{info.nombre}</span>
          </p>
          <p className="mt-2 max-w-sm text-sm text-suave">{info.consejo}</p>
        </div>
        <Escala nivel={nivel} />
      </div>

      <dl className="mt-8 grid divide-y divide-linea border-t border-linea md:grid-cols-2 md:gap-x-10 md:divide-y-0 lg:grid-cols-3">
        {CONTAMINANTES.map((c, i) => (
          <Contaminante
            key={c.clave}
            indice={i}
            clave={c.clave}
            nombre={c.nombre}
            detalle={c.detalle}
            valor={aire.components[c.clave]}
            limite={c.limite}
          />
        ))}
      </dl>
    </section>
  );
}