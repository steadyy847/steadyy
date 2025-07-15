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

		//  Fields for page 5 of the application
		// EXPERIENCE WITH FINANCIAL PRODUCTS
		$financial_products_experience = $('#financial-products-experience'),
		life_insurance_experience = "input[id='experience-life-insurance-CB']:checked",
		fixed_annuities_experience = "input[id='experience-fixed-annuities-CB']:checked",
		variable_annuities_experience = "input[id='experience-variable-annuities-CB']:checked",
		stocks_experience = "input[id='experience-stocks-CB']:checked",
		bonds_experience = "input[id='experience-bonds-CB']:checked",
		other_experience = "input[id='experience-other-CB']:checked",
		no_experience = "input[id='experience-none-CB']:checked",

		$years_of_life_insurance_experience = $('#years-experience-life-insurance'),
		$years_of_fixed_annuities_experience = $('#years-experience-fixed-annuities'),
		$years_of_variable_annuities_experience = $('#years-experience-variable-annuities'),
		$years_of_stocks_experience = $('#years-experience-stocks'),
		$years_of_bonds_experience = $('#years-experience-bonds'),
		$years_of_other_experience = $('#years-experience-other'),

		// RISK TOLERANCE
    $risk_tolerance = $('#risk_tolerance'),

		// RISK TOLERANCE
    $years_to_keep_policy = $('#years_to_keep_policy'),

		// Variables to track what has been filled in
		life_insurance_experience_errors,
		fixed_annuities_experience_errors,
		variable_annuities_experience_errors,
		stocks_experience_errors,
		bonds_experience_errors,
		other_experience_errors,
		financial_products_experience_errors;

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

