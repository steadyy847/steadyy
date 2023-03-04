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
			$zip_next = $form.find( '#zip-step' ),
			$gender_next = $form.find( '#gender-step' ),
			$dob_next = $form.find( '#dob-step' ),
			$citizen_next = $form.find( '#citizen-step' ),
			$income_next = $form.find( '#income-step' ),
			className = 'button_active',
			$zip_input = $form.find('input[id="zip-input"]'),
			$gender = $form.find('.gender'),
			gender_selected = $("input[name='Gender']:checked").val(),
			$dob_month = $form.find('input[id="dob_month"]'),
			$dob_day = $form.find('input[id="dob_day"]'),
			$dob_year = $form.find('input[id="dob_year"]'),
			$annual_income = $form.find('input[id="income-input"]'),
			$citizen = $form.find('.citizen'),
			citizen_selected = $("input[name='Citizenship']:checked").val(),
			DOBresult,
			dob,
			age,
			adj_age,
			coverage_rec,
			enabled = true,
			dob_error_req = true,
			dob_error_age = false,
			zip_error = true,
			income_error = true,
			strDateTime = getFormattedDate();

//	storage.clear();

	$('#quote_initiated_datetime').val(strDateTime);
	storage.setItem('quote_initiated_datetime', strDateTime);
	$('#commit_point').val("1-basics");

	$zip_input.mask("00000");
	$dob_month.mask("#0");
	$dob_day.mask("#0");
	$dob_year.mask("0000");
	$annual_income.mask("#,##0", {reverse: true});

	/*** Step 1 ***/
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
					state = "99";

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
					var cityStateLookupResponse = xmlDoc.getElementsByTagName("CityStateLookupResponse")[0];
					var zipCode = cityStateLookupResponse.getElementsByTagName("ZipCode")[0];
					var state = zipCode.getElementsByTagName("State")[0].textContent;
				}
				storage.setItem('state', state);
				const validStates = ["IL", "CA", "MI", "NY", "PA", "TX", "VA"];
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

	/*** Step 2 ***/
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

	/*** Step 3 ***/
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
					$('.w-round div:nth-child(4)').trigger('tap');
				}
			}
		}
	});

	$('#dob-prev').click(function(e) {
		e.preventDefault();
		$('.w-round div:nth-child(2)').trigger('tap');
	});

	/*** Step 4 ***/
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
		if (income_error) {
			e.preventDefault();
			$('#income-alert-required').show(500);
			document.getElementById("income-step").disabled = true;
			$income_next.toggleClass(className, false);
		} else {
			var citizen = $("input[name='Citizenship']:checked").val();
			if (citizen == 'Yes') {
				location.href = '/life-quote-health-profile-slider';}
			else if (citizen == 'No') {
				location.href = '/life-quote-basics-citizenship-slider';}
		}
	});
  
	$('#income-prev').click(function(e) {
		e.preventDefault();
		$('.w-round div:nth-child(4)').trigger('tap');
	});

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
			document.getElementById("zip-step").disabled = true;
			$zip_next.toggleClass(className, false);
		}
		}

		if (page == "gender") {
		if ($("input[name='Gender']").is(':checked') ) {
			$('#gender-alert-required').hide(500);
			document.getElementById("gender-step").disabled = false;
			$gender_next.toggleClass(className, true);
			setTimeout(function() {$('.w-round div:nth-child(3)').trigger('tap'); }, 500);
		} else {
			document.getElementById("gender-step").disabled = true;
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

		if ($dob_month.val() != '' && /^([\w]{1,2})?$/.test($dob_month.val()) &&
				$dob_day.val() != '' && /^([\w]{1,2})?$/.test($dob_day.val()) &&
				$dob_year.val() != '' && /^([\w]{4,4})?$/.test($dob_year.val()) &&
				dob_error_age == false &&
				dob_error_req == false) {
			document.getElementById("dob-step").disabled = false;
			$dob_next.toggleClass(className, true);
		} else {
			document.getElementById("dob-step").disabled = true;
			$dob_next.toggleClass(className, false);
		}
		}

		if (page == "citizen") {
		if ($("input[name='Citizenship']").is(':checked') ) {
			$('#citizen-alert-required').hide(500);
			document.getElementById("citizen-step").disabled = false;
			$citizen_next.toggleClass(className, true);
			setTimeout(function() {$('.w-round div:nth-child(5)').trigger('tap'); }, 500);
		} else {
			document.getElementById("citizen-step").disabled = true;
			$citizen_next.toggleClass(className, false);
		}
		}

  	if (page == "income") {
		var income = $('#income-input').val();
		if (income.length > 5 && income.length < 11) {
			$('#income-alert-required').hide(500);
			document.getElementById("income-step").disabled = false;
			$income_next.toggleClass(className, true);
			income_error = false;
			setLocalStorage(document);
		} else {
			document.getElementById("income-step").disabled = true;
			$income_next.toggleClass(className, false);
			income_error = true;
			storage.setItem('coverage_recommendation', "");
		}
		}
	}
});

