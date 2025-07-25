// Globally defined variables
var storage = window.localStorage,
  className = 'submit_button_active',
  $submit = $('input[type="submit"]'),
  error_color = '#AC0036',
  no_error_color = '', // simply resets default css behavior defined in webflow console, rather than hard coding it

  //  Fields entered (and submitted) on page 1 of the application
  $first_name = $('#app_first_name'),
  $last_name = $('#app_last_name'),
  $home_address = $('#app_home_address'),
  $email_address = $('#app_email_address'),
  $phone_number = $('#app_phone_number'),
  //  Fields for beneficiary page of the application
  $primary_bene = $('#primary_bene');

// Variables to track what has been filled in
var primary_bene_ct = 0,
  contingent_bene_ct = 0,
  conditionals_for_primary_bene_1_satisfied,
  conditionals_for_primary_bene_2_satisfied,
  conditionals_for_primary_bene_3_satisfied,
  conditionals_for_primary_bene_4_satisfied,
  conditionals_for_primary_bene_5_satisfied,
  conditionals_for_primary_bene_satisfied,
  allocationTotalComplete = true;

let addressSelectedWithMouse = false;

const beneficiaryAddresses = {
  1: {}, 2: {}, 3: {}, 4: {}, 5: {}
};

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

function toErrorKey(inputId) {
  return inputId.replace(/_/g, '-');
}
function showOnlyErrorForField(inputId, errorIdToShow = null) {
  const errorKey = toErrorKey(inputId); // Normalize to match error ID format
  $(`[id^='error-${errorKey}-']`).each(function () {
    const $el = $(this);
    if (errorIdToShow && $el.attr('id') === errorIdToShow) {
      showError($el);
    } else {
      hideError($el);
    }
  });
}

function setupFloatingLabelForAddress(beneNum) {
  const input = document.getElementById(`bene_${beneNum}_address`);
  const label = document.getElementById(`bene_${beneNum}_address_label`);
  if (!input || !label) return;

  input.addEventListener('focus', () => {
    label.classList.add('float');
  });

  input.addEventListener('input', () => {
    if (input.value.trim() !== '') {
      label.classList.add('float');
    } else {
      label.classList.remove('float');
    }
  });

  // Float label on load if there's already a value
  if (input.value.trim() !== '') {
    label.classList.add('float');
  }
}

function setupAddressAutocomplete(beneNum) {
  const input = document.getElementById(`bene_${beneNum}_address`);
  if (!input) return;

  const autocomplete = new google.maps.places.Autocomplete(input, {
    types: ['address'], // restricts to real street addresses (not businesses, places of interest, or intersections)
    fields: ['address_components', 'formatted_address'],
    componentRestrictions: { country: ['us'] },
  });

  autocomplete.addListener('place_changed', () => {
    const place = autocomplete.getPlace();
    console.log('Autocomplete place object returned from Google Places API', place);

    let formattedAddress = '';
    let street_number = '';
    let street = '';
    let address_line1 = '';
    let address_line2 = '';
    let city = '';
    let state = '';
    let postalCode = '';

    if (place && place.formatted_address) {
      formattedAddress = place.formatted_address;
      $(`#bene_${beneNum}_formatted_address`).val(formattedAddress);
      //storage.setItem(`bene_${beneNum}_formatted_address`, formattedAddress);
    }

    if (place && place.address_components) {
      for (const component of place.address_components) {
        const types = component.types;

        if (types.includes('street_number')) street_number = component.long_name;
        if (types.includes('route')) street = component.long_name;
        if (types.includes('subpremise')) address_line2 = component.long_name;
        if (types.includes('locality')) city = component.long_name;
        if (types.includes('administrative_area_level_1')) state = component.short_name;
        if (types.includes('postal_code')) postalCode = component.long_name;
      }

      if (street_number && street) {
        address_line1 = `${street_number} ${street}`;
      }

      // Update fields and storage
      $(`#bene_${beneNum}_street_number`).val(street_number);
      $(`#bene_${beneNum}_street`).val(street);
      $(`#bene_${beneNum}_address_line1`).val(address_line1);
      $(`#bene_${beneNum}_address_line2`).val(address_line2);
      $(`#bene_${beneNum}_city`).val(city);
      $(`#bene_${beneNum}_state`).val(state);
      $(`#bene_${beneNum}_zip`).val(postalCode);

      /*
      storage.setItem(`bene_${beneNum}_street_number`, street_number);
      storage.setItem(`bene_${beneNum}_street`, street);
      storage.setItem(`bene_${beneNum}_address_line1`, address_line1);
      storage.setItem(`bene_${beneNum}_address_line2`, address_line2);
      storage.setItem(`bene_${beneNum}_city`, city);
      storage.setItem(`bene_${beneNum}_state`, state);
      storage.setItem(`bene_${beneNum}_zip`, postalCode);
      */
    }

    // Address Validation Logic
    const $addressInput = $(`#bene_${beneNum}_address`);
    const errorBase = `#error-bene-${beneNum}`;

    if (formattedAddress && address_line1 && city && state && postalCode) {
      hideError($(`${errorBase}-address-not-valid`));
      hideError($(`${errorBase}-address-required`));
      $addressInput.css('border-color', no_error_color);
    } else if (
      formattedAddress &&
      (address_line1 || city || state || postalCode)
    ) {
      hideError($(`${errorBase}-address-required`));
      showError($(`${errorBase}-address-not-valid`));
      $addressInput.css('border-color', error_color);
    }

    submitButtonCheck();

    // Return focus to the address field after mouse selection
    setTimeout(() => {
      const active = document.activeElement;
      if (
        addressSelectedWithMouse &&
        (!active || active.id === `bene_${beneNum}_address` || active.tagName === 'BODY')
      ) {
        $addressInput.focus();
      }
      addressSelectedWithMouse = false;
    }, 100);
  });

  // Track mouse click to distinguish from keyboard entry
  document.addEventListener('mousedown', function (event) {
    if (
      event.target.classList.contains('pac-item') ||
      event.target.closest('.pac-item')
    ) {
      addressSelectedWithMouse = true;
    }
  });
}

