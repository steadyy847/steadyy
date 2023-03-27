/*
Webflow.push(function(){
	$("#quote").submit(function(){
		var storage = window.localStorage,
				currentPage = 8, // PAGE: sleep_apnea = 8
				nextPage;
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
     			className = 'button_active',
          storage = window.localStorage;

			$(form).each(function() {
				var $form = $(this),
	     			$sleep_apnea_more_next = $form.find( '#sleep-apnea-more-step' ),
						currentPage = 8, // PAGE: sleep_apnea = 8
      			nextPage,
      			last_focus,
						enabled = true,
            submit_errors = true,

      			$diagnosis_date = $form.find('#diagnosis-date'),
            $diagnosis_severity = $form.find('#diagnosis-severity'),
            $treatment = $form.find('#treatment'),
      			$treatment_date = $form.find('#treatment-date'),
            $cpap = $form.find('#cpap'),
            $sleep_study = $form.find('#sleep-study'),
            $oxygen_saturation_wrapper = $form.find('#oxygen-saturation-wrapper'),
            $ahi_wrapper = $form.find('#ahi-wrapper'),
            $apnea_index_wrapper = $form.find('#apnea-index-wrapper'),
            $rdi_wrapper = $form.find('#rdi-wrapper'),

						$diagnosis_month = $form.find( 'input[id="diagnosis_month"]' ),
						$diagnosis_year = $form.find( 'input[id="diagnosis_year"]' ),
						$treatment_month = $form.find( 'input[id="treatment_month"]' ),
						$treatment_year = $form.find( 'input[id="treatment_year"]' ),

						$oxygen_saturation = $form.find( 'input[id="oxygen_saturation"]' ),
						$ahi = $form.find( 'input[id="ahi"]' ),
						$apnea_index = $form.find( 'input[id="apnea_index"]' ),
						$rdi = $form.find( 'input[id="rdi"]' ),
            
            diagnosis_date_errors = false,
            diagnosis_severity_errors = false,
            treatment_errors = false,
            treatment_date_errors = false,
            cpap_errors = false,
            sleep_study_errors = false,
            oxygen_saturation_errors = false,
            ahi_errors = false,
            apnea_index_errors = false,
            rdi_errors = false;


				$('#commit_point').val("10-sleep-apnea");
				$('#quote_initiated_datetime').val(storage.getItem('quote_initiated_datetime'));
				$('#quote_initiated_from_ip_address').val(storage.getItem('quote_initiated_from_ip_address'));
				$('#quote_initiated_from_city').val(storage.getItem('quote_initiated_from_city'));

  			document.getElementById("sleep-apnea-more-step").disabled = true;

/* STEP 1 - Set up masks for all number entry fields */
				$diagnosis_month.mask("#0");
				$diagnosis_year.mask("0000");
				$treatment_month.mask("#0");
				$treatment_year.mask("0000");

/* STEP 2 - Grab the current values in localStorage so they can be set on each page, in the event that a user 
            left this page and comes back later, so they don't lose data that they may have already entered */
  			var storage_diag_month = storage.getItem('sleep_apnea_diag_month'),
  					storage_diag_year = storage.getItem('sleep_apnea_diag_year'),
  					storage_diagnosis = storage.getItem('sleep_apnea_diagnosis'),
  					storage_treatment = storage.getItem('sleep_apnea_treatment'),
  					storage_treatment_month = storage.getItem('sleep_apnea_treatment_month'),
  					storage_treatment_year= storage.getItem('sleep_apnea_treatment_year'),
  					storage_cpap = storage.getItem('sleep_apnea_cpap'),
  					storage_sleep_study = storage.getItem('sleep_apnea_sleep_study'),
  					storage_oxygen_saturation = storage.getItem('sleep_apnea_oxygen_saturation'),
  					storage_ahi = storage.getItem('sleep_apnea_apnea_hypopnea_index'),
  					storage_apnea_index = storage.getItem('sleep_apnea_apnea_index'),
  					storage_rdi = storage.getItem('sleep_apnea_respiratory_disturbance_index');

