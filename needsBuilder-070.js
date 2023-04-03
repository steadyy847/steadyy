
$.get("https://ipinfo.io", function(response) {
		$('#quote_initiated_from_ip_address').val(response.ip);
		$('#submit_from_ip_address').val(response.ip);
		$('#submit_from_city').val(response.city+", "+response.region+", "+response.country);
}, "jsonp");

$(document).ready(function() {
	$(":input, a").attr("tabindex", "-1");
	var form = '.quote',
			submit = 'input[type="submit"]',
			storage = window.localStorage,
			$form = $(this),
			$submit   = $form.find( submit ),
			$goals_next = $form.find( '#goals-step' ),
			$dependents_next = $form.find( '#dependents-step' ),
			$needs_next = $form.find( '#needs-step' ),
			$dob_next = $form.find( '#dob-step' ),
			$income_next = $form.find( '#income-step' ),
			$home_next = $form.find( '#home-step' ),
			$mortgage_next = $form.find( '#mortgage-step' ),
			$mortgagebalance_next = $form.find( '#mortgage-balance-step' ),
			$debts_next = $form.find( '#debts-step' ),
			$children_next = $form.find( '#children-step' ),
			$children_num_next = $form.find( '#children-num-step' ),
			$childcare_next = $form.find( '#childcare-step' ),
			$college_next = $form.find( '#college-step' ),
			$college_savings_next = $form.find( '#college-savings-step' ),
			$savings_next = $form.find( '#savings-step' ),
			$current_insurance_next = $form.find( '#current-insurance-step' ),
			className = 'button_active',
			$goals = $form.find('.goals'),
			goal_income = "input[id='goal_income']:checked",
			goal_mortgage = "input[id='goal_mortgage']:checked",
			goal_debts = "input[id='goal_debts']:checked",
			goal_education = "input[id='goal_education']:checked",
			goal_funeral = "input[id='goal_funeral']:checked",
			goal_charity = "input[id='goal_charity']:checked",
			$dependents = $form.find('.dependents'),
			dependent_spouse = "input[id='dependent_spouse']:checked",
			dependent_children = "input[id='dependent_children']:checked",
			dependent_parent = "input[id='dependent_parent']:checked",
			dependent_other = "input[id='dependent_other']:checked",
			$needshelp = $form.find('.needshelp'),
			needs_help_selected = $("input[name='needs_help']:checked").val(),
			$dob_month = $form.find('input[id="dob_month"]'),
			$dob_day = $form.find('input[id="dob_day"]'),
			$dob_year = $form.find('input[id="dob_year"]'),
			$annual_income = $form.find('input[id="income-input"]'),
			$homeownership = $form.find('.homeownership'),
			home_ownership_selected = $("input[name='home_ownership']:checked").val(),
			$mortgage = $form.find('.mortgage'),
			mortgage_selected = $("input[name='Mortgage']:checked").val(),
			$mortgage_input = $form.find('input[id="mortgage-input"]'),
			$debts_input = $form.find('input[id="debts-input"]'),
			$children = $form.find('.children'),
			children_selected = $("input[name='Children']:checked").val(),
			$children_num_input = $form.find('input[id="children-num-input"]'),
			$childcare_input = $form.find('input[id="childcare-input"]'),
			$college = $form.find('.college'),
			college_selected = $("input[name='College']:checked").val(),
			$college_savings_input = $form.find('input[id="college-savings-input"]'),
			$savings_input = $form.find('input[id="savings-input"]'),
			$current_insurance_input = $form.find('input[id="current-insurance-input"]'),

			DOBresult,
			dob,
			age,
			adj_age,
			dob_error_req = true,
			dob_error_age = false,
			income_error = true,
			coverage_rec,
			mortgagebalance_error = true,
			debts_error = true,
			children_num_error = true,
			children_age_error = true,
			childcare_error = true,
			college_savings_error = true,
			savings_error = true,
			current_insurance_error = true,
			enabled = true,
			strDateTime = getFormattedDate();

//	storage.clear();

	storage.setItem('commit_point', "0-needs");
	$('#commit_point').val("0-needs");
	storage.setItem('quote_initiated_datetime', strDateTime);
	$('#quote_initiated_datetime').val(strDateTime);

  /* STEP 1 - Set up masks for the fields that require them */
	$dob_month.mask("#0");
	$dob_day.mask("#0");
	$dob_year.mask("0000");
	$annual_income.mask("#,##0", {reverse: true});
	$children_num_input.mask("#0");
	$mortgage_input.mask("#,##0", {reverse: true});
	$debts_input.mask("#,##0", {reverse: true});
	$childcare_input.mask("#,##0", {reverse: true});
	$college_savings_input.mask("#,##0", {reverse: true});
	$savings_input.mask("#,##0", {reverse: true});
	$current_insurance_input.mask("#,##0", {reverse: true});

	$('.child_age').hide(500);

  /* STEP 2 - Grab the current values in localStorage so they can be set on each page, in the event that a user 
              left this page and comes back later, so they don't lose data that they may have already entered */
	var storage_goal_income = storage.getItem('goal_income'),														// Slide 1
			storage_goal_mortgage = storage.getItem('goal_mortgage'),												// Slide 1
			storage_goal_debts = storage.getItem('goal_debts'),															// Slide 1
			storage_goal_education = storage.getItem('goal_education'),											// Slide 1
			storage_goal_funeral = storage.getItem('goal_funeral'),													// Slide 1
			storage_goal_charity = storage.getItem('goal_charity'),													// Slide 1
			storage_dependent_spouse = storage.getItem('dependent_spouse'),									// Slide 2
			storage_dependent_children = storage.getItem('dependent_children'),							// Slide 2
			storage_dependent_parent = storage.getItem('dependent_parent'),									// Slide 2
			storage_dependent_other = storage.getItem('dependent_other'),										// Slide 2
			storage_needs_help = storage.getItem('needs_help'),															// Slide 3
			storage_dob = storage.getItem('dob'),																						// Slide 4
			storage_age = storage.getItem('age'),																						// Slide 4
      storage_annual_income = storage.getItem('annual_income'),												// Slide 5
      storage_home_ownership = storage.getItem('home_ownership'),											// Slide 6
      storage_mortgage = storage.getItem('mortgage'),																	// Slide 7
      storage_mortgage_balance = storage.getItem('mortgage_balance'),									// Slide 8
      storage_debts = storage.getItem('debts'),																				// Slide 9
      storage_children = storage.getItem('children'),																	// Slide 10
      storage_children_num = storage.getItem('children_num'),													// Slide 11
      storage_child_age_1 = storage.getItem('child_age_1'),														// Slide 11
      storage_child_age_2 = storage.getItem('child_age_2'),														// Slide 11
      storage_child_age_3 = storage.getItem('child_age_3'),														// Slide 11
      storage_child_age_4 = storage.getItem('child_age_4'),														// Slide 11
      storage_child_age_5 = storage.getItem('child_age_5'),														// Slide 11
      storage_child_age_6 = storage.getItem('child_age_6'),														// Slide 11
      storage_child_age_7 = storage.getItem('child_age_7'),														// Slide 11
      storage_child_age_8 = storage.getItem('child_age_8'),														// Slide 11
      storage_child_age_9 = storage.getItem('child_age_9'),														// Slide 11
      storage_childcare = storage.getItem('childcare'),																// Slide 12
      storage_college_type_preference = storage.getItem('college_type_preference'),		// Slide 13
      storage_college_savings = storage.getItem('college_savings'),										// Slide 14
      storage_savings = storage.getItem('savings'),																		// Slide 15
      storage_current_insurance = storage.getItem('current_insurance'),								// Slide 16
      storage_total_insurance_need = storage.getItem('total_insurance_need');					// Slide 17

/* STEP 3 - Evaluate whether there was data in localStorage for the page, and re-initialize it with that data, if there was */
  if (storage_goal_income == null || storage_goal_income === 'false') {
			$("input[id='goal_income']:checked").prop('checked', false);
			$('#goal_income').prev('.w-checkbox-input').removeClass('w--redirected-checked');
  } else {
//			$("input[id='goal_income']:checked").prop('checked', true);
      document.querySelector("input[id='goal_income']").checked = true;
			$('#goal_income').prev('.w-checkbox-input').addClass('w--redirected-checked');
  }


  if (storage_needs_help !== null) {
	  $("input[name='needs_help'][value='" + storage_needs_help + "']").prop("checked", true);
		$("input[name='needs_help'][value='" + storage_needs_help + "']").prev('.w-radio-input').addClass('w--redirected-checked');
		$("#needs_help_" + storage_needs_help.toLowerCase()).parent().css( "backgroundColor", "#48bd9d" );
		$("#needs_help_" + storage_needs_help.toLowerCase()).parent().css( "border", "#48bd9e" );
		$("#needs_help_" + storage_needs_help.toLowerCase()).parent().css( "color", "#ffffff" );

		if ($("input[name='needs_help']").is(':checked') ) {
			$('#needs-help-alert-required').hide(500);
			document.getElementById("needs-step").disabled = false;
			$needs_next.toggleClass(className, true);
			needs_help_selected = $("input[name='needs_help']:checked").val();
		} else {
//			document.getElementById("needs-step").disabled = true;
			$needs_next.toggleClass(className, false);
		}

  }

  if (storage_dob !== null && storage_age !== null) {
		const parts = storage_dob.split('-'); // split date string into array of parts
		const year = parts[0]; // extract year
		const month = parts[1]; // extract month
		const day = parts[2]; // extract day

		$dob_year.val(year);
		$dob_month.val(month);
		$dob_day.val(day);

		DOBresult = checkDOB($form);
		submitButtonCheck("dob");
	}

	if (storage_annual_income !== null) {
		$annual_income.val(storage_annual_income);
		DOBresult = checkDOB($form);
		submitButtonCheck("income");
	}

  if (storage_home_ownership !== null) {
	  $("input[name='home_ownership'][value='" + storage_home_ownership + "']").prop("checked", true);
		$("input[name='home_ownership'][value='" + storage_home_ownership + "']").prev('.w-radio-input').addClass('w--redirected-checked');
		$("#home_ownership_" + storage_home_ownership.toLowerCase()).parent().css( "backgroundColor", "#48bd9d" );
		$("#home_ownership_" + storage_home_ownership.toLowerCase()).parent().css( "border", "#48bd9e" );
		$("#home_ownership_" + storage_home_ownership.toLowerCase()).parent().css( "color", "#ffffff" );

		if ($("input[name='home_ownership']").is(':checked') ) {
			$('#home-ownership-alert-required').hide(500);
			document.getElementById("home-step").disabled = false;
			$home_next.toggleClass(className, true);
			home_ownership_selected = $("input[name='home_ownership']:checked").val();
		} else {
//			document.getElementById("home-step").disabled = true;
			$home_next.toggleClass(className, false);
		}

  }

  if (storage_mortgage !== null) {
	  $("input[name='mortgage'][value='" + storage_mortgage + "']").prop("checked", true);
		$("input[name='mortgage'][value='" + storage_mortgage + "']").prev('.w-radio-input').addClass('w--redirected-checked');
		$("#mortgage_" + storage_mortgage.toLowerCase()).parent().css( "backgroundColor", "#48bd9d" );
		$("#mortgage_" + storage_mortgage.toLowerCase()).parent().css( "border", "#48bd9e" );
		$("#mortgage_" + storage_mortgage.toLowerCase()).parent().css( "color", "#ffffff" );

		if ($("input[name='mortgage']").is(':checked') ) {
			$('#mortgage-alert-required').hide(500);
			document.getElementById("mortgage-step").disabled = false;
			$mortgage_next.toggleClass(className, true);
			mortgage_selected = $("input[name='mortgage']:checked").val();
		} else {
//			document.getElementById("mortgage-step").disabled = true;
			$mortgage_next.toggleClass(className, false);
		}

  }

	if (storage_mortgage_balance !== null) {
		$mortgage_input.val(storage_mortgage_balance);
		submitButtonCheck("mortgage-balance");
	}

	if (storage_debts !== null) {
		$debts_input.val(storage_debts);
		submitButtonCheck("debts");
	}

  if (storage_children !== null) {
	  $("input[name='children'][value='" + storage_children + "']").prop("checked", true);
		$("input[name='children'][value='" + storage_children + "']").prev('.w-radio-input').addClass('w--redirected-checked');
		$("#children_" + storage_children.toLowerCase()).parent().css( "backgroundColor", "#48bd9d" );
		$("#children_" + storage_children.toLowerCase()).parent().css( "border", "#48bd9e" );
		$("#children_" + storage_children.toLowerCase()).parent().css( "color", "#ffffff" );

		if ($("input[name='children']").is(':checked') ) {
			$('#children-alert-required').hide(500);
			document.getElementById("children-step").disabled = false;
			$children_next.toggleClass(className, true);
			children_selected = $("input[name='children']:checked").val();
		} else {
//			document.getElementById("children-step").disabled = true;
			$children_next.toggleClass(className, false);
		}

  }

	if (storage_children_num !== null) {
		$children_num_input.val(storage_children_num);
		if (storage_child_age_1 !== null) {$('#child-age-input-1').val(storage_child_age_1);}
		if (storage_child_age_2 !== null) {$('#child-age-input-2').val(storage_child_age_2);}
		if (storage_child_age_3 !== null) {$('#child-age-input-3').val(storage_child_age_3);}
		if (storage_child_age_4 !== null) {$('#child-age-input-4').val(storage_child_age_4);}
		if (storage_child_age_5 !== null) {$('#child-age-input-5').val(storage_child_age_5);}
		if (storage_child_age_6 !== null) {$('#child-age-input-6').val(storage_child_age_6);}
		if (storage_child_age_7 !== null) {$('#child-age-input-7').val(storage_child_age_7);}
		if (storage_child_age_8 !== null) {$('#child-age-input-8').val(storage_child_age_8);}
		if (storage_child_age_9 !== null) {$('#child-age-input-9').val(storage_child_age_9);}
		submitButtonCheck("children-num");
	}

	if (storage_childcare !== null) {
		$childcare_input.val(storage_childcare);
		submitButtonCheck("childcare");
	}

  if (storage_college_type_preference !== null) {
	  $("input[name='college_type_preference'][value='" + storage_college_type_preference + "']").prop("checked", true);
		$("input[name='college_type_preference'][value='" + storage_college_type_preference + "']").prev('.w-radio-input').addClass('w--redirected-checked');
		$("#college_" + storage_college_type_preference.toLowerCase()).parent().css( "backgroundColor", "#48bd9d" );
		$("#college_" + storage_college_type_preference.toLowerCase()).parent().css( "border", "#48bd9e" );
		$("#college_" + storage_college_type_preference.toLowerCase()).parent().css( "color", "#ffffff" );

		if ($("input[name='college_type_preference']").is(':checked') ) {
			$('#college-alert-required').hide(500);
			document.getElementById("college-step").disabled = false;
			$college_next.toggleClass(className, true);
			college_selected = $("input[name='college_type_preference']:checked").val();
		} else {
//			document.getElementById("college-step").disabled = true;
			$college_next.toggleClass(className, false);
		}

  }

	if (storage_college_savings !== null) {
		$college_savings_input.val(storage_college_savings);
		submitButtonCheck("college-savings");
	}

	if (storage_savings !== null) {
		$savings_input.val(storage_savings);
		submitButtonCheck("savings");
	}

	if (storage_current_insurance !== null) {
		$current_insurance_input.val(storage_current_insurance);
		submitButtonCheck("current-insurance");
		setupSummaryPage();
	}


/* STEP 4 - Set up listeners on each field for input events & validate all date entry fields */
	$goals.on('change', 'input, select, textarea', function() {
		if (enabled) {
			submitButtonCheck("goals");
		}
	});

	$('#goals-step').click(function(e) {
		goal_errors =	submitButtonCheck("goals");
		if (goal_errors) {
			e.preventDefault();
			$('#goals-alert-required').show(500);
			document.getElementById("goals-step").disabled = true;
			$goals_next.toggleClass(className, false);
		} else {
			$('.w-round div:nth-child(2)').trigger('tap');
		}
	});

	/*** Step 2 ***/
	$dependents = $form.find('.dependents');
	$dependents.on('change', 'input, select, textarea', function() {
		if (enabled) {
			submitButtonCheck("dependents");
		}
	});

	$('#dependents-step').click(function(e) {
		dependent_errors =	submitButtonCheck("dependents");
		if (dependent_errors) {
			e.preventDefault();
			$('#dependents-alert-required').show(500);
			document.getElementById("dependents-step").disabled = true;
			$dependents_next.toggleClass(className, false);
		} else {
			$('.w-round div:nth-child(3)').trigger('tap');
		}
	});

	$('#dependents-prev').click(function(e) {
		e.preventDefault();
		$('.w-round div:nth-child(1)').trigger('tap');
	});

	/*** Step 3 ***/
	$("input[name='needs_help']").keypress(function(event) {
		if (event.keyCode == 13) {
			event.preventDefault();}
	});

	$needshelp.on('change', 'input, select, textarea', function() {
		if (enabled) {
			submitButtonCheck("needs-help");
		}
	});

	$('#needs-step').click(function(e) {
		e.preventDefault();

		if ( needs_help_selected !== undefined ) {
			$('#needs-help-alert-required').hide(500);
			if (needs_help_selected == "Yes") {
				$('.w-round div:nth-child(4)').trigger('tap');
			} else {
				location.href = '/life-quote-basics-slider';
			}
		} else {
			$('#needs-help-alert-required').show(500);
		}
	});

	$('#needs-prev').click(function(e) {
		e.preventDefault();
		$('.w-round div:nth-child(2)').trigger('tap');
	});

	/*** Step 4 ***/
	$('#dob_month').keypress(function(event) {
		if (event.keyCode == 13) {
			event.preventDefault();}
	});
	$('#dob_day').keypress(function(event) {
		if (event.keyCode == 13) {
			event.preventDefault();}
	});
	$('#dob_year').keypress(function(event) {
		if (event.keyCode == 13) {
			event.preventDefault();}
	});
 
	$('#dob_month').on('input.True', function() {
		this.value = monthValuesCheck(this.value);
		DOBresult = checkDOB($form);
		submitButtonCheck("dob");
	});
	$('#dob_day').on('input.True', function() {
		this.value = dayValuesCheck(this.value);
		DOBresult = checkDOB($form);
		submitButtonCheck("dob");
	});
	$('#dob_year').on('input.True', function() {
		this.value = yearValuesCheck(this.value);
		DOBresult = checkDOB($form);
		submitButtonCheck("dob");
	});

	$('#dob-step').click(function(e) {
		e.preventDefault();

		if(dob_error_req == true && dob_error_age == true){
			$('#dob-alert-required').hide(500);
			$('#dob-alert-age').show(500);
		} else {
			if (dob_error_req == true) {
				$('#dob-alert-required').show(500);
				$('#dob-alert-age').hide(500);
			} else {
				if (dob_error_age  == true) {
					$('#dob-alert-required').hide(500);
					$('#dob-alert-age').show(500);
				} else {
					$('#dob-alert-required').hide(500);
					$('#dob-alert-age').hide(500);
					$('.w-round div:nth-child(5)').trigger('tap');
				}
			}
		}
	});

	$('#dob-prev').click(function(e) {
		e.preventDefault();
		$('.w-round div:nth-child(3)').trigger('tap');
	});

	/***Step 5 ***/
	$('#income-input').keypress(function(event) {
		if (event.keyCode == 13) {
			event.preventDefault();
		}
	});
	$('#income-input').on('input.True', function() {
		DOBresult = checkDOB($form);
		submitButtonCheck("income");
	});

	$('#income-step').click(function(e) {
		e.preventDefault();

		if (income_error) {
			e.preventDefault();
			$('#income-alert-required').show(500);
			document.getElementById("income-step").disabled = true;
			$income_next.toggleClass(className, false);
		} else {
			$('#income-alert-required').hide(500);
			$('.w-round div:nth-child(6)').trigger('tap');
		}
	});
  
	$('#income-prev').click(function(e) {
		e.preventDefault();
		$('.w-round div:nth-child(4)').trigger('tap');
	});

	/*** Step 6 ***/
	$("input[name='home_ownership']").keypress(function(event) {
		if (event.keyCode == 13) {
			event.preventDefault();}
	});

	$homeownership.on('change', 'input, select, textarea', function() {
		if (enabled) {
			submitButtonCheck("home-ownership");
		}
	});

	$('#home-step').click(function(e) {
		e.preventDefault();
		if ( home_ownership_selected !== undefined ) {
			$('#home-ownership-alert-required').hide(500);

			if (home_ownership_selected == "No") {
				setTimeout(function() {$('.w-round div:nth-child(9)').trigger('tap'); }, 500); // Skip questions about mortgage, and go directly to 'other debts' page
			} else {
				setTimeout(function() {$('.w-round div:nth-child(7)').trigger('tap'); }, 500); // Go to page that asks if user has a mortgage on the home
			}
		} else {
			$('#home-ownership-alert-required').show(500);
		}
	});

	$('#home-prev').click(function(e) {
		e.preventDefault();
		$('.w-round div:nth-child(5)').trigger('tap');
	});

	/*** Step 7 ***/
	$("input[name='mortgage']").keypress(function(event) {
		if (event.keyCode == 13) {
			event.preventDefault();}
	});

	$mortgage.on('change', 'input, select, textarea', function() {
		if (enabled) {
			submitButtonCheck("mortgage");
		}
	});

	$('#mortgage-step').click(function(e) {
		e.preventDefault();

		if ( mortgage_selected !== undefined ) {
			$('#mortgage-alert-required').hide(500);

			if (mortgage_selected == "No") {
				setTimeout(function() {$('.w-round div:nth-child(9)').trigger('tap'); }, 500); // Skip questions about mortgage, and go directly to 'other debts' page
			} else {
				setTimeout(function() {$('.w-round div:nth-child(8)').trigger('tap'); }, 500); // Go to page that inquires about mortgage balance 
			}
		} else {
			$('#mortgage-alert-required').show(500);
		}

	});

	$('#mortgage-prev').click(function(e) {
		e.preventDefault();
		$('.w-round div:nth-child(6)').trigger('tap');
	});

	/*** Step 8 ***/
	$('#mortgage-input').keypress(function(event) {
		if (event.keyCode == 13) {
			event.preventDefault();
		}
	});
	$('#mortgage-input').on('input.True', function() {
		submitButtonCheck("mortgage-balance");
	});

	$('#mortgage-balance-step').click(function(e) {
		e.preventDefault();

		if (mortgagebalance_error) {
			e.preventDefault();
			$('#mortgage-balance-alert-required').show(500);
			document.getElementById("mortgage-balance-step").disabled = true;
			$mortgagebalance_next.toggleClass(className, false);
		} else {
			$('#mortgage-balance-alert-required').hide(500);
			$('.w-round div:nth-child(9)').trigger('tap');
		}
	});
  
	$('#mortgage-balance-prev').click(function(e) {
		e.preventDefault();
		$('.w-round div:nth-child(7)').trigger('tap');
	});

	/*** Step 9 ***/
	$('#debts-input').keypress(function(event) {
		if (event.keyCode == 13) {
			event.preventDefault();
		}
	});
	$('#debts-input').on('input.True', function() {
		submitButtonCheck("debts");
	});

	$('#debts-step').click(function(e) {
		e.preventDefault();

		if (debts_error) {
			e.preventDefault();
			$('#debts-alert-required').show(500);
			document.getElementById("debts-step").disabled = true;
			$debts_next.toggleClass(className, false);
		} else {
			$('#debts-alert-required').hide(500);
			$('.w-round div:nth-child(10)').trigger('tap');
		}
	});
  
	$('#debts-prev').click(function(e) {
		e.preventDefault();

		if (home_ownership_selected == "No") {
			$('.w-round div:nth-child(6)').trigger('tap'); // Skip questions about mortgage, and go back to 'do you own your home?' page
		} else if (home_ownership_selected == "Yes" && mortgage_selected == "No") {
			$('.w-round div:nth-child(7)').trigger('tap'); // Skip question about mortgage balance, and go back to 'do you have a mortgage?' page
		} else if (home_ownership_selected == "Yes" && mortgage_selected == "Yes") {
			$('.w-round div:nth-child(8)').trigger('tap'); // Since user indicated they own home and have mortgage, go to page that asks about mortgage balance
		}

	});

	/*** Step 10 ***/
	$("input[name='children']").keypress(function(event) {
		if (event.keyCode == 13) {
			event.preventDefault();}
	});

	$children.on('change', 'input, select, textarea', function() {
		if (enabled) {
			submitButtonCheck("children");
		}
	});

	$('#children-step').click(function(e) {
		e.preventDefault();

		if ( children_selected !== undefined ) {
			$('#children-alert-required').hide(500);

			if (children_selected == "No") {
				setTimeout(function() {$('.w-round div:nth-child(15)').trigger('tap'); }, 500); // Skip questions about kids, childcare and college, and go directly to 'savings' page
			} else {
				setTimeout(function() {$('.w-round div:nth-child(11)').trigger('tap'); }, 500); // Go to page that asks for number of children under age 18
			}
		} else {
			$('#children-alert-required').show(500);
		}

/*		if ( ! $("input[name='Children']").is(':checked') ) {
			$('#children-alert-required').show(500);
		} else {
			$('#children-alert-required').hide(500);
			$('.w-round div:nth-child(11)').trigger('tap');
		} */
	});

	$('#children-prev').click(function(e) {
		e.preventDefault();
		$('.w-round div:nth-child(9)').trigger('tap');
	});

	/*** Step 11 ***/
	$('#children-num-input').keypress(function(event) {
		if (event.keyCode == 13) {
			event.preventDefault();
		}
	});
	$('.childage').keypress(function(event) {
		if (event.keyCode == 13) {
			event.preventDefault();
		}
	});

	$('#children-num-input').on('input.True', function() {
		submitButtonCheck("children-num");
	});
	$('.childage').on('input.True', function() {
		submitButtonCheck("child-age");
	});

	$('#children-num-step').click(function(e) {
		e.preventDefault();

		if (children_num_error) {
			e.preventDefault();
			$('#children-num-alert-required').show(500);
			document.getElementById("children-num-step").disabled = true;
			$children_num_next.toggleClass(className, false);
		} else {
			$('#children-num-alert-required').hide(500);
      
      if (children_age_error) {
					e.preventDefault();
					$('#children-age-alert-required').show(500);
					document.getElementById("children-num-step").disabled = true;
					$children_num_next.toggleClass(className, false);
			} else {
					$('#children-age-alert-required').hide(500);
					$('.w-round div:nth-child(12)').trigger('tap');
      }
		}
	});
  
	$('#children-num-prev').click(function(e) {
		e.preventDefault();
		$('.w-round div:nth-child(10)').trigger('tap');
	});

	/*** Step 12 ***/
$('#childcare-input').keypress(function(event) {
		if (event.keyCode == 13) {
			event.preventDefault();
		}
	});
	$('#childcare-input').on('input.True', function() {
		submitButtonCheck("childcare");
	});

	$('#childcare-step').click(function(e) {
		e.preventDefault();

		if (childcare_error) {
			e.preventDefault();
			$('#childcare-alert-required').show(500);
			document.getElementById("childcare-step").disabled = true;
			$childcare_next.toggleClass(className, false);
		} else {
			$('#childcare-alert-required').hide(500);
			$('.w-round div:nth-child(13)').trigger('tap');
		}
	});
  
	$('#childcare-prev').click(function(e) {
		e.preventDefault();
		$('.w-round div:nth-child(11)').trigger('tap');
	});

	/*** Step 13 ***/
	$("input[name='college_type_preference']").keypress(function(event) {
		if (event.keyCode == 13) {
			event.preventDefault();}
	});

	$college.on('change', 'input, select, textarea', function() {
		if (enabled) {
			submitButtonCheck("college");
		}
	});

	$('#college-step').click(function(e) {
		e.preventDefault();

		if ( ! $("input[name='college_type_preference']").is(':checked') ) {
			$('#college-alert-required').show(500);
		} else {
			$('#college-alert-required').hide(500);
			$('.w-round div:nth-child(14)').trigger('tap');
		}
	});

	$('#college-prev').click(function(e) {
		e.preventDefault();
		$('.w-round div:nth-child(12)').trigger('tap');
	});

	/*** Step 14 ***/
	$('#college-savings-input').keypress(function(event) {
		if (event.keyCode == 13) {
			event.preventDefault();
		}
	});
	$('#college-savings-input').on('input.True', function() {
		submitButtonCheck("college-savings");
	});

	$('#college-savings-step').click(function(e) {
		e.preventDefault();

		if (college_savings_error) {
			e.preventDefault();
			$('#college-savings-alert-required').show(500);
			document.getElementById("college-savings-step").disabled = true;
			$college_savings_next.toggleClass(className, false);
		} else {
			$('#college-savings-alert-required').hide(500);
			$('.w-round div:nth-child(15)').trigger('tap');
		}
	});
  
	$('#college-savings-prev').click(function(e) {
		e.preventDefault();
		$('.w-round div:nth-child(13)').trigger('tap');
	});

	/*** Step 15 ***/
	$('#savings-input').keypress(function(event) {
		if (event.keyCode == 13) {
			event.preventDefault();
		}
	});
	$('#savings-input').on('input.True', function() {
		submitButtonCheck("savings");
	});

	$('#savings-step').click(function(e) {
		e.preventDefault();

		if (savings_error) {
			e.preventDefault();
			$('#savings-alert-required').show(500);
			document.getElementById("savings-step").disabled = true;
			$savings_next.toggleClass(className, false);
		} else {
			$('#savings-alert-required').hide(500);
			$('.w-round div:nth-child(16)').trigger('tap');
		}
	});
  
	$('#savings-prev').click(function(e) {
		e.preventDefault();

		if (children_selected == "No") {
			$('.w-round div:nth-child(10)').trigger('tap'); // Skip questions about children & college, and go back to 'do you have children?' page
		} else {
			$('.w-round div:nth-child(14)').trigger('tap'); // go back to last question page, which asks about college savings
		}
	});

	/*** Step 16 ***/
	$('#current-insurance-input').keypress(function(event) {
		if (event.keyCode == 13) {
			event.preventDefault();
		}
	});
	$('#current-insurance-input').on('input.True', function() {
		submitButtonCheck("current-insurance");
	});

	$('#current-insurance-step').click(function(e) {
		e.preventDefault();

		if (current_insurance_error) {
			$('#current-insurance-alert-required').show(500);
			document.getElementById("current-insurance-step").disabled = true;
			$current_insurance_next.toggleClass(className, false);
		} else {
			$('#current-insurance-alert-required').hide(500);
//			location.href = '/life-quote-basics-slider';

			setupSummaryPage();
/*
		$('#result_income').val(storage.getItem('coverage_recommendation'));
		$('#result_mortgage').val(storage.getItem('mortgage_balance'));
		$('#result_debts').val(storage.getItem('debts'));
		$('#result_childcare').val(storage.getItem('childcare'));
*/
//		storage.getItem('children_num')

			$('.w-round div:nth-child(17)').trigger('tap');
		}
	});
  
	$('#current-insurance-prev').click(function(e) {
		e.preventDefault();
		$('.w-round div:nth-child(15)').trigger('tap');
	});

	$('#final-summary-step').click(function(e) {
		e.preventDefault();

		var calculated_insurance_need = Number(storage.getItem('total_insurance_need').replace(/,/g, ''));
		
		if (calculated_insurance_need > 5000000) {
			storage.setItem('coverage_recommendation', 5000000);
		} else {
			storage.setItem('coverage_recommendation', calculated_insurance_need);
		}
		storage.setItem('coverage_recommendation_uncapped', calculated_insurance_need);
    storage.setItem('coverage_recommendation_method', "Detailed Needs Builder");

		setTimeout(function() {
			location.href = '/life-quote-basics-slider';
		}, 1000);

	});
  
	$('#final-summary-prev').click(function(e) {
		e.preventDefault();
		$('.w-round div:nth-child(16)').trigger('tap');
	});


	function submitButtonCheck(page) {
  	if (page == "goals") {
  		var income_CB = document.getElementById('goal_income').checked,
	  			mortgage_CB = document.getElementById('goal_mortgage').checked,
		  		debts_CB = document.getElementById('goal_debts').checked,
			  	education_CB = document.getElementById('goal_education').checked,
				  funeral_CB = document.getElementById('goal_funeral').checked,
				  charity_CB = document.getElementById('goal_charity').checked;

			if (income_CB || mortgage_CB || debts_CB || education_CB || funeral_CB || charity_CB) {
					$('#goals-alert-required').hide(500);
					document.getElementById("goals-step").disabled = false;
					$goals_next.toggleClass(className, true);
					goal_errors = false;
					storage.setItem('goals_income', income_CB);
					storage.setItem('goals_mortgage', mortgage_CB);
					storage.setItem('goals_debts', debts_CB);
					storage.setItem('goals_education', education_CB);
					storage.setItem('goals_funeral', funeral_CB);
					storage.setItem('goals_charity', charity_CB);
			} else {
					document.getElementById("goals-step").disabled = true;
					$goals_next.toggleClass(className, false);
					goal_errors = true;
			}
			return goal_errors;
		}

  	if (page == "dependents") {
  		var spouse_CB = document.getElementById('dependent_spouse').checked,
	  			children_CB = document.getElementById('dependent_children').checked,
		  		parent_CB = document.getElementById('dependent_parent').checked,
			  	other_CB = document.getElementById('dependent_other').checked;

			if (spouse_CB || children_CB || parent_CB || other_CB) {
					$('#dependents-alert-required').hide(500);
					document.getElementById("dependents-step").disabled = false;
					$dependents_next.toggleClass(className, true);
					dependent_errors = false;
					storage.setItem('dependent_spouse', spouse_CB);
					storage.setItem('dependent_children', children_CB);
					storage.setItem('dependent_parent', parent_CB);
					storage.setItem('dependent_other', other_CB);
			} else {
					document.getElementById("dependents-step").disabled = true;
					$dependents_next.toggleClass(className, false);
					dependent_errors = true;
			}
			return dependent_errors;
		}

		if (page == "needs-help") {
		if ($("input[name='needs_help']").is(':checked') ) {
			$('#needs-help-alert-required').hide(500);
			document.getElementById("needs-step").disabled = false;
			$needs_next.toggleClass(className, true);
			needs_help_selected = $("input[name='needs_help']:checked").val();
			storage.setItem('needs_help', needs_help_selected);
			if (needs_help_selected == "Yes") {
				setTimeout(function() {$('.w-round div:nth-child(4)').trigger('tap'); }, 500);
			} else {
				setTimeout(function() {
					location.href = '/life-quote-basics-slider';
				}, 1000);
			}
		} else {
			document.getElementById("needs-step").disabled = true;
			$needs_next.toggleClass(className, false);
		}
		}

  	if (page == "dob") {
		dob = DOBresult[0];
		adj_age = DOBresult[1];
		dob_error_req = DOBresult[2];
		dob_error_age = DOBresult[3];
		document.getElementById("dob").value = dob;
		document.getElementById("age").value = adj_age;

		if ($dob_month.val() != '' && /^([\w]{1,2})?$/.test($dob_month.val()) &&
				$dob_day.val() != '' && /^([\w]{1,2})?$/.test($dob_day.val()) &&
				$dob_year.val() != '' && /^([\w]{4,4})?$/.test($dob_year.val()) &&
				dob_error_age == false &&
				dob_error_req == false) {
			$('#dob-alert-required').hide(500);
			$('#dob-alert-age').hide(500);
			document.getElementById("dob-step").disabled = false;
			$dob_next.toggleClass(className, true);
			storage.setItem('dob', document.getElementById("dob").value);
			storage.setItem('age', document.getElementById("age").value);
		} else {
			document.getElementById("dob-step").disabled = true;
			$dob_next.toggleClass(className, false);
		}
		}

  	if (page == "income") {
		var income = $('#income-input').val();
    if (income.length == 1 && income == 0) {
    	$('#income-input').val("");
    }
		if (income.length > 5 && income.length < 11) {
			$('#income-alert-required').hide(500);
			document.getElementById("income-step").disabled = false;
			$income_next.toggleClass(className, true);
			income_error = false;
			storage.setItem('annual_income', document.getElementById("income-input").value);
		} else {
			document.getElementById("income-step").disabled = true;
			$income_next.toggleClass(className, false);
			income_error = true;
			storage.setItem('coverage_recommendation', "");
		}
		}

		if (page == "home-ownership") {
		if ($("input[name='home_ownership']").is(':checked') ) {
			$('#home-ownership-alert-required').hide(500);
			document.getElementById("home-step").disabled = false;
			$home_next.toggleClass(className, true);
			home_ownership_selected = $("input[name='home_ownership']:checked").val();
			storage.setItem('home_ownership', home_ownership_selected);
			if (home_ownership_selected == "No") {
				// Clear everything on the 'Do you have a mortgage?' page, in case anything on that page had previously been selected
				$('#mortgage-alert-required').hide(500);
//				document.getElementById("mortgage-step").disabled = true;
				$mortgage_next.toggleClass(className, false);
				storage.setItem('mortgage', "");
				$("input[name='mortgage']").prop('checked',false);
	 			$("input[name='mortgage']").prev('.w-radio-input').removeClass('w--redirected-checked');
				$(".yes_no_button_3").css( "backgroundColor", "#ffffff" );
				$(".yes_no_button_3").css( "border", "#d9d9d9" );
				$(".yes_no_button_3").css( "color", "#707070" );
				mortgage_selected = undefined;

				$('#mortgage-input').val("");
				storage.setItem('mortgage_balance', "");
				$('#mortgage-balance-alert-required').hide(500);
//				document.getElementById("mortgage-balance-step").disabled = true;
				$mortgagebalance_next.toggleClass(className, false);

				setTimeout(function() {$('.w-round div:nth-child(9)').trigger('tap'); }, 500); // Skip questions about mortgage, and go directly to 'other debts' page
			} else {
				setTimeout(function() {$('.w-round div:nth-child(7)').trigger('tap'); }, 500);
			}
		} else {
			document.getElementById("home-step").disabled = true;
			$home_next.toggleClass(className, false);
		}
		}

		if (page == "mortgage") {
		if ($("input[name='mortgage']").is(':checked') ) {
			$('#mortgage-alert-required').hide(500);
			document.getElementById("mortgage-step").disabled = false;
			$mortgage_next.toggleClass(className, true);
			mortgage_selected = $("input[name='mortgage']:checked").val();
			storage.setItem('mortgage', mortgage_selected);

			if (mortgage_selected == "No") {
				$('#mortgage-input').val("");
				storage.setItem('mortgage_balance', "");
				$('#mortgage-balance-alert-required').hide(500);
//				document.getElementById("mortgage-balance-step").disabled = true;
				$mortgagebalance_next.toggleClass(className, false);
				mortgagebalance_error = true;
				setTimeout(function() {$('.w-round div:nth-child(9)').trigger('tap'); }, 500); // Skip questions about mortgage, and go directly to 'other debts' page
			} else {
				setTimeout(function() {$('.w-round div:nth-child(8)').trigger('tap'); }, 500); // Go to page that inquires about mortgage balance 
			}
		} else {
			document.getElementById("mortgage-step").disabled = true;
			$mortgage_next.toggleClass(className, false);
		}
		}

  	if (page == "mortgage-balance") {
		var mortgage_balance = $('#mortgage-input').val();
    if (mortgage_balance.length == 2 && mortgage_balance.startsWith('0')) {
			mortgage_balance = mortgage_balance.substring(1);
    	$('#mortgage-input').val(mortgage_balance);
    }
		if (mortgage_balance.length > 0 && mortgage_balance.length < 10) {
			$('#mortgage-balance-alert-required').hide(500);
			document.getElementById("mortgage-balance-step").disabled = false;
			$mortgagebalance_next.toggleClass(className, true);
			mortgagebalance_error = false;
			storage.setItem('mortgage_balance', document.getElementById("mortgage-input").value);
		} else {
			document.getElementById("mortgage-balance-step").disabled = true;
			$mortgagebalance_next.toggleClass(className, false);
			mortgagebalance_error = true;
		}
		}

  	if (page == "debts") {
		var debts = $('#debts-input').val();
    if (debts.length == 2 && debts.startsWith('0')) {
			debts = debts.substring(1);
    	$('#debts-input').val(debts);
    }
		if (debts.length > 0 && debts.length < 10) {
			$('#debts-alert-required').hide(500);
			document.getElementById("debts-step").disabled = false;
			$debts_next.toggleClass(className, true);
			debts_error = false;
			storage.setItem('debts', document.getElementById("debts-input").value);
		} else {
			document.getElementById("debts-step").disabled = true;
			$debts_next.toggleClass(className, false);
			debts_error = true;
		}
		}

		if (page == "children") {
		if ($("input[name='children']").is(':checked') ) {
			$('#children-alert-required').hide(500);
			document.getElementById("children-step").disabled = false;
			$children_next.toggleClass(className, true);
			children_selected = $("input[name='children']:checked").val();
			storage.setItem('children', children_selected);

			if (children_selected == "No") {
				// Clear everything on the pages that deal with children, in case anything on that page had previously been selected
				$('#children-num-input').val("");
				storage.setItem('children_num', "");
				$('#children_num-alert-required').hide(500);
//				document.getElementById("children-num-step").disabled = true;
				$children_num_next.toggleClass(className, false);
				children_num_error = true;
				children_age_error = true;

				let x = 9;
				while (x > 0) {
						$('#child_age_wrapper_'+x).hide(500);

						if ($('#child-age-input-' + x).val().length > 0) {
								storage.setItem('child_age_'+x, "");
								$('#child-age-input-' + x).val("");
						}
						x--;
				}


				$('#childcare-input').val("");
				storage.setItem('childcare', "");
				$('#childcare-alert-required').hide(500);
//				document.getElementById("childcare-step").disabled = true;
				$childcare_next.toggleClass(className, false);
				childcare_error = true;


				$('#college-alert-required').hide(500);
//				document.getElementById("college-step").disabled = true;
				$college_next.toggleClass(className, false);
				storage.setItem('college_type_preference', "");

				$("input[name='college_type_preference']").prop('checked',false);
	 			$("input[name='college_type_preference']").prev('.w-radio-input').removeClass('w--redirected-checked');
				$(".yes_no_button_5").css( "backgroundColor", "#ffffff" );
				$(".yes_no_button_5").css( "border", "#d9d9d9" );
				$(".yes_no_button_5").css( "color", "#707070" );
				college_selected = undefined;


				$('#college-savings-input').val("");
				storage.setItem('college_savings', "");
				$('#college-savings-required').hide(500);
//				document.getElementById("college-savings-step").disabled = true;
				$college_savings_next.toggleClass(className, false);
				college_savings_error = true;

				setTimeout(function() {$('.w-round div:nth-child(15)').trigger('tap'); }, 500); // Skip questions about kids, childcare and college, and go directly to 'savings' page
			} else {
				setTimeout(function() {$('.w-round div:nth-child(11)').trigger('tap'); }, 500); // Go to page that asks for number of children under age 18
			}

		} else {
			document.getElementById("children-step").disabled = true;
			$children_next.toggleClass(className, false);
		}
		}

  	if (page == "children-num") {
		var children_num = $('#children-num-input').val();
		if (children_num.length > 0 && children_num.length < 2) {
			$('#children-num-alert-required').hide(500);
			children_num_error = false;
			storage.setItem('children_num', document.getElementById("children-num-input").value);

			let i = 1;
			while (i < Number(children_num) + 1) {
					$('#child_age_wrapper_'+i).show(500);
					i++;
			}
			let x = 9;
			while (x > Number(children_num) ) {
					$('#child_age_wrapper_'+x).hide(500);

					if ($('#child-age-input-' + x).val().length > 0) {
							storage.setItem('child_age_'+x, "");
							$('#child-age-input-' + x).val("");
					}
					x--;
			}
		} else {
			document.getElementById("children-num-step").disabled = true;
			$children_num_next.toggleClass(className, false);
			children_num_error = true;
		}
		}
    
  	if (page == "child-age") {
		var children_num = $('#children-num-input').val();
		let y = 1;
		while (y < Number(children_num) + 1) {
			var child_age = $('#child-age-input-' + y).val();
			if (child_age.length > 0 && child_age.length < 3 && child_age < 19) {
				children_age_error = false;
				document.getElementById("children-num-step").disabled = false;
				$children_num_next.toggleClass(className, true);
				storage.setItem('child_age_'+y, document.getElementById('child-age-input-'+y).value);
			} else {
				children_age_error = true;
				document.getElementById("children-num-step").disabled = true;
				$children_num_next.toggleClass(className, false);
 		    break;
			}
			y++;
		}
		if (children_age_error) {
				$('#children-age-alert-required').show(500);
		} else {
				$('#children-age-alert-required').hide(500);
		}
	
		}

  	if (page == "childcare") {
		var childcare = $('#childcare-input').val();
    if (childcare.length == 2 && childcare.startsWith('0')) {
			childcare = childcare.substring(1);
    	$('#childcare-input').val(childcare);
    }
		if (childcare.length > 0 && childcare.length < 10) {
			$('#childcare-alert-required').hide(500);
			document.getElementById("childcare-step").disabled = false;
			$childcare_next.toggleClass(className, true);
			childcare_error = false;
			storage.setItem('childcare', document.getElementById("childcare-input").value);
		} else {
			document.getElementById("childcare-step").disabled = true;
			$childcare_next.toggleClass(className, false);
			childcare_error = true;
		}
		}

		if (page == "college") {
		if ($("input[name='college_type_preference']").is(':checked') ) {
			$('#college-alert-required').hide(500);
			document.getElementById("college-step").disabled = false;
			$college_next.toggleClass(className, true);
			college_selected = $("input[name='college_type_preference']:checked").val();
			storage.setItem('college_type_preference', college_selected);
			setTimeout(function() {$('.w-round div:nth-child(14)').trigger('tap'); }, 500);
		} else {
			document.getElementById("college-step").disabled = true;
			$college_next.toggleClass(className, false);
		}
		}

  	if (page == "college-savings") {
		var college_savings = $('#college-savings-input').val();
    if (college_savings.length == 2 && college_savings.startsWith('0')) {
			college_savings = college_savings.substring(1);
    	$('#college-savings-input').val(college_savings);
    }
		if (college_savings.length > 0 && college_savings.length < 10) {
			$('#college-savings-alert-required').hide(500);
			document.getElementById("college-savings-step").disabled = false;
			$college_savings_next.toggleClass(className, true);
			college_savings_error = false;
			storage.setItem('college_savings', document.getElementById("college-savings-input").value);
		} else {
			document.getElementById("college-savings-step").disabled = true;
			$college_savings_next.toggleClass(className, false);
			college_savings_error = true;
		}
		}

  	if (page == "savings") {
		var savings = $('#savings-input').val();
    if (savings.length == 2 && savings.startsWith('0')) {
			savings = savings.substring(1);
    	$('#savings-input').val(savings);
    }
		if (savings.length > 0 && savings.length < 11) {
			$('#savings-alert-required').hide(500);
			document.getElementById("savings-step").disabled = false;
			$savings_next.toggleClass(className, true);
			savings_error = false;
			storage.setItem('savings', document.getElementById("savings-input").value);
		} else {
			document.getElementById("savings-step").disabled = true;
			$savings_next.toggleClass(className, false);
			savings_error = true;
		}
		}

  	if (page == "current-insurance") {
		var current_insurance = $('#current-insurance-input').val();
    if (current_insurance.length == 2 && current_insurance.startsWith('0')) {
			current_insurance = current_insurance.substring(1);
    	$('#current-insurance-input').val(current_insurance);
    }
		if (current_insurance.length > 0 && current_insurance.length < 11) {
			$('#current-insurance-alert-required').hide(500);
			document.getElementById("current-insurance-step").disabled = false;
			$current_insurance_next.toggleClass(className, true);
			current_insurance_error = false;
			storage.setItem('current_insurance', document.getElementById("current-insurance-input").value);

			setupSummaryPage();

		} else {
			document.getElementById("current-insurance-step").disabled = true;
			$current_insurance_next.toggleClass(className, false);
			current_insurance_error = true;
		}
		}

	}

	function setupSummaryPage() {

		var coverage_rec = storage.getItem('coverage_recommendation'),
				coverage_rec_uncapped = storage.getItem('coverage_recommendation_uncapped'),
				coverage_rec_method = storage.getItem('coverage_recommendation_method'),

				formatted_coverage_rec = formatter.format(coverage_rec_uncapped).toString(),
				replacement_income = formatted_coverage_rec.slice(0, formatted_coverage_rec.length - 3),

				annual_income = Number(storage.getItem('annual_income').replace(/,/g, '')),

				mortgage_balance = Number(storage.getItem('mortgage_balance').replace(/,/g, '')),
				formatted_mortgage_balance = formatter.format(mortgage_balance).toString(),
				result_mortgage = formatted_mortgage_balance.slice(0, formatted_mortgage_balance.length - 3),

				debts = Number(storage.getItem('debts').replace(/,/g, '')),
				formatted_debts = formatter.format(debts).toString(),
				result_debts = formatted_debts.slice(0, formatted_debts.length - 3),

				children_num = Number(storage.getItem('children_num')),

				childcare = Number(storage.getItem('childcare').replace(/,/g, '')),
				formatted_childcare = formatter.format(childcare).toString(),
				result_childcare = formatted_childcare.slice(0, formatted_childcare.length - 3),

				college_savings = Number(storage.getItem('college_savings').replace(/,/g, '')),
				college_type_preference = storage.getItem('college_type_preference'),
				private_college_per_year = 53430, // https://research.collegeboard.org/trends/college-pricing/
        public_college_per_year = 23250,
        college_costs,
        final_expense = 20000,
				result_final_expense = "$20,000",

				savings = Number(storage.getItem('savings').replace(/,/g, '')),

				current_insurance = Number(storage.getItem('current_insurance').replace(/,/g, '')),
				formatted_current_insurance = formatter.format(current_insurance).toString(),
				result_current_insurance = formatted_current_insurance.slice(0, formatted_current_insurance.length - 3);

		switch (college_type_preference) {
			case "Private":
				college_costs = private_college_per_year * 4 * children_num;
      	break;
      case "Public":
				college_costs = public_college_per_year * 4 * children_num;
      	break;
			default:
				college_costs = 0;
		}

		var college_expenses = college_costs - college_savings,
				formatted_college_expense = formatter.format(college_expenses).toString(),
				result_college = formatted_college_expense.slice(0, formatted_college_expense.length - 3);

		$('#result_income').text(replacement_income);
		$('#result_mortgage').text(result_mortgage);
		$('#result_debts').text(result_debts);
		$('#result_childcare').text(result_childcare);
		$('#result_college').text(result_college);
		$('#result_final_expense').text(result_final_expense);
		$('#result_savings').text("-");
		if (current_insurance > 0) {
			$('#result_other_insurance').text("("+result_current_insurance+")");
		} else {
			$('#result_other_insurance').text(result_current_insurance);
		}

		var total_insurance_need = (Number(coverage_rec_uncapped) + mortgage_balance + debts + childcare + college_expenses + final_expense - current_insurance),
				formatted_total_insurance_need = formatter.format(total_insurance_need).toString(),
				result_total_need = formatted_total_insurance_need.slice(0, formatted_total_insurance_need.length - 3);

    storage.setItem('total_insurance_need', Math.ceil((total_insurance_need) / 100000) * 100000);
		$('#result_total_need').text(result_total_need);

		if(coverage_rec_method !== "") {
			if (Number(coverage_rec_method.slice(15,16)) == 1) {
				$('#coverage_multiple').text(coverage_rec_method.slice(15,17)+"x");
			} else {
				$('#coverage_multiple').text(coverage_rec_method.slice(15,16)+"x");
			}
		}

	}

});
