import { useEffect, useState } from 'react';

const WEATHER_ENDPOINT = 'https://api.open-meteo.com/v1/forecast?latitude=13.6929&longitude=-89.2182&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m&timezone=America%2FEl_Salvador';

const WEATHER_DESCRIPTIONS = {
  0: 'Despejado',
  1: 'Mayormente despejado',
  2: 'Parcialmente nublado',
  3: 'Nublado',
  45: 'Niebla',
  48: 'Niebla con escarcha',
  51: 'Llovizna ligera',
  53: 'Llovizna moderada',
  55: 'Llovizna intensa',
  56: 'Llovizna helada ligera',
  57: 'Llovizna helada intensa',
  61: 'Lluvia ligera',
  63: 'Lluvia moderada',
  65: 'Lluvia intensa',
  66: 'Lluvia helada ligera',
  67: 'Lluvia helada intensa',
  71: 'Nevada ligera',
  73: 'Nevada moderada',
  75: 'Nevada intensa',
  77: 'Granos de nieve',
  80: 'Chubascos ligeros',
  81: 'Chubascos moderados',
  82: 'Chubascos intensos',
  85: 'Chubascos de nieve ligeros',
  86: 'Chubascos de nieve intensos',
  95: 'Tormenta',
  96: 'Tormenta con granizo ligero',
  99: 'Tormenta con granizo intenso'
};

const metricStyle = {
  background: '#1a1a1a',
  border: '1px solid #292929',
  borderRadius: '8px',
  padding: '12px 14px'
};

export function WeatherWidget() {
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    const loadWeather = async () => {
      setIsLoading(true);
      setError('');

      try {
        const response = await fetch(WEATHER_ENDPOINT, {
          signal: controller.signal
        });

        if (!response.ok) {
          throw new Error(`El servicio respondió con el estado ${response.status}.`);
        }

        const data = await response.json();
        const current = data.current;
        const values = [
          current?.temperature_2m,
          current?.relative_humidity_2m,
          current?.apparent_temperature,
          current?.weather_code,
          current?.wind_speed_10m
        ];

        if (!current || values.some(value => !Number.isFinite(value))) {
          throw new Error('La respuesta del servicio no contiene datos meteorológicos válidos.');
        }

        setWeather({
          ...current,
          units: data.current_units || {}
        });
      } catch (requestError) {
        if (controller.signal.aborted) return;

        console.error('No se pudo consultar el clima de San Salvador:', requestError);
        setWeather(null);
        setError(
          requestError instanceof Error
            ? requestError.message
            : 'Ocurrió un error al consultar el clima.'
        );
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    };

    loadWeather();

    return () => controller.abort();
  }, [refreshKey]);

  const refresh = () => setRefreshKey(current => current + 1);
  const temperatureUnit = weather?.units.temperature_2m || '°C';
  const windUnit = weather?.units.wind_speed_10m || 'km/h';

  return (
    <section
      aria-labelledby="weather-widget-title"
      style={{
        background: '#121212',
        border: '1px solid #262626',
        borderRadius: '8px',
        padding: '18px 20px',
        color: '#fff'
      }}
    >
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '12px',
        marginBottom: weather ? '16px' : 0
      }}>
        <div>
          <h2 id="weather-widget-title" style={{ margin: 0, fontSize: '1.1rem' }}>
            Clima actual en San Salvador
          </h2>
          {isLoading && (
            <p role="status" style={{ color: '#a3a3a3', margin: '6px 0 0' }}>
              Consultando el clima...
            </p>
          )}
          {error && (
            <p role="alert" style={{ color: '#fca5a5', margin: '6px 0 0' }}>
              No se pudieron cargar los datos: {error}
            </p>
          )}
        </div>
        <button
          type="button"
          onClick={refresh}
          disabled={isLoading}
          style={{
            background: '#262626',
            color: '#fff',
            border: '1px solid #404040',
            borderRadius: '6px',
            padding: '8px 12px',
            cursor: isLoading ? 'wait' : 'pointer',
            opacity: isLoading ? 0.65 : 1
          }}
        >
          {isLoading ? 'Actualizando...' : 'Volver a consultar'}
        </button>
      </div>

      {weather && !isLoading && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(145px, 1fr))',
          gap: '10px'
        }}>
          <div style={metricStyle}>
            <span style={{ display: 'block', color: '#a3a3a3', fontSize: '0.8rem' }}>
              Temperatura actual
            </span>
            <strong style={{ fontSize: '1.35rem' }}>
              {weather.temperature_2m}{temperatureUnit}
            </strong>
          </div>
          <div style={metricStyle}>
            <span style={{ display: 'block', color: '#a3a3a3', fontSize: '0.8rem' }}>
              Sensación térmica
            </span>
            <strong style={{ fontSize: '1.35rem' }}>
              {weather.apparent_temperature}{temperatureUnit}
            </strong>
          </div>
          <div style={metricStyle}>
            <span style={{ display: 'block', color: '#a3a3a3', fontSize: '0.8rem' }}>
              Humedad relativa
            </span>
            <strong style={{ fontSize: '1.35rem' }}>
              {weather.relative_humidity_2m}%
            </strong>
          </div>
          <div style={metricStyle}>
            <span style={{ display: 'block', color: '#a3a3a3', fontSize: '0.8rem' }}>
              Velocidad del viento
            </span>
            <strong style={{ fontSize: '1.35rem' }}>
              {weather.wind_speed_10m} {windUnit}
            </strong>
          </div>
          <div style={{
            ...metricStyle,
            gridColumn: '1 / -1'
          }}>
            <span style={{ display: 'block', color: '#a3a3a3', fontSize: '0.8rem' }}>
              Condición
            </span>
            <strong>
              {WEATHER_DESCRIPTIONS[weather.weather_code] ||
                `Condición meteorológica desconocida (código ${weather.weather_code})`}
            </strong>
          </div>
        </div>
      )}
    </section>
  );
}
