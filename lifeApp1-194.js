// Form validation and submission toggle logic
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
    // Persist all relevant fields in localStorage
    requiredSelectors.forEach(sel => {
      const id = sel.replace('#', '');
      storage.setItem(id, $(sel).val());
    });
    $('#submit_button').prop('disabled', false).addClass('submit_button_active');
  } else {
    $('#submit_button').prop('disabled', true).removeClass('submit_button_active');
  }
}

// Initializes validation for required fields with optional custom validation logic
function initializeFieldValidations() {
  const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

  createRequiredValidation($('#app_first_name'), '#error-first-name-required');
  createRequiredValidation($('#app_last_name'), '#error-last-name-required');
  createRequiredValidation($('#app_home_address'), '#error-address-required');
  createRequiredValidation($('#app_email_address'), '#error-email-required', val => emailRegex.test(val));
  createRequiredValidation($('#app_phone_number'), '#error-phone-required', val => val.length === 14);
  createRequiredValidation($('#app_source_category'), '#error-source-required', val => val !== '');

  // Revalidate form on any input or selection change
  $('form').on('input change', 'input, select, textarea', validateFormAndToggleSubmit);
}

// Prefills form fields from query parameters if present in the URL
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

  // Populate each mapped field if present in query string
  fieldMap.forEach(({ param, id, label }) => {
    const value = params.get(param);
    if (value) {
      if (label) $(label).addClass('float');
      $(`#${id}`).val(decodeURIComponent(value)).trigger('input');
      localStorage.setItem(id, value);
    }
  });

  // Also handle formatted address if present
  if (params.get('home_address')) {
    const formatted = decodeURIComponent(params.get('home_address'));
    $('#app_formatted_address').val(formatted);
    localStorage.setItem('app_formatted_address', formatted);
    initializeGooglePlacesAutocomplete('app_home_address');
  }

  // Final validation after field prefill
  validateFormAndToggleSubmit();
}

// Main app initialization entrypoint
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

// Wait for DOM to be ready before starting app
$(document).ready(initApp);