function submitButtonCheck() {
	if (!life_insurance_experience_errors &&
			!fixed_annuities_experience_errors &&
			!variable_annuities_experience_errors &&
			!stocks_experience_errors &&
			!bonds_experience_errors &&
			!other_experience_errors &&
			!financial_products_experience_errors &&
			$risk_tolerance.val().length > 0 &&
			$years_to_keep_policy.val().length > 0)
	{
      document.getElementById("submit_button").disabled = false;
			$submit.toggleClass(className, true);
	} else {
			document.getElementById("submit_button").disabled = true;
			$submit.toggleClass(className, false);
  }
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

$(function() {
	;
	(function($, window, document, undefined) {
		'use strict';
		var form = '.application';

		$(form).each(function() {
			var $form = $(this),
					submit = 'input[type="submit"]',
					enabled = true;

			$submit = $form.find(submit);
      document.getElementById('submit_button').disabled = true;

			$years_of_life_insurance_experience.mask("#0", {reverse: true});
			$years_of_fixed_annuities_experience.mask("#0", {reverse: true});
			$years_of_variable_annuities_experience.mask("#0", {reverse: true});
			$years_of_stocks_experience.mask("#0", {reverse: true});
			$years_of_bonds_experience.mask("#0", {reverse: true});
			$years_of_other_experience.mask("#0", {reverse: true});

			// Grab the fields entered (and submitted) on page 1 of the application, for the scenario where the user navigates 
			// here in the normal screen flow of the application (e.g. not coming back here from the application summary page)
			var	first_name = storage.getItem('app_first_name'),
					last_name = storage.getItem('app_last_name'),
					home_address = storage.getItem('app_formatted_address'),
					email = storage.getItem('app_email_address'),
					phone_number =  storage.getItem('app_phone_number');

			//  Repopulate the hidden fields entered (and submitted) on page 1 of the application to be able to tie this page back to it on the back end
			$first_name.val(first_name);
			$last_name.val(last_name);
			$home_address.val(home_address);
			$email_address.val(email);
			$phone_number.val(phone_number);

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

			// Validate the Risk Tolerance field either when the user selects a new value, or moves focus away from it
			$risk_tolerance.on('change focusout', function() {
			  const isEmpty = $risk_tolerance.val() === '';

			  if (isEmpty) {
          // Risk Tolerance was likely reset, so show the 'Field is required' error message
					showError($('#error-risk-tolerance-required'));
			    $risk_tolerance.css('border-color', error_color);
			  } else {
          // if there is something selected in this field, clear the error message
					hideError($('#error-risk-tolerance-required'));
			    $risk_tolerance.css('border-color', no_error_color);
			  }
      });

			// Validate the Expected Duration of Policy field either when the user selects a new value, or moves focus away from it
			$years_to_keep_policy.on('change focusout', function() {
			  const isEmpty = $years_to_keep_policy.val() === '';

			  if (isEmpty) {
          // Expected Duration of Policy was likely reset, so show the 'Field is required' error message
					showError($('#error-years-to-keep-policy-required'));
			    $years_to_keep_policy.css('border-color', error_color);
			  } else {
          // if there is something selected in this field, clear the error message
					hideError($('#error-years-to-keep-policy-required'));
			    $years_to_keep_policy.css('border-color', no_error_color);
			  }
      });

			// Validate the Financial Products Experience section when the user checks or unchecks a checkbox
			$financial_products_experience.on('change', 'input[type="checkbox"]', function () {
			  const id = this.id;

			  const dependentFields = [
			    'experience-life-insurance-CB',
			    'experience-fixed-annuities-CB',
			    'experience-variable-annuities-CB',
			    'experience-stocks-CB',
			    'experience-bonds-CB',
			    'experience-other-CB'
			  ];

			  const noExperience = id === 'experience-none-CB';

				// The 'None' checkbox is checked
			  if (noExperience && this.checked) {
			    // Uncheck the others
			    dependentFields.forEach(fieldId => {
			      $('#' + fieldId).prop('checked', false);
			      $('#' + fieldId).prev('.w-checkbox-input').removeClass('w--redirected-checked');
			    });

					$('#conditional-years-experience-life-insurance').hide(500);
					$('#conditional-years-experience-fixed-annuities').hide(500);
					$('#conditional-years-experience-variable-annuities').hide(500);
					$('#conditional-years-experience-stocks').hide(500);
					$('#conditional-years-experience-bonds').hide(500);
					$('#conditional-years-experience-other').hide(500);

			    setTimeout(function () {
			      $('#years-experience-life-insurance').val('');
			      hideError($('#error-life-insurance-experience-required'));
			      $years_of_life_insurance_experience.css('border-color', no_error_color);
	          $('#years_life_insurance_label').removeClass('float');

			      $('#years-experience-fixed-annuities').val('');
			      hideError($('#error-fixed-annuities-experience-required'));
			      $years_of_fixed_annuities_experience.css('border-color', no_error_color);
	          $('#years_fixed_annuities_label').removeClass('float');

			      $('#years-experience-variable-annuities').val('');
			      hideError($('#error-variable-annuities-experience-required'));
			      $years_of_variable_annuities_experience.css('border-color', no_error_color);
	          $('#years_variable_annuities_label').removeClass('float');

			      $('#years-experience-stocks').val('');
			      hideError($('#error-stocks-experience-required'));
			      $years_of_stocks_experience.css('border-color', no_error_color);
	          $('#years_stocks_label').removeClass('float');

			      $('#years-experience-bonds').val('');
			      hideError($('#error-bonds-experience-required'));
			      $years_of_bonds_experience.css('border-color', no_error_color);
	          $('#years_bonds_label').removeClass('float');

			      $('#years-experience-other').val('');
			      hideError($('#error-other-experience-required'));
			      $years_of_other_experience.css('border-color', no_error_color);
	          $('#years_other_label').removeClass('float');
			    }, 300);

			    financial_products_experience_errors = false;

			  } else if (dependentFields.includes(id)) {
		      // At least one of the Top 6 checkboxes of products the user has experience with is checked
			    if (this.checked) {
			      // Since any of the top 6 are checked, uncheck "None"
			      $('#experience-none-CB').prop('checked', false);
			      $('#experience-none-CB').prev('.w-checkbox-input').removeClass('w--redirected-checked');
			    }

			    // Now evaluate whether ANY of the top 6 are checked
			    const anyTopChecked = dependentFields.some(fieldId => document.getElementById(fieldId).checked);
					const checkedFields = dependentFields.filter(fieldId => document.getElementById(fieldId).checked);

			    if (anyTopChecked) {
				    // For those that are checked, show the input field to indicate how many years the user has experience with that product
						checkedFields.forEach(fieldId => {
						  switch (fieldId) {
						    case 'experience-life-insurance-CB':
						      $('#conditional-years-experience-life-insurance').show(500);
						      break;
						    case 'experience-fixed-annuities-CB':
						      $('#conditional-years-experience-fixed-annuities').show(500);
						      break;
						    case 'experience-variable-annuities-CB':
						      $('#conditional-years-experience-variable-annuities').show(500);
						      break;
						    case 'experience-stocks-CB':
						      $('#conditional-years-experience-stocks').show(500);
						      break;
						    case 'experience-bonds-CB':
						      $('#conditional-years-experience-bonds').show(500);
						      break;
						    case 'experience-other-CB':
						      $('#conditional-years-experience-other').show(500);
						      break;
						    default:
						      console.warn(`Unexpected checkbox ID: ${fieldId}`);			
						  }
						});
						dependentFields.forEach(fieldId => {
						  if (!checkedFields.includes(fieldId)) {
						    switch (fieldId) {
						      case 'experience-life-insurance-CB':
						        $('#conditional-years-experience-life-insurance').hide(500);
						        $('#years-experience-life-insurance').val('');
						        hideError($('#error-life-insurance-experience-required'));
						        $years_of_life_insurance_experience.css('border-color', no_error_color);
					          $('#years_life_insurance_label').removeClass('float');
						        break;
						      case 'experience-fixed-annuities-CB':
						        $('#conditional-years-experience-fixed-annuities').hide(500);
						        $('#years-experience-fixed-annuities').val('');
						        hideError($('#error-fixed-annuities-experience-required'));
						        $years_of_fixed_annuities_experience.css('border-color', no_error_color);
					          $('#years_fixed_annuities_label').removeClass('float');
						        break;
						      case 'experience-variable-annuities-CB':
						        $('#conditional-years-experience-variable-annuities').hide(500);
						        $('#years-experience-variable-annuities').val('');
						        hideError($('#error-variable-annuities-experience-required'));
						        $years_of_variable_annuities_experience.css('border-color', no_error_color);
					          $('#years_variable_annuities_label').removeClass('float');
						        break;
						      case 'experience-stocks-CB':
						        $('#conditional-years-experience-stocks').hide(500);
						        $('#years-experience-stocks').val('');
						        hideError($('#error-stocks-experience-required'));
						        $years_of_stocks_experience.css('border-color', no_error_color);
					          $('#years_stocks_label').removeClass('float');
						        break;
						      case 'experience-bonds-CB':
						        $('#conditional-years-experience-bonds').hide(500);
						        $('#years-experience-bonds').val('');
						        hideError($('#error-bonds-experience-required'));
						        $years_of_bonds_experience.css('border-color', no_error_color);
					          $('#years_bonds_label').removeClass('float');
						        break;
						      case 'experience-other-CB':
						        $('#conditional-years-experience-other').hide(500);
						        $('#years-experience-other').val('');
						        hideError($('#error-other-experience-required'));
						        $years_of_other_experience.css('border-color', no_error_color);
					          $('#years_other_label').removeClass('float');
						        break;
						    default:
						      console.warn(`Unexpected checkbox ID: ${fieldId}`);			
						    }
						  }
						});
					}
		    } else {
			      // None of the top 6 are checked
			      $('#conditional-years-experience-life-insurance').hide(500);
			      $('#conditional-years-experience-fixed-annuities').hide(500);
			      $('#conditional-years-experience-variable-annuities').hide(500);
			      $('#conditional-years-experience-stocks').hide(500);
			      $('#conditional-years-experience-bonds').hide(500);
			      $('#conditional-years-experience-other').hide(500);

			      setTimeout(function () {
				      $('#years-experience-life-insurance').val('');
				      hideError($('#error-life-insurance-experience-required'));
				      $years_of_life_insurance_experience.css('border-color', no_error_color);
		          $('#years_life_insurance_label').removeClass('float');

				      $('#years-experience-fixed-annuities').val('');
				      hideError($('#error-fixed-annuities-experience-required'));
				      $years_of_fixed_annuities_experience.css('border-color', no_error_color);
		          $('#years_fixed_annuities_label').removeClass('float');

				      $('#years-experience-variable-annuities').val('');
				      hideError($('#error-variable-annuities-experience-required'));
				      $years_of_variable_annuities_experience.css('border-color', no_error_color);
		          $('#years_variable_annuities_label').removeClass('float');

				      $('#years-experience-stocks').val('');
				      hideError($('#error-stocks-experience-required'));
				      $years_of_stocks_experience.css('border-color', no_error_color);
		          $('#years_stocks_label').removeClass('float');

				      $('#years-experience-bonds').val('');
				      hideError($('#error-bonds-experience-required'));
				      $years_of_bonds_experience.css('border-color', no_error_color);
		          $('#years_bonds_label').removeClass('float');

				      $('#years-experience-other').val('');
				      hideError($('#error-other-experience-required'));
				      $years_of_other_experience.css('border-color', no_error_color);
		          $('#years_other_label').removeClass('float');
			      }, 300);
			      financial_products_experience_errors = false;
			  }
				// CALL A FUNCTION TO CHECK THE INPUT FIELDS ASSOCIATED WITH CHECKBOX FIELD WHEN THAT CHECKBOX IS CHECKED
				validateFinancialProductsExperience(this); // Still revalidate
			});

			let financialProductsFocusTimer;
			$financial_products_experience.on('focusin', function () {
			  // Clear any pending validation if user re-focuses inside
			  clearTimeout(financialProductsFocusTimer);
			});

			$financial_products_experience.on('focusout', function () {
			  // Delay a little to give time for focus to move to another element
			  financialProductsFocusTimer = setTimeout(() => {
			    const stillInside = $(document.activeElement).closest('#financial-products-experience').length > 0;
			    if (!stillInside) {
					  if ($('#experience-life-insurance-CB').prop('checked') && $years_of_life_insurance_experience.val().trim().length === 0) {
					    showError($('#error-life-insurance-experience-required'));
					    $years_of_life_insurance_experience.css("border-color", error_color);
					    life_insurance_experience_errors = true;
					  } else {
					    hideError($('#error-life-insurance-experience-required'));
					    $years_of_life_insurance_experience.css("border-color", no_error_color);
					    life_insurance_experience_errors = false;
					  }

					  if ($('#experience-fixed-annuities-CB').prop('checked') && $years_of_fixed_annuities_experience.val().trim().length === 0) {
					    showError($('#error-fixed-annuities-experience-required'));
					    $years_of_fixed_annuities_experience.css("border-color", error_color);
					    fixed_annuities_experience_errors = true;
					  } else {
					    hideError($('#error-fixed-annuities-experience-required'));
					    $years_of_fixed_annuities_experience.css("border-color", no_error_color);
					    fixed_annuities_experience_errors = false;
					  }

					  if ($('#experience-variable-annuities-CB').prop('checked') && $years_of_variable_annuities_experience.val().trim().length === 0) {
					    showError($('#error-variable-annuities-experience-required'));
					    $years_of_variable_annuities_experience.css("border-color", error_color);
					    variable_annuities_experience_errors = true;
					  } else {
					    hideError($('#error-variable-annuities-experience-required'));
					    $years_of_variable_annuities_experience.css("border-color", no_error_color);
					    variable_annuities_experience_errors = false;
					  }

					  if ($('#experience-stocks-CB').prop('checked') && $years_of_stocks_experience.val().trim().length === 0) {
					    showError($('#error-stocks-experience-required'));
					    $years_of_stocks_experience.css("border-color", error_color);
					    stocks_experience_errors = true;
					  } else {
					    hideError($('#error-stocks-experience-required'));
					    $years_of_stocks_experience.css("border-color", no_error_color);
					    stocks_experience_errors = false;
					  }

					  if ($('#experience-bonds-CB').prop('checked') && $years_of_bonds_experience.val().trim().length === 0) {
					    showError($('#error-bonds-experience-required'));
					    $years_of_bonds_experience.css("border-color", error_color);
					    bonds_experience_errors = true;
					  } else {
					    hideError($('#error-bonds-experience-required'));
					    $years_of_bonds_experience.css("border-color", no_error_color);
					    bonds_experience_errors = false;
					  }

					  if ($('#experience-other-CB').prop('checked') && $years_of_other_experience.val().trim().length === 0) {
					    showError($('#error-other-experience-required'));
					    $years_of_other_experience.css("border-color", error_color);
					    other_experience_errors = true;
					  } else {
					    hideError($('#error-other-experience-required'));
					    $years_of_other_experience.css("border-color", no_error_color);
					    other_experience_errors = false;
					  }

            console.log(
              "life_insurance_experience_errors = "+life_insurance_experience_errors+"\n"+
              "fixed_annuities_experience_errors = "+fixed_annuities_experience_errors+"\n"+
              "variable_annuities_experience_errors = "+variable_annuities_experience_errors+"\n"+
              "stocks_experience_errors = "+stocks_experience_errors+"\n"+
              "bonds_experience_errors = "+bonds_experience_errors+"\n"+
              "other_experience_errors = "+other_experience_errors
            );
						if (life_insurance_experience_errors || fixed_annuities_experience_errors || variable_annuities_experience_errors || stocks_experience_errors || bonds_experience_errors || other_experience_errors) {
              console.log("financial_products_experience_errors = TRUE");
							financial_products_experience_errors = true;
					    showError($('#error-financial-products-experience-required'));
					    $financial_products_experience.css('border-color', error_color);
						} else {
              console.log("financial_products_experience_errors = FALSE");
							financial_products_experience_errors = false;
					    hideError($('#error-financial-products-experience-required'));
					    $financial_products_experience.css('border-color', no_error_color);
						}
    				validateFinancialProductsExperience(this);
			    }
			  }, 10);
			});

			$years_of_life_insurance_experience.on('input focusout', function () {
			  const value = $years_of_life_insurance_experience.val().trim();

			  if (value.length === 0) {
			    showError($('#error-life-insurance-experience-required'));
			    $years_of_life_insurance_experience.css("border-color", error_color);
			    life_insurance_experience_errors = true;
			  } else {
			    hideError($('#error-life-insurance-experience-required'));
			    $years_of_life_insurance_experience.css("border-color", no_error_color);
			    life_insurance_experience_errors = false;
			  }
			  submitButtonCheck();
			});

			$years_of_fixed_annuities_experience.on('input focusout', function () {
			  const value = $years_of_fixed_annuities_experience.val().trim();

			  if (value.length === 0) {
			    showError($('#error-fixed-annuities-experience-required'));
			    $years_of_fixed_annuities_experience.css("border-color", error_color);
			    fixed_annuities_experience_errors = true;
			  } else {
			    hideError($('#error-fixed-annuities-experience-required'));
			    $years_of_fixed_annuities_experience.css("border-color", no_error_color);
			    fixed_annuities_experience_errors = false;
			  }
			  submitButtonCheck();
			});

			$years_of_variable_annuities_experience.on('input focusout', function () {
			  const value = $years_of_variable_annuities_experience.val().trim();

			  if (value.length === 0) {
			    showError($('#error-variable-annuities-experience-required'));
			    $years_of_variable_annuities_experience.css("border-color", error_color);
			    variable_annuities_experience_errors = true;
			  } else {
			    hideError($('#error-variable-annuities-experience-required'));
			    $years_of_variable_annuities_experience.css("border-color", no_error_color);
			    variable_annuities_experience_errors = false;
			  }
			  submitButtonCheck();
			});

			$years_of_stocks_experience.on('input focusout', function () {
			  const value = $years_of_stocks_experience.val().trim();

			  if (value.length === 0) {
			    showError($('#error-stocks-experience-required'));
			    $years_of_stocks_experience.css("border-color", error_color);
			    stocks_experience_errors = true;
			  } else {
			    hideError($('#error-stocks-experience-required'));
			    $years_of_stocks_experience.css("border-color", no_error_color);
			    stocks_experience_errors = false;
			  }
			  submitButtonCheck();
			});

			$years_of_bonds_experience.on('input focusout', function () {
			  const value = $years_of_bonds_experience.val().trim();

			  if (value.length === 0) {
			    showError($('#error-bonds-experience-required'));
			    $years_of_bonds_experience.css("border-color", error_color);
			    bonds_experience_errors = true;
			  } else {
			    hideError($('#error-bonds-experience-required'));
			    $years_of_bonds_experience.css("border-color", no_error_color);
			    bonds_experience_errors = false;
			  }
			  submitButtonCheck();
			});

			$years_of_other_experience.on('input focusout', function () {
			  const value = $years_of_other_experience.val().trim();

			  if (value.length === 0) {
			    showError($('#error-other-experience-required'));
			    $years_of_other_experience.css("border-color", error_color);
			    other_experience_errors = true;
			  } else {
			    hideError($('#error-other-experience-required'));
			    $years_of_other_experience.css("border-color", no_error_color);
			    other_experience_errors = false;
			  }
			  submitButtonCheck();
			});
			
			function validateFinancialProductsExperience(changedElement) {
			  if (!changedElement || !changedElement.id) {
			    console.warn("validateFinancialProductsExperience called without a valid element");
			    return;
			  }				
			  //const id = this.id;
			  const id = changedElement.id;
				console.log("id passed into the validateFinancialProductsExperience() function = "+id);

			  const dependentFields = [
			    'experience-life-insurance-CB',
			    'experience-fixed-annuities-CB',
			    'experience-variable-annuities-CB',
			    'experience-stocks-CB',
			    'experience-bonds-CB',
			    'experience-other-CB'
			  ];

			  const noExperience = id === 'experience-none-CB';

				// The 'None' checkbox is checked
			  if (noExperience && changedElement.checked) {
			    // Uncheck the others
			    dependentFields.forEach(fieldId => {
			      $('#' + fieldId).prop('checked', false);
			      $('#' + fieldId).prev('.w-checkbox-input').removeClass('w--redirected-checked');
			    });

					$('#conditional-years-experience-life-insurance').hide(500);
					$('#conditional-years-experience-fixed-annuities').hide(500);
					$('#conditional-years-experience-variable-annuities').hide(500);
					$('#conditional-years-experience-stocks').hide(500);
					$('#conditional-years-experience-bonds').hide(500);
					$('#conditional-years-experience-other').hide(500);

			    setTimeout(function () {
			      $('#years-experience-life-insurance').val('');
			      hideError($('#error-life-insurance-experience-required'));
			      $years_of_life_insurance_experience.css('border-color', no_error_color);
	          $('#years_life_insurance_label').removeClass('float');

			      $('#years-experience-fixed-annuities').val('');
			      hideError($('#error-fixed-annuities-experience-required'));
			      $years_of_fixed_annuities_experience.css('border-color', no_error_color);
	          $('#years_fixed_annuities_label').removeClass('float');

			      $('#years-experience-variable-annuities').val('');
			      hideError($('#error-variable-annuities-experience-required'));
			      $years_of_variable_annuities_experience.css('border-color', no_error_color);
	          $('#years_variable_annuities_label').removeClass('float');

			      $('#years-experience-stocks').val('');
			      hideError($('#error-stocks-experience-required'));
			      $years_of_stocks_experience.css('border-color', no_error_color);
	          $('#years_stocks_label').removeClass('float');

			      $('#years-experience-bonds').val('');
			      hideError($('#error-bonds-experience-required'));
			      $years_of_bonds_experience.css('border-color', no_error_color);
	          $('#years_bonds_label').removeClass('float');

			      $('#years-experience-other').val('');
			      hideError($('#error-other-experience-required'));
			      $years_of_other_experience.css('border-color', no_error_color);
	          $('#years_other_label').removeClass('float');
			    }, 300);

			    financial_products_experience_errors = false;

			  } else if (dependentFields.includes(id)) {
		      // At least one of the Top 6 checkboxes of products the user has experience with is checked
			    if (changedElement.checked) {
			      // Since any of the top 6 are checked, uncheck "None"
			      $('#experience-none-CB').prop('checked', false);
			      $('#experience-none-CB').prev('.w-checkbox-input').removeClass('w--redirected-checked');
			    }

			    // Now evaluate whether ANY of the top 6 are checked
			    const anyTopChecked = dependentFields.some(fieldId => document.getElementById(fieldId).checked);
					const checkedFields = dependentFields.filter(fieldId => document.getElementById(fieldId).checked);

			    if (anyTopChecked) {
				    // For those that are checked, show the input field to indicate how many years the user has experience with that product
						checkedFields.forEach(fieldId => {
						  switch (fieldId) {
						    case 'experience-life-insurance-CB':
						      $('#conditional-years-experience-life-insurance').show(500);
						      break;
						    case 'experience-fixed-annuities-CB':
						      $('#conditional-years-experience-fixed-annuities').show(500);
						      break;
						    case 'experience-variable-annuities-CB':
						      $('#conditional-years-experience-variable-annuities').show(500);
						      break;
						    case 'experience-stocks-CB':
						      $('#conditional-years-experience-stocks').show(500);
						      break;
						    case 'experience-bonds-CB':
						      $('#conditional-years-experience-bonds').show(500);
						      break;
						    case 'experience-other-CB':
						      $('#conditional-years-experience-other').show(500);
						      break;
						    default:
						      console.warn(`Unexpected checkbox ID: ${fieldId}`);			
						  }
						});
						dependentFields.forEach(fieldId => {
						  if (!checkedFields.includes(fieldId)) {
						    switch (fieldId) {
						      case 'experience-life-insurance-CB':
						        $('#conditional-years-experience-life-insurance').hide(500);
						        $('#years-experience-life-insurance').val('');
						        hideError($('#error-life-insurance-experience-required'));
						        $years_of_life_insurance_experience.css('border-color', no_error_color);
					          $('#years_life_insurance_label').removeClass('float');
						        break;
						      case 'experience-fixed-annuities-CB':
						        $('#conditional-years-experience-fixed-annuities').hide(500);
						        $('#years-experience-fixed-annuities').val('');
						        hideError($('#error-fixed-annuities-experience-required'));
						        $years_of_fixed_annuities_experience.css('border-color', no_error_color);
					          $('#years_fixed_annuities_label').removeClass('float');
						        break;
						      case 'experience-variable-annuities-CB':
						        $('#conditional-years-experience-variable-annuities').hide(500);
						        $('#years-experience-variable-annuities').val('');
						        hideError($('#error-variable-annuities-experience-required'));
						        $years_of_variable_annuities_experience.css('border-color', no_error_color);
					          $('#years_variable_annuities_label').removeClass('float');
						        break;
						      case 'experience-stocks-CB':
						        $('#conditional-years-experience-stocks').hide(500);
						        $('#years-experience-stocks').val('');
						        hideError($('#error-stocks-experience-required'));
						        $years_of_stocks_experience.css('border-color', no_error_color);
					          $('#years_stocks_label').removeClass('float');
						        break;
						      case 'experience-bonds-CB':
						        $('#conditional-years-experience-bonds').hide(500);
						        $('#years-experience-bonds').val('');
						        hideError($('#error-bonds-experience-required'));
						        $years_of_bonds_experience.css('border-color', no_error_color);
					          $('#years_bonds_label').removeClass('float');
						        break;
						      case 'experience-other-CB':
						        $('#conditional-years-experience-other').hide(500);
						        $('#years-experience-other').val('');
						        hideError($('#error-other-experience-required'));
						        $years_of_other_experience.css('border-color', no_error_color);
					          $('#years_other_label').removeClass('float');
						        break;
						    default:
						      console.warn(`Unexpected checkbox ID: ${fieldId}`);			
						    }
						  }
						});
					}
		    } else {
			      // None of the top 6 are checked
			      $('#conditional-years-experience-life-insurance').hide(500);
			      $('#conditional-years-experience-fixed-annuities').hide(500);
			      $('#conditional-years-experience-variable-annuities').hide(500);
			      $('#conditional-years-experience-stocks').hide(500);
			      $('#conditional-years-experience-bonds').hide(500);
			      $('#conditional-years-experience-other').hide(500);

			      setTimeout(function () {
				      $('#years-experience-life-insurance').val('');
				      hideError($('#error-life-insurance-experience-required'));
				      $years_of_life_insurance_experience.css('border-color', no_error_color);
		          $('#years_life_insurance_label').removeClass('float');

				      $('#years-experience-fixed-annuities').val('');
				      hideError($('#error-fixed-annuities-experience-required'));
				      $years_of_fixed_annuities_experience.css('border-color', no_error_color);
		          $('#years_fixed_annuities_label').removeClass('float');

				      $('#years-experience-variable-annuities').val('');
				      hideError($('#error-variable-annuities-experience-required'));
				      $years_of_variable_annuities_experience.css('border-color', no_error_color);
		          $('#years_variable_annuities_label').removeClass('float');

				      $('#years-experience-stocks').val('');
				      hideError($('#error-stocks-experience-required'));
				      $years_of_stocks_experience.css('border-color', no_error_color);
		          $('#years_stocks_label').removeClass('float');

				      $('#years-experience-bonds').val('');
				      hideError($('#error-bonds-experience-required'));
				      $years_of_bonds_experience.css('border-color', no_error_color);
		          $('#years_bonds_label').removeClass('float');

				      $('#years-experience-other').val('');
				      hideError($('#error-other-experience-required'));
				      $years_of_other_experience.css('border-color', no_error_color);
		          $('#years_other_label').removeClass('float');
			      }, 300);
			      financial_products_experience_errors = false;
			  }

				/*
			  const ids = [
			    'experience-life-insurance-CB',
			    'experience-fixed-annuities-CB',
			    'experience-variable-annuities-CB',
			    'experience-stocks-CB',
			    'experience-bonds-CB',
			    'experience-other-CB',
			    'experience-none-CB'
			  ];

			  const anyChecked = ids.some(id => document.getElementById(id).checked);

			  if (anyChecked) {
			    hideError($('#error-financial-products-experience-required'));
			    $financial_products_experience.css('border-color', no_error_color);

			    const dependentFields = [
				    'experience-life-insurance-CB',
				    'experience-fixed-annuities-CB',
				    'experience-variable-annuities-CB',
				    'experience-stocks-CB',
				    'experience-bonds-CB',
				    'experience-other-CB',
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
				*/
			}
			
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
        const savedApp = getQueryParameter('saved_app');
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

        if (savedApp) {
          $('#app_name')
            .val(decodeURIComponent(savedApp));
        }
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

				// Fill in the EXPERIENCE WITH FINANCIAL PRODUCTS section from what was passed in from the URL params
				if ('experience-life-insurance-CB' in parsed) {
				  const isChecked = parseBoolean(parsed['experience-life-insurance-CB']);
				  $('#experience-life-insurance-CB').prop('checked', isChecked);
				  if (isChecked) {
				    $('#experience-life-insurance-CB').prev('.w-checkbox-input').addClass('w--redirected-checked');
			      $('#conditional-years-experience-life-insurance').show(500);
				  } else {
				    $('#experience-life-insurance-CB').prev('.w-checkbox-input').removeClass('w--redirected-checked');
				  }
				}

				if ('experience-fixed-annuities-CB' in parsed) {
				  const isChecked = parseBoolean(parsed['experience-fixed-annuities-CB']);
				  $('#experience-fixed-annuities-CB').prop('checked', isChecked);
				  if (isChecked) {
				    $('#experience-fixed-annuities-CB').prev('.w-checkbox-input').addClass('w--redirected-checked');
			      $('#conditional-years-experience-fixed-annuities').show(500);
				  } else {
				    $('#experience-fixed-annuities-CB').prev('.w-checkbox-input').removeClass('w--redirected-checked');
				  }
				}

				if ('experience-variable-annuities-CB' in parsed) {
				  const isChecked = parseBoolean(parsed['experience-variable-annuities-CB']);
				  $('#experience-variable-annuities-CB').prop('checked', isChecked);
				  if (isChecked) {
				    $('#experience-variable-annuities-CB').prev('.w-checkbox-input').addClass('w--redirected-checked');
			      $('#conditional-years-experience-variable-annuities').show(500);
				  } else {
				    $('#experience-variable-annuities-CB').prev('.w-checkbox-input').removeClass('w--redirected-checked');
				  }
				}

				if ('experience-stocks-CB' in parsed) {
				  const isChecked = parseBoolean(parsed['experience-stocks-CB']);
				  $('#experience-stocks-CB').prop('checked', isChecked);
				  if (isChecked) {
				    $('#experience-stocks-CB').prev('.w-checkbox-input').addClass('w--redirected-checked');
			      $('#conditional-years-experience-stocks').show(500);
				  } else {
				    $('#experience-stocks-CB').prev('.w-checkbox-input').removeClass('w--redirected-checked');
				  }
				}

				if ('experience-bonds-CB' in parsed) {
				  const isChecked = parseBoolean(parsed['experience-bonds-CB']);
				  $('#experience-bonds-CB').prop('checked', isChecked);
				  if (isChecked) {
				    $('#experience-bonds-CB').prev('.w-checkbox-input').addClass('w--redirected-checked');
			      $('#conditional-years-experience-bonds').show(500);
				  } else {
				    $('#experience-bonds-CB').prev('.w-checkbox-input').removeClass('w--redirected-checked');
				  }
				}

				if ('experience-other-CB' in parsed) {
				  const isChecked = parseBoolean(parsed['experience-other-CB']);
				  $('#experience-other-CB').prop('checked', isChecked);
				  if (isChecked) {
				    $('#experience-other-CB').prev('.w-checkbox-input').addClass('w--redirected-checked');
			      $('#conditional-years-experience-other').show(500);
				  } else {
				    $('#experience-other-CB').prev('.w-checkbox-input').removeClass('w--redirected-checked');
				  }
				}

        if (years_of_life_insurance_experience) {
          $('#years-experience-life-insurance')
            .val(decodeURIComponent(years_of_life_insurance_experience))
            .trigger('input'); // Assign the value and trigger input event
        }

        if (years_of_fixed_annuities_experience) {
          $('#years-experience-fixed-annuities')
            .val(decodeURIComponent(years_of_fixed_annuities_experience))
            .trigger('input'); // Assign the value and trigger input event
        }

        if (years_of_variable_annuities_experience) {
          $('#years-experience-variable-annuities')
            .val(decodeURIComponent(years_of_variable_annuities_experience))
            .trigger('input'); // Assign the value and trigger input event
        }

        if (years_of_stocks_experience) {
          $('#years-experience-stocks')
            .val(decodeURIComponent(years_of_stocks_experience))
            .trigger('input'); // Assign the value and trigger input event
        }

        if (years_of_bonds_experience) {
          $('#years-experience-bonds')
            .val(decodeURIComponent(years_of_bonds_experience))
            .trigger('input'); // Assign the value and trigger input event
        }

        if (years_of_other_experience) {
          $('#years-experience-other')
            .val(decodeURIComponent(years_of_other_experience))
            .trigger('input'); // Assign the value and trigger input event
        }

				// After all Financial Products Experience checkboxes have been set, validate everything the way it would if focus was moved away from field
				$financial_products_experience.trigger('focusout')

				// Fill in the RISK TOLERANCE field from what was passed in from the URL params
        if (risk_tolerance) {
          $('#risk_tolerance')
            .val(decodeURIComponent(risk_tolerance))
            .trigger('input'); // Assign the value and trigger input event
        }

				// Fill in the EXPECTED DURATION OF POLICY field from what was passed in from the URL params
        if (years_to_keep_policy) {
          $('#years_to_keep_policy')
            .val(decodeURIComponent(years_to_keep_policy))
            .trigger('input'); // Assign the value and trigger input event
        }

        console.log("Done pre-filling fields from query parameters found in the URL");
				submitButtonCheck();
      } else {
        console.log('No query parameters found in the URL.');
      }
		});
	})(jQuery, window, document);
})
