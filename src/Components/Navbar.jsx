import { RotateCw } from "lucide-react";
import { horaLocal } from "../lib/clima";
import Buscador from "./Buscador";

export default function Navbar({
  actualizado,
  actualizando,
  onActualizar,
  onElegirCiudad,
  onMiUbicacion,
  enOtraCiudad,
  unidad,
  onUnidad,
}) {
  return (
    <header className="mx-auto flex w-full max-w-5xl flex-wrap items-center gap-x-3 gap-y-4 px-4 py-5 sm:px-6 sm:py-7">
      <a href="/" className="order-1 mr-auto flex items-center gap-1.5" aria-label="ClimApp, inicio">
        <img src="/sunset.svg" alt="" className="-my-2 h-10 w-10" />
        <span className="text-lg font-semibold tracking-tight">ClimApp</span>
      </a>

      {actualizado && (
        <>
          {/* Buscador: en PC a la derecha; en celular ocupa toda la fila de abajo */}
          <div className="order-3 w-full md:order-2 md:w-64">
            <Buscador
              onElegir={onElegirCiudad}
              onMiUbicacion={onMiUbicacion}
              enOtraCiudad={enOtraCiudad}
            />
          </div>

          <div className="order-2 flex items-center gap-2 text-sm text-suave md:order-3">
            {/* °C / °F */}
            <div
              role="radiogroup"
              aria-label="Unidad de temperatura"
              className="relative flex h-8 items-center rounded-full border border-linea bg-superficie/60 p-0.5 text-xs font-medium"
            >
              <span
                className="unidad-marca absolute inset-y-0.5 left-0.5 w-8 rounded-full bg-acento"
                style={{ transform: unidad === "F" ? "translateX(100%)" : "none" }}
                aria-hidden="true"
              />
              {["C", "F"].map((u) => (
                <button
                  key={u}
                  type="button"
                  role="radio"
                  aria-checked={unidad === u}
                  onClick={() => onUnidad(u)}
                  className={`relative z-10 h-full w-8 rounded-full transition-colors ${
                    unidad === u ? "text-fondo" : "text-suave hover:text-texto"
                  }`}
                >
                  °{u}
                </button>
              ))}
            </div>
            <span aria-live="polite" className="ml-1">
              {actualizando ? (
                "Actualizando…"
              ) : (
                <>
                  <span className="hidden lg:inline">Actualizado </span>
                  {horaLocal(actualizado)}
                </>
              )}
            </span>
            <button
              type="button"
              onClick={onActualizar}
              disabled={actualizando}
              aria-label="Actualizar datos"
              className="grid h-9 w-9 place-items-center rounded-full text-texto transition-colors hover:bg-linea/50 active:scale-95 disabled:opacity-60"
            >
              <RotateCw size={17} strokeWidth={2} className={actualizando ? "animate-spin" : ""} />
            </button>
          </div>
        </>
      )}
    </header>
  );
}