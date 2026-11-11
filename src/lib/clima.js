// Datos del clima (Open-Meteo) y buscador de ciudades (OpenWeather)

export const API_KEY = import.meta.env.VITE_OWM_API_KEY;
const BASE = "https://api.openweathermap.org";

async function pedir(url) {
  const res = await fetch(url);
  if (!res.ok) {
    if (res.status === 401) throw new Error("clave");
    throw new Error("servicio");
  }
  return res.json();
}

// ---- Datos del clima: Open-Meteo (gratis, sin clave, modelos de alta resolución en todo el mundo) ----
const METEO = "https://api.open-meteo.com/v1/forecast";
const AIRE = "https://air-quality-api.open-meteo.com/v1/air-quality";

// Códigos del tiempo de Open-Meteo (WMO) → código equivalente de los íconos + descripción
const CODIGOS = {
  0: [800, "Despejado"],
  1: [801, "Mayormente despejado"],
  2: [802, "Parcialmente nuboso"],
  3: [804, "Nublado"],
  45: [741, "Niebla"],
  48: [741, "Niebla con escarcha"],
  51: [300, "Llovizna débil"],
  53: [301, "Llovizna"],
  55: [302, "Llovizna intensa"],
  56: [311, "Llovizna helada"],
  57: [311, "Llovizna helada intensa"],
  61: [500, "Lluvia débil"],
  63: [501, "Lluvia moderada"],
  65: [502, "Lluvia intensa"],
  66: [511, "Lluvia helada"],
  67: [511, "Lluvia helada intensa"],
  71: [600, "Nevada débil"],
  73: [601, "Nevada"],
  75: [602, "Nevada intensa"],
  77: [600, "Granos de nieve"],
  80: [520, "Chaparrones débiles"],
  81: [521, "Chaparrones"],
  82: [522, "Chaparrones fuertes"],
  85: [620, "Chubascos de nieve"],
  86: [621, "Chubascos de nieve fuertes"],
  95: [211, "Tormenta"],
  96: [202, "Tormenta con granizo"],
  99: [202, "Tormenta con granizo fuerte"],
};

function estadoDe(codigo, esDeDia = true) {
  const [id, description] = CODIGOS[codigo] ?? [804, "Nublado"];
  return { id, description, icon: esDeDia ? "01d" : "01n" };
}

// Índice europeo de calidad del aire → escala de 1 a 5
function nivelAire(indice) {
  if (indice == null) return 1;
  if (indice <= 20) return 1;
  if (indice <= 40) return 2;
  if (indice <= 60) return 3;
  if (indice <= 80) return 4;
  return 5;
}

async function pedirJson(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error("servicio");
  return res.json();
}

// Nombre del lugar para "Mi ubicación" (usa la clave de OpenWeather solo para esto y el buscador)
async function nombreLugar(lat, lon) {
  try {
    const datos = await pedir(`${BASE}/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${API_KEY}`);
    const c = datos?.[0];
    return c ? { nombre: c.local_names?.es || c.name, pais: c.country } : null;
  } catch (e) {
    if (e.message === "clave") throw e;
    return null;
  }
}

// ¿Llueve, llovizna, nieva o hay tormenta? (códigos 200 a 699)
const esPrecipitacion = (id) => id >= 200 && id < 700;

// Arma el aviso: si ya llueve, hasta cuándo; si no, desde qué hora es probable
function avisoLluvia(clima, horas) {
  const id = clima.weather[0].id;
  if (esPrecipitacion(id)) {
    const fin = horas.find((h) => !esPrecipitacion(h.weather[0].id) && h.pop < 0.4);
    return { ahora: true, hasta: fin?.dt ?? null, nieve: id >= 600 };
  }
  const inicio = horas.find((h) => esPrecipitacion(h.weather[0].id) && h.pop >= 0.4) ??
    horas.find((h) => h.pop >= 0.6);
  if (!inicio) return null;
  const idInicio = inicio.weather[0].id;
  return {
    ahora: false,
    desde: inicio.dt,
    prob: Math.round(inicio.pop * 100),
    nieve: idInicio >= 600 && idInicio < 700,
  };
}

const DIAS_SEMANA = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];

