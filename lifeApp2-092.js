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

	$(document).ready(function () {
		Webflow.push(function(){
			$("#application").submit(function(){
	      // Check if the URL has any query parameters
	      if (window.location.search) {
	        // Retrieve the saved_app parameter if it was passed in the URL
          const urlParams = new URLSearchParams(window.location.search);
	        const savedApp = urlParams.get('saved_app');
	        const step = parseInt(urlParams.get('step'), 10); // Convert step to an integer

	        // If the URL has the saved_app query params and the user has already completed all 3 steps, then reset the submitButton href
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
				var form = '.application',
						className = 'submit_button_active',
						submit = 'input[type="submit"]';

				$(form).each(function() {
					var $form = $(this),
							$submit = $form.find( submit ),
							enabled = true,
							storage = window.localStorage,
							error_color = "#AC0036",
		    			no_error_color = "#C5C5C5",
					//  Grab the fields entered (and submitted) on page 1 of the application
							$first_name = $form.find('input[id="app_first_name"]'),
							$last_name = $form.find('input[id="app_last_name"]'),
							$home_address = $form.find('input[id="app_home_address"]'),
							$email_address = $form.find('input[id="app_email_address"]'),
							$phone_number = $form.find('input[id="app_phone_number"]'),

							first_name = storage.getItem('app_first_name'),
							last_name = storage.getItem('app_last_name'),
							address_line1 = storage.getItem('app_address_line1'),
							address_line2 = storage.getItem('app_address_line2'),
							city = storage.getItem('app_city'),
							state = storage.getItem('app_state'),
							postalCode = storage.getItem('app_zip'),
							email = storage.getItem('quote_email_address'),
							phone_number =  storage.getItem('app_phone_number'),

							$employer = $form.find('input[id="employer"]'),
							$occupation = $form.find('input[id="occupation"]'),
							$personal_income = $form.find('input[id="personal_income"]'),
							$household_income = $form.find('input[id="household_income"]'),
							$net_worth = $form.find('#net_worth'), // Changed to a selectable drop-down
	//						$net_worth = $form.find('select[id="net_worth"]'),
	            $bankruptcy = $form.find('#bankruptcy'),
	            $other_apps_declined = $form.find('#other-apps-declined'),
	            $other_life_insurance = $form.find('#other-life-insurance'),

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

					$employer.on('input.True', function() {
						if (this.value.length == 0) {
							// Employer was likely cleared out and deleted, so show the 'Field is required' error message
							$("#error-employer-required").show(500);
		          $employer.css("border-color", error_color);
						} else {
							// if there is at least one character input into this field, clear the error message
							$("#error-employer-required").hide(500);
		          $employer.css("border-color", no_error_color);
						}
					});

					$employer.on('focusout', function() {
						if ($employer.val().length == 0) {
							// if the employer field is blank, throw up an error message that this field is required 
							$("#error-employer-required").show(500);
		          $employer.css("border-color", error_color);
						} else {
							// Under this condition the user has filled in employer, so get rid of all error messages
							$("#error-employer-required").hide(500);
					    $employer.css("border-color", no_error_color);
						}
					});

					$occupation.on('input.True', function() {
						if (this.value.length == 0) {
							// Occupation was likely cleared out and deleted, so show the 'Field is required' error message
							$("#error-occupation-required").show(500);
		          $occupation.css("border-color", error_color);
						} else {
							// if there is at least one character input into this field, clear the error message
							$("#error-occupation-required").hide(500);
		          $occupation.css("border-color", no_error_color);
						}
					});

					$occupation.on('focusout', function() {
						if ($occupation.val().length == 0) {
							// if the occupation field is blank, throw up an error message that this field is required 
							$("#error-occupation-required").show(500);
		          $occupation.css("border-color", error_color);
						} else {
							// Under this condition the user has filled in occupation, so get rid of all error messages
							$("#error-occupation-required").hide(500);
					    $occupation.css("border-color", no_error_color);
						}
					});

					$personal_income.on('input.True', function() {
						if (this.value.length == 0) {
							// Personal Income was likely cleared out and deleted, so show the 'Field is required' error message
							$("#error-personal-income-required").show(500);
		          $personal_income.css("border-color", error_color);
						} else {
							// if there is at least one character input into this field, clear the error message
							$("#error-personal-income-required").hide(500);
		          $personal_income.css("border-color", no_error_color);
						}
					});

					$personal_income.on('focusout', function() {
						if ($personal_income.val().length == 0) {
							// if the personal income field is blank, throw up an error message that this field is required 
							$("#error-personal-income-required").show(500);
		          $personal_income.css("border-color", error_color);
						} else {
							// Under this condition the user has filled in personal income, so get rid of all error messages
							$("#error-personal-income-required").hide(500);
					    $personal_income.css("border-color", no_error_color);
						}
					});

					$household_income.on('input.True', function() {
						if (this.value.length == 0) {
							// Household Income was likely cleared out and deleted, so show the 'Field is required' error message
							$("#error-household-income-required").show(500);
		          $household_income.css("border-color", error_color);
						} else {
							// if there is at least one character input into this field, clear the error message
							$("#error-household-income-required").hide(500);
		          $household_income.css("border-color", no_error_color);
						}
					});

					$household_income.on('focusout', function() {
						if ($household_income.val().length == 0) {
							// if the household income field is blank, throw up an error message that this field is required 
							$("#error-household-income-required").show(500);
		          $household_income.css("border-color", error_color);
						} else {
							// Under this condition the user has filled in household income, so get rid of all error messages
							$("#error-household-income-required").hide(500);
					    $household_income.css("border-color", no_error_color);
						}
					});

					$('#net_worth').on('change', function() {
						if (this.value.length == 0) {
							// Net worth was likely reset, so show the 'Field is required' error message
							$("#error-net-worth-required").show(500);
		          $net_worth.css("border-color", error_color);
						} else {
							// if there is something selected in this field, clear the error message
							$("#error-net-worth-required").hide(500);
		          $net_worth.css("border-color", no_error_color);
						}
					});

					$net_worth.on('focusout', function() {
						if ($net_worth.val().length == 0) {
							// if the net worth field is blank, throw up an error message that this field is required 
							$("#error-net-worth-required").show(500);
		          $net_worth.css("border-color", error_color);
						} else {
							// Under this condition the user has filled in net worth, so get rid of all error messages
							$("#error-net-worth-required").hide(500);
					    $net_worth.css("border-color", no_error_color);
						}
					});

					$bankruptcy.on('change', function() {
						var bankruptcy_selected = $("input[name='Bankruptcy']:checked").val();
						if (bankruptcy_selected != null) {
							$("#error-bankruptcy-required").hide(500);
		          $bankruptcy.css("border-color", no_error_color);
						} else {
							$("#error-bankruptcy-required").show(500);
		          $bankruptcy.css("border-color", error_color);
						}
					});

	  			$bankruptcy.on('focusout', function() {
						var bankruptcy_selected = $("input[name='Bankruptcy']:checked").val();
						if (bankruptcy_selected != null) {
							$("#error-bankruptcy-required").hide(500);
					    $bankruptcy.css("border-color", no_error_color);
						} else {
							$("#error-bankruptcy-required").show(500);
					    $bankruptcy.css("border-color", error_color);
						}
	  			});

					$other_apps_declined.on('change', function() {
						var other_insurance_decline_selected = $("input[name='OtherLifeInsuranceDecline']:checked").val();
						if (other_insurance_decline_selected != null) {
							$("#error-apps-declined-required").hide(500);
		          $other_apps_declined.css("border-color", no_error_color);
						} else {
							$("#error-apps-declined-required").show(500);
		          $other_apps_declined.css("border-color", error_color);
						}
					});

	  			$other_apps_declined.on('focusout', function() {
						var	other_insurance_decline_selected = $("input[name='OtherLifeInsuranceDecline']:checked").val();
						if (other_insurance_decline_selected != null) {
							$("#error-apps-declined-required").hide(500);
					    $other_apps_declined.css("border-color", no_error_color);
						} else {
							$("#error-apps-declined-required").show(500);
					    $other_apps_declined.css("border-color", error_color);
						}
	  			});

					$other_life_insurance.on('change', function() {
						var other_insurance_selected = $("input[name='OtherLifeInsurance']:checked").val();
						if (other_insurance_selected != null) {
							if (other_insurance_selected == "Yes") {
								if (!conditionals_for_other_insurance_satisfied) {
									$("#error-other-policies-required").hide(500);
									$("#error-other-policies-all-fields-required").show(500);
							    $other_life_insurance.css("border-color", error_color);
								} else if (conditionals_for_other_insurance_satisfied) {
									$("#error-other-policies-required").hide(500);
									$("#error-other-policies-all-fields-required").hide(500);
							    $other_life_insurance.css("border-color", no_error_color);
								}
							} else if (other_insurance_selected == "No") {
									$("#error-other-policies-required").hide(500);
									$("#error-other-policies-all-fields-required").hide(500);
							    $other_life_insurance.css("border-color", no_error_color);
							}
						} else {
							$("#error-other-policies-all-fields-required").hide(500);
							$("#error-other-policies-required").show(500);
					    $other_life_insurance.css("border-color", error_color);
						}
					});

				$other_life_insurance.on('focusout', function() {
						var other_insurance_selected = $("input[name='OtherLifeInsurance']:checked").val();
						if (other_insurance_selected != null) {
							if (other_insurance_selected == "Yes") {
								if (!conditionals_for_other_insurance_satisfied) {
									$("#error-other-policies-required").hide(500);
									$("#error-other-policies-all-fields-required").show(500);
							    $other_life_insurance.css("border-color", error_color);
								} else if (conditionals_for_other_insurance_satisfied) {
									$("#error-other-policies-required").hide(500);
									$("#error-other-policies-all-fields-required").hide(500);
							    $other_life_insurance.css("border-color", no_error_color);
								}
							} else if (other_insurance_selected == "No") {
									$("#error-other-policies-required").hide(500);
									$("#error-other-policies-all-fields-required").hide(500);
							    $other_life_insurance.css("border-color", no_error_color);
							}
						} else {
							$("#error-other-policies-all-fields-required").hide(500);
							$("#error-other-policies-required").show(500);
					    $other_life_insurance.css("border-color", error_color);
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
		        // Retrieve the parameters
		        const firstName = getQueryParameter('first_name');
		        const lastName = getQueryParameter('last_name');
		        const homeAddress = getQueryParameter('home_address');
		        const phoneNumber = getQueryParameter('phone_number');
		        const emailAddress = getQueryParameter('email_address');
		        const sourceCategory = getQueryParameter('source_category');

		        const employer = getQueryParameter('employer');
		        const occupation = getQueryParameter('occupation');
		        const personalIncome = getQueryParameter('personal_income');
		        const householdIncome = getQueryParameter('household_income');
		        const netWorth = getQueryParameter('net_worth');
		        const bankruptcy = getQueryParameter('bankruptcy');
		        const otherInsuranceDeclined = getQueryParameter('other_insurance_declined');
		        const otherInsurancePolicies = getQueryParameter('other_insurance_policies');
		        const otherInsurancePoliciesDetails = getQueryParameter('other_insurance_policies_details');

						console.log("otherInsurancePoliciesDetails = "+otherInsurancePoliciesDetails);
						/*
						other policies #1-5
							other_carrier_1
							other_policy_num_1
							other_policy_year_issued_1
							other_policy_coverage_amt_1
							other_policy_type_1
							policy-1-replacement-flag-yes
						*/

						// Split the Other Policies Details string into key-value pairs
						const pairs = otherInsurancePoliciesDetails.split(";");

						// Parse into a dictionary
						const parsedData = {};
						pairs.forEach(pair => {
						    if (pair.includes("=")) {
						        const [key, value] = pair.split("=");
//						        parsedData[key] = value;

									if (value) {
									    const match = key.match(/^policy-(\d+)-replacement-flag$/);
									    if (match) {
									        const policyNumber = match[1]; // Extract the number from the key
									        console.log(`Policy number ${policyNumber} Replacement = `+value);

													$('#additional_policy_'+policyNumber).show(500);
													$(".add_next_policy").show(500);
													other_policy_ct = policyNumber;

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
													console.log("#"+key+" = "+value);
											}
									}
						    }
						});
//					submitButtonCheck();

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

		        if (employer) {
		          $('#floating-employer-label').addClass('float'); // Float the label
		          $('#employer')
		            .val(decodeURIComponent(employer))
		            .trigger('input'); // Assign the value and trigger input event
		        }
		        if (occupation) {
		          $('#floating-occupation-label').addClass('float'); // Float the label
		          $('#occupation')
		            .val(decodeURIComponent(occupation))
		            .trigger('input'); // Assign the value and trigger input event
		        }
		        if (personalIncome) {
		          $('#floating-personal-income-label').addClass('float'); // Float the label
		          $('#personal_income')
		            .val(decodeURIComponent(personalIncome))
		            .trigger('input'); // Assign the value and trigger input event
		        }
		        if (householdIncome) {
		          $('#floating-household-income-label').addClass('float'); // Float the label
		          $('#household_income')
		            .val(decodeURIComponent(householdIncome))
		            .trigger('input'); // Assign the value and trigger input event
		        }
		        if (netWorth) {
		          $('#floating-net-worth-label').addClass('float'); // Float the label
		          $('#net_worth')
		            .val(decodeURIComponent(netWorth))
		            .trigger('input'); // Assign the value and trigger input event
		        }
		        if (bankruptcy) {
							if (bankruptcy == 'Yes') {
							  $("input[name='Bankruptcy'][value='No']").prop("checked", false);
								$("input[name='Bankruptcy'][value='No']").prev('.w-radio-input').removeClass('w--redirected-checked');
							  $("input[name='Bankruptcy'][value='Yes']").prop("checked", true);
								$("input[name='Bankruptcy'][value='Yes']").prev('.w-radio-input').addClass('w--redirected-checked');
							}
							if (bankruptcy == 'No') {
							  $("input[name='Bankruptcy'][value='Yes']").prop("checked", false);
								$("input[name='Bankruptcy'][value='Yes']").prev('.w-radio-input').removeClass('w--redirected-checked');
							  $("input[name='Bankruptcy'][value='No']").prop("checked", true);
								$("input[name='Bankruptcy'][value='No']").prev('.w-radio-input').addClass('w--redirected-checked');
							}
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

		        submitButtonCheck();
		      } else {
		        console.log('No query parameters found in the URL.');
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
									$("#error-other-policies-required").hide(500);
									$("#error-other-policies-all-fields-required").show(500);
							    $other_life_insurance.css("border-color", error_color);
								}	else {
									conditionals_for_other_insurance_satisfied = true;
									$("#error-other-policies-required").hide(500);
									$("#error-other-policies-all-fields-required").hide(500);
							    $other_life_insurance.css("border-color", no_error_color);
								}
						}
					}

					function submitButtonCheck() {
						checkAdditionalPolicyDetails();

						var employer = $('#employer').val(),
								occupation = $('#occupation').val(),
								personal_income = $('#personal_income').val(),
								household_income = $('#household_income').val(),
								net_worth = $('#net_worth').val(),
								bankruptcy_selected = $("input[name='Bankruptcy']:checked").val(),
								other_insurance_decline_selected = $("input[name='OtherLifeInsuranceDecline']:checked").val();

						if 	(employer.length > 0
							&& occupation.length > 0
			 				&& (personal_income.length > 5 && personal_income.length < 11)
				 			&& (household_income.length > 5 && household_income.length < 11)
				 			&& net_worth != ""
							&& bankruptcy_selected != null
							&& other_insurance_decline_selected != null
							&& conditionals_for_other_insurance_satisfied)
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
