// Íconos del clima animados (mismo dibujo que los de lucide, con movimiento propio)

const NUBE_BAJA = "M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242";

function Svg({ size, strokeWidth, className, children }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`overflow-visible ${className}`}
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

// Despejado de día: los rayos giran lento y el sol respira
function Sol(props) {
  return (
    <Svg {...props}>
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
    </Svg>
  );
}

// Despejado de noche: la luna se mece y titilan dos estrellas
function Luna(props) {
  return (
    <Svg {...props}>
      <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" className="wx-luna" />
      <path d="M4.5 3.5v2M3.5 4.5h2" className="wx-estrella" />
      <path d="M19 5v2M18 6h2" className="wx-estrella wx-estrella-2" />
    </Svg>
  );
}

// Algo de nubes de día: los rayos brillan uno por uno y la nube flota
function NubeSol(props) {
  return (
    <Svg {...props}>
      <path d="M12 2v2" className="wx-rayo" />
      <path d="m19.07 4.93-1.41 1.41" className="wx-rayo wx-rayo-2" />
      <path d="M20 12h2" className="wx-rayo wx-rayo-3" />
      <path d="m4.93 4.93 1.41 1.41" className="wx-rayo wx-rayo-4" />
      <path d="M15.947 12.65a4 4 0 0 0-5.925-4.128" />
      <path d="M13 22H7a5 5 0 1 1 4.9-6H13a3 3 0 0 1 0 6Z" className="wx-nube" />
    </Svg>
  );
}

// Algo de nubes de noche: la luna se mece detrás y la nube flota
function NubeLuna(props) {
  return (
    <Svg {...props}>
      <path
        d="M10.188 8.5A6 6 0 0 1 16 4a1 1 0 0 0 6 6 6 6 0 0 1-3 5.197"
        className="wx-luna-chica"
      />
      <path d="M13 16a3 3 0 1 1 0 6H7a5 5 0 1 1 4.9-6Z" className="wx-nube" />
    </Svg>
  );
}

// Lluvia: las gotas caen sin parar
function Lluvia(props) {
  return (
    <Svg {...props}>
      <path d={NUBE_BAJA} />
      <path d="M8 14v6" className="wx-gota" />
      <path d="M12 16v6" className="wx-gota wx-gota-2" />
      <path d="M16 14v6" className="wx-gota wx-gota-3" />
    </Svg>
  );
}

// Llovizna: gotitas cortas que caen
function Llovizna(props) {
  return (
    <Svg {...props}>
      <path d={NUBE_BAJA} />
      <path d="M8 15v1" className="wx-gota" />
      <path d="M12 17v1" className="wx-gota wx-gota-2" />
      <path d="M16 15v1" className="wx-gota wx-gota-3" />
      <path d="M8 19v1" className="wx-gota wx-gota-4" />
      <path d="M16 19v1" className="wx-gota wx-gota-5" />
    </Svg>
  );
}

// Nieve: copos que bajan despacio
function Nieve(props) {
  return (
    <Svg {...props}>
      <path d={NUBE_BAJA} />
      <path d="M8 15h.01" className="wx-copo" />
      <path d="M12 17h.01" className="wx-copo wx-copo-2" />
      <path d="M16 15h.01" className="wx-copo wx-copo-3" />
      <path d="M8 19h.01" className="wx-copo wx-copo-4" />
      <path d="M16 19h.01" className="wx-copo wx-copo-5" />
    </Svg>
  );
}

// Tormenta: el rayo destella
function Tormenta(props) {
  return (
    <Svg {...props}>
      <path d="M6 16.326A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 .5 8.973" />
      <path d="m13 12-3 5h4l-3 5" className="wx-relampago" />
    </Svg>
  );
}

// Niebla: las capas se deslizan en sentidos opuestos
function Niebla(props) {
  return (
    <Svg {...props}>
      <path d={NUBE_BAJA} />
      <path d="M16 17H7" className="wx-bruma" />
      <path d="M17 21H9" className="wx-bruma wx-bruma-2" />
    </Svg>
  );
}

function elegir(id, icono) {
  const noche = icono?.endsWith("n");
  if (id >= 200 && id < 300) return Tormenta;
  if (id >= 300 && id < 400) return Llovizna;
  if (id >= 500 && id < 600) return Lluvia;
  if (id >= 600 && id < 700) return Nieve;
  if (id >= 700 && id < 800) return Niebla;
  if (id === 800) return noche ? Luna : Sol;
  // Cualquier nubosidad: nube con sol (o con luna de noche)
  return noche ? NubeLuna : NubeSol;
}

export default function IconoClima({ id, icono, size = 40, strokeWidth = 1.4, className = "" }) {
  const Icono = elegir(id, icono);
  return <Icono size={size} strokeWidth={strokeWidth} className={className} />;
}