/* STEP 3 - Evaluate whether there was data in localStorage for the page, and re-initialize it with that data, if there was */
  			if (storage_diag_month !== null) {
  				$diagnosis_month.val(storage_diag_month);
  			}

  			if (storage_diag_year !== null) {
  				$diagnosis_year.val(storage_diag_year);
  			}

  			if (storage_diagnosis !== null) {
  				$("input[name='Diagnosis'][value='" + storage_diagnosis + "']").prop("checked", true);
  			}

  			if (storage_treatment !== null) {
  				$("input[name='Treatment'][value='" + storage_treatment + "']").prop("checked", true);
  				$("input[name='Treatment'][value='" + storage_treatment + "']").prev('.w-radio-input').addClass('w--redirected-checked');
  				$("#treatment_" + storage_treatment.toLowerCase()).parent().css( "backgroundColor", "#48bd9d" );
  				$("#treatment_" + storage_treatment.toLowerCase()).parent().css( "border", "#48bd9e" );
  				$("#treatment_" + storage_treatment.toLowerCase()).parent().css( "color", "#ffffff" );
  			}

  			if (storage_treatment_month !== null) {
  				$treatment_month.val(storage_treatment_month);
  			}

  			if (storage_treatment_year !== null) {
  				$treatment_year.val(storage_treatment_year);
  			}

  			if (storage_cpap !== null) {
  				$("input[name='CPAP'][value='" + storage_cpap + "']").prop("checked", true);
  				$("input[name='CPAP'][value='" + storage_cpap + "']").prev('.w-radio-input').addClass('w--redirected-checked');
  				$("#cpap_" + storage_cpap.toLowerCase()).parent().css( "backgroundColor", "#48bd9d" );
  				$("#cpap_" + storage_cpap.toLowerCase()).parent().css( "border", "#48bd9e" );
  				$("#cpap_" + storage_cpap.toLowerCase()).parent().css( "color", "#ffffff" );
  			}

  			if (storage_sleep_study !== null) {
  				$("input[name='SleepStudy'][value='" + storage_sleep_study + "']").prop("checked", true);
  				$("input[name='SleepStudy'][value='" + storage_sleep_study + "']").prev('.w-radio-input').addClass('w--redirected-checked');
  				$("#sleep_study_" + storage_sleep_study.toLowerCase()).parent().css( "backgroundColor", "#48bd9d" );
  				$("#sleep_study_" + storage_sleep_study.toLowerCase()).parent().css( "border", "#48bd9e" );
  				$("#sleep_study_" + storage_sleep_study.toLowerCase()).parent().css( "color", "#ffffff" );
  			}

  			if (storage_oxygen_saturation !== null) {
          document.getElementById("oxygen_saturation").value = storage_oxygen_saturation;
  			}

  			if (storage_ahi !== null) {
          document.getElementById("ahi").value = storage_ahi;
  			}

  			if (storage_apnea_index !== null) {
          document.getElementById("apnea_index").value = storage_apnea_index;
  			}

  			if (storage_rdi !== null) {
          document.getElementById("rdi").value = storage_rdi;
  			}

  			submitButtonCheck();

