// Function to get user's location and get the weather from that location
function getUserLocation() {
    if("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(async (position) => {
            // const lat = position.coords.latitude;
            // const lon = position.coords.longitude;
            let lat = parseFloat(position.coords.latitude);
            let lon = parseFloat(position.coords.longitude);
            getWeatherByCoordinates(lat, lon);
        }, (error) => {
            document.getElementById("cityName").innerHTML = "Location access denied";
            document.getElementById("temperature").innerHTML = "--°";
            document.getElementById("humidity").innerHTML = "--%";
            document.getElementById("weatherDescription").innerHTML = "Please allow location access.";
            document.getElementById("weatherIcon").className = "bi bi-exclamation-circle text-danger";
        });
    } else {
        document.getElementById("cityName").innerHTML = "Geolocation not supported.";
    }
}

// Function to fetch the city and state
async function getCityAndState(lat, lon) {
        lat = parseFloat(lat);
        lon = parseFloat(lon);
        const city = await fetch(`https://us1.api-bdc.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`);
        const cityData = await city.json();
        const cityName = cityData.city + ', ' + cityData.principalSubdivision;
        document.getElementById("cityName").innerHTML = cityName;
}

// Function to fetch the weather based on the coordinates
async function getWeatherByCoordinates(lat, lon) {
    try {
        lat = parseFloat(lat);
        lon = parseFloat(lon);
        // Fetching City Name
        const geo = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`);
        const geoData = await geo.json();
        // const cityName = geoData.results ? geoData.results[0].name : "Your Location";
        //const cityName = geoData.latitude + ',' + geoData.longitude;

        // Fetching Weather Data
        const weather = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,weather_code`);
        const weatherData = await weather.json();
        console.log(weatherData);
        const temp = weatherData.current.temperature_2m;
        const humidity = weatherData.current.relative_humidity_2m;
        const weatherCode = weatherData.current.weather_code;

        // Fetch weather description and icon
        const weatherDescription = getWeatherDescription(weatherCode);
        const icon = getWeatherIcon(weatherCode);

        // Updating the UI
        document.getElementById("temperature").innerHTML = `${temp}°C`;
        document.getElementById("humidity").innerHTML = `${humidity}%`;
        document.getElementById("weatherDescription").innerHTML = weatherDescription;
        document.getElementById("weatherIcon").className = `bi ${icon}`;
        getCityAndState(lat, lon);
    } catch (error) {
        console.error("Error fetching weather data:", error)
    }
}

// Function to get Bootstrap Icons based on weather codes
function getWeatherIcon(code) {
    const weatherIcons = {
        0: "bi-brightness-high",
        1: "bi-cloud-sun",
        2: "bi-cloud",
        3: "bi-clouds",
        45: "bi-cloud-fog2",
        48: "bi-cloud-fog",
        51: "bi-cloud-drizzle",
        53: "bi-cloud-drizzle",
        55: "bi-cloud-drizzle",
        61: "bi-cloud-rain",
        63: "bi-cloud-rain-heavy",
        65: "bi-cloud-rain-heavy",
        71: "bi-cloud-snow",
        73: "bi-cloud-snow",
        75: "bi-cloud-snow",
        77: "bi-snow",
        80: "bi-cloud-rain",
        81: "bi-cloud-rain-heavy",
        82: "bi-cloud-rain-heavy",
        85: "bi-cloud-snow",
        86: "bi-cloud-snow",
        86: "bi-cloud-snow",
        95: "bi-cloud-lightning",
        96: "bi-cloud-lightning-rain",
        99: "bi-cloud-lightning-rain",
    };
    return weatherIcons[code];
}

// Function to get the weather descriptions based on the weather codes
function getWeatherDescription(code) {
    const weatherDescriptions = {
        0: "Clear Sky",
        1: "Mostly Clear",
        2: "Partly Cloudy",
        3: "Overcast",
        45: "Foggy",
        48: "Dense Fog",
        51: "Light Drizzle",
        53: "Moderate Drizzle",
        55: "Heavy Drizzle",
        61: "Light Rain",
        63: "Moderate Rain",
        65: "Heavy Rain",
        71: "Light Snow",
        73: "Moderate Snow",
        75: "Heavy Snow",
        77: "Snow Grains",
        80: "Showers",
        81: "Heavy Showers",
        82: "Violent Showers",
        85: "Snow Showers",
        86: "Heavy Snow Showers",
        95: "Thunderstorm",
        96: "Thunderstorm with Rain",
        99: "Severe Thunderstorm",
    };
    return weatherDescriptions[code];
}

// Fetching the weather when the page loads
document.addEventListener("DOMContentLoaded", getUserLocation);



// https://open-meteo.com/en/docs#latitude=${lat}&longitude=${lon}