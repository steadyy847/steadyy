// Globally defined variables
var storage = window.localStorage,
    className = 'submit_button_active',
    $submit = $('input[type="submit"]'),
    error_color = '#AC0036',
		//no_error_color = '#C5C5C5',
    no_error_color = '', // simply resets default css behavior defined in webflow console, rather than hard coding it

		//  Fields entered (and submitted) on page 1 of the application
		$first_name = $('#app_first_name'),
		$last_name = $('#app_last_name'),
		$home_address = $('#app_home_address'),
		$email_address = $('#app_email_address'),
		$phone_number = $('#app_phone_number'),

		//  Fields for page 2 of the application
		// EMPLOYMENT DETAILS
    $employment_info = $('#employment_info'),
		$employer = $('#employer'),
		$occupation = $('#occupation'),
    $employer_address = $('#employer_address'),
    $employer_formatted_address = $('#employer_formatted_address'),
    $employer_street_number = $('#employer_street_number'),
    $employer_street = $('#employer_street'),
    $employer_address_line1 = $('#employer_address_line1'),
    $employer_address_line2 = $('#employer_address_line2'),
    $employer_city = $('#employer_city'),
    $employer_state = $('#employer_state'),
    $employer_zip = $('#employer_zip'),
    $years_employed = $('#years_employed'),
		$personal_income = $('#personal_income'),
    $income_variability = $('#income_variability'),

		// HOUSEHOLD INCOME DETAILS
		$household_income_details = $('household-income-details'),
		$household_income = $('#household_income'),
		$income_sources = $('#income_sources'),
		wages = "input[id='wages-income']:checked",
		investments = "input[id='investments-income']:checked",
		rentals = "input[id='rental-income']:checked",
		social_security = "input[id='social-security-income']:checked",
		retirement = "input[id='retirement-income']:checked",
		other = "input[id='other-income']:checked",
		$other_income_detail = $('#other_income_detail'),
		$income_tax_rate = $('#income_tax_rate'),

		// HOUSEHOLD EXPENSES DETAILS
		$household_expenses_details = $('household-expenses-details'),
		$living_expenses = $('#living_expenses'),
		$installment_debt = $('#installment_debt'),
    $emergency_fund = $('#emergency_fund'),
		$emergency_fund_explanation = $('#emergency_fund_explanation'),
    $income_sufficiency = $('#income_sufficiency'),
		$income_sufficient_explanation = $('#income_sufficient_explanation'),
			
		// HOUSEHOLD NET WORTH DETAILS
		//$net_worth = $('#net_worth'),
		$liquid_assets = $('#liquid_assets'),
		$non_liquid_assets = $('#non_liquid_assets'),
		$short_term_debts = $('#short_term_debts'),
		$long_term_debts = $('#long_term_debts'),

		// ANTICIPATED CHANGES
		$anticipated_changes = $('#anticipated-changes'),
		income_change = "input[id='income-change']:checked",
		living_expenses_change = "input[id='living-expenses-change']:checked",
		assets_change = "input[id='assets-change']:checked",
		medical_expenses_change = "input[id='medical-expenses-change']:checked",
		no_changes = "input[id='no-changes']:checked",
		$anticipated_changes_explanation = $('#anticipated_changes_explanation'),

		// BANKRUPTCY DETAILS
    $bankruptcy = $('#bankruptcy'),

		// Variables to track what has been filled in
		employment_info_satisfied,
		income_sources_errors,
		emergency_fund_errors,
		income_sufficiency_errors,
		anticipated_changes_errors;

let isFocusInside = false;

let addressSelectedWithMouse = false,
    formattedAddress = '',
    street_number = '',
    street = '',
    address_line1 = '',
    address_line2 = '',
    city = '',
    state = '',
    postalCode = '';

// Utility functions
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

// Function to parse the address (needs to come before initAutocomplete())
function parseAddress(addressString, callback) {
	console.log("In the parseAddress() function");

  const geocoder = new google.maps.Geocoder();
  geocoder.geocode({ address: addressString }, function(results, status) {
    if (status === 'OK' && results[0]) {
      const place = results[0];
      formattedAddress = place.formatted_address;
			$employer_formatted_address.val(formattedAddress);
      storage.setItem('employer_formatted_address', formattedAddress);
      
      const components = place.address_components;

      let street_number = '',
          street = '',
          address_line1 = '',
          address_line2 = '',
          city = '',
          state = '',
          postalCode = '';

      for (let component of components) {
        if (component.types.includes('street_number')) {
          street_number = component.long_name;
        }
        if (component.types.includes('route')) {
          street = component.long_name;
        }
        if (component.types.includes('subpremise')) {
          address_line2 = component.long_name;
        }
        if (component.types.includes('locality')) {
          city = component.long_name;
        }
        if (component.types.includes('administrative_area_level_1')) {
          state = component.short_name;
        }
        if (component.types.includes('postal_code')) {
          postalCode = component.long_name;
        }
      }

      if (street_number) {
        $('#employer_street_number').val(street_number);
        storage.setItem('employer_street_number', street_number);
      }
      if (street) {
        $('#employer_street').val(street);
        storage.setItem('employer_street', street);
      }
      if (street_number && street) {
        address_line1 = street_number + ' ' + street;
        $('#employer_address_line1').val(address_line1);
        storage.setItem('employer_address_line1', address_line1);
      }
      if (address_line2) {
        $('#employer_address_line2').val(address_line2);
        storage.setItem('employer_address_line2', address_line2);
      }
      if (city) {
        $('#employer_city').val(city);
        storage.setItem('employer_city', city);
      }
      if (state) {
        $('#employer_state').val(state);
        storage.setItem('employer_state', state);
      }
      if (postalCode) {
        $('#employer_zip').val(postalCode);
        storage.setItem('employer_zip', postalCode);
      }
      if (typeof callback === "function") {
        callback();
      }            
    } else {
      console.error('Geocode failed: ' + status);
    }
  });
}

// Init functions
let autocomplete;
function initAutocomplete() {
  console.log('Google Maps API initialized');
  const gpaInput = document.getElementById('employer_address');
  if (!gpaInput) {
    console.error("Element with ID 'employer_address' not found");
    return;
  }
  
  autocomplete = new google.maps.places.Autocomplete(gpaInput, {
    types: ['address'], // restricts to real street addresses (not places of interest, or intersections)
    fields: ['address_components', 'formatted_address', 'geometry'],
    componentRestrictions: { country: ['us'] }
  });

  autocomplete.addListener('place_changed', onPlaceChanged);

  document.addEventListener('mousedown', function(event) {
    if (event.target.classList.contains('pac-item') || event.target.closest('.pac-item')) {
      addressSelectedWithMouse = true;
    }
  });

	if (Array.isArray(window.addressParsingQueue)) {
	  const queue = window.addressParsingQueue;
	  window.addressParsingQueue = []; // clear before running
	  while (queue.length > 0) {
	    const fn = queue.shift();
	    if (typeof fn === 'function') fn();
	  }
	}
}
// Expose initAutocomplete globally for Google API callback
window.initAutocomplete = initAutocomplete;

// Call the function to get information about the user's device and format the result, 
// and save it into a hidden field that will be included on submit of the form
const deviceInfo = getUserDeviceInfo();
const formattedInfo = `
  Device Type: ${deviceInfo.deviceType} |<>|
  OS: ${deviceInfo.operatingSystem} |<>|
  Browser: ${deviceInfo.browserName} |<>|
  Viewport Width: ${deviceInfo.viewportWidth}px
`.trim();

// Set the value in the form field
$('#user_device').val(formattedInfo);

function getUserDeviceInfo() {
  const userAgent = navigator.userAgent;
  let browserName, deviceType, operatingSystem;

  // Determine browser
  if (userAgent.includes('Chrome') && !userAgent.includes('Edge') && !userAgent.includes('OPR')) {
    browserName = 'Google Chrome';
  } else if (userAgent.includes('Safari') && !userAgent.includes('Chrome')) {
    browserName = 'Safari';
  } else if (userAgent.includes('Firefox')) {
    browserName = 'Mozilla Firefox';
  } else if (userAgent.includes('Edge')) {
    browserName = 'Microsoft Edge';
  } else if (userAgent.includes('OPR') || userAgent.includes('Opera')) {
    browserName = 'Opera';
  } else if (userAgent.includes('Trident') || userAgent.includes('MSIE')) {
    browserName = 'Internet Explorer';
  } else {
    browserName = 'Unknown';
  }

  // Determine device type
  if (/Mobile|Android|iPhone|iPad|iPod/.test(userAgent)) {
    deviceType = 'Mobile';
  } else if (/Tablet|iPad/.test(userAgent)) {
    deviceType = 'Tablet';
  } else {
    deviceType = 'Desktop';
  }

  // Determine operating system
  if (/iPhone|iPad|iPod/.test(userAgent)) {
    operatingSystem = 'iOS';
  } else if (/Android/.test(userAgent)) {
    operatingSystem = 'Android';
  } else if (/Windows NT/.test(userAgent)) {
    operatingSystem = 'Windows';
  } else if (/Macintosh|Mac OS X/.test(userAgent)) {
    operatingSystem = 'Mac OS';
  } else if (/Linux/.test(userAgent)) {
    operatingSystem = 'Linux';
  } else {
    operatingSystem = 'Unknown';
  }

  // Get viewport width
  const viewportWidth = window.innerWidth;

  console.log(`Device Type: ${deviceType}`);
  console.log(`OS: ${operatingSystem}`);
  console.log(`Browser: ${browserName}`);
  console.log(`Viewport Width: ${viewportWidth}px`);

  return { deviceType, operatingSystem, browserName, viewportWidth };
}

function showError($el) {
  $el.stop(true, true).css({ visibility: 'visible' }).animate({ opacity: 1 }, 300);
}