/* STEP 4 - Set up listeners on each field for input events & validate all date entry fields */
  			$diagnosis_month.on('input.True', function() {
  				this.value = monthValuesCheck(this.value);});
  			$diagnosis_year.on('input.True', function() {
  				this.value = yearValuesCheck(this.value);});

  			$treatment_month.on('input.True', function() {
  				this.value = monthValuesCheck(this.value);});
  			$treatment_year.on('input.True', function() {
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

				$('#oxygen_saturation').on('input.True', function() {
				  if (this.value.length == 3) {
						if (this.value > 100) {
							this.value = this.value.slice(0, 2);
							console.log("this.value was > 100, so trimmed it to "+this.value);
						}
					}
				});

				$('#ahi').on('input.True', function() {
				  if (this.value.length == 3) {
						if (this.value > 100) {
							this.value = this.value.slice(0, 2);
							console.log("this.value was > 100, so trimmed it to "+this.value);
						}
					}
				});

				$('#apnea_index').on('input.True', function() {
				  if (this.value.length == 3) {
						if (this.value > 100) {
							this.value = this.value.slice(0, 2);
							console.log("this.value was > 100, so trimmed it to "+this.value);
						}
					}
				});

				$('#rdi').on('input.True', function() {
				  if (this.value.length == 3) {
						if (this.value > 100) {
							this.value = this.value.slice(0, 2);
							console.log("this.value was > 100, so trimmed it to "+this.value);
						}
					}
				});

  			$diagnosis_date.on('focusin', function() {
  					diagnosis_date_errors = chkApneaDetailErrors('diagnosis_date', 'focusin', $diagnosis_date, $form, last_focus);
  					last_focus = "diagnosis_date";
  			});

  			$diagnosis_severity.on('focusin', function() {
  					diagnosis_severity_errors = chkApneaDetailErrors('diagnosis_severity', 'focusin', $diagnosis_severity, $form, last_focus);
  					last_focus = "diagnosis_severity";
  			});

  			$treatment.on('focusin', function() {
  					treatment_errors = chkApneaDetailErrors('treatment', 'focusin', $treatment, $form, last_focus);
  					last_focus = "treatment";
  			});

  			$treatment_date.on('focusin', function() {
  					treatment_date_errors = chkApneaDetailErrors('treatment_date', 'focusin', $treatment_date, $form, last_focus);
  					last_focus = "treatment_date";
  			});

  			$cpap.on('focusin', function() {
  					cpap_errors = chkApneaDetailErrors('cpap', 'focusin', $cpap, $form, last_focus);
  					last_focus = "cpap";
  			});

  			$sleep_study.on('focusin', function() {
  					sleep_study_errors = chkApneaDetailErrors('sleep_study', 'focusin', $sleep_study, $form, last_focus);
  					last_focus = "sleep_study";
  			});

  			$oxygen_saturation_wrapper.on('focusin', function() {
  					oxygen_saturation_errors = chkApneaDetailErrors('oxygen_saturation', 'focusin', $oxygen_saturation_wrapper, $form, last_focus);
  					last_focus = "oxygen_saturation";
  			});

  			$ahi_wrapper.on('focusin', function() {
  					ahi_errors = chkApneaDetailErrors('ahi', 'focusin', $ahi_wrapper, $form, last_focus);
  					last_focus = "ahi";
  			});

  			$apnea_index_wrapper.on('focusin', function() {
  					apnea_index_errors = chkApneaDetailErrors('apnea_index', 'focusin', $apnea_index_wrapper, $form, last_focus);
  					last_focus = "apnea_index";
  			});

  			$rdi_wrapper.on('focusin', function() {
  					rdi_errors = chkApneaDetailErrors('rdi', 'focusin', $rdi_wrapper, $form, last_focus);
  					last_focus = "rdi";
  			});

  			$sleep_study.on('focusout', function() {
  					sleep_study_errors = chkApneaDetailErrors('sleep_study', 'focusout', $sleep_study, $form, last_focus);
  					last_focus = "sleep_study";
  			});

  			$rdi_wrapper.on('focusout', function() {
  					rdi_errors = chkApneaDetailErrors('rdi', 'focusout', $rdi_wrapper, $form, last_focus);
  					last_focus = "rdi";
  			});

  			$('#sleep-apnea-more-step').click(function(e) {
  				e.preventDefault();
          submitButtonCheck();

  				nextPage = getRedirectURL(currentPage);

          if (submit_errors) {
        		document.getElementById("sleep-apnea-more-step").disabled = true;
            if (!diagnosis_date_errors && !diagnosis_severity_errors && !treatment_errors && !treatment_date_errors && !cpap_errors && !sleep_study_errors) {
   					  $(".page_error").show(500);
            } else {
   					  $(".page_error").hide(500);
            }
  				} else {
        		document.getElementById("sleep-apnea-more-step").disabled = false;
  				  $(".page_error").hide(500);
  					location.href = nextPage;
          }
  			});
        
  			$('#sleep-apnea-more-prev').click(function(e) {
  				e.preventDefault();
  				window.history.back();
  			});

        function submitButtonCheck() {
					var diagnosis_selected = $("input[name='Diagnosis']:checked").val(),
							treatment_selected = $("input[name='Treatment']:checked").val(),
							cpap_selected = $("input[name='CPAP']:checked").val(),
							sleep_study_selected = $("input[name='SleepStudy']:checked").val(),
							oxygen_saturation_value = document.getElementById("oxygen_saturation").value,
							ahi_value = document.getElementById("ahi").value,
							apnea_index_value = document.getElementById("apnea_index").value,
							rdi_value = document.getElementById("rdi").value,
							conditionals_for_treatment_satisfied = false;

					if (treatment_selected == "Yes") {
							$(".conditional_treatment").show(500);
							if (cpap_selected != undefined
							 && $treatment_month.val() != '' && /^([\w-]{1,2})?$/.test( $treatment_month.val() ) 
							 && $treatment_year.val() != '' && /^([\w-]{4,4})?$/.test( $treatment_year.val() )
							) {
									conditionals_for_treatment_satisfied = true;
							} else {
									conditionals_for_treatment_satisfied = false;
							}
					} else if (treatment_selected == "No") {
							$treatment_month.val(null);
							$treatment_year.val(null);
							$("input[name='CPAP']").prop('checked',false);
        			$("input[name='CPAP']").prev('.w-radio-input').removeClass('w--redirected-checked');
							$(".yes_no_button_2").css( "backgroundColor", "transparent" );
							$(".yes_no_button_2").css( "border", "2px solid #d9d9d9" );
							$(".yes_no_button_2").css( "color", "#707070" );
							$(".conditional_treatment").hide(500);
							cpap_selected = "No";
							conditionals_for_treatment_satisfied = true;
					}

					if (sleep_study_selected == "Yes") {
							$(".conditional_sleep_study").show(500);
					} else if (sleep_study_selected == "No") {
							$(".conditional_sleep_study").hide(500);
							$oxygen_saturation.val(null);
							$ahi.val(null);
							$apnea_index.val(null);
							$rdi.val(null);
					}

					if ($diagnosis_month.val() != '' && /^([\w-]{1,2})?$/.test( $diagnosis_month.val() ) 
					 && $diagnosis_year.val() != '' && /^([\w-]{4,4})?$/.test( $diagnosis_year.val() ) 
					 && diagnosis_selected != undefined
					 && treatment_selected != undefined
					 && conditionals_for_treatment_satisfied
					 && sleep_study_selected != undefined
					) {
           		document.getElementById("sleep-apnea-more-step").disabled = false;
        			$sleep_apnea_more_next.toggleClass(className, true);
        			submit_errors = false;
   					  $(".page_error").hide(500);

					} else {
           		document.getElementById("sleep-apnea-more-step").disabled = true;
        			$sleep_apnea_more_next.toggleClass(className, false);
        			submit_errors = true;
          }

					storage.setItem('sleep_apnea_diag_month', $diagnosis_month.val());
					storage.setItem('sleep_apnea_diag_year', $diagnosis_year.val());
					storage.setItem('sleep_apnea_diagnosis', diagnosis_selected);
					storage.setItem('sleep_apnea_treatment', treatment_selected);
					storage.setItem('sleep_apnea_treatment_month', $treatment_month.val());
					storage.setItem('sleep_apnea_treatment_year', $treatment_year.val());
					storage.setItem('sleep_apnea_cpap', cpap_selected);
					storage.setItem('sleep_apnea_sleep_study', sleep_study_selected);
					storage.setItem('sleep_apnea_oxygen_saturation', oxygen_saturation_value);
					storage.setItem('sleep_apnea_apnea_hypopnea_index', ahi_value);
					storage.setItem('sleep_apnea_apnea_index', apnea_index_value);
					storage.setItem('sleep_apnea_respiratory_disturbance_index', rdi_value);

        }
			});
		})(jQuery, window, document);
	})


