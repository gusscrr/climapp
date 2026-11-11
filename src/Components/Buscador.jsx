import { Fragment, useEffect, useRef, useState } from "react";
import { Clock, LocateFixed, Search, Star, X } from "lucide-react";
import { sugerirCiudades } from "../lib/clima";
import { mismaCiudad } from "../lib/favoritas";
import useFavoritas from "../hooks/useFavoritas";

const CLAVE_RECIENTES = "climapp-recientes";

function leerRecientes() {
  try {
    return JSON.parse(localStorage.getItem(CLAVE_RECIENTES)) ?? [];
  } catch {
    return [];
  }
}

function guardarReciente(c) {
  try {
    const lista = [c, ...leerRecientes().filter((r) => r.lat !== c.lat || r.lon !== c.lon)];
    localStorage.setItem(CLAVE_RECIENTES, JSON.stringify(lista.slice(0, 4)));
  } catch {
    // sin almacenamiento: no pasa nada
  }
}

// Resalta la parte del nombre que coincide con lo escrito
function Resaltado({ texto, busqueda }) {
  const sinTildes = (s) => s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  const i = sinTildes(texto).indexOf(sinTildes(busqueda.trim()));
  if (!busqueda.trim() || i < 0) return texto;
  const fin = i + busqueda.trim().length;
  return (
    <>
      {texto.slice(0, i)}
      <span className="text-acento">{texto.slice(i, fin)}</span>
      {texto.slice(fin)}
    </>
  );
}

