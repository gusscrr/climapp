import { useEffect, useRef, useState } from "react";
import {
  CloudOff,
  Info,
  KeyRound,
  LocateFixed,
  LocateOff,
  Lock,
  MapPinOff,
  RotateCw,
  Settings,
  ShieldCheck,
} from "lucide-react";

export function Cargando() {
  return (
    <div className="space-y-3" aria-busy="true" aria-label="Cargando el clima">
      <div className="panel grid divide-y divide-linea md:grid-cols-2 md:divide-x md:divide-y-0 [&>*]:p-6 sm:[&>*]:p-8">
        <div>
          <div className="esqueleto h-4 w-32" />
          <div className="esqueleto mt-8 h-24 w-44" />
          <div className="esqueleto mt-5 h-5 w-40" />
          <div className="mt-12 grid grid-cols-3 gap-4">
            <div className="esqueleto h-10" />
            <div className="esqueleto h-10" />
            <div className="esqueleto h-10" />
          </div>
        </div>
        <div className="flex flex-col items-center">
          <div className="esqueleto h-4 w-20 self-start" />
          <div className="esqueleto mt-6 aspect-square w-full max-w-[17rem] !rounded-full" />
        </div>
      </div>
      <div className="panel p-6 sm:p-8">
        <div className="esqueleto h-4 w-32" />
        <div className="esqueleto mt-5 h-10 w-48" />
      </div>
    </div>
  );
}

// Brújula: la aguja busca el norte mientras espera la ubicación
function Brujula() {
  const marcas = Array.from({ length: 24 }, (_, i) => i * 15);
  return (
    <svg viewBox="0 0 120 120" className="h-24 w-24" aria-hidden="true">
      <circle cx="60" cy="60" r="56" className="fill-fondo stroke-linea" strokeWidth="1" />
      {marcas.map((a) => {
        const r = ((a - 90) * Math.PI) / 180;
        const largo = a % 90 === 0 ? 8 : 4;
        return (
          <line
            key={a}
            x1={60 + 50 * Math.cos(r)}
            y1={60 + 50 * Math.sin(r)}
            x2={60 + (50 - largo) * Math.cos(r)}
            y2={60 + (50 - largo) * Math.sin(r)}
            className={a % 90 === 0 ? "stroke-suave" : "stroke-linea"}
            strokeWidth="1.4"
            strokeLinecap="round"
          />
        );
      })}
      <g className="aguja-espera">
        <path d="M60 24 L66 60 L60 56 L54 60 Z" className="fill-acento" />
        <path d="M60 96 L66 60 L60 64 L54 60 Z" className="fill-linea" />
      </g>
      <circle cx="60" cy="60" r="3.5" className="fill-superficie stroke-acento" strokeWidth="2" />
    </svg>
  );
}

// ---- Íconos animados de las señales (14px, trazo del color de acento) ----

// Viento: el mismo ícono de la versión original (meteocons), con las ráfagas que corren
export function IconoViento({ className = "h-3.5 w-4" }) {
  return (
    <svg
      viewBox="9 12 46 40"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="4.5"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <path d="M43.64 20a5 5 0 113.61 8.46h-35.5" className="viento-1" />
      <path d="M29.14 44a5 5 0 103.61-8.46h-21" className="viento-2" />
    </svg>
  );
}

// Temperatura: termómetro con marcas; el mercurio sube y baja
export function IconoTemperatura({ className = "h-3.5 w-3.5" }) {
  return (
    <svg viewBox="0 0 24 24" className={`overflow-visible ${className}`} fill="none" aria-hidden="true">
      <path
        d="M14 4v10.54a4 4 0 1 1-4 0V4a2 2 0 0 1 4 0Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <g stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" opacity="0.7">
        <path d="M17 5.5h2.5" />
        <path d="M17 9h1.8" />
        <path d="M17 12.5h2.5" />
      </g>
      <rect x="10.8" y="5.5" width="2.4" height="12" rx="1.2" fill="currentColor" className="mercurio" />
      <circle cx="12" cy="17.6" r="2.7" fill="currentColor" />
    </svg>
  );
}

// Calidad del aire: la hoja se mece desde el tallo y la nervadura respira
function IconoHoja() {
  return (
    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 overflow-visible" fill="none" aria-hidden="true">
      <g className="hoja" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
        <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" className="nervadura" />
      </g>
    </svg>
  );
}

