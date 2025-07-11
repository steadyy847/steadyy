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

		//  Fields for page 3 of the application
    $other_apps_declined = $('#other-apps-declined'),
    $other_life_insurance = $('#other-life-insurance'),

		$other_policy_coverage_amt_1 = $('#other_policy_coverage_amt_1'),
		$other_policy_coverage_amt_2 = $('#other_policy_coverage_amt_2'),
		$other_policy_coverage_amt_3 = $('#other_policy_coverage_amt_3'),
		$other_policy_coverage_amt_4 = $('#other_policy_coverage_amt_4'),
		$other_policy_coverage_amt_5 = $('#other_policy_coverage_amt_5'),

		// Variables to track what has been filled in
		other_policy_ct = 0,
		conditionals_for_policy1_satisfied,
		conditionals_for_policy2_satisfied,
		conditionals_for_policy3_satisfied,
		conditionals_for_policy4_satisfied,
		conditionals_for_policy5_satisfied,
		conditionals_for_other_insurance_satisfied;

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

// Init functions
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

function submitButtonCheck() {
	checkAdditionalPolicyDetails();

	var other_insurance_decline_selected = $("input[name='OtherLifeInsuranceDecline']:checked").val();

	if (other_insurance_decline_selected != null &&
			conditionals_for_other_insurance_satisfied)
	{
      document.getElementById("submit_button").disabled = false;
			$submit.toggleClass(className, true);
	} else {
			document.getElementById("submit_button").disabled = true;
			$submit.toggleClass(className, false);
  }
}

