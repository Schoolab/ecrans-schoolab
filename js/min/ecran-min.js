$(document).ready(function(){var e="http://admin.theschoolab.com/api/v1/events/today";$.getJSON(e).done(function(e){$.each(e,function(e,t){var n='<div class="event">';n+="<h3>"+t.title+"</h3>",n+="<p>",n+=t.location+"<br>",n+=t.description+"<br>",n+=t.full_price+"<br>";var a=new Date(t.start_time);n+=a.toLocaleTimeString()+"<br>";var i=new Date(t.end_time);n+=i.toLocaleTimeString()+"<br>",n+="</p>",n+="</div>",$("#events-container").append($(n))})})});