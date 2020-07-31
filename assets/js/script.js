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

	console.log("-- || Sygic API || --");

	/* Departing Location */
	console.log("Departing City:", formData[0].value);

	function searchWeather(formData) {
		console.log("-- || Start Sygic Darture Function || --");

		$.ajax({
			type: "GET",
			url:
				"https://api.sygictravelapi.com/1.0/en/places/list?query=" +
				formData[0].value +
				"API-KEY-HERE",
			dataType: "json",
			success: function (data) {
				console.log("-- || Sygic Data || --");
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
		console.log("-- || Start Sygic Arrival Function || --");

		$.ajax({
			type: "GET",
			url:
				"https://api.sygictravelapi.com/1.0/en/places/list?query=" +
				formData[2].value +
				"API-KEY-HERE",
			dataType: "json",
			success: function (data) {
				console.log("-- || Sygic Data || --");
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

	console.log("-- || Skyscanner Flight Search API || --");

	/* -- ||  Open Weather Map || -- */
	/* © Garrett Dobson */

	console.log("-- || Open Weather Map API || --");
});
