/*
Webflow.push(function(){
	$("#quote").submit(function(){
		var storage = window.localStorage,
				currentPage = 10, // PAGE: driving_history = 10
				nextPage;
		$('#quote_initiated_from_ip_address').val(storage.getItem('quote_initiated_from_ip_address'));
		$('#quote_initiated_datetime').val(storage.getItem('quote_initiated_datetime'));
		$('#commit_point').val("12-driving-history");

		nextPage = getRedirectURL(currentPage);
		location.href = nextPage;
	})
});
*/
$(function() {
	;
	(function($, window, document, undefined) {
		'use strict';
		var form = '.quote',
				submit = 'input[type="submit"]',
				className = 'submit_button_active',
   			className2 = 'button_active',
   			storage = window.localStorage;

		$(form).each(function() {
			var $form = $(this),
					$submit = $form.find( submit ),
     			$driving_more_next = $form.find( '#driving-more-step' ),
					currentPage = 10, // PAGE: driving_history = 10
    			nextPage,
    			last_focus,
					error_color = "#AC0036",
			    no_error_color = "#DEDEDE",
					enabled = true,
          submit_errors = true,

    			$drunk_driving = $form.find('#drunk-driving'),
    			$last_drunk_driving_date = $form.find('#last-drunk-driving-date'),
    			$reckless_driving = $form.find('#reckless-driving'),
    			$last_reckless_driving_date = $form.find('#last-reckless-driving-date'),
    			$license_suspension = $form.find('#license-suspension'),
    			$last_suspension_date = $form.find('#last-suspension-date'),
    			$moving_violations = $form.find('#moving-violations'),
          $violations_last_6mo_wrapper = $form.find('#violations-last-6mo-wrapper'),
          $violations_last_year_wrapper = $form.find('#violations-last-year-wrapper'),
          $violations_last_2years_wrapper = $form.find('#violations-last-2years-wrapper'),
          $violations_last_3years_wrapper = $form.find('#violations-last-3years-wrapper'),
          $violations_last_5years_wrapper = $form.find('#violations-last-5years-wrapper'),

					$last_drunk_driving_month = $form.find( 'input[id="last_drunk_driving_month"]' ),
					$last_drunk_driving_year = $form.find( 'input[id="last_drunk_driving_year"]' ),
					$last_reckless_driving_month = $form.find( 'input[id="last_reckless_driving_month"]' ),
					$last_reckless_driving_year = $form.find( 'input[id="last_reckless_driving_year"]' ),
					$last_suspension_month = $form.find( 'input[id="last_suspension_month"]' ),
					$last_suspension_year = $form.find( 'input[id="last_suspension_year"]' ),
          
          drunk_driving_errors = false,
          drunk_driving_date_errors = false,
          reckless_driving_errors = false,
          reckless_driving_date_errors = false,
          license_suspension_errors = false,
          license_suspension_date_errors = false,
          moving_violations_errors = false,
          moving_violations_last_6mo_errors = false,
          moving_violations_last_year_errors = false,
          moving_violations_last_2years_errors = false,
          moving_violations_last_3years_errors = false,
          moving_violations_last_5years_errors = false;


			$('#commit_point').val("12-driving-history");
			$('#quote_initiated_datetime').val(storage.getItem('quote_initiated_datetime'));
			$('#quote_initiated_from_ip_address').val(storage.getItem('quote_initiated_from_ip_address'));
			$('#quote_initiated_from_city').val(storage.getItem('quote_initiated_from_city'));

			document.getElementById("driving-more-step").disabled = true;
/**/	document.getElementById("submit_button").disabled = true;

/* STEP 1 - Set up masks for all number entry fields */
			$last_drunk_driving_month.mask("#0");
			$last_drunk_driving_year.mask("0000");
			$last_reckless_driving_month.mask("#0");
			$last_reckless_driving_year.mask("0000");
			$last_suspension_month.mask("#0");
			$last_suspension_year.mask("0000");

/* STEP 2 - Grab the current values in localStorage so they can be set on each page, in the event that a user 
            left this page and comes back later, so they don't lose data that they may have already entered */
  			var storage_dui = storage.getItem('driving_drunk_dui'),
            storage_dui_month = storage.getItem('driving_last_dui_month'),
  					storage_dui_year = storage.getItem('driving_last_dui_year'),
  					storage_reckless = storage.getItem('driving_reckless'),
            storage_reckless_month = storage.getItem('driving_last_reckless_month'),
  					storage_reckless_year = storage.getItem('driving_last_reckless_year'),
  					storage_license_suspension = storage.getItem('driving_license_suspension'),
            storage_license_suspension_month = storage.getItem('driving_license_suspension_month'),
  					storage_license_suspension_year = storage.getItem('driving_license_suspension_year'),
  					storage_moving_violations = storage.getItem('driving_moving_violations'),
            storage_violations_last_6mo = storage.getItem('driving_violations_last_6mo'),
  					storage_violations_last_year = storage.getItem('driving_violations_last_year'),
  					storage_violations_last_2years = storage.getItem('driving_violations_last_2years'),
  					storage_violations_last_3years = storage.getItem('driving_violations_last_3years'),
  					storage_violations_last_5years = storage.getItem('driving_violations_last_5years');

/* STEP 3 - Evaluate whether there was data in localStorage for the page, and re-initialize it with that data, if there was */
  			if (storage_dui !== null) {
  				$("input[name='DrunkDriving'][value='" + storage_dui + "']").prop("checked", true);
  				$("input[name='DrunkDriving'][value='" + storage_dui + "']").prev('.w-radio-input').addClass('w--redirected-checked');
  				$("#drunk_driving_" + storage_dui.toLowerCase()).parent().css( "backgroundColor", "#48bd9d" );
  				$("#drunk_driving_" + storage_dui.toLowerCase()).parent().css( "border", "#48bd9e" );
  				$("#drunk_driving_" + storage_dui.toLowerCase()).parent().css( "color", "#ffffff" );
  			}

  			if (storage_dui_month !== null) {
  				$last_drunk_driving_month.val(storage_dui_month);
  			}

  			if (storage_dui_year !== null) {
  				$last_drunk_driving_year.val(storage_dui_year);
  			}

  			if (storage_reckless !== null) {
  				$("input[name='RecklessDriving'][value='" + storage_reckless + "']").prop("checked", true);
  				$("input[name='RecklessDriving'][value='" + storage_reckless + "']").prev('.w-radio-input').addClass('w--redirected-checked');
  				$("#reckless_driving_" + storage_reckless.toLowerCase()).parent().css( "backgroundColor", "#48bd9d" );
  				$("#reckless_driving_" + storage_reckless.toLowerCase()).parent().css( "border", "#48bd9e" );
  				$("#reckless_driving_" + storage_reckless.toLowerCase()).parent().css( "color", "#ffffff" );
  			}

  			if (storage_reckless_month !== null) {
  				$last_reckless_driving_month.val(storage_reckless_month);
  			}

  			if (storage_reckless_year !== null) {
  				$last_reckless_driving_year.val(storage_reckless_year);
  			}

  			if (storage_license_suspension !== null) {
  				$("input[name='LicenseSuspension'][value='" + storage_license_suspension + "']").prop("checked", true);
  				$("input[name='LicenseSuspension'][value='" + storage_license_suspension + "']").prev('.w-radio-input').addClass('w--redirected-checked');
  				$("#license_suspension_" + storage_license_suspension.toLowerCase()).parent().css( "backgroundColor", "#48bd9d" );
  				$("#license_suspension_" + storage_license_suspension.toLowerCase()).parent().css( "border", "#48bd9e" );
  				$("#license_suspension_" + storage_license_suspension.toLowerCase()).parent().css( "color", "#ffffff" );
  			}

  			if (storage_license_suspension_month !== null) {
  				$last_suspension_month.val(storage_license_suspension_month);
  			}

  			if (storage_license_suspension_year !== null) {
  				$last_suspension_year.val(storage_license_suspension_year);
  			}

  			if (storage_moving_violations !== null) {
  				$("input[name='MovingViolations'][value='" + storage_moving_violations + "']").prop("checked", true);
  				$("input[name='MovingViolations'][value='" + storage_moving_violations + "']").prev('.w-radio-input').addClass('w--redirected-checked');
  				$("#moving_violations_" + storage_moving_violations.toLowerCase()).parent().css( "backgroundColor", "#48bd9d" );
  				$("#moving_violations_" + storage_moving_violations.toLowerCase()).parent().css( "border", "#48bd9e" );
  				$("#moving_violations_" + storage_moving_violations.toLowerCase()).parent().css( "color", "#ffffff" );
  			}

  			if (storage_violations_last_6mo !== null) {
          document.getElementById("violations_last_6mo").value = storage_violations_last_6mo;
  			}

  			if (storage_violations_last_year !== null) {
          document.getElementById("violations_last_year").value = storage_violations_last_year;
  			}

  			if (storage_violations_last_2years !== null) {
          document.getElementById("violations_last_2years").value = storage_violations_last_2years;
  			}

  			if (storage_violations_last_3years !== null) {
          document.getElementById("violations_last_3years").value = storage_violations_last_3years;
  			}

  			if (storage_violations_last_5years !== null) {
          document.getElementById("violations_last_5years").value = storage_violations_last_5years;
  			}

  			submitButtonCheck();

/* STEP 4 - Set up listeners on each field for input events & validate all date entry fields */
			$last_drunk_driving_month.on('input.True', function() {
					this.value = monthValuesCheck(this.value);});
			$last_drunk_driving_year.on('input.True', function() {
					this.value = yearValuesCheck(this.value);});

			$last_reckless_driving_month.on('input.True', function() {
					this.value = monthValuesCheck(this.value);});
			$last_reckless_driving_year.on('input.True', function() {
					this.value = yearValuesCheck(this.value);});

			$last_suspension_month.on('input.True', function() {
					this.value = monthValuesCheck(this.value);});
			$last_suspension_year.on('input.True', function() {
					this.value = yearValuesCheck(this.value);});

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

			$drunk_driving.on('focusin', function() {
					drunk_driving_errors = chkDrivingDetailErrors('drunk_driving', 'focusin', $drunk_driving, $form, last_focus);
					last_focus = "drunk_driving";
			});

			$last_drunk_driving_date.on('focusin', function() {
					drunk_driving_date_errors = chkDrivingDetailErrors('last_drunk_driving_date', 'focusin', $last_drunk_driving_date, $form, last_focus);
					last_focus = "last_drunk_driving_date";
			});

			$reckless_driving.on('focusin', function() {
					reckless_driving_errors = chkDrivingDetailErrors('reckless_driving', 'focusin', $reckless_driving, $form, last_focus);
					last_focus = "reckless_driving";
			});

			$last_reckless_driving_date.on('focusin', function() {
					reckless_driving_date_errors = chkDrivingDetailErrors('last_reckless_driving_date', 'focusin', $last_reckless_driving_date, $form, last_focus);
					last_focus = "last_reckless_driving_date";
			});

			$license_suspension.on('focusin', function() {
					license_suspension_errors = chkDrivingDetailErrors('license_suspension', 'focusin', $license_suspension, $form, last_focus);
					last_focus = "license_suspension";
			});

			$last_suspension_date.on('focusin', function() {
					license_suspension_date_errors = chkDrivingDetailErrors('last_suspension_date', 'focusin', $last_suspension_date, $form, last_focus);
					last_focus = "last_suspension_date";
			});

			$moving_violations.on('focusin', function() {
					moving_violations_errors = chkDrivingDetailErrors('moving_violations', 'focusin', $moving_violations, $form, last_focus);
					last_focus = "moving_violations";
			});

			$violations_last_6mo_wrapper.on('focusin', function() {
					moving_violations_last_6mo_errors = chkDrivingDetailErrors('violations_last_6mo', 'focusin', $violations_last_6mo_wrapper, $form, last_focus);
					last_focus = "violations_last_6mo";
			});

			$violations_last_year_wrapper.on('focusin', function() {
					moving_violations_last_year_errors = chkDrivingDetailErrors('violations_last_year', 'focusin', $violations_last_year_wrapper, $form, last_focus);
					last_focus = "violations_last_year";
			});

			$violations_last_2years_wrapper.on('focusin', function() {
					moving_violations_last_2years_errors = chkDrivingDetailErrors('violations_last_2years', 'focusin', $violations_last_2years_wrapper, $form, last_focus);
					last_focus = "violations_last_2years";
			});

			$violations_last_3years_wrapper.on('focusin', function() {
					moving_violations_last_3years_errors = chkDrivingDetailErrors('violations_last_3years', 'focusin', $violations_last_3years_wrapper, $form, last_focus);
					last_focus = "violations_last_3years";
			});

			$violations_last_5years_wrapper.on('focusin', function() {
					moving_violations_last_5years_errors = chkDrivingDetailErrors('violations_last_5years', 'focusin', $violations_last_5years_wrapper, $form, last_focus);
					last_focus = "violations_last_5years";
			});

  			$('#driving-more-step').click(function(e) {
  				e.preventDefault();
          submitButtonCheck();

  				nextPage = getRedirectURL(currentPage);

          if (submit_errors) {
        		document.getElementById("driving-more-step").disabled = true;
            if (!drunk_driving_errors && !drunk_driving_date_errors && !reckless_driving_errors && !reckless_driving_date_errors && !license_suspension_errors && !license_suspension_date_errors && !moving_violations_errors && !moving_violations_last_6mo_errors && !moving_violations_last_year_errors && !moving_violations_last_2years_errors && !moving_violations_last_3years_errors && !moving_violations_last_5years_errors) {
   					  $(".page_error").show(500);
            } else {
   					  $(".page_error").hide(500);
            }
  				} else {
        		document.getElementById("driving-more-step").disabled = false;
  				  $(".page_error").hide(500);
  					location.href = nextPage;
          }
  			});
        
  			$('#driving-more-prev').click(function(e) {
  				e.preventDefault();
  				window.history.back();
  			});


			function submitButtonCheck() {
				var drunk_driving_selected = $("input[name='DrunkDriving']:checked").val(),
						reckless_driving_selected = $("input[name='RecklessDriving']:checked").val(),
						license_suspension_selected = $("input[name='LicenseSuspension']:checked").val(),
						moving_violations_selected = $("input[name='MovingViolations']:checked").val(),
						conditionals_for_drunk_driving_satisfied = false,
						conditionals_for_reckless_driving_satisfied = false,
						conditionals_for_license_suspensions_satisfied = false,
						conditionals_for_moving_violations_satisfied = false;

				if (drunk_driving_selected == "Yes") {
						$(".conditional_drunk").show(500);
						if (	 $last_drunk_driving_month.val() != '' && /^([\w-]{1,2})?$/.test( $last_drunk_driving_month.val() ) 
								&& $last_drunk_driving_year.val() != '' && /^([\w-]{4,4})?$/.test( $last_drunk_driving_year.val() )
						) {
								conditionals_for_drunk_driving_satisfied = true;
						} else {
								conditionals_for_drunk_driving_satisfied = false;
						}
				} else if (drunk_driving_selected == "No") {
						$(".conditional_drunk").hide(500);
 						$(".last_drunk_driving_date_error").hide(500);
	          $last_drunk_driving_date.css("border-color", no_error_color);
						conditionals_for_drunk_driving_satisfied = true;
						$last_drunk_driving_month.val(null);
						$last_drunk_driving_year.val(null);
				}

				if (reckless_driving_selected == "Yes") {
						$(".conditional_reckless").show(500);
						if (	 $last_reckless_driving_month.val() != '' && /^([\w-]{1,2})?$/.test( $last_reckless_driving_month.val() ) 
								&& $last_reckless_driving_year.val() != '' && /^([\w-]{4,4})?$/.test( $last_reckless_driving_year.val() )
						) {
								conditionals_for_reckless_driving_satisfied = true;
						} else {
								conditionals_for_reckless_driving_satisfied = false;
						}
				} else if (reckless_driving_selected == "No") {
						$(".conditional_reckless").hide(500);
 						$(".last_reckless_driving_date_error").hide(500);
	          $last_reckless_driving_date.css("border-color", no_error_color);
						conditionals_for_reckless_driving_satisfied = true;
						$last_reckless_driving_month.val(null);
						$last_reckless_driving_year.val(null);
				}

				if (license_suspension_selected == "Yes") {
						$(".conditional_suspension").show(500);
						if (	 $last_suspension_month.val() != '' && /^([\w-]{1,2})?$/.test( $last_suspension_month.val() ) 
								&& $last_suspension_year.val() != '' && /^([\w-]{4,4})?$/.test( $last_suspension_year.val() )
						) {
								conditionals_for_license_suspensions_satisfied = true;
						} else {
								conditionals_for_license_suspensions_satisfied = false;
						}
				} else if (license_suspension_selected == "No") {
						$(".conditional_suspension").hide(500);
 						$(".last_suspension_date_error").hide(500);
	          $last_suspension_date.css("border-color", no_error_color);
						conditionals_for_license_suspensions_satisfied = true;
						$last_suspension_month.val(null);
						$last_suspension_year.val(null);
				}

				if (moving_violations_selected == "Yes") {
						$(".conditional_violations").show(500);
						if (	$('#violations_last_6mo').val()  >   0
							 || $('#violations_last_year').val()  >   0
							 || $('#violations_last_2years').val()  >   0
							 || $('#violations_last_3years').val()  >   0
							 || $('#violations_last_5years').val()  >   0
						) {
								conditionals_for_moving_violations_satisfied = true;
						} else {
								conditionals_for_moving_violations_satisfied = false;
						}
				} else if (moving_violations_selected == "No") {
						$(".conditional_violations").hide(500);
 						$(".violations_last_6mo_error").hide(500);
 						$(".violations_last_year_error").hide(500);
 						$(".violations_last_2years_error").hide(500);
 						$(".violations_last_3years_error").hide(500);
 						$(".violations_last_5years_error").hide(500);
	          $violations_last_6mo_wrapper.css("border-color", no_error_color);
	          $violations_last_year_wrapper.css("border-color", no_error_color);
	          $violations_last_2years_wrapper.css("border-color", no_error_color);
	          $violations_last_3years_wrapper.css("border-color", no_error_color);
	          $violations_last_5years_wrapper.css("border-color", no_error_color);
						conditionals_for_moving_violations_satisfied = true;
						$('#violations_last_6mo').val(0);
						$('#violations_last_year').val(0);
						$('#violations_last_2years').val(0);
						$('#violations_last_3years').val(0);
						$('#violations_last_5years').val(0);
				}

				if (drunk_driving_selected != undefined
				 && reckless_driving_selected != undefined
				 && license_suspension_selected != undefined
				 && moving_violations_selected != undefined
				 && conditionals_for_drunk_driving_satisfied
				 && conditionals_for_reckless_driving_satisfied
				 && conditionals_for_license_suspensions_satisfied
				 && conditionals_for_moving_violations_satisfied
				) {
/**/				document.getElementById("submit_button").disabled = false;
/**/				$submit.toggleClass(className, true);
         		document.getElementById("driving-more-step").disabled = false;
      			$driving_more_next.toggleClass(className2, true);
      			submit_errors = false;
 					  $(".page_error").hide(500);
				} else {
/**/				document.getElementById("submit_button").disabled = true;
/**/				$submit.toggleClass(className, false);
         		document.getElementById("driving-more-step").disabled = true;
      			$driving_more_next.toggleClass(className2, false);
      			submit_errors = true;
				}

				storage.setItem('driving_drunk_dui', drunk_driving_selected);
				storage.setItem('driving_last_dui_month', $last_drunk_driving_month.val());
				storage.setItem('driving_last_dui_year', $last_drunk_driving_year.val());
				storage.setItem('driving_reckless', reckless_driving_selected);
				storage.setItem('driving_last_reckless_month', $last_reckless_driving_month.val());
				storage.setItem('driving_last_reckless_year', $last_reckless_driving_year.val());
				storage.setItem('driving_license_suspension', license_suspension_selected);
				storage.setItem('driving_last_suspension_month', $last_suspension_month.val());
				storage.setItem('driving_last_suspension_year', $last_suspension_year.val());
				storage.setItem('driving_moving_violations', moving_violations_selected);
				storage.setItem('driving_violations_last_6mo', $('#violations_last_6mo').val());
				storage.setItem('driving_violations_last_year', $('#violations_last_year').val());
				storage.setItem('driving_violations_last_2years', $('#violations_last_2years').val());
				storage.setItem('driving_violations_last_3years', $('#violations_last_3years').val());
				storage.setItem('driving_violations_last_5years', $('#violations_last_5years').val());

			}
		});
	})(jQuery, window, document);
})

