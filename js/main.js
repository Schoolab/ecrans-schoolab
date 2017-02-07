$(document).ready(function() { // Attend que la page ait chargé pour lancer le JS

	$.fn.containerSlides = function(time) {
		that = this;
		var slides = that.find('.container'),
			current = 0,
			nbOfSlides = slides.length;

		function activate(index) {
			slides.removeClass('active').eq(index).addClass('active');
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
		var interval = setInterval(next, time);

		return this;
	}

	$('body').containerSlides(20000);

	// Nom des jours en français
	var frenchDays = [
		'Lun',
		'Mar',
		'Mer',
		'Jeu',
		'Ven',
		'Sam',
		'Dim'
	];

	// Nom des mois en français
	var frenchMonths = [
		'Jan',
		'Fév',
		'Mar',
		'Avr',
		'Mai',
		'Juin',
		'Juil',
		'Aoû',
		'Sep',
		'Oct',
		'Nov',
		'Déc'
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
		var minutes = (date.getMinutes() == 0) ? '': ('0' + date.getMinutes()).slice(-2);
		var strTime = hours + 'H' + minutes;
		return strTime;
	}

	// Fonction pour mettre à jour la date et l'heure
	function updateTime() {

		// Récupère la date d'aujourd'hui et la met à jour
		var today = new Date();
		var $todayDiv = $('#today_date');
		// Jour de la semaine
		var day = frenchDays[today.getDay()-1].toUpperCase();
		$todayDiv.find('.day').html(day);
		// Jour du mois
		var date = ('0' + today.getDate()).slice(-2);
		$todayDiv.find('.date').html(date);
		// Mois
		var month = frenchMonths[today.getMonth()].toUpperCase();
		$todayDiv.find('.month').html(month);
		// Heure
		var time = today.getHours() + 'H' + today.getMinutes();
		$todayDiv.find('.time').html(formatHHMM(today));

		// Set Color to day color
		var dayColor = dayColors[today.getDay() - 1];
		$('.dayColor').css('color', dayColor);
		$('.dayBgColor').css('background-color', dayColor);
	}

	// Met à jour l'heure toutes les secondes
	updateTime();
	var updateTimeInterval = setInterval(updateTime, 1);

	// Fonction pour charger les événements du jour
	function updateScreen() {

		var url = 'http://admin.theschoolab.com/api/v1/events/today'; // définit l'url de l'api

		$.getJSON(url).done(function(data) { // fait une requète GET à l'API

			$('#events').empty();

			$.each(data, function(index, event) { // fait une boucle sur la liste des

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
					element.find('.'+key).html(event[key]);
				}

				if (event['host'] == '') {
					element.find('.eventhost').remove();
				}

				element.find('.image').remove();

				// insère dans le HTML de la page
				$('#events').append(element);
			});

		});

	}
	// Met à jour les events toutes les 10 minutes
	updateScreen();
	var updateScreenInterval = setInterval(updateScreen, 60000);

	// Scroll auto
  var scrolltopbottom =  setInterval(function(){
  	var scrollDistance = $(document).height() - $(window).height();
         // 4000 - it will take 4 secound in total from the top of the page to the bottom
	  $("html, body").animate({ scrollTop: scrollDistance }, 10000);
	  setTimeout(function() {
	     $('html, body').animate({scrollTop:0}, 10000);
	  },10000);

  }, 20000);

});

 //function fullscreen

