/* This 'submit' function for the #quote form should really never execute, as the default submit action has been disabled.
   We handle it a different way - upon clicking the 'Continue' button, we check previously entered data to determine 
   which page to navigate to next, and navigating there without submitting the form.  We will wait until all quote details 
   have beeen gathered, and the user landed on the page that presents them with quote options, and prompt them to enter their 
   email address to save their quote data, by submitting a form on that page instead.  I'm just leaving this code block here  
   as a fail-safe, just in case that code is ever changed. */
$(document).ready(function () {
	Webflow.push(function(){
	  $("#quote").submit(function(){
			var currentPage = 1, // PAGE: health_profile = 1
					nextPage;

			nextPage = getRedirectURL(currentPage);
			location.href = nextPage;
	  })
	});
});

$(document).ready(function() {
	$(":input, a").attr("tabindex", "-1");
	var $form = $(this),
			className = 'button_active',
			storage = window.localStorage,

			$license = $form.find('.license'),
			$license_next = $form.find( '#license-step' ),

			first_check = false,
			$height_feet = $form.find('input[id="height_feet"]'),
			$height_inches = $form.find('input[id="height_inches"]'),
			height_errors = false,
			$weight = $form.find('input[id="weight"]'),
			weight_errors = false,

			$tobacco = $form.find('.tobacco'),
			$tobacco_next = $form.find( '#tobacco-step' ),

			$conditions = $form.find('.conditions'),
			asthma = "input[id='asthma']:checked",
			depression = "input[id='depression']:checked",
			heart_attack = "input[id='heart_attack']:checked",
			stroke = "input[id='stroke']:checked",
			cancer = "input[id='cancer']:checked",
			sleep_apnea = "input[id='sleep_apnea']:checked",
			diabetes = "input[id='diabetes']:checked",
			conditions_errors = false,
			$conditions_next = $form.find( '#conditions-step' ),
			enabled = true;

  /* STEP 1 - Take the info about when and where this quote originated from and move it from localStorage 
              to the hidden fields in the form. This may not really matter, as this form will never get submitted,
              since that action has been disabled, in favor of logging all info into localStorage until all pages 
              of the quote have been completed and user lands on the quotes page with a model pop-up prompting them 
              to 'save' the quote by entering their email address.  But keep this here as a fail-safe, in the event 
              that code changes down the road to submit sub pieces of the quote, one page at a time  */

	var commitPointItem = storage.getItem('commit_point');
	var numericPartOfCommitPoint = commitPointItem ? parseInt(commitPointItem.split('-')[0]) : null;

	if (numericPartOfCommitPoint > 3) {
		$('#commit_point').val(commitPointItem);
	} else {
		storage.setItem('commit_point', "3-health-profile");
		$('#commit_point').val("3-health-profile");
	}
	storage.setItem('navigation_from', "3-health-profile");

	$('#quote_initiated_datetime').val(storage.getItem('quote_initiated_datetime'));
	$('#quote_initiated_from_ip_address').val(storage.getItem('quote_initiated_from_ip_address'));
	$('#quote_initiated_from_city').val(storage.getItem('quote_initiated_from_city'));

  /* STEP 2 - Disable all 'Continue' buttons on each slider page. We enable them only after page contents pass proper edits */
//	document.getElementById("license-step").disabled = true;
//	document.getElementById("body-step").disabled = true;
//	document.getElementById("tobacco-step").disabled = true;
//	document.getElementById("conditions-step").disabled = true;

  /* STEP 3 - Set up masks for the body type fields of height and weight */
	$height_feet.mask("0'");
	$height_inches.mask('#0"', {reverse: true});
	$weight.mask("000");

  /* STEP 4 - Grab the current values in localStorage so they can be set on each page, in the event that a user 
              left this page and comes back later, so they don't lose data that they may have already entered */
	var storage_license = storage.getItem('license'),
	    storage_height_feet = storage.getItem('height_feet'),
			storage_height_inches = storage.getItem('height_inches'),
			storage_weight = storage.getItem('weight'),
	    storage_tobacco = storage.getItem('tobacco'),
	    storage_asthma = storage.getItem('asthma'),
      storage_cancer = storage.getItem('cancer'),
      storage_depression = storage.getItem('depression'),
      storage_diabetes = storage.getItem('diabetes'),
      storage_heart_attack = storage.getItem('heart_attack'),
      storage_sleep_apnea = storage.getItem('sleep_apnea'),
      storage_stroke = storage.getItem('stroke'),
      storage_no_conditions = storage.getItem('no_conditions');

  /* STEP 5 - Evaluate whether there was data in localStorage for the 'license suspension' page, and re-initialize it with that data, if there was */
  if (storage_license !== null) {
	  $("input[name='License'][value='" + storage_license + "']").prop("checked", true);
		$("input[name='License'][value='" + storage_license + "']").prev('.w-radio-input').addClass('w--redirected-checked');
		$("#license_" + storage_license.toLowerCase()).parent().css( "backgroundColor", "#48bd9d" );
		$("#license_" + storage_license.toLowerCase()).parent().css( "border", "#48bd9e" );
		$("#license_" + storage_license.toLowerCase()).parent().css( "color", "#ffffff" );
		$('#license-alert-required').hide(500);
    document.getElementById("license-step").disabled = false;
		$license_next.toggleClass(className, true);
  }

  /* STEP 6 - Evaluate whether there was data in localStorage for the 'height & weight' page, and re-initialize it with that data, if there was */
	if (storage_height_feet !== null) {
		$height_feet.val(storage_height_feet+"'");
		height_errors = chkHealthErrors("height")
	}
	if (storage_height_inches !== null) {
		$height_inches.val(storage_height_inches+'"');
	}
	if (storage_weight !== null) {
		$weight.val(storage_weight);
		weight_errors = chkHealthErrors("weight")
	}
	submitButtonCheck(document, $form, this, "body", height_errors, weight_errors, conditions_errors);

  /* STEP 7 - Evaluate whether there was data in localStorage for the 'tobacco use' page, and re-initialize it with that data, if there was */
  if (storage_tobacco !== null) {
		$("input[name='Tobacco'][value='" + storage_tobacco + "']").prop("checked", true);
		$("input[name='Tobacco'][value='" + storage_tobacco + "']").prev('.w-radio-input').addClass('w--redirected-checked');
		$("#tobacco_" + storage_tobacco.toLowerCase()).parent().css( "backgroundColor", "#48bd9d" );
		$("#tobacco_" + storage_tobacco.toLowerCase()).parent().css( "border", "#48bd9e" );
		$("#tobacco_" + storage_tobacco.toLowerCase()).parent().css( "color", "#ffffff" );
		$('#tobacco-alert-required').hide(500);
		document.getElementById("tobacco-step").disabled = false;
		$tobacco_next.toggleClass(className, true);
	}

  /* STEP 8 - Evaluate whether there was data in localStorage for the 'health conditions' page, and re-initialize it with that data, if there was */
  if (storage_asthma == null || storage_asthma === 'false') {
			$("input[id='asthma']:checked").prop('checked', false);
			$('#asthma').prev('.w-checkbox-input').removeClass('w--redirected-checked');
  } else {
//			$("input[id='asthma']:checked").prop('checked', true);
      document.querySelector("input[id='asthma']").checked = true;
			$('#asthma').prev('.w-checkbox-input').addClass('w--redirected-checked');
  }
  if (storage_cancer == null || storage_cancer === 'false') {
			$("input[id='cancer']:checked").prop('checked', false);
			$('#cancer').prev('.w-checkbox-input').removeClass('w--redirected-checked');
  } else {
//			$("input[id='cancer']:checked").prop('checked', true);
      document.querySelector("input[id='cancer']").checked = true;
			$('#cancer').prev('.w-checkbox-input').addClass('w--redirected-checked');
  }

  if (storage_depression == null || storage_depression === 'false') {
			$("input[id='depression']:checked").prop('checked', false);
			$('#depression').prev('.w-checkbox-input').removeClass('w--redirected-checked');
  } else {
//			$("input[id='depression']:checked").prop('checked', true);
      document.querySelector("input[id='depression']").checked = true;
			$('#depression').prev('.w-checkbox-input').addClass('w--redirected-checked');
  }

  if (storage_diabetes == null || storage_diabetes === 'false') {
			$("input[id='diabetes']:checked").prop('checked', false);
			$('#diabetes').prev('.w-checkbox-input').removeClass('w--redirected-checked');
  } else {
//			$("input[id='diabetes']:checked").prop('checked', true);
      document.querySelector("input[id='diabetes']").checked = true;
			$('#diabetes').prev('.w-checkbox-input').addClass('w--redirected-checked');
  }

  if (storage_heart_attack == null || storage_heart_attack === 'false') {
			$("input[id='heart_attack']:checked").prop('checked', false);
			$('#heart_attack').prev('.w-checkbox-input').removeClass('w--redirected-checked');
  } else {
//			$("input[id='heart_attack']:checked").prop('checked', true);
      document.querySelector("input[id='heart_attack']").checked = true;
			$('#heart_attack').prev('.w-checkbox-input').addClass('w--redirected-checked');
  }

  if (storage_sleep_apnea == null || storage_sleep_apnea === 'false') {
			$("input[id='sleep_apnea']:checked").prop('checked', false);
			$('#sleep_apnea').prev('.w-checkbox-input').removeClass('w--redirected-checked');
  } else {
//			$("input[id='sleep_apnea']:checked").prop('checked', true);
      document.querySelector("input[id='sleep_apnea']").checked = true;
			$('#sleep_apnea').prev('.w-checkbox-input').addClass('w--redirected-checked');
  }

  if (storage_stroke == null || storage_stroke === 'false') {
			$("input[id='stroke']:checked").prop('checked', false);
			$('#stroke').prev('.w-checkbox-input').removeClass('w--redirected-checked');
  } else {
//			$("input[id='stroke']:checked").prop('checked', true);
      document.querySelector("input[id='stroke']").checked = true;
			$('#stroke').prev('.w-checkbox-input').addClass('w--redirected-checked');
  }

  if (storage_no_conditions == null || storage_no_conditions === 'false') {
			$("input[id='no_conditions']:checked").prop('checked', false);
			$('#no_conditions').prev('.w-checkbox-input').removeClass('w--redirected-checked');
  } else {
//			$("input[id='no_conditions']:checked").prop('checked', true);
      document.querySelector("input[id='no_conditions']").checked = true;
			$('#no_conditions').prev('.w-checkbox-input').addClass('w--redirected-checked');
  }

  /* STEP 9 - After all localStorage data for 'health conditions' was re-initialized into the pages, next, we need to evaluate 
              whether the 'Continue' button should be enabled or not, and whether any error messages should be displayed or hidden */
	var asthma_CB = document.getElementById('asthma').checked,
			depression_CB = document.getElementById('depression').checked,
			heart_attack_CB = document.getElementById('heart_attack').checked,
			stroke_CB = document.getElementById('stroke').checked,
			cancer_CB = document.getElementById('cancer').checked,
			sleep_apnea_CB = document.getElementById('sleep_apnea').checked,
			diabetes_CB = document.getElementById('diabetes').checked,
			no_conditions_CB = document.getElementById('no_conditions').checked;

	if (asthma_CB || depression_CB || heart_attack_CB || stroke_CB || cancer_CB || sleep_apnea_CB || diabetes_CB || no_conditions_CB) {
			$('#conditions-alert-required').hide(500);
			document.getElementById("conditions-step").disabled = false;
			$conditions_next.toggleClass(className, true);
	} else {
//			document.getElementById("conditions-step").disabled = true;
			$conditions_next.toggleClass(className, false);
	}

  /* STEP 10 - Set up listeners on each field for keypress and on change/input events */

  /*** STEP 10.1 - Listen for actiivity on the 'License Suspension' page ***/
	$("input[name='License']").keypress(function(event) {
		if (event.keyCode == 13) {
			event.preventDefault();}
	});

	$license.on('change', 'input, select, textarea', function() {
  		submitButtonCheck(document, $form, this, "license");
	});

	$('#license-step').click(function(e) {
		e.preventDefault();
 		submitButtonCheck(document, $form, this, "license");

		if ( ! $("input[name='License']").is(':checked') ) {
			$('#license-alert-required').show(500);
		} else {
			$('#license-alert').hide();
			$('.w-round div:nth-child(2)').trigger('tap');
		}
	});

	$('#license-prev').click(function(e) {
		e.preventDefault();
		window.history.back();
	});

  /*** STEP 10.2 - Listen for actiivity on the 'Height & Weight' page ***/
	$height_feet.keypress(function(event) {
		if (event.keyCode == 13) {
			event.preventDefault();}
	});
	$height_inches.keypress(function(event) {
		if (event.keyCode == 13) {
			event.preventDefault();}
	});
	$weight.keypress(function(event) {
		if (event.keyCode == 13) {
			event.preventDefault();}
	});

	$height_feet.on('input.True', function() {
		if (this.value.length > 2) {
			this.value = this.value.slice(0, 2);}
		if (this.value.slice(0, 1) < 4) {
			this.value = null;
			this.value = this.value.slice(0, 1);}
		if (this.value.slice(0, 1) > 7) {
			this.value = null;
			this.value = this.value.slice(0, 1);}
		if (first_check) {
			height_errors = chkHealthErrors("height")
    }
		submitButtonCheck(document, $form, this, "body", height_errors, weight_errors, conditions_errors);
	});
	$height_feet.on('keydown', function() {
		var key = event.keyCode || event.charCode;
		if( key == 8 || key == 46 ) {
			if(this.value.length == 2) {
				this.value = null;}
		if (first_check) {
			height_errors = chkHealthErrors("height")
		}
		submitButtonCheck(document, $form, this, "body", height_errors, weight_errors, conditions_errors);
		}
	});

	$height_inches.on('input.True', function() {
		if (this.value.length > 3) {
			this.value = this.value.slice(0, 2) +'"';}
		if(this.value.length == 3) {
			if (this.value.slice(0,2) > 11) {
				this.value = this.value.slice(0, 1) +'"';}
		}
	});
	$height_inches.on('keydown', function() {
		var key = event.keyCode || event.charCode;
		if( key == 8 || key == 46 ) {
			if(this.value.length == 2) {
				this.value = null;
			}
			if(this.value.length == 3) {
				this.value = this.value.slice(0, 1) + '"';
			}
		}
	});

	$weight.on('input.True', function() {
		if (this.value.length > 3) {
			this.value = this.value.slice(0, 3);
		}
		if (first_check) {
			weight_errors = chkHealthErrors("weight")
		}
		submitButtonCheck(document, $form, this, "body", height_errors, weight_errors, conditions_errors);
	});

	$('#body-step').click(function(e) {
		e.preventDefault();
		first_check = true;
		height_errors = chkHealthErrors("height")
		weight_errors = chkHealthErrors("weight")
		submitButtonCheck(document, $form, this, "body", height_errors, weight_errors, conditions_errors);

		if(!height_errors && !weight_errors){
			$('.w-round div:nth-child(3)').trigger('tap');
		}
	});

	$('#body-prev').click(function(e) {
		e.preventDefault();
		$('.w-round div:nth-child(1)').trigger('tap');
	});
  
  /*** STEP 10.3 - Listen for actiivity on the 'Tobacco Use' page ***/
	$("input[name='Tobacco']").keypress(function(event) {
		if (event.keyCode == 13) {
			event.preventDefault();
		}
	});

	$tobacco.on('change', 'input, select, textarea', function() {
			submitButtonCheck(document, $form, this, "tobacco", height_errors, weight_errors, conditions_errors);
	});

	$('#tobacco-step').click(function(e) {
		e.preventDefault();
		submitButtonCheck(document, $form, this, "tobacco", height_errors, weight_errors, conditions_errors);
		if ( ! $("input[name='Tobacco']").is(':checked') ) {
			$('#tobacco-alert-required').show(500);
		} else {
			$('#tobaccco-alert').hide();
			$('.w-round div:nth-child(4)').trigger('tap');
		}
	});
    
	$('#tobacco-prev').click(function(e) {
		e.preventDefault();
		$('.w-round div:nth-child(2)').trigger('tap');
	});

  /*** STEP 10.4 (FINAL STEP) - Listen for actiivity on the 'Health Conditions' page ***/
	$conditions.on('change', 'input, select, textarea', function() {
		if (enabled) {
			submitButtonCheck(document, $form, this, "conditions");
		}
	});

	$('#conditions-step').click(function(e) {
		e.preventDefault();
		conditions_errors =	submitButtonCheck(document, $form, this, "conditions");
		if (conditions_errors) {
//			e.preventDefault();
			$('#conditions-alert-required').show(500);
//			document.getElementById("conditions-step").disabled = true;
			$conditions_next.toggleClass(className, false);
		} else {
			var currentPage = 1, // PAGE: health_profile = 1
				nextPage;
			nextPage = getRedirectURL(currentPage);
			location.href = nextPage;
		}
	});

	$('#conditions-prev').click(function(e) {
		e.preventDefault();
		$('.w-round div:nth-child(3)').trigger('tap');
	});


	function chkHealthErrors(objectAffected) {
		if (objectAffected == 'height') {
			if ($height_feet.val().length == 2) {
				$('#height-alert-required').hide(500);
				$('#height-alert-valid').hide(500);
				return false;
			} else {
				if ($height_feet.val().length == 0) {
					$('#height-alert-required').show(500);
				} else {
					$('#height-alert-required').hide();
				}
				return true;
			}
		}

		if (objectAffected = "weight") {
			if ($weight.val().length >= 2 && $weight.val().length <= 3 && parseInt($weight.val()) >= 75 && parseInt($weight.val()) <= 500) {
				$('#weight-alert-required').hide(500);
				$('#weight-alert-valid').hide(500);
				return false;
			} else {
				if ($weight.val().length == 0) {
					$('#weight-alert-valid').hide();
					$('#weight-alert-required').show(500);
				} else {
					$('#weight-alert-required').hide();
					$('#weight-alert-valid').show(500);
				}
				return true;
			}
		}
	}


	function submitButtonCheck(document, form, thisObject, page, height_errors, weight_errors, conditions_errors) {
		var className = 'button_active',
				storage = window.localStorage,

				license_selected = $("input[name='License']:checked").val(),
				$license_next = form.find( '#license-step' ),

				$height_feet = form.find('input[id="height_feet"]'),
        height_feet = $height_feet.val().slice(0,1),
				$height_inches = form.find('input[id="height_inches"]'),
        height_inches = $height_inches.val().slice(0,$height_inches.val().length-1),
				$weight = form.find('input[id="weight"]'),
        weight = $weight.val(),
				$body_next = form.find( '#body-step' ),

				tobacco_selected = $("input[name='Tobacco']:checked").val(),
				$tobacco_next = form.find( '#tobacco-step' ),

				asthma_CB = document.getElementById('asthma').checked,
				depression_CB = document.getElementById('depression').checked,
				heart_attack_CB = document.getElementById('heart_attack').checked,
				stroke_CB = document.getElementById('stroke').checked,
				cancer_CB = document.getElementById('cancer').checked,
				sleep_apnea_CB = document.getElementById('sleep_apnea').checked,
				diabetes_CB = document.getElementById('diabetes').checked,
				no_conditions_CB = document.getElementById('no_conditions').checked,
				$conditions_next = form.find( '#conditions-step' );

		if (page == "license") {
			if (license_selected != undefined) {
				$('#license-alert-required').hide(500);
				document.getElementById("license-step").disabled = false;
				$license_next.toggleClass(className, true);
				license_errors = false;
				storage.setItem('license', license_selected);
				setTimeout(function() {$('.w-round div:nth-child(2)').trigger('tap'); }, 500);
			} else {
//				document.getElementById("license-step").disabled = true;
				$license_next.toggleClass(className, false);
				license_errors = true;
			}
		}

		if (page == "body") {
			if ($height_feet.val() != '' && /^([\w\']{2,2})?$/.test($height_feet.val()) &&
					$weight.val() != '' && /^([\w]{2,3})?$/.test($weight.val()) && parseInt($weight.val()) >= 75 && parseInt($weight.val()) <= 500 &&
					!height_errors && !weight_errors) {
				document.getElementById("body-step").disabled = false;
				$body_next.toggleClass(className, true);
        if (height_inches.length == 0) {height_inches = "0";}
				storage.setItem('height_feet', height_feet);
				storage.setItem('height_inches', height_inches);
				storage.setItem('weight', weight);
				if (tobacco_selected != undefined && height_feet !='' && weight!='') {
					var risk = calcRisk(tobacco_selected, height_feet, height_inches, weight);
						storage.setItem('risk_class', risk.risk_class);
						storage.setItem('bmi', parseFloat(risk.bmi).toFixed(1));
				}
			} else {
//				document.getElementById("body-step").disabled = true;
				$body_next.toggleClass(className, false);
			}
		}

  	if (page == "tobacco") {
			if (tobacco_selected != undefined) {
				$('#tobacco-alert-required').hide(500);
				document.getElementById("tobacco-step").disabled = false;
				$tobacco_next.toggleClass(className, true);
				storage.setItem('tobacco', tobacco_selected);
        tobacco_errors = false;
				if (tobacco_selected != undefined && height_feet !='' && weight!='') {
					var risk = calcRisk(tobacco_selected, height_feet, height_inches, weight);
						storage.setItem('risk_class', risk.risk_class);
						storage.setItem('bmi', parseFloat(risk.bmi).toFixed(1));
				}
				setTimeout(function() {$('.w-round div:nth-child(4)').trigger('tap'); }, 500);
			} else {
//				document.getElementById("tobacco-step").disabled = true;
				$tobacco_next.toggleClass(className, false);
        tobacco_errors = true;
			}
    }

  	if (page == "conditions") {
			var asthma_CB = document.getElementById('asthma').checked,
					depression_CB = document.getElementById('depression').checked,
					heart_attack_CB = document.getElementById('heart_attack').checked,
					stroke_CB = document.getElementById('stroke').checked,
					cancer_CB = document.getElementById('cancer').checked,
					sleep_apnea_CB = document.getElementById('sleep_apnea').checked,
					diabetes_CB = document.getElementById('diabetes').checked,
					no_conditions_CB = document.getElementById('no_conditions').checked;

			if (document.getElementById(thisObject.id).checked) {
				$(thisObject.id).prev('.w-checkbox-input').addClass('w--redirected-checked');
			}
			else {
				$(thisObject.id).prev('.w-checkbox-input').removeClass('w--redirected-checked');
				$("input[id='"+thisObject.id+"']:checked").prop('checked', false);
			}

			if (thisObject.name.slice(0,9) == "Condition") {
				/*  If at least one health condition was just changed, check to see what the state of the
						'No Conditions' checkbox was, and if it was checked, uncheck it */
				if (no_conditions_CB) {
					$("input[name='NoConditions']:checked").prev('.w-checkbox-input').removeClass('w--redirected-checked');
					$("input[name='NoConditions']:checked").prop('checked', false);
				}
			}
			else {
				/*  If the 'No Conditions' checkbox was just changed, check to see if any health conditions were previously checked, and if so, then clear them */
				if (thisObject.name == "NoConditions") {
					if (asthma_CB || depression_CB || heart_attack_CB || stroke_CB || cancer_CB || sleep_apnea_CB || diabetes_CB) {
						$(asthma).prev('.w-checkbox-input').removeClass('w--redirected-checked');
						$(depression).prev('.w-checkbox-input').removeClass('w--redirected-checked');
						$(heart_attack).prev('.w-checkbox-input').removeClass('w--redirected-checked');
						$(stroke).prev('.w-checkbox-input').removeClass('w--redirected-checked');
						$(cancer).prev('.w-checkbox-input').removeClass('w--redirected-checked');
						$(sleep_apnea).prev('.w-checkbox-input').removeClass('w--redirected-checked');
						$(diabetes).prev('.w-checkbox-input').removeClass('w--redirected-checked');
						$(asthma).prop('checked', false);
						$(depression).prop('checked', false);
						$(heart_attack).prop('checked', false);
						$(stroke).prop('checked', false);
						$(cancer).prop('checked', false);
						$(sleep_apnea).prop('checked', false);
						$(diabetes).prop('checked', false);
					}
				}
			}
			/*  After all checkboxes have been set or unset properly, write the current state of each to the local storage */
			storage.setItem('asthma', document.getElementById('asthma').checked);
			storage.setItem('depression', document.getElementById('depression').checked);
			storage.setItem('heart_attack', document.getElementById('heart_attack').checked);
			storage.setItem('stroke', document.getElementById('stroke').checked);
			storage.setItem('cancer', document.getElementById('cancer').checked);
			storage.setItem('sleep_apnea', document.getElementById('sleep_apnea').checked);
			storage.setItem('diabetes', document.getElementById('diabetes').checked);
			storage.setItem('no_conditions', document.getElementById('no_conditions').checked);

			/*  After all checkboxes have been set or unset properly, re-collect the current state of
					each checkbox prior to evaluating how to set error messages and submit button */
			asthma_CB = document.getElementById('asthma').checked;
			depression_CB = document.getElementById('depression').checked;
			heart_attack_CB = document.getElementById('heart_attack').checked;
			stroke_CB = document.getElementById('stroke').checked;
			cancer_CB = document.getElementById('cancer').checked;
			sleep_apnea_CB = document.getElementById('sleep_apnea').checked;
			diabetes_CB = document.getElementById('diabetes').checked;
			no_conditions_CB = document.getElementById('no_conditions').checked;

			if (asthma_CB || depression_CB || heart_attack_CB || stroke_CB || cancer_CB || sleep_apnea_CB || diabetes_CB || no_conditions_CB) {
					$('#conditions-alert-required').hide(500);
					document.getElementById("conditions-step").disabled = false;
					$conditions_next.toggleClass(className, true);
					conditions_errors = false;
			} else {
//					document.getElementById("conditions-step").disabled = true;
					$conditions_next.toggleClass(className, false);
					conditions_errors = true;
			}
			return conditions_errors;
		}

	}

});