function chkDrivingDetailErrors(objectAffected, focusState, object, $form, last_focus) {
	var error_color = "#AC0036",
	    no_error_color = "#DEDEDE",

			$drunk_driving = $form.find('#drunk-driving'),
			$last_drunk_driving_date = $form.find('#last-drunk-driving-date'),
			$reckless_driving = $form.find('#reckless-driving'),
			$last_reckless_driving_date = $form.find('#last-reckless-driving-date'),
			$license_suspension = $form.find('#license-suspension'),
			$last_suspension_date = $form.find('#last-suspension-date'),
			$moving_violations = $form.find('#moving-violations'),
      $violations_last_6mo_wrapper = $form.find('#violations-last-6mo-wrapper'),
      $violations_last_year_wrapper = $form.find('#violations-last-year-wrapper'),
      $violations_last_2years_wrapper = $form.find('#violations-last-2years-wrapper'),
      $violations_last_3years_wrapper = $form.find('#violations-last-3years-wrapper'),
      $violations_last_5years_wrapper = $form.find('#violations-last-5years-wrapper'),

			drunk_driving_selected = $("input[name='DrunkDriving']:checked").val(),
			$last_drunk_driving_month = $form.find( 'input[id="last_drunk_driving_month"]' ),
			$last_drunk_driving_year = $form.find( 'input[id="last_drunk_driving_year"]' ),

			reckless_driving_selected = $("input[name='RecklessDriving']:checked").val(),
			$last_reckless_driving_month = $form.find( 'input[id="last_reckless_driving_month"]' ),
			$last_reckless_driving_year = $form.find( 'input[id="last_reckless_driving_year"]' ),

			license_suspension_selected = $("input[name='LicenseSuspension']:checked").val(),
			$last_suspension_month = $form.find( 'input[id="last_suspension_month"]' ),
			$last_suspension_year = $form.find( 'input[id="last_suspension_year"]' ),

			moving_violations_selected = $("input[name='MovingViolations']:checked").val(),
			$violations_last_6mo = document.getElementById("violations_last_6mo").value,
			$violations_last_year = document.getElementById("violations_last_year").value,
			$violations_last_2years = document.getElementById("violations_last_2years").value,
			$violations_last_3years = document.getElementById("violations_last_3years").value,
			$violations_last_5years = document.getElementById("violations_last_5years").value;

//	console.log("objectAffected="+objectAffected+"\nfocusState="+focusState+"\nobject="+object.prop("class")+"\nlast_focus="+last_focus); // Use for debugging

	if (focusState == 'focusin') {
		$("."+objectAffected+"_error").hide(500);
    if (objectAffected == 'drunk_driving') {
        $drunk_driving.css("border-color", "black");
//        if (last_focus == "drunk_driving") {chkDrivingDetailErrors('drunk_driving', 'focusout', object, $form, last_focus);}
        if (last_focus == "last_drunk_driving_date") {chkDrivingDetailErrors('last_drunk_driving_date', 'focusout', object, $form, last_focus);}
        if (last_focus == "reckless_driving") {chkDrivingDetailErrors('reckless_driving', 'focusout', object, $form, last_focus);}
        if (last_focus == "last_reckless_driving_date") {chkDrivingDetailErrors('last_reckless_driving_date', 'focusout', object, $form, last_focus);}
        if (last_focus == "license_suspension") {chkDrivingDetailErrors('license_suspension', 'focusout', object, $form, last_focus);}
        if (last_focus == "last_suspension_date") {chkDrivingDetailErrors('last_suspension_date', 'focusout', object, $form, last_focus);}
        if (last_focus == "moving_violations") {chkDrivingDetailErrors('moving_violations', 'focusout', object, $form, last_focus);}
        if (last_focus == "violations_last_6mo") {chkDrivingDetailErrors('violations_last_6mo', 'focusout', object, $form, last_focus);}
        if (last_focus == "violations_last_year") {chkDrivingDetailErrors('violations_last_year', 'focusout', object, $form, last_focus);}
        if (last_focus == "violations_last_2years") {chkDrivingDetailErrors('violations_last_2years', 'focusout', object, $form, last_focus);}
        if (last_focus == "violations_last_3years") {chkDrivingDetailErrors('violations_last_3years', 'focusout', object, $form, last_focus);}
        if (last_focus == "violations_last_5years") {chkDrivingDetailErrors('violations_last_5years', 'focusout', object, $form, last_focus);}
    } else if (objectAffected == 'last_drunk_driving_date') {
        $last_drunk_driving_date.css("border-color", "black");
        if (last_focus == "drunk_driving") {chkDrivingDetailErrors('drunk_driving', 'focusout', object, $form, last_focus);}
//        if (last_focus == "last_drunk_driving_date") {chkDrivingDetailErrors('last_drunk_driving_date', 'focusout', object, $form, last_focus);}
        if (last_focus == "reckless_driving") {chkDrivingDetailErrors('reckless_driving', 'focusout', object, $form, last_focus);}
        if (last_focus == "last_reckless_driving_date") {chkDrivingDetailErrors('last_reckless_driving_date', 'focusout', object, $form, last_focus);}
        if (last_focus == "license_suspension") {chkDrivingDetailErrors('license_suspension', 'focusout', object, $form, last_focus);}
        if (last_focus == "last_suspension_date") {chkDrivingDetailErrors('last_suspension_date', 'focusout', object, $form, last_focus);}
        if (last_focus == "moving_violations") {chkDrivingDetailErrors('moving_violations', 'focusout', object, $form, last_focus);}
        if (last_focus == "violations_last_6mo") {chkDrivingDetailErrors('violations_last_6mo', 'focusout', object, $form, last_focus);}
        if (last_focus == "violations_last_year") {chkDrivingDetailErrors('violations_last_year', 'focusout', object, $form, last_focus);}
        if (last_focus == "violations_last_2years") {chkDrivingDetailErrors('violations_last_2years', 'focusout', object, $form, last_focus);}
        if (last_focus == "violations_last_3years") {chkDrivingDetailErrors('violations_last_3years', 'focusout', object, $form, last_focus);}
        if (last_focus == "violations_last_5years") {chkDrivingDetailErrors('violations_last_5years', 'focusout', object, $form, last_focus);}
    } else if (objectAffected == 'reckless_driving') {
        $reckless_driving.css("border-color", "black");
        if (last_focus == "drunk_driving") {chkDrivingDetailErrors('drunk_driving', 'focusout', object, $form, last_focus);}
        if (last_focus == "last_drunk_driving_date") {chkDrivingDetailErrors('last_drunk_driving_date', 'focusout', object, $form, last_focus);}
//        if (last_focus == "reckless_driving") {chkDrivingDetailErrors('reckless_driving', 'focusout', object, $form, last_focus);}
        if (last_focus == "last_reckless_driving_date") {chkDrivingDetailErrors('last_reckless_driving_date', 'focusout', object, $form, last_focus);}
        if (last_focus == "license_suspension") {chkDrivingDetailErrors('license_suspension', 'focusout', object, $form, last_focus);}
        if (last_focus == "last_suspension_date") {chkDrivingDetailErrors('last_suspension_date', 'focusout', object, $form, last_focus);}
        if (last_focus == "moving_violations") {chkDrivingDetailErrors('moving_violations', 'focusout', object, $form, last_focus);}
        if (last_focus == "violations_last_6mo") {chkDrivingDetailErrors('violations_last_6mo', 'focusout', object, $form, last_focus);}
        if (last_focus == "violations_last_year") {chkDrivingDetailErrors('violations_last_year', 'focusout', object, $form, last_focus);}
        if (last_focus == "violations_last_2years") {chkDrivingDetailErrors('violations_last_2years', 'focusout', object, $form, last_focus);}
        if (last_focus == "violations_last_3years") {chkDrivingDetailErrors('violations_last_3years', 'focusout', object, $form, last_focus);}
        if (last_focus == "violations_last_5years") {chkDrivingDetailErrors('violations_last_5years', 'focusout', object, $form, last_focus);}
    } else if (objectAffected == 'last_reckless_driving_date') {
        $last_reckless_driving_date.css("border-color", "black");
        if (last_focus == "drunk_driving") {chkDrivingDetailErrors('drunk_driving', 'focusout', object, $form, last_focus);}
        if (last_focus == "last_drunk_driving_date") {chkDrivingDetailErrors('last_drunk_driving_date', 'focusout', object, $form, last_focus);}
        if (last_focus == "reckless_driving") {chkDrivingDetailErrors('reckless_driving', 'focusout', object, $form, last_focus);}
//        if (last_focus == "last_reckless_driving_date") {chkDrivingDetailErrors('last_reckless_driving_date', 'focusout', object, $form, last_focus);}
        if (last_focus == "license_suspension") {chkDrivingDetailErrors('license_suspension', 'focusout', object, $form, last_focus);}
        if (last_focus == "last_suspension_date") {chkDrivingDetailErrors('last_suspension_date', 'focusout', object, $form, last_focus);}
        if (last_focus == "moving_violations") {chkDrivingDetailErrors('moving_violations', 'focusout', object, $form, last_focus);}
        if (last_focus == "violations_last_6mo") {chkDrivingDetailErrors('violations_last_6mo', 'focusout', object, $form, last_focus);}
        if (last_focus == "violations_last_year") {chkDrivingDetailErrors('violations_last_year', 'focusout', object, $form, last_focus);}
        if (last_focus == "violations_last_2years") {chkDrivingDetailErrors('violations_last_2years', 'focusout', object, $form, last_focus);}
        if (last_focus == "violations_last_3years") {chkDrivingDetailErrors('violations_last_3years', 'focusout', object, $form, last_focus);}
        if (last_focus == "violations_last_5years") {chkDrivingDetailErrors('violations_last_5years', 'focusout', object, $form, last_focus);}
    } else if (objectAffected == 'license_suspension') {
        $license_suspension.css("border-color", "black");
        if (last_focus == "drunk_driving") {chkDrivingDetailErrors('drunk_driving', 'focusout', object, $form, last_focus);}
        if (last_focus == "last_drunk_driving_date") {chkDrivingDetailErrors('last_drunk_driving_date', 'focusout', object, $form, last_focus);}
        if (last_focus == "reckless_driving") {chkDrivingDetailErrors('reckless_driving', 'focusout', object, $form, last_focus);}
        if (last_focus == "last_reckless_driving_date") {chkDrivingDetailErrors('last_reckless_driving_date', 'focusout', object, $form, last_focus);}
//        if (last_focus == "license_suspension") {chkDrivingDetailErrors('license_suspension', 'focusout', object, $form, last_focus);}
        if (last_focus == "last_suspension_date") {chkDrivingDetailErrors('last_suspension_date', 'focusout', object, $form, last_focus);}
        if (last_focus == "moving_violations") {chkDrivingDetailErrors('moving_violations', 'focusout', object, $form, last_focus);}
        if (last_focus == "violations_last_6mo") {chkDrivingDetailErrors('violations_last_6mo', 'focusout', object, $form, last_focus);}
        if (last_focus == "violations_last_year") {chkDrivingDetailErrors('violations_last_year', 'focusout', object, $form, last_focus);}
        if (last_focus == "violations_last_2years") {chkDrivingDetailErrors('violations_last_2years', 'focusout', object, $form, last_focus);}
        if (last_focus == "violations_last_3years") {chkDrivingDetailErrors('violations_last_3years', 'focusout', object, $form, last_focus);}
        if (last_focus == "violations_last_5years") {chkDrivingDetailErrors('violations_last_5years', 'focusout', object, $form, last_focus);}
    } else if (objectAffected == 'last_suspension_date') {
        $last_suspension_date.css("border-color", "black");
        if (last_focus == "drunk_driving") {chkDrivingDetailErrors('drunk_driving', 'focusout', object, $form, last_focus);}
        if (last_focus == "last_drunk_driving_date") {chkDrivingDetailErrors('last_drunk_driving_date', 'focusout', object, $form, last_focus);}
        if (last_focus == "reckless_driving") {chkDrivingDetailErrors('reckless_driving', 'focusout', object, $form, last_focus);}
        if (last_focus == "last_reckless_driving_date") {chkDrivingDetailErrors('last_reckless_driving_date', 'focusout', object, $form, last_focus);}
        if (last_focus == "license_suspension") {chkDrivingDetailErrors('license_suspension', 'focusout', object, $form, last_focus);}
//        if (last_focus == "last_suspension_date") {chkDrivingDetailErrors('last_suspension_date', 'focusout', object, $form, last_focus);}
        if (last_focus == "moving_violations") {chkDrivingDetailErrors('moving_violations', 'focusout', object, $form, last_focus);}
        if (last_focus == "violations_last_6mo") {chkDrivingDetailErrors('violations_last_6mo', 'focusout', object, $form, last_focus);}
        if (last_focus == "violations_last_year") {chkDrivingDetailErrors('violations_last_year', 'focusout', object, $form, last_focus);}
        if (last_focus == "violations_last_2years") {chkDrivingDetailErrors('violations_last_2years', 'focusout', object, $form, last_focus);}
        if (last_focus == "violations_last_3years") {chkDrivingDetailErrors('violations_last_3years', 'focusout', object, $form, last_focus);}
        if (last_focus == "violations_last_5years") {chkDrivingDetailErrors('violations_last_5years', 'focusout', object, $form, last_focus);}
    } else if (objectAffected == 'moving_violations') {
        $moving_violations.css("border-color", "black");
        if (last_focus == "drunk_driving") {chkDrivingDetailErrors('drunk_driving', 'focusout', object, $form, last_focus);}
        if (last_focus == "last_drunk_driving_date") {chkDrivingDetailErrors('last_drunk_driving_date', 'focusout', object, $form, last_focus);}
        if (last_focus == "reckless_driving") {chkDrivingDetailErrors('reckless_driving', 'focusout', object, $form, last_focus);}
        if (last_focus == "last_reckless_driving_date") {chkDrivingDetailErrors('last_reckless_driving_date', 'focusout', object, $form, last_focus);}
        if (last_focus == "license_suspension") {chkDrivingDetailErrors('license_suspension', 'focusout', object, $form, last_focus);}
        if (last_focus == "last_suspension_date") {chkDrivingDetailErrors('last_suspension_date', 'focusout', object, $form, last_focus);}
//        if (last_focus == "moving_violations") {chkDrivingDetailErrors('moving_violations', 'focusout', object, $form, last_focus);}
        if (last_focus == "violations_last_6mo") {chkDrivingDetailErrors('violations_last_6mo', 'focusout', object, $form, last_focus);}
        if (last_focus == "violations_last_year") {chkDrivingDetailErrors('violations_last_year', 'focusout', object, $form, last_focus);}
        if (last_focus == "violations_last_2years") {chkDrivingDetailErrors('violations_last_2years', 'focusout', object, $form, last_focus);}
        if (last_focus == "violations_last_3years") {chkDrivingDetailErrors('violations_last_3years', 'focusout', object, $form, last_focus);}
        if (last_focus == "violations_last_5years") {chkDrivingDetailErrors('violations_last_5years', 'focusout', object, $form, last_focus);}
    } else if (objectAffected == 'violations_last_6mo') {
        $violations_last_6mo_wrapper.css("border-color", "black");
        if (last_focus == "drunk_driving") {chkDrivingDetailErrors('drunk_driving', 'focusout', object, $form, last_focus);}
        if (last_focus == "last_drunk_driving_date") {chkDrivingDetailErrors('last_drunk_driving_date', 'focusout', object, $form, last_focus);}
        if (last_focus == "reckless_driving") {chkDrivingDetailErrors('reckless_driving', 'focusout', object, $form, last_focus);}
        if (last_focus == "last_reckless_driving_date") {chkDrivingDetailErrors('last_reckless_driving_date', 'focusout', object, $form, last_focus);}
        if (last_focus == "license_suspension") {chkDrivingDetailErrors('license_suspension', 'focusout', object, $form, last_focus);}
        if (last_focus == "last_suspension_date") {chkDrivingDetailErrors('last_suspension_date', 'focusout', object, $form, last_focus);}
        if (last_focus == "moving_violations") {chkDrivingDetailErrors('moving_violations', 'focusout', object, $form, last_focus);}
//        if (last_focus == "violations_last_6mo") {chkDrivingDetailErrors('violations_last_6mo', 'focusout', object, $form, last_focus);}
        if (last_focus == "violations_last_year") {chkDrivingDetailErrors('violations_last_year', 'focusout', object, $form, last_focus);}
        if (last_focus == "violations_last_2years") {chkDrivingDetailErrors('violations_last_2years', 'focusout', object, $form, last_focus);}
        if (last_focus == "violations_last_3years") {chkDrivingDetailErrors('violations_last_3years', 'focusout', object, $form, last_focus);}
        if (last_focus == "violations_last_5years") {chkDrivingDetailErrors('violations_last_5years', 'focusout', object, $form, last_focus);}
    } else if (objectAffected == 'violations_last_year') {
        $violations_last_year_wrapper.css("border-color", "black");
        if (last_focus == "drunk_driving") {chkDrivingDetailErrors('drunk_driving', 'focusout', object, $form, last_focus);}
        if (last_focus == "last_drunk_driving_date") {chkDrivingDetailErrors('last_drunk_driving_date', 'focusout', object, $form, last_focus);}
        if (last_focus == "reckless_driving") {chkDrivingDetailErrors('reckless_driving', 'focusout', object, $form, last_focus);}
        if (last_focus == "last_reckless_driving_date") {chkDrivingDetailErrors('last_reckless_driving_date', 'focusout', object, $form, last_focus);}
        if (last_focus == "license_suspension") {chkDrivingDetailErrors('license_suspension', 'focusout', object, $form, last_focus);}
        if (last_focus == "last_suspension_date") {chkDrivingDetailErrors('last_suspension_date', 'focusout', object, $form, last_focus);}
        if (last_focus == "moving_violations") {chkDrivingDetailErrors('moving_violations', 'focusout', object, $form, last_focus);}
        if (last_focus == "violations_last_6mo") {chkDrivingDetailErrors('violations_last_6mo', 'focusout', object, $form, last_focus);}
//        if (last_focus == "violations_last_year") {chkDrivingDetailErrors('violations_last_year', 'focusout', object, $form, last_focus);}
        if (last_focus == "violations_last_2years") {chkDrivingDetailErrors('violations_last_2years', 'focusout', object, $form, last_focus);}
        if (last_focus == "violations_last_3years") {chkDrivingDetailErrors('violations_last_3years', 'focusout', object, $form, last_focus);}
        if (last_focus == "violations_last_5years") {chkDrivingDetailErrors('violations_last_5years', 'focusout', object, $form, last_focus);}
    } else if (objectAffected == 'violations_last_2years') {
        $violations_last_2years_wrapper.css("border-color", "black");
        if (last_focus == "drunk_driving") {chkDrivingDetailErrors('drunk_driving', 'focusout', object, $form, last_focus);}
        if (last_focus == "last_drunk_driving_date") {chkDrivingDetailErrors('last_drunk_driving_date', 'focusout', object, $form, last_focus);}
        if (last_focus == "reckless_driving") {chkDrivingDetailErrors('reckless_driving', 'focusout', object, $form, last_focus);}
        if (last_focus == "last_reckless_driving_date") {chkDrivingDetailErrors('last_reckless_driving_date', 'focusout', object, $form, last_focus);}
        if (last_focus == "license_suspension") {chkDrivingDetailErrors('license_suspension', 'focusout', object, $form, last_focus);}
        if (last_focus == "last_suspension_date") {chkDrivingDetailErrors('last_suspension_date', 'focusout', object, $form, last_focus);}
        if (last_focus == "moving_violations") {chkDrivingDetailErrors('moving_violations', 'focusout', object, $form, last_focus);}
        if (last_focus == "violations_last_6mo") {chkDrivingDetailErrors('violations_last_6mo', 'focusout', object, $form, last_focus);}
        if (last_focus == "violations_last_year") {chkDrivingDetailErrors('violations_last_year', 'focusout', object, $form, last_focus);}
//        if (last_focus == "violations_last_2years") {chkDrivingDetailErrors('violations_last_2years', 'focusout', object, $form, last_focus);}
        if (last_focus == "violations_last_3years") {chkDrivingDetailErrors('violations_last_3years', 'focusout', object, $form, last_focus);}
        if (last_focus == "violations_last_5years") {chkDrivingDetailErrors('violations_last_5years', 'focusout', object, $form, last_focus);}
    } else if (objectAffected == 'violations_last_3years') {
        $violations_last_3years_wrapper.css("border-color", "black");
        if (last_focus == "drunk_driving") {chkDrivingDetailErrors('drunk_driving', 'focusout', object, $form, last_focus);}
        if (last_focus == "last_drunk_driving_date") {chkDrivingDetailErrors('last_drunk_driving_date', 'focusout', object, $form, last_focus);}
        if (last_focus == "reckless_driving") {chkDrivingDetailErrors('reckless_driving', 'focusout', object, $form, last_focus);}
        if (last_focus == "last_reckless_driving_date") {chkDrivingDetailErrors('last_reckless_driving_date', 'focusout', object, $form, last_focus);}
        if (last_focus == "license_suspension") {chkDrivingDetailErrors('license_suspension', 'focusout', object, $form, last_focus);}
        if (last_focus == "last_suspension_date") {chkDrivingDetailErrors('last_suspension_date', 'focusout', object, $form, last_focus);}
        if (last_focus == "moving_violations") {chkDrivingDetailErrors('moving_violations', 'focusout', object, $form, last_focus);}
        if (last_focus == "violations_last_6mo") {chkDrivingDetailErrors('violations_last_6mo', 'focusout', object, $form, last_focus);}
        if (last_focus == "violations_last_year") {chkDrivingDetailErrors('violations_last_year', 'focusout', object, $form, last_focus);}
        if (last_focus == "violations_last_2years") {chkDrivingDetailErrors('violations_last_2years', 'focusout', object, $form, last_focus);}
//        if (last_focus == "violations_last_3years") {chkDrivingDetailErrors('violations_last_3years', 'focusout', object, $form, last_focus);}
        if (last_focus == "violations_last_5years") {chkDrivingDetailErrors('violations_last_5years', 'focusout', object, $form, last_focus);}
    } else if (objectAffected == 'violations_last_5years') {
        $violations_last_5years_wrapper.css("border-color", "black");
        if (last_focus == "drunk_driving") {chkDrivingDetailErrors('drunk_driving', 'focusout', object, $form, last_focus);}
        if (last_focus == "last_drunk_driving_date") {chkDrivingDetailErrors('last_drunk_driving_date', 'focusout', object, $form, last_focus);}
        if (last_focus == "reckless_driving") {chkDrivingDetailErrors('reckless_driving', 'focusout', object, $form, last_focus);}
        if (last_focus == "last_reckless_driving_date") {chkDrivingDetailErrors('last_reckless_driving_date', 'focusout', object, $form, last_focus);}
        if (last_focus == "license_suspension") {chkDrivingDetailErrors('license_suspension', 'focusout', object, $form, last_focus);}
        if (last_focus == "last_suspension_date") {chkDrivingDetailErrors('last_suspension_date', 'focusout', object, $form, last_focus);}
        if (last_focus == "moving_violations") {chkDrivingDetailErrors('moving_violations', 'focusout', object, $form, last_focus);}
        if (last_focus == "violations_last_6mo") {chkDrivingDetailErrors('violations_last_6mo', 'focusout', object, $form, last_focus);}
        if (last_focus == "violations_last_year") {chkDrivingDetailErrors('violations_last_year', 'focusout', object, $form, last_focus);}
        if (last_focus == "violations_last_2years") {chkDrivingDetailErrors('violations_last_2years', 'focusout', object, $form, last_focus);}
        if (last_focus == "violations_last_3years") {chkDrivingDetailErrors('violations_last_3years', 'focusout', object, $form, last_focus);}
//        if (last_focus == "violations_last_5years") {chkDrivingDetailErrors('violations_last_5years', 'focusout', object, $form, last_focus);}
	  } else {
        object.css("border-color", "black");
    }
		return false;
	} else if (focusState == 'focusout') {
    if (objectAffected == 'drunk_driving') {
	    	if (drunk_driving_selected != undefined) {
					$("."+objectAffected+"_error").hide(500);
          $drunk_driving.css("border-color", no_error_color);
					return false;
  		  } else {
					$("."+objectAffected+"_error").show(500);
          $(".page_error").hide(500);
          $drunk_driving.css("border-color", error_color);
					return true;
				}
		}
    if (objectAffected == 'last_drunk_driving_date') {
				if ($last_drunk_driving_month.val().length > 0 && $last_drunk_driving_year.val().length == 4) {
					$("."+objectAffected+"_error").hide(500);
          $last_drunk_driving_date.css("border-color", no_error_color);
					return false;
  		  } else {
					$("."+objectAffected+"_error").show(500);
          $(".page_error").hide(500);
          $last_drunk_driving_date.css("border-color", error_color);
					return true;
				}
		}
    if (objectAffected == 'reckless_driving') {
	    	if (reckless_driving_selected != undefined) {
					$("."+objectAffected+"_error").hide(500);
          $reckless_driving.css("border-color", no_error_color);
					return false;
  		  } else {
					$("."+objectAffected+"_error").show(500);
          $(".page_error").hide(500);
          $reckless_driving.css("border-color", error_color);
					return true;
				}
		}
    if (objectAffected == 'last_reckless_driving_date') {
				if ($last_reckless_driving_month.val().length > 0 && $last_reckless_driving_year.val().length == 4) {
					$("."+objectAffected+"_error").hide(500);
          $last_reckless_driving_date.css("border-color", no_error_color);
					return false;
  		  } else {
					$("."+objectAffected+"_error").show(500);
          $(".page_error").hide(500);
          $last_reckless_driving_date.css("border-color", error_color);
					return true;
				}
		}
    if (objectAffected == 'license_suspension') {
	    	if (license_suspension_selected != undefined) {
					$("."+objectAffected+"_error").hide(500);
          $license_suspension.css("border-color", no_error_color);
					return false;
  		  } else {
					$("."+objectAffected+"_error").show(500);
          $(".page_error").hide(500);
          $license_suspension.css("border-color", error_color);
					return true;
				}
		}
    if (objectAffected == 'last_suspension_date') {
				if ($last_suspension_month.val().length > 0 && $last_suspension_year.val().length == 4) {
					$("."+objectAffected+"_error").hide(500);
          $last_suspension_date.css("border-color", no_error_color);
					return false;
  		  } else {
					$("."+objectAffected+"_error").show(500);
          $(".page_error").hide(500);
          $last_suspension_date.css("border-color", error_color);
					return true;
				}
		}
    if (objectAffected == 'moving_violations') {
	    	if (moving_violations_selected != undefined) {
					$("."+objectAffected+"_error").hide(500);
          $moving_violations.css("border-color", no_error_color);
					return false;
  		  } else {
					$("."+objectAffected+"_error").show(500);
          $(".page_error").hide(500);
          $moving_violations.css("border-color", error_color);
					return true;
				}
		}
    if (objectAffected == 'violations_last_6mo') {
	    	if ($violations_last_6mo.length > 0) {
					$("."+objectAffected+"_error").hide(500);
          $violations_last_6mo_wrapper.css("border-color", no_error_color);
					return false;
  		  } else {
					$("."+objectAffected+"_error").show(500);
          $(".page_error").hide(500);
          $violations_last_6mo_wrapper.css("border-color", error_color);
					return true;
				}
		}
    if (objectAffected == 'violations_last_year') {
	    	if ($violations_last_year.length > 0) {
					$("."+objectAffected+"_error").hide(500);
          $violations_last_year_wrapper.css("border-color", no_error_color);
					return false;
  		  } else {
					$("."+objectAffected+"_error").show(500);
          $(".page_error").hide(500);
          $violations_last_year_wrapper.css("border-color", error_color);
					return true;
				}
		}
    if (objectAffected == 'violations_last_2years') {
	    	if ($violations_last_2years.length > 0) {
					$("."+objectAffected+"_error").hide(500);
          $violations_last_2years_wrapper.css("border-color", no_error_color);
					return false;
  		  } else {
					$("."+objectAffected+"_error").show(500);
          $(".page_error").hide(500);
          $violations_last_2years_wrapper.css("border-color", error_color);
					return true;
				}
		}
    if (objectAffected == 'violations_last_3years') {
	    	if ($violations_last_3years.length > 0) {
					$("."+objectAffected+"_error").hide(500);
          $violations_last_3years_wrapper.css("border-color", no_error_color);
					return false;
  		  } else {
					$("."+objectAffected+"_error").show(500);
          $(".page_error").hide(500);
          $violations_last_3years_wrapper.css("border-color", error_color);
					return true;
				}
		}
    if (objectAffected == 'violations_last_5years') {
	    	if ($violations_last_5years.length > 0) {
					$("."+objectAffected+"_error").hide(500);
          $violations_last_5years_wrapper.css("border-color", no_error_color);
					return false;
  		  } else {
					$("."+objectAffected+"_error").show(500);
          $(".page_error").hide(500);
          $violations_last_5years_wrapper.css("border-color", error_color);
					return true;
				}
		}

	}
}
