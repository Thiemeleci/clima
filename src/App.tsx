import React, { useState, useEffect } from 'react';
import { Search, MapPin, Thermometer, Eye, Wind, Droplets, Sunrise, Sunset, Cloud, Sun, CloudRain, CloudSnow, Zap, CloudDrizzle, Gauge } from 'lucide-react';

interface WeatherData {
  name: string;
  country: string;
  temp: number;
  feels_like: number;
  description: string;
  humidity: number;
  wind_speed: number;
  visibility: number;
  sunrise: number;
  sunset: number;
  icon: string;
  main: string;
  pressure: number;
  temp_min: number;
  temp_max: number;
}

function App() {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [city, setCity] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  // API key do OpenWeatherMap - mantenha esta chave
  const API_KEY = '96425266d64dab26b4ac846c81a55e77';

  const fetchWeather = async (cityName: string) => {
    if (!API_KEY) {
      setError('API key não configurada');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_KEY}&units=metric&lang=pt_br`
      );

      if (!response.ok) {
        throw new Error('Cidade não encontrada');
      }

      const data = await response.json();
      
      setWeatherData({
        name: data.name,
        country: data.sys.country,
        temp: Math.round(data.main.temp),
        feels_like: Math.round(data.main.feels_like),
        description: data.weather[0].description,
        humidity: data.main.humidity,
        wind_speed: Math.round(data.wind.speed * 3.6), // Convert to km/h
        visibility: Math.round(data.visibility / 1000),
        sunrise: data.sys.sunrise,
        sunset: data.sys.sunset,
        icon: data.weather[0].icon,
        main: data.weather[0].main,
        pressure: data.main.pressure,
        temp_min: Math.round(data.main.temp_min),
        temp_max: Math.round(data.main.temp_max)
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao buscar dados do tempo');
      setWeatherData(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (city.trim()) {
      fetchWeather(city.trim());
    }
  };

  const getWeatherIcon = (main: string, size: string = "w-20 h-20") => {
    const iconClass = `${size} drop-shadow-lg`;
    
    switch (main.toLowerCase()) {
      case 'clear':
        return <Sun className={`${iconClass} text-amber-400 animate-pulse`} />;
      case 'clouds':
        return <Cloud className={`${iconClass} text-slate-300`} />;
      case 'rain':
        return <CloudRain className={`${iconClass} text-blue-400`} />;
      case 'drizzle':
        return <CloudDrizzle className={`${iconClass} text-blue-300`} />;
      case 'snow':
        return <CloudSnow className={`${iconClass} text-blue-100`} />;
      case 'thunderstorm':
        return <Zap className={`${iconClass} text-purple-400 animate-pulse`} />;
      default:
        return <Cloud className={`${iconClass} text-slate-300`} />;
    }
  };

  const formatTime = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getBackgroundGradient = (main?: string) => {
    if (!main) return 'from-slate-900 via-slate-800 to-slate-900';
    
    switch (main.toLowerCase()) {
      case 'clear':
        return 'from-blue-400 via-blue-500 to-indigo-600';
      case 'clouds':
        return 'from-slate-600 via-slate-700 to-slate-800';
      case 'rain':
      case 'drizzle':
        return 'from-slate-700 via-slate-800 to-slate-900';
      case 'snow':
        return 'from-blue-200 via-blue-300 to-blue-400';
      case 'thunderstorm':
        return 'from-purple-800 via-slate-800 to-slate-900';
      default:
        return 'from-slate-600 via-slate-700 to-slate-800';
    }
  };

  useEffect(() => {
    fetchWeather('São Paulo');
  }, []);

  return (
    <div className={`min-h-screen bg-gradient-to-br ${getBackgroundGradient(weatherData?.main)} transition-all duration-1000 ease-in-out relative overflow-hidden`}>
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-white/3 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-white/2 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="relative z-10 min-h-screen p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12 animate-fade-in">
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-thin text-white mb-4 tracking-tight">
              Clima
              <span className="font-light text-white/80 ml-4">Up</span>
            </h1>
            <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-white/50 to-transparent mx-auto mb-6"></div>
            <p className="text-white/70 text-lg sm:text-xl font-light max-w-2xl mx-auto leading-relaxed">
              Descubra as condições climáticas em tempo real com precisão.
            </p>
          </div>

          {/* Search Form */}
          <form onSubmit={handleSubmit} className="mb-16 animate-slide-up">
            <div className="relative max-w-2xl mx-auto">
              <div className={`relative transition-all duration-300 ${isSearchFocused ? 'scale-105' : 'scale-100'}`}>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setIsSearchFocused(false)}
                  placeholder="Digite o nome da cidade..."
                  className="w-full pl-16 pr-32 py-6 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/30 transition-all duration-300 text-lg font-light shadow-2xl"
                />
                <Search className="absolute left-6 top-1/2 transform -translate-y-1/2 w-6 h-6 text-white/60" />
                <button
                  type="submit"
                  disabled={loading}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white px-8 py-3 rounded-xl transition-all duration-300 disabled:opacity-50 font-medium backdrop-blur-sm border border-white/20 hover:border-white/30 hover:scale-105"
                >
                  {loading ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Buscando</span>
                    </div>
                  ) : (
                    'Buscar'
                  )}
                </button>
              </div>
            </div>
          </form>

          {/* Error Message */}
          {error && (
            <div className="max-w-2xl mx-auto mb-12 animate-shake">
              <div className="p-6 bg-red-500/20 backdrop-blur-xl border border-red-300/30 rounded-2xl text-white text-center shadow-2xl">
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
                  <span className="font-medium">{error}</span>
                </div>
              </div>
            </div>
          )}

          {/* Weather Data */}
          {weatherData && (
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 animate-fade-in-up">
              {/* Main Weather Card */}
              <div className="xl:col-span-8 bg-white/10 backdrop-blur-xl rounded-3xl p-8 sm:p-12 border border-white/20 shadow-2xl hover:shadow-3xl transition-all duration-500 hover:bg-white/15">
                <div className="flex flex-col lg:flex-row items-center justify-between mb-8">
                  <div className="text-center lg:text-left mb-6 lg:mb-0">
                    <div className="flex items-center justify-center lg:justify-start text-white mb-3">
                      <MapPin className="w-6 h-6 mr-3 text-white/80" />
                      <span className="text-2xl sm:text-3xl font-light">
                        {weatherData.name}
                        <span className="text-white/60 ml-2 text-xl">{weatherData.country}</span>
                      </span>
                    </div>
                    <p className="text-white/80 capitalize text-xl font-light tracking-wide">
                      {weatherData.description}
                    </p>
                    <div className="flex items-center justify-center lg:justify-start mt-2 text-white/60">
                      <span className="text-sm">Mín: {weatherData.temp_min}°</span>
                      <span className="mx-3">•</span>
                      <span className="text-sm">Máx: {weatherData.temp_max}°</span>
                    </div>
                  </div>
                  <div className="flex-shrink-0">
                    {getWeatherIcon(weatherData.main, "w-24 h-24 sm:w-32 sm:h-32")}
                  </div>
                </div>

                <div className="text-center mb-12">
                  <div className="text-7xl sm:text-8xl lg:text-9xl font-thin text-white mb-4 tracking-tighter">
                    {weatherData.temp}
                    <span className="text-4xl sm:text-5xl text-white/60 ml-2">°C</span>
                  </div>
                  <p className="text-white/70 text-xl font-light">
                    Sensação térmica de {weatherData.feels_like}°C
                  </p>
                </div>

                {/* Quick Stats Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center border border-white/10 hover:bg-white/15 transition-all duration-300 group">
                    <Droplets className="w-8 h-8 text-blue-300 mx-auto mb-3 group-hover:scale-110 transition-transform duration-300" />
                    <p className="text-white/70 text-sm font-medium mb-1">Umidade</p>
                    <p className="text-white font-light text-2xl">{weatherData.humidity}%</p>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center border border-white/10 hover:bg-white/15 transition-all duration-300 group">
                    <Wind className="w-8 h-8 text-cyan-300 mx-auto mb-3 group-hover:scale-110 transition-transform duration-300" />
                    <p className="text-white/70 text-sm font-medium mb-1">Vento</p>
                    <p className="text-white font-light text-2xl">{weatherData.wind_speed} km/h</p>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center border border-white/10 hover:bg-white/15 transition-all duration-300 group">
                    <Eye className="w-8 h-8 text-purple-300 mx-auto mb-3 group-hover:scale-110 transition-transform duration-300" />
                    <p className="text-white/70 text-sm font-medium mb-1">Visibilidade</p>
                    <p className="text-white font-light text-2xl">{weatherData.visibility} km</p>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center border border-white/10 hover:bg-white/15 transition-all duration-300 group">
                    <Gauge className="w-8 h-8 text-green-300 mx-auto mb-3 group-hover:scale-110 transition-transform duration-300" />
                    <p className="text-white/70 text-sm font-medium mb-1">Pressão</p>
                    <p className="text-white font-light text-2xl">{weatherData.pressure} hPa</p>
                  </div>
                </div>
              </div>

              {/* Side Panel */}
              <div className="xl:col-span-4 space-y-6">
                {/* Sun Times */}
                <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl hover:shadow-3xl transition-all duration-500 hover:bg-white/15">
                  <h3 className="text-white font-light text-2xl mb-8 text-center">Horários Solares</h3>
                  <div className="space-y-6">
                    <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/10">
                      <div className="flex items-center">
                        <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mr-4">
                          <Sunrise className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <p className="text-white/70 text-sm font-medium">Nascer do Sol</p>
                          <p className="text-white font-light text-xl">{formatTime(weatherData.sunrise)}</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/10">
                      <div className="flex items-center">
                        <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center mr-4">
                          <Sunset className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <p className="text-white/70 text-sm font-medium">Pôr do Sol</p>
                          <p className="text-white font-light text-xl">{formatTime(weatherData.sunset)}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Temperature Details */}
                <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl hover:shadow-3xl transition-all duration-500 hover:bg-white/15">
                  <div className="flex items-center mb-6">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center mr-4">
                      <Thermometer className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-white font-light text-2xl">Detalhes</h3>
                  </div>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 bg-white/5 rounded-xl">
                      <span className="text-white/70 font-medium">Atual</span>
                      <span className="text-white font-light text-xl">{weatherData.temp}°C</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-white/5 rounded-xl">
                      <span className="text-white/70 font-medium">Sensação</span>
                      <span className="text-white font-light text-xl">{weatherData.feels_like}°C</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-white/5 rounded-xl">
                      <span className="text-white/70 font-medium">Mínima</span>
                      <span className="text-white font-light text-xl">{weatherData.temp_min}°C</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-white/5 rounded-xl">
                      <span className="text-white/70 font-medium">Máxima</span>
                      <span className="text-white font-light text-xl">{weatherData.temp_max}°C</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="text-center mt-20 pb-8">
            <div className="w-32 h-0.5 bg-gradient-to-r from-transparent via-white/30 to-transparent mx-auto mb-6"></div>
            <p className="text-white/40 font-light text-sm tracking-wide">
              Powered by OpenWeatherMap API
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;