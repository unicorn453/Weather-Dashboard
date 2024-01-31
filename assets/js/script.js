$("#search-button").on("click", function () {
  var city = $("#search-input").val();
  $("#search-input").val("");

  // Save the city to local storage
  var cities = JSON.parse(localStorage.getItem("cities")) || [];

  // Trim the cities array to a maximum length of 5
  if (cities.length >= 5) {
    cities = cities.slice(-4); // Keep the last 4 elements
  }

  // Push the new city to the end of the array
  cities.push(city);
  localStorage.setItem("cities", JSON.stringify(cities));

  // Fetch weather data and update UI
  fetchWeather(city);
});

function fetchWeather(city) {
  var geocodeURL =
    "https://api.openweathermap.org/geo/1.0/direct?q=" +
    city +
    "&limit=6&appid=5a06ce152c88fa8a790870e5beea3c6f";

  fetch(geocodeURL)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      var lat = data[0].lat;
      var lon = data[0].lon;

      createHistory(city);

      var queryURL =
        "https://api.openweathermap.org/data/2.5/forecast?lat=" +
        lat +
        "&lon=" +
        lon +
        "&appid=5a06ce152c88fa8a790870e5beea3c6f";

      fetch(queryURL)
        .then(function (response) {
          return response.json();
        })
        .then(function (result) {
          var weatherData = result;
          console.log(weatherData);

          // Update the UI with weather data
          updateUI(weatherData);
        })
        .catch(function (error) {
          console.log("Error fetching weather data:", error);
        });
    })
    .catch(function (error) {
      console.log("Error fetching geocoding data:", error);
    });
}

function updateUI(weatherData) {
  for (var i = 0; i < weatherData.list.length; i += 8) {
    var date = new Date(weatherData.list[i].dt * 1000);
    var date1 = new Date(weatherData.list[1].dt * 1000);
    var date6 = new Date(weatherData.list[39].dt * 1000);
    var cardTitleSelector = ".card-title-" + (i / 8 + 1);
    var tempSelector = ".temp-" + (i / 8 + 1);
    var windSelector = ".wind-" + (i / 8 + 1);
    var humiditySelector = ".humidity-" + (i / 8 + 1);

    $(".city").text(weatherData.city.name + " " + date1.toLocaleDateString());
    $(".humidity-6").text(
      "Humidity: " + weatherData.list[39].main.humidity + "%"
    );
    $(".wind-6").text("Wind: " + weatherData.list[39].wind.speed + " KPH");
    $(".temp-6").text("Temperature: " + tempCelsius6 + "°C");
    // Convert temperature from Kelvin to Celsius
    var tempCelsius = (weatherData.list[i].main.temp - 273.15).toFixed(2);
    $(".card-title-6").text(date6.toLocaleDateString());
    var tempCelsius6 = (weatherData.list[39].main.temp - 273.15).toFixed(2);
    // Update the UI elements with weather data
    $(cardTitleSelector).text(date.toLocaleDateString());
    $(tempSelector).text("Temperature: " + tempCelsius + "°C");
    $(windSelector).text("Wind: " + weatherData.list[i].wind.speed + " KPH");
    $(humiditySelector).text(
      "Humidity: " + weatherData.list[i].main.humidity + "%"
    );
  }
}

function createHistory(city) {
  var historyDiv = $(".history");
  var cities = JSON.parse(localStorage.getItem("cities")) || [];

  // Clear the content of the historyDiv
  historyDiv.empty();

  // Loop through the cities array and create buttons
  for (let i = Math.min(cities.length, 5) - 1; i >= 0; i--) {
    var button = $("<button></button>").text(cities[i]);
    button.addClass("last-search");
    historyDiv.append(button);

    // Add click event listener to execute weather function
    button.on("click", function () {
      var city = $(this).text();
      // Call function to search weather for the clicked city
      fetchWeather(city);
    });
  }

  // Update the cities array in local storage
  localStorage.setItem("cities", JSON.stringify(cities));
}