function chkApneaDetailErrors(objectAffected, focusState, object, $form, last_focus) {
	var error_color = "#AC0036",
	    no_error_color = "#DEDEDE",

			$diagnosis_date = $form.find('#diagnosis-date'),
      $diagnosis_severity = $form.find('#diagnosis-severity'),
      $treatment = $form.find('#treatment'),
			$treatment_date = $form.find('#treatment-date'),
      $cpap = $form.find('#cpap'),
      $sleep_study = $form.find('#sleep-study'),
      $oxygen_saturation_wrapper = $form.find('#oxygen-saturation-wrapper'),
      $ahi_wrapper = $form.find('#ahi-wrapper'),
      $apnea_index_wrapper = $form.find('#apnea-index-wrapper'),
      $rdi_wrapper = $form.find('#rdi-wrapper'),

			$diagnosis_month = $form.find( 'input[id="diagnosis_month"]' ),
			$diagnosis_year = $form.find( 'input[id="diagnosis_year"]' ),
			diagnosis_severity_selected = $("input[name='Diagnosis']:checked").val(),
			treatment_selected = $("input[name='Treatment']:checked").val(),
			$treatment_month = $form.find( 'input[id="treatment_month"]' ),
			$treatment_year = $form.find( 'input[id="treatment_year"]' ),
			cpap_selected = $("input[name='CPAP']:checked").val(),
			sleep_study_selected = $("input[name='SleepStudy']:checked").val(),
			$oxygen_saturation = $form.find( 'input[id="oxygen_saturation"]' ),
			$ahi = $form.find( 'input[id="ahi"]' ),
			$apnea_index = $form.find( 'input[id="apnea_index"]' ),
			$rdi = $form.find( 'input[id="rdi"]' );

//	console.log("objectAffected="+objectAffected+"\nfocusState="+focusState+"\nobject="+object.prop("class")+"\nlast_focus="+last_focus); // Use for debugging

	if (focusState == 'focusin') {
		$("."+objectAffected+"_error").hide(500);
    if (objectAffected == 'diagnosis_date') {
        $diagnosis_date.css("border-color", "black");
//        if (last_focus == "diagnosis_date") {chkApneaDetailErrors('diagnosis_date', 'focusout', object, $form, last_focus);}
        if (last_focus == "diagnosis_severity") {chkApneaDetailErrors('diagnosis_severity', 'focusout', object, $form, last_focus);}
        if (last_focus == "treatment") {chkApneaDetailErrors('treatment', 'focusout', object, $form, last_focus);}
        if (last_focus == "treatment_date") {chkApneaDetailErrors('treatment_date', 'focusout', object, $form, last_focus);}
        if (last_focus == "cpap") {chkApneaDetailErrors('cpap', 'focusout', object, $form, last_focus);}
        if (last_focus == "sleep_study") {chkApneaDetailErrors('sleep_study', 'focusout', object, $form, last_focus);}
        if (last_focus == "oxygen_saturation") {chkApneaDetailErrors('oxygen_saturation', 'focusout', object, $form, last_focus);}
        if (last_focus == "ahi") {chkApneaDetailErrors('ahi', 'focusout', object, $form, last_focus);}
        if (last_focus == "apnea_index") {chkApneaDetailErrors('apnea_index', 'focusout', object, $form, last_focus);}
        if (last_focus == "rdi") {chkApneaDetailErrors('rdi', 'focusout', object, $form, last_focus);}
    } else if (objectAffected == 'diagnosis_severity') {
        $diagnosis_severity.css("border-color", "black");
        if (last_focus == "diagnosis_date") {chkApneaDetailErrors('diagnosis_date', 'focusout', object, $form, last_focus);}
//        if (last_focus == "diagnosis_severity") {chkApneaDetailErrors('diagnosis_severity', 'focusout', object, $form, last_focus);}
        if (last_focus == "treatment") {chkApneaDetailErrors('treatment', 'focusout', object, $form, last_focus);}
        if (last_focus == "treatment_date") {chkApneaDetailErrors('treatment_date', 'focusout', object, $form, last_focus);}
        if (last_focus == "cpap") {chkApneaDetailErrors('cpap', 'focusout', object, $form, last_focus);}
        if (last_focus == "sleep_study") {chkApneaDetailErrors('sleep_study', 'focusout', object, $form, last_focus);}
        if (last_focus == "oxygen_saturation") {chkApneaDetailErrors('oxygen_saturation', 'focusout', object, $form, last_focus);}
        if (last_focus == "ahi") {chkApneaDetailErrors('ahi', 'focusout', object, $form, last_focus);}
        if (last_focus == "apnea_index") {chkApneaDetailErrors('apnea_index', 'focusout', object, $form, last_focus);}
        if (last_focus == "rdi") {chkApneaDetailErrors('rdi', 'focusout', object, $form, last_focus);}
    } else if (objectAffected == 'treatment') {
        $treatment.css("border-color", "black");
        if (last_focus == "diagnosis_date") {chkApneaDetailErrors('diagnosis_date', 'focusout', object, $form, last_focus);}
        if (last_focus == "diagnosis_severity") {chkApneaDetailErrors('diagnosis_severity', 'focusout', object, $form, last_focus);}
//        if (last_focus == "treatment") {chkApneaDetailErrors('treatment', 'focusout', object, $form, last_focus);}
        if (last_focus == "treatment_date") {chkApneaDetailErrors('treatment_date', 'focusout', object, $form, last_focus);}
        if (last_focus == "cpap") {chkApneaDetailErrors('cpap', 'focusout', object, $form, last_focus);}
        if (last_focus == "sleep_study") {chkApneaDetailErrors('sleep_study', 'focusout', object, $form, last_focus);}
        if (last_focus == "oxygen_saturation") {chkApneaDetailErrors('oxygen_saturation', 'focusout', object, $form, last_focus);}
        if (last_focus == "ahi") {chkApneaDetailErrors('ahi', 'focusout', object, $form, last_focus);}
        if (last_focus == "apnea_index") {chkApneaDetailErrors('apnea_index', 'focusout', object, $form, last_focus);}
        if (last_focus == "rdi") {chkApneaDetailErrors('rdi', 'focusout', object, $form, last_focus);}
    } else if (objectAffected == 'treatment_date') {
        $treatment_date.css("border-color", "black");
        if (last_focus == "diagnosis_date") {chkApneaDetailErrors('diagnosis_date', 'focusout', object, $form, last_focus);}
        if (last_focus == "diagnosis_severity") {chkApneaDetailErrors('diagnosis_severity', 'focusout', object, $form, last_focus);}
        if (last_focus == "treatment") {chkApneaDetailErrors('treatment', 'focusout', object, $form, last_focus);}
//        if (last_focus == "treatment_date") {chkApneaDetailErrors('treatment_date', 'focusout', object, $form, last_focus);}
        if (last_focus == "cpap") {chkApneaDetailErrors('cpap', 'focusout', object, $form, last_focus);}
        if (last_focus == "sleep_study") {chkApneaDetailErrors('sleep_study', 'focusout', object, $form, last_focus);}
        if (last_focus == "oxygen_saturation") {chkApneaDetailErrors('oxygen_saturation', 'focusout', object, $form, last_focus);}
        if (last_focus == "ahi") {chkApneaDetailErrors('ahi', 'focusout', object, $form, last_focus);}
        if (last_focus == "apnea_index") {chkApneaDetailErrors('apnea_index', 'focusout', object, $form, last_focus);}
        if (last_focus == "rdi") {chkApneaDetailErrors('rdi', 'focusout', object, $form, last_focus);}
    } else if (objectAffected == 'cpap') {
        $cpap.css("border-color", "black");
        if (last_focus == "diagnosis_date") {chkApneaDetailErrors('diagnosis_date', 'focusout', object, $form, last_focus);}
        if (last_focus == "diagnosis_severity") {chkApneaDetailErrors('diagnosis_severity', 'focusout', object, $form, last_focus);}
        if (last_focus == "treatment") {chkApneaDetailErrors('treatment', 'focusout', object, $form, last_focus);}
        if (last_focus == "treatment_date") {chkApneaDetailErrors('treatment_date', 'focusout', object, $form, last_focus);}
//        if (last_focus == "cpap") {chkApneaDetailErrors('cpap', 'focusout', object, $form, last_focus);}
        if (last_focus == "sleep_study") {chkApneaDetailErrors('sleep_study', 'focusout', object, $form, last_focus);}
        if (last_focus == "oxygen_saturation") {chkApneaDetailErrors('oxygen_saturation', 'focusout', object, $form, last_focus);}
        if (last_focus == "ahi") {chkApneaDetailErrors('ahi', 'focusout', object, $form, last_focus);}
        if (last_focus == "apnea_index") {chkApneaDetailErrors('apnea_index', 'focusout', object, $form, last_focus);}
        if (last_focus == "rdi") {chkApneaDetailErrors('rdi', 'focusout', object, $form, last_focus);}
    } else if (objectAffected == 'sleep_study') {
        $sleep_study.css("border-color", "black");
        if (last_focus == "diagnosis_date") {chkApneaDetailErrors('diagnosis_date', 'focusout', object, $form, last_focus);}
        if (last_focus == "diagnosis_severity") {chkApneaDetailErrors('diagnosis_severity', 'focusout', object, $form, last_focus);}
        if (last_focus == "treatment") {chkApneaDetailErrors('treatment', 'focusout', object, $form, last_focus);}
        if (last_focus == "treatment_date") {chkApneaDetailErrors('treatment_date', 'focusout', object, $form, last_focus);}
        if (last_focus == "cpap") {chkApneaDetailErrors('cpap', 'focusout', object, $form, last_focus);}
//        if (last_focus == "sleep_study") {chkApneaDetailErrors('sleep_study', 'focusout', object, $form, last_focus);}
        if (last_focus == "oxygen_saturation") {chkApneaDetailErrors('oxygen_saturation', 'focusout', object, $form, last_focus);}
        if (last_focus == "ahi") {chkApneaDetailErrors('ahi', 'focusout', object, $form, last_focus);}
        if (last_focus == "apnea_index") {chkApneaDetailErrors('apnea_index', 'focusout', object, $form, last_focus);}
        if (last_focus == "rdi") {chkApneaDetailErrors('rdi', 'focusout', object, $form, last_focus);}
    } else if (objectAffected == 'oxygen_saturation') {
        $oxygen_saturation_wrapper.css("border-color", "black");
        if (last_focus == "diagnosis_date") {chkApneaDetailErrors('diagnosis_date', 'focusout', object, $form, last_focus);}
        if (last_focus == "diagnosis_severity") {chkApneaDetailErrors('diagnosis_severity', 'focusout', object, $form, last_focus);}
        if (last_focus == "treatment") {chkApneaDetailErrors('treatment', 'focusout', object, $form, last_focus);}
        if (last_focus == "treatment_date") {chkApneaDetailErrors('treatment_date', 'focusout', object, $form, last_focus);}
        if (last_focus == "cpap") {chkApneaDetailErrors('cpap', 'focusout', object, $form, last_focus);}
        if (last_focus == "sleep_study") {chkApneaDetailErrors('sleep_study', 'focusout', object, $form, last_focus);}
//        if (last_focus == "oxygen_saturation") {chkApneaDetailErrors('oxygen_saturation', 'focusout', object, $form, last_focus);}
        if (last_focus == "ahi") {chkApneaDetailErrors('ahi', 'focusout', object, $form, last_focus);}
        if (last_focus == "apnea_index") {chkApneaDetailErrors('apnea_index', 'focusout', object, $form, last_focus);}
        if (last_focus == "rdi") {chkApneaDetailErrors('rdi', 'focusout', object, $form, last_focus);}
    } else if (objectAffected == 'ahi') {
        $ahi_wrapper.css("border-color", "black");
        if (last_focus == "diagnosis_date") {chkApneaDetailErrors('diagnosis_date', 'focusout', object, $form, last_focus);}
        if (last_focus == "diagnosis_severity") {chkApneaDetailErrors('diagnosis_severity', 'focusout', object, $form, last_focus);}
        if (last_focus == "treatment") {chkApneaDetailErrors('treatment', 'focusout', object, $form, last_focus);}
        if (last_focus == "treatment_date") {chkApneaDetailErrors('treatment_date', 'focusout', object, $form, last_focus);}
        if (last_focus == "cpap") {chkApneaDetailErrors('cpap', 'focusout', object, $form, last_focus);}
        if (last_focus == "sleep_study") {chkApneaDetailErrors('sleep_study', 'focusout', object, $form, last_focus);}
        if (last_focus == "oxygen_saturation") {chkApneaDetailErrors('oxygen_saturation', 'focusout', object, $form, last_focus);}
//        if (last_focus == "ahi") {chkApneaDetailErrors('ahi', 'focusout', object, $form, last_focus);}
        if (last_focus == "apnea_index") {chkApneaDetailErrors('apnea_index', 'focusout', object, $form, last_focus);}
        if (last_focus == "rdi") {chkApneaDetailErrors('rdi', 'focusout', object, $form, last_focus);}
    } else if (objectAffected == 'apnea_index') {
        $apnea_index_wrapper.css("border-color", "black");
        if (last_focus == "diagnosis_date") {chkApneaDetailErrors('diagnosis_date', 'focusout', object, $form, last_focus);}
        if (last_focus == "diagnosis_severity") {chkApneaDetailErrors('diagnosis_severity', 'focusout', object, $form, last_focus);}
        if (last_focus == "treatment") {chkApneaDetailErrors('treatment', 'focusout', object, $form, last_focus);}
        if (last_focus == "treatment_date") {chkApneaDetailErrors('treatment_date', 'focusout', object, $form, last_focus);}
        if (last_focus == "cpap") {chkApneaDetailErrors('cpap', 'focusout', object, $form, last_focus);}
        if (last_focus == "sleep_study") {chkApneaDetailErrors('sleep_study', 'focusout', object, $form, last_focus);}
        if (last_focus == "oxygen_saturation") {chkApneaDetailErrors('oxygen_saturation', 'focusout', object, $form, last_focus);}
        if (last_focus == "ahi") {chkApneaDetailErrors('ahi', 'focusout', object, $form, last_focus);}
//        if (last_focus == "apnea_index") {chkApneaDetailErrors('apnea_index', 'focusout', object, $form, last_focus);}
        if (last_focus == "rdi") {chkApneaDetailErrors('rdi', 'focusout', object, $form, last_focus);}
    } else if (objectAffected == 'rdi') {
        $rdi_wrapper.css("border-color", "black");
        if (last_focus == "diagnosis_date") {chkApneaDetailErrors('diagnosis_date', 'focusout', object, $form, last_focus);}
        if (last_focus == "diagnosis_severity") {chkApneaDetailErrors('diagnosis_severity', 'focusout', object, $form, last_focus);}
        if (last_focus == "treatment") {chkApneaDetailErrors('treatment', 'focusout', object, $form, last_focus);}
        if (last_focus == "treatment_date") {chkApneaDetailErrors('treatment_date', 'focusout', object, $form, last_focus);}
        if (last_focus == "cpap") {chkApneaDetailErrors('cpap', 'focusout', object, $form, last_focus);}
        if (last_focus == "sleep_study") {chkApneaDetailErrors('sleep_study', 'focusout', object, $form, last_focus);}
        if (last_focus == "oxygen_saturation") {chkApneaDetailErrors('oxygen_saturation', 'focusout', object, $form, last_focus);}
        if (last_focus == "ahi") {chkApneaDetailErrors('ahi', 'focusout', object, $form, last_focus);}
        if (last_focus == "apnea_index") {chkApneaDetailErrors('apnea_index', 'focusout', object, $form, last_focus);}
//        if (last_focus == "rdi") {chkApneaDetailErrors('rdi', 'focusout', object, $form, last_focus);}
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
    if (objectAffected == 'diagnosis_severity') {
	    	if (diagnosis_severity_selected != undefined) {
					$("."+objectAffected+"_error").hide(500);
          $diagnosis_severity.css("border-color", no_error_color);
					return false;
  		  } else {
					$("."+objectAffected+"_error").show(500);
          $(".page_error").hide(500);
          $diagnosis_severity.css("border-color", error_color);
					return true;
				}
		}
    if (objectAffected == 'treatment') {
	    	if (treatment_selected != undefined) {
					$("."+objectAffected+"_error").hide(500);
          $treatment.css("border-color", no_error_color);
					return false;
  		  } else {
					$("."+objectAffected+"_error").show(500);
          $(".page_error").hide(500);
          $treatment.css("border-color", error_color);
					return true;
				}
		}
    if (objectAffected == 'treatment_date') {
				if ($treatment_month.val().length > 0 && $treatment_year.val().length == 4) {
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
    if (objectAffected == 'cpap') {
	    	if (cpap_selected != undefined) {
					$("."+objectAffected+"_error").hide(500);
          $cpap.css("border-color", no_error_color);
					return false;
  		  } else {
					$("."+objectAffected+"_error").show(500);
          $(".page_error").hide(500);
          $cpap.css("border-color", error_color);
					return true;
				}
		}
    if (objectAffected == 'sleep_study') {
	    	if (sleep_study_selected != undefined) {
					$("."+objectAffected+"_error").hide(500);
          $sleep_study.css("border-color", no_error_color);
					return false;
  		  } else {
					$("."+objectAffected+"_error").show(500);
          $(".page_error").hide(500);
          $sleep_study.css("border-color", error_color);
					return true;
				}
		}
    if (objectAffected == 'oxygen_saturation') { // this section is not required so don't throw up an error message if nothing is input
//	    	if () {
          $oxygen_saturation_wrapper.css("border-color", no_error_color);
					return false;
//  		  } else {
//					$("."+objectAffected+"_error").show(500);
//          $(".page_error").hide(500);
//          $oxygen_saturation_wrapper.css("border-color", error_color);
//					return true;
//				}
		}
    if (objectAffected == 'ahi') { // this section is not required so don't throw up an error message if nothing is input
//	    	if () {
          $ahi_wrapper.css("border-color", no_error_color);
					return false;
//  		  } else {
//					$("."+objectAffected+"_error").show(500);
//          $(".page_error").hide(500);
//          $ahi_wrapper.css("border-color", error_color);
//					return true;
//				}
		}
    if (objectAffected == 'apnea_index') { // this section is not required so don't throw up an error message if nothing is input
//	    	if () {
          $apnea_index_wrapper.css("border-color", no_error_color);
					return false;
//  		  } else {
//					$("."+objectAffected+"_error").show(500);
//          $(".page_error").hide(500);
//          $apnea_index_wrapper.css("border-color", error_color);
//					return true;
//				}
		}
    if (objectAffected == 'rdi') { // this section is not required so don't throw up an error message if nothing is input
//	    	if () {
          $rdi_wrapper.css("border-color", no_error_color);
					return false;
//  		  } else {
//					$("."+objectAffected+"_error").show(500);
//          $(".page_error").hide(500);
//          $rdi_wrapper.css("border-color", error_color);
//					return true;
//				}
		}
	}
}
