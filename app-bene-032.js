// Globally defined variables
var storage = window.localStorage,
  className = 'submit_button_active',
  $submit = $('input[type="submit"]'),
  error_color = '#AC0036',
  no_error_color = '#C5C5C5',
  //  Fields entered (and submitted) on page 1 of the application
  $first_name = $('#app_first_name'),
  $last_name = $('#app_last_name'),
  $home_address = $('#app_home_address'),
  $email_address = $('#app_email_address'),
  $phone_number = $('#app_phone_number'),
  //  Fields for beneficiary page of the application
  $primary_bene = $('#primary_bene'),
  $bene_1_first_name = $('#bene_1_first_name'),
  $bene_1_last_name = $('#bene_1_last_name'),
  $bene_1_dob = $('#bene_1_dob'),
  $bene_1_phone_number = $('#bene_1_phone_number'),
  $bene_1_address = $('#bene_1_address'),
  $bene_1_street_number = $('#bene_1_street_number'),
  $bene_1_street = $('#bene_1_street'),
  $bene_1_address_line1 = $('#bene_1_address_line1'),
  $bene_1_address_line2 = $('#bene_1_address_line2'),
  $bene_1_city = $('#bene_1_city'),
  $bene_1_state = $('#bene_1_state'),
  $bene_1_zip = $('#bene_1_zip'),
  $bene_1_relationship = $('#bene_1_relationship'),
  $bene_1_allocation_percentage = $('#bene_1_allocation_percentage'),
  $bene_2_first_name = $('#bene_2_first_name'),
  $bene_2_last_name = $('#bene_2_last_name'),
  $bene_2_dob = $('#bene_2_dob'),
  $bene_2_phone_number = $('#bene_2_phone_number'),
  $bene_2_address = $('#bene_2_address'),
  $bene_2_street_number = $('#bene_2_street_number'),
  $bene_2_street = $('#bene_2_street'),
  $bene_2_address_line1 = $('#bene_2_address_line1'),
  $bene_2_address_line2 = $('#bene_2_address_line2'),
  $bene_2_city = $('#bene_2_city'),
  $bene_2_state = $('#bene_2_state'),
  $bene_2_zip = $('#bene_2_zip'),
  $bene_2_relationship = $('#bene_2_relationship'),
  $bene_2_allocation_percentage = $('#bene_2_allocation_percentage'),
  $bene_3_first_name = $('#bene_3_first_name'),
  $bene_3_last_name = $('#bene_3_last_name'),
  $bene_3_dob = $('#bene_3_dob'),
  $bene_3_phone_number = $('#bene_3_phone_number'),
  $bene_3_address = $('#bene_3_address'),
  $bene_3_street_number = $('#bene_3_street_number'),
  $bene_3_street = $('#bene_3_street'),
  $bene_3_address_line1 = $('#bene_3_address_line1'),
  $bene_3_address_line2 = $('#bene_3_address_line2'),
  $bene_3_city = $('#bene_3_city'),
  $bene_3_state = $('#bene_3_state'),
  $bene_3_zip = $('#bene_3_zip'),
  $bene_3_relationship = $('#bene_3_relationship'),
  $bene_3_allocation_percentage = $('#bene_3_allocation_percentage'),
  $bene_4_first_name = $('#bene_4_first_name'),
  $bene_4_last_name = $('#bene_4_last_name'),
  $bene_4_dob = $('#bene_4_dob'),
  $bene_4_phone_number = $('#bene_4_phone_number'),
  $bene_4_address = $('#bene_4_address'),
  $bene_4_street_number = $('#bene_4_street_number'),
  $bene_4_street = $('#bene_4_street'),
  $bene_4_address_line1 = $('#bene_4_address_line1'),
  $bene_4_address_line2 = $('#bene_4_address_line2'),
  $bene_4_city = $('#bene_4_city'),
  $bene_4_state = $('#bene_4_state'),
  $bene_4_zip = $('#bene_4_zip'),
  $bene_4_relationship = $('#bene_4_relationship'),
  $bene_4_allocation_percentage = $('#bene_4_allocation_percentage'),
  $bene_5_first_name = $('#bene_5_first_name'),
  $bene_5_last_name = $('#bene_5_last_name'),
  $bene_5_dob = $('#bene_5_dob'),
  $bene_5_phone_number = $('#bene_5_phone_number'),
  $bene_5_address = $('#bene_5_address'),
  $bene_5_street_number = $('#bene_5_street_number'),
  $bene_5_street = $('#bene_5_street'),
  $bene_5_address_line1 = $('#bene_5_address_line1'),
  $bene_5_address_line2 = $('#bene_5_address_line2'),
  $bene_5_city = $('#bene_5_city'),
  $bene_5_state = $('#bene_5_state'),
  $bene_5_zip = $('#bene_5_zip'),
  $bene_5_relationship = $('#bene_5_relationship'),
  $bene_5_allocation_percentage = $('#bene_5_allocation_percentage');