function hideError($el) {
  $el.stop(true, true).animate({ opacity: 0 }, 300, function () {
    $el.css({ visibility: 'hidden' });
  });
}

function parseBoolean(value) {
  return value === 'true';
}

function parseNumber(value) {
  return Number(value.replace(/[^0-9.-]+/g, '')) || 0;
}

function safeDecode(value) {
  if (!value) return '';
  return decodeURIComponent(value.replace(/%$/, '')); // Remove trailing %
}

function submitButtonCheck() {
	checkEmploymentInfo();

	var bankruptcy_selected = $("input[name='Bankruptcy']:checked").val();

	// Extract the value, strip %, parse to number
	const installment_debt = parseInt($installment_debt.val().replace('%', ''), 10);
	console.log(
		"employment_info_satisfied = "+employment_info_satisfied+"\n"+
		"$household_income = "+parseInt($household_income.val().trim().replace(/,/g, ''), 10)  +"\n"+
		"income_sources_errors = "+income_sources_errors+"\n"+
    "$income_tax_rate.val().length = "+$income_tax_rate.val().length+"\n"+
		"$living_expenses.val().length = "+$living_expenses.val().length+"\n"+
	  "installment_debt = "+installment_debt+"\n"+
		"emergency_fund_errors = "+emergency_fund_errors+"\n"+
		"income_sufficiency_errors = "+income_sufficiency_errors+"\n"+
		"$liquid_assets.val().length = "+$liquid_assets.val().length+"\n"+
		"$non_liquid_assets.val().length = "+$non_liquid_assets.val().length +"\n"+
		"$short_term_debts.val().length = "+$short_term_debts.val().length +"\n"+
		"$long_term_debts.val().length = "+$long_term_debts.val().length +"\n"+
		"anticipated_changes_errors = "+anticipated_changes_errors +"\n"+
		"bankruptcy_selected = "+bankruptcy_selected
	);

	if (employment_info_satisfied &&
			parseInt($household_income.val().trim().replace(/,/g, ''), 10) >= 20000 &&
			!income_sources_errors &&
	    $income_tax_rate.val().length > 0 &&
			$living_expenses.val().length > 0 &&
		  !isNaN(installment_debt) && installment_debt >= 0 && installment_debt <= 100 &&
			!emergency_fund_errors &&
			!income_sufficiency_errors &&
			$liquid_assets.val().length > 0 &&
			$non_liquid_assets.val().length > 0 &&
			$short_term_debts.val().length > 0 &&
			$long_term_debts.val().length > 0 &&
			!anticipated_changes_errors &&
			bankruptcy_selected != null)
	{
      document.getElementById("submit_button").disabled = false;
			$submit.toggleClass(className, true);
	} else {
			console.log("----- Something didn't pass validation -----");
			document.getElementById("submit_button").disabled = true;
			$submit.toggleClass(className, false);
  }
}

function checkEmploymentInfo() {
	var employment_status_selected = $("input[name='EmploymentStatus']:checked").val(),
			income_variability_selected = $("input[name='IncomeVariability']:checked").val();

	console.log("----- Checking all Employment Info -----");
	console.log(
		"employment_status_selected = "+employment_status_selected+"\n"+
		"$employer.val().length = "+$employer.val().length+"\n"+
		"$occupation.val().length = "+$occupation.val().length+"\n"+
    "$employer_address.val() = "+$employer_address.val()+"\n"+
    "formattedAddress = "+formattedAddress+"\n"+
    "$employer_address_line1.val() = "+$employer_address_line1.val()+"\n"+
    "$employer_city.val() = "+$employer_city.val()+"\n"+
    "$employer_state.val() = "+$employer_state.val()+"\n"+
    "$employer_zip.val() = "+$employer_zip.val()+"\n"+
    "$years_employed.val().length = "+$years_employed.val().length+"\n"+
		"$personal_income.val() = "+parseInt($personal_income.val().trim().replace(/,/g, ''), 10)+"\n"+
		"income_variability_selected = "+income_variability_selected
	);

	if (employment_status_selected === "Employed") {
		if ($employer.val().length > 0 &&
				$occupation.val().length > 0 &&
		    // check that address is not empty and that it is a valid address formatted by the Google API,
		    // complete with a valid address line 1 (street number + street name), city, state & zip & 
		    // that it is in a valid state where we are licensed to sell life insurance
		    $employer_address.val() != '' &&
		    formattedAddress != '' &&
		    $employer_address_line1.val() != '' &&
		    $employer_city.val() != '' &&
		    $employer_state.val() != '' &&
		    $employer_zip.val() != '' &&
		    $years_employed.val().length > 0 &&
				//($personal_income.val().length > 5 && $personal_income.val().length < 11) &&
				parseInt($personal_income.val().trim().replace(/,/g, ''), 10) >= 20000 &&
				income_variability_selected != null
		) {
				employment_info_satisfied = true;
				hideError($('#error-employment-info-required'));
				//hideError($('#error-employment-info-all-fields-required'));
		    $employment_info.css("border-color", no_error_color);
			} else {
				employment_info_satisfied = false;
				hideError($('#error-employment-info-required'));
		    $employment_info.css("border-color", no_error_color);
				//showError($('#error-employment-info-all-fields-required'));
		    //$employment_info.css("border-color", error_color);
		}
	} else if (employment_status_selected === "Unemployed") {
		employment_info_satisfied = true;
				hideError($('#error-employment-info-required'));
				//hideError($('#error-employment-info-all-fields-required'));
		    $employment_info.css("border-color", no_error_color);
	} else {
		employment_info_satisfied = false;
		showError($('#error-employment-info-required'));
		//hideError($('#error-employment-info-all-fields-required'));
    $employment_info.css("border-color", error_color);
	}
}

function onPlaceChanged() {
  const place = autocomplete.getPlace();

  // Handle address parsing logic
  formattedAddress = place.formatted_address;
	$employer_formatted_address.val(formattedAddress);
  storage.setItem('employer_formatted_address', formattedAddress);

  if (place && place.address_components) {
    // Loop through address components to find the postal code, state, and city
    for (var y = 0; y < place.address_components.length; y++) {
      if (place.address_components[y].types.includes('street_number')) {
        street_number = place.address_components[y].long_name;
      }
      if (place.address_components[y].types.includes('route')) {
        street = place.address_components[y].long_name;
      }
      if (place.address_components[y].types.includes('subpremise')) {
        address_line2 = place.address_components[y].long_name;
      }
      if (place.address_components[y].types.includes('locality')) {
        city = place.address_components[y].long_name;
      }
      if (
        place.address_components[y].types.includes(
          'administrative_area_level_1'
        )
      ) {
        state = place.address_components[y].short_name;
      }
      if (place.address_components[y].types.includes('postal_code')) {
        postalCode = place.address_components[y].long_name;
      }
    }

    // Set the city, state & zip from the Google Places API to the employer_city, employer_state, & employer_zip fields
    if (street_number) {
      $('#employer_street_number').val(street_number);
      storage.setItem('employer_street_number', street_number);
    }
    if (street) {
      $('#employer_street').val(street);
      storage.setItem('employer_street', street);
    }
    if (street_number && street) {
      address_line1 = street_number + ' ' + street;
      $('#employer_address_line1').val(address_line1);
      storage.setItem('employer_address_line1', address_line1);
    }
    if (address_line2) {
      $('#employer_address_line2').val(address_line2);
      storage.setItem('employer_address_line2', address_line2);
    }
    if (city) {
      $('#employer_city').val(city);
      storage.setItem('employer_city', city);
    }
    if (state) {
      $('#employer_state').val(state);
      storage.setItem('employer_state', state);
    }
    if (postalCode) {
      $('#employer_zip').val(postalCode);
      storage.setItem('employer_zip', postalCode);
    }
  }

  if (
    formattedAddress != '' &&
    address_line1 != '' &&
    city != '' &&
    state != '' &&
    postalCode != ''
  ) {

    // If all of the fields are full, then that means we have a valid, Google Maps API formatted address and should remove all error messages
		hideError($('#error-address-not-valid'));
		hideError($('#error-employer-required'));
    $employer_address.css('border-color', no_error_color);
  } else if (
    // Looks like we got a an address back from the Google Places API, but it wasn't fully valid as one of the parts was missing (e.g. like an intersection only)
    formattedAddress != '' &&
    (address_line1 != '' ||
      city != '' ||
      state != '' ||
      postalCode != '')
  ) {
    // If there was a Google Maps API returned location, but it isn't a complete address (e.g. just city or neighborhood), show message that need users help getting a 'good' formatted address
		hideError($('#error-employer-required'));
		showError($('#error-address-not-valid'));
    $employer_address.css('border-color', error_color);
  }

  submitButtonCheck();

  // Set focus back to the home_address field when the user selects an address with their mouse.
  setTimeout(function() {
    const active = document.activeElement;
    if (addressSelectedWithMouse) {
      if (!active || active.id === 'employer_address' || active.tagName === 'BODY') {
        $('#employer_address').focus();
      }
      // Reset flag after acting
      addressSelectedWithMouse = false;
    }
  }, 100);
}

// Set the filter up based on data stored from previous page in localStorage, and use to create call for the mixer function
var term = storage.getItem('app_term_selected'),
		coverage = storage.getItem('app_coverage_selected'),
		premium_formatted = storage.getItem('app_premium_selected'),
		prem_dollars = premium_formatted.slice(1, premium_formatted.length - 3),
		prem_cents = premium_formatted.slice(premium_formatted.length - 3, premium_formatted.length),
		carrier = storage.getItem('app_carrier_selected').toLowerCase(),
		filter_string = '.'+conv(carrier);

var commitPointItem = storage.getItem('commit_point');
var numericPartOfCommitPoint = commitPointItem ? parseInt(commitPointItem.split('-')[0]) : null;