// Lo que vas a ver, cada uno con su ícono animado
const DATOS = [
  { Icono: IconoViento, titulo: "Viento" },
  { Icono: IconoTemperatura, titulo: "Temperatura" },
  { Icono: IconoHoja, titulo: "Calidad del aire" },
];

// Botón de info con un globo que explica qué pasa con la ubicación
function InfoPrivacidad() {
  const [abierto, setAbierto] = useState(false);
  const caja = useRef(null);

  useEffect(() => {
    if (!abierto) return;
    const cerrar = (e) => {
      if (e.type === "keydown" ? e.key === "Escape" : !caja.current?.contains(e.target)) {
        setAbierto(false);
      }
    };
    document.addEventListener("pointerdown", cerrar);
    document.addEventListener("keydown", cerrar);
    return () => {
      document.removeEventListener("pointerdown", cerrar);
      document.removeEventListener("keydown", cerrar);
    };
  }, [abierto]);

  return (
    <div
      ref={caja}
      className="absolute right-4 top-4 z-10 sm:right-5 sm:top-5"
      // Con mouse se abre al pasar por encima; en celular, al tocar
      onPointerEnter={(e) => e.pointerType === "mouse" && setAbierto(true)}
      onPointerLeave={(e) => e.pointerType === "mouse" && setAbierto(false)}
    >
      <button
        type="button"
        onClick={() => setAbierto((v) => !v)}
        aria-expanded={abierto}
        aria-controls="globo-privacidad"
        className="inline-flex h-7 items-center gap-1.5 rounded-full border border-linea bg-superficie/80 pl-2 pr-2.5 text-[11px] font-medium text-suave backdrop-blur transition-colors hover:border-suave/50 hover:text-texto"
      >
        <Info size={14} strokeWidth={2} className="shrink-0" aria-hidden="true" />
        Privacidad
      </button>

      <div
        id="globo-privacidad"
        role="tooltip"
        className={`globo absolute right-0 top-[calc(100%+8px)] w-64 rounded-xl text-left border border-linea bg-superficie p-4 shadow-[0_16px_40px_-12px_rgb(0_0_0/0.6)] ${
          abierto ? "globo-abierto" : ""
        }`}
      >
        <p className="flex items-center gap-2 text-[13px] font-medium">
          <ShieldCheck size={15} strokeWidth={1.8} className="text-acento" aria-hidden="true" />
          Tu ubicación es privada
        </p>
        <p className="mt-1.5 text-xs leading-relaxed text-suave">
          No la guardamos ni la compartimos. Solo se usa en este momento para mostrarte el clima
          de tu zona.
        </p>
      </div>
    </div>
  );
}

export function PedirUbicacion({ onPermitir, esperando }) {
  return (
    <div className="aparecer panel relative mx-auto mt-2 flex max-w-xl flex-col items-center px-6 pb-12 pt-14 text-center sm:px-12 sm:pb-14 sm:pt-16 md:mt-0">
      <InfoPrivacidad />

      <Brujula />

      <h1 className="mt-8 text-[1.75rem] font-medium leading-tight tracking-tight sm:text-[2rem]">
        Activá tu ubicación
      </h1>
      <p className="mt-3 max-w-md text-balance text-suave">
        Para mostrarte el clima del lugar exacto donde estás.
      </p>

      <ul className="mt-7 flex flex-wrap justify-center gap-2">
        {DATOS.map(({ Icono, titulo }) => (
          <li
            key={titulo}
            className="flex items-center gap-1.5 rounded-full bg-fondo/60 py-1.5 pl-2.5 pr-3 text-xs font-medium ring-1 ring-linea"
          >
            <span className="text-acento">
              <Icono />
            </span>
            {titulo}
          </li>
        ))}
      </ul>

      <button
        type="button"
        onClick={onPermitir}
        disabled={esperando}
        className="mt-9 inline-flex h-9 items-center justify-center gap-1.5 whitespace-nowrap rounded-lg bg-acento px-4 text-[13px] font-medium text-fondo transition-[transform,opacity] hover:opacity-90 active:scale-[0.97] disabled:opacity-60"
      >
        <LocateFixed size={14} strokeWidth={2.2} aria-hidden="true" />
        {esperando ? "Esperando permiso…" : "Permitir ubicación"}
      </button>
    </div>
  );
}

