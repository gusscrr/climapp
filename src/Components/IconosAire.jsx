// Íconos animados de calidad del aire (cada contaminante muestra de dónde viene)

function Svg({ children, size = 20 }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="overflow-visible"
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

// PM2.5: partículas finas que flotan
export function ParticulasFinas() {
  const puntos = [
    [6, 7], [13, 5], [18, 9], [8, 14], [15, 15], [11, 19], [19, 18], [4, 18],
  ];
  return (
    <Svg>
      {puntos.map(([x, y], i) => (
        <circle
          key={i}
          cx={x}
          cy={y}
          r="1.3"
          fill="currentColor"
          stroke="none"
          className="ax-particula"
          style={{ animationDelay: `${-i * 0.45}s` }}
        />
      ))}
    </Svg>
  );
}

// PM10: partículas más grandes que flotan más lento
export function ParticulasGruesas() {
  const puntos = [
    [7, 8], [16, 7], [11, 15], [18, 17], [5, 18],
  ];
  return (
    <Svg>
      {puntos.map(([x, y], i) => (
        <circle
          key={i}
          cx={x}
          cy={y}
          r="2"
          className="ax-particula ax-particula-lenta"
          style={{ animationDelay: `${-i * 0.7}s` }}
        />
      ))}
    </Svg>
  );
}

// O₃: el ozono se forma con el sol (rayos que giran lento)
export function Ozono() {
  return (
    <Svg>
      <circle cx="12" cy="12" r="4" />
      <g className="ax-rayos">
        <path d="M12 3v1" />
        <path d="M12 20v1" />
        <path d="M3 12h1" />
        <path d="M20 12h1" />
        <path d="m18.364 5.636-.707.707" />
        <path d="m6.343 17.657-.707.707" />
        <path d="m5.636 5.636.707.707" />
        <path d="m17.657 17.657.707.707" />
      </g>
    </Svg>
  );
}

// NO₂: viene del tránsito (auto en marcha que larga humo)
export function Transito() {
  return (
    <Svg>
      <g className="ax-motor">
        <path d="m21 8-2 2-1.5-3.7A2 2 0 0 0 15.646 5H8.4a2 2 0 0 0-1.903 1.257L5 10 3 8" />
        <rect width="18" height="8" x="3" y="10" rx="2" />
        <path d="M7 14h.01" />
        <path d="M17 14h.01" />
        <path d="M5 18v2" />
        <path d="M19 18v2" />
      </g>
      <circle cx="22" cy="19" r="1.2" className="ax-escape" />
      <circle cx="22" cy="19" r="1.2" className="ax-escape ax-escape-2" />
    </Svg>
  );
}

// SO₂: viene de la industria (la chimenea larga humo)
export function Industria() {
  return (
    <Svg>
      <g transform="translate(2.4 5) scale(0.8)">
        <path d="M2 20a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8l-7 5V8l-7 5V4a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z" />
        <path d="M17 18h1" />
        <path d="M12 18h1" />
        <path d="M7 18h1" />
      </g>
      <circle cx="5.6" cy="4" r="1.3" className="ax-humo" />
      <circle cx="5.6" cy="4" r="1.3" className="ax-humo ax-humo-2" />
      <circle cx="5.6" cy="4" r="1.3" className="ax-humo ax-humo-3" />
    </Svg>
  );
}

// CO: viene de la combustión (fogata quieta y cenizas que suben)
export function Combustion() {
  return (
    <Svg>
      <path d="M12 2c1 3 2.5 3.5 3.5 4.5A5 5 0 0 1 17 10a5 5 0 1 1-10 0c0-.3 0-.6.1-.9a2 2 0 1 0 3.3-2C8 4.5 11 2 12 2Z" />
      <path d="m5 22 14-4" />
      <path d="m5 18 14 4" />
      <circle cx="10" cy="3" r="1.15" fill="currentColor" stroke="none" className="ax-ceniza" />
      <circle cx="14.5" cy="4" r="1" fill="currentColor" stroke="none" className="ax-ceniza ax-ceniza-2" />
      <circle cx="12" cy="2" r="1.1" fill="currentColor" stroke="none" className="ax-ceniza ax-ceniza-3" />
      <circle cx="16" cy="2.5" r="0.9" fill="currentColor" stroke="none" className="ax-ceniza ax-ceniza-4" />
      <circle cx="8.5" cy="5" r="0.85" fill="currentColor" stroke="none" className="ax-ceniza ax-ceniza-5" />
    </Svg>
  );
}

// Encabezado: la hoja se mece
export function HojaAire({ size = 15 }) {
  return (
    <Svg size={size}>
      <g className="ax-hoja">
        <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
        <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
      </g>
    </Svg>
  );
}