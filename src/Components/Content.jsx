import useClima from "../hooks/useClima";
import Navbar from "./Navbar";
import Temperatura from "./Temperatura";
import WindCard from "./WindCard";
import CalidadAire from "./CalidadAire";
import Horas from "./Horas";
import Dias from "./Dias";
import Sol from "./Sol";
import Revelar from "./Revelar";
import AvisoLluvia from "./AvisoLluvia";
import { ContextoUnidad } from "../lib/unidad";
import useUnidadGuardada from "../hooks/useUnidadGuardada";
import { Cargando, ErrorClima, PedirUbicacion, UbicacionBloqueada } from "./Estados";

function Content() {
  const {
    estado,
    error,
    datos,
    actualizado,
    actualizando,
    esperandoPermiso,
    ciudad,
    actualizar,
    pedirUbicacion,
    verCiudad,
  } = useClima();
  const [unidad, setUnidad] = useUnidadGuardada();

  return (
    <ContextoUnidad.Provider value={unidad}>
      <Navbar
        actualizado={datos && estado !== "pedir" ? actualizado : null}
        actualizando={actualizando}
        onActualizar={actualizar}
        onElegirCiudad={verCiudad}
        onMiUbicacion={pedirUbicacion}
        enOtraCiudad={Boolean(ciudad)}
        unidad={unidad}
        onUnidad={setUnidad}
      />

      <main className="mx-auto w-full max-w-5xl flex-1 px-4 pb-12 sm:px-6">
        {estado === "cargando" && <Cargando />}

        {["pedir", "bloqueada", "error"].includes(estado) && (
          // Centra verticalmente las pantallas de aviso en PC
          <div className="md:flex md:min-h-[calc(100dvh-13rem)] md:items-center md:justify-center">
            <div className="w-full">
              {estado === "pedir" && (
                <PedirUbicacion onPermitir={pedirUbicacion} esperando={esperandoPermiso} />
              )}
              {estado === "bloqueada" && <UbicacionBloqueada onReintentar={pedirUbicacion} />}
              {estado === "error" && <ErrorClima tipo={error} onReintentar={pedirUbicacion} />}
            </div>
          </div>
        )}

        {estado === "listo" && datos && (
          <div className="aparecer space-y-3">
            {/* Aviso de lluvia: solo aparece si hace falta */}
            <AvisoLluvia
              key={datos.clima.dt}
              aviso={datos.aviso}
              desfase={datos.clima.timezone}
            />
            {/* Toda la página: cada sección aparece cuando llegás a ella al bajar */}
            <Revelar>
              <div className="panel grid divide-y divide-linea md:grid-cols-2 md:divide-x md:divide-y-0 [&>*]:p-6 sm:[&>*]:p-8">
                <Temperatura clima={datos.clima} ciudad={ciudad} onMiUbicacion={pedirUbicacion} />
                <WindCard clima={datos.clima} />
              </div>
            </Revelar>
            <Revelar>
              <Horas clima={datos.clima} pronostico={datos.pronostico} />
            </Revelar>
            <div className="grid gap-3 md:grid-cols-[1.35fr_1fr]">
              <Revelar className="flex flex-col [&>*>*]:flex-1">
                <Dias dias={datos.dias} />
              </Revelar>
              <Revelar className="flex flex-col [&>*>*]:flex-1">
                <Sol clima={datos.clima} />
              </Revelar>
            </div>
            <Revelar>
              <CalidadAire aire={datos.aire} />
            </Revelar>
          </div>
        )}
      </main>
    </ContextoUnidad.Provider>
  );
}

export default Content;