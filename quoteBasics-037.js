$(document).ready(function() {
	$(":input, a").attr("tabindex", "-1");
	var form = '.quote',
			$form = $(this),
			submit = 'input[type="submit"]',
			$submit   = $form.find( submit ),
			className = 'button_active',
			storage = window.localStorage,

			$zip_input = $form.find('input[id="zip-input"]'),
			zip_error = true,
			$zip_next = $form.find( '#zip-step' ),

			$gender = $form.find('.gender'),
			$gender_next = $form.find( '#gender-step' ),

			$dob_month = $form.find('input[id="dob_month"]'),
			$dob_day = $form.find('input[id="dob_day"]'),
			$dob_year = $form.find('input[id="dob_year"]'),
			DOBresult,
			dob,
			adj_age,
			dob_error_req = true,
			dob_error_age = false,

			$dob_next = $form.find( '#dob-step' ),

			$citizen = $form.find('.citizen'),
			$citizen_next = $form.find( '#citizen-step' ),

			$annual_income = $form.find('input[id="income-input"]'),
			income_error = true,
			$income_next = $form.find( '#income-step' ),

			coverage_recommendation_method = storage.getItem('coverage_recommendation_method'),
			income_replacement_multiple = storage.getItem('income_replacement_multiple');
			enabled = true;

			storage.setItem('commit_point', "1-basics");
			$('#commit_point').val("1-basics");
			$('#quote_initiated_datetime').val(storage.getItem('quote_initiated_datetime'));
			$('#quote_initiated_from_ip_address').val(storage.getItem('quote_initiated_from_ip_address'));
			$('#quote_initiated_from_city').val(storage.getItem('quote_initiated_from_city'));


  /* STEP 1 - Set up masks for the fields that require them */
	$zip_input.mask("00000");
	$dob_month.mask("#0");
	$dob_day.mask("#0");
	$dob_year.mask("0000");
	$annual_income.mask("#,##0", {reverse: true});

  /* STEP 2 - Grab the current values in localStorage so they can be set on each page, in the event that a user 
              left this page and comes back later, so they don't lose data that they may have already entered */
	var storage_zip = storage.getItem('zip'),
			storage_state = storage.getItem('state'),
			storage_city = storage.getItem('city'),
			storage_gender = storage.getItem('gender'),
			storage_dob = storage.getItem('dob'),
			storage_age = storage.getItem('age'),
			storage_citizenship = storage.getItem('citizenship'),
      storage_annual_income = storage.getItem('annual_income');

  /* STEP 3 - Evaluate whether there was data in localStorage for the 'zip code' page, and re-initialize it with that data, if there was */
	if (storage_state !== null && storage_state !== "99") {
			if (storage_zip !== null) {
				$zip_input.val(storage_zip);
				state = storage_state;
				city = storage_city;
				const validStates = ["IL", "CA", "MI", "NY", "PA", "TX", "OH"]; // add "VA" & "FL" after licensing is finished
				if (validStates.includes(state)) {
					$('#zip-alert-valid').hide(500);
					$('#zip-alert-state').hide(500);
					zip_error = false;
					document.getElementById("zip-step").disabled = false;
					$zip_next.toggleClass(className, true);
				} else {
					if (state == "XX") {
						$('#zip-alert-valid').show(500);
						$('#zip-alert-state').hide(500);
						zip_error = true;
						$zip_next.toggleClass(className, false);
					} else {
						$('#zip-alert-valid').hide(500);
						$('#zip-alert-state').show(500);
						zip_error = true;
						$zip_next.toggleClass(className, false);
					}
				}
			}
	}

  /* STEP 4 - Evaluate whether there was data in localStorage for the 'gender' page, and re-initialize it with that data, if there was */
  if (storage_gender !== null) {
	  $("input[name='Gender'][value='" + storage_gender + "']").prop("checked", true);
		$("input[name='Gender'][value='" + storage_gender + "']").prev('.w-radio-input').addClass('w--redirected-checked');
		$("#gender_" + storage_gender.toLowerCase()).parent().css( "backgroundColor", "#48bd9d" );
		$("#gender_" + storage_gender.toLowerCase()).parent().css( "border", "#48bd9e" );
		$("#gender_" + storage_gender.toLowerCase()).parent().css( "color", "#ffffff" );
		$('#gender-alert-required').hide(500);
    document.getElementById("gender-step").disabled = false;
		$gender_next.toggleClass(className, true);
  }

  /* STEP 5 - Evaluate whether there was data in localStorage for the 'DOB' page, and re-initialize it with that data, if there was */
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

  /* STEP 6 - Evaluate whether there was data in localStorage for the 'citizenship' page, and re-initialize it with that data, if there was */
  if (storage_citizenship !== null) {
	  $("input[name='Citizenship'][value='" + storage_citizenship + "']").prop("checked", true);
		$("input[name='Citizenship'][value='" + storage_citizenship + "']").prev('.w-radio-input').addClass('w--redirected-checked');
		$("#citizen_" + storage_citizenship.toLowerCase()).parent().css( "backgroundColor", "#48bd9d" );
		$("#citizen_" + storage_citizenship.toLowerCase()).parent().css( "border", "#48bd9e" );
		$("#citizen_" + storage_citizenship.toLowerCase()).parent().css( "color", "#ffffff" );
		$('#citizen-alert-required').hide(500);
    document.getElementById("citizen-step").disabled = false;
		$citizen_next.toggleClass(className, true);
  }

  /* STEP 7 - Evaluate whether there was data in localStorage for the 'annual income' page, and re-initialize it with that data, if there was */
	if (storage_annual_income !== null) {
		$annual_income.val(storage_annual_income);
		DOBresult = checkDOB($form);
		submitButtonCheck("income");
	}

  /* STEP 8 - Set up listeners on each field for keypress and on change/input events */

  /*** STEP 8.1 - Listen for actiivity on the 'zip code' page ***/
	$('#zip-input').keypress(function(event) {
		if (event.keyCode == 13) {
			event.preventDefault();}
	});

	$('#zip-input').on('input.True', function() {
		if (this.value.length > 5) {
			this.value = this.value.slice(0, 5);
			submitButtonCheck("zip");
		}

		if (this.value.length < 5) {
			zip_error = true;
			$('#zip-alert-required').hide(500);
			$('#zip-alert-valid').hide(500);
			$('#zip-alert-state').hide(500);
			submitButtonCheck("zip");
		}

		if (this.value.length == 5) {
			var zip = this.value,
					url = 'https://production.shippingapis.com/ShippingAPI.dll?API=CityStateLookup%20&XML=%3CCityStateLookupRequest%20USERID=%22222STEAD5477%22%3E%3CZipCode%20ID=%20%220%22%3E%20%3CZip5%3E'+zip+'%3C/Zip5%3E%3C/ZipCode%3E%3C/CityStateLookupRequest%3E',
					state = "99",
					city = "Placeholder";

			storage.setItem('zip', zip);

			$('#zip-alert-required').hide(500);

			if (!zip) return;
			var xhr = new XMLHttpRequest();
			xhr.onreadystatechange = function() {
			if (xhr.readyState == 4) {
				if (xhr.status == 404) {
					var state = "XX";
				} else {
					var result = xhr.responseText;
					var parser = new DOMParser();
					var xmlDoc = parser.parseFromString(result, "text/xml");

					var errorElement = xmlDoc.getElementsByTagName("Error")[0];
					if (errorElement) {
						// An error occurred, handle it here
						var errorDescription = errorElement.getElementsByTagName("Description")[0].textContent;
						console.log("Error:", errorDescription);
						state = "XX";
					} else {
						var cityStateLookupResponse = xmlDoc.getElementsByTagName("CityStateLookupResponse")[0];
						var zipCode = cityStateLookupResponse.getElementsByTagName("ZipCode")[0];
						var state = zipCode.getElementsByTagName("State")[0].textContent;
						var city = zipCode.getElementsByTagName("City")[0].textContent;
					}
				}
				storage.setItem('state', state);
				storage.setItem('city', city);

				const validStates = ["IL", "CA", "MI", "NY", "PA", "TX", "OH"]; // add "VA" & "FL" after licensing is finished
				if (validStates.includes(state)) {
					$('#zip-alert-valid').hide(500);
					$('#zip-alert-state').hide(500);
					zip_error = false;
				} else {
					if (state == "XX") {
						$('#zip-alert-valid').show(500);
						$('#zip-alert-state').hide(500);
						zip_error = true;
					} else {
						$('#zip-alert-valid').hide(500);
						$('#zip-alert-state').show(500);
						zip_error = true;
					}
				}
				submitButtonCheck("zip");
			}
		};
		xhr.open('GET', url, true);
		xhr.send(null);
		}
	});

	$('#zip-step').click(function(e) {
		e.preventDefault();

		if(zip_error == false){
			$('.w-round div:nth-child(2)').trigger('tap');
		} else {
			if($('#zip-input').val().length <5){
			$('#zip-alert-required').show(500);}
		}
	});

	$('#zip-prev').click(function(e) {
		e.preventDefault();
		storage.setItem('navigation_from', "1-basics");
		window.history.back();
	});

  /*** STEP 8.2 - Listen for actiivity on the 'gender' page ***/
	$("input[name='Gender']").keypress(function(event) {
		if (event.keyCode == 13) {
			event.preventDefault();}
	});

	$gender.on('change', 'input, select, textarea', function() {
		if (enabled) {
			submitButtonCheck("gender");
		}
	});

	$('#gender-step').click(function(e) {
		e.preventDefault();

		if ( ! $("input[name='Gender']").is(':checked') ) {
			$('#gender-alert-required').show(500);
		} else {
			$('#gender-alert').hide(500);
			$('.w-round div:nth-child(3)').trigger('tap');
		}
	});

	$('#gender-prev').click(function(e) {
		e.preventDefault();
		$('.w-round div:nth-child(1)').trigger('tap');
	});

  /*** STEP 8.3 - Listen for actiivity on the 'DOB' page ***/
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
					$('.w-round div:nth-child(4)').trigger('tap');
				}
			}
		}
	});

	$('#dob-prev').click(function(e) {
		e.preventDefault();
		$('.w-round div:nth-child(2)').trigger('tap');
	});

  /*** STEP 8.4 - Listen for actiivity on the 'citizenship' page ***/
	$("input[name='Citizenship']").keypress(function(event) {
		if (event.keyCode == 13) {
			event.preventDefault();
		}
	});

	$citizen.on('change', 'input, select, textarea', function() {
		if (enabled) {
			submitButtonCheck("citizen");
		}
	});

	$('#citizen-step').click(function(e) {
		e.preventDefault();
		if ( ! $("input[name='Citizenship']").is(':checked') ) {
			$('#citizen-alert-required').show(500);
		} else {
			$('#citizen-alert').hide(500);
			$('.w-round div:nth-child(5)').trigger('tap');
		}
	});

	$('#citizen-prev').click(function(e) {
		e.preventDefault();
		$('.w-round div:nth-child(3)').trigger('tap');
	});

  /*** STEP 8.5 (FINAL STEP) - Listen for actiivity on the 'annual income' page ***/
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
			$('#income-alert-required').show(500);
			$income_next.toggleClass(className, false);
		} else {
			var citizen = $("input[name='Citizenship']:checked").val();
			if (citizen == 'Yes') {
				location.href = '/life-quote/health';}
			else if (citizen == 'No') {
				location.href = '/life-quote/basics/citizenship';}
		}
	});
  
	$('#income-prev').click(function(e) {
		e.preventDefault();
		$('.w-round div:nth-child(4)').trigger('tap');
	});
