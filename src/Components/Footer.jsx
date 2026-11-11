export default function Footer() {
  return (
    <footer className="mx-auto flex w-full max-w-5xl flex-col gap-1 px-4 pb-8 text-sm text-suave md:flex-row md:justify-between md:gap-6 sm:px-6">
      <p>© 2026 ClimApp, implementado por Gustavo Carrasco. Todos los derechos reservados.</p>
      <p>
        Datos de{" "}
        <a
          href="https://open-meteo.com"
          target="_blank"
          rel="noreferrer"
          className="text-texto/80 transition-colors hover:text-acento"
        >
          Open-Meteo
        </a>
      </p>
    </footer>
  );
}