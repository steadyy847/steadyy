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
						error_color = "#AC0036",
	    			no_error_color = "#C5C5C5",
						$first_name = $form.find('input[id="first_name"]'),
						$last_name = $form.find('input[id="last_name"]'),
						$home_address = $form.find('input[id="home_address"]'),
						$email_address = $form.find('input[id="email_address"]'),
						$phone_number = $form.find('input[id="phone_number"]'),
						$source_category = $form.find('select[id="source_category"]');
//						$source_category = document.getElementById("source_category");


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

					if (formattedAddress != '' && address_line1 != '' && city != '' && state != '' && postalCode != '')	{
						// If all of the fields are full, then that means we have a valid, Google Maps API formatted address and should remove all error messages
						console.log("In the 1st part of the place_changed function. All address fields filled. Hide all error messages.");
						$("#error-address-not-valid").hide(500);
						$("#error-address-required").hide(500);
				    $home_address.css("border-color", no_error_color);
					} else if (formattedAddress != '' && (address_line1 != '' || city != '' || state != '' || postalCode != ''))	{
						// If there was a Google Maps API returned location, but it isn't a complete address (e.g. just city or neighborhood), show message that need users help getting a 'good' formatted address
						console.log("In the 2nd part of the place_changed function, where formatted_addess is filled, but at least one sub-field is empty, signifying that address is not valid. Show 'Address Not Valid' error message");
						$("#error-address-required").hide(500);
						$("#error-address-not-valid").show(500);
				    $home_address.css("border-color", error_color);
					}

					submitButtonCheck();

				  // Set focus back to the home_address field
				  $('#home_address').focus();
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

				$first_name.on('input.True', function() {
					if (this.value.length == 0) {
						// First Name was likely cleared out and deleted, so show the 'Field is required' error message
						$("#error-first-name-required").show(500);
	          $first_name.css("border-color", error_color);
					} else {
						// if there is at least one character input into this field, clear the error message
						$("#error-first-name-required").hide(500);
	          $first_name.css("border-color", no_error_color);
					}
				});

				$first_name.on('focusout', function() {
					if ($first_name.val().length == 0) {
						// if the first_name field is blank, throw up an error message that this field is required 
						$("#error-first-name-required").show(500);
	          $first_name.css("border-color", error_color);
					} else {
						// Under this condition we got a good first name, so get rid of all error messages
						$("#error-first-name-required").hide(500);
				    $first_name.css("border-color", no_error_color);
					}
				});

				$last_name.on('input.True', function() {
					if (this.value.length == 0) {
						// Last Name was likely cleared out and deleted, so show the 'Field is required' error message
						$("#error-last-name-required").show(500);
	          $last_name.css("border-color", error_color);
					} else {
						// if there is at least one character input into this field, clear the error message
						$("#error-last-name-required").hide(500);
	          $last_name.css("border-color", no_error_color);
					}
				});

				$last_name.on('focusout', function() {
					if ($last_name.val().length == 0) {
						// if the last_name field is blank, throw up an error message that this field is required 
						$("#error-last-name-required").show(500);
	          $last_name.css("border-color", error_color);
					} else {
						// Under this condition we got a last name, so get rid of all error messages
						$("#error-last-name-required").hide(500);
				    $last_name.css("border-color", no_error_color);
					}
				});

				$home_address.on('input.True', function() {
					if (this.value.length == 0) {
						formattedAddress = "";
						house_number = "";
						street = "";
						address_line1 = "";
						address_line2 = "";
						city = "";
						state = "";
						postalCode = "";

						// Address was likely cleared out and deleted, so show the 'Address required' error message
						$("#error-address-not-valid").hide(500);
						$("#error-address-required").show(500);
	          $home_address.css("border-color", error_color);
					}
				});

				$home_address.on('focusout', function() {
					if ($home_address.val().length == 0) {
						// if the home addresss field is blank, throw up an error message that this field is required 
						$("#error-address-not-valid").hide(500);
						$("#error-address-required").show(500);
	          $home_address.css("border-color", error_color);
					} else if ($home_address.val().length > 0 && formattedAddress != '' && address_line1 != '' && city != '' && state != '' && postalCode != '')	{
						// Under this condition we got a good address, so get rid of all error messages
						$("#error-address-not-valid").hide(500);
						$("#error-address-required").hide(500);
				    $home_address.css("border-color", no_error_color);
					} else if ($home_address.val().length > 0 && formattedAddress != '' && (address_line1 != '' || city != '' || state != '' || postalCode != ''))	{
						// If there was a Google Maps API returned location, but it isn't a complete address (e.g. just city or neighborhood), 
						// we will get a formattedAddress that is filled, but one of the address line1, city, state or zip that is not, and 
						// should show an error message that we need the user to help us by getting a 'good' formatted address by selecting a legit address
						$("#error-address-required").hide(500);
						$("#error-address-not-valid").show(500);
				    $home_address.css("border-color", error_color);
					}
				});

				$email_address.on('input.True', function() {
					if (this.value.length == 0) {
						// Email was likely cleared out and deleted, so show the 'Field is required' error message
						$("#error-email-required").show(500);
	          $email_address.css("border-color", error_color);
					} else {
						// if there is at least one character input into this field, clear the error message
						$("#error-email-required").hide(500);
	          $email_address.css("border-color", no_error_color);
					}
				});

				$email_address.on('focusout', function() {
					if ($email_address.val() != '' && /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test( $email_address.val() )) {
						// if the email field is blank or not complete, throw up an error message that this field is required 
						$("#error-email-required").show(500);
	          $email_address.css("border-color", error_color);
					} else {
						// Under this condition we got a good email address, so get rid of all error messages
						$("#error-email-required").hide(500);
				    $email_address.css("border-color", no_error_color);
					}
				});

				$phone_number.on('input.True', function() {
					if (this.value.length == 0) {
						// Phone was likely cleared out and deleted, so show the 'Field is required' error message
						$("#error-phone-required").show(500);
	          $phone_number.css("border-color", error_color);
					} else {
						// if there is at least one character input into this field, clear the error message
						$("#error-phone-required").hide(500);
	          $phone_number.css("border-color", no_error_color);
					}
				});

				$phone_number.on('focusout', function() {
					if ($phone_number.val().length < 14) {
						// if the phone number field is not full with a 10 digit number (plus the mask which provides parenthese 
						// around areas code and hyphen after exhange), throw up an error message that this field is required 
						$("#error-phone-required").show(500);
	          $phone_number.css("border-color", error_color);
					} else {
						// Under this condition we got a good phone number, so get rid of all error messages
						$("#error-phone-required").hide(500);
				    $phone_number.css("border-color", no_error_color);
					}
				});