function initAllAutocomplete() {
  for (let i = 1; i <= 5; i++) {
    setupAddressAutocomplete(i);
  }
}
window.initAllAutocomplete = initAllAutocomplete;

function submitButtonCheck() {
  checkPrimaryBeneDetails();
  if (conditionals_for_primary_bene_satisfied && allocationTotalComplete) {
    document.getElementById('submit_button').disabled = false;
    $submit.toggleClass(className, true);
  } else {
    if (conditionals_for_primary_bene_satisfied && !allocationTotalComplete) { // if all fields are filled, but the total allocation is not = 100, show error message
      showError($('#error-primary-bene-allocation-calc'));
      hideError($('#error-primary-bene-required'));
      hideError($('#error-primary-bene-all-fields-required'));
    }
    document.getElementById('submit_button').disabled = true;
    $submit.toggleClass(className, false);
  }
}

function checkPrimaryBeneDetails() {
  var primary_bene_selected = $("input[name='PrimaryBene']:checked").val();

  if (primary_bene_selected == 'Person') {
    for (let x = 1; x < primary_bene_ct + 1; x++) {
			// Extract the value, strip %, parse to number
			const allocation = parseInt($('#bene_' + x + '_allocation').val().replace('%', ''), 10);

      if (
        $('#bene_' + x + '_first_name').val() != '' &&
        $('#bene_' + x + '_last_name').val() != '' &&
        isValidDOB($('#bene_' + x + '_dob').val()) &&
        $('#bene_' + x + '_phone').val().length == 14 &&
        $('#bene_' + x + '_address').val() != '' &&
        $('#bene_' + x + '_formatted_address').val() != '' &&
        $('#bene_' + x + '_relationship').val() != '' &&
			  !isNaN(allocation) && allocation >= 1 && allocation <= 100
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

		// Check that all required fields are satisfied for all beneficiaries that have been added
		let allPrimaryBeneSatisfied = true;

		for (let i = 1; i <= primary_bene_ct; i++) {
		  if (window['conditionals_for_primary_bene_' + i + '_satisfied'] === false) {
		    allPrimaryBeneSatisfied = false;
		    break;
		  }
		}
		if (!allPrimaryBeneSatisfied) {
		  conditionals_for_primary_bene_satisfied = false;
      hideError($('#error-primary-bene-required'));
      showError($('#error-primary-bene-all-fields-required'));
      hideError($('#error-primary-bene-allocation-calc'));
		  $primary_bene.css('border-color', error_color);
		} else {
		  conditionals_for_primary_bene_satisfied = true;
      hideError($('#error-primary-bene-required'));
      hideError($('#error-primary-bene-all-fields-required'));
		  $primary_bene.css('border-color', no_error_color);
		}
  }
}

function isValidDOB(dobStr) {
  const value = dobStr.trim();
  const isValidFormat = /^(0[1-9]|1[0-2])\/(0[1-9]|[12]\d|3[01])\/\d{4}$/.test(value);

  if (!isValidFormat) return false;

  const [mm, dd, yyyy] = value.split('/');
  const parsedDate = new Date(`${yyyy}-${mm}-${dd}`);

  const isLogicalDate = parsedDate instanceof Date && !isNaN(parsedDate);
  const isFutureDate = parsedDate > new Date();

  return isLogicalDate && !isFutureDate;
}

function validateTotalAllocation() {
  let total = 0;
  let allFieldsValid = true;

  for (let i = 1; i <= 5; i++) {
    const row = $(`#additional_primary_bene_${i}`);
    if (!row.is(':visible')) continue;

    const first = $(`#bene_${i}_first_name`).val().trim();
    const last = $(`#bene_${i}_last_name`).val().trim();
    const dob = $(`#bene_${i}_dob`).val();
    const phone = $(`#bene_${i}_phone`).val().trim();
    const address = $(`#bene_${i}_formatted_address`).val().trim();
    const relation = $(`#bene_${i}_relationship`).val().trim();

    const allocRaw = $(`#bene_${i}_allocation`).val().replace(/\D/g, '');
    const alloc = parseInt(allocRaw, 10) || 0;

    // Validate that all required fields are present and allocation is within range
    if (!first || !last || !isValidDOB(dob) || !phone || !address || !relation || alloc <= 0 || alloc > 100) {
      allFieldsValid = false;
    }

    total += alloc;
  }

  if (!allFieldsValid) {
    hideError($('#error-primary-bene-allocation-calc')); // Prevent premature error
    //  return true;
  }

  // Check if all beneficiaries have been cleared/removed. If they have, no need to check the total and put up error message
  if ($("input[name='PrimaryBene']:checked").val() != 'Person') {
    hideError($('#error-primary-bene-allocation-calc'));
  } else if ($("input[name='PrimaryBene']:checked").val() == 'Person') {
    if (total !== 100) {
      showError($('#error-primary-bene-allocation-calc'));
      hideError($('#error-primary-bene-required'));
      hideError($('#error-primary-bene-all-fields-required'));
      allocationTotalComplete = false;
      return false;
    } else {
      hideError($('#error-primary-bene-allocation-calc'));
      allocationTotalComplete = true;
      return true;
    }
  }
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

// Call the function to get information about the user's device and format the result, 
// and save it into a hidden field that will be included on submit of the form
const deviceInfo = getUserDeviceInfo();
const formattedInfo = `
 ${deviceInfo.deviceType} |
 ${deviceInfo.operatingSystem} |
 ${deviceInfo.browserName} |
 ${deviceInfo.viewportWidth}px
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

        // If the URL has the saved_app query params and the user has already completed 5 steps, then reset the submitButton href
        // to take user back to the saved applications page, instead of onto app page 5 as if they were in normal flow
        if (savedApp && !isNaN(step) && step > 5) {
          location.href = '/saved-applications/' + savedApp;
        }
      }
    })
  });

  for (let i = 1; i <= 5; i++) {
    setupFloatingLabelForAddress(i);
    setupAddressValidation(i);
  }

  for (let i = 1; i <= 5; i++) {
    let $firstName = $(`#bene_${i}_first_name`);
    let $error = $(`#error-bene-${i}-first-name-required`);

    $firstName.on('input', function () {
      if (this.value.length === 0) {
        // First Name was likely cleared out and deleted, so show the 'Field is required' error message
				showError($error);
        $firstName.css('border-color', error_color);
      } else {
        // if there is at least one character input into this field, clear the error message
				hideError($error);
        $firstName.css('border-color', no_error_color);
      }
      submitButtonCheck();
    });

    $firstName.on('focusout', function () {
      if (this.value.length === 0) {
        // if the first name field is blank, throw up an error message that this field is required
				showError($error);
        $firstName.css('border-color', error_color);
      } else {
        // Under this condition the user has filled in first name, so get rid of all error messages
				hideError($error);
        $firstName.css('border-color', no_error_color);
      }
      submitButtonCheck();
    });
  }

  for (let i = 1; i <= 5; i++) {
    let $lastName = $(`#bene_${i}_last_name`);
    let $error = $(`#error-bene-${i}-last-name-required`);

    $lastName.on('input', function () {
      if (this.value.length === 0) {
        // Last Name was likely cleared out and deleted, so show the 'Field is required' error message
				showError($error);
        $lastName.css('border-color', error_color);
      } else {
        // if there is at least one character input into this field, clear the error message
				hideError($error);
        $lastName.css('border-color', no_error_color);
      }
      submitButtonCheck();
    });

    $lastName.on('focusout', function () {
      if (this.value.length === 0) {
        // if the last name field is blank, throw up an error message that this field is required
				showError($error);
        $lastName.css('border-color', error_color);
      } else {
        // Under this condition the user has filled in last name, so get rid of all error messages
				hideError($error);
        $lastName.css('border-color', no_error_color);
      }
      submitButtonCheck();
    });
  }

  for (let i = 1; i <= 5; i++) {
    const $dob = $(`#bene_${i}_dob`);
    const $requiredError = $(`#error-bene-${i}-dob-required`);
    const $notValidError = $(`#error-bene-${i}-dob-not-valid`);

    $dob.on('input', function () {
      const value = $(this).val().trim();

      if (value.length === 0) {
        // DOB was likely cleared out and deleted, so show the 'Field is required' error message
        hideError($notValidError);
        showError($requiredError);
        $dob.css('border-color', error_color);
      } else {
        // if there is at least one character input into this field, clear the error message
        hideError($notValidError);
        hideError($requiredError);
        $dob.css('border-color', no_error_color);
      }
      submitButtonCheck();
    });

    $dob.on('focusout', function () {
      const value = $(this).val().trim();

      // if the DOB field is empty, throw up an error message that it is required
      if (value.length === 0) {
        hideError($notValidError);
        showError($requiredError);
        $dob.css('border-color', error_color);
      } else if (!isValidDOB(value)) {
        // if the DOB field is not a valid date, throw up an error message that it is invalid
        showError($notValidError);
        hideError($requiredError);
        $dob.css('border-color', error_color);
      } else {
        // Under this condition we got a good DOB, so get rid of all error messages
        hideError($notValidError);
        hideError($requiredError);
        $dob.css('border-color', no_error_color);
      }
      submitButtonCheck();
    });
  }

  for (let i = 1; i <= 5; i++) {
    const $phone = $(`#bene_${i}_phone`);
    const $error = $(`#error-bene-${i}-phone-required`);

    $phone.on('input', function () {
      // Strip country code (+1) if user pastes or autofills with 11-digit number
      const cleaned = this.value.replace(/\D/g, '');

      if (cleaned.length === 11 && cleaned.startsWith('1')) {
        const newVal = cleaned.slice(1);
        if ($(this).val() !== newVal) {
          $(this).val(newVal);
        }
      }

      if ($(this).val().length === 0) {
        // Phone number was likely cleared out and deleted, so show the 'Field is required' error message
				showError($error);
        $phone.css('border-color', error_color);
      } else {
        // if there is at least one character input into this field, clear the error message
				hideError($error);
        $phone.css('border-color', no_error_color);
      }

      submitButtonCheck();
    });

    $phone.on('focusout', function () {
      if ($(this).val().length < 14) {
        // if the phone number field is not full with a 10 digit number (plus the mask which provides parenthese
        // around areas code and hyphen after exhange), throw up an error message that this field is required
				showError($error);
        $phone.css('border-color', error_color);
      } else {
        // Under this condition we got a good phone number, so get rid of all error messages
				hideError($error);
        $phone.css('border-color', no_error_color);
      }

      submitButtonCheck();
    });
  }

  for (let i = 1; i <= 5; i++) {
    const $address = $(`#bene_${i}_address`);
    const $errorRequired = $(`#error-bene-${i}-address-required`);
    const $errorInvalid = $(`#error-bene-${i}-address-not-valid`);

    $address.on('input', function () {
      if ($(this).val().length === 0) {
        // Clear this beneficiary's scoped address parts
        beneficiaryAddresses[i] = {
          formattedAddress: '',
          street_number: '',
          street: '',
          address_line1: '',
          address_line2: '',
          city: '',
          state: '',
          postalCode: ''
        };

        hideError($errorInvalid);
        showError($errorRequired);
        $address.css('border-color', error_color);
      }
      submitButtonCheck();
    });
  }

  for (let i = 1; i <= 5; i++) {
    const $relationship = $(`#bene_${i}_relationship`);
    const $errorRequired = $(`#error-bene-${i}-relationship-required`);

    $relationship.on('change', function () {
      if ($(this).val() === '') {
        // Relationship of Beneficiary to Insured was likely reset, so show the 'Field is required' error message
				showError($errorRequired);
        $relationship.css('border-color', error_color);
      } else {
        // if there is something selected in this field, clear the error message
				hideError($errorRequired);
        $relationship.css('border-color', no_error_color);
      }
      submitButtonCheck();
    });

    $relationship.on('focusout', function () {
      if ($relationship.val() === '') {
        // if Relationship of Beneficiary to Insured is empty, throw up an error message that this field is required
				showError($errorRequired);
        $relationship.css('border-color', error_color);
      } else {
        // Under this condition we got a selection, so get rid of all error messages
				hideError($errorRequired);
        $relationship.css('border-color', no_error_color);
      }
      submitButtonCheck();
    });
  }

  for (let i = 1; i <= 5; i++) {
    const $allocation = $(`#bene_${i}_allocation`);
    const $errorRequired = $(`#error-bene-${i}-allocation-required`);
    const $errorInvalid = $(`#error-bene-${i}-allocation-valid-value`);

    $allocation.on('change', function () {
      if (this.value.length === 0) {
        // Beneficiary Allocation was likely reset, so show the 'Field is required' error message
				hideError($errorInvalid);
				showError($errorRequired);
        $allocation.css('border-color', error_color);
      } else {
        // if there is something selected in this field, clear the error message
				hideError($errorRequired);
        $allocation.css('border-color', no_error_color);
      }
      submitButtonCheck();
    });

    $allocation.on('focusout', function () {
      if ($allocation.val().length === 0) {
        // if the beneficiary allocation field is blank, throw up an error message that this field is required
				showError($errorRequired);
        $allocation.css('border-color', error_color);
      } else {
        // Under this condition the user has filled in allocation, so get rid of all error messages
				hideError($errorRequired);
        $allocation.css('border-color', no_error_color);
      }
    });
  }
});

