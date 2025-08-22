import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const apiKey = process.env.WEATHERAPI_KEY || process.env.NEXT_PUBLIC_WEATHERAPI_KEY;

    if (!apiKey) {
      console.error('Clé API WeatherAPI manquante');
      return NextResponse.json(
        { error: 'Configuration API manquante' },
        { status: 500 }
      );
    }

    // Coordonnées approximatives de Denneville Plage (France)
    const lat = 49.3167;
    const lon = -1.7333;

    const url = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${lat},${lon}&lang=fr`;

    console.log('URL de l\'API météo:', url);

    const response = await fetch(url, {
      headers: {
        'User-Agent': 'GlisseEtVent/1.0'
      },
      next: { revalidate: 300 } // Cache pendant 5 minutes
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Erreur API WeatherAPI:', response.status, errorText);
      throw new Error(`Erreur API: ${response.status}`);
    }

    const data = await response.json();
    console.log('Données météo reçues:', data);

    // Transformer les données pour le composant WindCard
    const weatherData = {
      wind_kph: Math.round(data.current.wind_kph),
      wind_dir: data.current.wind_dir,
      gust_kph: data.current.gust_kph ? Math.round(data.current.gust_kph) : null,
      condition_code: data.current.condition.code,
      condition_text: data.current.condition.text,
      location: data.location.name,
      last_updated: data.current.last_updated
    };

    return NextResponse.json(weatherData);

  } catch (error) {
    console.error('Erreur dans l\'API météo:', error);
    return NextResponse.json(
      { error: 'Impossible de récupérer les données météo' },
      { status: 500 }
    );
  }
}