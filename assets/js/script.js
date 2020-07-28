// Change #gallivant-logo-contact from Logo -to-> Icon on window < 640px
$(document).ready(function () {
	if ($(window).width() > 640) {
		$("#gallivant-logo-contact").attr(
			"src",
			"assets/images/gallivant-logo.png",
		);
	} else {
		$("#gallivant-logo-contact").attr(
			"src",
			"assets/images/gallivant-icon.png",
		);
	}
});
