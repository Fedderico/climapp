const API_KEY = '04e8979f14247f5b8a91435b753bf2d4';

const searchButton = document.getElementById('searchButton');
const cityInput = document.getElementById('cityInput');
const weatherInfo = document.getElementById('weatherInfo');
const favoriteLocationsList = document.getElementById('favoriteLocations');

searchButton.addEventListener('click', async () => {
  const city = cityInput.value.trim();
  if (city !== '') {
    try {
      const weatherData = await fetchWeatherData(city);
      displayWeatherInfo(weatherData);
    } catch (error) {
      console.error('Error al obtener el clima:', error);
      weatherInfo.innerHTML = 'Error al obtener el clima. Intente nuevamente.';
    }
  } else {
    weatherInfo.innerHTML = 'Por favor, ingrese una ciudad válida.';
  }
});

function fetchWeatherData(city) {
  const API_URL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`;
  return fetch(API_URL)
    .then(response => {
      if (!response.ok) {
        throw new Error('Ciudad no encontrada');
      }
      return response.json();
    });
}

function displayWeatherInfo(weatherData) {
  const { name, main, weather } = weatherData;

  const weatherInfoHTML = `
    <h2 class="text-xl font-semibold mb-2">${name}</h2>
    <p>Temperatura: ${main.temp}°C</p>
    <p>Descripción: ${weather[0].description}</p>
  `;
  weatherInfo.innerHTML = weatherInfoHTML;

  const favoriteLocationButton = document.createElement('button');
  favoriteLocationButton.textContent = 'Guardar Ubicación';
  favoriteLocationButton.classList.add('bg-blue-500', 'text-white', 'px-3', 'py-1', 'rounded', 'mt-2', 'cursor-pointer');
  favoriteLocationButton.addEventListener('click', () => {
    saveFavoriteLocation(name);
  });

  weatherInfo.appendChild(favoriteLocationButton);
}

function saveFavoriteLocation(city) {
  let favoriteLocations = JSON.parse(localStorage.getItem('favoriteLocations')) || [];
  if (!favoriteLocations.includes(city)) {
    favoriteLocations.push(city);
    localStorage.setItem('favoriteLocations', JSON.stringify(favoriteLocations));
    displayFavoriteLocations();
  }
}

function displayFavoriteLocations() {
    favoriteLocationsList.innerHTML = '';
    let favoriteLocations = JSON.parse(localStorage.getItem('favoriteLocations')) || [];
  
    if (favoriteLocations.length > 0) {
      const lastLocation = favoriteLocations[favoriteLocations.length - 1];
  
      favoriteLocations.slice(0, -1).forEach(location => {
        const listItem = document.createElement('li');
        listItem.innerText = location;
  
        favoriteLocationsList.appendChild(listItem);
      });
  
      const lastItem = document.createElement('li');
      lastItem.innerText = lastLocation;
  
      const deleteButton = document.createElement('button');
      deleteButton.textContent = 'Eliminar';
      deleteButton.classList.add('bg-red-500', 'text-white', 'px-2', 'py-1', 'rounded', 'ml-2', 'text-xs');
      deleteButton.style.verticalAlign = 'middle';
      deleteButton.addEventListener('click', () => {
        localStorage.setItem('favoriteLocations', JSON.stringify(favoriteLocations));
        displayFavoriteLocations();
      });
  
      lastItem.appendChild(deleteButton);
      favoriteLocationsList.appendChild(lastItem);
    } else {
      favoriteLocationsList.innerHTML = 'No hay ubicaciones favoritas almacenadas.';
    }
  }
  
  displayFavoriteLocations();
  