if (numericPartOfCommitPoint > 14) {
  $('#commit_point').val(commitPointItem);
} else {
  storage.setItem('commit_point', "14-application");
  $('#commit_point').val("14-application");
}
storage.setItem('navigation_from', "14-application");

$('#quote_initiated_datetime').val(storage.getItem('quote_initiated_datetime'));
$('#quote_initiated_from_ip_address').val(storage.getItem('quote_initiated_from_ip_address'));
$('#quote_initiated_from_city').val(storage.getItem('quote_initiated_from_city'));

//	Prefill the annual income stored in local storage from the needs/quote and reuse it here as confirmation, and as contrast to household income, which we also need to collect
if (storage.getItem('annual_income') !== null) {
		$('#personal_income').val(storage.getItem('annual_income'));
		$('#personal_income_label').addClass("float");
}

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


$(document).ready(function () {
	Webflow.push(function(){
		$("#application").submit(function(){
      // Check if the URL has any query parameters
      if (window.location.search) {
        // Retrieve the saved_app parameter if it was passed in the URL
        const urlParams = new URLSearchParams(window.location.search);
        const savedApp = urlParams.get('saved_app');
        const step = parseInt(urlParams.get('step'), 10); // Convert step to an integer

        // If the URL has the saved_app query params and the user has already completed 3 steps, then reset the submitButton href
				// to take user back to the saved applications page, instead of onto app page 3 as if they were in normal flow
        if (savedApp && !isNaN(step) && step > 2) {
       		location.href = '/saved-applications/'+savedApp;
        }
      };
		})
	});
});

// Ensure initAutocomplete() runs when the Google Maps API is ready
(function ensureAutocompleteInit() {
  if (typeof google !== 'undefined' && google.maps && google.maps.places) {
    console.log("Google Maps already loaded, calling initAutocomplete()");
    initAutocomplete();
  } else {
    console.log("Waiting for Google Maps API to load...");
    const interval = setInterval(function () {
      if (typeof google !== 'undefined' && google.maps && google.maps.places) {
        clearInterval(interval);
        console.log("Google Maps now available, calling initAutocomplete()");
        initAutocomplete();
      }
    }, 100);
  }
})();

