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

    storage.setItem('commit_point', "15-application-page2");
    $('#commit_point').val("15-application-page2");
    $('#quote_initiated_datetime').val(storage.getItem('quote_initiated_datetime'));
    $('#quote_initiated_from_ip_address').val(storage.getItem('quote_initiated_from_ip_address'));
    $('#quote_initiated_from_city').val(storage.getItem('quote_initiated_from_city'));

//	Prefill the annual income stored in local storage from the needs/quote and reuse it here as confirmation, and as contrast to household income, which we also need to collect
		if (storage.getItem('annual_income') !== null) {
				$('#personal_income').val(storage.getItem('annual_income'));
				$('#floating-personal-income-label').addClass("float");
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

Webflow.push(function(){
	$("#application").submit(function(){
	})
});

	$(function() {
		;
		(function($, window, document, undefined) {
			'use strict';
			var form = '.app-page2',
					className = 'submit_button_active',
					submit = 'input[type="submit"]';

			$(form).each(function() {
				var $form = $(this),
						$submit = $form.find( submit ),
						enabled = true,
						storage = window.localStorage,
				//  Grab the fields entered (and submitted) on page 1 of the application
						$first_name = $form.find('input[id="first_name"]'),
						$last_name = $form.find('input[id="last_name"]'),
						$home_address = $form.find('input[id="home_address"]'),
						$email_address = $form.find('input[id="email_address"]'),
						$phone_number = $form.find('input[id="phone_number"]'),

						first_name = storage.getItem('app_first_name'),
						last_name = storage.getItem('app_last_name'),
						address_line1 = storage.getItem('app_address_line1'),
						city = storage.getItem('app_city'),
						state = storage.getItem('app_state'),
						postalCode = storage.getItem('app_zip'),
						email = storage.getItem('quote_email_address'),
						phone_number =  storage.getItem('app_phone_number'),

						$personal_income = $form.find('input[id="personal_income"]'),
						$household_income = $form.find('input[id="household_income"]'),
//						$net_worth = $form.find('#net_worth'), // Changed to a selectable drop-down

						$other_policy_coverage_amt_1 = $form.find('input[id="other_policy_coverage_amt_1"]'),
						$other_policy_coverage_amt_2 = $form.find('input[id="other_policy_coverage_amt_2"]'),
						$other_policy_coverage_amt_3 = $form.find('input[id="other_policy_coverage_amt_3"]'),
						$other_policy_coverage_amt_4 = $form.find('input[id="other_policy_coverage_amt_4"]'),
						$other_policy_coverage_amt_5 = $form.find('input[id="other_policy_coverage_amt_5"]'),
						other_policy_ct = 0,
						conditionals_for_policy1_satisfied,
						conditionals_for_policy2_satisfied,
						conditionals_for_policy3_satisfied,
						conditionals_for_policy4_satisfied,
						conditionals_for_policy5_satisfied,
						conditionals_for_other_insurance_satisfied;

				//  Repopulate the hidden fields entered (and submitted) on page 1 of the application to be able to tie this page back to it on the back end
				$first_name.val(first_name);
				$last_name.val(last_name);
				$home_address.val(address_line1+", "+city+", "+state+"  "+postalCode);
				$email_address.val(email);
				$phone_number.val(phone_number);

				document.getElementById("submit_button").disabled = true;

				$personal_income.mask("#,##0", {reverse: true});
				$household_income.mask("#,##0", {reverse: true});
//				$net_worth.mask("#,##0", {reverse: true}); // Changed to a selectable drop-down

				$other_policy_coverage_amt_1.mask("#,##0", {reverse: true});
				$other_policy_coverage_amt_2.mask("#,##0", {reverse: true});
				$other_policy_coverage_amt_3.mask("#,##0", {reverse: true});
				$other_policy_coverage_amt_4.mask("#,##0", {reverse: true});
				$other_policy_coverage_amt_5.mask("#,##0", {reverse: true});

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

							  $("input[name='policy-"+i+"-replacement-flag'][value='Yes']").prop("checked", false);
								$("input[name='policy-"+i+"-replacement-flag'][value='Yes']").prev('.w-radio-input').removeClass('w--redirected-checked');
							  $("input[name='policy-"+i+"-replacement-flag'][value='No']").prop("checked", false);
								$("input[name='policy-"+i+"-replacement-flag'][value='No']").prev('.w-radio-input').removeClass('w--redirected-checked');

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

					  if ($("input[name='policy-"+target_policy_to_move+"-replacement-flag']:checked").val() == "Yes") {
						  $("input[name='policy-"+x+"-replacement-flag'][value='Yes']").prop("checked", true);
							$("input[name='policy-"+x+"-replacement-flag'][value='Yes']").prev('.w-radio-input').addClass('w--redirected-checked');
						  $("input[name='policy-"+x+"-replacement-flag'][value='No']").prop("checked", false);
							$("input[name='policy-"+x+"-replacement-flag'][value='No']").prev('.w-radio-input').removeClass('w--redirected-checked');
						} else if ($("input[name='policy-"+target_policy_to_move+"-replacement-flag']:checked").val() == "No") {
						  $("input[name='policy-"+x+"-replacement-flag'][value='No']").prop("checked", true);
							$("input[name='policy-"+x+"-replacement-flag'][value='No']").prev('.w-radio-input').addClass('w--redirected-checked');
						  $("input[name='policy-"+x+"-replacement-flag'][value='Yes']").prop("checked", false);
							$("input[name='policy-"+x+"-replacement-flag'][value='Yes']").prev('.w-radio-input').removeClass('w--redirected-checked');
						} else {
						  $("input[name='policy-"+x+"-replacement-flag'][value='Yes']").prop("checked", false);
							$("input[name='policy-"+x+"-replacement-flag'][value='Yes']").prev('.w-radio-input').removeClass('w--redirected-checked');
						  $("input[name='policy-"+x+"-replacement-flag'][value='No']").prop("checked", false);
							$("input[name='policy-"+x+"-replacement-flag'][value='No']").prev('.w-radio-input').removeClass('w--redirected-checked');
						}

						$('#other_carrier_'+target_policy_to_move).val("");
						$('#other_policy_num_'+target_policy_to_move).val("");
						$('#other_policy_year_issued_'+target_policy_to_move).val("");
						$('#other_policy_coverage_amt_'+target_policy_to_move).val("");
						$('#other_policy_type_'+target_policy_to_move).val("");
					  $("input[name='policy-"+target_policy_to_move+"-replacement-flag'][value='Yes']").prop("checked", false);
						$("input[name='policy-"+target_policy_to_move+"-replacement-flag'][value='Yes']").prev('.w-radio-input').removeClass('w--redirected-checked');
					  $("input[name='policy-"+target_policy_to_move+"-replacement-flag'][value='No']").prop("checked", false);
						$("input[name='policy-"+target_policy_to_move+"-replacement-flag'][value='No']").prev('.w-radio-input').removeClass('w--redirected-checked');
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

				  $("input[name='policy-"+i+"-replacement-flag'][value='Yes']").prop("checked", false);
					$("input[name='policy-"+i+"-replacement-flag'][value='Yes']").prev('.w-radio-input').removeClass('w--redirected-checked');
				  $("input[name='policy-"+i+"-replacement-flag'][value='No']").prop("checked", false);
					$("input[name='policy-"+i+"-replacement-flag'][value='No']").prev('.w-radio-input').removeClass('w--redirected-checked');

					$('#additional_policy_'+i).hide(500);
					other_policy_ct = i-1;

					switch (i) {
						case 1: conditionals_for_policy1_satisfied = true; 
									  $("input[name='OtherLifeInsurance'][value='Yes']").prop("checked", false);
										$("input[name='OtherLifeInsurance'][value='Yes']").prev('.w-radio-input').removeClass('w--redirected-checked');
									  $("input[name='OtherLifeInsurance'][value='No']").prop("checked", true);
										$("input[name='OtherLifeInsurance'][value='No']").prev('.w-radio-input').addClass('w--redirected-checked');
										$(".add_next_policy").hide(500);
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

				function checkAdditionalPolicyDetails() {
					var other_insurance_selected = $("input[name='OtherLifeInsurance']:checked").val();

					if (other_insurance_selected == "Yes") {
							for (let x = 1; x < other_policy_ct+1; x++) {
								if ( $('#other_carrier_'+x).val() != ''
									&& $('#other_policy_num_'+x).val() != ''
									&& $('#other_policy_year_issued_'+x).val() != ''
									&& ($('#other_policy_coverage_amt_'+x).val().length > 4 && $('#other_policy_coverage_amt_'+x).val().length < 11)
									&& $('#other_policy_type_'+x).val() != ''
									&& $("input[name='policy-"+x+"-replacement-flag']:checked").val() != null
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
							}	else {
								conditionals_for_other_insurance_satisfied = true;
							}
					}
				}

				function submitButtonCheck() {
					checkAdditionalPolicyDetails();

					var personal_income = $('#personal_income').val(),
							household_income = $('#household_income').val(),
							net_worth = $('#net_worth').val(),
							other_insurance_decline_selected = $("input[name='OtherLifeInsuranceDecline']:checked").val();
							

					if 		(conditionals_for_other_insurance_satisfied
		 				&& (personal_income.length > 5 && personal_income.length < 11)
			 			&& (household_income.length > 5 && household_income.length < 11)
			 			&& net_worth != ""
						&& other_insurance_decline_selected != null)
						{
              document.getElementById("submit_button").disabled = false;
							$submit.toggleClass(className, true);
					} else {
							document.getElementById("submit_button").disabled = true;
							$submit.toggleClass(className, false);
          }
				}
			});
		})(jQuery, window, document);
	})
