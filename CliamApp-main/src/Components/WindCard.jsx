import { useState, useEffect } from "react";

function WindCard() {
  const [datosClima, setDatosClima] = useState(null);
  const [datosAire, setDatosAire] = useState(null);
  const [lat, setLat] = useState(null);
  const [lon, setLon] = useState(null);
  const [ciudad, setCiudad] = useState("");
  const apiKey = '1d3b6bd1d18f1077d117ba209ae6fe06';

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLat(position.coords.latitude);
        setLon(position.coords.longitude);
      },
      (error) => {
        console.error("Error obteniendo la ubicación:", error);
      }
    );
  }, []);

  useEffect(() => {
    if (lat && lon) {
      const urlClima = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}`;
      fetch(urlClima)
        .then((response) => response.json())
        .then((data) => {
          setDatosClima(data);
          setCiudad(data.name);
        })
        .catch((error) => console.error("Error", error));

      const urlAire = `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${apiKey}`;
      fetch(urlAire)
        .then((response) => response.json())
        .then((data) => {
          setDatosAire(data.list[0]);
        })
        .catch((error) => console.error("Error ", error));
    }
  }, [lat, lon]);

  useEffect

  const getAirQuality = (index) => {
    const qualities = ["Desconocido", "Muy Buena", "Buena", "Moderada", "Mala", "Muy mala"];
    return qualities[index] || qualities[0];
  };

  const getAirQualityColor = (index) => {
    const colors = ["gray", "green", "yellow", "orange", "red", "purple"];
    return colors[index] || colors[0];
  };

  if (!datosClima || !datosClima.wind) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto bg-gray-800 rounded-xl shadow-md overflow-hidden md:max-w-2xl m-4">
      <div className="p-8">
        <div className="uppercase tracking-wide text-sm text-blue-400 font-semibold mb-1">Datos Meteorológicos</div>
        <h2 className="text-white text-2xl font-bold mb-2">Viento y Calidad del Aire</h2>
        <p className="text-gray-400 mb-4">Ubicación: {ciudad}</p>
        
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-gray-700 p-4 rounded-lg">
            <div className="flex">
              <h3 className="text-lg font-semibold text-white mb-2">Viento</h3>
              <img
                src="/wind.svg"
                alt="Icono de Viento"
                className="ml-1 w-8 h-8"
              />
            </div>
            <p className="text-gray-300">Velocidad: {datosClima.wind.speed} m/s</p>
            <p className="text-gray-300">Humedad: {datosClima.main.humidity}%</p>
            <p className="text-gray-300">Dirección: {datosClima.wind.deg}°</p>
          </div>
          <div className="bg-gray-700 p-4 rounded-lg">
            <div className="flex">
              <h3 className="text-lg font-semibold text-white mb-2">Temperatura</h3>
              <img
                src="/thermometer-celsius.svg"
                alt="Icono de Termómetro"
                className="w-8 h-8"
              />
            </div>
            <p className="text-gray-300">{(datosClima.main.temp - 273.15).toFixed(2)} °C</p>
          </div>
        </div>

        {datosAire ? (
          <div className="bg-gray-700 p-4 rounded-lg">
            <div className="flex">
              <h3 className="text-lg font-semibold text-white mb-2">Calidad del Aire</h3>
              <img
                src="/mist.svg"
                alt="Icono de Neblina"
                className="w-8 h-8"
              />
            </div>
            <p className={`text-${getAirQualityColor(datosAire.main.aqi)}-500 text-blue-400 font-bold mb-2`}>
              {getAirQuality(datosAire.main.aqi)}
            </p>
            <div className="grid grid-cols-2 gap-2">
              <p className="text-gray-300">SO₂: {datosAire.components.so2} μg/m³</p>
              <p className="text-gray-300">NO₂: {datosAire.components.no2} μg/m³</p>
              <p className="text-gray-300">PM10: {datosAire.components.pm10} μg/m³</p>
              <p className="text-gray-300">PM2.5: {datosAire.components.pm2_5} μg/m³</p>
              <p className="text-gray-300">O₃: {datosAire.components.o3} μg/m³</p>
              <p className="text-gray-300">CO: {datosAire.components.co} μg/m³</p>
            </div>
          </div>
        ) : (
          <p className="text-gray-400">Cargando calidad del aire...</p>
        )}
      </div>
    </div>
  );
}

export default WindCard;