// Diseño común para las pantallas de aviso (bloqueada y errores)
function Aviso({ Icono, tono = "text-aire-4", titulo, texto, pasos, onReintentar, extra, alerta }) {
  return (
    <div
      className="aparecer panel mx-auto mt-2 max-w-xl px-6 py-12 sm:px-12 sm:py-14 md:mt-0"
      role={alerta ? "alert" : undefined}
    >
      <div className="grid h-12 w-12 place-items-center rounded-xl bg-fondo ring-1 ring-linea">
        <Icono size={22} strokeWidth={1.8} className={tono} aria-hidden="true" />
      </div>
      <h1 className="mt-6 text-2xl font-medium tracking-tight sm:text-3xl">{titulo}</h1>
      <p className="mt-3 text-suave">{texto}</p>

      {pasos && (
        <ol className="mt-6 space-y-3">
          {pasos.map((paso, i) => (
            <li key={i} className="flex gap-3">
              <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-fondo text-xs font-medium text-suave ring-1 ring-linea">
                {i + 1}
              </span>
              <span className="pt-0.5 text-sm">{paso}</span>
            </li>
          ))}
        </ol>
      )}

      {(onReintentar || extra) && (
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          {onReintentar && (
            <button
              type="button"
              onClick={onReintentar}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-acento px-5 text-sm font-medium text-fondo transition-[transform,opacity] hover:opacity-90 active:scale-[0.98]"
            >
              <RotateCw size={15} strokeWidth={2.2} aria-hidden="true" />
              Reintentar
            </button>
          )}
          {extra}
        </div>
      )}
    </div>
  );
}

export function UbicacionBloqueada({ onReintentar }) {
  return (
    <Aviso
      Icono={MapPinOff}
      titulo="La ubicación está bloqueada"
      texto="Sin tu ubicación no podemos mostrar el clima. Activala desde el navegador:"
      pasos={[
        <>
          Tocá el candado{" "}
          <Lock size={13} className="mb-0.5 inline text-suave" aria-hidden="true" /> que está a
          la izquierda de la dirección web.
        </>,
        "En Ubicación, elegí Permitir.",
        "Volvé a esta página y tocá Reintentar.",
      ]}
      onReintentar={onReintentar}
    />
  );
}

const ERRORES = {
  clave: {
    Icono: KeyRound,
    titulo: "Falta la clave de OpenWeather",
    texto: "Agregá VITE_OWM_API_KEY en el archivo .env del proyecto y reiniciá el servidor.",
    sinReintentar: true,
  },
  ubicacion: {
    Icono: LocateOff,
    titulo: "No pudimos encontrar tu ubicación",
    texto: "El permiso está dado, pero tu dispositivo no está enviando la ubicación.",
    pasos: [
      <>
        <span className="font-medium">En la PC:</span>{" "}
        <span className="text-suave">
          abrí Configuración de Windows, entrá a Privacidad y seguridad y activá Ubicación.
        </span>
      </>,
      <>
        <span className="font-medium">En el celular:</span>{" "}
        <span className="text-suave">encendé la ubicación desde el panel de accesos rápidos.</span>
      </>,
    ],
    windows: true,
  },
  servicio: {
    Icono: CloudOff,
    titulo: "No pudimos traer los datos",
    texto: "El servicio del clima no respondió. Revisá tu conexión a internet y probá de nuevo.",
  },
};

const ES_WINDOWS = typeof navigator !== "undefined" && /Windows/i.test(navigator.userAgent);

export function ErrorClima({ tipo, onReintentar }) {
  const e = ERRORES[tipo] ?? ERRORES.servicio;
  return (
    <Aviso
      Icono={e.Icono}
      titulo={e.titulo}
      texto={e.texto}
      pasos={e.pasos}
      onReintentar={e.sinReintentar ? null : onReintentar}
      extra={
        e.windows && ES_WINDOWS ? (
          // Abre directo la pantalla de Ubicación de Windows
          <a
            href="ms-settings:privacy-location"
            className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-linea px-5 text-sm font-medium transition-colors hover:border-suave/60 hover:bg-fondo/60"
          >
            <Settings size={15} strokeWidth={2} aria-hidden="true" />
            Abrir configuración
          </a>
        ) : null
      }
      alerta
    />
  );
}