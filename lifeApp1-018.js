var conv = function (str) {
  if (!str) {
      str = 'empty';
  }  return str.replace(/[!\"#$%&'\(\)\*\+,\.\/:;<=>\?\@\[\\\]\^`\{\|\}~]/g, '')
            .replace(/ /g, "-")
            .toLowerCase()
            .trim();
};

var catArray = document.querySelectorAll('.w-dyn-item .categ');
catArray.forEach( function(elem) {
  var text = elem.innerText || elem.innerContent;
  var className = conv(text);
  if (!isNaN(parseInt(className.charAt(0), 10))) {
          className = ("_" + className);
        }
  elem.closest(".mix").classList.add(className);
});

// Set the filter up based on data stored from previous page in localStorage, and use to create call for the mixer function
var storage = window.localStorage,
		term = storage.getItem('app_term_selected'),
		coverage = storage.getItem('app_coverage_selected'),
		premium_formatted = storage.getItem('app_premium_selected'),
		prem_dollars = premium_formatted.slice(1, premium_formatted.length - 3),
		prem_cents = premium_formatted.slice(premium_formatted.length - 3, premium_formatted.length),
		carrier = storage.getItem('app_carrier_selected').toLowerCase(),
		filter_string = '.'+conv(carrier);

//	Populate email address if it was already provided during the quote
		if (storage.getItem('quote_email_address')) {
				$('#email_address').val(storage.getItem('quote_email_address'));
				$('#floating-email-address-label').addClass("float");
		}

//  Tag this form submission with the proper ID so we can tie everything together on the back-end across multiple form submissions
    storage.setItem('commit_point', "14-application");
    $('#commit_point').val("14-application");
    $('#quote_initiated_datetime').val(storage.getItem('quote_initiated_datetime'));
    $('#quote_initiated_from_ip_address').val(storage.getItem('quote_initiated_from_ip_address'));
    $('#quote_initiated_from_city').val(storage.getItem('quote_initiated_from_city'));

var mixer = mixitup('.container', {
    multifilter: {
        enable: true
    },
    load: {
        filter: filter_string
    }
});

var application_details = document.querySelector('.application-details');
$(application_details).find('.premium_cents').text(prem_cents);
$(application_details).find('.premium_dollars').text(prem_dollars);
$(application_details).find('.coverage').text(coverage);
$(application_details).find('.term').text(term+" years");

Webflow.push(function(){
	$("#application").submit(function(){
	})
});

	$(function() {
		;
		(function($, window, document, undefined) {
			'use strict';
			var form = '.application',
					className = 'submit_button_active',
					submit = 'input[type="submit"]';

			$(form).each(function() {
				var $form = $(this),
						$submit = $form.find( submit ),
						enabled = true,
						$first_name = $form.find('input[id="first_name"]'),
						$last_name = $form.find('input[id="last_name"]'),
						$home_address = $form.find('input[id="home_address"]'),
						$email_address = $form.find('input[id="email_address"]'),
						$phone_number = $form.find('input[id="phone_number"]');

				document.getElementById("submit_button").disabled = true;

				$home_address.attr('autocomplete', 'off');

				$phone_number.mask("(000) 000-0000");

				$phone_number.on('input.True', function() {
					if (this.value.length > 14) {
						this.value = this.value.slice(0, 14);}
				});

//<!-- Set autocomplete input -->
  var gpaInput = document.getElementById("home_address"),
			formattedAddress = "",
      house_number = "",
      street = "",
      address_line1 = "",
      address_line2 = "",
  		city = "",
  		state = "",
   		postalCode = "";

  var autocomplete = new google.maps.places.Autocomplete(gpaInput, {
    types: ["geocode"],
    componentRestrictions: { country: "US" },
    fields: ["address_components", "formatted_address"]
  });

// After initializing the Autocomplete, listen for the 'place_changed' event
autocomplete.addListener("place_changed", function() {
  var place = autocomplete.getPlace();

	formattedAddress = place.formatted_address;

	if (place && place.address_components) {
    // Loop through address components to find the postal code, state, and city
    for (var i = 0; i < place.address_components.length; i++) {
      if (place.address_components[i].types.includes("street_number")) {
        house_number = place.address_components[i].long_name;
      }
      if (place.address_components[i].types.includes("route")) {
        street = place.address_components[i].long_name;
      }
		  if (place.address_components[i].types.includes("subpremise")) {
		    address_line2 = place.address_components[i].long_name;
		  }
      if (place.address_components[i].types.includes("locality")) {
        city = place.address_components[i].long_name;
      }
      if (place.address_components[i].types.includes("administrative_area_level_1")) {
        state = place.address_components[i].short_name;
      }
      if (place.address_components[i].types.includes("postal_code")) {
        postalCode = place.address_components[i].long_name;
      }
    }

    // Set the city, state & zip from the Google Places API to the app_city, app_state, & app_zip fields
    if (house_number) {
//      document.getElementById("app_house_number").value = house_number;
			storage.setItem('app_house_number', house_number);
    }
    if (street) {
//      document.getElementById("app_street").value = street;
			storage.setItem('app_street', street); 
    }
    if ((house_number) && (street)) {
//      document.getElementById("app_address_line1").value = house_number+" "+street;
			address_line1 = house_number+" "+street;
			storage.setItem('app_address_line1', address_line1); 
    }
    if (address_line2) {
//      document.getElementById("app_address_line2").value = street;
			storage.setItem('app_address_line2', address_line2); 
    }
    if (city) {
      document.getElementById("app_city").value = city;
//			$('#app_city').val(city);
			storage.setItem('app_city', city);
    }
    if (state) {
      document.getElementById("app_state").value = state;
//			$('#app_state').val(state);
			storage.setItem('app_state', state);
    }
    if (postalCode) {
      document.getElementById("app_zip").value = postalCode;
//			$('#app_zip').val(postalCode);
			storage.setItem('app_zip', postalCode);
    }
  }
	submitButtonCheck();
});

				$('form').on('change', 'input, select, textarea', function() {
					if (enabled) {
						submitButtonCheck();
					}
				});

				$('form').on('keyup', 'input, select, textarea', function() {
					if (enabled) {
						submitButtonCheck();
					}
				});

				$('#home_address').on('input.True', function() {
					if (this.value.length == 0) {
						formattedAddress = "";
						house_number = "";
						street = "";
						address_line1 = "";
						address_line2 = "";
						city = "";
						state = "";
						postalCode = "";
					}
				});

				function submitButtonCheck() {
					var storage = window.localStorage,
							source_category = document.getElementById("source_category").value;

					console.log("formattedAddress = "+formattedAddress);

					if ($first_name.val() != ''
						&& $last_name.val() != ''
						// check that address is not empty and that it is a valid address formatted by the Google API, 
						// complete with a valid address line 1 (house number + street name), city, state & zip
						&& $home_address.val() != ''
						&& formattedAddress != ''
						&& address_line1 != ''
						&& city != ''
						&& state != ''
						&& postalCode != ''
						&& $email_address.val() != '' && /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test( $email_address.val() )
						&& $phone_number.val().length == 14
						&& source_category.length  >   0
					) {

							var i;
							for (i = 0; i < storage.length; i++)   {
									if (storage.key(i).substring(0, 4) != "app_") {
										if ($(document).find('#' + storage.key(i)).length > 0) {
			    	    		    $(document).find('#'+storage.key(i)).val(storage.getItem(storage.key(i)));
										} else {
												console.log('Element with ID ' + storage.key(i) + ' does not exist.');
										}
									}
							}

              document.getElementById("submit_button").disabled = false;
							$submit.toggleClass(className, true);
					} else {
							document.getElementById("submit_button").disabled = true;
							$submit.toggleClass(className, false);
          }

					storage.setItem('app_first_name', $first_name.val()); // Need for salutation on 'App Received' page
					storage.setItem('app_last_name', $last_name.val()); // Need for calendly pre-fill
					storage.setItem('app_phone_number', $phone_number.val()); // Need for calendly pre-fill
          storage.setItem('app_email_address', $email_address.val()); // Need for calendly pre-fill

				}
			});
		})(jQuery, window, document);
	})
