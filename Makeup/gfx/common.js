$(function() {
	$('.elka').mouseenter(function() {
		$(this).addClass('elka-frozen');
	}).mouseleave(function() {
		$(this).removeClass('elka-frozen');
	});
})