// Buscador de ciudades integrado en el encabezado
export default function Buscador({ onElegir, onMiUbicacion, enOtraCiudad }) {
  const [texto, setTexto] = useState("");
  const [abierto, setAbierto] = useState(false);
  const [resultados, setResultados] = useState([]);
  const [buscando, setBuscando] = useState(false);
  const [activo, setActivo] = useState(0);
  const [recientes, setRecientes] = useState([]);
  const caja = useRef(null);
  const entrada = useRef(null);
  const favs = useFavoritas();

  // Atajo Ctrl + K (o ⌘ + K) para ir al buscador
  useEffect(() => {
    const atajo = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        entrada.current?.focus();
      }
    };
    window.addEventListener("keydown", atajo);
    return () => window.removeEventListener("keydown", atajo);
  }, []);

  // Cerrar al tocar afuera
  useEffect(() => {
    if (!abierto) return;
    const fuera = (e) => !caja.current?.contains(e.target) && setAbierto(false);
    document.addEventListener("pointerdown", fuera);
    return () => document.removeEventListener("pointerdown", fuera);
  }, [abierto]);

  // Busca mientras escribís (espera 250 ms)
  useEffect(() => {
    const q = texto.trim();
    if (q.length < 2) {
      setResultados([]);
      setBuscando(false);
      return;
    }
    setBuscando(true);
    const control = new AbortController();
    const id = setTimeout(async () => {
      try {
        setResultados(await sugerirCiudades(q, control.signal));
        setActivo(0);
      } catch (e) {
        if (e.name !== "AbortError") setResultados([]);
      } finally {
        if (!control.signal.aborted) setBuscando(false);
      }
    }, 250);
    return () => {
      clearTimeout(id);
      control.abort();
    };
  }, [texto]);

  const conTexto = texto.trim().length >= 2;
  const opciones = conTexto
    ? resultados.map((c) => ({ tipo: "ciudad", ...c }))
    : [
        ...(enOtraCiudad ? [{ tipo: "ubicacion" }] : []),
        ...favs.map((c) => ({ tipo: "favorita", ...c })),
        // Las recientes que ya son favoritas no se repiten
        ...recientes
          .filter((r) => !favs.some((f) => mismaCiudad(f, r)))
          .map((c) => ({ tipo: "reciente", ...c })),
      ];
  const mostrarPanel = abierto && (opciones.length > 0 || (conTexto && !buscando));

  function abrir() {
    setRecientes(leerRecientes());
    setActivo(0);
    setAbierto(true);
  }

  function cerrar() {
    setAbierto(false);
    setTexto("");
    entrada.current?.blur();
  }

  function elegir(op) {
    if (!op) return;
    if (op.tipo === "ubicacion") onMiUbicacion();
    else {
      const c = { nombre: op.nombre, region: op.region, pais: op.pais, lat: op.lat, lon: op.lon };
      guardarReciente(c);
      onElegir(c);
    }
    cerrar();
  }

  function teclas(e) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActivo((i) => Math.min(i + 1, opciones.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActivo((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      elegir(opciones[activo]);
    } else if (e.key === "Escape") {
      cerrar();
    }
  }

  return (
    <div ref={caja} className="relative w-full">
      {/* Campo */}
      <div
        className={`flex h-10 items-center gap-2.5 rounded-xl border bg-superficie px-3 transition-colors ${
          abierto ? "border-suave/60" : "border-linea hover:border-suave/40"
        }`}
      >
        <Search size={16} strokeWidth={2} className="shrink-0 text-suave" aria-hidden="true" />
        <input
          ref={entrada}
          value={texto}
          onChange={(e) => {
            setTexto(e.target.value);
            setAbierto(true);
          }}
          onFocus={abrir}
          onKeyDown={teclas}
          placeholder="Buscar ciudad"
          autoComplete="off"
          spellCheck="false"
          role="combobox"
          aria-label="Buscar ciudad"
          aria-expanded={mostrarPanel}
          aria-controls="lista-ciudades"
          aria-activedescendant={mostrarPanel && opciones[activo] ? `op-${activo}` : undefined}
          className="h-full min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-suave"
        />
        {buscando ? (
          <span className="h-3.5 w-3.5 shrink-0 animate-spin rounded-full border-2 border-linea border-t-acento" />
        ) : texto ? (
          <button
            type="button"
            onClick={() => {
              setTexto("");
              entrada.current?.focus();
            }}
            aria-label="Borrar búsqueda"
            className="grid h-6 w-6 shrink-0 place-items-center rounded-md text-suave transition-colors hover:bg-linea/60 hover:text-texto"
          >
            <X size={14} />
          </button>
        ) : (
          <kbd className="tecla hidden shrink-0 text-suave md:inline">Ctrl K</kbd>
        )}
      </div>

      {/* Resultados */}
      <div
        className={`desplegable absolute inset-x-0 top-[calc(100%+6px)] z-40 md:left-auto md:w-[24rem] overflow-hidden rounded-xl border border-linea bg-superficie shadow-[0_18px_40px_-14px_rgb(0_0_0/0.65)] ${
          mostrarPanel ? "desplegable-abierto" : ""
        }`}
      >
        <ul id="lista-ciudades" role="listbox" className="p-1.5">
          {opciones.map((op, i) => {
            const esUbicacion = op.tipo === "ubicacion";
            const esFavorita = op.tipo === "favorita";
            const Icono = esUbicacion
              ? LocateFixed
              : esFavorita
                ? Star
                : op.tipo === "reciente"
                  ? Clock
                  : null;
            // Título de grupo antes de la primera favorita y de la primera reciente
            const titulo = { favorita: "Favoritas", reciente: "Recientes" }[op.tipo];
            const primeroDelGrupo = titulo && opciones[i - 1]?.tipo !== op.tipo;
            return (
              <Fragment key={esUbicacion ? "ubicacion" : `${op.lat},${op.lon}`}>
                {primeroDelGrupo && (
                  <li role="presentation" className="px-2.5 pb-1 pt-2 text-[11px] font-medium text-suave">
                    {titulo}
                  </li>
                )}
                <li
                  id={`op-${i}`}
                  role="option"
                  aria-selected={i === activo}
                  onMouseMove={() => setActivo(i)}
                  onPointerDown={(e) => e.preventDefault()}
                  onClick={() => elegir(op)}
                  className={`flex cursor-pointer items-center gap-3 rounded-lg px-2.5 py-2 transition-colors ${
                    i === activo ? "bg-fondo/80" : ""
                  }`}
                >
                  {Icono ? (
                    <Icono
                      size={15}
                      strokeWidth={2}
                      className={`shrink-0 ${
                        esUbicacion ? "text-acento" : esFavorita ? "fill-current text-acento" : "text-suave"
                      }`}
                      aria-hidden="true"
                    />
                  ) : (
                    <span className="grid h-[15px] w-[15px] shrink-0 place-items-center" aria-hidden="true">
                      <span className="h-1.5 w-1.5 rounded-full bg-suave/60" />
                    </span>
                  )}
                  <span className="min-w-0 flex-1 truncate text-sm">
                    {esUbicacion ? (
                      <span className="font-medium text-acento">Mi ubicación actual</span>
                    ) : (
                      <>
                        <span className="font-medium">
                          <Resaltado texto={op.nombre} busqueda={conTexto ? texto : ""} />
                        </span>
                        {op.region && <span className="text-suave">, {op.region}</span>}
                      </>
                    )}
                  </span>
                  {!esUbicacion && (
                    <span className="shrink-0 rounded border border-linea px-1.5 py-px text-[10px] font-medium text-suave">
                      {op.pais}
                    </span>
                  )}
                </li>
              </Fragment>
            );
          })}
        </ul>

        {conTexto && !buscando && resultados.length === 0 && (
          <p className="px-4 py-5 text-sm text-suave">
            Sin resultados para “{texto.trim()}”.
          </p>
        )}
      </div>
    </div>
  );
}