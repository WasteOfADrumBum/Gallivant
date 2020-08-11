/* -- ||  Contact.html Logo/Icon Image || -- */
/* © Joshua M. Small */

// Change #gallivant-logo-contact from Logo -to-> Icon on window < 768px
function checkResolution() {
	if ($(window).innerWidth() < 768) {
		// window < 640px = Icon
		$("#gallivant-logo-contact").attr(
			"src",
			"assets/images/gallivant-icon.png",
		);
	} else {
		// window > 768px = Logo
		$("#gallivant-logo-contact").attr(
			"src",
			"assets/images/gallivant-logo.png",
		);
	}
}

// Check img on window resize
$(window).resize(function () {
	checkResolution();
});

// Check img on window load
$(document).ready(function () {
	checkResolution();

	/* -- || Form Date Restriction || -- */
	/* © Joshua M. Small */

	// Todays Date
	var today = new Date();
	var dd = today.getDate();
	var mm = today.getMonth() + 1;
	var yy = today.getFullYear();
	if (dd < 10) {
		dd = "0" + dd;
	}
	if (mm < 10) {
		mm = "0" + mm;
	}
	var rightNow = yy + "-" + mm + "-" + dd;
	// Set Todays Date
	$("#departing-date").attr("value", rightNow);
	// min Departure Date
	$(".form-date").attr("min", rightNow);
	// Min Return Date
	$("#departing-date").on("change", function () {
		$("#returning-date").attr("min", $(this).val());
	});
	// Max Date (+1 year)
	var dateMax = yy + 1 + "-" + mm + "-" + dd;
	$(".form-date").attr("max", dateMax);

	/* -- || Form (#loc-date-form) || -- */
	/* © Joshua M. Small */

	/* Captures index.html formData to be used on results.html */
	// Instead of listening to button click, always listen to form submit event
	$("#loc-date-form").submit(function () {
		// Create an array of objects called `formData`
		var formData = $(this)
			.find(":input")
			.map(function () {
				return {
					name: $(this).attr("name"),
					value: $(this).val(),
				};
			})
			.get();

		// Store it in localStorage
		localStorage.setItem("formData", JSON.stringify(formData));
	});

	// Read and parse from localStorage
	var formData = JSON.parse(localStorage.getItem("formData"));

	// Iterate through array, and set HTML of matching <span> element
	$.each(formData, function (i, datum) {
		$("#display_" + datum.name).html(datum.value);
	});

	/* Trip Selection Title Change */
	/* © Joshua M. Small */

	// genSelectTitles() must be before int/rtn-select functions
	function genSelectTitles(formData) {
		// empty any existing content
		$("#trip-selection").empty();

		$("#trip-selection").append(
			"<div id='int-select'><a>" +
				formData[0].value +
				" - to - " +
				formData[2].value +
				"</a></div>",
			"<div id='rtn-select'><a>" +
				formData[2].value +
				" - to - " +
				formData[0].value +
				"</a></div>",
		);
	}
	genSelectTitles(formData);

	/* -- || Trip Container Display || -- */
	/* © Joshua M. Small */

	$("#int-select").click(function () {
		document.getElementById("int-select").style.textShadow =
			"2px 2px 1px black";
		document.getElementById("rtn-select").style.textShadow = "none";
		$("#int-trip-container").show();
		$("#rtn-trip-container").hide();
	});

	$("#rtn-select").click(function () {
		document.getElementById("int-select").style.textShadow = "none";
		document.getElementById("rtn-select").style.textShadow =
			"2px 2px 1px black";
		$("#int-trip-container").hide();
		$("#rtn-trip-container").show();
	});

	/* Trip Titles for Callout */
	/* © Joshua M. Small */

	function getCalloutTitles(formData) {
		$("#city-name-1").append("Plan Your Trip To: " + formData[2].value);
		$("#city-name-1-5-day").append(formData[2].value);
		$("#city-name-2").append("Plan Your Return Trip To: " + formData[0].value);
		$("#d-location-name-pic").append(formData[2].value);
		$("#r-location-name-pic").append(formData[0].value);
	}

	/* -- || UnSplash API || -- */

	function searchPicture(formData) {
		$.ajax({
			type: "GET",
			url:
				"https://api.unsplash.com/search/photos/?client_id=" +
				"DlLo3jJvn5zyAKmxFu4A5tczXvAgDss4YSwR1hVVr7U" +
				"&collections=travel,city&orientation=landscape&query=" +
				formData[2].value,
			dataType: "json",
			success: function (data) {
				// empty any existing content
				$(".d-picture-api").empty();

				// Create IMG
				var dImg = $("<img>", {
					id: "d-img-div",
				});
				dImg.attr("src", data.results[0].urls.regular);

				// Append Info
				$(".d-picture-api").append(dImg);
			},
		});

		$.ajax({
			type: "GET",
			url:
				"https://api.unsplash.com/search/photos/?client_id=" +
				"DlLo3jJvn5zyAKmxFu4A5tczXvAgDss4YSwR1hVVr7U" +
				"&collections=travel,city&orientationlandscape&query=" +
				formData[0].value,
			dataType: "json",
			success: function (data) {
				// empty any existing content
				$(".r-picture-api").empty();

				// Create IMG
				var rImg = $("<img>", {
					id: "r-img-div",
				});
				rImg.attr("src", data.results[0].urls.regular);

				// Append Info
				$(".r-picture-api").append(rImg);
			},
		});
	}

	/* -- || FourSquare POI API || -- */
	/* © Joshua M. Small */

	// ES6: Generate HTML structure
	function genAPOIHTML(name, prefix, suffix, category, formattedAddress) {
		var resultsPOI = `<div class="poiContainer" id="rPoiContainer">
				<div class="poiName" id="rPoiName">${name}</div>
				<img src="${prefix}100${suffix}">
				<div class="poiCategory" id="rPoiCategory">${category}</div>
				<div class="poiAddress" id="rPoiAddress">${formattedAddress}</div>
			</div>`;

		return resultsPOI;
	}

	/* Departing Location */
	function searchPoi1(formData) {
		$.ajax({
			dataType: "json",
			url:
				"https://api.foursquare.com/v2/venues/explore?client_id=" +
				"AUDT0CAL3XRXK3GLXESAXBXNGJT2PH3DAKMVKXMUHDUEGRIF" +
				"&client_secret=" +
				"TW1AT2BTK5XOPBGTZAJ4TJYFO55Y31P55ZFMHOHN0S3QJ4EQ" +
				"&v=20180323&limit=10&near=" +
				formData[0].value,
			data: {},
			beforeSend: function (jqXHR, settings) {
				// console.log("ajax URL:", settings.url, "XHR", jqXHR);
			},
			success: function (data) {
				// empty any existing content
				$(".r-attractions-api").empty();

				// Create POI Title
				var aTitle = $("<div>", {
					class: "poiTitle",
					id: "aPoiTitle",
				});
				aTitle.text(formData[0].value + "'s Attractions:");

				$(".r-attractions-api-title").append(aTitle);

				for (var i = 0; i < 5; i++) {
					// Append Info
					var aContainer = genAPOIHTML(
						data.response.groups[0].items[i].venue.name,
						data.response.groups[0].items[i].venue.categories[0].icon.prefix,
						data.response.groups[0].items[i].venue.categories[0].icon.suffix,
						data.response.groups[0].items[i].venue.categories[0].name,
						data.response.groups[0].items[i].venue.location.formattedAddress,
					);

					// Merge and display
					$(".r-attractions-api").append(aContainer);
				}
			},
		});
	}

	/* Arriving Location */
	function searchPoi2(formData) {
		// empty any existing content
		$(".r-attractions-api").empty();

		// Create POI Title
		var dTitle = $("<div>", {
			class: "poiTitle",
			id: "aPoiTitle",
		});
		dTitle.text(formData[2].value + "'s Attractions:");

		$(".d-attractions-api-title").append(dTitle);

		$.ajax({
			dataType: "json",
			url:
				"https://api.foursquare.com/v2/venues/explore?client_id=" +
				"AUDT0CAL3XRXK3GLXESAXBXNGJT2PH3DAKMVKXMUHDUEGRIF" +
				"&client_secret=" +
				"TW1AT2BTK5XOPBGTZAJ4TJYFO55Y31P55ZFMHOHN0S3QJ4EQ" +
				"&v=20180323&limit=10&near=" +
				formData[2].value,
			data: {},
			beforeSend: function (jqXHR, settings) {
				// console.log("ajax URL:", settings.url, "XHR", jqXHR);
			},
			success: function (data) {
				// empty any existing content
				$(".d-attractions-api").empty();
				for (var i = 0; i < 5; i++) {
					// Append Info
					var rContainer = genAPOIHTML(
						data.response.groups[0].items[i].venue.name,
						data.response.groups[0].items[i].venue.categories[0].icon.prefix,
						data.response.groups[0].items[i].venue.categories[0].icon.suffix,
						data.response.groups[0].items[i].venue.categories[0].name,
						data.response.groups[0].items[i].venue.location.formattedAddress,
					);

					// Merge and display
					$(".d-attractions-api").append(rContainer);
				}
			},
		});
	}

	/* -- || Skypicker Flight Search || -- */
	/* © Tanner Cook */

	function searchFlight() {
		var formData = JSON.parse(localStorage.getItem("formData"));
		var departLoc = formData[0].value;
		var departDate = formData[1].value;
		var arrivalLoc = formData[2].value;
		var arrivalDate = formData[3].value;
		var flightApiCodeDep =
			"https://api.skypicker.com/locations?term=" +
			departLoc +
			"&locale=en-US&location_types=airport&limit=1&active_only=true&sort=name";
		var flightApiCodeArr =
			"https://api.skypicker.com/locations?term=" +
			arrivalLoc +
			"&locale=en-US&location_types=airport&limit=1&active_only=true&sort=name";
		var apiCodeDepart;
		var apiCodeArrival;
		getFlightInfo();

		function getFlightInfo() {
			$.ajax({
				url: flightApiCodeDep,
				dateType: "json",
				method: "GET",
				success: function (codeDData) {
					apiCodeDepart = codeDData.locations[0].code;
					if (apiCodeDepart === null) {
						$(".d-flight-api").append(`<p>Could not be found!?</p>`);
					} else {
						$.ajax({
							url: flightApiCodeArr,
							dateType: "json",
							method: "GET",
							success: function (codeAData) {
								apiCodeArrival = codeAData.locations[0].code;
								// Arrival Date Correct Format
								var arriveRearrange = moment(arrivalDate).format("DD/MM/YYYY");

								// Depature Date Correct Format
								var departRearrange = moment(departDate).format("DD/MM/YYYY");

								if (apiCodeArrival === null) {
									$(".d-flight-api").append(`<p>Could not be found!?</p>`);
								} else {
									// Make Arrival API URL
									var flightApiArrivingAir =
										"https://api.skypicker.com/flights?fly_from=" +
										apiCodeArrival +
										"&fly_to=" +
										apiCodeDepart +
										"&dateFrom=" +
										departRearrange +
										"&dateTo=" +
										arriveRearrange +
										"&partner=picky&v=3&limit=5";
									// Make Departure API URL
									var flightApiDepartingAir =
										"https://api.skypicker.com/flights?fly_from=" +
										apiCodeDepart +
										"&fly_to=" +
										apiCodeArrival +
										"&dateFrom=" +
										departRearrange +
										"&dateTo=" +
										arriveRearrange +
										"&partner=picky&v=3&limit=5";
									// Departing AJAX

									$.ajax({
										url: flightApiDepartingAir,
										dataType: "json",
										method: "GET",
										success: function (data) {
											for (var i = 0; i < 5; i++) {
												// Time Conversion
												var utcSeconds = data.data[i].dTimeUTC;
												var departTime = new Date(0);
												departTime.setUTCSeconds(utcSeconds);
												var arrivalTime = new Date(0);
												arrivalTime.setUTCSeconds(data.data[i].aTimeUTC);

												// if(data.data[i].dTimeUTC === null) {
												// 	$(".d-flight-api").append(
												// 		"Airport flight time not available for this location",
												// 	);
												// }

												if (data.data[i].cityFrom !== formData[0].value) {
													$(".d-flight-api").append(
														"Airport flight information not availble for this location",
													);
												}
												// If Null
												if (apiCodeDepart === null) {
													$(".d-flight-api").append(
														`<p>Could not be found!?</p>`,
													);
												} // Else Works
												else {
													// Append Departure Info
													$(".d-flight-api").append(
														`<h5>From ${data.data[i].cityFrom} to ${data.data[i].cityTo}</h5>`,
													);
													$(".d-flight-api").append(
														`<h6 class="apirport-code">${data.data[i].cityCodeFrom}</h6>`,
													);
													$(".d-flight-api").append(
														`<p class="airport-time">${departTime}</p>`,
													);
													$(".d-flight-api").append(
														`<h6 class="apirport-code">${data.data[i].cityCodeTo}</h6>`,
													);
													$(".d-flight-api").append(
														`<p class="airport-time">${arrivalTime}</p>`,
													);
												}
											}
										},
									});
									// Arrial AJAX
									$.ajax({
										url: flightApiArrivingAir,
										dateType: "json",
										method: "GET",
										success: function (data) {
											for (var i = 0; i < 5; i++) {
												// Time Conversion
												var utcSeconds = data.data[i].dTimeUTC;
												var departTime = new Date(0);
												departTime.setUTCSeconds(utcSeconds);
												var arrivalTime = new Date(0);
												arrivalTime.setUTCSeconds(data.data[i].aTimeUTC);
												var airportCodeTo = data.data[i].cityCodeTo;
												if (data.data[i].cityFrom !== formData[2].value) {
													$(".r-flight-api").append(
														"Airport flight information not availble for this location",
													);
												}
												// If Null
												if (apiCodeDepart === null) {
													$(".d-flight-api").append(
														`<p>Could not be found!?</p>`,
													);
												} // Else Works
												else {
													// Append Return Info
													$(".r-flight-api").append(
														`<h5>From ${data.data[i].cityFrom} to ${data.data[i].cityTo}</h5>`,
													);
													$(".r-flight-api").append(
														`<h6 class="airport-code">${data.data[i].cityCodeFrom}</h6>`,
													);
													$(".r-flight-api").append(
														`<p  class="airport-time">${arrivalTime}</p>`,
													);


												}
											}
										},
									});
								}
							},
						});
					}
				},
			});
		}
	}
	//need statement to stop displaying flights if given city does not match input city
	//solve route issue

	/* -- ||  Open Weather Map || -- */
	/* © Garrett Dobson */

	// Global weather variables
	var apiWeatherKey = "&appid=f18b83f11c206025350af3f0978bacde";

	// Forecast ES6
	function genForecastHTML(name, fivedatestr, icon, temp, humidity, speed) {
		var forecastWeather = `<div class="card-forecast bg-light" style="width: 20%;">
                    <div class="card-body">
                        <h5 class="card-title">${name}</h5>
                        <p class="card-text"> ${fivedatestr} </p>
                        <img src="https://openweathermap.org/img/w/${icon}.png">
                        <p class="card-text">Temperature: ${temp} °F</p>
                        <p class="card-text">Humidity: ${humidity} %</p>
                        <p class="card-text">Wind Speed: ${speed} MPH</p>
                    </div>
                </div>`;
		return forecastWeather;
	}

	//5 day forecast of city you're going to
	function getForecast(formData) {
		$.ajax({
			type: "GET",
			url:
				"https://api.openweathermap.org/data/2.5/forecast?q=" +
				formData[2].value +
				"&units=imperial" +
				apiWeatherKey,
			dataType: "json",
			success: function (data) {
				for (var i = 0; i < data.list.length; i++) {
					if (data.list[i].dt_txt.indexOf("15:00:00") !== -1) {
						var fiveSec = data.list[i].dt;
						var fiveForecastDate = new Date(fiveSec * 1000);
						var fiveDateStr = fiveForecastDate.toLocaleDateString();

						var fiveDayForecast = genForecastHTML(
							data.city.name,
							fiveDateStr,
							data.list[i].weather[0].icon,
							data.list[i].main.temp,
							data.list[i].main.humidity,
							data.list[i].wind.speed,
						);

						$("#forecast").append(fiveDayForecast);
					}
				}
			},
		});
	}

	// Departing City Weather
	function searchWeather(formData) {
		$.ajax({
			url:
				"https://api.openweathermap.org/data/2.5/weather?q=" +
				formData[0].value +
				"&units=imperial" +
				apiWeatherKey,
			type: "GET",
			dataType: "json",
			success: function (data) {
				var correctFinalDate0 = moment(formData[1].value).format("l");
				var currentDate = data.dt;
				var todaysDate = new Date(currentDate * 1000);
				var departDateStr = todaysDate.toLocaleDateString();
				if (correctFinalDate0 !== departDateStr) {
					var currentWeather0a = `<div class="card bg-light" id="weather-card">
        <div class="card-body">
                    <h5 class="card-title">${data.name}'s Departing Weather</h5>
                    <p class="card-text">${departDateStr}</p>
                    <img src="https://openweathermap.org/img/w/${data.weather[0].icon}.png">
          <p class="card-text">Temperature: ${data.main.temp} °F</p>
          <p class="card-text">Humidity: ${data.main.humidity}%</p>
                    <p class="card-text">Wind Speed: ${data.wind.speed} MPH</p>
                    <p class="card-text" id="disclaimer">Weather for ${correctFinalDate0} is currently unavailable. <BR> Displaying current weather for ${departDateStr} </p>
        </div>
            </div>`;
					$("#today").html(currentWeather0a);
				} else {
					var currentWeather0b = `<div class="card bg-light" id="weather-card">
        <div class="card-body">
                    <h5 class="card-title">${data.name}'s Departing Weather</h5>
                    <p class="card-text">${departDateStr}</p>
                    <img src="https://openweathermap.org/img/w/${data.weather[0].icon}.png">
          <p class="card-text">Temperature: ${data.main.temp} °F</p>
          <p class="card-text">Humidity: ${data.main.humidity}%</p>
                    <p class="card-text">Wind Speed: ${data.wind.speed} MPH</p>
        </div>
            </div>`;
					$("#today").html(currentWeather0b);
				}
			},
		});
	}

	// Initial Trip: Desitnation City Weather
	function searchWeatherArrival(formData) {
		$.ajax({
			url:
				"https://api.openweathermap.org/data/2.5/weather?q=" +
				formData[2].value +
				"&units=imperial" +
				apiWeatherKey,
			type: "GET",
			dataType: "json",
			success: function (data) {
				// Moment Date Conversion
				var correctFinalDate3 = moment(formData[1].value).format("l");
				// Weather Date Conversion
				var currentDate = data.dt;
				var todaysDate = new Date(currentDate * 1000);
				var departDateStr = todaysDate.toLocaleDateString();
				if (correctFinalDate3 !== departDateStr) {
					var returnCurrentWeather1d = `
					<div class="card bg-light" id="weather-card-2">
						<div class="card-body">
							<h5 class="card-title">${data.name}'s Arrival Weather</h5>
							<p class="card-text">${departDateStr}</p>
							<img src="https://openweathermap.org/img/w/${data.weather[0].icon}.png">
							<p class="card-text">Temperature: ${data.main.temp} °F</p>
							<p class="card-text">Humidity: ${data.main.humidity}%</p>
							<p class="card-text">Wind Speed: ${data.wind.speed} MPH</p>
							<p class="card-text" id="disclaimer">Weather for ${correctFinalDate3} is currently unavailable. <BR> Displaying current weather for ${departDateStr} </p>
						</div>
					</div>`;
					$("#weather-today-destination").html(returnCurrentWeather1d);
				} else {
					var returnCurrentWeather2d = `
					<div class="card bg-light" id="weather-card-2">
						<div class="card-body">
							<h5 class="card-title">${data.name}</h5>
							<p class="card-text">${departDateStr}</p>
							<img src="https://openweathermap.org/img/w/${data.weather[0].icon}.png">
							<p class="card-text">Temperature: ${data.main.temp} °F</p>
							<p class="card-text">Humidity: ${data.main.humidity}%</p>
							<p class="card-text">Wind Speed: ${data.wind.speed} MPH</p>
						</div>
					</div>`;
					$("#weather-today-destination").html(returnCurrentWeather2d);
				}
			},
		});
	}

	// Arrival City Weather
	function searchWeatherReturn(formData) {
		$.ajax({
			url:
				"https://api.openweathermap.org/data/2.5/weather?q=" +
				formData[2].value +
				"&units=imperial" +
				apiWeatherKey,
			type: "GET",
			dataType: "json",
			success: function (data) {
				// Moment Date Conversion
				var correctFinalDate1 = moment(formData[3].value).format("l");
				// Weather Date Conversion
				var currentDate = data.dt;
				var todaysDate = new Date(currentDate * 1000);
				var departDateStr = todaysDate.toLocaleDateString();
				if (correctFinalDate1 !== departDateStr) {
					var returnCurrentWeather1a = `<div class="card bg-light" id="weather-card">
        <div class="card-body">
                    <h5 class="card-title">${data.name}'s Departing Weather</h5>
                    <p class="card-text">${departDateStr}</p>
                    <img src="https://openweathermap.org/img/w/${data.weather[0].icon}.png">
          <p class="card-text">Temperature: ${data.main.temp} °F</p>
          <p class="card-text">Humidity: ${data.main.humidity}%</p>
                    <p class="card-text">Wind Speed: ${data.wind.speed} MPH</p>
                    <p class="card-text" id="disclaimer">Weather for ${correctFinalDate1} is currently unavailable. <br> Displaying current weather for ${departDateStr} </p>
        </div>
      </div>`;
					$("#return-today").html(returnCurrentWeather1a);
				} else {
					var returnCurrentWeather2a = `<div class="card bg-light" id="weather-card">
        <div class="card-body">
                    <h5 class="card-title">${data.name}'s Departing Weather</h5>
                    <p class="card-text">${departDateStr}</p>
                    <img src="https://openweathermap.org/img/w/${data.weather[0].icon}.png">
          <p class="card-text">Temperature: ${data.main.temp} °F</p>
          <p class="card-text">Humidity: ${data.main.humidity}%</p>
                    <p class="card-text">Wind Speed: ${data.wind.speed} MPH</p>
        </div>
      </div>`;
					$("#return-today").html(returnCurrentWeather2a);
				}
			},
		});
	}

	// Return Trip: Desitnation City Weather
	function searchWeatherReturnDepart(formData) {
		$.ajax({
			url:
				"https://api.openweathermap.org/data/2.5/weather?q=" +
				formData[0].value +
				"&units=imperial" +
				apiWeatherKey,
			type: "GET",
			dataType: "json",
			success: function (data) {
				// Moment Date Conversion
				var correctFinalDate2 = moment(formData[3].value).format("l");
				// Weather Date Conversion
				var currentDate = data.dt;
				var todaysDate = new Date(currentDate * 1000);
				var departDateStr = todaysDate.toLocaleDateString();
				if (correctFinalDate2 !== departDateStr) {
					var returnCurrentWeather1b = `<div class="card bg-light" id="weather-card-2">
                    <div class="card-body">
                        <h5 class="card-title">${data.name}'s Arrival Weather</h5>
                        <p class="card-text">${departDateStr}</p>
                        <img src="https://openweathermap.org/img/w/${data.weather[0].icon}.png">
                        <p class="card-text">Temperature: ${data.main.temp} °F</p>
                        <p class="card-text">Humidity: ${data.main.humidity}%</p>
                        <p class="card-text">Wind Speed: ${data.wind.speed} MPH</p>
                        <p class="card-text" id="disclaimer">Weather for ${correctFinalDate2} is currently unavailable. <BR> Displaying current weather for ${departDateStr} </p>
                    </div>
                </div>`;
					$("#return-today-destination").html(returnCurrentWeather1b);
				} else {
					var returnCurrentWeather2b = `<div class="card bg-light" id="weather-card-2">
                    <div class="card-body">
                        <h5 class="card-title">${data.name}'s Arrival Weather</h5>
                        <p class="card-text">${departDateStr}</p>
                        <img src="https://openweathermap.org/img/w/${data.weather[0].icon}.png">
                        <p class="card-text">Temperature: ${data.main.temp} °F</p>
                        <p class="card-text">Humidity: ${data.main.humidity}%</p>
                        <p class="card-text">Wind Speed: ${data.wind.speed} MPH</p>
                    </div>
                </div>`;
					$("#return-today-destination").html(returnCurrentWeather2b);
				}
			},
		});
	}

	/* -- || CALL FUNCTIONS || -- */
	getCalloutTitles(formData);
	// UnSplash API
	searchPicture(formData);
	// FourSquare API
	searchPoi1(formData);
	searchPoi2(formData);
	// Skypicker API
	searchFlight(formData);
	// Open Weather Map API
	getForecast(formData);
	searchWeather(formData);
	searchWeatherArrival(formData);
	searchWeatherReturn(formData);
	searchWeatherReturnDepart(formData);
});
