// Utility: Normalize text into valid class names
function conv(str = 'empty') {
  return str
    .replace(/[!"#$%&'()*+,./:;<=>?@[\]^`{|}~]/g, '')
    .replace(/ /g, '-')
    .toLowerCase()
    .trim();
}

// Utility: Set input value and store in localStorage
function setFieldAndStorage(selector, value, key) {
  $(selector).val(value);
  localStorage.setItem(key, value);
}

// Utility: Clear input and remove from localStorage
function clearFieldAndStorage(selector, key) {
  $(selector).val('');
  localStorage.removeItem(key);
}

// Utility: Show/hide error and apply border color
function toggleError($field, errorSelector, isValid, errorColor, noErrorColor) {
  $(errorSelector).toggle(!isValid, 500);
  $field.css('border-color', isValid ? noErrorColor : errorColor);
}

// Utility: Attach validation logic to field
function createRequiredValidation($field, errorSelector, validator) {
  $field.on('input focusout', function () {
    const value = $field.val();
    const isValid = validator ? validator(value) : value.length > 0;
    toggleError($field, errorSelector, isValid, '#AC0036', '#C5C5C5');
  });
}

// Add classes to .mix elements based on .categ contents
function applyCategoryClasses() {
  document.querySelectorAll('.w-dyn-item .categ').forEach(elem => {
    let text = elem.innerText || elem.textContent || '';
    let className = conv(text);
    if (!isNaN(parseInt(className.charAt(0), 10))) className = '_' + className;
    const mixEl = elem.closest('.mix');
    if (mixEl) mixEl.classList.add(className);
  });
}

// Parse user device info
function getDeviceInfo() {
  const ua = navigator.userAgent;
  const browser = /Chrome/.test(ua) && !/Edge|OPR/.test(ua) ? 'Google Chrome' :
                  /Safari/.test(ua) && !/Chrome/.test(ua) ? 'Safari' :
                  /Firefox/.test(ua) ? 'Mozilla Firefox' :
                  /Edge/.test(ua) ? 'Microsoft Edge' :
                  /OPR|Opera/.test(ua) ? 'Opera' :
                  /Trident|MSIE/.test(ua) ? 'Internet Explorer' : 'Unknown';

  const device = /Mobile|Android|iPhone|iPad|iPod/.test(ua) ? 'Mobile' :
                 /Tablet|iPad/.test(ua) ? 'Tablet' : 'Desktop';

  const os = /iPhone|iPad|iPod/.test(ua) ? 'iOS' :
             /Android/.test(ua) ? 'Android' :
             /Windows NT/.test(ua) ? 'Windows' :
             /Macintosh|Mac OS X/.test(ua) ? 'Mac OS' :
             /Linux/.test(ua) ? 'Linux' : 'Unknown';

  return {
    deviceType: device,
    operatingSystem: os,
    browserName: browser,
    viewportWidth: window.innerWidth
  };
}

function populateDeviceField() {
  const info = getDeviceInfo();
  const formatted = `Device Type: ${info.deviceType} |<>| OS: ${info.operatingSystem} |<>| Browser: ${info.browserName} |<>| Viewport Width: ${info.viewportWidth}px`;
  $('#user_device').val(formatted);
}

function initMixItUp() {
  const carrier = conv(localStorage.getItem('app_carrier_selected')?.toLowerCase() || '');
  return mixitup('.container', {
    multifilter: { enable: true },
    load: { filter: `.${carrier}` }
  });
}

function restoreEmail() {
  const email = localStorage.getItem('quote_email_address');
  if (email) {
    $('#app_email_address').val(email);
    $('#floating-app-email-address-label').addClass('float');
  }
}

function manageCommitPoint() {
  let commitPoint = localStorage.getItem('commit_point');
  const num = commitPoint ? parseInt(commitPoint.split('-')[0]) : null;
  const fallback = '14-application';
  if (num > 14) {
    $('#commit_point').val(commitPoint);
  } else {
    localStorage.setItem('commit_point', fallback);
    $('#commit_point').val(fallback);
  }
  localStorage.setItem('navigation_from', fallback);
}

function populateHiddenFields() {
  ['quote_initiated_datetime', 'quote_initiated_from_ip_address', 'quote_initiated_from_city']
    .forEach(id => $(`#${id}`).val(localStorage.getItem(id)));
}

function populatePremiumDetails() {
  const container = $('.application-details');
  const premium = localStorage.getItem('app_premium_selected') || '';
  const coverage = localStorage.getItem('app_coverage_selected') || '';
  const term = localStorage.getItem('app_term_selected') || '';
  const [dollars = '', cents = ''] = premium.slice(1).split('.') || [];
  container.find('.premium_dollars').text(dollars);
  container.find('.premium_cents').text(cents);
  container.find('.coverage').text(coverage);
  container.find('.term').text(`${term} years`);
}

function attachQueryParamHandler() {
  const params = new URLSearchParams(window.location.search);
  const savedApp = params.get('saved_app');
  const step = parseInt(params.get('step'), 10);
  if (savedApp && !isNaN(step) && step > 1) {
    $('#application').submit(() => {
      location.href = `/saved-applications/${savedApp}`;
      return false;
    });
  }
}

function initializeGooglePlacesAutocomplete(inputId) {
  const input = document.getElementById(inputId);
  if (!input) return console.error(`Element with ID '${inputId}' not found`);

  const autocomplete = new google.maps.places.Autocomplete(input, {
    types: ['geocode'],
    componentRestrictions: { country: 'US' },
    fields: ['address_components', 'formatted_address']
  });

  autocomplete.addListener('place_changed', () => {
    const place = autocomplete.getPlace();
    if (!place.address_components) return;

    const componentMap = {};
    place.address_components.forEach(comp => {
      comp.types.forEach(type => {
        componentMap[type] = comp.long_name;
      });
    });

    const fields = [
      { id: 'app_formatted_address', value: place.formatted_address },
      { id: 'app_house_number', value: componentMap['street_number'] },
      { id: 'app_street', value: componentMap['route'] },
      { id: 'app_address_line2', value: componentMap['subpremise'] },
      { id: 'app_city', value: componentMap['locality'] },
      { id: 'app_state', value: componentMap['administrative_area_level_1'] },
      { id: 'app_zip', value: componentMap['postal_code'] }
    ];

    fields.forEach(({ id, value }) => {
      setFieldAndStorage(`#${id}`, value || '', id);
    });

    if (componentMap['street_number'] && componentMap['route']) {
      const line1 = `${componentMap['street_number']} ${componentMap['route']}`;
      setFieldAndStorage('#app_address_line1', line1, 'app_address_line1');
    } else {
      clearFieldAndStorage('#app_address_line1', 'app_address_line1');
    }

    validateAddressFields();
  });
}

function validateAddressFields() {
  const requiredFields = ['#app_address_line1', '#app_city', '#app_state', '#app_zip'];
  const filled = requiredFields.every(sel => $(sel).val());
  const formatted = $('#app_formatted_address').val();
  const $addressInput = $('#app_home_address');
  const errorColor = '#AC0036';
  const noErrorColor = '#C5C5C5';
  const licensedStates = ['IL','CA','FL','MI','NJ','NY','PA','TX','OH'];
  const state = $('#app_state').val();

  if (formatted && filled) {
    $('#error-address-not-valid, #error-address-required').hide(500);
    licensedStates.includes(state)
      ? $('#zip-alert-state').hide(500) && $addressInput.css('border-color', noErrorColor)
      : $('#zip-alert-state').show(500) && $addressInput.css('border-color', errorColor);
  } else if (formatted && !filled) {
    $('#zip-alert-state, #error-address-required').hide(500);
    $('#error-address-not-valid').show(500);
    $addressInput.css('border-color', errorColor);
  } else {
    $('#zip-alert-state, #error-address-not-valid').hide(500);
    $('#error-address-required').show(500);
    $addressInput.css('border-color', errorColor);
  }
}

// Validate form and toggle submit button
function validateFormAndToggleSubmit() {
  const storage = localStorage;
  const requiredSelectors = [
    '#app_first_name', '#app_last_name', '#app_home_address',
    '#app_address_line1', '#app_city', '#app_state', '#app_zip',
    '#app_email_address', '#app_phone_number', '#app_source_category'
  ];
  const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  const allFilled = requiredSelectors.every(sel => $(sel).val());
  const emailValid = emailRegex.test($('#app_email_address').val());
  const phoneValid = $('#app_phone_number').val().length === 14;

  if (allFilled && emailValid && phoneValid) {
    requiredSelectors.forEach(sel => {
      const id = sel.replace('#', '');
      storage.setItem(id, $(sel).val());
    });
    $('#submit_button').prop('disabled', false).addClass('submit_button_active');
  } else {
    $('#submit_button').prop('disabled', true).removeClass('submit_button_active');
  }
}

// Attach validations to individual fields
function initializeFieldValidations() {
  const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  createRequiredValidation($('#app_first_name'), '#error-first-name-required');
  createRequiredValidation($('#app_last_name'), '#error-last-name-required');
  createRequiredValidation($('#app_home_address'), '#error-address-required');
  createRequiredValidation($('#app_email_address'), '#error-email-required', val => emailRegex.test(val));
  createRequiredValidation($('#app_phone_number'), '#error-phone-required', val => val.length === 14);
  createRequiredValidation($('#app_source_category'), '#error-source-required', val => val !== '');
  $('form').on('input change', 'input, select, textarea', validateFormAndToggleSubmit);
}

// Prefill form fields from query parameters
function prefillFormFromQueryParams() {
  const params = new URLSearchParams(window.location.search);
  const fieldMap = [
    { param: 'saved_app', id: 'app_name' },
    { param: 'first_name', id: 'app_first_name', label: '#floating-app-first-name-label' },
    { param: 'last_name', id: 'app_last_name', label: '#floating-app-last-name-label' },
    { param: 'home_address', id: 'app_home_address', label: '#floating-app-home-address-label' },
    { param: 'phone_number', id: 'app_phone_number', label: '#floating-app-phone-number-label' },
    { param: 'email_address', id: 'app_email_address', label: '#floating-app-email-address-label' },
    { param: 'source_category', id: 'app_source_category', label: '#floating-app-source-category-label' }
  ];
  fieldMap.forEach(({ param, id, label }) => {
    const value = params.get(param);
    if (value) {
      if (label) $(label).addClass('float');
      $(`#${id}`).val(decodeURIComponent(value)).trigger('input');
      localStorage.setItem(id, value);
    }
  });
  if (params.get('home_address')) {
    const formatted = decodeURIComponent(params.get('home_address'));
    $('#app_formatted_address').val(formatted);
    localStorage.setItem('app_formatted_address', formatted);
    initializeGooglePlacesAutocomplete('app_home_address');
  }
  validateFormAndToggleSubmit();
}

// Entry point for full application logic
function initApp() {
  Webflow.push(() => {
    applyCategoryClasses();
    populateDeviceField();
    restoreEmail();
    manageCommitPoint();
    populateHiddenFields();
    initMixItUp();
    populatePremiumDetails();
    attachQueryParamHandler();
    initializeGooglePlacesAutocomplete('app_home_address');
    initializeFieldValidations();
    prefillFormFromQueryParams();
  });
}

$(document).ready(initApp);


// [All previous functions remain unchanged above this line]

// Validate the form and enable or disable the submit button
function validateFormAndToggleSubmit() {
  const storage = localStorage;
  const requiredSelectors = [
    '#app_first_name',
    '#app_last_name',
    '#app_home_address',
    '#app_address_line1',
    '#app_city',
    '#app_state',
    '#app_zip',
    '#app_email_address',
    '#app_phone_number',
    '#app_source_category'
  ];

  const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  const allFilled = requiredSelectors.every(sel => $(sel).val());
  const emailValid = emailRegex.test($('#app_email_address').val());
  const phoneValid = $('#app_phone_number').val().length === 14;

  if (allFilled && emailValid && phoneValid) {
    requiredSelectors.forEach(sel => {
      const id = sel.replace('#', '');
      storage.setItem(id, $(sel).val());
    });
    $('#submit_button').prop('disabled', false).addClass('submit_button_active');
  } else {
    $('#submit_button').prop('disabled', true).removeClass('submit_button_active');
  }
}

// Attach validations to individual fields
function initializeFieldValidations() {
  // Apply input mask to phone number field
  $('#app_phone_number').mask('(000) 000-0000');

  const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

  createRequiredValidation($('#app_first_name'), '#error-first-name-required');
  createRequiredValidation($('#app_last_name'), '#error-last-name-required');
  createRequiredValidation($('#app_home_address'), '#error-address-required');
  createRequiredValidation($('#app_email_address'), '#error-email-required', val => emailRegex.test(val));
  createRequiredValidation($('#app_phone_number'), '#error-phone-required', val => val.length === 14);
  createRequiredValidation($('#app_source_category'), '#error-source-required', val => val !== '');

  $('form').on('input change', 'input, select, textarea', validateFormAndToggleSubmit);
}

// Prefill form fields if values are in the URL query string
function prefillFormFromQueryParams() {
  const params = new URLSearchParams(window.location.search);
  const fieldMap = [
    { param: 'saved_app', id: 'app_name' },
    { param: 'first_name', id: 'app_first_name', label: '#floating-app-first-name-label' },
    { param: 'last_name', id: 'app_last_name', label: '#floating-app-last-name-label' },
    { param: 'home_address', id: 'app_home_address', label: '#floating-app-home-address-label' },
    { param: 'phone_number', id: 'app_phone_number', label: '#floating-app-phone-number-label' },
    { param: 'email_address', id: 'app_email_address', label: '#floating-app-email-address-label' },
    { param: 'source_category', id: 'app_source_category', label: '#floating-app-source-category-label' }
  ];

  fieldMap.forEach(({ param, id, label }) => {
    const value = params.get(param);
    if (value) {
      if (label) $(label).addClass('float');
      $(`#${id}`).val(decodeURIComponent(value)).trigger('input');
      localStorage.setItem(id, value);
    }
  });

  if (params.get('home_address')) {
    const formatted = decodeURIComponent(params.get('home_address'));
    $('#app_formatted_address').val(formatted);
    localStorage.setItem('app_formatted_address', formatted);
    initializeGooglePlacesAutocomplete('app_home_address');
  }

  validateFormAndToggleSubmit();
}

// Bootstraps everything on page load
function initApp() {
  Webflow.push(() => {
    applyCategoryClasses();
    populateDeviceField();
    restoreEmail();
    manageCommitPoint();
    populateHiddenFields();
    initMixItUp();
    populatePremiumDetails();
    attachQueryParamHandler();
    initializeGooglePlacesAutocomplete('app_home_address');
    initializeFieldValidations();
    prefillFormFromQueryParams();
  });
}

$(document).ready(initApp);
