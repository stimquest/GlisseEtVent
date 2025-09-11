"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Wind, Compass, Gauge, Sun, Cloudy, CloudRain, AlertTriangle, Loader } from "lucide-react";
import { cn } from "@/lib/utils";

// https://openweathermap.org/weather-conditions
const getWeatherType = (code: number): 'sunny' | 'cloudy' | 'rainy' => {
  if (code >= 200 && code < 600) return 'rainy';
  if (code >= 801 && code <= 804) return 'cloudy';
  if (code === 800) return 'sunny';
  return 'cloudy'; // Par défaut
};


type WeatherState = {
  status: 'loading' | 'success' | 'error';
  data: {
    speed: number;
    direction: string;
    gust: number | null;
    weather: "sunny" | "cloudy" | "rainy";
    weatherText: string;
  } | null;
  error?: string;
};

const weatherInfo: { [key in 'sunny' | 'cloudy' | 'rainy']: { label: string; icon: React.ElementType } } = {
    sunny: { label: "Ensoleillé", icon: Sun },
    cloudy: { label: "Nuageux", icon: Cloudy },
    rainy: { label: "Pluvieux", icon: CloudRain },
};


export function WindCard({ className }: { className?: string }) {
  const [weatherState, setWeatherState] = useState<WeatherState>({ status: 'loading', data: null });

  // Fonction de conversion km/h → nœuds (résultat arrondi)
  const kmhToKnots = (kmh: number): number => {
    return Math.round(kmh * 0.539957);
  };

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const response = await fetch('/api/weather');
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Impossible de récupérer les données météo.');
        }

        setWeatherState({
          status: 'success',
          data: {
            speed: kmhToKnots(data.wind_kph),
            direction: data.wind_dir,
            gust: data.gust_kph ? kmhToKnots(data.gust_kph) : null,
            weather: getWeatherType(data.condition_code),
            weatherText: data.condition_text
          }
        });

      } catch (error) {
        console.error("Erreur lors de la récupération de la météo:", error);
        const errorMessage = error instanceof Error ? error.message : "Une erreur inconnue est survenue";
        setWeatherState({ status: 'error', data: null, error: errorMessage });
      }
    };

    fetchWeather();

    // Rafraîchir les données toutes les 15 minutes
    const interval = setInterval(fetchWeather, 15 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  const renderContent = () => {
    switch (weatherState.status) {
      case 'loading':
        return (
          <div className="flex flex-col items-center justify-center h-full w-full">
            <Loader className="w-12 h-12 animate-spin text-primary"/>
            <p className="mt-4 text-muted-foreground">Chargement des données météo...</p>
          </div>
        );
      case 'error':
        return (
          <div className="flex flex-col items-center justify-center h-full text-destructive p-4 text-center w-full">
            <AlertTriangle className="w-12 h-12"/>
            <p className="mt-4 font-semibold text-sm">{weatherState.error}</p>
          </div>
        );
      case 'success':
        if (!weatherState.data) return null;
        const { data } = weatherState;
        const CurrentWeatherIcon = weatherInfo[data.weather].icon;

        return (
          <div className="space-y-6 w-full">
             <div className="grid grid-cols-3 gap-2 text-center">
              <div className="flex flex-col items-center">
                <Gauge className="w-8 h-8 mx-auto text-primary" />
                <p className="text-3xl font-bold mt-1">{data.speed} <span className="text-lg font-normal">nœuds</span></p>
                <p className="text-muted-foreground">Vitesse</p>
              </div>
              <div className="flex flex-col items-center">
                <Compass className="w-8 h-8 mx-auto text-primary" />
                <p className="text-3xl font-bold mt-1">{data.direction}</p>
                <p className="text-muted-foreground">Direction</p>
              </div>
               <div className="flex flex-col items-center">
                <CurrentWeatherIcon className="w-8 h-8 mx-auto text-primary" />
                <p className="text-xl font-bold mt-1 capitalize h-12 flex items-center justify-center">{data.weatherText}</p>
                <p className="text-muted-foreground">Météo</p>
              </div>
            </div>
            {data.gust && data.gust > data.speed && (
                <div className="text-center p-3 bg-primary text-primary-foreground rounded-lg">
                    <p className="text-lg font-semibold">Rafales jusqu'à <span className="font-bold text-xl text-accent">{data.gust} nœuds</span></p>
                </div>
            )}
          </div>
        );
    }
  }

  return (
    <Card className={cn("flex flex-col", className)}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wind className="w-8 h-8 text-accent" />
          Météo & Vent
        </CardTitle>
        <CardDescription className="text-xl">En direct de Denneville Plage</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow flex items-center justify-center">
        {renderContent()}
      </CardContent>
    </Card>
  );
}
