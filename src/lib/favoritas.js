// Ciudades favoritas guardadas en el navegador (compartidas entre el buscador y la tarjeta)
const CLAVE = "climapp-favoritas";
const oyentes = new Set();
let lista = null;

export const mismaCiudad = (a, b) =>
  Math.abs(a.lat - b.lat) < 0.01 && Math.abs(a.lon - b.lon) < 0.01;

function leer() {
  if (lista) return lista;
  try {
    lista = JSON.parse(localStorage.getItem(CLAVE)) ?? [];
  } catch {
    lista = [];
  }
  return lista;
}

export const favoritas = {
  obtener: leer,
  suscribir(fn) {
    oyentes.add(fn);
    return () => oyentes.delete(fn);
  },
  // Agrega la ciudad si no está; si ya está, la saca
  alternar(c) {
    const actual = leer();
    const ciudad = { nombre: c.nombre, region: c.region, pais: c.pais, lat: c.lat, lon: c.lon };
    lista = actual.some((f) => mismaCiudad(f, c))
      ? actual.filter((f) => !mismaCiudad(f, c))
      : [ciudad, ...actual].slice(0, 6);
    try {
      localStorage.setItem(CLAVE, JSON.stringify(lista));
    } catch {
      // sin almacenamiento: queda solo mientras la página esté abierta
    }
    oyentes.forEach((fn) => fn());
  },
};