Webflow.push(function(){
  $("#quote").submit(function(){
		var storage = window.localStorage,
				currentPage = 1, // PAGE: health_profile = 1
				nextPage;

		nextPage = getRedirectURL(currentPage);
    alert("In the submit function - nextPage = "+nextPage);
		location.href = nextPage;
  })
});

$(document).ready(function() {
	$(":input, a").attr("tabindex", "-1");
	var form = '.quote',
			$form = $(this),
			submit = 'input[type="submit"]',
			$submit   = $form.find( submit ),
			className = 'button_active',
			storage = window.localStorage,
			$body_next = $form.find( '#body-step' ),
			$tobacco_next = $form.find( '#tobacco-step' ),
			$conditions_next = $form.find( '#conditions-step' ),
			$license_next = $form.find( '#license-step' ),
			$income_next = $form.find( '#income-step' ),
			$height = $form.find('.height'),
			$height_feet = $form.find('input[id="height_feet"]'),
			$height_inches = $form.find('input[id="height_inches"]'),
			$weight = $form.find('input[id="weight"]'),
			$tobacco = $form.find('.tobacco'),
			tobacco_selected = $("input[name='Tobacco']:checked").val(),
			$conditions = $form.find('.conditions'),
			asthma = "input[id='asthma']:checked",
			depression = "input[id='depression']:checked",
			heart_attack = "input[id='heart_attack']:checked",
			stroke = "input[id='stroke']:checked",
			cancer = "input[id='cancer']:checked",
			sleep_apnea = "input[id='sleep_apnea']:checked",
			diabetes = "input[id='diabetes']:checked",
			$license = $form.find('.license'),
      license_selected = $("input[name='License']:checked").val(),
			enabled = true,
			first_check = false,
			height_errors = false,
			weight_errors = false,
//			weight_valid_error = false,
			tobacco_errors,
			conditions_errors = false,
			license_errors,
      income_error,
			strDateTime = getFormattedDate();

	$('#commit_point').val("3-health-profile");
	$('#quote_initiated_datetime').val(storage.getItem('quote_initiated_datetime'));
	$('#quote_initiated_from_ip_address').val(storage.getItem('quote_initiated_from_ip_address'));
	$('#quote_initiated_from_city').val(storage.getItem('quote_initiated_from_city'));

	document.getElementById("license-step").disabled = true;
	document.getElementById("body-step").disabled = true;
	document.getElementById("tobacco-step").disabled = true;
//	document.getElementById("conditions-step").disabled = true;

	$height_feet.mask("0'");
	$height_inches.mask('#0"', {reverse: true});
	$weight.mask("000");

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

  if (storage_license !== null) {
	  $("input[name='License'][value='" + storage_license + "']").prop("checked", true);
		$("#license_" + storage_license.toLowerCase()).parent().css( "backgroundColor", "#48bd9d" );
		$("#license_" + storage_license.toLowerCase()).parent().css( "border", "#48bd9e" );
		$("#license_" + storage_license.toLowerCase()).parent().css( "color", "#ffffff" );
		$('#license-alert-required').hide(500);
    document.getElementById("license-step").disabled = false;
		$license_next.toggleClass(className, true);
  }

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

  if (storage_tobacco !== null) {
	$("input[name='Tobacco'][value='" + storage_tobacco + "']").prop("checked", true);
		$("#tobacco_" + storage_tobacco.toLowerCase()).parent().css( "backgroundColor", "#48bd9d" );
		$("#tobacco_" + storage_tobacco.toLowerCase()).parent().css( "border", "#48bd9e" );
		$("#tobacco_" + storage_tobacco.toLowerCase()).parent().css( "color", "#ffffff" );
		$('#tobacco-alert-required').hide(500);
		document.getElementById("tobacco-step").disabled = false;
		$tobacco_next.toggleClass(className, true);
	}

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
			$('#caner').prev('.w-checkbox-input').addClass('w--redirected-checked');
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
			document.getElementById("conditions-step").disabled = true;
			$conditions_next.toggleClass(className, false);
	}


/*** Step 1 ***/
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

/*** Step 2 ***/
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
  
/*** Step 3 ***/
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

/*** Step 4 ()FINAL) ***/
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
			document.getElementById("conditions-step").disabled = true;
			$conditions_next.toggleClass(className, false);
		} else {
			var currentPage = 1, // PAGE: health_profile = 1
				nextPage;
			nextPage = getRedirectURL(currentPage);
      alert("In the 'Continue' button clicked event - nextPage = "+nextPage);
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

});
