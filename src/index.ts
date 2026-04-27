import { z } from "zod";
import debounce from "lodash/debounce";

const cityElement = document.querySelector<HTMLInputElement>("#city");
const citiesElement = document.querySelector<HTMLUListElement>("#cities");
const weatherElement = document.querySelector<HTMLDivElement>("#weather");

if (!cityElement || !citiesElement || !weatherElement) {
    throw new Error("Required DOM elements not found");
}

const CitySchema = z.object({
    name: z.string(),
    country_code: z.string().length(2),
    latitude: z.number(),
    longitude: z.number(),
});

const GeocodingSchema = z.object({
    results: z.array(CitySchema).optional().default([]),
});

const WeatherSchema = z.object({
    current_units: z.object({
        temperature_2m: z.string(),
        relative_humidity_2m: z.string(),
        apparent_temperature: z.string(),
        precipitation: z.string(),
    }),
    current: z.object({
        temperature_2m: z.number(),
        relative_humidity_2m: z.number(),
        apparent_temperature: z.number(),
        precipitation: z.number(),
    }),
});

type City = z.infer<typeof CitySchema>;
type Weather = z.infer<typeof WeatherSchema>;

type WeatherResult =
    | { tag: "ok"; value: Weather }
    | { tag: "error"; value: unknown };

const getCities = async (search: string): Promise<City[]> => {
    try {
        const response = await fetch(
            `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
                search
            )}&count=10&language=en&format=json`
        );

        const json = await response.json();
        const parsed = GeocodingSchema.safeParse(json);

        if (!parsed.success) return [];

        return parsed.data.results;
    } catch (error) {
        console.error("City fetch error:", error);
        return [];
    }
};

const getWeather = async (city: City): Promise<WeatherResult> => {
    try {
        const response = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${city.latitude}&longitude=${city.longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation&timezone=auto&forecast_days=1`
        );

        const json = await response.json();
        const parsed = WeatherSchema.safeParse(json);

        if (!parsed.success) {
            return { tag: "error", value: parsed.error };
        }

        return { tag: "ok", value: parsed.data };
    } catch (error) {
        return { tag: "error", value: error };
    }
};

const clearSuggestions = () => {
    citiesElement.innerHTML = "";
};

const showMessage = (message: string) => {
    weatherElement.innerHTML = `<p>${message}</p>`;
};

const renderWeather = (city: City, weather: Weather) => {
    const {
        temperature_2m,
        apparent_temperature,
        relative_humidity_2m,
        precipitation,
    } = weather.current;

    weatherElement.innerHTML = `
    <h2>${city.name}</h2>
    <p>Temperature: ${temperature_2m}°C</p>
    <p>Feels like: ${apparent_temperature}°C</p>
    <p>Humidity: ${relative_humidity_2m}%</p>
    <p>Precipitation: ${precipitation} mm</p>
  `;
};

const selectCity = async (city: City) => {
    showMessage("Loading weather...");

    const result = await getWeather(city);

    if (result.tag === "error") {
        showMessage("Failed to fetch weather.");
        return;
    }

    renderWeather(city, result.value);
};

const populateSuggestions = (cities: City[]) => {
    clearSuggestions();

    for (const city of cities) {
        const li = document.createElement("li");
        li.textContent = `${city.name} - ${city.country_code}`;

        li.addEventListener("click", () => {
            cityElement.value = city.name;
            clearSuggestions();
            selectCity(city);
        });

        citiesElement.appendChild(li);
    }
};

const renderSuggestions = (cities: City[], search: string) => {
    if (cities.length === 0) {
        showMessage(`City "${search}" not found`);
        return;
    }

    populateSuggestions(cities);
};

const handleSearch = debounce(async () => {
    const search = cityElement.value.trim();

    clearSuggestions();

    if (!search) {
        showMessage("Select a city on the left");
        return;
    }

    const cities = await getCities(search);

    renderSuggestions(cities, search);
}, 500);

cityElement.addEventListener("input", handleSearch);
