$(document).ready(function() { // Attend que la page ait chargé pour lancer le JS

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

	// Fonction pour formatter l'heure en 18H ou 09H30, etc.
	function formatHHMM(date) {
		var hours = date.getHours();
		var minutes = (date.getMinutes() == 0) ? '': ('0' + date.getMinutes()).slice(-2);
		var strTime = hours + 'H' + minutes;
		return strTime;
	}

	// Fonction pour charger les événements du jour et la date
	function updateScreen() {

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

		var url = 'http://admin.theschoolab.com/api/v1/events/today'; // définit l'url de l'api

		$.getJSON(url).done(function(data) { // fait une requète GET à l'API

			$('#isis').empty();

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

				element.find('.image').remove();

				// insère dans le HTML de la page
				$('#isis').append(element);
			});

		});

	}

	// Lance la fonction toutes les 10 minutes
	updateScreen();
	var updateInterval = setInterval(updateScreen, 60000);

});