export async function traerClima(lat, lon) {
  const ubic = `latitude=${lat}&longitude=${lon}`;
  const actual =
    "temperature_2m,relative_humidity_2m,apparent_temperature,is_day,weather_code,wind_speed_10m,wind_direction_10m,wind_gusts_10m,uv_index";
  const porHora = "temperature_2m,weather_code,precipitation_probability,wind_speed_10m,is_day";
  const porDia =
    "weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,sunrise,sunset,uv_index_max";

  const [meteo, aire, lugar] = await Promise.all([
    pedirJson(
      `${METEO}?${ubic}&current=${actual}&hourly=${porHora}&daily=${porDia}` +
        "&timezone=auto&timeformat=unixtime&wind_speed_unit=ms&forecast_days=7",
    ),
    // Si la calidad del aire falla, el resto de la página igual se muestra
    pedirJson(
      `${AIRE}?${ubic}&current=european_aqi,pm2_5,pm10,ozone,nitrogen_dioxide,sulphur_dioxide,carbon_monoxide&timezone=auto`,
    ).catch(() => null),
    nombreLugar(lat, lon),
  ]);

  const desfase = meteo.utc_offset_seconds ?? 0;
  const c = meteo.current;
  const d = meteo.daily;
  const h = meteo.hourly;

  // Mismo formato que ya usan los componentes
  const clima = {
    dt: c.time,
    timezone: desfase,
    coord: { lat, lon },
    name: lugar?.nombre ?? "Tu ubicación",
    sys: { country: lugar?.pais ?? "", sunrise: d.sunrise[0], sunset: d.sunset[0] },
    weather: [estadoDe(c.weather_code, c.is_day === 1)],
    main: {
      temp: c.temperature_2m,
      feels_like: c.apparent_temperature,
      temp_min: d.temperature_2m_min[0],
      temp_max: d.temperature_2m_max[0],
      humidity: c.relative_humidity_2m,
    },
    wind: { speed: c.wind_speed_10m, deg: c.wind_direction_10m, gust: c.wind_gusts_10m },
    uv: { actual: c.uv_index ?? 0, max: d.uv_index_max?.[0] ?? 0 },
  };

  // Próximas horas, de a una hora
  const desde = h.time.findIndex((t) => t > c.time);
  const pronostico = h.time.slice(desde, desde + 12).map((t, i) => {
    const j = desde + i;
    return {
      dt: t,
      main: { temp: h.temperature_2m[j] },
      weather: [estadoDe(h.weather_code[j], h.is_day[j] === 1)],
      pop: (h.precipitation_probability[j] ?? 0) / 100,
      wind: { speed: h.wind_speed_10m[j] },
    };
  });

  // Próximos días (hoy + 6)
  const dias = d.time.slice(0, 7).map((t, i) => ({
    clave: String(t),
    nombre: i === 0 ? "Hoy" : DIAS_SEMANA[enZona(t + 43200, desfase).getUTCDay()],
    min: Math.round(d.temperature_2m_min[i]),
    max: Math.round(d.temperature_2m_max[i]),
    lluvia: Math.round(d.precipitation_probability_max[i] ?? 0),
    estado: estadoDe(d.weather_code[i]),
  }));

  const a = aire?.current;
  const calidad = a
    ? {
        main: { aqi: nivelAire(a.european_aqi) },
        components: {
          pm2_5: a.pm2_5,
          pm10: a.pm10,
          o3: a.ozone,
          no2: a.nitrogen_dioxide,
          so2: a.sulphur_dioxide,
          co: a.carbon_monoxide,
        },
      }
    : null;

  return { clima, aire: calidad, pronostico, dias, aviso: avisoLluvia(clima, pronostico) };
}

// Busca ciudades por nombre (para el buscador)
const regiones =
  typeof Intl !== "undefined" && Intl.DisplayNames
    ? new Intl.DisplayNames(["es"], { type: "region" })
    : null;

export async function sugerirCiudades(texto, senal) {
  const res = await fetch(
    `${BASE}/geo/1.0/direct?q=${encodeURIComponent(texto)}&limit=6&appid=${API_KEY}`,
    { signal: senal },
  );
  if (!res.ok) throw new Error("servicio");
  const datos = await res.json();
  const vistos = new Set();
  return datos
    .map((c) => ({
      nombre: c.local_names?.es || c.name,
      region: [c.state, regiones?.of(c.country) ?? c.country].filter(Boolean).join(", "),
      pais: c.country,
      lat: c.lat,
      lon: c.lon,
    }))
    .filter((c) => {
      const clave = `${c.nombre}|${c.region}`;
      if (vistos.has(clave)) return false;
      vistos.add(clave);
      return true;
    });
}

