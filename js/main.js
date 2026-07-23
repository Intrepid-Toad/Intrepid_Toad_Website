$(document).ready(function () 
{

	// ---- Owl carousels (unchanged) ----
	$("#testimonial-slider").owlCarousel({
		paginationSpeed: 500,
		singleItem: true,
		autoPlay: 3000,
	});

	$("#clients-logo").owlCarousel({
		autoPlay: 3000,
		items: 5,
		itemsDesktop: [1199, 5],
		itemsDesktopSmall: [979, 5],
	});

	$("#works-logo").owlCarousel({
		autoPlay: 3000,
		items: 5,
		itemsDesktop: [1199, 5],
		itemsDesktopSmall: [979, 5],
	});

	// ---- Counter (unchanged) ----
	$('.counter').counterUp({
		delay: 10,
		time: 1000
	});
	
});

// ---- Filter feed (replaces MixItUp) ----
document.addEventListener('DOMContentLoaded', function () {
	var grid = document.getElementById('portfolio-contant-active');
	if (!grid) return; // page has no feed

	var section = grid.closest('#portfolio-work') || document;
	var filters = section.querySelectorAll('.filter');
	var items = grid.querySelectorAll('.mix');
	var groups = grid.querySelectorAll('.portfolio-group');

	function applyFilter(v) 
	{
		var all = (v === 'all');
		items.forEach(function (item) {
			var show = all || item.classList.contains(v.replace('.', ''));
			item.classList.toggle('show', show);
		});
		grid.classList.toggle('is-filtered', !all);          // hides headings via CSS
		groups.forEach(function (g) {
			g.classList.toggle('is-empty', !g.querySelector('.mix.show'));
		});
	}

	applyFilter('all'); // show everything on load

	filters.forEach(function (btn) {
		btn.addEventListener('click', function () {
			filters.forEach(function (f) { f.classList.remove('active'); });
			this.classList.add('active');

			grid.classList.add('is-filtering');           // fade out
			var v = this.dataset.filter;
			setTimeout(function () {
				applyFilter(v);                           // swap
				grid.classList.remove('is-filtering');    // fade in
			}, 150);
		});
	});
});