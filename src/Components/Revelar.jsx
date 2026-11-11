import { useEffect, useRef, useState } from "react";
import { ContextoRevelar } from "../lib/revelar";

// El efecto es solo al bajar: la sección aparece con sus animaciones cuando entra desde abajo.
// Al subir ya está visible; se rearma recién cuando quedó por debajo de la pantalla.
export default function Revelar({ children, className = "" }) {
  const caja = useRef(null);
  const [visible, setVisible] = useState(false);
  // Cambia en cada entrada para reiniciar números, barras y curvas
  const [vuelta, setVuelta] = useState(0);

  useEffect(() => {
    const el = caja.current;
    const quieto = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (!el || quieto || typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }
    let mostrado = false;
    const obs = new IntersectionObserver(
      ([e]) => {
        // Aparece cuando se ve al menos un 15 %
        if (!mostrado && e.intersectionRatio >= 0.15) {
          mostrado = true;
          setVuelta((v) => v + 1);
          setVisible(true);
        }
        // Solo se rearma si salió por abajo (al subir), así al volver a bajar se anima de nuevo.
        // Si salió por arriba queda visible: al subir no hay efecto.
        else if (mostrado && !e.isIntersecting && e.boundingClientRect.top > 0) {
          mostrado = false;
          setVisible(false);
        }
      },
      { threshold: [0, 0.15] },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div ref={caja} className={`revelar ${visible ? "revelado" : ""} ${className}`}>
      <ContextoRevelar.Provider value={visible}>
        <div key={vuelta} className="contents">
          {children}
        </div>
      </ContextoRevelar.Provider>
    </div>
  );
}