//				$source_category.on('change', 'input, select, textarea', function() {
				$('#source_category').on('change', function() {
					console.log("In the $source_category.on('change') function");
					console.log("$source_category.val()) = "+$source_category.val());
					console.log("this.value = "+this.value);
					console.log("this.value.length = "+this.value.length);
					if (this.value == '') {
						// Source was likely reset, so show the 'Field is required' error message
						$("#error-source-required").show(500);
	          $source_category.css("border-color", error_color);
					} else {
						// if there is something selected in this field, clear the error message
						$("#error-source-required").hide(500);
	          $source_category.css("border-color", no_error_color);
					}
				});

				$source_category.on('focusout', function() {
					if ($source_category.val() == '') {
						// if the source field is empty, throw up an error message that this field is required 
						$("#error-source-required").show(500);
	          $source_category.css("border-color", error_color);
					} else {
						// Under this condition we got a selection, so get rid of all error messages
						$("#error-source-required").hide(500);
				    $source_category.css("border-color", no_error_color);
					}
				});

				$('form').on('focusin', 'input, select, textarea', function() {
					// if user puts focus on any field other than home address, check that
					// home address wasn't partially filled, but not checked via Google Maps API, by selecting a valid value from the drop-down
					var focusedElement = document.activeElement;
					if (focusedElement.id != "home_address") {
						if ($home_address.val().length > 0 && formattedAddress == '') {
							$("#error-address-required").hide(500);
							$("#error-address-not-valid").show(500);
					    $home_address.css("border-color", error_color);
						}
					}
				});

				function submitButtonCheck() {
					var storage = window.localStorage,
							source_category = document.getElementById("source_category").value;

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
						&& $source_category.val().length > 0
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
