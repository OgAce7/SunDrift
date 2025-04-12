document.addEventListener("DOMContentLoaded", () => {
  const onEnergyPage = window.location.pathname.includes("energy.html");

  if (onEnergyPage) {
    const solarOutput = document.getElementById("solarEnergy");
    const windOutput = document.getElementById("windEnergy");

    async function fetchEnergyData() {
      try {
        const res = await fetch("https://api.openweathermap.org/data/2.5/weather?lat=28.6139&lon=77.2090&appid=655b8dc70cdfccb236ba91a62f686d54&units=metric");
        const data = await res.json();

        const windSpeed = data.wind.speed;
        const description = data.weather[0].description.toLowerCase();

        const irradianceMap = {
          "clear sky": 1000,
          "few clouds": 800,
          "scattered clouds": 600,
          "broken clouds": 400,
          "shower rain": 200,
          "rain": 150,
          "thunderstorm": 100,
          "snow": 100,
          "mist": 50
        };

        const irradiance = irradianceMap[description] || 400;

        const panelArea = 1.6;
        const panelEfficiency = 0.2;
        const solarKW = (panelArea * irradiance * panelEfficiency) / 1000;
        solarOutput.textContent = solarKW.toFixed(2);

        const airDensity = 1.225;
        const rotorArea = Math.PI * Math.pow(25, 2);
        const windEfficiency = 0.3;
        const windKW = 0.5 * airDensity * rotorArea * Math.pow(windSpeed, 3) * windEfficiency / 1000;
        windOutput.textContent = windKW.toFixed(2);

        drawCharts(irradiance, solarKW, windSpeed, windKW);
      } catch (e) {
        solarOutput.textContent = "Error";
        windOutput.textContent = "Error";
      }
    }

    function drawCharts(irradiance, solarKW, windSpeed, windKW) {
      const solarCtx = document.getElementById('solarChart').getContext('2d');
      const windCtx = document.getElementById('windChart').getContext('2d');

      new Chart(solarCtx, {
        type: 'bar',
        data: {
          labels: ['Irradiance (W/m²)', 'Output (kW)'],
          datasets: [{
            label: 'Solar Panel',
            data: [irradiance, solarKW],
            backgroundColor: ['orange', 'green']
          }]
        },
        options: { responsive: true }
      });

      new Chart(windCtx, {
        type: 'bar',
        data: {
          labels: ['Wind Speed (m/s)', 'Output (kW)'],
          datasets: [{
            label: 'Windmill',
            data: [windSpeed, windKW],
            backgroundColor: ['blue', 'purple']
          }]
        },
        options: { responsive: true }
      });
    }

    fetchEnergyData();
  }
});
