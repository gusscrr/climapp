import { createContext, useContext } from "react";

// true cuando la sección ya entró en pantalla (por defecto, visible)
export const ContextoRevelar = createContext(true);

export const useRevelado = () => useContext(ContextoRevelar);