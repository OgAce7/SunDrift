const form = document.getElementById('weather-form');
const input = document.getElementById('city-input');
const result = document.getElementById('weather-result');

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const city = input.value.trim();
  if (!city) return;

  result.innerHTML = 'Loading...';

  try {
    const apiKey = ''; 
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
    );
    const data = await response.json();

    if (data.cod !== 200) {
      result.innerHTML = `<p>${data.message}</p>`;
      return;
    }

    result.innerHTML = `
      <h2>${data.name}, ${data.sys.country}</h2>
      <p><strong>Temperature:</strong> ${data.main.temp} °C</p>
      <p><strong>Weather:</strong> ${data.weather[0].description}</p>
      <p><strong>Humidity:</strong> ${data.main.humidity}%</p>
      <p><strong>Wind:</strong> ${data.wind.speed} m/s</p>
    `;
  } catch (error) {
    result.innerHTML = `<p>Error fetching weather data.</p>`;
  }
});
