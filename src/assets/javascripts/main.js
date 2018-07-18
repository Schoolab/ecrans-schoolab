$(document).ready(function() { // Attend que la page ait chargé pour lancer le JS

	$.fn.containerSlides = function(defaultTime) {
		that = this;
		var slides = that.find('.content-slide'),
			current = 0,
			nbOfSlides = slides.length;

		function activate(index) {
			slides.removeClass('active').eq(index).addClass('active');
			var slideTime = slides.eq(index).data('time');
			if (slideTime) {
				setTimeout(next, slideTime);
			} else {
				setTimeout(next, defaultTime);
			}
		}

		function next() {
			if (current + 1 === nbOfSlides) {
				current = 0;
			} else {
				current++;
			}
			activate(current);
		}

		activate(current);

		return this;
	};

	$('body').containerSlides(30000);

	// Nom des jours en français
	var frenchDays = [
		'lundi',
		'mardi',
		'mercredi',
		'jeudi',
		'vendredi',
		'samedi',
		'dimanche'
	];

	// Nom des mois en français
	var frenchMonths = [
		'janvier',
		'février',
		'mars',
		'avril',
		'mai',
		'juin',
		'juil',
		'août',
		'septembre',
		'octobre',
		'novembre',
		'décembre'
	];

	// Day colors
	var dayColors = [
		'#377AF4',
		'#F44E63',
		'#4FE88D',
		'#FFA543',
		'#FDCC47',
		'#377AF4',
		'#377AF4'
	];

	// Fonction pour formatter l'heure en 18H ou 09H30, etc.
	function formatHHMM(date) {
		var hours = date.getHours();
		var minutes = (date.getMinutes() === 0) ? '': ('0' + date.getMinutes()).slice(-2);
		var strTime = hours + 'h' + minutes;
		return strTime;
	}

	// Fonction pour mettre à jour la date et l'heure
	function updateTime() {

		// Récupère la date d'aujourd'hui et la met à jour
		var today = new Date();
		var $todayDiv = $('.navbar-date');
		// Jour de la semaine
		var day = frenchDays[today.getDay()-1];
		$todayDiv.find('.day').html(day);
		// Jour du mois
		var date = ('0' + today.getDate()).slice(-2);
		$todayDiv.find('.date').html(date);
		// Mois
		var month = frenchMonths[today.getMonth()];
		$todayDiv.find('.month').html(month);
		// Heure
		var time = today.getHours() + 'H' + today.getMinutes();
		$todayDiv.find('.time').html(formatHHMM(today));

		// Set Color to day color
		var dayColor = dayColors[today.getDay() - 1];
		$('.dayColor').css('color', dayColor);
		$('.dayBgColor').css('background-color', dayColor);
		$('.dayBgGradient').css(
			'background', 'linear-gradient(to bottom, ' + dayColor + ' 0%, transparent 100%)'
		);
	}

	// Met à jour l'heure toutes les secondes
	updateTime();
	var updateTimeInterval = setInterval(updateTime, 1);

	// Fonction pour charger les événements du jour
	function updateScreen() {

		// var url_events = 'https://inside.theschoolab.com/api/v1/events/today'; // définit l'url de l'api
		// var url_last_residents = 'https://inside.theschoolab.com/api/v1/residents/last';
    var url_events = 'http://localhost:5000/api/v1/events/today'; // définit l'url de l'api
    var url_last_residents = 'http://localhost:5000/api/v1/residents/last';

		// EVENTS
		$.getJSON(url_events).done(function(data) { // fait une requète GET à l'API

			$('#events').empty();

			$('#events-title').html(data.title);

			$.each(data.events, function(index, event) { // fait une boucle sur la liste des

				// Clone le HTML exemple
				var element = $('#hidden-event').clone();

				// Retire l'id
				element.attr('id', '');

				// Ajoute chaque info de l'événement dans le HTML
				for (var key in event) {
					if (key == 'start_time' || key == 'end_time') {
						var time = new Date(event[key]);
						event[key] = formatHHMM(time);
					}
					if (key == 'api_blob_url') {
						element.find('.image').html('<img class="card-top--image" src="' + event[key] + '" alt="Event Image" />');
					} else {
						element.find('.'+key).html(event[key]);
					}
				}

				if (event.host === '') {
					element.find('.eventhost').remove();
				}

				if (event.api_blob_url === '') {
					element.find('.image').remove();
				}

				// insère dans le HTML de la page
				$('#events').append(element);
			});

		});

		// RESIDENTS
		$.getJSON(url_last_residents).done(function(data) { // fait une requète GET à l'API

			$('#residents').empty();

			$.each(data, function(index, resident) { // fait une boucle sur la liste des

				// Clone le HTML exemple
				var element = $('#hidden-resident').clone();

				// Retire l'id
				element.attr('id', '');

				// Ajoute chaque info de l'événement dans le HTML
				for (var key in resident) {
					if (key == 'photo' && resident[key] != null) {
						element.find('.'+key).html('<img class="photo-resident" src="' + resident[key] + '" alt="User Photo" />');
					} else if (key == 'company' && resident[key] != null) {
						element.find('.'+key).html(resident[key].name).closest('.hidden').removeClass('hidden');
					} else {
						element.find('.'+key).html(resident[key]);
					}
				}

				if (resident.photo == '/images/original/missing.png') {
					element.find('.photo-resident').remove();
				}

				// insère dans le HTML de la page
				$('#residents').append(element);
			});

		});

	}
	// Met à jour les events toutes les 10 minutes
	updateScreen();
	var updateScreenInterval = setInterval(updateScreen, 60000);

	// Scroll auto
  var scrolltopbottom =  setInterval(function(){
  	var scrollDistance = $("#events").height();
         // 4000 - it will take 4 secound in total from the top of the page to the bottom
	  $(".scroller").animate({ scrollTop: scrollDistance }, 20000);
	  setTimeout(function() {
	     $(".scroller").animate({scrollTop:0}, 10000);
	  },10000);

  }, 20000);

});

//function fullscreen
addEventListener("click", function() {
  var el = document.documentElement,
    rfs = el.requestFullscreen
      || el.webkitRequestFullScreen
      || el.mozRequestFullScreen
      || el.msRequestFullscreen
  ;

  rfs.call(el);
});
