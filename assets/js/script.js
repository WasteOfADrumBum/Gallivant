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
	console.log("Today's Date: ", rightNow);
	// min Departure Date
	$(".form-date").attr("min", rightNow);
	console.log("Min. Departure Date: ", rightNow);
	// Min Return Date
	$("#departing-date").on("change", function () {
		$("#returning-date").attr("min", $(this).val());
	});
	// Max Date (+1 year)
	var dateMax = yy + 1 + "-" + mm + "-" + dd;
	$(".form-date").attr("max", dateMax);
	console.log("Max Date: ", dateMax);

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
	console.log("formData Array:", formData);

	/* Trip Selection Title Change */
	/* © Joshua M. Small */

	// genSelectTitles() must be before int/rtn-select functions
	function genSelectTitles(formData) {
		// empty any existing content
		$("#trip-selection").empty();

		console.log("Create Trip Selection Titles");

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

	/* -- || FourSquare POI API || -- */
	/* © Joshua M. Small */

	console.log("-- || FourSquare POI API || --");

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
	console.log("Departing City:", formData[0].value);

	function searchPoi1(formData) {
		console.log("-- || Start POI Arrival Function || --");

		$.ajax({
			dataType: "json",
			url:
				"https://api.foursquare.com/v2/venues/explore?client_id=" +
				"QAEJY0NAQYS0IHBYU1NXNCWNBTMMIESQ0URVCHIVYXO2YBEC" +
				"&client_secret=" +
				"SCZW0ZYVTPRLYFA1QXLRISAXCBXUNFURYEMUVGHORJ5NZUQN" +
				"&v=20180323&limit=10&near=" +
				formData[0].value,
			data: {},
			beforeSend: function (jqXHR, settings) {
				console.log("ajax URL:", settings.url);
			},
			success: function (data) {
				console.log("-- || POI Arrival Data || --");
				console.log("Data:", data);

				// empty any existing content
				$(".r-attractions-api").empty();

				// Create POI Title
				var aTitle = $("<div>", {
					class: "poiTitle",
					id: "aPoiTitle",
				});
				aTitle.text(formData[0].value + "'s Attractions:");

				$(".r-attractions-api-title").append(aTitle);

				console.log("-- || POI Arrival Loop || --");
				for (var i = 0; i < 5; i++) {
					console.log(
						"A Loop #",
						i,
						"| Name:",
						data.response.groups[0].items[i].venue.name,
						"| Pic URL:",
						data.response.groups[0].items[i].venue.categories[0].icon.prefix,
						data.response.groups[0].items[i].venue.categories[0].icon.suffix,
						"| Category:",
						data.response.groups[0].items[i].venue.categories[0].name,
						"| Address:",
						data.response.groups[0].items[i].venue.location.formattedAddress,
					);

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

			// Code for handling errors
			error: function (jqXHR, textStatus, errorThrown) {
				alert("Result: " + jqXHR + " " + textStatus + " " + errorThrown);
			},
		});
	}

	/* Arriving Location */
	console.log("Arriving City:", formData[2].value);

	function searchPoi2(formData) {
		console.log("-- || Start POI Return Function || --");

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
				"QAEJY0NAQYS0IHBYU1NXNCWNBTMMIESQ0URVCHIVYXO2YBEC" +
				"&client_secret=" +
				"SCZW0ZYVTPRLYFA1QXLRISAXCBXUNFURYEMUVGHORJ5NZUQN" +
				"&v=20180323&limit=10&near=" +
				formData[2].value,
			data: {},
			beforeSend: function (jqXHR, settings) {
				console.log("ajax URL:", settings.url);
			},
			success: function (data) {
				console.log("-- || POI Return Data || --");
				console.log("Data:", data);

				// empty any existing content
				$(".d-attractions-api").empty();

				console.log("-- || POI Return Loop || --");
				for (var i = 0; i < 5; i++) {
					console.log(
						"R Loop #",
						i,
						"| Name:",
						data.response.groups[0].items[i].venue.name,
						"| Pic URL:",
						data.response.groups[0].items[i].venue.categories[0].icon.prefix,
						data.response.groups[0].items[i].venue.categories[0].icon.suffix,
						"| Category:",
						data.response.groups[0].items[i].venue.categories[0].name,
						"| Address:",
						data.response.groups[0].items[i].venue.location.formattedAddress,
					);

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
			error: function (jqXHR, textStatus, errorThrown) {
				// Code for handling errors
				alert("Result: " + jqXHR + " " + textStatus + " " + errorThrown);
			},
		});
	}

	// Call Functions
	searchPoi1(formData);
	searchPoi2(formData);

	/* -- || Skyscanner Flight Search || -- */
	/* © Tanner Cook */

	console.log("-- || Skyscanner Flight Search || --");

	var submitBtn = document.getElementById("submit-btn");
	searchFlight();

	function searchFlight() {
		console.log("-- Start Flight Search--");
		var flight = $(this).attr("Go Galivanting");
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
			var flightData = [];
			$.ajax({
				url: flightApiCodeDep,
				dateType: "json",
				method: "GET",
				success: function (codeDData) {
					console.log(codeDData);
					apiCodeDepart = codeDData.locations[0].code;
					console.log("departing code:", apiCodeDepart);

					$.ajax({
						url: flightApiCodeArr,
						dateType: "json",
						method: "GET",
						success: function (codeAData) {
							apiCodeArrival = codeAData.locations[0].code;
							console.log("arrival code:", apiCodeArrival);

							var arriveRearrange = arrivalDate.split("-");
							arrivalDate = "";
							arrivalDate = arrivalDate.concat(arriveRearrange[2] + "/");
							arrivalDate = arrivalDate.concat(arriveRearrange[1] + "/");
							arrivalDate = arrivalDate.concat(arriveRearrange[0]);
							console.log(arrivalDate);

							var departRearrange = departDate.split("-");
							departDate = "";
							departDate = departDate.concat(departRearrange[2] + "/");
							departDate = departDate.concat(departRearrange[1] + "/");
							departDate = departDate.concat(departRearrange[0]);
							console.log(departDate);

							var flightApiArrivingAir =
								"https://api.skypicker.com/flights?fly_from=airport:" +
								apiCodeArrival +
								"&fly_to=airport:" +
								apiCodeDepart +
								"&date_from=" +
								arrivalDate +
								"&date_to=" +
								arrivalDate +
								"&partner=picky&v=3";

							var flightApiDepartingAir =
								"https://api.skypicker.com/flights?fly_from=airport:" +
								apiCodeDepart +
								"&fly_to=airport:" +
								apiCodeArrival +
								"&date_from=" +
								departDate +
								"&date_to=" +
								departDate +
								"&partner=picky&v=3";

							$.ajax({
								url: flightApiDepartingAir,
								dataType: "json",
								method: "GET",
								success: function (data) {
									console.log(flightApiDepartingAir);
									console.log("-- || Start AviationStack Departure || --");
									console.log("This is your Departure City " + departLoc + "!");
									console.log(
										"This is your Departure Date " + departDate + "!",
									);
									console.log(data);
									var utcSeconds = data.data[0].route[0].dTimeUTC;
									var departTime = new Date(0);
									departTime.setUTCSeconds(utcSeconds);
									var arrivalTime = new Date(0);
									arrivalTime.setUTCSeconds(data.data[0].route[0].aTimeUTC);
									$(".d-flight-api").append(
										`<h2>${data.data[0].cityFrom}</h2>`,
									);
									$(".d-flight-api").append(`<p>${apiCodeDepart}</>`);
									$(".d-flight-api").append(`<p>${departTime}</p>`);
									$(".d-flight-api").append(`<p>${apiCodeArrival}</p>`);
									$(".d-flight-api").append(`<p>${arrivalTime}</p>`);

									$.ajax({
										url: flightApiArrivingAir,
										dateType: "json",
										method: "GET",
										success: function (data) {
											var utcSeconds = data.data[0].route[0].dTimeUTC;
											var departTime = new Date(0);
											departTime.setUTCSeconds(utcSeconds);
											var arrivalTime = new Date(0);
											arrivalTime.setUTCSeconds(data.data[0].route[0].aTimeUTC);
											$(".r-flight-api").append(
												`<h2>${data.data[0].cityFrom}</h2>`,
											);
											$(".r-flight-api").append(`<p>${apiCodeDepart}</>`);
											$(".r-flight-api").append(`<p>${departTime}</p>`);
											$(".r-flight-api").append(`<p>${apiCodeArrival}</p>`);
											$(".r-flight-api").append(`<p>${arrivalTime}</p>`);
										},
									});
								},
								error: function (xhr, ajaxOptions, thrownError) {
									alert(xhr.status);
									alert(ajaxOptions);
									alert(thrownError);
								},
							});
						},
					});
				},
			});
		}
	}

	searchFlight();

	/* -- ||  Open Weather Map || -- */
	/* © Garrett Dobson */

	console.log("-- || Open Weather Map API || --");

	// need to run the current weather for today & set the current date as well as the future dates ******
	// need to setup divs in html to reflect where the JS will populate the info - done
	// need to style results page w / weather data
	// technically need 4 current weather functions
	// need to figure out how to modify date info so it can be displayed

	// Global weather variables
	var imperialUnits = "&units=imperial";
	var apiWeatherKey = "&appid=f18b83f11c206025350af3f0978bacde";
	var searchValueDestination = formData[2].value;
	var searchValueDepart = formData[0].value;

	// forecast
	function genForecastHTML(name, temp, humidity, speed) {
		var forecastWeather = `<div class="card-forecast bg-light" style="width: 20%;">
					<div class="card-body">
						<h5 class="card-title">${name}</h5>
						<p class="card-text">Temperature: ${temp}°F</p>
						<p class="card-text">Humidity: ${humidity}%</p>
						<p class="card-text">Wind Speed: ${speed}MPH</p>
					</div>
				</div>`;

		return forecastWeather;
	}

	function getForecast(searchValueDestination) {
		var forecastURL = "https://api.openweathermap.org/data/2.5/forecast?q=";
		$.ajax({
			type: "GET",
			url: forecastURL + searchValueDestination + imperialUnits + apiWeatherKey,
			dataType: "json",
			success: function (data) {
				// overwrite any existing content with title and empty row
				console.log("forecast works");
				console.log(
					forecastURL + searchValueDestination + imperialUnits + apiWeatherKey,
				);
				console.log(data);
				console.log(data.list);

				// loop over all forecasts (by 3-hour increments)
				for (var i = 0; i < data.list.length; i++) {
					// only look at forecasts around 3:00pm
					if (data.list[i].dt_txt.indexOf("15:00:00") !== -1) {
						// create html elements for a bootstrap card
						console.log(data);

						var fiveDayForecast = genForecastHTML(
							data.city.name,
							data.list[0].main.temp,
							data.list[0].main.humidity,
							data.list[0].wind.speed,
						);

						$("#forecast").append(fiveDayForecast);
					}
				}
			},
		});
	}

	getForecast(searchValueDestination);
	//departing day weather
	searchWeather(searchValueDepart);

	function searchWeather(searchValueDepart) {
		var queryWeatherURL = "https://api.openweathermap.org/data/2.5/weather?q=";

		$.ajax({
			url: queryWeatherURL + searchValueDepart + imperialUnits + apiWeatherKey,
			type: "GET",
			dataType: "json",
			success: function (data) {
				console.log(
					queryWeatherURL + searchValueDepart + imperialUnits + apiWeatherKey,
				);
				console.log("current weather works");
				console.log(data);

				var currentWeather = `<div class="card bg-light" style="width: 100%;">
        <div class="card-body">
          <h5 class="card-title">${data.name}</h5>
          <p class="card-text">Temperature: ${data.main.temp}°F</p>
          <p class="card-text">Humidity: ${data.main.humidity}%</p>
          <p class="card-text">Wind Speed: ${data.wind.speed}MPH</p>
        </div>
      </div>`;

				$("#today").html(currentWeather);
			},
		});
	}
});
