
export default function Navbar() {
  return (
    <nav className=" text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center h-16">
          <div className="flex items-center  py-2 rounded-full transition-all duration-300 ">
            <span className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-teal-300">
              ClimApp
            </span>
            <img
                src="/sunset.svg"
                alt="Icono de Sol"
                className="w-10 h-10"
              />
          </div>
        </div>
      </div>
    </nav>
  )
}