// m/s → km/h
export const aKmh = (ms) => Math.round((ms ?? 0) * 3.6);

const PUNTOS = [
  "norte",
  "noreste",
  "este",
  "sureste",
  "sur",
  "suroeste",
  "oeste",
  "noroeste",
];
const SIGLAS = ["N", "NE", "E", "SE", "S", "SO", "O", "NO"];

export function direccion(grados = 0) {
  const i = Math.round((((grados % 360) + 360) % 360) / 45) % 8;
  return { nombre: PUNTOS[i], sigla: SIGLAS[i] };
}

// Escala de Beaufort simplificada, en palabras
export function intensidadViento(kmh) {
  if (kmh < 2) return "Calma";
  if (kmh < 12) return "Suave";
  if (kmh < 29) return "Moderada";
  if (kmh < 50) return "Fuerte";
  if (kmh < 75) return "Temporal";
  return "Muy fuerte";
}

export const NIVELES_AIRE = [
  { nivel: 1, nombre: "Muy buena", consejo: "Ideal para actividades al aire libre." },
  { nivel: 2, nombre: "Buena", consejo: "Sin riesgos para la mayoría de las personas." },
  { nivel: 3, nombre: "Moderada", consejo: "Personas sensibles: limiten el esfuerzo prolongado afuera." },
  { nivel: 4, nombre: "Mala", consejo: "Conviene reducir la actividad intensa al aire libre." },
  { nivel: 5, nombre: "Muy mala", consejo: "Evitá la actividad física afuera." },
];

// Referencias de la OMS (2021, promedio 24 h) en μg/m³
export const CONTAMINANTES = [
  { clave: "pm2_5", nombre: "PM2.5", detalle: "Partículas finas", limite: 15 },
  { clave: "pm10", nombre: "PM10", detalle: "Partículas", limite: 45 },
  { clave: "o3", nombre: "O₃", detalle: "Ozono", limite: 100 },
  { clave: "no2", nombre: "NO₂", detalle: "Dióxido de nitrógeno", limite: 25 },
  { clave: "so2", nombre: "SO₂", detalle: "Dióxido de azufre", limite: 40 },
  { clave: "co", nombre: "CO", detalle: "Monóxido de carbono", limite: 4000 },
];

export function formatoValor(v) {
  if (v == null) return "—";
  if (v >= 100) return Math.round(v).toLocaleString("es-AR");
  return v.toLocaleString("es-AR", { maximumFractionDigits: 1 });
}

export function horaLocal(fecha) {
  return fecha.toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit", hour12: false });
}

// ---- Hora de la ciudad (usa el desfase horario de cada lugar) ----

// Devuelve una fecha "corrida" para leerla con getUTC… y obtener la hora local de la ciudad
export const enZona = (unix, desfase = 0) => new Date((unix + desfase) * 1000);

const dosDigitos = (n) => String(n).padStart(2, "0");

export function horaCiudad(unix, desfase) {
  const f = enZona(unix, desfase);
  return `${dosDigitos(f.getUTCHours())}:${dosDigitos(f.getUTCMinutes())}`;
}

// Índice UV en palabras, con su consejo
export function nivelUV(uv) {
  if (uv < 3) return { nombre: "Bajo", consejo: "No hace falta protección.", color: "text-aire-1" };
  if (uv < 6) return { nombre: "Moderado", consejo: "Usá protector si vas a estar mucho afuera.", color: "text-aire-3" };
  if (uv < 8) return { nombre: "Alto", consejo: "Protector, gorra y anteojos de sol.", color: "text-aire-4" };
  if (uv < 11) return { nombre: "Muy alto", consejo: "Evitá el sol del mediodía.", color: "text-aire-5" };
  return { nombre: "Extremo", consejo: "Evitá exponerte al sol.", color: "text-violet-400" };
}

export function duracion(segundos) {
  const h = Math.floor(segundos / 3600);
  const m = Math.round((segundos % 3600) / 60);
  return h ? `${h} h ${dosDigitos(m)} min` : `${m} min`;
}