function setupAddressValidation(beneNum) {
  const $address = $(`#bene_${beneNum}_address`);
  const errorBase = `#error-bene-${beneNum}`;

  $address.on('focusout', function () {
    const formattedAddress = $(`#bene_${beneNum}_formatted_address`).val();
    const addressLine1 = $(`#bene_${beneNum}_address_line1`).val();
    const city = $(`#bene_${beneNum}_city`).val();
    const state = $(`#bene_${beneNum}_state`).val();
    const zip = $(`#bene_${beneNum}_zip`).val();

    if ($address.val().trim().length === 0) {
			hideError($(`${errorBase}-address-not-valid`));
			showError($(`${errorBase}-address-required`));

      $address.css('border-color', error_color);
    } else if (!formattedAddress) {
			hideError($(`${errorBase}-address-required`));
			showError($(`${errorBase}-address-not-valid`));
      $address.css('border-color', error_color);
    } else if (formattedAddress && addressLine1 && city && state && zip) {
			hideError($(`${errorBase}-address-not-valid`));
			hideError($(`${errorBase}-address-required`));
      $address.css('border-color', no_error_color);
    } else {
			hideError($(`${errorBase}-address-required`));
			showError($(`${errorBase}-address-not-valid`));
      $address.css('border-color', error_color);
    }
    submitButtonCheck();
  });
}