// Variables to track what has been filled in
var primary_bene_ct = 0,
  contingent_bene_ct = 0,
  conditionals_for_primary_bene_1_satisfied,
  conditionals_for_primary_bene_2_satisfied,
  conditionals_for_primary_bene_3_satisfied,
  conditionals_for_primary_bene_4_satisfied,
  conditionals_for_primary_bene_5_satisfied,
  conditionals_for_primary_bene_satisfied;

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
  checkPrimaryBeneDetails();
  if (conditionals_for_primary_bene_satisfied) {
    document.getElementById('submit_button').disabled = false;
    $submit.toggleClass(className, true);
  } else {
    document.getElementById('submit_button').disabled = true;
    $submit.toggleClass(className, false);
  }
}

function checkPrimaryBeneDetails() {
  var primary_bene_selected = $("input[name='PrimaryBene']:checked").val();

  if (primary_bene_selected == 'Yes') {
    for (let x = 1; x < primary_bene_ct + 1; x++) {
      if (
        $('#bene_' + x + '_first_name').val() != '' &&
        $('#bene_' + x + '_last_name').val() != '' &&
        $('#bene_' + x + '_dob').val() != '' &&
        $('#bene_' + x + '_phone_number').val().length == 14 &&
        $('#bene_' + x + '_address').val() != '' &&
        $('#bene_' + x + '_relationship').val() != '' &&
        $('#bene_' + x + '_allocation_percentage').val().length > 0 &&
        $('#bene_' + x + '_allocation_percentage').val().length < 4
      ) {
        switch (x) {
          case 1:
            conditionals_for_primary_bene_1_satisfied = true;
            break;
          case 2:
            conditionals_for_primary_bene_2_satisfied = true;
            break;
          case 3:
            conditionals_for_primary_bene_3_satisfied = true;
            break;
          case 4:
            conditionals_for_primary_bene_4_satisfied = true;
            break;
          case 5:
            conditionals_for_primary_bene_5_satisfied = true;
            break;
          default:
            break;
        }
      } else {
        switch (x) {
          case 1:
            conditionals_for_primary_bene_1_satisfied = false;
            break;
          case 2:
            conditionals_for_primary_bene_2_satisfied = false;
            break;
          case 3:
            conditionals_for_primary_bene_3_satisfied = false;
            break;
          case 4:
            conditionals_for_primary_bene_4_satisfied = false;
            break;
          case 5:
            conditionals_for_primary_bene_5_satisfied = false;
            break;
          default:
            break;
        }
      }
    }

		console.log("primary_bene_ct = "+primary_bene_ct);
		console.log("conditionals_for_primary_bene_1_satisfied = "+conditionals_for_primary_bene_1_satisfied);
		console.log("conditionals_for_primary_bene_2_satisfied = "+conditionals_for_primary_bene_2_satisfied);
		console.log("conditionals_for_primary_bene_3_satisfied = "+conditionals_for_primary_bene_3_satisfied);
		console.log("conditionals_for_primary_bene_4_satisfied = "+conditionals_for_primary_bene_4_satisfied);
		console.log("conditionals_for_primary_bene_5_satisfied = "+conditionals_for_primary_bene_5_satisfied);

		let allPrimaryBeneSatisfied = true;

		for (let i = 1; i <= primary_bene_ct; i++) {
		  if (window['conditionals_for_primary_bene_' + i + '_satisfied'] === false) {
		    allPrimaryBeneSatisfied = false;
		    break;
		  }
		}

		console.log("allPrimaryBeneSatisfied = "+allPrimaryBeneSatisfied);
		if (!allPrimaryBeneSatisfied) {
		  conditionals_for_primary_bene_satisfied = false;
		  $('#error-primary-bene-required').hide(500);
		  $('#error-primary-bene-all-fields-required').show(500);
		  $primary_bene.css('border-color', error_color);
		} else {
		  conditionals_for_primary_bene_satisfied = true;
		  $('#error-primary-bene-required').hide(500);
		  $('#error-primary-bene-all-fields-required').hide(500);
		  $primary_bene.css('border-color', no_error_color);
		}

		/*
    // Check to see if any of the additional benefiiciaries that were added, have all required data entered
    if (
      conditionals_for_primary_bene_1_satisfied == false ||
      conditionals_for_primary_bene_2_satisfied == false ||
      conditionals_for_primary_bene_3_satisfied == false ||
      conditionals_for_primary_bene_4_satisfied == false ||
      conditionals_for_primary_bene_5_satisfied == false
    ) {
      conditionals_for_primary_bene_satisfied = false;
      $('#error-primary-bene-required').hide(500);
      $('#error-primary-bene-all-fields-required').show(500);
      $primary_bene.css('border-color', error_color);
    } else {
      conditionals_for_other_insurance_satisfied = true;
      $('#error-primary-bene-required').hide(500);
      $('#error-primary-bene-all-fields-required').hide(500);
      $primary_bene.css('border-color', no_error_color);
    }
		*/
  }
}

