/*
Webflow.push(function(){
	$("#quote").submit(function(){
		var storage = window.localStorage,
				currentPage = 6, // PAGE: diabetes = 6
				nextPage;
		$('#quote_initiated_from_ip_address').val(storage.getItem('quote_initiated_from_ip_address'));
		$('#quote_initiated_datetime').val(storage.getItem('quote_initiated_datetime'));
		$('#commit_point').val("8-diabetes");

		nextPage = getRedirectURL(currentPage);
		location.href = nextPage;
	})
});
*/
	// Move all items from containers holding items beyond first 100 to the main target container where all will be filtered
  $('.select-text').each(function(){
  	var s = $(this).text();
  	$('.daily_insulin').append('<option value="'+s+'">'+s+'</option>');
  })
  $('.select-text-b').each(function(){
  	var s = $(this).text();
  	$('.daily_insulin').append('<option value="'+s+'">'+s+'</option>');
  })

	$(function() {
		;
		(function($, window, document, undefined) {
			'use strict';
			var form = '.quote',
					className = 'submit_button_active',
     			className2 = 'button_active',
					submit = 'input[type="submit"]',
    			storage = window.localStorage;

			$(form).each(function() {
				var $form = $(this),
						$submit = $form.find( submit ),
	     			$diabetes_more_next = $form.find( '#diabetes-more-step' ),
						currentPage = 6, // PAGE: diabetes = 6
      			nextPage,
      			last_focus,
						error_color = "#AC0036",
				    no_error_color = "#DEDEDE",
						enabled = true,
            submit_errors = true,

      			$diagnosis_date = $form.find('#diagnosis-date'),
            $diabetes_type = $form.find('#diabetes-type'),
            $last_A1C_wrapper = $form.find('#last-A1C-wrapper'),
            $A1C_last_year_wrapper = $form.find('#A1C-last-year-wrapper'),
            $complications = $form.find('#complications'),
            $current_treatment = $form.find('#current-treatment'),
      			$treatment_date = $form.find('#treatment-date'),
            $daily_insulin_wrapper = $form.find('#daily-insulin-wrapper'),

						$diagnosis_month = $form.find( 'input[id="diagnosis_month"]' ),
						$diagnosis_year = $form.find( 'input[id="diagnosis_year"]' ),
						$treatment_end_month = $form.find( 'input[id="treatment_end_month"]' ),
						$treatment_end_year = $form.find( 'input[id="treatment_end_year"]' ),

            diagnosis_date_errors = false,
            diabetes_type_errors = false,
            last_A1C_errors = false,
            A1C_last_year_errors = false,
            complications_errors = false,
            current_treatment_errors = false,
            treatment_date_errors = false,
            daily_insulin_errors = false;


				$('#commit_point').val("8-diabetes");
				$('#quote_initiated_datetime').val(storage.getItem('quote_initiated_datetime'));
				$('#quote_initiated_from_ip_address').val(storage.getItem('quote_initiated_from_ip_address'));
				$('#quote_initiated_from_city').val(storage.getItem('quote_initiated_from_city'));

  			document.getElementById("diabetes-more-step").disabled = true;
				document.getElementById("submit_button").disabled = true;

/* STEP 1 - Set up masks for all number entry fields */
				$diagnosis_month.mask("#0");
				$diagnosis_year.mask("0000");
				$treatment_end_month.mask("#0");
				$treatment_end_year.mask("0000");

/* STEP 2 - Grab the current values in localStorage so they can be set on each page, in the event that a user 
            left this page and comes back later, so they don't lose data that they may have already entered */
  			var storage_diag_month = storage.getItem('diabetes_diag_month'),
  					storage_diag_year = storage.getItem('diabetes_diag_year'),
  					storage_diabetes_type = storage.getItem('diabetes_type'),
  					storage_last_a1c = storage.getItem('diabetes_last_a1c'),
  					storage_a1c_last_year = storage.getItem('diabetes_a1c_last_year'),
  					storage_complications = storage.getItem('diabetes_complications'),
  					storage_current_treatment = storage.getItem('diabetes_treatment'),
  					storage_treatment_month = storage.getItem('diabetes_treatment_month'),
  					storage_treatment_year = storage.getItem('diabetes_treatment_year'),
  					storage_daily_insulin = storage.getItem('diabetes_daily_insulin');

/* STEP 3 - Evaluate whether there was data in localStorage for the page, and re-initialize it with that data, if there was */
  			if (storage_diag_month !== null) {
  				$diagnosis_month.val(storage_diag_month);
  			}

  			if (storage_diag_year !== null) {
  				$diagnosis_year.val(storage_diag_year);
  			}

  			if (storage_diabetes_type !== null) {
  				$("input[name='DiabetesType'][value='" + storage_diabetes_type + "']").prop("checked", true);
  			}

  			if (storage_last_a1c !== null && storage_last_a1c !== "") {
          document.getElementById("last_a1c").value = storage_last_a1c;
  			}

  			if (storage_a1c_last_year !== null && storage_a1c_last_year !== "") {
          document.getElementById("a1c_last_year").value = storage_a1c_last_year;
  			}

  			if (storage_complications !== null) {
  				$("input[name='Complications'][value='" + storage_complications + "']").prop("checked", true);
  			}

  			if (storage_current_treatment !== null) {
  				$("input[name='Treatment'][value='" + storage_current_treatment + "']").prop("checked", true);
  				$("input[name='Treatment'][value='" + storage_current_treatment + "']").prev('.w-radio-input').addClass('w--redirected-checked');
  				$("#treatment_" + storage_current_treatment.toLowerCase()).parent().css( "backgroundColor", "#48bd9d" );
  				$("#treatment_" + storage_current_treatment.toLowerCase()).parent().css( "border", "#48bd9e" );
  				$("#treatment_" + storage_current_treatment.toLowerCase()).parent().css( "color", "#ffffff" );
  			}

  			if (storage_treatment_month !== null) {
  				$treatment_end_month.val(storage_treatment_month);
  			}

  			if (storage_treatment_year !== null) {
  				$treatment_end_year.val(storage_treatment_year);
  			}

  			if (storage_daily_insulin !== null && storage_daily_insulin !== "") {
          document.getElementById("daily_insulin").value = storage_daily_insulin;
  			}

  			submitButtonCheck();

/* STEP 4 - Set up listeners on each field for input events & validate all date entry fields */
				$diagnosis_month.on('input.True', function() {
					this.value = monthValuesCheck(this.value);});
				$diagnosis_year.on('input.True', function() {
					this.value = yearValuesCheck(this.value);});
				$treatment_end_month.on('input.True', function() {
					this.value = monthValuesCheck(this.value);});
				$treatment_end_year.on('input.True', function() {
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

  			$diagnosis_date.on('focusin', function() {
  					diagnosis_date_errors = chkDiabetesDetailErrors('diagnosis_date', 'focusin', $diagnosis_date, $form, last_focus);
  					last_focus = "diagnosis_date";
  			});

  			$diabetes_type.on('focusin', function() {
  					diabetes_type_errors = chkDiabetesDetailErrors('diabetes_type', 'focusin', $diabetes_type, $form, last_focus);
  					last_focus = "diabetes_type";
  			});

  			$last_A1C_wrapper.on('focusin', function() {
  					last_A1C_errors = chkDiabetesDetailErrors('last_a1c', 'focusin', $last_A1C_wrapper, $form, last_focus);
  					last_focus = "last_a1c";
  			});

  			$A1C_last_year_wrapper.on('focusin', function() {
  					A1C_last_year_errors = chkDiabetesDetailErrors('a1c_last_year', 'focusin', $A1C_last_year_wrapper, $form, last_focus);
  					last_focus = "a1c_last_year";
  			});

  			$complications.on('focusin', function() {
  					complications_errors = chkDiabetesDetailErrors('complications', 'focusin', $complications, $form, last_focus);
  					last_focus = "complications";
  			});

  			$current_treatment.on('focusin', function() {
  					current_treatment_errors = chkDiabetesDetailErrors('current_treatment', 'focusin', $current_treatment, $form, last_focus);
  					last_focus = "current_treatment";
  			});

  			$treatment_date.on('focusin', function() {
  					treatment_date_errors = chkDiabetesDetailErrors('treatment_date', 'focusin', $treatment_date, $form, last_focus);
  					last_focus = "treatment_date";
  			});

  			$daily_insulin_wrapper.on('focusin', function() {
  					daily_insulin_errors = chkDiabetesDetailErrors('daily_insulin', 'focusin', $daily_insulin_wrapper, $form, last_focus);
  					last_focus = "daily_insulin";
  			});

  			$daily_insulin_wrapper.on('focusout', function() {
  					daily_insulin_errors = chkDiabetesDetailErrors('daily_insulin', 'focusout', $daily_insulin_wrapper, $form, last_focus);
  					last_focus = "daily_insulin";
  			});

  			$('#diabetes-more-step').click(function(e) {
  				e.preventDefault();
          submitButtonCheck();

  				nextPage = getRedirectURL(currentPage);

          if (submit_errors) {
        		document.getElementById("diabetes-more-step").disabled = true;
            if (!diagnosis_date_errors && !diabetes_type_errors && !last_A1C_errors && !A1C_last_year_errors && !complications_errors && !current_treatment_errors && !treatment_date_errors && !daily_insulin_errors) {
   					  $(".page_error").show(500);
            } else {
   					  $(".page_error").hide(500);
            }
  				} else {
        		document.getElementById("diabetes-more-step").disabled = false;
  				  $(".page_error").hide(500);
  					location.href = nextPage;
          }
  			});
        
  			$('#diabetes-more-prev').click(function(e) {
  				e.preventDefault();
  				window.history.back();
  			});


				function submitButtonCheck() {
					var storage = window.localStorage,
							type_selected = $("input[name='DiabetesType']:checked").val(),
							complications_selected = $("input[name='Complications']:checked").val(),
							treatment_selected = $("input[name='Treatment']:checked").val(),
							conditionals_for_treatment_satisfied = false,
							$last_a1c = document.getElementById("last_a1c").value,
							$a1c_last_year = document.getElementById("a1c_last_year").value,
							$daily_insulin = document.getElementById("daily_insulin").value;

					if (treatment_selected == "Yes") {
							$(".conditional_treatment_no").hide(500);
							$treatment_end_month.val(null);
							$treatment_end_year.val(null);
   						$(".treatment_date_error").hide(500);
  	          $treatment_date.css("border-color", no_error_color);
							conditionals_for_treatment_satisfied = true;
					} else if (treatment_selected == "No") {
							$(".conditional_treatment_no").show(500);
							if (	 $treatment_end_month.val() != '' && /^([\w-]{1,2})?$/.test( $treatment_end_month.val() ) 
									&& $treatment_end_year.val() != '' && /^([\w-]{4,4})?$/.test( $treatment_end_year.val() )
							) {
									conditionals_for_treatment_satisfied = true;
              } else {
									conditionals_for_treatment_satisfied = false;
              }
					}

					if ($diagnosis_month.val() != '' && /^([\w-]{1,2})?$/.test( $diagnosis_month.val() ) 
					 && $diagnosis_year.val() != '' && /^([\w-]{4,4})?$/.test( $diagnosis_year.val() ) 
					 && type_selected != undefined
					 && complications_selected != undefined
					 && treatment_selected != undefined
					 && conditionals_for_treatment_satisfied
           && $daily_insulin.length > 0
					) {
/**/          document.getElementById("submit_button").disabled = false;
/**/					$submit.toggleClass(className, true);
           		document.getElementById("diabetes-more-step").disabled = false;
        			$diabetes_more_next.toggleClass(className2, true);
        			submit_errors = false;
   					  $(".page_error").hide(500);
					} else {
/**/          document.getElementById("submit_button").disabled = true;
/**/					$submit.toggleClass(className, false);
           		document.getElementById("diabetes-more-step").disabled = true;
        			$diabetes_more_next.toggleClass(className2, false);
        			submit_errors = true;
          }

					storage.setItem('diabetes_diag_month', $diagnosis_month.val());
					storage.setItem('diabetes_diag_year', $diagnosis_year.val());
					storage.setItem('diabetes_type', type_selected);
					storage.setItem('diabetes_last_a1c', last_a1c);
					storage.setItem('diabetes_a1c_last_year', a1c_last_year);
					storage.setItem('diabetes_complications', complications_selected);
					storage.setItem('diabetes_treatment', treatment_selected);
					storage.setItem('diabetes_treatment_month', $treatment_end_month.val());
					storage.setItem('diabetes_treatment_year', $treatment_end_year.val());
					storage.setItem('diabetes_daily_insulin', daily_insulin);

				}
			});
		})(jQuery, window, document);
	})


function chkDiabetesDetailErrors(objectAffected, focusState, object, $form, last_focus) {
	var error_color = "#AC0036",
	    no_error_color = "#DEDEDE",

			$diagnosis_date = $form.find('#diagnosis-date'),
      $diabetes_type = $form.find('#diabetes-type'),
      $last_A1C_wrapper = $form.find('#last-A1C-wrapper'),
      $A1C_last_year_wrapper = $form.find('#A1C-last-year-wrapper'),
      $complications = $form.find('#complications'),
      $current_treatment = $form.find('#current-treatment'),
			$treatment_date = $form.find('#treatment-date'),
      $daily_insulin_wrapper = $form.find('#daily-insulin-wrapper'),

			$diagnosis_month = $form.find( 'input[id="diagnosis_month"]' ),
			$diagnosis_year = $form.find( 'input[id="diagnosis_year"]' ),
			type_selected = $("input[name='DiabetesType']:checked").val(),
			$last_a1c = document.getElementById("last_a1c").value,
			$a1c_last_year = document.getElementById("a1c_last_year").value,
			complications_selected = $("input[name='Complications']:checked").val(),
			treatment_selected = $("input[name='Treatment']:checked").val(),
			$treatment_end_month = $form.find( 'input[id="treatment_end_month"]' ),
			$treatment_end_year = $form.find( 'input[id="treatment_end_year"]' ),
			$daily_insulin = document.getElementById("daily_insulin").value;

//	console.log("objectAffected="+objectAffected+"\nfocusState="+focusState+"\nobject="+object.prop("class")+"\nlast_focus="+last_focus); // Use for debugging

	if (focusState == 'focusin') {
		$("."+objectAffected+"_error").hide(500);
    if (objectAffected == 'diagnosis_date') {
        $diagnosis_date.css("border-color", "black");
//        if (last_focus == "diagnosis_date") {chkDiabetesDetailErrors('diagnosis_date', 'focusout', object, $form, last_focus);}
        if (last_focus == "diabetes_type") {chkDiabetesDetailErrors('diabetes_type', 'focusout', object, $form, last_focus);}
        if (last_focus == "last_a1c") {chkDiabetesDetailErrors('last_a1c', 'focusout', object, $form, last_focus);}
        if (last_focus == "a1c_last_year") {chkDiabetesDetailErrors('a1c_last_year', 'focusout', object, $form, last_focus);}
        if (last_focus == "complications") {chkDiabetesDetailErrors('complications', 'focusout', object, $form, last_focus);}
        if (last_focus == "current_treatment") {chkDiabetesDetailErrors('current_treatment', 'focusout', object, $form, last_focus);}
        if (last_focus == "treatment_date") {chkDiabetesDetailErrors('treatment_date', 'focusout', object, $form, last_focus);}
        if (last_focus == "daily_insulin") {chkDiabetesDetailErrors('daily_insulin', 'focusout', object, $form, last_focus);}
    } else if (objectAffected == 'diabetes_type') {
        $diabetes_type.css("border-color", "black");
        if (last_focus == "diagnosis_date") {chkDiabetesDetailErrors('diagnosis_date', 'focusout', object, $form, last_focus);}
//        if (last_focus == "diabetes_type") {chkDiabetesDetailErrors('diabetes_type', 'focusout', object, $form, last_focus);}
        if (last_focus == "last_a1c") {chkDiabetesDetailErrors('last_a1c', 'focusout', object, $form, last_focus);}
        if (last_focus == "a1c_last_year") {chkDiabetesDetailErrors('a1c_last_year', 'focusout', object, $form, last_focus);}
        if (last_focus == "complications") {chkDiabetesDetailErrors('complications', 'focusout', object, $form, last_focus);}
        if (last_focus == "current_treatment") {chkDiabetesDetailErrors('current_treatment', 'focusout', object, $form, last_focus);}
        if (last_focus == "treatment_date") {chkDiabetesDetailErrors('treatment_date', 'focusout', object, $form, last_focus);}
        if (last_focus == "daily_insulin") {chkDiabetesDetailErrors('daily_insulin', 'focusout', object, $form, last_focus);}
    } else if (objectAffected == 'last_a1c') {
        $last_A1C_wrapper.css("border-color", "black");
        if (last_focus == "diagnosis_date") {chkDiabetesDetailErrors('diagnosis_date', 'focusout', object, $form, last_focus);}
        if (last_focus == "diabetes_type") {chkDiabetesDetailErrors('diabetes_type', 'focusout', object, $form, last_focus);}
//        if (last_focus == "last_a1c") {chkDiabetesDetailErrors('last_a1c', 'focusout', object, $form, last_focus);}
        if (last_focus == "a1c_last_year") {chkDiabetesDetailErrors('a1c_last_year', 'focusout', object, $form, last_focus);}
        if (last_focus == "complications") {chkDiabetesDetailErrors('complications', 'focusout', object, $form, last_focus);}
        if (last_focus == "current_treatment") {chkDiabetesDetailErrors('current_treatment', 'focusout', object, $form, last_focus);}
        if (last_focus == "treatment_date") {chkDiabetesDetailErrors('treatment_date', 'focusout', object, $form, last_focus);}
        if (last_focus == "daily_insulin") {chkDiabetesDetailErrors('daily_insulin', 'focusout', object, $form, last_focus);}
    } else if (objectAffected == 'a1c_last_year') {
        $A1C_last_year_wrapper.css("border-color", "black");
        if (last_focus == "diagnosis_date") {chkDiabetesDetailErrors('diagnosis_date', 'focusout', object, $form, last_focus);}
        if (last_focus == "diabetes_type") {chkDiabetesDetailErrors('diabetes_type', 'focusout', object, $form, last_focus);}
        if (last_focus == "last_a1c") {chkDiabetesDetailErrors('last_a1c', 'focusout', object, $form, last_focus);}
//        if (last_focus == "a1c_last_year") {chkDiabetesDetailErrors('a1c_last_year', 'focusout', object, $form, last_focus);}
        if (last_focus == "complications") {chkDiabetesDetailErrors('complications', 'focusout', object, $form, last_focus);}
        if (last_focus == "current_treatment") {chkDiabetesDetailErrors('current_treatment', 'focusout', object, $form, last_focus);}
        if (last_focus == "treatment_date") {chkDiabetesDetailErrors('treatment_date', 'focusout', object, $form, last_focus);}
        if (last_focus == "daily_insulin") {chkDiabetesDetailErrors('daily_insulin', 'focusout', object, $form, last_focus);}
    } else if (objectAffected == 'complications') {
        $complications.css("border-color", "black");
        if (last_focus == "diagnosis_date") {chkDiabetesDetailErrors('diagnosis_date', 'focusout', object, $form, last_focus);}
        if (last_focus == "diabetes_type") {chkDiabetesDetailErrors('diabetes_type', 'focusout', object, $form, last_focus);}
        if (last_focus == "last_a1c") {chkDiabetesDetailErrors('last_a1c', 'focusout', object, $form, last_focus);}
        if (last_focus == "a1c_last_year") {chkDiabetesDetailErrors('a1c_last_year', 'focusout', object, $form, last_focus);}
//        if (last_focus == "complications") {chkDiabetesDetailErrors('complications', 'focusout', object, $form, last_focus);}
        if (last_focus == "current_treatment") {chkDiabetesDetailErrors('current_treatment', 'focusout', object, $form, last_focus);}
        if (last_focus == "treatment_date") {chkDiabetesDetailErrors('treatment_date', 'focusout', object, $form, last_focus);}
        if (last_focus == "daily_insulin") {chkDiabetesDetailErrors('daily_insulin', 'focusout', object, $form, last_focus);}
    } else if (objectAffected == 'current_treatment') {
        $current_treatment.css("border-color", "black");
        if (last_focus == "diagnosis_date") {chkDiabetesDetailErrors('diagnosis_date', 'focusout', object, $form, last_focus);}
        if (last_focus == "diabetes_type") {chkDiabetesDetailErrors('diabetes_type', 'focusout', object, $form, last_focus);}
        if (last_focus == "last_a1c") {chkDiabetesDetailErrors('last_a1c', 'focusout', object, $form, last_focus);}
        if (last_focus == "a1c_last_year") {chkDiabetesDetailErrors('a1c_last_year', 'focusout', object, $form, last_focus);}
        if (last_focus == "complications") {chkDiabetesDetailErrors('complications', 'focusout', object, $form, last_focus);}
//        if (last_focus == "current_treatment") {chkDiabetesDetailErrors('current_treatment', 'focusout', object, $form, last_focus);}
        if (last_focus == "treatment_date") {chkDiabetesDetailErrors('treatment_date', 'focusout', object, $form, last_focus);}
        if (last_focus == "daily_insulin") {chkDiabetesDetailErrors('daily_insulin', 'focusout', object, $form, last_focus);}
    } else if (objectAffected == 'treatment_date') {
        $treatment_date.css("border-color", "black");
        if (last_focus == "diagnosis_date") {chkDiabetesDetailErrors('diagnosis_date', 'focusout', object, $form, last_focus);}
        if (last_focus == "diabetes_type") {chkDiabetesDetailErrors('diabetes_type', 'focusout', object, $form, last_focus);}
        if (last_focus == "last_a1c") {chkDiabetesDetailErrors('last_a1c', 'focusout', object, $form, last_focus);}
        if (last_focus == "a1c_last_year") {chkDiabetesDetailErrors('a1c_last_year', 'focusout', object, $form, last_focus);}
        if (last_focus == "complications") {chkDiabetesDetailErrors('complications', 'focusout', object, $form, last_focus);}
        if (last_focus == "current_treatment") {chkDiabetesDetailErrors('current_treatment', 'focusout', object, $form, last_focus);}
//        if (last_focus == "treatment_date") {chkDiabetesDetailErrors('treatment_date', 'focusout', object, $form, last_focus);}
        if (last_focus == "daily_insulin") {chkDiabetesDetailErrors('daily_insulin', 'focusout', object, $form, last_focus);}
    } else if (objectAffected == 'daily_insulin') {
        $daily_insulin_wrapper.css("border-color", "black");
        if (last_focus == "diagnosis_date") {chkDiabetesDetailErrors('diagnosis_date', 'focusout', object, $form, last_focus);}
        if (last_focus == "diabetes_type") {chkDiabetesDetailErrors('diabetes_type', 'focusout', object, $form, last_focus);}
        if (last_focus == "last_a1c") {chkDiabetesDetailErrors('last_a1c', 'focusout', object, $form, last_focus);}
        if (last_focus == "a1c_last_year") {chkDiabetesDetailErrors('a1c_last_year', 'focusout', object, $form, last_focus);}
        if (last_focus == "complications") {chkDiabetesDetailErrors('complications', 'focusout', object, $form, last_focus);}
        if (last_focus == "current_treatment") {chkDiabetesDetailErrors('current_treatment', 'focusout', object, $form, last_focus);}
        if (last_focus == "treatment_date") {chkDiabetesDetailErrors('treatment_date', 'focusout', object, $form, last_focus);}
//        if (last_focus == "daily_insulin") {chkDiabetesDetailErrors('daily_insulin', 'focusout', object, $form, last_focus);}
	  } else {
        object.css("border-color", "black");
    }
		return false;
	} else if (focusState == 'focusout') {
    if (objectAffected == 'diagnosis_date') {
				if ($diagnosis_month.val().length > 0 && $diagnosis_year.val().length == 4) {
					$("."+objectAffected+"_error").hide(500);
          $diagnosis_date.css("border-color", no_error_color);
					return false;
  		  } else {
					$("."+objectAffected+"_error").show(500);
          $(".page_error").hide(500);
          $diagnosis_date.css("border-color", error_color);
					return true;
				}
		}
    if (objectAffected == 'diabetes_type') {
	    	if (type_selected != undefined) {
					$("."+objectAffected+"_error").hide(500);
          $diabetes_type.css("border-color", no_error_color);
					return false;
  		  } else {
					$("."+objectAffected+"_error").show(500);
          $(".page_error").hide(500);
          $diabetes_type.css("border-color", error_color);
					return true;
				}
		}
    if (objectAffected == 'last_a1c') {
//     	if ($last_a1c.length > 0) {
//  			$("."+objectAffected+"_error").hide(500);
          $last_A1C_wrapper.css("border-color", no_error_color);
					return false;
// 		  } else {
//				$("."+objectAffected+"_error").show(500);
//        $(".page_error").hide(500);
//        $last_A1C_wrapper.css("border-color", error_color);
//				return true;
				}
		}
    if (objectAffected == 'a1c_last_year') {
//    	if ($a1c_last_year.length > 0) {
//				$("."+objectAffected+"_error").hide(500);
          $A1C_last_year_wrapper.css("border-color", no_error_color);
					return false;
// 		  } else {
//				$("."+objectAffected+"_error").show(500);
//        $(".page_error").hide(500);
//        $A1C_last_year_wrapper.css("border-color", error_color);
//				return true;
				}
		}
    if (objectAffected == 'complications') {
	    	if (complications_selected != undefined) {
					$("."+objectAffected+"_error").hide(500);
          $complications.css("border-color", no_error_color);
					return false;
  		  } else {
					$("."+objectAffected+"_error").show(500);
          $(".page_error").hide(500);
          $complications.css("border-color", error_color);
					return true;
				}
		}
    if (objectAffected == 'current_treatment') {
	    	if (treatment_selected != undefined) {
					$("."+objectAffected+"_error").hide(500);
          $current_treatment.css("border-color", no_error_color);
					return false;
  		  } else {
					$("."+objectAffected+"_error").show(500);
          $(".page_error").hide(500);
          $current_treatment.css("border-color", error_color);
					return true;
				}
		}
    if (objectAffected == 'treatment_date') {
				if ($treatment_end_month.val().length > 0 && $treatment_end_year.val().length == 4) {
					$("."+objectAffected+"_error").hide(500);
          $treatment_date.css("border-color", no_error_color);
					return false;
  		  } else {
					$("."+objectAffected+"_error").show(500);
          $(".page_error").hide(500);
          $treatment_date.css("border-color", error_color);
					return true;
				}
		}
    if (objectAffected == 'daily_insulin') {
	    	if ($daily_insulin.length > 0) {
					$("."+objectAffected+"_error").hide(500);
          $daily_insulin_wrapper.css("border-color", no_error_color);
					return false;
  		  } else {
					$("."+objectAffected+"_error").show(500);
          $(".page_error").hide(500);
          $daily_insulin_wrapper.css("border-color", error_color);
					return true;
				}
		}
	}
}
