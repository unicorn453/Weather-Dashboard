$("#search-button").on("click", function () {
  var city = $("#search-input").val();
  var geocodeURL =
    "https://api.openweathermap.org/geo/1.0/direct?q=" +
    city +
    "&limit=5&appid=5a06ce152c88fa8a790870e5beea3c6f";

  fetch(geocodeURL)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      // Assuming the first result is the correct one
      var lat = data[0].lat;
      var lon = data[0].lon;

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
          for (var i = 0; i < 5; i++) {
            var date = new Date(weatherData.list[i].dt * 1000);
            var cardTitleSelector = ".card-title-" + (i + 1);
            var tempSelector = ".temp-" + (i + 1);
            var windSelector = ".wind-" + (i + 1);
            var humiditySelector = ".humidity-" + (i + 1);

            $(cardTitleSelector).text(date.toLocaleDateString());
            $(tempSelector).text(
              "Temperature: " + weatherData.list[i].main.temp + "°C"
            );
            $(windSelector).text(
              "Wind: " + weatherData.list[i].wind.speed + " KPH"
            );
            $(humiditySelector).text(
              "Humidity: " + weatherData.list[i].main.humidity + "%"
            );
          }
        })
        .catch(function (error) {
          console.log("Error fetching weather data:", error);
        });
    })
    .catch(function (error) {
      console.log("Error fetching geocoding data:", error);
    });
});
