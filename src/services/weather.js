const ACCRA_FORECAST_URL = 'https://api.open-meteo.com/v1/forecast';
const ACCRA_COORDINATES = { latitude: 5.6037, longitude: -0.1870 };

// WMO weather interpretation codes are returned by Open-Meteo's forecast API.
const weatherConditions = {
  0: 'Clear sky', 1: 'Mainly clear', 2: 'Partly cloudy', 3: 'Overcast',
  45: 'Fog', 48: 'Rime fog', 51: 'Light drizzle', 53: 'Moderate drizzle', 55: 'Dense drizzle',
  56: 'Light freezing drizzle', 57: 'Dense freezing drizzle', 61: 'Slight rain', 63: 'Moderate rain',
  65: 'Heavy rain', 66: 'Light freezing rain', 67: 'Heavy freezing rain', 71: 'Slight snow',
  73: 'Moderate snow', 75: 'Heavy snow', 77: 'Snow grains', 80: 'Slight rain showers',
  81: 'Moderate rain showers', 82: 'Violent rain showers', 85: 'Slight snow showers',
  86: 'Heavy snow showers', 95: 'Thunderstorm', 96: 'Thunderstorm with slight hail',
  99: 'Thunderstorm with heavy hail',
};

// Keep the API boundary in one place so the page can handle loading and errors cleanly.
export async function getAccraWeather(signal) {
  const params = new URLSearchParams({
    ...ACCRA_COORDINATES,
    current: 'temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m,is_day',
    daily: 'temperature_2m_max,temperature_2m_min',
    timezone: 'Africa/Accra',
    forecast_days: '1',
  });
  const response = await fetch(`${ACCRA_FORECAST_URL}?${params}`, { signal });
  if (!response.ok) throw new Error(`Weather provider returned ${response.status}`);

  const data = await response.json();
  if (!data.current || !data.daily) throw new Error('Weather provider returned incomplete data');

  const code = data.current.weather_code;
  return {
    temperature: Math.round(data.current.temperature_2m),
    condition: weatherConditions[code] || 'Current conditions',
    code,
    humidity: data.current.relative_humidity_2m,
    windSpeed: Math.round(data.current.wind_speed_10m),
    high: Math.round(data.daily.temperature_2m_max[0]),
    low: Math.round(data.daily.temperature_2m_min[0]),
    isDay: data.current.is_day === 1,
    observedAt: data.current.time?.slice(11, 16) || '',
    timezone: data.timezone || 'Africa/Accra',
  };
}