// Init functions
let autocomplete;
function initAutocomplete() {
  console.log('Google Maps API initialized');
  const gpaInput = document.getElementById('bene_1_address');
  if (!gpaInput) {
    console.error("Element with ID 'bene_1_address' not found");
    return;
  }

  autocomplete = new google.maps.places.Autocomplete(gpaInput, {
    fields: ['address_components', 'formatted_address', 'geometry'],
    componentRestrictions: { country: ['us'] },
  });

  autocomplete.addListener('place_changed', onPlaceChanged);

  document.addEventListener('mousedown', function (event) {
    if (
      event.target.classList.contains('pac-item') ||
      event.target.closest('.pac-item')
    ) {
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
  storage.setItem('bene_1_formatted_address', formattedAddress);

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

    // Set the city, state & zip from the Google Places API to the bene_1_city, bene_1_state, & bene_1_zip fields
    if (street_number) {
      $('#bene_1_street_number').val(street_number);
      storage.setItem('bene_1_street_number', street_number);
    }
    if (street) {
      $('#bene_1_street').val(street);
      storage.setItem('bene_1_street', street);
    }
    if (street_number && street) {
      address_line1 = street_number + ' ' + street;
      $('#bene_1_address_line1').val(address_line1);
      storage.setItem('bene_1_address_line1', address_line1);
    }
    if (address_line2) {
      $('#bene_1_address_line2').val(address_line2);
      storage.setItem('bene_1_address_line2', address_line2);
    }
    if (city) {
      $('#bene_1_city').val(city);
      storage.setItem('bene_1_city', city);
    }
    if (state) {
      $('#bene_1_state').val(state);
      storage.setItem('bene_1_state', state);
    }
    if (postalCode) {
      $('#bene_1_zip').val(postalCode);
      storage.setItem('bene_1_zip', postalCode);
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
    $('#error-bene-1-address-not-valid').hide(500);
    $('#error-bene-1-address-required').hide(500);
    $bene_1_address.css('border-color', no_error_color);
  } else if (
    // Looks like we got a an address back from the Google Places API, but it wasn't fully valid as one of the parts was missing (e.g. like an intersection only)
    formattedAddress != '' &&
    (address_line1 != '' || city != '' || state != '' || postalCode != '')
  ) {
    // If there was a Google Maps API returned location, but it isn't a complete address (e.g. just city or neighborhood), show message that need users help getting a 'good' formatted address
    $('#error-address-required').hide(500);
    $('#error-address-not-valid').show(500);
    $bene_1_address.css('border-color', error_color);
  }

  submitButtonCheck();

  // Set focus back to the home_address field when the user selects an address with their mouse.
  setTimeout(function () {
    const active = document.activeElement;
    if (addressSelectedWithMouse) {
      if (
        !active ||
        active.id === 'bene_1_address' ||
        active.tagName === 'BODY'
      ) {
        $('#bene_1_address').focus();
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
  if (
    userAgent.includes('Chrome') &&
    !userAgent.includes('Edge') &&
    !userAgent.includes('OPR')
  ) {
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

$(document).ready(function () {
  Webflow.push(function () {
    $('#application').submit(function () {
      // Check if the URL has any query parameters
      if (window.location.search) {
        // Retrieve the saved_app parameter if it was passed in the URL
        const urlParams = new URLSearchParams(window.location.search);
        const savedApp = urlParams.get('saved_app');
        const step = parseInt(urlParams.get('step'), 10); // Convert step to an integer

        // If the URL has the saved_app query params and the user has already completed all 3 steps, then reset the submitButton href
        // to take user back to the saved applications page, instead of onto app page 3 as if they were in normal flow
        if (savedApp && !isNaN(step) && step > 2) {
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
        enabled = true,
        //  Grab the fields entered (and submitted) on page 1 of the application
        first_name = storage.getItem('app_first_name'),
        last_name = storage.getItem('app_last_name'),
        home_address = storage.getItem('app_formatted_address'),
        email = storage.getItem('quote_email_address'),
        phone_number = storage.getItem('app_phone_number');

      $submit = $form.find(submit);
      document.getElementById('submit_button').disabled = true;

      //  Repopulate the hidden fields entered (and submitted) on page 1 of the application to be able to tie this page back to it on the back end
      $first_name.val(first_name);
      $last_name.val(last_name);
      $home_address.val(home_address);
      $email_address.val(email);
      $phone_number.val(phone_number);

      // Set the masks for fields that require them
      $('.dob').mask('00/00/0000');
      $('.phone-number').mask('(000) 000-0000');
      $('.allocation-percentage').mask('##0%', { reverse: true });

      $('.address').attr('autocomplete', 'off');

      $('.phone-number').on('input.True', function () {
        if ($(this).val().length > 14) {
          $(this).val($(this).val().slice(0, 14));
        }
      });

      $('.allocation-percentage').on('input', function () {
        const val = parseInt($(this).val().replace('%', ''), 10);

        // Don't allow leading zeros in the allocation field
        if (!isNaN(val)) {
          $(this).val(val + '%');
        } else {
          $(this).val('');
        }

        // Don't allow numbers greater than 100%
        if (val > 100) {
          //$(this).val('100%');
          $(this).val($(this).val().slice(0, 2));
          // need to consider error message so the use knows why their keystroke that resulted in number >100 was sliced off and ignored
        }
      });

      $('.allocation-percentage').on('keydown', function (e) {
        const input = this;
        const key = e.key;

        if (key === 'Backspace') {
          // If cursor is right before the % sign, move it left
          const pos = input.selectionStart;
          const val = input.value;

          if (val.endsWith('%') && pos === val.length) {
            // Prevent default backspace (which does nothing here)
            e.preventDefault();
            // Remove the last number before the %
            const digitsOnly = val.replace('%', '').slice(0, -1);
            input.value = digitsOnly + '%';
          }
        }
      });

      $("input[name='PrimaryBene']").click(function (e) {
        var preimary_bene_selected = $(
          "input[name='PrimaryBene']:checked"
        ).val();
        if (preimary_bene_selected == 'Yes') {
          $('#additional_primary_bene_1').show(500);
          $('.add_next_primary_bene').show(500);
          primary_bene_ct = 1;
        } else if (preimary_bene_selected == 'No') {
          for (let i = 1; i < 6; i++) {
            $('#bene_' + i + '_first_name').val('');
            $('#bene_' + i + '_first_name_label').removeClass('float');
            $('#bene_' + i + '_last_name').val('');
            $('#bene_' + i + '_last_name_label').removeClass('float');
            $('#bene_' + i + '_dob').val('');
            $('#bene_' + i + '_dob_label').removeClass('float');
            $('#bene_' + i + '_phone_number').val('');
            $('#bene_' + i + '_phone_number_label').removeClass('float');
            $('#bene_' + i + '_address').val('');
            $('#bene_' + i + '_address_label').removeClass('float');

            // Hidden sub fields of the address --> since these are hidden there is no floating label to manipulate
            $('#bene_' + i + '_formatted_address').val('');
            $('#bene_' + i + '_street_number').val('');
            $('#bene_' + i + '_street').val('');
            $('#bene_' + i + 'address_line1').val('');
            $('#bene_' + i + 'address_line2').val('');
            $('#bene_' + i + '_city').val('');
            $('#bene_' + i + '_state').val('');
            $('#bene_' + i + '_zip').val('');

            $('#bene_' + i + '_relationship').val('');
            $('#bene_' + i + '_relationship_label').removeClass('float');
            $('#bene_' + i + '_allocation_percentage').val('');
            $('#bene_' + i + '_allocation_percentage_label').removeClass(
              'float'
            );

            $('#additional_primary_bene_' + i).hide(500);
          }
          $('.add_next_primary_bene').hide(500);
          primary_bene_ct = 0;
          conditionals_for_primary_bene_satisfied = true;
          submitButtonCheck();
        }
      });

      function removePrimaryBene(i) {
        // If user is trying to delete beneficiary out of order (e.g. not the last one), then cascade the values of higher count beneficiary(ies) to the targeted one for deletion first
        for (let x = i; x < primary_bene_ct; x++) {
          var target_primary_beneficiary_to_move = x + 1;

          $('#bene_' + x + '_first_name').val(
            $(
              '#bene_' + target_primary_beneficiary_to_move + '_first_name'
            ).val()
          );
          $('#bene_' + x + '_last_name').val(
            $(
              '#bene_' + target_primary_beneficiary_to_move + '_last_name'
            ).val()
          );
          $('#bene_' + x + '_dob').val(
            $('#bene_' + target_primary_beneficiary_to_move + '_dob').val()
          );
          $('#bene_' + x + '_phone_number').val(
            $(
              '#bene_' + target_primary_beneficiary_to_move + '_phone_number'
            ).val()
          );
          $('#bene_' + x + '_address').val(
            $('#bene_' + target_primary_beneficiary_to_move + '_address').val()
          );
          $('#bene_' + x + '_street_number').val(
            $(
              '#bene_' + target_primary_beneficiary_to_move + '_street_number'
            ).val()
          );
          $('#bene_' + x + '_street').val(
            $('#bene_' + target_primary_beneficiary_to_move + '_street').val()
          );
          $('#bene_' + x + '_address_line1').val(
            $(
              '#bene_' + target_primary_beneficiary_to_move + '_address_line1'
            ).val()
          );
          $('#bene_' + x + '_address_line2').val(
            $(
              '#bene_' + target_primary_beneficiary_to_move + '_address_line2'
            ).val()
          );
          $('#bene_' + x + '_city').val(
            $('#bene_' + target_primary_beneficiary_to_move + '_city').val()
          );
          $('#bene_' + x + '_state').val(
            $('#bene_' + target_primary_beneficiary_to_move + '_state').val()
          );
          $('#bene_' + x + '_zip').val(
            $('#bene_' + target_primary_beneficiary_to_move + '_zip').val()
          );
          $('#bene_' + x + '_relationship').val(
            $(
              '#bene_' + target_primary_beneficiary_to_move + '_relationship'
            ).val()
          );
          $('#bene_' + x + '_allocation_percentage').val(
            $(
              '#bene_' +
                target_primary_beneficiary_to_move +
                '_allocation_percentage'
            ).val()
          );

          $('#bene_' + target_primary_beneficiary_to_move + '_first_name').val(
            ''
          );
          $('#bene_' + target_primary_beneficiary_to_move + '_last_name').val(
            ''
          );
          $('#bene_' + target_primary_beneficiary_to_move + '_dob').val('');
          $(
            '#bene_' + target_primary_beneficiary_to_move + '_phone_number'
          ).val('');
          $('#bene_' + target_primary_beneficiary_to_move + '_address').val('');
          $(
            '#bene_' + target_primary_beneficiary_to_move + '_street_number'
          ).val('');
          $('#bene_' + target_primary_beneficiary_to_move + '_street').val('');
          $(
            '#bene_' + target_primary_beneficiary_to_move + '_address_line1'
          ).val('');
          $(
            '#bene_' + target_primary_beneficiary_to_move + '_address_line2'
          ).val('');
          $('#bene_' + target_primary_beneficiary_to_move + '_city').val('');
          $('#bene_' + target_primary_beneficiary_to_move + '_state').val('');
          $('#bene_' + target_primary_beneficiary_to_move + '_zip').val('');
        }

        i = primary_bene_ct;

        $('#bene_' + i + '_first_name').val('');
        $('#bene_' + i + '_first_name_label').removeClass('float');
        $('#bene_' + i + '_last_name').val('');
        $('#bene_' + i + '_last_name_label').removeClass('float');
        $('#bene_' + i + '_dob').val('');
        $('#bene_' + i + '_dob_label').removeClass('float');
        $('#bene_' + i + '_phone_number').val('');
        $('#bene_' + i + '_phone_number_label').removeClass('float');
        $('#bene_' + i + '_address').val('');
        $('#bene_' + i + '_address_label').removeClass('float');

        // Hidden sub fields of the address --> since these are hidden there is no floating label to manipulate
        $('#bene_' + i + '_formatted_address').val('');
        $('#bene_' + i + '_street_number').val('');
        $('#bene_' + i + '_street').val('');
        $('#bene_' + i + 'address_line1').val('');
        $('#bene_' + i + 'address_line2').val('');
        $('#bene_' + i + '_city').val('');
        $('#bene_' + i + '_state').val('');
        $('#bene_' + i + '_zip').val('');

        $('#bene_' + i + '_relationship').val('');
        $('#bene_' + i + '_relationship_label').removeClass('float');
        $('#bene_' + i + '_allocation_percentage').val('');
        $('#bene_' + i + '_allocation_percentage_label').removeClass('float');

        $('#additional_primary_bene_' + i).hide(500);
        primary_bene_ct = i - 1;

        switch (i) {
          case 1:
            conditionals_for_primary_bene_1_satisfied = true;
            $("input[name='PrimaryBene'][value='Yes']").prop('checked', false);
            $("input[name='PrimaryBene'][value='Yes']")
              .prev('.w-radio-input')
              .removeClass('w--redirected-checked');
            $("input[name='PrimaryBene'][value='No']").prop('checked', true);
            $("input[name='PrimaryBene'][value='No']")
              .prev('.w-radio-input')
              .addClass('w--redirected-checked');
            $('.add_next_primary_bene').hide(500);
            conditionals_for_primary_bene_satisfied = true;
            break;
          case 2:
            conditionals_for_primary_bene_2_satisfied = true;
            $('.add_next_primary_bene').show(500);
            break;
          case 3:
            conditionals_for_primary_bene_3_satisfied = true;
            $('.add_next_primary_bene').show(500);
            break;
          case 4:
            conditionals_for_primary_bene_4_satisfied = true;
            $('.add_next_primary_bene').show(500);
            break;
          case 5:
            conditionals_for_primary_bene_5_satisfied = true;
            $('.add_next_primary_bene').show(500);
            break;
          default:
            break;
        }
        submitButtonCheck();
      }

      $('#remove_bene_1').click(function (e) {
        e.preventDefault();
        removePrimaryBene(1);
      });
      $('#remove_bene_2').click(function (e) {
        e.preventDefault();
        removePrimaryBene(2);
      });
      $('#remove_bene_3').click(function (e) {
        e.preventDefault();
        removePrimaryBene(3);
      });
      $('#remove_bene_4').click(function (e) {
        e.preventDefault();
        removePrimaryBene(4);
      });
      $('#remove_bene_5').click(function (e) {
        e.preventDefault();
        removePrimaryBene(5);
      });

      $('#add-next-primary-bene-button').click(function (e) {
        switch (primary_bene_ct) {
          case 0:
            $('#additional_primary_bene_1').show(500, function () {
              $('#bene_1_first_name').focus();
            });
            primary_bene_ct = 1;
            break;
          case 1:
            $('#additional_primary_bene_2').show(500, function () {
              $('#bene_2_first_name').focus();
            });
            primary_bene_ct = 2;
            break;
          case 2:
            $('#additional_primary_bene_3').show(500, function () {
              $('#bene_3_first_name').focus();
            });
            primary_bene_ct = 3;
            break;
          case 3:
            $('#additional_primary_bene_4').show(500, function () {
              $('#bene_4_first_name').focus();
            });
            primary_bene_ct = 4;
            break;
          case 4:
            $('#additional_primary_bene_5').show(500, function () {
              $('#bene_5_first_name').focus();
            });
            primary_bene_ct = 5;
            $('.add_next_primary_bene').hide(500);
            break;
          default:
            primary_bene_ct = '';
            break;
        }
        conditionals_for_primary_bene_satisfied = false;
        submitButtonCheck();
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

      $bene_1_first_name.on('input.True', function () {
        if (this.value.length == 0) {
          // First Name was likely cleared out and deleted, so show the 'Field is required' error message
          $('#error-bene-1-first-name-required').show(500);
          $bene_1_first_name.css('border-color', error_color);
        } else {
          // if there is at least one character input into this field, clear the error message
          $('#error-bene-1-first-name-required').hide(500);
          $bene_1_first_name.css('border-color', no_error_color);
        }
        submitButtonCheck();
      });

      $bene_1_first_name.on('focusout', function () {
        if ($bene_1_first_name.val().length == 0) {
          // if the first name field is blank, throw up an error message that this field is required
          $('#error-bene-1-first-name-required').show(500);
          $bene_1_first_name.css('border-color', error_color);
        } else {
          // Under this condition the user has filled in first name, so get rid of all error messages
          $('#error-bene-1-first-name-required').hide(500);
          $bene_1_first_name.css('border-color', no_error_color);
        }
        submitButtonCheck();
      });

      $bene_1_last_name.on('input.True', function () {
        if (this.value.length == 0) {
          // Last Name was likely cleared out and deleted, so show the 'Field is required' error message
          $('#error-bene-1-last-name-required').show(500);
          $bene_1_last_name.css('border-color', error_color);
        } else {
          // if there is at least one character input into this field, clear the error message
          $('#error-bene-1-last-name-required').hide(500);
          $bene_1_last_name.css('border-color', no_error_color);
        }
        submitButtonCheck();
      });

      $bene_1_last_name.on('focusout', function () {
        if ($bene_1_last_name.val().length == 0) {
          // if the last name field is blank, throw up an error message that this field is required
          $('#error-bene-1-last-name-required').show(500);
          $bene_1_last_name.css('border-color', error_color);
        } else {
          // Under this condition the user has filled in last name, so get rid of all error messages
          $('#error-bene-1-last-name-required').hide(500);
          $bene_1_last_name.css('border-color', no_error_color);
        }
        submitButtonCheck();
      });

      $bene_1_dob.on('input.True', function () {
        if ($(this).val().length == 0) {
          // DOB was likely cleared out and deleted, so show the 'Field is required' error message
          $('#error-bene-1-dob-not-valid').hide(500);
          $('#error-bene-1-dob-required').show(500);
          $bene_1_dob.css('border-color', error_color);
        } else {
          // if there is at least one character input into this field, clear the error message
          $('#error-bene-1-dob-not-valid').hide(500);
          $('#error-bene-1-dob-required').hide(500);
          $bene_1_dob.css('border-color', no_error_color);
        }
        submitButtonCheck();
      });

      $bene_1_dob.on('focusout', function () {
        const dob = $bene_1_dob.val().trim();
        const isValidDate =
          /^(0[1-9]|1[0-2])\/(0[1-9]|[12]\d|3[01])\/\d{4}$/.test(dob);
        const dateParts = dob.split('/');
        const dobDate = new Date(
          `${dateParts[2]}-${dateParts[0]}-${dateParts[1]}`
        );
        const isLogicalDate = dobDate instanceof Date && !isNaN(dobDate);
        const isFutureDate = dobDate > new Date();

        // if the DOB field is empty, throw up an error message that it is required
        if ($bene_1_dob.val().length == 0) {
          $('#error-bene-1-dob-not-valid').hide(500);
          $('#error-bene-1-dob-required').show(500);
          $bene_1_dob.css('border-color', error_color);
        } else if (!isValidDate || !isLogicalDate || isFutureDate) {
          // if the DOB field is not a valid date, throw up an error message that it is invalid
          $('#error-bene-1-dob-not-valid').show(500);
          $('#error-bene-1-dob-required').hide(500);
          $bene_1_dob.css('border-color', error_color);
        } else {
          // Under this condition we got a good DOB, so get rid of all error messages
          $('#error-bene-1-dob-not-valid').hide(500);
          $('#error-bene-1-dob-required').hide(500);
          $bene_1_dob.css('border-color', no_error_color);
        }
        submitButtonCheck();
      });

      $bene_1_phone_number.on('input.True', function () {
        //  Logic to strip country codes (+1) on paste/autofill
        const cleaned = this.value.replace(/\D/g, '');
        if (cleaned.length === 11 && cleaned.startsWith('1')) {
          $(this).val(cleaned.slice(1)).trigger('input');
        }

        if ($(this).val().length == 0) {
          // Phone number was likely cleared out and deleted, so show the 'Field is required' error message
          $('#error-bene-1-phone-required').show(500);
          $bene_1_phone_number.css('border-color', error_color);
        } else {
          // if there is at least one character input into this field, clear the error message
          $('#error-bene-1-phone-required').hide(500);
          $bene_1_phone_number.css('border-color', no_error_color);
        }
        submitButtonCheck();
      });

      $bene_1_phone_number.on('focusout', function () {
        if ($bene_1_phone_number.val().length < 14) {
          // if the phone number field is not full with a 10 digit number (plus the mask which provides parenthese
          // around areas code and hyphen after exhange), throw up an error message that this field is required
          $('#error-bene-1-phone-required').show(500);
          $bene_1_phone_number.css('border-color', error_color);
        } else {
          // Under this condition we got a good phone number, so get rid of all error messages
          $('#error-bene-1-phone-required').hide(500);
          $bene_1_phone_number.css('border-color', no_error_color);
        }
        submitButtonCheck();
      });

      $bene_1_address.on('input.True', function () {
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
          $('#error-bene-1-address-not-valid').hide(500);
          $('#error-bene-1-address-required').show(500);
          $bene_1_address.css('border-color', error_color);
        }
        submitButtonCheck();
      });

      $bene_1_address.on('focusout', function () {
        if ($bene_1_address.val().length == 0) {
          // Blank field
          $('#error-bene-1-address-not-valid').hide(500);
          $('#error-bene-1-address-required').show(500);
          $bene_1_address.css('border-color', error_color);
        } else if (formattedAddress == '') {
          // User typed but DID NOT select a suggestion → show "Select from suggestions" error
          $('#error-bene-1-address-required').hide(500);
          $('#error-bene-1-address-not-valid').show(500);
          $bene_1_address.css('border-color', error_color);
        } else if (
          formattedAddress != '' &&
          address_line1 != '' &&
          city != '' &&
          state != '' &&
          postalCode != ''
        ) {
          // Valid address
          $('#error-bene-1-address-not-valid').hide(500);
          $('#error-bene-1-address-required').hide(500);
          $bene_1_address.css('border-color', no_error_color);
        } else if (
          formattedAddress != '' &&
          (address_line1 != '' || city != '' || state != '' || postalCode != '')
        ) {
          // Incomplete Google address
          $('#error-bene-1-address-required').hide(500);
          $('#error-bene-1-address-not-valid').show(500);
          $bene_1_address.css('border-color', error_color);
        }
        submitButtonCheck();
      });

      $bene_1_relationship.on('change', function () {
        if ($(this).val() == '') {
          // Relationship of Beneficiary to Insured was likely reset, so show the 'Field is required' error message
          $('#error-bene-1-relationship-required').show(500);
          $bene_1_relationship.css('border-color', error_color);
        } else {
          // if there is something selected in this field, clear the error message
          $('#error-bene-1-relationship-required').hide(500);
          $bene_1_relationship.css('border-color', no_error_color);
        }
        submitButtonCheck();
      });

      $bene_1_relationship.on('focusout', function () {
        if ($bene_1_relationship.val() == '') {
          // if Relationship of Beneficiary to Insured is empty, throw up an error message that this field is required
          $('#error-bene-1-relationship-required').show(500);
          $bene_1_relationship.css('border-color', error_color);
        } else {
          // Under this condition we got a selection, so get rid of all error messages
          $('#error-bene-1-relationship-required').hide(500);
          $bene_1_relationship.css('border-color', no_error_color);
        }
        submitButtonCheck();
      });

      $bene_1_allocation_percentage.on('change', function () {
        if (this.value.length == 0) {
          // Beneficiary Allocation Percentage was likely reset, so show the 'Field is required' error message
          $('#error-bene-1-allocation-required').show(500);
          $bene_1_allocation_percentage.css('border-color', error_color);
        } else {
          // if there is something selected in this field, clear the error message
          $('#error-bene-1-allocation-required').hide(500);
          $bene_1_allocation_percentage.css('border-color', no_error_color);
        }
        submitButtonCheck();
      });

      $bene_1_allocation_percentage.on('focusout', function () {
        if ($bene_1_allocation_percentage.val().length == 0) {
          // if the beneficiary allocation percentage field is blank, throw up an error message that this field is required
          $('#error-bene-1-allocation-required').show(500);
          $bene_1_allocation_percentage.css('border-color', error_color);
        } else {
          // Under this condition the user has filled in net worth, so get rid of all error messages
          $('#error-bene-1-allocation-required').hide(500);
          $bene_1_allocation_percentage.css('border-color', no_error_color);
        }
      });

      $primary_bene.on('change', function () {
        var primary_bene_selected = $("input[name='PrimaryBene']:checked").val();
        if (primary_bene_selected != null) {
          if (primary_bene_selected == 'Yes') {
            if (!conditionals_for_primary_bene_satisfied) {
              $('#error-primary-bene-required').hide(500);
              $('#error-primary-bene-all-fields-required').show(500);
              $primary_bene.css('border-color', error_color);
            } else if (conditionals_for_primary_bene_satisfied) {
              $('#error-primary-bene-required').hide(500);
              $('#error-primary-bene-all-fields-required').hide(500);
              $primary_bene.css('border-color', no_error_color);
            }
          } else if (primary_bene_selected == 'No') {
            $('#error-primary-bene-required').hide(500);
            $('#error-primary-bene-all-fields-required').hide(500);
            $primary_bene.css('border-color', no_error_color);
          }
        } else {
          $('#error-primary-bene-all-fields-required').hide(500);
          $('#error-primary-bene-required').show(500);
          $primary_bene.css('border-color', error_color);
        }
      });

      $primary_bene.on('focusout', function () {
        var primary_bene_selected = $(
          "input[name='PrimaryBene']:checked"
        ).val();
        if (primary_bene_selected != null) {
          if (primary_bene_selected == 'Yes') {
            if (!conditionals_for_primary_bene_satisfied) {
              $('#error-primary-bene-required').hide(500);
              $('#error-primary-bene-all-fields-required').show(500);
              $primary_bene.css('border-color', error_color);
            } else if (conditionals_for_primary_bene_satisfied) {
              $('#error-primary-bene-required').hide(500);
              $('#error-primary-bene-all-fields-required').hide(500);
              $primary_bene.css('border-color', no_error_color);
            }
          } else if (primary_bene_selected == 'No') {
            $('#error-primary-bene-required').hide(500);
            $('#error-primary-bene-all-fields-required').hide(500);
            $primary_bene.css('border-color', no_error_color);
          }
        } else {
          $('#error-primary-bene-all-fields-required').hide(500);
          $('#error-primary-bene-required').show(500);
          $primary_bene.css('border-color', error_color);
        }
      });

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

        const primaryBeneficiaries = getQueryParameter('primary_bene');
        const primaryBeneficiariesDetails = getQueryParameter(
          'primary_bene_details'
        );

        // Populate the fields on the page
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

        if (primaryBeneficiaries) {
          if (primaryBeneficiaries == 'Yes') {
            $("input[name='PrimaryBene'][value='No']").prop('checked', false);
            $("input[name='PrimaryBene'][value='No']")
              .prev('.w-radio-input')
              .removeClass('w--redirected-checked');
            $("input[name='PrimaryBene'][value='Yes']").prop('checked', true);
            $("input[name='PrimaryBene'][value='Yes']")
              .prev('.w-radio-input')
              .addClass('w--redirected-checked');
          }
          if (primaryBeneficiaries == 'No') {
            $("input[name='PrimaryBene'][value='Yes']").prop('checked', false);
            $("input[name='PrimaryBene'][value='Yes']")
              .prev('.w-radio-input')
              .removeClass('w--redirected-checked');
            $("input[name='PrimaryBene'][value='No']").prop('checked', true);
            $("input[name='PrimaryBene'][value='No']")
              .prev('.w-radio-input')
              .addClass('w--redirected-checked');
            primary_bene_ct = 0;
            conditionals_for_primary_bene_satisfied = true;
          }
        }

        // Split the Primary Beneficiaries Details string into key-value pairs
        const pairs = primaryBeneficiariesDetails.split(';');

        // Parse into a dictionary
        const parsedData = {};
        pairs.forEach(pair => {
          if (pair.includes('=')) {
            const [key, value] = pair.split('=');
            if (value) {
              // Inspect the last field on a named beneficiary and see if its entered or not. If it is, then setup what is visible based on the number of the beneficiary
              const match = key.match(/^bene_(\d+)_allocation_percentage$/);

              if (match) {
                const beneNumber = parseInt(match[1], 10); // Extract the number from the key and ensure it is an integer
                if (!isNaN(beneNumber)) {
                  // Double-check it's a valid number
                  $('#additional_primary_bene_' + beneNumber).show(500);
                  $('.add_next_primary_bene').show(500);
                  primary_bene_ct = beneNumber;
                } else {
                  console.error(
                    'Invalid primary beneficiary number extracted from key:',
                    match[1]
                  );
                }
              } else {
                $('#' + key).val(value);
                $('#' + key + '_label').addClass('float');
              }
            }
          }
        });

        submitButtonCheck();
      } else {
        console.log('No query parameters found in the URL.');
      }
    });
  })(jQuery, window, document);
});
