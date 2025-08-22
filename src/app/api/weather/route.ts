
import { NextResponse } from 'next/server';

// https://openweathermap.org/weather-conditions
const openWeatherCodeToCondition = (code: number): 'sunny' | 'cloudy' | 'rainy' => {
  if (code >= 200 && code < 600) return 'rainy';
  if (code >= 801 && code <= 804) return 'cloudy';
  if (code === 800) return 'sunny';
  return 'cloudy'; // Par défaut
};

const degreesToCardinal = (deg: number): string => {
    const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSO', 'SO', 'OSO', 'O', 'ONO', 'NO', 'NNO'];
    const index = Math.round((deg % 360) / 22.5);
    return directions[index % 16];
}

export async function GET() {
  const apiKey = process.env.OPENWEATHERMAP_API_KEY;
  const lat = "49.2009";
  const lon = "-1.7667";
  
  if (!apiKey) {
    console.error("La clé API OpenWeatherMap est manquante.");
    return NextResponse.json({ error: "La clé API OpenWeatherMap est manquante. Veuillez l'ajouter à vos variables d'environnement." }, { status: 500 });
  }

  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&lang=fr`;

  try {
    const response = await fetch(apiUrl, { next: { revalidate: 60 * 10 } }); // Revalidation toutes les 10 minutes
    const data = await response.json();

    if (!response.ok) {
        const errorMessage = data.message || `Erreur API: ${response.status}`;
        console.error("Erreur de l'API OpenWeatherMap:", errorMessage);
        return NextResponse.json({ error: `Erreur de l'API OpenWeatherMap: ${errorMessage}` }, { status: response.status });
    }
    
    const weatherData = {
      temp_c: data.main.temp,
      wind_kph: Math.round(data.wind.speed * 3.6), // conversion m/s vers km/h
      wind_dir: degreesToCardinal(data.wind.deg),
      gust_kph: data.wind.gust ? Math.round(data.wind.gust * 3.6) : null,
      condition_text: data.weather[0]?.description || 'Non disponible',
      condition_code: data.weather[0]?.id || 800,
    };

    return NextResponse.json(weatherData);

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
    console.error("Erreur interne lors de la requête à l'API météo:", error);
    return NextResponse.json({ error: 'Impossible de traiter la requête météo', details: errorMessage }, { status: 500 });
  }
}
