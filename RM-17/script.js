document.addEventListener("DOMContentLoaded", () => {
    const countryCards = document.getElementById("country-cards");

    // Fetch data from Restcountries API
    fetch("https://restcountries.com/v3.1/all")
        .then(response => response.json())
        .then(data => {
            data.forEach(country => {
                // Create a Bootstrap card for each country
                const card = document.createElement("div");
                card.className = "card col-md-4 mb-4";

                // Extract the necessary data
                const { capital, latlng, flags, region, name, cca2 } = country;

                // Create card content
                card.innerHTML = `
                    <img src="${flags.svg}" class="card-img-top" alt="${name.common}">
                    <div class="card-body">
                        <h5 class="card-title">${name.common}</h5>
                        <p class="card-text">Capital: ${capital}</p>
                        <p class="card-text">Lat/Lng: ${latlng.join(", ")}</p>
                        <p class="card-text">Region: ${region}</p>
                        <p class="card-text">Country Code: ${cca2}</p>
                        <button class="btn btn-primary" data-toggle="collapse" data-target="#weather-${cca2}" data-country="${name.common}">
                            Show Weather
                        </button>
                        <div id="weather-${cca2}" class="collapse">
                            <!-- Weather data will be inserted here -->
                        </div>
                    </div>
                `;

                // Add the card to the container
                countryCards.appendChild(card);

                // Fetch weather data from OpenWeatherMap API when the "Show Weather" button is clicked
                card.querySelector(".btn").addEventListener("click", () => {
                    const weatherDiv = card.querySelector(`#weather-${cca2}`);
                    if (weatherDiv.innerHTML === "") {
                        fetchWeatherData(name.common, weatherDiv);
                    }
                });
            });
        })
        .catch(error => console.error("Error fetching country data:", error));

    // Function to fetch weather data from OpenWeatherMap API
    function fetchWeatherData(countryName, weatherDiv) {
        const apiKey = "https://openweathermap.org/"; // Replace with your API key
        const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${countryName}&appid=${apiKey}&units=metric`;

        fetch(apiUrl)
            .then(response => response.json())
            .then(weatherData => {
                // Extract and display weather information
                const temperature = weatherData.main.temp;
                const weatherDescription = weatherData.weather[0].description;
                const weatherInfo = `
                    <p>Temperature: ${temperature}°C</p>
                    <p>Description: ${weatherDescription}</p>
                `;
                weatherDiv.innerHTML = weatherInfo;
            })
            .catch(error => console.error("Error fetching weather data:", error));
    }
});