function validateDOB(dob) {
  if (!dob) return false;

  const parsedDate = Date.parse(dob);
  if (isNaN(parsedDate)) return false;

  const dobDate = new Date(parsedDate);
  const today = new Date();

  let age = today.getFullYear() - dobDate.getFullYear();
  const m = today.getMonth() - dobDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < dobDate.getDate())) {
    age--;
  }

  return age >= 0 && age <= 120;
}

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

      $('.address').attr('autocomplete', 'off');

      $('.phone-number').on('input.True', function () {
        if ($(this).val().length > 14) {
          $(this).val($(this).val().slice(0, 14));
        }
      });

      // Loop through all allocation inputs (bene_1 through bene_5)
      $('.allocation').each(function () {
        const $field = $(this);

        // Extract the beneficiary index from the input ID (e.g., bene_3_allocation → "3")
        const id = $field.attr('id');
        const match = id.match(/^bene_(\d+)_allocation$/);
        if (!match) return;

        const idx = match[1]; // e.g., "1", "2", etc.

        // Cache the corresponding error message elements for this beneficiary
        const $errorRequired = $(`#error-bene-${idx}-allocation-required`);
        const $errorInvalid = $(`#error-bene-${idx}-allocation-valid-value`);

        // Apply input mask so users can only enter up to 3 digits followed by '%'
        $field.mask('000%', { reverse: true });

        function handlePercentageInput() {
          let raw = $field.val().replace(/\D/g, '');

          // Always trim to 3 digits
          if (raw.length > 3) {
            raw = raw.slice(0, 3);
          }

          const num = parseInt(raw, 10);
          const formatted = isNaN(num) ? '' : num + '%';
          if (raw === '') {
            $field.unmask().val('');
            $field.mask('000%', { reverse: true });
            showError($errorRequired);
            hideError($errorInvalid);
            return;
          }

          if (isNaN(num) || num === 0 || num > 100) {
      			hideError($errorRequired);
      			showError($errorInvalid);
          } else {
      			hideError($errorRequired);
      			hideError($errorInvalid);
          }

          // Final enforced value, even if mask glitches
          $field.val(formatted);
          validateTotalAllocation();
          submitButtonCheck();
        }

        // Trigger on input normally
        $field.on('input', handlePercentageInput);

        // ALSO trigger on backspace (and possibly delete)
        $field.on('keydown', function (e) {
          if (e.key === 'Backspace' || e.key === 'Delete') {
            requestAnimationFrame(() => {
              handlePercentageInput();
            });
          }
        });

        // Reapply the mask when the field gains focus (in case user cleared it)
        $field.on('focus', function () {
          if (!$field.val().includes('%')) {
            $field.mask('000%', { reverse: true });
          }
        });

        // Custom backspace behavior to allow clearing the field cleanly
        $field.on('keydown', function (e) {
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
      });

      $("input[name='PrimaryBene']").click(function (e) {
        var preimary_bene_selected = $("input[name='PrimaryBene']:checked").val();
        if (preimary_bene_selected == 'Person') {
          $('#additional_primary_bene_1').show(500);
          $('.add_next_primary_bene').show(500);
          primary_bene_ct = 1;
        } else if (preimary_bene_selected != 'Person') {
          for (let i = 1; i <= 5; i++) {
            $('#bene_' + i + '_first_name').val('');
            $('#bene_' + i + '_first_name_label').removeClass('float');
            hideError($('#error-bene-' + i + '-first-name-required'));
            $('#bene_' + i + '_first_name').css('border-color', no_error_color);

            $('#bene_' + i + '_last_name').val('');
            $('#bene_' + i + '_last_name_label').removeClass('float');
            hideError($('#error-bene-' + i + '-last-name-required'));
            $('#bene_' + i + '_last_name').css('border-color', no_error_color);

            $('#bene_' + i + '_dob').val('');
            $('#bene_' + i + '_dob_label').removeClass('float');
            hideError($('#error-bene-' + i + '-dob-required'));
            hideError($('#error-bene-' + i + '-dob-not-valid'));
            $('#bene_' + i + '_dob').css('border-color', no_error_color);

            $('#bene_' + i + '_phone').val('');
            $('#bene_' + i + '_phone_label').removeClass('float');
            hideError($('#error-bene-' + i + '-phone-required'));
            $('#bene_' + i + '_phone').css('border-color', no_error_color);

            $('#bene_' + i + '_address').val('');
            $('#bene_' + i + '_address_label').removeClass('float');
            hideError($('#error-bene-' + i + '-address-required'));
            hideError($('#error-bene-' + i + '-address-not-valid'));
            $('#bene_' + i + '_address').css('border-color', no_error_color);

            // Hidden sub fields of the address --> since these are hidden there is no floating label to manipulate
            $('#bene_' + i + '_formatted_address').val('');
            $('#bene_' + i + '_street_number').val('');
            $('#bene_' + i + '_street').val('');
            $('#bene_' + i + '_address_line1').val('');
            $('#bene_' + i + '_address_line2').val('');
            $('#bene_' + i + '_city').val('');
            $('#bene_' + i + '_state').val('');
            $('#bene_' + i + '_zip').val('');

            $('#bene_' + i + '_relationship').val('');
            $('#bene_' + i + '_relationship_label').removeClass('float');
            hideError($('#error-bene-' + i + '-relationship-required'));
            $('#bene_' + i + '_relationship').css('border-color', no_error_color);

            $('#bene_' + i + '_allocation').val('');
            $('#bene_' + i + '_allocation_label').removeClass('float');
            hideError($('#error-bene-' + i + '-allocation-required'));
            hideError($('#error-bene-' + i + '-allocation-valid-value'));
            $('#bene_' + i + '_allocation').css('border-color', no_error_color);

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

          $('#bene_' + x + '_first_name').val($('#bene_' + target_primary_beneficiary_to_move + '_first_name').val());
          $('#bene_' + x + '_last_name').val($('#bene_' + target_primary_beneficiary_to_move + '_last_name').val());
          $('#bene_' + x + '_dob').val($('#bene_' + target_primary_beneficiary_to_move + '_dob').val());
          $('#bene_' + x + '_phone').val($('#bene_' + target_primary_beneficiary_to_move + '_phone').val());
          $('#bene_' + x + '_address').val($('#bene_' + target_primary_beneficiary_to_move + '_address').val());
          $('#bene_' + x + '_formatted_address').val($('#bene_' + target_primary_beneficiary_to_move + '_formatted_address').val());
          $('#bene_' + x + '_street_number').val($('#bene_' + target_primary_beneficiary_to_move + '_street_number').val());
          $('#bene_' + x + '_street').val($('#bene_' + target_primary_beneficiary_to_move + '_street').val());
          $('#bene_' + x + '_address_line1').val($('#bene_' + target_primary_beneficiary_to_move + '_address_line1').val());
          $('#bene_' + x + '_address_line2').val($('#bene_' + target_primary_beneficiary_to_move + '_address_line2').val());
          $('#bene_' + x + '_city').val($('#bene_' + target_primary_beneficiary_to_move + '_city').val());
          $('#bene_' + x + '_state').val($('#bene_' + target_primary_beneficiary_to_move + '_state').val());
          $('#bene_' + x + '_zip').val($('#bene_' + target_primary_beneficiary_to_move + '_zip').val());
          $('#bene_' + x + '_relationship').val($('#bene_' + target_primary_beneficiary_to_move + '_relationship').val());
          $('#bene_' + x + '_allocation').val($('#bene_' + target_primary_beneficiary_to_move + '_allocation').val());

          // Clear error messages and reset border colors for beneficiary x
          const fields = ['first_name', 'last_name', 'dob', 'phone', 'address', 'relationship', 'allocation'];
          fields.forEach((field) => {
            hideError($('#error-bene-' + x + '-' + field + '-required'));
            hideError($('#error-bene-' + x + '-' + field + '-not-valid'));
            hideError($('#error-bene-' + x + '-' + field + '-valid-value'));
            $('#bene_' + x + '_' + field).css('border-color', no_error_color);
          });

          resetBeneValidation(x);
          revalidateBeneFields(x);

          $('#bene_' + target_primary_beneficiary_to_move + '_first_name').val('');
          $('#bene_' + target_primary_beneficiary_to_move + '_last_name').val('');
          $('#bene_' + target_primary_beneficiary_to_move + '_dob').val('');
          $('#bene_' + target_primary_beneficiary_to_move + '_phone').val('');
          $('#bene_' + target_primary_beneficiary_to_move + '_address').val('');
          $('#bene_' + target_primary_beneficiary_to_move + '_formatted_address').val('');
          $('#bene_' + target_primary_beneficiary_to_move + '_street_number').val('');
          $('#bene_' + target_primary_beneficiary_to_move + '_street').val('');
          $('#bene_' + target_primary_beneficiary_to_move + '_address_line1').val('');
          $('#bene_' + target_primary_beneficiary_to_move + '_address_line2').val('');
          $('#bene_' + target_primary_beneficiary_to_move + '_city').val('');
          $('#bene_' + target_primary_beneficiary_to_move + '_state').val('');
          $('#bene_' + target_primary_beneficiary_to_move + '_zip').val('');
        }

        i = primary_bene_ct;

        $('#bene_' + i + '_first_name').val('');
        $('#bene_' + i + '_first_name_label').removeClass('float');
        hideError($('#error-bene-' + i + '-first-name-required'));
        $('#bene_' + i + '_first_name').css('border-color', no_error_color);

        $('#bene_' + i + '_last_name').val('');
        $('#bene_' + i + '_last_name_label').removeClass('float');
        hideError($('#error-bene-' + i + '-last-name-required'));
        $('#bene_' + i + '_last_name').css('border-color', no_error_color);

        $('#bene_' + i + '_dob').val('');
        $('#bene_' + i + '_dob_label').removeClass('float');
        hideError($('#error-bene-' + i + '-dob-required'));
        hideError($('#error-bene-' + i + '-dob-not-valid'));
        $('#bene_' + i + '_dob').css('border-color', no_error_color);

        $('#bene_' + i + '_phone').val('');
        $('#bene_' + i + '_phone_label').removeClass('float');
        hideError($('#error-bene-' + i + '-phone-required'));
        $('#bene_' + i + '_phone').css('border-color', no_error_color);

        $('#bene_' + i + '_address').val('');
        $('#bene_' + i + '_address_label').removeClass('float');
        hideError($('#error-bene-' + i + '-address-required'));
        hideError($('#error-bene-' + i + '-address-not-valid'));
        $('#bene_' + i + '_address').css('border-color', no_error_color);

        // Hidden sub fields of the address --> since these are hidden there is no floating label to manipulate
        $('#bene_' + i + '_formatted_address').val('');
        $('#bene_' + i + '_street_number').val('');
        $('#bene_' + i + '_street').val('');
        $('#bene_' + i + '_address_line1').val('');
        $('#bene_' + i + '_address_line2').val('');
        $('#bene_' + i + '_city').val('');
        $('#bene_' + i + '_state').val('');
        $('#bene_' + i + '_zip').val('');

        $('#bene_' + i + '_relationship').val('');
        $('#bene_' + i + '_relationship_label').removeClass('float');
        hideError($('#error-bene-' + i + '-relationship-required'));
        $('#bene_' + i + '_relationship').css('border-color', no_error_color);

        $('#bene_' + i + '_allocation').val('');
        $('#bene_' + i + '_allocation_label').removeClass('float');
        hideError($('#error-bene-' + i + '-allocation-required'));
        hideError($('#error-bene-' + i + '-allocation-valid-value'));
        $('#bene_' + i + '_allocation').css('border-color', no_error_color);

        $('#additional_primary_bene_' + i).hide(500);
        primary_bene_ct = i - 1;

        switch (i) {
          case 1:
            conditionals_for_primary_bene_1_satisfied = true;
            $("input[name='PrimaryBene'][value='Person']").prop('checked', false);
            $("input[name='PrimaryBene'][value='Person']").prev('.w-radio-input').removeClass('w--redirected-checked');
            $("input[name='PrimaryBene'][value='Children']").prop('checked', false);
            $("input[name='PrimaryBene'][value='Children']").prev('.w-radio-input').removeClass('w--redirected-checked');
            $("input[name='PrimaryBene'][value='Estate']").prop('checked', true);
            $("input[name='PrimaryBene'][value='Estate']").prev('.w-radio-input').addClass('w--redirected-checked');

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
        validateTotalAllocation();
        submitButtonCheck();
      }

      function resetBeneValidation(i) {
        const fields = ['first_name', 'last_name', 'dob', 'phone', 'address', 'relationship', 'allocation'];

        fields.forEach((field) => {
          $(`#bene_${i}_${field}`).css('border-color', no_error_color);
          $(`#bene_${i}_${field}_label`).removeClass('float');

    			hideError($(`#error-bene-${i}-${field}-required`));
    			hideError($(`#error-bene-${i}-${field}-not-valid`));
    			hideError($(`#error-bene-${i}-${field}-valid-value`));
        });
      }

      function revalidateBeneFields(i) {
        // FIRST NAME
        const $first = $(`#bene_${i}_first_name`);
        const firstVal = $first.val().trim();
        if (!firstVal) {
    			showError($(`#error-bene-${i}-first-name-required`));
          $first.css('border-color', error_color);
          $(`#bene_${i}_first_name_label`).removeClass('float');
        } else {
    			hideError($(`#error-bene-${i}-first-name-required`));
          $first.css('border-color', no_error_color);
          $(`#bene_${i}_first_name_label`).addClass('float');
        }

        // LAST NAME
        const $last = $(`#bene_${i}_last_name`);
        const lastVal = $last.val().trim();
        if (!lastVal) {
    			showError($(`#error-bene-${i}-last-name-required`));
          $last.css('border-color', error_color);
          $(`#bene_${i}_last_name_label`).removeClass('float');
        } else {
    			hideError($(`#error-bene-${i}-last-name-required`));
          $last.css('border-color', no_error_color);
          $(`#bene_${i}_last_name_label`).addClass('float');
        }

        // DATE OF BIRTH
        const $dob = $(`#bene_${i}_dob`);
        const dobVal = $dob.val().trim();
        if (!dobVal) {
    			showError($(`#error-bene-${i}-dob-required`));
    			hideError($(`#error-bene-${i}-dob-not-valid`));
          $dob.css('border-color', error_color);
          $(`#bene_${i}_dob_label`).removeClass('float');
        } else if (!validateDOB(dobVal)) {
    			hideError($(`#error-bene-${i}-dob-required`));
    			showError($(`#error-bene-${i}-dob-not-valid`));
          $dob.css('border-color', error_color);
          $(`#bene_${i}_dob_label`).addClass('float');
        } else {
    			hideError($(`#error-bene-${i}-dob-required`));
    			hideError($(`#error-bene-${i}-dob-required`));
          $dob.css('border-color', no_error_color);
          $(`#bene_${i}_dob_label`).addClass('float');
        }

        // PHONE NUMBER
        const $phone = $(`#bene_${i}_phone`);
        const phoneVal = $phone.val().replace(/\D/g, '');
        if (phoneVal.length !== 10) {
    			showError($(`#error-bene-${i}-phone-required`));
          $phone.css('border-color', error_color);
          $(`#bene_${i}_phone_label`).removeClass('float');
        } else {
    			hideError($(`#error-bene-${i}-phone-required`));
          $phone.css('border-color', no_error_color);
          $(`#bene_${i}_phone_label`).addClass('float');
        }

        // ADDRESS
        const formattedAddress = $(`#bene_${i}_formatted_address`).val();
        const $address = $(`#bene_${i}_address`);
        const addressVal = $address.val().trim(); // Get what's visible in the input

        // if the address field doesn't have a validated 'formattedAddress' from Google Places API, this field will be empty & user should be shown the 'not valid' error message
        if (!formattedAddress) {
    			hideError($(`#error-bene-${i}-address-required`));
    			showError($(`#error-bene-${i}-address-not-valid`));
          $address.css('border-color', error_color);

          // Float label if there's visible text even if invalid
          if (addressVal) {
            $(`#bene_${i}_address_label`).addClass('float');
          } else {
            $(`#bene_${i}_address_label`).removeClass('float');
          }
        } else {
    			hideError($(`#error-bene-${i}-address-required`));
    			hideError($(`#error-bene-${i}-address-not-valid`));
          $address.css('border-color', no_error_color);
          $(`#bene_${i}_address_label`).addClass('float');
        }

        // RELATIONSHIP
        const $rel = $(`#bene_${i}_relationship`);
        const relVal = $rel.val().trim();
        if (!relVal) {
    			showError($(`#error-bene-${i}-relationship-required`));
          $rel.css('border-color', error_color);
          $(`#bene_${i}_relationship_label`).removeClass('float');
        } else {
    			hideError($(`#error-bene-${i}-relationship-required`));
          $rel.css('border-color', no_error_color);
          $(`#bene_${i}_relationship_label`).addClass('float');
        }

        // ALLOCATION
        const $alloc = $(`#bene_${i}_allocation`);
        const raw = $alloc.val().replace(/\D/g, '');
        const num = parseInt(raw, 10);
        if (!raw || isNaN(num)) {
    			showError($(`#error-bene-${i}-allocation-required`));
    			hideError($(`#error-bene-${i}-allocation-valid-value`));
          $alloc.css('border-color', error_color);
          $(`#bene_${i}_allocation_label`).removeClass('float');
        } else if (num < 1 || num > 100) {
    			hideError($(`#error-bene-${i}-allocation-required`));
    			showError($(`#error-bene-${i}-allocation-valid-value`));
          $alloc.css('border-color', error_color);
          $(`#bene_${i}_allocation_label`).addClass('float');
        } else {
    			hideError($(`#error-bene-${i}-allocation-required`));
    			hideError($(`#error-bene-${i}-allocation-valid-value`));
          $alloc.css('border-color', no_error_color);
          $(`#bene_${i}_allocation_label`).addClass('float');
        }
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

      $primary_bene.on('change', function () {
        var primary_bene_selected = $("input[name='PrimaryBene']:checked").val();
        if (primary_bene_selected != null) {
          if (primary_bene_selected == 'Person') {
            if (!conditionals_for_primary_bene_satisfied) {
        			hideError($('#error-primary-bene-required'));
        			showError($('#error-primary-bene-all-fields-required'));
        			hideError($('#error-primary-bene-allocation-calc'));
              $primary_bene.css('border-color', error_color);
            } else if (conditionals_for_primary_bene_satisfied) {
        			hideError($('#error-primary-bene-required'));
        			hideError($('#error-primary-bene-all-fields-required'));
              $primary_bene.css('border-color', no_error_color);
            }
          } else if (primary_bene_selected != 'Person') {
      			hideError($('#error-primary-bene-required'));
      			hideError($('#error-primary-bene-all-fields-required'));
            $primary_bene.css('border-color', no_error_color);
          }
        } else {
    			showError($('#error-primary-bene-required'));
    			hideError($('#error-primary-bene-all-fields-required'));
    			hideError($('#error-primary-bene-allocation-calc'));
          $primary_bene.css('border-color', error_color);
        }
      });

      $primary_bene.on('focusout', function () {
        var primary_bene_selected = $(
          "input[name='PrimaryBene']:checked"
        ).val();
        if (primary_bene_selected != null) {
          if (primary_bene_selected == 'Person') {
            if (!conditionals_for_primary_bene_satisfied) {
        			hideError($('#error-primary-bene-required'));
        			showError($('#error-primary-bene-all-fields-required'));
        			hideError($('#error-primary-bene-allocation-calc'));
              $primary_bene.css('border-color', error_color);
            } else if (conditionals_for_primary_bene_satisfied) {
        			hideError($('#error-primary-bene-required'));
        			hideError($('#error-primary-bene-all-fields-required'));
              $primary_bene.css('border-color', no_error_color);
            }
          } else if (primary_bene_selected != 'Person') {
      			hideError($('#error-primary-bene-required'));
      			hideError($('#error-primary-bene-all-fields-required'));
            $primary_bene.css('border-color', no_error_color);
          }
        } else {
    			showError($('#error-primary-bene-required'));
    			hideError($('#error-primary-bene-all-fields-required'));
    			hideError($('#error-primary-bene-allocation-calc'));
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
        const savedApp = getQueryParameter('saved_app');
        const firstName = getQueryParameter('first_name');
        const lastName = getQueryParameter('last_name');
        const homeAddress = getQueryParameter('home_address');
        const phoneNumber = getQueryParameter('phone_number');
        const emailAddress = getQueryParameter('email_address');

        const primaryBeneficiaries = getQueryParameter('primary_beneficiaries');
        const primaryBeneficiariesDetails = getQueryParameter(
          'primary_beneficiaries_details'
        );

        // Populate the fields on the page
        // Populate the fields on the page
        if (savedApp) {
          $('#app_name').val(decodeURIComponent(savedApp));
        }

        if (firstName) {
          $('#app_first_name').val(decodeURIComponent(firstName)).trigger('input'); // Assign the value and trigger input event
        }
        if (lastName) {
          $('#app_last_name').val(decodeURIComponent(lastName)).trigger('input'); // Assign the value and trigger input event
        }
        if (homeAddress) {
          $('#app_home_address').val(decodeURIComponent(homeAddress)).trigger('input'); // Assign the value and trigger input event
        }
        if (phoneNumber) {
          $('#app_phone_number').val(decodeURIComponent(phoneNumber)).trigger('input'); // Assign the value and trigger input event
        }
        if (emailAddress) {
          $('#app_email_address').val(decodeURIComponent(emailAddress)).trigger('input'); // Assign the value and trigger input event
        }

        if (primaryBeneficiaries) {
          if (primaryBeneficiaries == 'Person') {
            $("input[name='PrimaryBene'][value='Person']").prop('checked', true);
            $("input[name='PrimaryBene'][value='Person']").prev('.w-radio-input').addClass('w--redirected-checked');
            $("input[name='PrimaryBene'][value='Children']").prop('checked', false);
            $("input[name='PrimaryBene'][value='Children']").prev('.w-radio-input').removeClass('w--redirected-checked');
            $("input[name='PrimaryBene'][value='Estate']").prop('checked', false);
            $("input[name='PrimaryBene'][value='Estate']").prev('.w-radio-input').removeClass('w--redirected-checked');
          }
          if (primaryBeneficiaries == 'Estate') {
            $("input[name='PrimaryBene'][value='Person']").prop('checked', false);
            $("input[name='PrimaryBene'][value='Person']").prev('.w-radio-input').removeClass('w--redirected-checked');
            $("input[name='PrimaryBene'][value='Children']").prop('checked', false);
            $("input[name='PrimaryBene'][value='Children']").prev('.w-radio-input').removeClass('w--redirected-checked');
            $("input[name='PrimaryBene'][value='Estate']").prop('checked', true);
            $("input[name='PrimaryBene'][value='Estate']").prev('.w-radio-input').addClass('w--redirected-checked');
            primary_bene_ct = 0;
            conditionals_for_primary_bene_satisfied = true;
          }
          if (primaryBeneficiaries == 'Children') {
            $("input[name='PrimaryBene'][value='Person']").prop('checked', false);
            $("input[name='PrimaryBene'][value='Person']").prev('.w-radio-input').removeClass('w--redirected-checked');
            $("input[name='PrimaryBene'][value='Children']").prop('checked', true);
            $("input[name='PrimaryBene'][value='Children']").prev('.w-radio-input').addClass('w--redirected-checked');
            $("input[name='PrimaryBene'][value='Estate']").prop('checked', false);
            $("input[name='PrimaryBene'][value='Estate']").prev('.w-radio-input').removeClass('w--redirected-checked');
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
              const match = key.match(/^bene_(\d+)_first_name$/);

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
              }

              if (key.includes('allocation')) {
                // Sanitize allocation value from URL (e.g., "50%" or "50%25")
                const numericPart = value.replace(/\D/g, '').slice(0, 3);
                const cleanValue = numericPart ? numericPart + '%' : '';

                const $allocationField = $(`#${key}`);
                $allocationField.unmask().val(cleanValue); // Set clean value without triggering mask bug
                $allocationField.mask('000%', { reverse: true }); // Apply the correct mask
                $allocationField.trigger('input'); // Fire input handler to run validation
              } else {
                $(`#${key}`).val(value);
              }

              $('#' + key + '_label').addClass('float');
            }
          }
        });
        console.log("Done pre-filling fields from query parameters found in the URL");

        validateTotalAllocation();
        submitButtonCheck();
      } else {
        console.log('No query parameters found in the URL.');
      }
    });
  })(jQuery, window, document);
});

function waitForGoogleMaps() {
  if (window.google && google.maps && google.maps.places && typeof initAllAutocomplete === 'function') {
    initAllAutocomplete();
  } else {
    setTimeout(waitForGoogleMaps, 200);
  }
}
waitForGoogleMaps();