/*
	window.onload = function() {
		$form.find('.zip').focus();
//	  document.getElementById("zip-input").focus();
	};
*/
	function submitButtonCheck(page) {
		if (page == "zip") {
		var zip = $('#zip-input').val();
		if (zip.length == 5 &&
				zip_error == false
		) {
			document.getElementById("zip-step").disabled = false;
			$zip_next.toggleClass(className, true);
			setTimeout(function() {$('.w-round div:nth-child(2)').trigger('tap'); }, 500);
		} else {
			$zip_next.toggleClass(className, false);
		}
		}

		if (page == "gender") {
		if ($("input[name='Gender']").is(':checked') ) {
			storage.setItem('gender', $("input[name='Gender']:checked").val());
			$('#gender-alert-required').hide(500);
			document.getElementById("gender-step").disabled = false;
			$gender_next.toggleClass(className, true);
			setTimeout(function() {$('.w-round div:nth-child(3)').trigger('tap'); }, 500);
		} else {
			$gender_next.toggleClass(className, false);
		}
		}

  	if (page == "dob") {
		dob = DOBresult[0];
		adj_age = DOBresult[1];
		dob_error_req = DOBresult[2];
		dob_error_age = DOBresult[3];
		document.getElementById("dob").value = dob;
		document.getElementById("age").value = adj_age;
		storage.setItem('dob', dob);
		storage.setItem('age', adj_age);

		if (!dob_error_req) {
				$('#dob-alert-required').hide(500);
		}
		if (!dob_error_age) {
					$('#dob-alert-age').hide(500);
		}

		if ($dob_month.val() != '' && /^([\w]{1,2})?$/.test($dob_month.val()) &&
				$dob_day.val() != '' && /^([\w]{1,2})?$/.test($dob_day.val()) &&
				$dob_year.val() != '' && /^([\w]{4,4})?$/.test($dob_year.val()) &&
				dob_error_age == false &&
				dob_error_req == false) {

			document.getElementById("dob-step").disabled = false;
			$dob_next.toggleClass(className, true);
		} else {
			$dob_next.toggleClass(className, false);
		}
		}

		if (page == "citizen") {
		if ($("input[name='Citizenship']").is(':checked') ) {
			storage.setItem('citizenship', $("input[name='Citizenship']:checked").val());
			$('#citizen-alert-required').hide(500);
			document.getElementById("citizen-step").disabled = false;
			$citizen_next.toggleClass(className, true);

			var citizen = $("input[name='Citizenship']:checked").val();
			if (citizen == 'No') {
				if (storage.getItem('visa_type') !== null) {
						storage.setItem('visa_type', "")
				}
				if (storage.getItem('years_in_us') !== null) {
						storage.setItem('years_in_us', "")
				}
				if (storage.getItem('origins_country') !== null) {
						storage.setItem('origins_country', "")
				}
			}

			setTimeout(function() {$('.w-round div:nth-child(5)').trigger('tap'); }, 500);
		} else {
			$citizen_next.toggleClass(className, false);
		}
		}

  	if (page == "income") {
		var income = $('#income-input').val();
		if (income.length > 5 && income.length < 11) {
			storage.setItem('annual_income', document.getElementById("income-input").value);
			$('#income-alert-required').hide(500);
			document.getElementById("income-step").disabled = false;
			$income_next.toggleClass(className, true);
			income_error = false;
		} else {
			$income_next.toggleClass(className, false);
			income_error = true;
			storage.setItem('coverage_recommendation', "");
		}
		}
	}
});
