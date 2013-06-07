// JavaScript Document

//var post_page ='server/index.php';
var post_page ='http://wingman.scottramsay.ca/index.php';

var total_nearby = 0;
var total_available = 0;
var total_matches = 0;

//   Since jQuery Mobile relies on jQuery core's $.ajax() functionality,
//  $.support.cors & $.mobile.allowCrossDomainPages must be set to true to tell
// 	$.ajax to load cross-domain pages.

$(document).bind("mobileinit", function() {
	$.support.cors = true;
	$.mobile.allowCrossDomainPages = true;
});

var Geo={};
	
function getGeoLocation() {	
	
	if (navigator.geolocation) {
	   navigator.geolocation.getCurrentPosition(success, error);
	}
	
	//Get the latitude and the longitude;
	function success(position) {
		Geo.lat = position.coords.latitude;
		Geo.lng = position.coords.longitude;
		
		$('.lat-value').val(Geo.lat);
		$('.lng-value').val(Geo.lng);
	}
	
	function error(){
		console.log("Geocoder failed");
	}
	
	return Geo;
	
}
function sendRequest(e) {
	
	$.ajax({
		type: "POST",
		url: post_page,
		data: $(e).serialize(),			
		dataType: 'json',
		beforeSend: function() {
					
					if($(e).hasClass('confirm')) {
						var check = confirm('Are you sure?');
						
						if(!check)
							return false;
							
					}
					
				},	
		success: function(response) {
			
			$.each(response, function(func, params) { window[func](e,params); });
			
		},
		error: function (xhr, status, error) {
               // alert(error.toString());
		}
	});
}

function quietLoad(e,params) {
	$('#canvas').html(params);	
}

function loadPage(e,params) {
	
	$.mobile.showPageLoadingMsg();
	
	$.each(params,function(href, callbacks) {
		
			$.each(callbacks,function(func, data) {
				switch(func) {
					case 'updateTotals':
						total_nearby = data['nearby'];
						total_available = data['available'];
						total_matches = data['matches'];
						
						$('#total_nearby .scouting-data').text(total_nearby);
						$('#total_available .scouting-data').text(total_available);
						$('#total_matches .scouting-data').text(total_matches);
						
						break;
				}
			});
		
		$.mobile.changePage( href, { transition: "slideup"} );	
		
	});	
	
	getGeoLocation();		
			
	$.mobile.hidePageLoadingMsg();
}

function changeHTML(e,params) {

	$.each(params,function(func, data) {
		switch(func) {
			case 'changeClass':
				$.each(data,function(container, className) {
					$(container).attr('class',className);
				});
				break;
			case 'prepend':
				$.each(data,function(container, html) {
					$(container).prepend(html);
				});
				break;
			case 'append':
				$.each(data,function(container, html) {
					$(container).append(html);
				});
				break;
			case 'before':
				$.each(data,function(container, html) {
					$(container).before(html);
				});
				break;
			case 'replace':
				$.each(data,function(container, html) {
					$(container).replaceWith(html);
				});
				break;
			case 'innerHTML':
				$.each(data,function(container, html) {
					$(container).html(html);
				});
				break;
			case 'remove':
				$.each(data,function(container, html) {
					$(container).remove();
				});
				break;
		}
	});
			
}

$(document).bind('pageinit', function(e) {
 //$(document).ready(function(e) {
	 
	 $('body').on('submit','form',function(e) {
		
		var $this = $(this);

		//prevent the form from submitting normally
		e.preventDefault();
	
		//show the default loading message while the $.post request is sent
		//$.mobile.showPageLoadingMsg();
	
		sendRequest($this);
		//alert(response);
		
		return false;
	});
	
	$( "#radius" ).on( 'slidestop', function( event ) { 
	
		var $form = $(this).parents('form');
		
		sendRequest($form);
	 });
	 
	$("input[type='radio']").bind( "change", function(event, ui) {
		
		var $form = $(this).parents('form');
		
		sendRequest($form);
	});	
	

});
				
