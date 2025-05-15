// Globally defined variables
var storage = window.localStorage,
    className = 'submit_button_active',
    $submit = $('input[type="submit"]'),
    error_color = '#AC0036',
    no_error_color = '#C5C5C5',

    $app_first_name = $('#app_first_name'),
    $app_last_name = $('#app_last_name'),
    $app_home_address = $('#app_home_address'),
    $app_house_number = $('#app_house_number'),
    $app_street = $('#app_street'),
    $app_address_line1 = $('#app_address_line1'),
    $app_address_line2 = $('#app_address_line2'),
    $app_city = $('#app_city'),
    $app_state = $('#app_state'),
    $app_zip = $('#app_zip'),
    $app_address_length = $('#app_address_length'),
    $app_email_address = $('#app_email_address'),
    $app_phone_number = $('#app_phone_number'),
    $app_source_category = $('#app_source_category'),
    
    formattedAddress = '',
    house_number = '',
    street = '',
    address_line1 = '',
    address_line2 = '',
    city = '',
    state = '',
    postalCode = '';

let homeAddressInLicensedState = false;
    addressSelectedWithMouse = false;

// Utility functions
var conv = function (str) {
  if (!str) {
    str = 'empty';
  }
  return str
    .replace(/[!\"#$%&'\(\)\*\+,\.\/:;<=>\?\@\[\\\]\^`\{\|\}~]/g, '')
    .replace(/ /g, '-')
    .toLowerCase()
    .trim();
};

var catArray = document.querySelectorAll('.w-dyn-item .categ');
catArray.forEach(function (elem) {
  var text = elem.innerText || elem.innerContent;
  var className = conv(text);
  if (!isNaN(parseInt(className.charAt(0), 10))) {
    className = '_' + className;
  }
  elem.closest('.mix').classList.add(className);
});

function submitButtonCheck() {
  // Set fields that will be needed for salutation on the 'App Received' page or be needed for the calendly pre-fill
  storage.setItem('app_first_name', $app_first_name.val());
  storage.setItem('app_last_name', $app_last_name.val());
  storage.setItem('app_phone_number', $app_phone_number.val());
  storage.setItem('app_email_address', $app_email_address.val());

  storage.setItem('app_address_length', $app_address_length.val());
  storage.setItem('app_source_category', $app_source_category.val());
console.log("$app_home_address.val() = "+$app_home_address.val()+"\n"+
            "formattedAddress = "+formattedAddress+"\n"+
            "homeAddressInLicensedState = "+homeAddressInLicensedState+"\n"+
            "$app_address_length.val().length = "+$app_address_length.val().length);
  if (
    $app_first_name.val() != '' &&
    $app_last_name.val() != '' &&
    // check that address is not empty and that it is a valid address formatted by the Google API,
    // complete with a valid address line 1 (house number + street name), city, state & zip & 
    // that it is in a valid state where we are licensed to sell life insurance
    $app_home_address.val() != '' &&
    formattedAddress != '' &&
    $app_address_line1.val() != '' &&
    $app_city.val() != '' &&
    $app_state.val() != '' &&
    $app_zip.val() != '' &&
    homeAddressInLicensedState &&
    $app_address_length.val().length > 0 &&
    $app_email_address.val() != '' &&
    /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(
      $app_email_address.val()
    ) &&
    $app_phone_number.val().length == 14 &&
    $app_source_category.val().length > 0
  ) {
    var i;
    for (i = 0; i < storage.length; i++) {
      if (
        // Supress trying to grab these attributes from local storage and writing them to a field on the form prior to submitting that form
        storage.key(i) != 'quote_email_address' &&        // Internally created by Steadyy to pass the email saved on the 'Save Quote' page and re-use it to pre-fill the email field we need to ask again for on the Application page
        storage.key(i) != 'navigation_from' &&            // Internally created by Steadyy to keep track of the navigational path the user followed on our site thru the Needs Builder, Quote, and Application

        storage.key(i) != 'lastExternalReferrer' &&       // Webflow - used to track where traffic came from, as it helps with marketing attribution.
        storage.key(i) != 'lastExternalReferrerTime' &&   // Webflow - helps measure how long ago person came in from external source. Useful to differentiate "new" vs "returning" users based on referral timing.

        storage.key(i) != 'ms_session_id' &&              // Memberstack - tracks current session ID for a logged-in user. Used for membership, authentication, and secure access control.
        storage.key(i) != 'ms_groups' &&                  // Memberstack - the groups (permissions/roles) the Memberstack user belongs to. 
        storage.key(i) != '_ms-mem' &&                    // Memberstack - the full Memberstack member profile object. Includes things like: email, custom fields (first name, last name, phone, etc.), permissions,

        storage.key(i) != 'fpestid' &&                    // ShareThis - unique identifier to track a browser anonymously for "session stitching" across pages.
        storage.key(i) != 'fpestid_timestamp' &&          // ShareThis - timestamp when the fpestid was generated.
        storage.key(i) != 'topicsLastReferenceTime'       // ShareThis - a timestamp when a user last interacted with some type of content "topic" (e.g., for personalization or engagement tracking). 
      ) {
        // For anything else in local storage, we will assume that there is a corresponding field on the form that should correspond (by being named the same thing), that it should be written to prior to submitting the form
        if ($(document).find('#' + storage.key(i)).length > 0) {
          $(document)
            .find('#' + storage.key(i))
            .val(storage.getItem(storage.key(i)));
        } else {
          // But if we find anything in local storage that does NOT have a corresponding field with the same name on the form, write out an error to the console.
          console.log('Element with ID ' + storage.key(i) + ' does not exist.');
        }
      }
    }
    document.getElementById('submit_button').disabled = false;
    $submit.toggleClass(className, true);
  } else {
    document.getElementById('submit_button').disabled = true;
    $submit.toggleClass(className, false);
  }
}

// Init functions
let autocomplete;
function initAutocomplete() {
  console.log('Google Maps API initialized');
  const gpaInput = document.getElementById('app_home_address');
  if (!gpaInput) {
    console.error("Element with ID 'app_home_address' not found");
    return;
  }
  
  autocomplete = new google.maps.places.Autocomplete(gpaInput, {
    fields: ['address_components', 'formatted_address', 'geometry'],
    componentRestrictions: { country: ['us'] }
  });

  autocomplete.addListener('place_changed', onPlaceChanged);

  document.addEventListener('mousedown', function(event) {
    if (event.target.classList.contains('pac-item') || event.target.closest('.pac-item')) {
      addressSelectedWithMouse = true;
    }
  });
}
// Expose initAutocomplete globally for Google API callback
window.initAutocomplete = initAutocomplete;

function onPlaceChanged() {
  const place = autocomplete.getPlace();

  // Handle address parsing logic
  formattedAddress = place.formatted_address;
  storage.setItem('app_formatted_address', formattedAddress);

  if (place && place.address_components) {
    // Loop through address components to find the postal code, state, and city
    for (var y = 0; y < place.address_components.length; y++) {
      if (place.address_components[y].types.includes('street_number')) {
        house_number = place.address_components[y].long_name;
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

    // Set the city, state & zip from the Google Places API to the app_city, app_state, & app_zip fields
    if (house_number) {
      $('#app_house_number').val(house_number);
      storage.setItem('app_house_number', house_number);
    }
    if (street) {
      $('#app_street').val(street);
      storage.setItem('app_street', street);
    }
    if (house_number && street) {
      address_line1 = house_number + ' ' + street;
      $('#app_address_line1').val(address_line1);
      storage.setItem('app_address_line1', address_line1);
    }
    if (address_line2) {
      $('#app_address_line2').val(address_line2);
      storage.setItem('app_address_line2', address_line2);
    }
    if (city) {
      $('#app_city').val(city);
      storage.setItem('app_city', city);
    }
    if (state) {
      $('#app_state').val(state);
      storage.setItem('app_state', state);
    }
    if (postalCode) {
      $('#app_zip').val(postalCode);
      storage.setItem('app_zip', postalCode);
    }
    submitButtonCheck();
  }

  if (
    formattedAddress != '' &&
    address_line1 != '' &&
    city != '' &&
    state != '' &&
    postalCode != ''
  ) {

    // Evaluate whether the state of the address the user entered is one of the states that we are licensed to write coverage in, or not
		const validStates = ["IL", "CA", "FL", "MI", "NJ", "NY", "PA", "TX", "OH"]; // add "VA" after licensing is finished
		if (validStates.includes(state)) {
      homeAddressInLicensedState = true;
			$('#zip-alert-state').hide(500);

      // If all of the fields are full, then that means we have a valid, Google Maps API formatted address and should remove all error messages
      $('#error-address-not-valid').hide(500);
      $('#error-address-required').hide(500);
      $app_home_address.css('border-color', no_error_color);

		} else {
      homeAddressInLicensedState = false;
			$('#zip-alert-state').show(500);
      $app_home_address.css('border-color', error_color);
    }

    // If all of the fields are full, then that means we have a valid, Google Maps API formatted address and should remove all error messages
    $('#error-address-not-valid').hide(500);
    $('#error-address-required').hide(500);
    $app_home_address.css('border-color', no_error_color);
  } else if (
    // Looks like we got a an address back from the Google Places API, but it wasn't fully valid as one of the parts was missing (e.g. like an intersection only)
    formattedAddress != '' &&
    (address_line1 != '' ||
      city != '' ||
      state != '' ||
      postalCode != '')
  ) {
    // If there was a Google Maps API returned location, but it isn't a complete address (e.g. just city or neighborhood), show message that need users help getting a 'good' formatted address
		$('#zip-alert-state').hide(500);
    $('#error-address-required').hide(500);
    $('#error-address-not-valid').show(500);
    $app_home_address.css('border-color', error_color);
  }

  submitButtonCheck();

  // Set focus back to the home_address field when the user selects an address with their mouse.
  setTimeout(function() {
    const active = document.activeElement;
    if (addressSelectedWithMouse) {
      if (!active || active.id === 'app_home_address' || active.tagName === 'BODY') {
        $('#app_home_address').focus();
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
    prem_cents = premium_formatted.slice(
    premium_formatted.length - 3,
    premium_formatted.length
  ),
  carrier = storage.getItem('app_carrier_selected').toLowerCase(),
  filter_string = '.' + conv(carrier);

//	Populate email address if it was already provided during the quote
if (storage.getItem('quote_email_address')) {
  $('#app_email_address').val(storage.getItem('quote_email_address'));
  $('#floating-app-email-address-label').addClass('float');
}

//  Tag this form submission with the proper ID so we can tie everything together on the back-end across multiple form submissions
var commitPointItem = storage.getItem('commit_point');
var numericPartOfCommitPoint = commitPointItem
  ? parseInt(commitPointItem.split('-')[0])
  : null;

if (numericPartOfCommitPoint > 14) {
  $('#commit_point').val(commitPointItem);
} else {
  storage.setItem('commit_point', '14-application');
  $('#commit_point').val('14-application');
}
storage.setItem('navigation_from', '14-application');

$('#quote_initiated_datetime').val(storage.getItem('quote_initiated_datetime'));
$('#quote_initiated_from_ip_address').val(
  storage.getItem('quote_initiated_from_ip_address')
);
$('#quote_initiated_from_city').val(
  storage.getItem('quote_initiated_from_city')
);

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

// Use the function and format the result
const deviceInfo = getUserDeviceInfo();
const formattedInfo = `
  Device Type: ${deviceInfo.deviceType} |<>|
  OS: ${deviceInfo.operatingSystem} |<>|
  Browser: ${deviceInfo.browserName} |<>|
  Viewport Width: ${deviceInfo.viewportWidth}px
`.trim();

// Set the value in the form field
$('#user_device').val(formattedInfo);

var mixer = mixitup('.container', {
  multifilter: {
    enable: true,
  },
  load: {
    filter: filter_string,
  },
});

var application_details = document.querySelector('.application-details');
$(application_details).find('.premium_cents').text(prem_cents);
$(application_details).find('.premium_dollars').text(prem_dollars);
$(application_details).find('.coverage').text(coverage);
$(application_details)
  .find('.term')
  .text(term + ' years');


// Event handlers for the page
$(document).ready(function () {
  Webflow.push(function () {
    $('#application').submit(function () {
      // Check if the URL has any query parameters
      if (window.location.search) {
        // Retrieve the saved_app parameter if it was passed in the URL
        const urlParams = new URLSearchParams(window.location.search);
        const savedApp = urlParams.get('saved_app');
        const step = parseInt(urlParams.get('step'), 10); // Convert step to an integer
        // If the URL has the saved_app query params and the user has already completed the first 2 steps, then reset the submitButton href
        // to take user back to the saved applications page, instead of onto app page 2 as if they were in normal flow
        if (savedApp && !isNaN(step) && step > 1) {
          location.href = '/saved-applications/' + savedApp;
        }
      }
    });
  });
});

$(function () {
  (function ($, window, document, undefined) {
    'use strict';
    var form = '.application';

    $(form).each(function () {
      var $form = $(this),
          submit = 'input[type="submit"]',
          enabled = true;

      $submit = $form.find(submit);

      document.getElementById('submit_button').disabled = true;

      $app_home_address.attr('autocomplete', 'off');
      $app_phone_number.mask('(000) 000-0000');

      $app_phone_number.on('input.True', function () {
        if ($(this).val().length > 14) {
          $(this).val($(this).val().slice(0, 14));
        }
      });

      $('form').on('change', 'input, select, textarea', function () {
        if (enabled) {
          submitButtonCheck();
        }
      });

      $('form').on('keyup', 'input, select, textarea', function () {
        if (enabled) {
          submitButtonCheck();
        }
      });

      $app_first_name.on('input.True', function () {
        if ($(this).val().length == 0) {
          // First Name was likely cleared out and deleted, so show the 'Field is required' error message
          $('#error-first-name-required').show(500);
          $app_first_name.css('border-color', error_color);
        } else {
          // if there is at least one character input into this field, clear the error message
          $('#error-first-name-required').hide(500);
          $app_first_name.css('border-color', no_error_color);
        }
        submitButtonCheck();
      });

      $app_first_name.on('focusout', function () {
        if ($app_first_name.val().length == 0) {
          // if the first_name field is blank, throw up an error message that this field is required
          $('#error-first-name-required').show(500);
          $app_first_name.css('border-color', error_color);
        } else {
          // Under this condition we got a good first name, so get rid of all error messages
          $('#error-first-name-required').hide(500);
          $app_first_name.css('border-color', no_error_color);
        }
        submitButtonCheck();
      });

      $app_last_name.on('input.True', function () {
        if ($(this).val().length == 0) {
          // Last Name was likely cleared out and deleted, so show the 'Field is required' error message
          $('#error-last-name-required').show(500);
          $app_last_name.css('border-color', error_color);
        } else {
          // if there is at least one character input into this field, clear the error message
          $('#error-last-name-required').hide(500);
          $app_last_name.css('border-color', no_error_color);
        }
        submitButtonCheck();
      });

      $app_last_name.on('focusout', function () {
        if ($app_last_name.val().length == 0) {
          // if the last_name field is blank, throw up an error message that this field is required
          $('#error-last-name-required').show(500);
          $app_last_name.css('border-color', error_color);
        } else {
          // Under this condition we got a last name, so get rid of all error messages
          $('#error-last-name-required').hide(500);
          $app_last_name.css('border-color', no_error_color);
        }
        submitButtonCheck();
      });

      $app_home_address.on('input.True', function () {
        if ($(this).val().length == 0) {
          formattedAddress = '';
          house_number = '';
          street = '';
          address_line1 = '';
          address_line2 = '';
          city = '';
          state = '';
          postalCode = '';

          // Address was likely cleared out and deleted, so show the 'Address required' error message
    			$('#zip-alert-state').hide(500);
          $('#error-address-not-valid').hide(500);
          $('#error-address-required').show(500);
          $app_home_address.css('border-color', error_color);
        }
        submitButtonCheck();
      });

			$app_home_address.on('focusout', function () {
			  if ($app_home_address.val().length == 0) {
			    // Blank field
    			$('#zip-alert-state').hide(500);
			    $('#error-address-not-valid').hide(500);
			    $('#error-address-required').show(500);
			    $app_home_address.css('border-color', error_color);
			  } else if (formattedAddress == '') {
			    // User typed but DID NOT select a suggestion → show "Select from suggestions" error
			    $('#error-address-required').hide(500);
			    $('#error-address-not-valid').show(500);
			    $app_home_address.css('border-color', error_color);
			  } else if (formattedAddress != '' && address_line1 != '' && city != '' && state != '' && postalCode != '') {
			    // Valid address
			    $('#error-address-not-valid').hide(500);
			    $('#error-address-required').hide(500);
			    $app_home_address.css('border-color', no_error_color);
			  } else if (formattedAddress != '' && (address_line1 != '' || city != '' || state != '' || postalCode != '')) {
			    // Incomplete Google address
			    $('#error-address-required').hide(500);
			    $('#error-address-not-valid').show(500);
			    $app_home_address.css('border-color', error_color);
			  }
			  submitButtonCheck();
			});

      $app_address_length.on('change', function () {
        if ($(this).val() == '') {
          // Length of Time at Address was likely reset, so show the 'Field is required' error message
          $('#error-address-length-required').show(500);
          $app_address_length.css('border-color', error_color);
        } else {
          // if there is something selected in this field, clear the error message
          $('#error-address-length-required').hide(500);
          $app_address_length.css('border-color', no_error_color);
        }
        submitButtonCheck();
      });

      $app_address_length.on('focusout', function () {
        if ($app_address_length.val() == '') {
          // if the Length of Time at Address is empty, throw up an error message that this field is required
          $('#error-address-length-required').show(500);
          $app_address_length.css('border-color', error_color);
        } else {
          // Under this condition we got a selection, so get rid of all error messages
          $('#error-address-length-required').hide(500);
          $app_address_length.css('border-color', no_error_color);
        }
        submitButtonCheck();
      });

      $app_email_address.on('input.True', function () {
        if ($(this).val().length == 0) {
          // Email was likely cleared out and deleted, so show the 'Field is required' error message
          $('#error-email-required').show(500);
          $app_email_address.css('border-color', error_color);
        } else {
          // if there is at least one character input into this field, clear the error message
          $('#error-email-required').hide(500);
          $app_email_address.css('border-color', no_error_color);
        }
        submitButtonCheck();
      });

      $app_email_address.on('focusout', function () {
        if (
          $app_email_address.val() != '' &&
          /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(
            $app_email_address.val()
          )
        ) {
          // Under this condition we got a good email address, so get rid of all error messages
          $('#error-email-required').hide(500);
          $app_email_address.css('border-color', no_error_color);
        } else {
          // if the email field is blank or not complete, throw up an error message that this field is required
          $('#error-email-required').show(500);
          $app_email_address.css('border-color', error_color);
        }
        submitButtonCheck();
      });

      $app_phone_number.on('input.True', function () {
        if ($(this).val().length == 0) {
          // Phone was likely cleared out and deleted, so show the 'Field is required' error message
          $('#error-phone-required').show(500);
          $app_phone_number.css('border-color', error_color);
        } else {
          // if there is at least one character input into this field, clear the error message
          $('#error-phone-required').hide(500);
          $app_phone_number.css('border-color', no_error_color);
        }
        submitButtonCheck();
      });

      $app_phone_number.on('focusout', function () {
        if ($app_phone_number.val().length < 14) {
          // if the phone number field is not full with a 10 digit number (plus the mask which provides parenthese
          // around areas code and hyphen after exhange), throw up an error message that this field is required
          $('#error-phone-required').show(500);
          $app_phone_number.css('border-color', error_color);
        } else {
          // Under this condition we got a good phone number, so get rid of all error messages
          $('#error-phone-required').hide(500);
          $app_phone_number.css('border-color', no_error_color);
        }
        submitButtonCheck();
      });

      $app_source_category.on('change', function () {
        if ($(this).val() == '') {
          // Source was likely reset, so show the 'Field is required' error message
          $('#error-source-required').show(500);
          $app_source_category.css('border-color', error_color);
        } else {
          // if there is something selected in this field, clear the error message
          $('#error-source-required').hide(500);
          $app_source_category.css('border-color', no_error_color);
        }
        submitButtonCheck();
      });

      $app_source_category.on('focusout', function () {
        if ($app_source_category.val() == '') {
          // if the source field is empty, throw up an error message that this field is required
          $('#error-source-required').show(500);
          $app_source_category.css('border-color', error_color);
        } else {
          // Under this condition we got a selection, so get rid of all error messages
          $('#error-source-required').hide(500);
          $app_source_category.css('border-color', no_error_color);
        }
        submitButtonCheck();
      });

      $('form').on('focusin', 'input, select, textarea', function () {
        // if user puts focus on any field other than home address, check that
        // home address wasn't partially filled, but not checked via Google Maps API, by selecting a valid value from the drop-down
        var focusedElement = document.activeElement;
        if (focusedElement.id != 'app_home_address') {
          if ($app_home_address.val().length > 0 && formattedAddress == '') {
            $('#error-address-required').hide(500);
            $('#error-address-not-valid').show(500);
            $app_home_address.css('border-color', error_color);
          }
        }
        submitButtonCheck();
      });

      // Check if the URL has any query parameters
      if (window.location.search) {
        // Function to get query parameters from the URL
        function getQueryParameter(name) {
          const urlParams = new URLSearchParams(window.location.search);
          return urlParams.get(name);
        }

        // Retrieve the parameters
        const savedApp = getQueryParameter('saved_app');
        const firstName = getQueryParameter('first_name');
        const lastName = getQueryParameter('last_name');
        const homeAddress = getQueryParameter('home_address');
        const addressLength = getQueryParameter('address_length');
        const phoneNumber = getQueryParameter('phone_number');
        const emailAddress = getQueryParameter('email_address');
        const sourceCategory = getQueryParameter('source_category');

        // Populate the fields on the page
        if (savedApp) {
          $('#app_name')
            .val(decodeURIComponent(savedApp));
        }
        if (firstName) {
          $('#floating-app-first-name-label').addClass('float'); // Float the label
          $('#app_first_name')
            .val(decodeURIComponent(firstName))
            .trigger('input'); // Assign the value and trigger input event
        }
        if (lastName) {
          $('#floating-app-last-name-label').addClass('float'); // Float the label
          $('#app_last_name')
            .val(decodeURIComponent(lastName))
            .trigger('input'); // Assign the value and trigger input event
        }
        if (homeAddress) {
          $('#floating-app-home-address-label').addClass('float'); // Float the label
          $('#app_home_address')
            .val(decodeURIComponent(homeAddress))
            .trigger('input'); // Assign the value and trigger input event
          $('#app_formatted_address')
            .val(decodeURIComponent(homeAddress))
            .trigger('input'); // Assign the value and trigger input event
          storage.setItem('app_formatted_address', homeAddress);

          // Call the function with the home address
          parseAddress(decodeURIComponent(homeAddress));
        }
        if (addressLength) {
          $('#floating-app-address-length-label').addClass('float'); // Float the label
          $('#app_address_length')
            .val(decodeURIComponent(addressLength))
            .trigger('input'); // Assign the value and trigger input event
        }
        if (phoneNumber) {
          $('#floating-app-phone-number-label').addClass('float'); // Float the label
          $('#app_phone_number')
            .val(decodeURIComponent(phoneNumber))
            .trigger('input'); // Assign the value and trigger input event
        }
        if (emailAddress) {
          $('#floating-app-email-address-label').addClass('float'); // Float the label
          $('#app_email_address')
            .val(decodeURIComponent(emailAddress))
            .trigger('input'); // Assign the value and trigger input event
        }
        if (sourceCategory) {
          $('#floating-app-source-category-label').addClass('float'); // Float the label
          $('#app_source_category')
            .val(decodeURIComponent(sourceCategory))
            .trigger('input'); // Assign the value and trigger input event
        }
        submitButtonCheck();
      } else {
        console.log('No query parameters found in the URL.');
      }

      // Function to parse the address
      function parseAddress(addressString) {
        const geocoder = new google.maps.Geocoder();

        geocoder.geocode({ address: addressString }, function(results, status) {
          if (status === 'OK' && results[0]) {
            const place = results[0];

            formattedAddress = place.formatted_address;
            storage.setItem('app_formatted_address', formattedAddress);
            
            const components = place.address_components;

            let house_number = '',
                street = '',
                address_line1 = '',
                address_line2 = '',
                city = '',
                state = '',
                postalCode = '';

            for (let component of components) {
              if (component.types.includes('street_number')) {
                house_number = component.long_name;
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

            if (house_number) {
              $('#app_house_number').val(house_number);
              storage.setItem('app_house_number', house_number);
            }
            if (street) {
              $('#app_street').val(street);
              storage.setItem('app_street', street);
            }
            if (house_number && street) {
              address_line1 = house_number + ' ' + street;
              $('#app_address_line1').val(address_line1);
              storage.setItem('app_address_line1', address_line1);
            }
            if (address_line2) {
              $('#app_address_line2').val(address_line2);
              storage.setItem('app_address_line2', address_line2);
            }
            if (city) {
              $('#app_city').val(city);
              storage.setItem('app_city', city);
            }
            if (state) {
              $('#app_state').val(state);
              storage.setItem('app_state', state);
            }
            if (postalCode) {
              $('#app_zip').val(postalCode);
              storage.setItem('app_zip', postalCode);
            }
          } else {
            console.error('Geocode failed: ' + status);
          }
        });
      }

    });
  })(jQuery, window, document);
});
