export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-400 py-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center justify-between mb-8 md:flex-row">
          <div className="mb-4 md:mb-0 text-center md:text-left">
            <h2 className="text-2xl font-bold text-white mb-2">ClimApp</h2>
            <p className="text-sm">Innovación y calidad en cada detalle</p>
          </div>
        </div>
        <div className="border-t border-gray-800 pt-8 text-sm text-center">
          <p>&copy; Implementado por, Gustavo Carrasco.</p>
          
        </div>
      </div>
    </footer>
  );
}
