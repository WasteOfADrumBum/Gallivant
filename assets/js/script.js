/* -- ||  Contac.html Logo/Icon Image || -- */
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
});

/* -- || Form (#loc-date-form) || -- */
/* © Joshua M. Small */

/* Captures index.html formData to be used on results.html */
$(document).ready(function () {
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

	/* -- || Places API || -- */
	/* © Joshua M. Small */

	console.log("-- || TomTom API || --");

	/* Departing Location */
	console.log("Departing City:", formData[0].value);

	function searchWeather(formData) {
		console.log("-- || Start TomTom Darture Function || --");

		$.ajax({
			type: "GET",
			url:
				"https://api.tomtom.com/search/2/poiSearch/" +
				formData[0].value +
				".jason?key=2ldcEAG1gRhb4wp7nHMzcFTU5TGnBshZ&en-US",
			dataType: "json",
			success: function (data) {
				console.log("-- || TomTom Data || --");
				console.log(data);
			},
			error: function (xhr, status, error) {
				alert(
					"Result: " +
					status +
					" " +
					error +
					" " +
					xhr.status +
					" " +
					xhr.statusText,
				);
			},
		});
	}

	/* Arriving Location */
	console.log("Arriving City:", formData[2].value);

	function searchWeather(formData) {
		console.log("-- || Start TomTom Arrival Function || --");

		$.ajax({
			type: "GET",
			url:
				"https://api.tomtom.com/search/2/poiSearch/" +
				formData[2].value +
				".jason?key=2ldcEAG1gRhb4wp7nHMzcFTU5TGnBshZ&en-US",
			dataType: "json",
			success: function (data) {
				console.log("-- || TomTom Data || --");
				console.log(data);
			},
			error: function (xhr, status, error) {
				alert(
					"Result: " +
					status +
					" " +
					error +
					" " +
					xhr.status +
					" " +
					xhr.statusText,
				);
			},
		});
	}

	/* -- ||  Skyscanner Flight Search || -- */
	/* © Tanner Cook */

	var submitBtn = document.getElementById("submit-btn");

	function searchFlight (response) {
		console.log("-- Start Flight Search--")
		var queryFlightURL = "http://api.aviationstack.com/v1/flights?access_key=e6881625e7026da63114e2559be73272"
		var flight = $(this).attr("Go Galivanting")
		var formData = JSON.parse(localStorage.getItem("formData"))
		var departLoc = formData[0].value;
		var departDate = formData[1].value;
		var arrivalLoc = formData[2].value;
		var arrivalDate = formData[3].value;
		var departingFlightData = $(".d-flight-api");
		var flightInfo =  flightpull.data[i].departure.airport


		$.ajax({
			url: queryFlightURL,
			dataType: 'json',
			method: "GET",
			data: {departDate, departLoc},
			success: function (flightpull) {
				console.log("-- || Start AviationStack Departure || --");
				console.log("This is your Departure City " + departLoc + "!")
				console.log("This is your Departure Date " + departDate + "!")
				console.log(flightpull)
				for(var i = 0; i<flightpull.data.length;i++) {
					if(departLoc === flightpull.data[i].arrival.airport)
					$(".d-flight-api").append(`<div class='card'> Your closest Airport: "${flightpull.data[i].departure.airport}</div>`)

				}

				// $.each(data, function(i, departingFlightData) {
				// 	departingFlightData.append("<div>Flight Data: " + departingFlightData.name + "</div>");
				// });

				
			},
			error: function () {
				alert('error loading');
			},
		});
	};
	searchFlight();

	

	console.log("-- || Skyscanner Flight Search API || --");

	/* -- ||  Open Weather Map || -- */
	/* © Garrett Dobson */

	console.log("-- || Open Weather Map API || --");
});
