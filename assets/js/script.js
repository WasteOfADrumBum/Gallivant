/* -- ||  Contac.html Logo/Icon Image || -- */

// Change #gallivant-logo-contact from Logo -to-> Icon on window < 640px
function checkResolution() {
	if ($(window).innerWidth() < 640) {
		// window < 640px = Icon
		$("#gallivant-logo-contact").attr(
			"src",
			"assets/images/gallivant-icon.png",
		);
	} else {
		// window > 640px = Logo
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
});

/* -- ||  Skyscanner Flight Search || -- */

/* -- ||  Open Weather Map || -- */
