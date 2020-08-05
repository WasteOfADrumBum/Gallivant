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

/* -- || Form Date Restriction || -- */
/* © Joshua M. Small */

$(document).ready(function () {
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
	//console.log("Today's Date: ", rightNow);
	// min Departure Date
	$(".form-date").attr("min", rightNow);
	//console.log("Min. Departure Date: ", rightNow);

	// Min Return Date
	$("#departing-date").on("change", function () {
		$("#returning-date").attr("min", $(this).val());
	});

	// Max Date (+1 year)
	var dateMax = yy + 1 + "-" + mm + "-" + dd;
	$(".form-date").attr("max", dateMax);
	//console.log("Max Date: ", dateMax);
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
	//console.log("formData Array:", formData);

	/* -- || POI API || -- */
	/* © Joshua M. Small */

	//console.log("-- || POI API || --");

	/* Departing Location */
	//console.log("Departing City:", formData[0].value);
	var poi1 = searchPoi1(formData);

	function searchPoi1(formData) {
		//console.log("-- || Start POI Arrival Function || --");

		$.ajax({
			dataType: "json",
			url:
				"https://api.foursquare.com/v2/venues/explore?client_id=" +
				"QAEJY0NAQYS0IHBYU1NXNCWNBTMMIESQ0URVCHIVYXO2YBEC" +
				"&client_secret=" +
				"H204CRKMTCFR355HCXOFMINYFHR01PQX0MDRADXO52XF44YW" +
				"&v=20180323&limit=10&near=" +
				formData[0].value,
			data: {},
			beforeSend: function (jqXHR, settings) {
				console.log("ajax URL:", settings.url);
			},
			success: function (data) {
				// console.log("-- || POI Arrival Data || --");
				// console.log("Data:", data);

				// empty any existing content
				$(".r-attractions-api").empty();

				var aTitle = $("<div>", {
					class: "poiTitle",
					id: "aPoiTitle",
				});
				aTitle.text(formData[0].value + "'s Attractions:");

				$(".r-attractions-api-title").append(aTitle);

				//console.log("-- || POI Arrival Loop || --");
				for (var i = 0; i < 5; i++) {
					//console.log("Loop #", i);

					// div container
					var aContainer = $("<div>", {
						class: "poiContainer",
						id: "aPoiContainer",
					});

					// POI Name
					// console.log("Name:", data.response.groups[0].items[i].venue.name);
					var aName = $("<div>", {
						class: "poiName",
						id: "aPoiName",
					});
					aName.text(data.response.groups[0].items[i].venue.name);

					// POI Address
					// console.log(
					// 	"Address:",
					// 	data.response.groups[0].items[i].venue.location.formattedAddress,
					// );
					var aAddress = $("<div>", {
						class: "poiAddress",
						id: "aPoiAddress",
					});
					aAddress.text(
						data.response.groups[0].items[i].venue.location.formattedAddress,
					);

					// POI Category
					// console.log(
					// 	"Category:",
					// 	data.response.groups[0].items[i].venue.categories[0].name,
					// );
					var aCategory = $("<div>", {
						class: "poiCategory",
						id: "aPoiCategory",
					});
					aCategory.text(
						data.response.groups[0].items[i].venue.categories[0].name,
					);

					// POI IMG
					// console.log(
					// 	"Pic URL:",
					// 	data.response.groups[0].items[i].venue.categories[0].icon.prefix,
					// 	data.response.groups[0].items[i].venue.categories[0].icon.suffix,
					// );
					var aImg = $("<div>", {
						class: "poiImg",
						id: "aPoiImg",
					});
					// Render Icon
					var aImgRender = $("<img>");
					aImgRender.attr(
						"src",
						data.response.groups[0].items[i].venue.categories[0].icon.prefix +
						"100" +
						data.response.groups[0].items[i].venue.categories[0].icon.suffix,
					);
					aImg.append(aImgRender);

					// Append Info
					aContainer.append(aName, aImgRender, aCategory, aAddress);

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
	//console.log("Arriving City:", formData[2].value);
	var poi2 = searchPoi2(formData);

	function searchPoi2(formData) {
		console.log("-- || Start POI Return Function || --");

		$.ajax({
			dataType: "json",
			url:
				"https://api.foursquare.com/v2/venues/explore?client_id=" +
				"QAEJY0NAQYS0IHBYU1NXNCWNBTMMIESQ0URVCHIVYXO2YBEC" +
				"&client_secret=" +
				"H204CRKMTCFR355HCXOFMINYFHR01PQX0MDRADXO52XF44YW" +
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

				var rTitle = $("<div>", {
					class: "poiTitle",
					id: "rPoiTitle",
				});
				rTitle.text(formData[2].value + "'s Attractions:");

				$(".d-attractions-api-title").append(rTitle);

				console.log("-- || POI Return Loop || --");
				for (var i = 0; i < 5; i++) {
					console.log("Loop #", i);

					// div container
					var rContainer = $("<div>", {
						class: "poiContainer",
						id: "rPoiContainer",
					});

					// POI Name
					console.log("Name:", data.response.groups[0].items[i].venue.name);
					var rName = $("<div>", {
						class: "poiName",
						id: "rPoiName",
					});
					rName.text(data.response.groups[0].items[i].venue.name);

					// POI Address
					console.log(
						"Address:",
						data.response.groups[0].items[i].venue.location.formattedAddress,
					);
					var rAddress = $("<div>", {
						class: "poiAddress",
						id: "rPoiAddress",
					});
					rAddress.text(
						data.response.groups[0].items[i].venue.location.formattedAddress,
					);

					// POI Category
					console.log(
						"Category:",
						data.response.groups[0].items[i].venue.categories[0].name,
					);
					var rCategory = $("<div>", {
						class: "poiCategory",
						id: "rPoiCategory",
					});
					rCategory.text(
						data.response.groups[0].items[i].venue.categories[0].name,
					);

					// POI IMG
					console.log(
						"Pic URL:",
						data.response.groups[0].items[i].venue.categories[0].icon.prefix,
						data.response.groups[0].items[i].venue.categories[0].icon.suffix,
					);
					var rImg = $("<div>", {
						class: "poiImg",
						id: "rPoiImg",
					});
					// Render Icon
					var rImgRender = $("<img>");
					rImgRender.attr(
						"src",
						data.response.groups[0].items[i].venue.categories[0].icon.prefix +
						"100" +
						data.response.groups[0].items[i].venue.categories[0].icon.suffix,
					);
					rImg.append(rImgRender);

					// Append Info
					rContainer.append(rName, rImgRender, rCategory, rAddress);

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

	/* -- ||  Skyscanner Flight Search || -- */
	/* © Tanner Cook */

	var submitBtn = document.getElementById("submit-btn");
	searchFlight();

	function searchFlight() {
		console.log("-- Start Flight Search--")
		var flight = $(this).attr("Go Galivanting")
		var formData = JSON.parse(localStorage.getItem("formData"))
		var departLoc = formData[0].value;
		var departDate = formData[1].value;
		var arrivalLoc = formData[2].value;
		var arrivalDate = formData[3].value;
		var flightApiCodeDep = "https://api.skypicker.com/locations?term=" + departLoc + "&locale=en-US&location_types=airport&limit=1&active_only=true&sort=name";
		var flightApiCodeArr = "https://api.skypicker.com/locations?term=" + arrivalLoc + "&locale=en-US&location_types=airport&limit=1&active_only=true&sort=name";
		var apiCodeDepart;
		var apiCodeArrival;

		getFlightInfo();

		function getFlightInfo() {
			var flightData = [];
			$.ajax({
				url: flightApiCodeDep,
				dateType: 'json',
				method: 'GET',
				success: function (codeDData) {
					console.log(codeDData)

					apiCodeDepart = codeDData.locations[0].code
					console.log("departing code:", apiCodeDepart)


					$.ajax({
						url: flightApiCodeArr,
						dateType: 'json',
						method: 'GET',
						success: function (codeAData) {
							apiCodeArrival = codeAData.locations[0].code;
							console.log("arrival code:", apiCodeArrival)

							var arriveRearrange = arrivalDate.split('-');
							arrivalDate = "";
							arrivalDate = arrivalDate.concat(arriveRearrange[2]+"/");
							arrivalDate = arrivalDate.concat(arriveRearrange[1]+"/");
							arrivalDate = arrivalDate.concat(arriveRearrange[0]);
							console.log(arrivalDate);

							var departRearrange = departDate.split('-');
							departDate = "";
							departDate = departDate.concat(departRearrange[2]+"/");
							departDate = departDate.concat(departRearrange[1]+"/");
							departDate = departDate.concat(departRearrange[0]);
							console.log(departDate)

							var flightApiArrivingAir = "https://api.skypicker.com/flights?fly_from=airport:" + apiCodeArrival + "&fly_to=airport:" + apiCodeDepart + "&date_from=" + arrivalDate + "&date_to=" + arrivalDate + "&partner=picky&v=3"

							var flightApiDepartingAir = "https://api.skypicker.com/flights?fly_from=airport:" + apiCodeDepart + "&fly_to=airport:" + apiCodeArrival + "&date_from=" + departDate + "&date_to=" + departDate + "&partner=picky&v=3"


							$.ajax({
								url: flightApiDepartingAir,
								dataType: "json",
								method: "GET",
								success: function (data) {
									console.log(flightApiDepartingAir)
									console.log("-- || Start AviationStack Departure || --");
									console.log("This is your Departure City " + departLoc + "!")
									console.log("This is your Departure Date " + departDate + "!")
									console.log(data)
									var utcSeconds = data.data[0].route[0].dTimeUTC
									var departTime = new Date(0);
									departTime.setUTCSeconds(utcSeconds)
									var arrivalTime = new Date(0);
									arrivalTime.setUTCSeconds(data.data[0].route[0].aTimeUTC)
									$('.d-flight-api').append(`<h2>${data.data[0].cityFrom}</h2>`);
									$('.d-flight-api').append(`<p>${apiCodeDepart}</>`);
									$('.d-flight-api').append(`<p>${departTime}</p>`);
									$('.d-flight-api').append(`<p>${apiCodeArrival}</p>`);
									$('.d-flight-api').append(`<p>${arrivalTime}</p>`);


									$.ajax({
										url: flightApiArrivingAir,
										dateType: 'json',
										method: 'GET',
										success: function (data) {
											var utcSeconds = data.data[0].route[0].dTimeUTC
											var departTime = new Date(0);
											departTime.setUTCSeconds(utcSeconds)
											var arrivalTime = new Date(0);
											arrivalTime.setUTCSeconds(data.data[0].route[0].aTimeUTC)
											$('.r-flight-api').append(`<h2>${data.data[0].cityFrom}</h2>`);
											$('.r-flight-api').append(`<p>${apiCodeDepart}</>`);
											$('.r-flight-api').append(`<p>${departTime}</p>`);
											$('.r-flight-api').append(`<p>${apiCodeArrival}</p>`);
											$('.r-flight-api').append(`<p>${arrivalTime}</p>`);
		
		

										}

									});

								},
								error: function (xhr, ajaxOptions, thrownError) {
									alert(xhr.status);
									alert(thrownError);
								},
							});

						}


					})

				}
			});
		};










		/* -- ||  Open Weather Map || -- */
		/* © Garrett Dobson */
	

		$("button").on("click", function () {

			var queryWeatherURL =
				"https://openweathermap.org/forecast5" +
				formData[0] +
				"&units=imperial&appid=f18b83f11c206025350af3f0978bacde";

			$.ajax({
				url: queryWeatherURL,
				method: "GET",
				dataType: "json",
			}).then(function (response) { });

			console.log("-- || Open Weather Map API || --");
		})


	}
})
