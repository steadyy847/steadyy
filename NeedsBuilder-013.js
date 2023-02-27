
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
			needs_help_selected = $("input[name='NeedsHelp']:checked").val(),
			$dob_month = $form.find('input[id="dob_month"]'),
			$dob_day = $form.find('input[id="dob_day"]'),
			$dob_year = $form.find('input[id="dob_year"]'),
			$annual_income = $form.find('input[id="income-input"]'),
			$homeownership = $form.find('.homeownership'),
			home_ownership_selected = $("input[name='HomeOwnership']:checked").val(),
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

	storage.clear();

	$('#quote_initiated_datetime').val(strDateTime);
	storage.setItem('quote_initiated_datetime', strDateTime);

	$('#commit_point').val("0-needs");

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

	/*** Step 1 ***/
	$goals = $form.find('.goals'),
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
	$dependents = $form.find('.dependents'),
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
	$("input[name='NeedsHelp']").keypress(function(event) {
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

		if ( ! $("input[name='NeedsHelp']").is(':checked') ) {
			$('#needs-help-alert-required').show(500);
		} else {
			$('#needs-help-alert-required').hide(500);
			$('.w-round div:nth-child(4)').trigger('tap');
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
	$("input[name='HomeOwnership']").keypress(function(event) {
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

		if ( ! $("input[name='HomeOwnership']").is(':checked') ) {
			$('#home-ownership-alert-required').show(500);
		} else {
			$('#home-ownership-alert-required').hide(500);
			$('.w-round div:nth-child(7)').trigger('tap');
		}
	});

	$('#home-prev').click(function(e) {
		e.preventDefault();
		$('.w-round div:nth-child(5)').trigger('tap');
	});

	/*** Step 7 ***/
	$("input[name='Mortgage']").keypress(function(event) {
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

		if ( ! $("input[name='Mortgage']").is(':checked') ) {
			$('#mortgage-alert-required').show(500);
		} else {
			$('#mortgage-alert-required').hide(500);
			$('.w-round div:nth-child(8)').trigger('tap');
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
		$('.w-round div:nth-child(8)').trigger('tap');
	});

	/*** Step 10 ***/
	$("input[name='Children']").keypress(function(event) {
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

		if ( ! $("input[name='Children']").is(':checked') ) {
			$('#children-alert-required').show(500);
		} else {
			$('#children-alert-required').hide(500);
			$('.w-round div:nth-child(11)').trigger('tap');
		}
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
	$("input[name='College']").keypress(function(event) {
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

		if ( ! $("input[name='College']").is(':checked') ) {
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
		$('.w-round div:nth-child(14)').trigger('tap');
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
		if (current_insurance_error) {
			e.preventDefault();
			$('#current-insurance-alert-required').show(500);
			document.getElementById("current-insurance-step").disabled = true;
			$current_insurance_next.toggleClass(className, false);
		} else {
			$('#current-insurance-alert-required').hide(500);
			storage.setItem('quote_initiated_from_city', document.getElementById("submit_from_city").value);
			storage.setItem('quote_initiated_from_ip_address', document.getElementById("submit_from_ip_address").value);
alert("right before new page");
			location.href = '/life-quote-basics-slider';
//			$('.w-round div:nth-child(17)').trigger('tap');
		}
	});
  
	$('#current-insurance-prev').click(function(e) {
		e.preventDefault();
		$('.w-round div:nth-child(15)').trigger('tap');
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
		if ($("input[name='NeedsHelp']").is(':checked') ) {
			$('#needs-help-alert-required').hide(500);
			document.getElementById("needs-step").disabled = false;
			$needs_next.toggleClass(className, true);
			needs_help_selected = $("input[name='NeedsHelp']:checked").val();
			storage.setItem('needs_help', needs_help_selected);
			setTimeout(function() {$('.w-round div:nth-child(4)').trigger('tap'); }, 500);
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
		if ($("input[name='HomeOwnership']").is(':checked') ) {
			$('#home-ownership-alert-required').hide(500);
			document.getElementById("home-step").disabled = false;
			$home_next.toggleClass(className, true);
			home_ownership_selected = $("input[name='HomeOwnership']:checked").val();
			storage.setItem('home_ownership', home_ownership_selected);
			setTimeout(function() {$('.w-round div:nth-child(7)').trigger('tap'); }, 500);
		} else {
			document.getElementById("home-step").disabled = true;
			$home_next.toggleClass(className, false);
		}
		}

		if (page == "mortgage") {
		if ($("input[name='Mortgage']").is(':checked') ) {
			$('#mortgage-alert-required').hide(500);
			document.getElementById("mortgage-step").disabled = false;
			$mortgage_next.toggleClass(className, true);
			mortgage_selected = $("input[name='Mortgage']:checked").val();
			storage.setItem('mortgage', mortgage_selected);
			setTimeout(function() {$('.w-round div:nth-child(8)').trigger('tap'); }, 500);
		} else {
			document.getElementById("mortgage-step").disabled = true;
			$mortgage_next.toggleClass(className, false);
		}
		}

  	if (page == "mortgage-balance") {
		var mortgage_balance = $('#mortgage-input').val();
    if (mortgage_balance.length == 1 && mortgage_balance == 0) {
    	$('#mortgage-balance-input').val("");
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
    if (debts.length == 1 && debts == 0) {
    	$('#debts-input').val("");
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
		if ($("input[name='Children']").is(':checked') ) {
			$('#children-alert-required').hide(500);
			document.getElementById("children-step").disabled = false;
			$children_next.toggleClass(className, true);
			children_selected = $("input[name='Children']:checked").val();
			storage.setItem('children', children_selected);
			setTimeout(function() {$('.w-round div:nth-child(11)').trigger('tap'); }, 500);
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

					storage.setItem('child_age_'+x, "");
					$('#child-age-input-' + x).val("");
					x--;
			}
		} else {
			document.getElementById("children-num-step").disabled = true;
			$children_num_next.toggleClass(className, false);
			children_num_error = true;
/*			let y = 1;
			while (y < 10) {
				$('#child-age-input-' + y).val("");
        y++;
			}
*/
		}
		}
    
  	if (page == "child-age") {
		var children_num = $('#children-num-input').val();
		let y = 1;
		while (y < Number(children_num) + 1) {
			var child_age = $('#child-age-input-' + y).val();
			if (child_age.length > 0 && child_age.length < 3) {
				children_age_error = false;
				$('#children-age-alert-required').hide(500);
				document.getElementById("children-num-step").disabled = false;
				$children_num_next.toggleClass(className, true);
				storage.setItem('child_age_'+y, document.getElementById('child-age-input-'+y).value);
			} else {
				children_age_error = true;
				$('#children-age-alert-required').show(500);
				document.getElementById("children-num-step").disabled = true;
				$children_num_next.toggleClass(className, false);
 		    break;
			}
			y++;
		}
		}

  	if (page == "childcare") {
		var childcare = $('#childcare-input').val();
    if (childcare.length == 1 && childcare == 0) {
    	$('#childcare-input').val("");
    }
		if (childcare.length > 4 && childcare.length < 10) {
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
		if ($("input[name='College']").is(':checked') ) {
			$('#college-alert-required').hide(500);
			document.getElementById("college-step").disabled = false;
			$college_next.toggleClass(className, true);
			college_selected = $("input[name='College']:checked").val();
			storage.setItem('college_type', college_selected);
			setTimeout(function() {$('.w-round div:nth-child(14)').trigger('tap'); }, 500);
		} else {
			document.getElementById("college-step").disabled = true;
			$college_next.toggleClass(className, false);
		}
		}

  	if (page == "college-savings") {
		var college_savings = $('#college-savings-input').val();
    if (college_savings.length == 1 && college_savings == 0) {
    	$('#college-savings-input').val("");
    }
		if (college_savings.length > 4 && college_savings.length < 10) {
			$('#college-savings-alert-required').hide(500);
			document.getElementById("college-savings-step").disabled = false;
			$college_savings_next.toggleClass(className, true);
			college_savings_error = false;
			storage.setItem('college-savings', document.getElementById("college-savings-input").value);
		} else {
			document.getElementById("college-savings-step").disabled = true;
			$college_savings_next.toggleClass(className, false);
			college_savings_error = true;
		}
		}

  	if (page == "savings") {
		var savings = $('#savings-input').val();
    if (savings.length == 1 && savings == 0) {
    	$('#savings-input').val("");
    }
		if (savings.length > 4 && savings.length < 11) {
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
    if (current_insurance.length == 1 && current_insurance == 0) {
    	$('#current-insurance-input').val("");
    }
		if (current_insurance.length > 4 && current_insurance.length < 11) {
			$('#current-insurance-alert-required').hide(500);
			document.getElementById("current-insurance-step").disabled = false;
			$current_insurance_next.toggleClass(className, true);
			current_insurance_error = false;
			storage.setItem('current-insurance', document.getElementById("current-insurance-input").value);
		} else {
			document.getElementById("current-insurance-step").disabled = true;
			$current_insurance_next.toggleClass(className, false);
			current_insurance_error = true;
		}
		}

	}
});