$(function() {
	;
	(function($, window, document, undefined) {
		'use strict';
		var form = '.application';

		$(form).each(function() {
			var $form = $(this),
					submit = 'input[type="submit"]',
					enabled = true,

					// Grab the fields entered (and submitted) on page 1 of the application, for the scenario where the user navigates 
					// here in the normal screen flow of the application (e.g. not coming back here from the application summary page)
					first_name = storage.getItem('app_first_name'),
					last_name = storage.getItem('app_last_name'),
					address_line1 = storage.getItem('app_address_line1'),
					address_line2 = storage.getItem('app_address_line2'),
					city = storage.getItem('app_city'),
					state = storage.getItem('app_state'),
					postalCode = storage.getItem('app_zip'),
					email = storage.getItem('app_email_address'),
					phone_number =  storage.getItem('app_phone_number');

			$submit = $form.find(submit);
      document.getElementById('submit_button').disabled = true;

		  $employer_address.attr('autocomplete', 'off');

      if (address_line2 == null) {
      		address_line2 = "";
      }

			//  Repopulate the hidden fields entered (and submitted) on page 1 of the application to be able to tie this page back to it on the back end
			$first_name.val(first_name);
			$last_name.val(last_name);
      if (address_line2.length > 0) {
				$home_address.val(address_line1+" "+address_line2+", "+city+", "+state+"  "+postalCode);
      } else {
				$home_address.val(address_line1+", "+city+", "+state+"  "+postalCode);
			}
			$email_address.val(email);
			$phone_number.val(phone_number);

			// In the event that the user navigated to this page from the Application Summary page, check for URL parameters 
			// being passed in and pre-populate the fields on the form

      // Check if the URL has any query parameters
      if (window.location.search) {
        // Function to get query parameters from the URL
        function getQueryParameter(name) {
          const urlParams = new URLSearchParams(window.location.search);
          return urlParams.get(name);
        }

        // Retrieve the parameters
        const firstName = getQueryParameter('first_name');
        const lastName = getQueryParameter('last_name');
        const homeAddress = getQueryParameter('home_address');
        const phoneNumber = getQueryParameter('phone_number');
        const emailAddress = getQueryParameter('email_address');

        const employment_and_finances_detail = getQueryParameter('employment_and_finances_detail');

				function parseKeyValueString(input) {
				  const obj = {};
				  input.split(';').forEach(pair => {
				    const [key, ...valueParts] = pair.split('=');
				    const value = valueParts.join('=').trim();
				    obj[key.trim()] = value;
				  });
				  return obj;
				}

				const parsed = parseKeyValueString(employment_and_finances_detail);

				// Destructure into variables for easy use
				const {
					EmploymentStatus,
					employer,
					occupation,
					employer_address,
					personal_income,
					years_employed,
					IncomeVariability,
					household_income,
					other_income_detail,
					income_tax_rate,
					living_expenses,
					installment_debt,
					EmergencyFund,
					emergency_fund_explanation,
					IncomeSufficient,
					income_sufficient_explanation,
					liquid_assets,
					non_liquid_assets,
					short_term_debts,
					long_term_debts,
					liquid_net_worth,
					total_net_worth,
					anticipated_changes_explanation,
				  Bankruptcy
				} = parsed;

				// Populate the hidden fields for the CONTACT DETAILS from what was passed in from the URL params
        if (firstName) {
          $('#app_first_name')
            .val(decodeURIComponent(firstName))
            .trigger('input'); // Assign the value and trigger input event
        }
        if (lastName) {
          $('#app_last_name')
            .val(decodeURIComponent(lastName))
            .trigger('input'); // Assign the value and trigger input event
        }
        if (homeAddress) {
          $('#app_home_address')
            .val(decodeURIComponent(homeAddress))
            .trigger('input'); // Assign the value and trigger input event
        }
        if (phoneNumber) {
          $('#app_phone_number')
            .val(decodeURIComponent(phoneNumber))
            .trigger('input'); // Assign the value and trigger input event
        }
        if (emailAddress) {
          $('#app_email_address')
            .val(decodeURIComponent(emailAddress))
            .trigger('input'); // Assign the value and trigger input event
        }

				// Fill in the EMPLOYMENT DETAILS section from what was passed in from the URL params
        if (EmploymentStatus) {
					if (EmploymentStatus == 'Employed') {
					  $("input[name='EmploymentStatus'][value='Unemployed']").prop("checked", false);
						$("input[name='EmploymentStatus'][value='Unemployed']").prev('.w-radio-input').removeClass('w--redirected-checked');
					  $("input[name='EmploymentStatus'][value='Employed']").prop("checked", true);
						$("input[name='EmploymentStatus'][value='Employed']").prev('.w-radio-input').addClass('w--redirected-checked');

		        if (employer) {
		          $('#employer_label').addClass('float'); // Float the label
		          $('#employer')
		            .val(decodeURIComponent(employer))
		            .trigger('input'); // Assign the value and trigger input event
		        }
		        if (occupation) {
		          $('#occupation_label').addClass('float'); // Float the label
		          $('#occupation')
		            .val(decodeURIComponent(occupation))
		            .trigger('input'); // Assign the value and trigger input event
		        }

						window.addressParsingQueue = window.addressParsingQueue || [];

						if (employer_address) {
		          $('#employer_address_label').addClass('float'); // Float the label
		          $('#employer_address')
		            .val(decodeURIComponent(employer_address))
		            .trigger('input'); // Assign the value and trigger input event

							if (!window.addressParsingQueue) window.addressParsingQueue = [];

						  window.addressParsingQueue.push(function () {
						    parseAddress(decodeURIComponent(employer_address), function () {
						      console.log("Done parsing employer address");
						      submitButtonCheck();
						    });
						  });
							console.log("window.addressParsingQueue function assigned");
						}

		        if (years_employed) {
		          $('#years_employed_label').addClass('float'); // Float the label
		          $('#years_employed')
		            .val(decodeURIComponent(years_employed))
		            .trigger('input'); // Assign the value and trigger input event
		        }

		        if (personal_income) {
		          $('#personal_income_label').addClass('float'); // Float the label
		          $('#personal_income')
		            .val(parseNumber(decodeURIComponent(personal_income)))
		            .trigger('input'); // Assign the value and trigger input event
		        }

		        if (IncomeVariability) {
							if (IncomeVariability == 'Stable') {
							  $("input[name='IncomeVariability'][value='Fluctuates']").prop("checked", false);
								$("input[name='IncomeVariability'][value='Fluctuates']").prev('.w-radio-input').removeClass('w--redirected-checked');
							  $("input[name='IncomeVariability'][value='Stable']").prop("checked", true);
								$("input[name='IncomeVariability'][value='Stable']").prev('.w-radio-input').addClass('w--redirected-checked');
							}
							if (IncomeVariability == 'Fluctuates') {
							  $("input[name='IncomeVariability'][value='Stable']").prop("checked", false);
								$("input[name='IncomeVariability'][value='Stable']").prev('.w-radio-input').removeClass('w--redirected-checked');
							  $("input[name='IncomeVariability'][value='Fluctuates']").prop("checked", true);
								$("input[name='IncomeVariability'][value='Fluctuates']").prev('.w-radio-input').addClass('w--redirected-checked');
							}
		        }

						$(".employment-details").show(500);
					}
					if (EmploymentStatus == 'Unemployed') {
					  $("input[name='EmploymentStatus'][value='Employed']").prop("checked", false);
						$("input[name='EmploymentStatus'][value='Employed']").prev('.w-radio-input').removeClass('w--redirected-checked');
					  $("input[name='EmploymentStatus'][value='Unemployed']").prop("checked", true);
						$("input[name='EmploymentStatus'][value='Unemployed']").prev('.w-radio-input').addClass('w--redirected-checked');
					}
        }

				// Fill in the HOUSEHOLD INCOME section from what was passed in from the URL params
        if (household_income) {
          $('#household_income')
            .val(parseNumber(decodeURIComponent(household_income)))
            .trigger('input'); // Assign the value and trigger input event
        }

				if ('wages-income' in parsed) {
				  const isChecked = parseBoolean(parsed['wages-income']);
				  $('#wages-income').prop('checked', isChecked);
				  if (isChecked) {
				    $('#wages-income').prev('.w-checkbox-input').addClass('w--redirected-checked');
				  } else {
				    $('#wages-income').prev('.w-checkbox-input').removeClass('w--redirected-checked');
				  }
				}

				if ('investment-income' in parsed) {
				  const isChecked = parseBoolean(parsed['investment-income']);
				  $('#investment-income').prop('checked', isChecked);
				  if (isChecked) {
				    $('#investment-income').prev('.w-checkbox-input').addClass('w--redirected-checked');
				  } else {
				    $('#investment-income').prev('.w-checkbox-input').removeClass('w--redirected-checked');
				  }
				}

				if ('rental-income' in parsed) {
				  const isChecked = parseBoolean(parsed['rental-income']);
				  $('#rental-income').prop('checked', isChecked);
				  if (isChecked) {
				    $('#rental-income').prev('.w-checkbox-input').addClass('w--redirected-checked');
				  } else {
				    $('#rental-income').prev('.w-checkbox-input').removeClass('w--redirected-checked');
				  }
				}

				if ('social-security-income' in parsed) {
				  const isChecked = parseBoolean(parsed['social-security-income']);
				  $('#social-security-income').prop('checked', isChecked);
				  if (isChecked) {
				    $('#social-security-income').prev('.w-checkbox-input').addClass('w--redirected-checked');
				  } else {
				    $('#social-security-income').prev('.w-checkbox-input').removeClass('w--redirected-checked');
				  }
				}

				if ('retirement-income' in parsed) {
				  const isChecked = parseBoolean(parsed['retirement-income']);
				  $('#retirement-income').prop('checked', isChecked);
				  if (isChecked) {
				    $('#retirement-income').prev('.w-checkbox-input').addClass('w--redirected-checked');
				  } else {
				    $('#retirement-income').prev('.w-checkbox-input').removeClass('w--redirected-checked');
				  }
				}

				if ('other-income' in parsed) {
				  const isChecked = parseBoolean(parsed['other-income']);
				  $('#other-income').prop('checked', isChecked);
				  if (isChecked) {
				    $('#other-income').prev('.w-checkbox-input').addClass('w--redirected-checked');
				  } else {
				    $('#other-income').prev('.w-checkbox-input').removeClass('w--redirected-checked');
				  }
				}

				// After all Income Sources checkboxes have been set, call the validation function
				validateIncomeSources()

        if (other_income_detail) {
          $('#other_income_detail')
            .val(decodeURIComponent(other_income_detail))
            .trigger('input'); // Assign the value and trigger input event
		    	$('#accordian-income-source-other-details').show(500);
        }

        if (income_tax_rate) {
          $('#income_tax_rate')
            .val(decodeURIComponent(income_tax_rate))
            .trigger('input'); // Assign the value and trigger input event
        }

				// Fill in the HOUSEHOLD EXPENSES section from what was passed in from the URL params
        if (living_expenses) {
          $('#living_expenses')
            .val(parseNumber(decodeURIComponent(living_expenses)))
            .trigger('input'); // Assign the value and trigger input event
        }

        if (installment_debt) {
					$('#installment_debt')
					  .val(safeDecode(installment_debt))
            .trigger('input'); // Assign the value and trigger input event
        }

        if (EmergencyFund) {
					if (EmergencyFund == 'Yes') {
					  $("input[name='EmergencyFund'][value='No']").prop("checked", false);
						$("input[name='EmergencyFund'][value='No']").prev('.w-radio-input').removeClass('w--redirected-checked');
					  $("input[name='EmergencyFund'][value='Yes']").prop("checked", true);
						$("input[name='EmergencyFund'][value='Yes']").prev('.w-radio-input').addClass('w--redirected-checked');
					}
					if (EmergencyFund == 'No') {
					  $("input[name='EmergencyFund'][value='Yes']").prop("checked", false);
						$("input[name='EmergencyFund'][value='Yes']").prev('.w-radio-input').removeClass('w--redirected-checked');
					  $("input[name='EmergencyFund'][value='No']").prop("checked", true);
						$("input[name='EmergencyFund'][value='No']").prev('.w-radio-input').addClass('w--redirected-checked');

			      $('#emergency_fund_details').show(500);
					}
        }

        if (emergency_fund_explanation) {
          $('#emergency_fund_explanation')
            .val(decodeURIComponent(emergency_fund_explanation))
            .trigger('input'); // Assign the value and trigger input event
        }

				// After all Emergency Fund fields have been set, call the 'change' function
				$emergency_fund.trigger('change');

        if (IncomeSufficient) {
					if (IncomeSufficient == 'Yes') {
					  $("input[name='IncomeSufficient'][value='No']").prop("checked", false);
						$("input[name='IncomeSufficient'][value='No']").prev('.w-radio-input').removeClass('w--redirected-checked');
					  $("input[name='IncomeSufficient'][value='Yes']").prop("checked", true);
						$("input[name='IncomeSufficient'][value='Yes']").prev('.w-radio-input').addClass('w--redirected-checked');
					}
					if (IncomeSufficient == 'No') {
					  $("input[name='IncomeSufficient'][value='Yes']").prop("checked", false);
						$("input[name='IncomeSufficient'][value='Yes']").prev('.w-radio-input').removeClass('w--redirected-checked');
					  $("input[name='IncomeSufficient'][value='No']").prop("checked", true);
						$("input[name='IncomeSufficient'][value='No']").prev('.w-radio-input').addClass('w--redirected-checked');

			      $('#income_sufficient_details').show(500);
					}
        }

        if (income_sufficient_explanation) {
          $('#income_sufficient_explanation')
            .val(decodeURIComponent(income_sufficient_explanation))
            .trigger('input'); // Assign the value and trigger input event
        }

				// After all Income Sufficiency fields have been set, call the 'change' function
				$income_sufficiency.trigger('change');

				// Fill in the HOUSEHOLD NET WORTH section from what was passed in from the URL params
        if (liquid_assets) {
          $('#liquid_assets')
            .val(parseNumber(decodeURIComponent(liquid_assets)))
            .trigger('input'); // Assign the value and trigger input event
					validateLiquidAssets();
        }

        if (non_liquid_assets) {
          $('#non_liquid_assets')
            .val(parseNumber(decodeURIComponent(non_liquid_assets)))
            .trigger('input'); // Assign the value and trigger input event
					validateNonLiquidAssets()
        }

        if (short_term_debts) {
          $('#short_term_debts')
            .val(parseNumber(decodeURIComponent(short_term_debts)))
            .trigger('input'); // Assign the value and trigger input event
					validateShortTermDebts()
        }

        if (long_term_debts) {
          $('#long_term_debts')
            .val(parseNumber(decodeURIComponent(long_term_debts)))
            .trigger('input'); // Assign the value and trigger input event
					validateLongTermDebts()
        }

				// These are calculated fields, so I'm hoping by triggering the input evennts of the above four fields, they will calculate properly
				// liquid_net_worth
				// total_net_worth

				// Fill in the ANTICIPATED CHANGES section from what was passed in from the URL params
				if ('income-change' in parsed) {
				  const isChecked = parseBoolean(parsed['income-change']);
				  $('#income-change').prop('checked', isChecked);
				  if (isChecked) {
				    $('#income-change').prev('.w-checkbox-input').addClass('w--redirected-checked');
			      $('#anticipated_changes_details').show(500);
				  } else {
				    $('#income-change').prev('.w-checkbox-input').removeClass('w--redirected-checked');
				  }
				}

				if ('assets-change' in parsed) {
				  const isChecked = parseBoolean(parsed['assets-change']);
				  $('#assets-change').prop('checked', isChecked);
				  if (isChecked) {
				    $('#assets-change').prev('.w-checkbox-input').addClass('w--redirected-checked');
			      $('#anticipated_changes_details').show(500);
				  } else {
				    $('#assets-change').prev('.w-checkbox-input').removeClass('w--redirected-checked');
				  }
				}

				if ('living-expenses-change' in parsed) {
				  const isChecked = parseBoolean(parsed['living-expenses-change']);
				  $('#living-expenses-change').prop('checked', isChecked);
				  if (isChecked) {
				    $('#living-expenses-change').prev('.w-checkbox-input').addClass('w--redirected-checked');
			      $('#anticipated_changes_details').show(500);
				  } else {
				    $('#living-expenses-change').prev('.w-checkbox-input').removeClass('w--redirected-checked');
				  }
				}

				if ('medical-expenses-change' in parsed) {
				  const isChecked = parseBoolean(parsed['medical-expenses-change']);
				  $('#medical-expenses-change').prop('checked', isChecked);
				  if (isChecked) {
				    $('#medical-expenses-change').prev('.w-checkbox-input').addClass('w--redirected-checked');
			      $('#anticipated_changes_details').show(500);
				  } else {
				    $('#medical-expenses-change').prev('.w-checkbox-input').removeClass('w--redirected-checked');
				  }
				}

				if ('no-changes' in parsed) {
				  const isChecked = parseBoolean(parsed['no-changes']);
				  $('#no-changes').prop('checked', isChecked);
				  if (isChecked) {
				    $('#no-changes').prev('.w-checkbox-input').addClass('w--redirected-checked');
				  } else {
				    $('#no-changes').prev('.w-checkbox-input').removeClass('w--redirected-checked');
				  }
				}

        if (anticipated_changes_explanation) {
          $('#anticipated_changes_explanation')
            .val(decodeURIComponent(anticipated_changes_explanation))
            .trigger('input'); // Assign the value and trigger input event
        }

				// After all Anticipated Changes checkboxes have been set, validate everything the way it would if focus was moved away from field
				$anticipated_changes.trigger('focusout')

				// Fill in the BANKRUPTCY section from what was passed in from the URL params
        if (Bankruptcy) {
					if (Bankruptcy == 'Yes') {
					  $("input[name='Bankruptcy'][value='No']").prop("checked", false);
						$("input[name='Bankruptcy'][value='No']").prev('.w-radio-input').removeClass('w--redirected-checked');
					  $("input[name='Bankruptcy'][value='Yes']").prop("checked", true);
						$("input[name='Bankruptcy'][value='Yes']").prev('.w-radio-input').addClass('w--redirected-checked');
					}
					if (Bankruptcy == 'No') {
					  $("input[name='Bankruptcy'][value='Yes']").prop("checked", false);
						$("input[name='Bankruptcy'][value='Yes']").prev('.w-radio-input').removeClass('w--redirected-checked');
					  $("input[name='Bankruptcy'][value='No']").prop("checked", true);
						$("input[name='Bankruptcy'][value='No']").prev('.w-radio-input').addClass('w--redirected-checked');
					}
        }
        console.log("Done pre-filling fields from query parameters found in the URL");
				submitButtonCheck();
      } else {
        console.log('No query parameters found in the URL.');
      }

			document.getElementById("submit_button").disabled = true;

			$personal_income.mask("#,##0", {reverse: true});
			$household_income.mask("#,##0", {reverse: true});
			$living_expenses.mask("#,##0", {reverse: true});
      $installment_debt.mask('000%', { reverse: true });
			$liquid_assets.mask("#,##0", {reverse: true});
			$non_liquid_assets.mask("#,##0", {reverse: true});
			$short_term_debts.mask("#,##0", {reverse: true});
			$long_term_debts.mask("#,##0", {reverse: true});

			$('form').on('change', 'input[type="checkbox"], input[type="radio"], select', function () { // use 'change' for checkboxes, radio buttons, and drop-down select fields
				if (enabled) {
					submitButtonCheck();
				}
			});

			$('form').on('input', 'input[type="text"], textarea', function () { // use 'input' for text input field
				if (enabled) {
					submitButtonCheck();
				}
			});

			$("input[name='EmploymentStatus']").click(function(e) {
				var employment_status_selected = $("input[name='EmploymentStatus']:checked").val();
				if (employment_status_selected == "Employed") {
					$(".employment-details").show(500);
				} else if (employment_status_selected == "Unemployed") {
					$('#employer').val("");
					$('#employer_label').removeClass('float');
					$('#occupation').val("");
					$('#occupation_label').removeClass('float');
					$('#employer_address').val("");
					$('#employer_address_label').removeClass('float');
					$('#employer_formatted_address').val("");
			    $('#employer_street_number').val("");
			    $('#employer_street').val("");
			    $('#employer_address_line1').val("");
			    $('#employer_address_line2').val("");
			    $('#employer_city').val("");
			    $('#employer_state').val("");
			    $('#employer_zip').val("");
			    $('#years_employed').val("");
					$('#personal_income').val("");
					$('#personal_income_label').removeClass('float');
					$('#years_employed').val("");
					$('#years_employed_label').removeClass('float');
				  $("input[name='IncomeVariability'][value='Stable']").prop("checked", false);
					$("input[name='IncomeVariability'][value='Stable']").prev('.w-radio-input').removeClass('w--redirected-checked');
				  $("input[name='IncomeVariability'][value='Fluctuates']").prop("checked", false);
					$("input[name='IncomeVariability'][value='Fluctuates']").prev('.w-radio-input').removeClass('w--redirected-checked');

					$(".employment-details").hide(500);
					
					employment_info_satisfied = true;
					submitButtonCheck();
				}
			});

			$employment_info.on('change', function() {
				var employment_status_selected = $("input[name='EmploymentStatus']:checked").val();
				if (employment_status_selected != null) {
					// Employment Status radio button choice was made, so clear the error message
					if (employment_status_selected == "Employed") {
						if (employment_info_satisfied) {
							hideError($('#error-employment-info-required'));
							//hideError($('#error-employment-info-all-fields-required'));
					    $employment_info.css("border-color", no_error_color);
						}
					} else if (employment_status_selected == "Unemployed") {
							hideError($('#error-employment-info-required'));
							//hideError($('#error-employment-info-all-fields-required'));
					    $employment_info.css("border-color", no_error_color);
					}
			  } else {
					// Radio button choice was not selected, so show the 'Field is required' error message
					showError($('#error-employment-info-required'));
			    $employment_info.css("border-color", error_color);
			  }
				submitButtonCheck();
			});

			$employment_info.on('focusout', function() {
			  setTimeout(() => {
			    // Check if focus has truly left the entire radio group
			    if (!$(document.activeElement).closest('#emergency_fund').length) {
						var employment_status_selected = $("input[name='EmploymentStatus']:checked").val();
						if (employment_status_selected != null) {
							if (employment_status_selected == "Employed") {
								hideError($('#error-employment-info-required'));
						    $employment_info.css("border-color", no_error_color);
								/*
								if (!employment_info_satisfied) {
									hideError($('#error-employment-info-required'));
									showError($('#error-employment-info-all-fields-required'));
							    $employment_info.css("border-color", error_color);
								} else if (employment_info_satisfied) {
									hideError($('#error-employment-info-required'));
									hideError($('#error-employment-info-all-fields-required'));
							    $employment_info.css("border-color", no_error_color);
								}
								*/
							} else if (employment_status_selected == "Unemployed") {
									hideError($('#error-employment-info-required'));
									//hideError($('#error-employment-info-all-fields-required'));
							    $employment_info.css("border-color", no_error_color);
							}
						} else {
							showError($('#error-employment-info-required'));
							//hideError($('#error-employment-info-all-fields-required'));
					    $employment_info.css("border-color", error_color);
						}
					}
			  }, 10); // Delay lets `change` settle first
			});

			// Validate the Employer field either when the user enters new input, or moves focus away from it
			$employer.on('input focusout', function() {
			  const value = $employer.val().trim();
			  if (value.length === 0) {
					// if the employer field is blank, throw up an error message that this field is required 
					showError($('#error-employer-required'));
			    $employer.css("border-color", error_color);
			  } else {
					// if there is at least one character input into this field, clear the error message
					hideError($('#error-employer-required'));
			    $employer.css("border-color", no_error_color);
			  }
      });

			// Validate the Occupation field either when the user enters new input, or moves focus away from it
			$occupation.on('input focusout', function() {
			  const value = $occupation.val().trim();
			  if (value.length === 0) {
					// if the occupation field is blank, throw up an error message that this field is required 
					showError($('#error-occupation-required'));
			    $occupation.css("border-color", error_color);
			  } else {
					// if there is at least one character input into this field, clear the error message
					hideError($('#error-occupation-required'));
			    $occupation.css("border-color", no_error_color);
			  }
      });

			// Validate the Years Employed field either when the user selects a new value, or moves focus away from it
			$years_employed.on('change focusout', function() {
			  const isEmpty = $years_employed.val() === '';

			  if (isEmpty) {
          // Length of Time at Employer was likely reset, so show the 'Field is required' error message
					showError($('#error-years-employed-required'));
			    $years_employed.css('border-color', error_color);
			  } else {
          // if there is something selected in this field, clear the error message
					hideError($('#error-years-employed-required'));
			    $years_employed.css('border-color', no_error_color);
			  }
      });

      $employer_address.on('input.True', function () {
        if ($(this).val().length == 0) {
          formattedAddress = '';
          street_number = '';
          street = '';
          address_line1 = '';
          address_line2 = '';
          city = '';
          state = '';
          postalCode = '';

          // Address was likely cleared out and deleted, so show the 'Address required' error message
					hideError($('#error-address-not-valid'));
					showError($('#error-address-required'));
          $employer_address.css('border-color', error_color);
        }
        submitButtonCheck();
      });

			$employer_address.on('focusout', function () {
			  if ($employer_address.val().length == 0) {
			    // Blank field
					hideError($('#error-address-not-valid'));
					showError($('#error-address-required'));
			    $employer_address.css('border-color', error_color);
			  } else if (formattedAddress == '') {
			    // User typed but DID NOT select a suggestion → show "Select from suggestions" error
					showError($('#error-address-not-valid'));
					hideError($('#error-address-required'));
			    $employer_address.css('border-color', error_color);
			  } else if (formattedAddress != '' && address_line1 != '' && city != '' && state != '' && postalCode != '') {
			    // Valid address
					hideError($('#error-address-not-valid'));
					hideError($('#error-address-required'));
			    $employer_address.css('border-color', no_error_color);
			  } else if (formattedAddress != '' && (address_line1 != '' || city != '' || state != '' || postalCode != '')) {
			    // Incomplete Google address
					showError($('#error-address-not-valid'));
					hideError($('#error-address-required'));
			    $employer_address.css('border-color', error_color);
			  }
			  submitButtonCheck();
			});

			// Validate the Personal Income field either when the user enters new input, or moves focus away from it
			$personal_income.on('input', function () {
			  let raw = $(this).val().replace(/[^\d]/g, ''); // remove all non-numeric characters

			  // Strip leading zero(s) if there's more than one digit
			  if (raw.length > 1 && raw.startsWith('0')) {
			    raw = raw.replace(/^0+/, '');
				  // Apply the formatted mask (you may re-mask to force update)
				  $(this).unmask().val(raw).mask('#,##0', { reverse: true });
			  }

			  // Trigger validation
			  validatePersonalIncome();
			});

			$personal_income.on('focusout', function () {
			  validatePersonalIncome();
			});

			function validatePersonalIncome() {
			  const rawValue = $personal_income.val().trim();
			  const numericValue = parseInt(rawValue.replace(/,/g, ''), 10); // Remove commas and convert to number

			  if (rawValue.length === 0) {
			    showError($('#error-personal-income-required'));
			    hideError($('#error-personal-income-below-threshold'));
			    $personal_income.css("border-color", error_color);
			  } else if (numericValue < 20000) {
			    hideError($('#error-personal-income-required'));
			    showError($('#error-personal-income-below-threshold'));
			    $personal_income.css("border-color", error_color);
			  } else {
			    hideError($('#error-personal-income-required'));
			    hideError($('#error-personal-income-below-threshold'));
			    $personal_income.css("border-color", no_error_color);
			  }
			}

			// Validate the Income Variability field when the user makes a radio button selection, or moves focus away from it
			$income_variability.on('change focusout', function() {
			  const selected = $("input[name='IncomeVariability']:checked").val();
			  if (selected != null) {
					// Income Variability radio button choice was made, so clear the error message
					hideError($('#error-income-variability-required'));
			    $income_variability.css("border-color", no_error_color);
			  } else {
					// Income Variability radio button choice was not selected, so show the 'Field is required' error message
					showError($('#error-income-variability-required'));
			    $income_variability.css("border-color", error_color);
			  }
			});

			// Validate the Household Income field either when the user enters new input, or moves focus away from it
			$household_income.on('input', function () {
			  let raw = $(this).val().replace(/[^\d]/g, ''); // remove all non-numeric characters

			  // Strip leading zero(s) if there's more than one digit
			  if (raw.length > 1 && raw.startsWith('0')) {
			    raw = raw.replace(/^0+/, '');
				  // Apply the formatted mask (you may re-mask to force update)
				  $(this).unmask().val(raw).mask('#,##0', { reverse: true });
			  }

			  // Trigger validation
			  validateHouseholdIncome();
			});

			$household_income.on('focusout', function () {
			  validateHouseholdIncome();
			});

			function validateHouseholdIncome() {
			  const rawValue = $household_income.val().trim();
			  const numericValue = parseInt(rawValue.replace(/,/g, ''), 10); // Remove commas and convert to number
			  const personalIncome = parseInt($personal_income.val().trim().replace(/,/g, ''), 10);
			  if (rawValue.length === 0) {
					// Household Income was likely cleared out and deleted, so show the 'Field is required' error message
			    showError($('#error-household-income-required'));
			    hideError($('#error-household-income-below-threshold'));
			    hideError($('#error-household-income-below-personal-income'));
			    $household_income.css("border-color", error_color);
			  } else if (numericValue < 20000) {
			    hideError($('#error-household-income-required'));
			    showError($('#error-household-income-below-threshold'));
			    hideError($('#error-household-income-below-personal-income'));
			    $household_income.css("border-color", error_color);
				} else if (numericValue < personalIncome) {
			    hideError($('#error-household-income-required'));
			    hideError($('#error-household-income-below-threshold'));
			    showError($('#error-household-income-below-personal-income'));
			    $household_income.css("border-color", error_color);
			  } else {
					hideError($('#error-household-income-required'));
			    hideError($('#error-household-income-below-threshold'));
			    hideError($('#error-household-income-below-personal-income'));
			    $household_income.css("border-color", no_error_color);
			  }
				submitButtonCheck();
			}

			$income_sources.on('change', 'input[type="checkbox"]', function () { // use 'change' for checkboxes
			  validateIncomeSources();
			});

			$income_sources.on('input', 'input[type="text"], textarea', function () { // use 'input' for text input field
			  validateIncomeSources();
			});

			$income_sources.on('focusin', function () {
			  isFocusInside = true;
			});

			$income_sources.on('focusout', function () {
			  setTimeout(() => { // Delay so we can check if the new focused element is still inside
			    if (!$(document.activeElement).closest('#income_sources').length) {
			      validateIncomeSources();
			    }
			  }, 0);
			});

			function validateIncomeSources() {
			  const anyChecked = [
			    'wages-income',
			    'investments-income',
			    'rental-income',
			    'social-security-income',
			    'retirement-income',
			    'other-income'
			  ].some(id => document.getElementById(id).checked);

			  if (anyChecked) {
					hideError($('#error-income-sources-required'));
			    $income_sources.css('border-color', no_error_color);
			    income_sources_errors = false;

					const isOtherIncomeChecked = document.getElementById('other-income').checked;
					if (isOtherIncomeChecked) {
			    	$('#accordian-income-source-other-details').show(500);
						if ($('#other_income_detail').val() === '') {
							showError($('#error-other-income-detail-required'));
					    $other_income_detail.css('border-color', error_color);
					    income_sources_errors = true;
						} else {
							hideError($('#error-other-income-detail-required'));
					    $other_income_detail.css('border-color', no_error_color);
					    income_sources_errors = false;
						}
					} else {
			    	$('#accordian-income-source-other-details').hide(500);
						$('#other_income_detail').val('');
						hideError($('#error-other-income-detail-required'));
				    $other_income_detail.css('border-color', no_error_color);
					}
					
			  } else {
		    	$('#accordian-income-source-other-details').hide(500);
					$('#other_income_detail').val('');
					hideError($('#error-other-income-detail-required'));
			    $other_income_detail.css('border-color', no_error_color);

					showError($('#error-income-sources-required'));
			    $income_sources.css('border-color', error_color);
			    income_sources_errors = true;
			  }
				submitButtonCheck();
			}

			// Validate the Income Tax Rate field either when the user selects a new value, or moves focus away from it
			$income_tax_rate.on('change focusout', function() {
			  const isEmpty = $income_tax_rate.val() === '';

			  if (isEmpty) {
          // Length of Income Tax Rate was likely reset, so show the 'Field is required' error message
					showError($('#error-income-tax-rate-required'));
			    $income_tax_rate.css('border-color', error_color);
			  } else {
          // if there is something selected in this field, clear the error message
					hideError($('#error-income-tax-rate-required'));
			    $income_tax_rate.css('border-color', no_error_color);
			  }
      });

			// Validate the Living Expenses field either when the user enters new input, or moves focus away from it
			$living_expenses.on('input', function () {
			  let raw = $(this).val().replace(/[^\d]/g, ''); // remove all non-numeric characters

			  // Strip leading zero(s) if there's more than one digit
			  if (raw.length > 1 && raw.startsWith('0')) {
			    raw = raw.replace(/^0+/, '');
				  // Apply the formatted mask (you may re-mask to force update)
				  $(this).unmask().val(raw).mask('#,##0', { reverse: true });
			  }

			  // Trigger validation
			  validateLivingExpenses();
			});

			$living_expenses.on('focusout', function () {
			  validateLivingExpenses();
			});

			function validateLivingExpenses() {
			  const value = $living_expenses.val().trim();
			  if (value.length === 0) {
					// Living Expenses was likely cleared out and deleted, so show the 'Field is required' error message
					showError($('#error-living-expenses-required'));
			    $living_expenses.css("border-color", error_color);
			  } else {
					// if there is at least one character input into this field, clear the error message
					hideError($('#error-living-expenses-required'));
			    $living_expenses.css("border-color", no_error_color);
			  }
			}

			// Validate the 'Installment Debt as a % of Income' field either when the user enters new input, or moves focus away from it
      $installment_debt.on('input', handlePercentageInput);

      // ALSO trigger on backspace (and possibly delete)
      $installment_debt.on('keydown', function (e) {
        if (e.key === 'Backspace' || e.key === 'Delete') {
          requestAnimationFrame(() => {
            handlePercentageInput();
          });
        }
      });

      // Reapply the mask when the field gains focus (in case user cleared it)
      $installment_debt.on('focus', function () {
        if (!$installment_debt.val().includes('%')) {
          $installment_debt.mask('000%', { reverse: true });
        }
      });

      // Custom backspace behavior to allow clearing the field cleanly
      $installment_debt.on('keydown', function (e) {
        const key = e.key;
        const input = this;
        const pos = input.selectionStart;

        // Special handling for deleting the last digit before the % symbol
        if (key === 'Backspace') {
          const val = input.value;

          if (val.endsWith('%') && pos === val.length) {
            e.preventDefault(); // Prevent default deletion

            // Remove the last digit before the % symbol
            const digitsOnly = val.replace('%', '').slice(0, -1);
            input.value = digitsOnly + (digitsOnly ? '%' : '');

            // If no digits left, clear and remove the mask
            if (!digitsOnly) {
              $(input).unmask().val('');
            }
          }
        }
      });

	    $installment_debt.on('change', function () {
	      if (this.value.length === 0) {
	        // Installment Debt field was likely reset, so show the 'Field is required' error message
					showError($('#error-installment_debt-required'));
					hideError($('#error-installment_debt-valid-value'));
	        $installment_debt.css('border-color', error_color);
	      } else {
	        // if there is something entered in this field, clear the error message
					hideError($('#error-installment_debt-required'));
	        $installment_debt.css('border-color', no_error_color);
	      }
	      submitButtonCheck();
	    });

	    $installment_debt.on('focusout', function () {
	      if ($installment_debt.val().length === 0) {
	        // if the installment debt field is blank, throw up an error message that this field is required
					showError($('#error-installment_debt-required'));
	        $installment_debt.css('border-color', error_color);
	      } else {
	        // Under this condition the user has filled in installment debt %, so get rid of all error messages
					hideError($('#error-installment_debt-required'));
	        $installment_debt.css('border-color', no_error_color);
	      }
	    });

      function handlePercentageInput() {
        let raw = $installment_debt.val().replace(/\D/g, '');

        // Always trim to 3 digits
        if (raw.length > 3) {
          raw = raw.slice(0, 3);
        }

        const num = parseInt(raw, 10);
        const formatted = isNaN(num) ? '' : num + '%';
        if (raw === '') {
          $installment_debt.unmask().val('');
          $installment_debt.mask('000%', { reverse: true });
					showError($('#error-installment_debt-required'));
					hideError($('#error-installment_debt-valid-value'));
			    $installment_debt.css('border-color', error_color);
          return;
        }

        if (isNaN(num) || num < 0 || num > 100) {
					hideError($('#error-installment_debt-required'));
					showError($('#error-installment_debt-valid-value'));
			    $installment_debt.css('border-color', error_color);
        } else {
					hideError($('#error-installment_debt-required'));
					hideError($('#error-installment_debt-valid-value'));
			    $installment_debt.css('border-color', no_error_color);
        }

        // Final enforced value, even if mask glitches
        $installment_debt.val(formatted);
        submitButtonCheck();
      }

			// Validate the Emergency Fund field when the user makes a radio button selection
			$emergency_fund.on('change', function() {
			  const emergency_fund_selected = $("input[name='EmergencyFund']:checked").val();
			  if (emergency_fund_selected != null) {
					// Emergency Fund radio button choice was made, so clear the error message
					hideError($('#error-emergency-fund-required'));
			    $emergency_fund.css("border-color", no_error_color);

					if (emergency_fund_selected == "Yes") {
						$("#emergency_fund_details").hide(500);

					  setTimeout(function() {
							$('#emergency_fund_explanation').val("");
					  }, 300);
						emergency_fund_errors = false;
					} else if (emergency_fund_selected == "No") {
						$("#emergency_fund_details").show(500);
						if ($emergency_fund_explanation.val().trim().length === 0) {
							emergency_fund_errors = true;
						} else {
							emergency_fund_errors = false;
						}
					}
			  } else {
					// Emergency Fund radio button choice was not selected, so show the 'Field is required' error message
					showError($('#error-emergency-fund-required'));
			    $emergency_fund.css("border-color", error_color);
					emergency_fund_errors = true;
			  }
				submitButtonCheck();
			});

			// Validate the Emergency Fund field when the user moves focus away from it
			$emergency_fund.on('focusout', function() {
			  setTimeout(() => {
			    // Check if focus has truly left the entire radio group
			    if (!$(document.activeElement).closest('#emergency_fund').length) {
			      const emergency_fund_selected = $("input[name='EmergencyFund']:checked").val();

			      if (emergency_fund_selected != null) {
			        hideError($('#error-emergency-fund-required'));
			        $emergency_fund.css("border-color", no_error_color);

			        if (emergency_fund_selected === "No" && $emergency_fund_explanation.val().trim().length === 0) {
			          emergency_fund_errors = true;
			        } else {
			          emergency_fund_errors = false;
			        }
			      } else {
			        showError($('#error-emergency-fund-required'));
			        $emergency_fund.css("border-color", error_color);
			        emergency_fund_errors = true;
			      }
			    }
			  }, 10); // Delay lets `change` settle first
			});

			$emergency_fund_explanation.on('focusout', function () {
			  const value = $emergency_fund_explanation.val().trim();

			  if (value.length === 0) {
			    showError($('#error-emergency-fund-explanation-required'));
			    $emergency_fund_explanation.css("border-color", error_color);
			    emergency_fund_errors = true;
			  } else {
			    hideError($('#error-emergency-fund-explanation-required'));
			    $emergency_fund_explanation.css("border-color", no_error_color);
			    emergency_fund_errors = false;
			  }
			  submitButtonCheck();
			});

			$emergency_fund_explanation.on('input', function () {
			  const value = $emergency_fund_explanation.val().trim();

			  if (value.length > 0) {
			    hideError($('#error-emergency-fund-explanation-required'));
			    $emergency_fund_explanation.css("border-color", no_error_color);
			    emergency_fund_errors = false;
			  } else {
			    showError($('#error-emergency-fund-explanation-required'));
			    $emergency_fund_explanation.css("border-color", error_color);
			    emergency_fund_errors = true;
				}
			  submitButtonCheck();
			});

			// Validate the Income Sufficient field when the user makes a radio button selection
			$income_sufficiency.on('change', function() {
			  const income_sufficient_selected = $("input[name='IncomeSufficient']:checked").val();
			  if (income_sufficient_selected != null) {
					// Income Sufficient radio button choice was made, so clear the error message
					hideError($('#error-income-sufficient-required'));
			    $income_sufficiency.css("border-color", no_error_color);

					if (income_sufficient_selected == "Yes") {
						$("#income_sufficient_details").hide(500);

					  setTimeout(function() {
							$('#income_sufficient_explanation').val("");
					  }, 300);
						income_sources_errors = false;
					} else if (income_sufficient_selected == "No") {
						$("#income_sufficient_details").show(500);
						if ($income_sufficient_explanation.val().trim().length === 0) {
							income_sufficiency_errors = true;
						} else {
							income_sufficiency_errors = false;
						}
					}
			  } else {
					// Income Sufficient radio button choice was not selected, so show the 'Field is required' error message
					showError($('#error-income-sufficient-required'));
			    $income_sufficiency.css("border-color", error_color);
					income_sufficiency_errors = true;
			  }
				submitButtonCheck();
			});

			// Validate the Income Sufficiency field when the user moves focus away from it
			$income_sufficiency.on('focusout', function() {
			  setTimeout(() => {
			    // Check if focus has truly left the entire radio group
			    if (!$(document.activeElement).closest('#income_sufficiency').length) {
			      const income_sufficient_selected = $("input[name='IncomeSufficient']:checked").val();

			      if (income_sufficient_selected != null) {
			        hideError($('#error-income-sufficient-required'));
			        $income_sufficiency.css("border-color", no_error_color);

			        if (income_sufficient_selected === "No" && $income_sufficient_explanation.val().trim().length === 0) {
			          income_sufficiency_errors = true;
			        } else {
			          income_sufficiency_errors = false;
			        }
			      } else {
			        showError($('#error-income-sufficient-required'));
			        $income_sufficiency.css("border-color", error_color);
			        income_sufficiency_errors = true;
			      }
			    }
			  }, 10); // Delay lets `change` settle first
			});

			$income_sufficient_explanation.on('focusout', function () {
			  const value = $income_sufficient_explanation.val().trim();

			  if (value.length === 0) {
			    showError($('#error-income-sufficient-explanation-required'));
			    $income_sufficient_explanation.css("border-color", error_color);
			    income_sufficiency_errors = true;
			  } else {
			    hideError($('#error-income-sufficient-explanation-required'));
			    $emergency_fund_explanation.css("border-color", no_error_color);
			    income_sufficiency_errors = false;
			  }
			  submitButtonCheck();
			});

			$income_sufficient_explanation.on('input', function () {
			  const value = $income_sufficient_explanation.val().trim();

			  if (value.length > 0) {
			    hideError($('#error-income-sufficient-explanation-required'));
			    $income_sufficient_explanation.css("border-color", no_error_color);
			    income_sufficiency_errors = false;
			  } else {
			    showError($('#error-income-sufficient-explanation-required'));
			    $income_sufficient_explanation.css("border-color", error_color);
			    income_sufficiency_errors = true;
				}
			  submitButtonCheck();
			});

			// Validate the Liquid Assets field either when the user enters new input, or moves focus away from it
			$liquid_assets.on('input', function () {
			  let raw = $(this).val().replace(/[^\d]/g, ''); // remove all non-numeric characters

			  // Strip leading zero(s) if there's more than one digit
			  if (raw.length > 1 && raw.startsWith('0')) {
			    raw = raw.replace(/^0+/, '');
				  // Apply the formatted mask (you may re-mask to force update)
				  $(this).unmask().val(raw).mask('#,##0', { reverse: true });
			  }
			  validateLiquidAssets(); // Trigger validation
			});

			$liquid_assets.on('focusout', function () {
			  validateLiquidAssets();
			});

			function validateLiquidAssets() {
			  const value = $liquid_assets.val().trim();
			  if (value.length === 0) {
					// Liquid Assets was likely cleared out and deleted, so show the 'Field is required' error message
					showError($('#error-liquid-assets-required'));
			    $liquid_assets.css("border-color", error_color);
			  } else {
					// if there is at least one character input into this field, clear the error message
					hideError($('#error-liquid-assets-required'));
			    $liquid_assets.css("border-color", no_error_color);
			  }
				updateNetWorth();
			}

			// Validate the Non-Liquid Assets field either when the user enters new input, or moves focus away from it
			$non_liquid_assets.on('input', function () {
			  let raw = $(this).val().replace(/[^\d]/g, ''); // remove all non-numeric characters

			  // Strip leading zero(s) if there's more than one digit
			  if (raw.length > 1 && raw.startsWith('0')) {
			    raw = raw.replace(/^0+/, '');
				  // Apply the formatted mask (you may re-mask to force update)
				  $(this).unmask().val(raw).mask('#,##0', { reverse: true });
			  }
			  validateNonLiquidAssets(); // Trigger validation
			});

			$non_liquid_assets.on('focusout', function () {
			  validateNonLiquidAssets();
			});

			function validateNonLiquidAssets() {
			  const value = $non_liquid_assets.val().trim();
			  if (value.length === 0) {
					// Non-Liquid Assets was likely cleared out and deleted, so show the 'Field is required' error message
					showError($('#error-non-liquid-assets-required'));
			    $non_liquid_assets.css("border-color", error_color);
			  } else {
					// if there is at least one character input into this field, clear the error message
					hideError($('#error-non-liquid-assets-required'));
			    $non_liquid_assets.css("border-color", no_error_color);
			  }
				updateNetWorth();
			}

			// Validate the Short-term Debts field either when the user enters new input, or moves focus away from it
			$short_term_debts.on('input', function () {
			  let raw = $(this).val().replace(/[^\d]/g, ''); // remove all non-numeric characters

			  // Strip leading zero(s) if there's more than one digit
			  if (raw.length > 1 && raw.startsWith('0')) {
			    raw = raw.replace(/^0+/, '');
				  // Apply the formatted mask (you may re-mask to force update)
				  $(this).unmask().val(raw).mask('#,##0', { reverse: true });
			  }
			  validateShortTermDebts(); // Trigger validation
			});

			$short_term_debts.on('focusout', function () {
			  validateShortTermDebts();
			});

			function validateShortTermDebts() {
			  const value = $short_term_debts.val().trim();
			  if (value.length === 0) {
					// Short-term Debts was likely cleared out and deleted, so show the 'Field is required' error message
					showError($('#error-short-term-debts-required'));
			    $short_term_debts.css("border-color", error_color);
			  } else {
					// if there is at least one character input into this field, clear the error message
					hideError($('#error-short-term-debts-required'));
			    $short_term_debts.css("border-color", no_error_color);
			  }
				updateNetWorth();
			}

			// Validate the Long-term Debts field either when the user enters new input, or moves focus away from it
			$long_term_debts.on('input', function () {
			  let raw = $(this).val().replace(/[^\d]/g, ''); // remove all non-numeric characters

			  // Strip leading zero(s) if there's more than one digit
			  if (raw.length > 1 && raw.startsWith('0')) {
			    raw = raw.replace(/^0+/, '');
				  // Apply the formatted mask (you may re-mask to force update)
				  $(this).unmask().val(raw).mask('#,##0', { reverse: true });
			  }
			  validateLongTermDebts(); // Trigger validation
			});

			$long_term_debts.on('focusout', function () {
			  validateLongTermDebts();
			});

			function validateLongTermDebts() {
			  const value = $long_term_debts.val().trim();
			  if (value.length === 0) {
					// Long-term Debts was likely cleared out and deleted, so show the 'Field is required' error message
					showError($('#error-long-term-debts-required'));
			    $long_term_debts.css("border-color", error_color);
			  } else {
					// if there is at least one character input into this field, clear the error message
					hideError($('#error-long-term-debts-required'));
			    $long_term_debts.css("border-color", no_error_color);
			  }
				updateNetWorth();
			}

			function updateNetWorth() {
			  const liquid_assets = parseInt($liquid_assets.val().trim().replace(/,/g, ''), 10) || 0,
			        non_liquid_assets = parseInt($non_liquid_assets.val().trim().replace(/,/g, ''), 10) || 0,
			        short_term_debts = parseInt($short_term_debts.val().trim().replace(/,/g, ''), 10) || 0,
			        long_term_debts = parseInt($long_term_debts.val().trim().replace(/,/g, ''), 10) || 0,
			        liquid_net_worth = liquid_assets - short_term_debts,
			        total_net_worth = liquid_assets + non_liquid_assets - short_term_debts - long_term_debts;

			  let formattedLiquidNetWorth;
			  if (liquid_net_worth < 0) {
			    formattedLiquidNetWorth = `($${Math.abs(liquid_net_worth).toLocaleString()})`;
			  } else {
			    formattedLiquidNetWorth = `$${liquid_net_worth.toLocaleString()}`;
			  }
				$('#liquid_net_worth').val(formattedLiquidNetWorth);

			  let formattedTotalNetWorth;
			  if (total_net_worth < 0) {
			    formattedTotalNetWorth = `($${Math.abs(total_net_worth).toLocaleString()})`;
			    $('#calculated_net_worth').text(formattedTotalNetWorth).css('color', '#AC0036'); // place into visible, calculated field and format properly
			  } else {
			    formattedTotalNetWorth = `$${total_net_worth.toLocaleString()}`;
			    $('#calculated_net_worth').text(formattedTotalNetWorth).css('color', '#707070'); // place into visible, calculated field and format properly
			  }
				$('#total_net_worth').val(formattedTotalNetWorth);
			}

			$anticipated_changes.on('change', 'input[type="checkbox"]', function () {
			  const id = this.id;

			  const dependentFields = [
			    'income-change',
			    'living-expenses-change',
			    'assets-change',
			    'medical-expenses-change'
			  ];

			  const isNoChanges = id === 'no-changes';

			  if (isNoChanges && this.checked) {
			    // Uncheck the others
			    dependentFields.forEach(fieldId => {
			      $('#' + fieldId).prop('checked', false);
			      $('#' + fieldId).prev('.w-checkbox-input').removeClass('w--redirected-checked');
			    });

			    $('#anticipated_changes_details').hide(500);

			    setTimeout(function () {
			      $('#anticipated_changes_explanation').val('');
			      hideError($('#error-anticipated-changes-explanation-required'));
			      $anticipated_changes_explanation.css('border-color', no_error_color);
			    }, 300);

			    anticipated_changes_errors = false;

			  } else if (dependentFields.includes(id)) {
			    if (this.checked) {
			      // If any of the top 4 are checked, uncheck "no changes"
			      $('#no-changes').prop('checked', false);
			      $('#no-changes').prev('.w-checkbox-input').removeClass('w--redirected-checked');
			    }

			    // Now evaluate whether ANY of the top 4 are checked
			    const anyTopChecked = dependentFields.some(fieldId => document.getElementById(fieldId).checked);

			    if (anyTopChecked) {
			      $('#anticipated_changes_details').show(500);
			      if ($anticipated_changes_explanation.val().trim().length === 0) {
			        anticipated_changes_errors = true;
			      } else {
			        anticipated_changes_errors = false;
			      }
			    } else {
			      // None of the top 4 are checked
			      $('#anticipated_changes_details').hide(500);
			      setTimeout(function () {
			        $('#anticipated_changes_explanation').val('');
			        hideError($('#error-anticipated-changes-explanation-required'));
			        $anticipated_changes_explanation.css('border-color', no_error_color);
			      }, 300);
			      anticipated_changes_errors = false;
			    }
			  }

			  validateAnticipatedChanges(this); // Still revalidate
			});

			let anticipatedFocusTimer;
			$anticipated_changes.on('focusin', function () {
			  // Clear any pending validation if user re-focuses inside
			  clearTimeout(anticipatedFocusTimer);
			});

			$anticipated_changes.on('focusout', function () {
			  // Delay a little to give time for focus to move to another element
			  anticipatedFocusTimer = setTimeout(() => {
			    const stillInside = $(document.activeElement).closest('#anticipated_changes').length > 0;
			    if (!stillInside) {
			      validateAnticipatedChanges(this); // Only validate once user has fully left
			    }
			  }, 10);
			});

			$anticipated_changes_explanation.on('focusout', function () {
			  const value = $anticipated_changes_explanation.val().trim();

			  if (value.length === 0) {
			    showError($('#error-anticipated-changes-explanation-required'));
			    $anticipated_changes_explanation.css("border-color", error_color);
			    anticipated_changes_errors = true;
			  } else {
			    hideError($('#error-anticipated-changes-explanation-required'));
			    $anticipated_changes_explanation.css("border-color", no_error_color);
			    anticipated_changes_errors = false;
			  }
			  submitButtonCheck();
			});

			$anticipated_changes_explanation.on('input', function () {
			  const value = $anticipated_changes_explanation.val().trim();

			  if (value.length > 0) {
			    hideError($('#error-anticipated-changes-explanation-required'));
			    $anticipated_changes_explanation.css("border-color", no_error_color);
			    anticipated_changes_errors = false;
			  } else {
			    showError($('#error-anticipated-changes-explanation-required'));
			    $anticipated_changes_explanation.css("border-color", error_color);
			    anticipated_changes_errors = true;
				}
			  submitButtonCheck();
			});

			function validateAnticipatedChanges(changedElement) {
			  const ids = [
			    'income-change',
			    'living-expenses-change',
			    'assets-change',
			    'medical-expenses-change',
			    'no-changes'
			  ];

			  const anyChecked = ids.some(id => document.getElementById(id).checked);

			  if (anyChecked) {
			    hideError($('#error-anticipated-changes-required'));
			    $anticipated_changes.css('border-color', no_error_color);

			    const dependentFields = [
			      'income-change',
			      'living-expenses-change',
			      'assets-change',
			      'medical-expenses-change'
			    ];

			    if (changedElement) {
			      const id = changedElement.id;

			      if (dependentFields.includes(id) && changedElement.checked) {
			        if ($anticipated_changes_explanation.val().trim().length === 0) {
						    showError($('#error-anticipated-changes-explanation-required'));
						    $anticipated_changes_explanation.css("border-color", error_color);
						    anticipated_changes_errors = true;
			        } else {
						    hideError($('#error-anticipated-changes-explanation-required'));
						    $anticipated_changes_explanation.css("border-color", no_error_color);
						    anticipated_changes_errors = false;
			        }
			      }
			    }
			  } else {
			    showError($('#error-anticipated-changes-required'));
			    $anticipated_changes.css('border-color', error_color);
			    anticipated_changes_errors = true;
			  }

			  submitButtonCheck();
			}

			$bankruptcy.on('change', function() {
			  // Selection made, hide error
			  hideError($('#error-bankruptcy-required'));
			  $bankruptcy.css("border-color", no_error_color);
			});

			$bankruptcy.on('focusout', function() {
			  setTimeout(() => {
			    // Check if still inside group after a brief delay
			    if (!$(document.activeElement).closest('#bankruptcy').length) {
			      const selected = $("input[name='Bankruptcy']:checked").val();
			      if (!selected) {
			        showError($('#error-bankruptcy-required'));
			        $bankruptcy.css("border-color", error_color);
			      }
			    }
			  }, 10);
			});
		});
	})(jQuery, window, document);
})