function checkAdditionalPolicyDetails() {
	var other_insurance_selected = $("input[name='OtherLifeInsurance']:checked").val();

	if (other_insurance_selected == "Yes") {
			for (let x = 1; x < other_policy_ct+1; x++) {
				if ( $('#other_carrier_'+x).val() != ''
					&& $('#other_policy_num_'+x).val() != ''
					&& $('#other_policy_year_issued_'+x).val() != ''
					&& ($('#other_policy_coverage_amt_'+x).val().length > 4 && $('#other_policy_coverage_amt_'+x).val().length < 11)
					&& $('#other_policy_type_'+x).val() != ''
					&& $("input[name='Policy-"+x+"-Replacement-Flag']:checked").val() != null
				) {
					switch (x) {
						case 1: conditionals_for_policy1_satisfied = true; break;
						case 2: conditionals_for_policy2_satisfied = true; break;
						case 3: conditionals_for_policy3_satisfied = true; break;
						case 4: conditionals_for_policy4_satisfied = true; break;
						case 5: conditionals_for_policy5_satisfied = true; break;
						default: break;
					}
				} else {
					switch (x) {
						case 1: conditionals_for_policy1_satisfied = false; break;
						case 2: conditionals_for_policy2_satisfied = false; break;
						case 3: conditionals_for_policy3_satisfied = false; break;
						case 4: conditionals_for_policy4_satisfied = false; break;
						case 5: conditionals_for_policy5_satisfied = false; break;
						default: break;
					}
				}
			}

			// Check to see if any of the additional policies that were added, have all required data entered
			if (conditionals_for_policy1_satisfied == false ||
					conditionals_for_policy2_satisfied == false ||
					conditionals_for_policy3_satisfied == false ||
					conditionals_for_policy4_satisfied == false ||
					conditionals_for_policy5_satisfied == false) {
				conditionals_for_other_insurance_satisfied = false;
				//$("#error-other-policies-required").hide(500);
				//$("#error-other-policies-all-fields-required").show(500);
				hideError($('#error-other-policies-required'));
				showError($('#error-other-policies-all-fields-required'));
		    $other_life_insurance.css("border-color", error_color);
			}	else {
				conditionals_for_other_insurance_satisfied = true;
				//$("#error-other-policies-required").hide(500);
				//$("#error-other-policies-all-fields-required").hide(500);
				hideError($('#error-other-policies-required'));
				hideError($('#error-other-policies-all-fields-required'));
		    $other_life_insurance.css("border-color", no_error_color);
			}
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
					enabled = true,

					//  Grab the fields entered (and submitted) on page 1 of the application
					first_name = storage.getItem('app_first_name'),
					last_name = storage.getItem('app_last_name'),
					home_address = storage.getItem('app_home_address'),
					//address_line1 = storage.getItem('app_address_line1'),
					//address_line2 = storage.getItem('app_address_line2'),
					//city = storage.getItem('app_city'),
					//state = storage.getItem('app_state'),
					//postalCode = storage.getItem('app_zip'),
					email = storage.getItem('quote_email_address'),
					phone_number =  storage.getItem('app_phone_number');

			$submit = $form.find(submit);
      document.getElementById('submit_button').disabled = true;

			/*
      if (address_line2 == null) {
      		address_line2 = "";
      }
			*/

			//  Repopulate the hidden fields entered (and submitted) on page 1 of the application to be able to tie this page back to it on the back end
			$first_name.val(first_name);
			$last_name.val(last_name);
			console.log("home_address = "+home_address);
			console.log("BEFORE SETTING: $home_address.val() = "+$home_address.val());
			$home_address.val(home_address);
			console.log("AFTER SETTING: $home_address.val() = "+$home_address.val());
			/*
      if (address_line2.length > 0) {
				$home_address.val(address_line1+" "+address_line2+", "+city+", "+state+"  "+postalCode);
      } else {
				$home_address.val(address_line1+", "+city+", "+state+"  "+postalCode);
			}
			*/
			$email_address.val(email);
			$phone_number.val(phone_number);

			document.getElementById("submit_button").disabled = true;

			$other_policy_coverage_amt_1.mask("#,##0", {reverse: true});
			$other_policy_coverage_amt_2.mask("#,##0", {reverse: true});
			$other_policy_coverage_amt_3.mask("#,##0", {reverse: true});
			$other_policy_coverage_amt_4.mask("#,##0", {reverse: true});
			$other_policy_coverage_amt_5.mask("#,##0", {reverse: true});

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

			$("input[name='OtherLifeInsurance']").click(function(e) {
				var other_insurance_selected = $("input[name='OtherLifeInsurance']:checked").val();
				if (other_insurance_selected == "Yes") {
					$("#additional_policy_1").show(500);
					$(".add_next_policy").show(500);
					other_policy_ct = 1;
				} else if (other_insurance_selected == "No") {

					for (let i = 1; i < 6; i++) {
							$('#other_carrier_'+i).val("");
							$('#other_carrier_'+i+'_label').removeClass('float');
							$('#other_policy_num_'+i).val("");
							$('#other_policy_num_'+i+'_label').removeClass('float');
							$('#other_policy_year_issued_'+i).val("");
							$('#other_policy_year_issued_'+i+'_label').removeClass('float');
							$('#other_policy_coverage_amt_'+i).val("");
							$('#other_policy_coverage_amt_'+i+'_label').removeClass('float');
							$('#other_policy_type_'+i).val("");
							$('#other_policy_type_'+i+'_label').removeClass('float');

						  $("input[name='Policy-"+i+"-Replacement-Flag'][value='Yes']").prop("checked", false);
							$("input[name='Policy-"+i+"-Replacement-Flag'][value='Yes']").prev('.w-radio-input').removeClass('w--redirected-checked');
						  $("input[name='Policy-"+i+"-Replacement-Flag'][value='No']").prop("checked", false);
							$("input[name='Policy-"+i+"-Replacement-Flag'][value='No']").prev('.w-radio-input').removeClass('w--redirected-checked');

							$("#additional_policy_"+i).hide(500);
					}
					$(".add_next_policy").hide(500);
					other_policy_ct = 0;
					conditionals_for_other_insurance_satisfied = true;
					submitButtonCheck();
				}
			});

			function removePolicy(i) {
				// If user is trying to delete policy out of order (e.g. not the last one), then cascade the values of higher count policy(ies) to the targeted one for deletion first
				for (let x = i; x < other_policy_ct; x++) {
					var target_policy_to_move = x+1;

					$('#other_carrier_'+x).val($('#other_carrier_'+target_policy_to_move).val());
					$('#other_policy_num_'+x).val($('#other_policy_num_'+target_policy_to_move).val());
					$('#other_policy_year_issued_'+x).val($('#other_policy_year_issued_'+target_policy_to_move).val());
					$('#other_policy_coverage_amt_'+x).val($('#other_policy_coverage_amt_'+target_policy_to_move).val());
					$('#other_policy_type_'+x).val($('#other_policy_type_'+target_policy_to_move).val());

				  if ($("input[name='Policy-"+target_policy_to_move+"-Replacement-Flag']:checked").val() == "Yes") {
					  $("input[name='Policy-"+x+"-Replacement-Flag'][value='Yes']").prop("checked", true);
						$("input[name='Policy-"+x+"-Replacement-Flag'][value='Yes']").prev('.w-radio-input').addClass('w--redirected-checked');
					  $("input[name='Policy-"+x+"-Replacement-Flag'][value='No']").prop("checked", false);
						$("input[name='Policy-"+x+"-Replacement-Flag'][value='No']").prev('.w-radio-input').removeClass('w--redirected-checked');
					} else if ($("input[name='Policy-"+target_policy_to_move+"-Replacement-Flag']:checked").val() == "No") {
					  $("input[name='Policy-"+x+"-Replacement-Flag'][value='No']").prop("checked", true);
						$("input[name='Policy-"+x+"-Replacement-Flag'][value='No']").prev('.w-radio-input').addClass('w--redirected-checked');
					  $("input[name='Policy-"+x+"-Replacement-Flag'][value='Yes']").prop("checked", false);
						$("input[name='Policy-"+x+"-Replacement-Flag'][value='Yes']").prev('.w-radio-input').removeClass('w--redirected-checked');
					} else {
					  $("input[name='Policy-"+x+"-Replacement-Flag'][value='Yes']").prop("checked", false);
						$("input[name='Policy-"+x+"-Replacement-Flag'][value='Yes']").prev('.w-radio-input').removeClass('w--redirected-checked');
					  $("input[name='Policy-"+x+"-Replacement-Flag'][value='No']").prop("checked", false);
						$("input[name='Policy-"+x+"-Replacement-Flag'][value='No']").prev('.w-radio-input').removeClass('w--redirected-checked');
					}

					$('#other_carrier_'+target_policy_to_move).val("");
					$('#other_policy_num_'+target_policy_to_move).val("");
					$('#other_policy_year_issued_'+target_policy_to_move).val("");
					$('#other_policy_coverage_amt_'+target_policy_to_move).val("");
					$('#other_policy_type_'+target_policy_to_move).val("");
				  $("input[name='Policy-"+target_policy_to_move+"-Replacement-Flag'][value='Yes']").prop("checked", false);
					$("input[name='Policy-"+target_policy_to_move+"-Replacement-Flag'][value='Yes']").prev('.w-radio-input').removeClass('w--redirected-checked');
				  $("input[name='Policy-"+target_policy_to_move+"-Replacement-Flag'][value='No']").prop("checked", false);
					$("input[name='Policy-"+target_policy_to_move+"-Replacement-Flag'][value='No']").prev('.w-radio-input').removeClass('w--redirected-checked');
				}

				i = other_policy_ct;

				$('#other_carrier_'+i).val("");
				$('#other_carrier_'+i+'_label').removeClass('float');
				$('#other_policy_num_'+i).val("");
				$('#other_policy_num_'+i+'_label').removeClass('float');
				$('#other_policy_year_issued_'+i).val("");
				$('#other_policy_year_issued_'+i+'_label').removeClass('float');
				$('#other_policy_coverage_amt_'+i).val("");
				$('#other_policy_coverage_amt_'+i+'_label').removeClass('float');
				$('#other_policy_type_'+i).val("");
				$('#other_policy_type_'+i+'_label').removeClass('float');

			  $("input[name='Policy-"+i+"-Replacement-Flag'][value='Yes']").prop("checked", false);
				$("input[name='Policy-"+i+"-Replacement-Flag'][value='Yes']").prev('.w-radio-input').removeClass('w--redirected-checked');
			  $("input[name='Policy-"+i+"-Replacement-Flag'][value='No']").prop("checked", false);
				$("input[name='Policy-"+i+"-Replacement-Flag'][value='No']").prev('.w-radio-input').removeClass('w--redirected-checked');

				$('#additional_policy_'+i).hide(500);
				other_policy_ct = i-1;

				switch (i) {
					case 1: conditionals_for_policy1_satisfied = true; 
								  $("input[name='OtherLifeInsurance'][value='Yes']").prop("checked", false);
									$("input[name='OtherLifeInsurance'][value='Yes']").prev('.w-radio-input').removeClass('w--redirected-checked');
								  $("input[name='OtherLifeInsurance'][value='No']").prop("checked", true);
									$("input[name='OtherLifeInsurance'][value='No']").prev('.w-radio-input').addClass('w--redirected-checked');
									$(".add_next_policy").hide(500);

      			      hideError($('#error-other-policies-required'));
      			      hideError($('#error-other-policies-all-fields-required'));
      			      $other_life_insurance.css("border-color", no_error_color);

									conditionals_for_other_insurance_satisfied = true; break;
					case 2: conditionals_for_policy2_satisfied = true;
									$(".add_next_policy").show(500); break;
					case 3: conditionals_for_policy3_satisfied = true;
									$(".add_next_policy").show(500); break;
					case 4: conditionals_for_policy4_satisfied = true;
									$(".add_next_policy").show(500); break;
					case 5: conditionals_for_policy5_satisfied = true;
									$(".add_next_policy").show(500); break;
					default: break;
				}
				submitButtonCheck();
			}

			$('#remove_policy_1').click(function(e) {
				e.preventDefault();
				removePolicy(1);
			});
			$('#remove_policy_2').click(function(e) {
				e.preventDefault();
				removePolicy(2);
			});
			$('#remove_policy_3').click(function(e) {
				e.preventDefault();
				removePolicy(3);
			});
			$('#remove_policy_4').click(function(e) {
				e.preventDefault();
				removePolicy(4);
			});
			$('#remove_policy_5').click(function(e) {
				e.preventDefault();
				removePolicy(5);
			});

			$('#add-next-policy-button').click(function(e) {
				switch (other_policy_ct) {
					case 0:
						$('#additional_policy_1').show(500);
						other_policy_ct = 1; 
						break;
					case 1: 
						$('#additional_policy_2').show(500);
						other_policy_ct = 2; 
						break;
					case 2: 
						$('#additional_policy_3').show(500);
						other_policy_ct = 3; 
						break;
					case 3: 
						$('#additional_policy_4').show(500);
						other_policy_ct = 4; 
						break;
					case 4: 
						$('#additional_policy_5').show(500);
						other_policy_ct = 5; 
						$(".add_next_policy").hide(500); 
						break;
					default: other_policy_ct = ""; 
						break;
				}
				conditionals_for_other_insurance_satisfied = false;
				submitButtonCheck();
			});

			$other_apps_declined.on('change', function() {
			  hideError($('#error-apps-declined-required'));
			  $other_apps_declined.css("border-color", no_error_color);
			});

			$other_apps_declined.on('focusout', function() {
			  setTimeout(() => {
			    if (!$(document.activeElement).closest('#other_apps_declined').length) {
			      const selected = $("input[name='OtherLifeInsuranceDecline']:checked").val();
			      if (!selected) {
			        showError($('#error-apps-declined-required'));
			        $other_apps_declined.css("border-color", error_color);
			      }
			    }
			  }, 10);
			});

			$other_life_insurance.on('change', function () {
			  const selected = $("input[name='OtherLifeInsurance']:checked").val();

			  if (selected === "Yes") {
			    if (!conditionals_for_other_insurance_satisfied) {
			      hideError($('#error-other-policies-required'));
			      showError($('#error-other-policies-all-fields-required'));
			      $other_life_insurance.css("border-color", error_color);
			    } else {
			      hideError($('#error-other-policies-required'));
			      hideError($('#error-other-policies-all-fields-required'));
			      $other_life_insurance.css("border-color", no_error_color);
			    }
			  } else if (selected === "No") {
			    hideError($('#error-other-policies-required'));
			    hideError($('#error-other-policies-all-fields-required'));
			    $other_life_insurance.css("border-color", no_error_color);
			  }
			});

			$other_life_insurance.on('focusout', function () {
			  setTimeout(() => {
			    if (!$(document.activeElement).closest('#other_life_insurance').length) {
			      const selected = $("input[name='OtherLifeInsurance']:checked").val();

			      if (!selected) {
			        showError($('#error-other-policies-required'));
			        hideError($('#error-other-policies-all-fields-required'));
			        $other_life_insurance.css("border-color", error_color);
			      }
			    }
			  }, 10);
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

        const otherInsuranceDeclined = getQueryParameter('other_insurance_declined');
        const otherInsurancePolicies = getQueryParameter('other_insurance_policies');
        const otherInsurancePoliciesDetails = getQueryParameter('other_insurance_policies_details');

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

        if (otherInsuranceDeclined) {
					if (otherInsuranceDeclined == 'Yes') {
					  $("input[name='OtherLifeInsuranceDecline'][value='No']").prop("checked", false);
						$("input[name='OtherLifeInsuranceDecline'][value='No']").prev('.w-radio-input').removeClass('w--redirected-checked');
					  $("input[name='OtherLifeInsuranceDecline'][value='Yes']").prop("checked", true);
						$("input[name='OtherLifeInsuranceDecline'][value='Yes']").prev('.w-radio-input').addClass('w--redirected-checked');
					}
					if (otherInsuranceDeclined == 'No') {
					  $("input[name='OtherLifeInsuranceDecline'][value='Yes']").prop("checked", false);
						$("input[name='OtherLifeInsuranceDecline'][value='Yes']").prev('.w-radio-input').removeClass('w--redirected-checked');
					  $("input[name='OtherLifeInsuranceDecline'][value='No']").prop("checked", true);
						$("input[name='OtherLifeInsuranceDecline'][value='No']").prev('.w-radio-input').addClass('w--redirected-checked');
					}
        }

        if (otherInsurancePolicies) {
					if (otherInsurancePolicies == 'Yes') {
					  $("input[name='OtherLifeInsurance'][value='No']").prop("checked", false);
						$("input[name='OtherLifeInsurance'][value='No']").prev('.w-radio-input').removeClass('w--redirected-checked');
					  $("input[name='OtherLifeInsurance'][value='Yes']").prop("checked", true);
						$("input[name='OtherLifeInsurance'][value='Yes']").prev('.w-radio-input').addClass('w--redirected-checked');
					}
					if (otherInsurancePolicies == 'No') {
					  $("input[name='OtherLifeInsurance'][value='Yes']").prop("checked", false);
						$("input[name='OtherLifeInsurance'][value='Yes']").prev('.w-radio-input').removeClass('w--redirected-checked');
					  $("input[name='OtherLifeInsurance'][value='No']").prop("checked", true);
						$("input[name='OtherLifeInsurance'][value='No']").prev('.w-radio-input').addClass('w--redirected-checked');
						other_policy_ct = 0;
						conditionals_for_other_insurance_satisfied = true;
					}
        }

				// Split the Other Policies Details string into key-value pairs
				const pairs = otherInsurancePoliciesDetails.split(";");

				// Parse into a dictionary
				const parsedData = {};
				pairs.forEach(pair => {
				    if (pair.includes("=")) {
				        const [key, value] = pair.split("=");
								if (value) {
								    const match = key.match(/^policy-(\d+)-replacement-flag$/);
								    if (match) {
								        const policyNumber = parseInt(match[1],10); // Extract the number from the key and ensure it is an integer
												if (!isNaN(policyNumber)) { // Double-check it's a valid number
														$('#additional_policy_'+policyNumber).show(500);
														$(".add_next_policy").show(500);
														other_policy_ct = policyNumber;
										    } else {
										        console.error("Invalid policy number extracted from key:", match[1]);
										    }

												switch (value) {
													case "Yes": 
													  $("input[name='Policy-"+policyNumber+"-Replacement-Flag'][value='Yes']").prop("checked", true);
														$("input[name='Policy-"+policyNumber+"-Replacement-Flag'][value='Yes']").prev('.w-radio-input').addClass('w--redirected-checked');
													  $("input[name='Policy-"+policyNumber+"-Replacement-Flag'][value='No']").prop("checked", false);
														$("input[name='Policy-"+policyNumber+"-Replacement-Flag'][value='No']").prev('.w-radio-input').removeClass('w--redirected-checked');
														break;
													case "No":
													  $("input[name='Policy-"+policyNumber+"-Replacement-Flag'][value='No']").prop("checked", true);
														$("input[name='Policy-"+policyNumber+"-Replacement-Flag'][value='No']").prev('.w-radio-input').addClass('w--redirected-checked');
													  $("input[name='Policy-"+policyNumber+"-Replacement-Flag'][value='Yes']").prop("checked", false);
														$("input[name='Policy-"+policyNumber+"-Replacement-Flag'][value='Yes']").prev('.w-radio-input').removeClass('w--redirected-checked');
														break;
													default: break;
												}

								    } else {
												$('#'+key).val(value);
												$('#'+key+'_label').addClass('float');
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
})
