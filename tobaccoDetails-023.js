/*
Webflow.push(function(){
	$("#quote").submit(function(){
		var storage = window.localStorage,
				currentPage = 2, // PAGE: tobacco = 2
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
			$tobacco_more_next = $form.find( '#tobacco-more-step' ),
			currentPage = 2, // PAGE: tobacco = 2
			nextPage,
			last_focus,
			enabled = true,
			submit_errors = true,

			$cigarette_last_smoke_month = $form.find( 'input[id="cigarette_last_smoke_month"]' ),
			$cigarette_last_smoke_year = $form.find( 'input[id="cigarette_last_smoke_year"]' ),
			$cigarettes_per_day = $form.find( 'input[id="cigarettes_per_day"]' ),
			$cigar_last_smoke_month = $form.find( 'input[id="cigar_last_smoke_month"]' ),
			$cigar_last_smoke_year = $form.find( 'input[id="cigar_last_smoke_year"]' ),
			$cigars_per_month = $form.find( 'input[id="cigars_per_month"]' ),
			$pipe_last_smoke_month = $form.find( 'input[id="pipe_last_smoke_month"]' ),
			$pipe_last_smoke_year = $form.find( 'input[id="pipe_last_smoke_year"]' ),
			$chew_last_use_month = $form.find( 'input[id="chew_last_use_month"]' ),
			$chew_last_use_year = $form.find( 'input[id="chew_last_use_year"]' ),
			$patch_last_use_month = $form.find( 'input[id="patch_last_use_month"]' ),
			$patch_last_use_year = $form.find( 'input[id="patch_last_use_year"]' ),

			$cigarette = $form.find('#cigarette'),
			$cigarette_date = $form.find('#cigarette-date'),
			$cigarette_amount = $form.find('#cigarette-amount'),
			$cigar = $form.find('#cigar'),
			$cigar_date = $form.find('#cigar-date'),
			$cigar_amount = $form.find('#cigar-amount'),
			$pipe = $form.find('#pipe'),
			$pipe_date = $form.find('#pipe-date'),
			$chew = $form.find('#chew'),
			$chew_date = $form.find('#chew-date'),
			$patch = $form.find('#patch'),
			$patch_date = $form.find('#patch-date'),

			cigarette_errors = false,
			cigarette_date_errors = false,
			cigarette_amount_errors = false,
			cigar_errors = false,
			cigar_date_errors = false,
			cigar_amount_errors = false,
			pipe_errors = false,
			pipe_date_errors = false,
			chew_errors = false,
			chew_date_errors = false,
			patch_errors = false,
			patch_date_errors = false;

			$('#commit_point').val("4-tobacco");
			$('#quote_initiated_datetime').val(storage.getItem('quote_initiated_datetime'));
			$('#quote_initiated_from_ip_address').val(storage.getItem('quote_initiated_from_ip_address'));
			$('#quote_initiated_from_city').val(storage.getItem('quote_initiated_from_city'));

			document.getElementById("tobacco-more-step").disabled = true;
        
  /* STEP 1 - Set up masks for all number entry fields */
			$cigarette_last_smoke_month.mask("#0");
			$cigarette_last_smoke_year.mask("0000");
			$cigarettes_per_day.mask("##0");
			$cigar_last_smoke_month.mask("#0");
			$cigar_last_smoke_year.mask("0000");
			$cigars_per_month.mask("##0");
			$pipe_last_smoke_month.mask("#0");
			$pipe_last_smoke_year.mask("0000");
			$chew_last_use_month.mask("#0");
			$chew_last_use_year.mask("0000");
			$patch_last_use_month.mask("#0");
			$patch_last_use_year.mask("0000");

  /* STEP 2 - Grab the current values in localStorage so they can be set on each page, in the event that a user 
              left this page and comes back later, so they don't lose data that they may have already entered */
	var storage_cigarettes = storage.getItem('tobacco_cigarettes'),
			storage_cigars = storage.getItem('tobacco_cigars'),
      storage_pipe = storage.getItem('tobacco_pipe'),
      storage_chew = storage.getItem('tobacco_chew'),
      storage_patch = storage.getItem('tobacco_patch'),

      storage_cigarette_last_smoke_month = storage.getItem('tobacco_cigarette_last_smoke_month'),
      storage_cigarette_last_smoke_year = storage.getItem('tobacco_cigarette_last_smoke_year'),
      storage_cigarettes_per_day = storage.getItem('tobacco_cigarettes_per_day'),

      storage_cigar_last_smoke_month = storage.getItem('tobacco_cigar_last_smoke_month'),
      storage_cigar_last_smoke_year = storage.getItem('tobacco_cigar_last_smoke_year'),
      storage_cigars_per_month = storage.getItem('tobacco_cigars_per_month'),

      storage_pipe_last_smoke_month = storage.getItem('tobacco_pipe_last_smoke_month'),
      storage_pipe_last_smoke_year = storage.getItem('tobacco_pipe_last_smoke_year'),

      storage_chew_last_use_month = storage.getItem('tobacco_chew_last_use_month'),
      storage_chew_last_use_year = storage.getItem('tobacco_chew_last_use_year'),

      storage_patch_last_use_month = storage.getItem('tobacco_patch_last_use_month'),
      storage_patch_last_use_year = storage.getItem('tobacco_patch_last_use_year');

  /* STEP 3 - Evaluate whether there was data in localStorage for the page, and re-initialize it with that data, if there was */
  if (storage_cigarettes !== null) {
	  $("input[name='CigaretteUsage'][value='" + storage_cigarettes + "']").prop("checked", true);
		$("input[name='CigaretteUsage'][value='" + storage_cigarettes + "']").prev('.w-radio-input').addClass('w--redirected-checked');
		$("#cigarettes_" + storage_cigarettes.toLowerCase()).parent().css( "backgroundColor", "#48bd9d" );
		$("#cigarettes_" + storage_cigarettes.toLowerCase()).parent().css( "border", "#48bd9e" );
		$("#cigarettes_" + storage_cigarettes.toLowerCase()).parent().css( "color", "#ffffff" );
  }

  if (storage_cigars !== null) {
	  $("input[name='CigarUsage'][value='" + storage_cigars + "']").prop("checked", true);
		$("input[name='CigarUsage'][value='" + storage_cigars + "']").prev('.w-radio-input').addClass('w--redirected-checked');
		$("#cigars_" + storage_cigars.toLowerCase()).parent().css( "backgroundColor", "#48bd9d" );
		$("#cigars_" + storage_cigars.toLowerCase()).parent().css( "border", "#48bd9e" );
		$("#cigars_" + storage_cigars.toLowerCase()).parent().css( "color", "#ffffff" );
  }

  if (storage_pipe !== null) {
	  $("input[name='PipeUsage'][value='" + storage_pipe + "']").prop("checked", true);
		$("input[name='PipeUsage'][value='" + storage_pipe + "']").prev('.w-radio-input').addClass('w--redirected-checked');
		$("#pipe_" + storage_pipe.toLowerCase()).parent().css( "backgroundColor", "#48bd9d" );
		$("#pipe_" + storage_pipe.toLowerCase()).parent().css( "border", "#48bd9e" );
		$("#pipe_" + storage_pipe.toLowerCase()).parent().css( "color", "#ffffff" );
  }

  if (storage_chew !== null) {
	  $("input[name='ChewingTobaccoUsage'][value='" + storage_chew + "']").prop("checked", true);
		$("input[name='ChewingTobaccoUsage'][value='" + storage_chew + "']").prev('.w-radio-input').addClass('w--redirected-checked');
		$("#chewing_tobacco_" + storage_chew.toLowerCase()).parent().css( "backgroundColor", "#48bd9d" );
		$("#chewing_tobacco_" + storage_chew.toLowerCase()).parent().css( "border", "#48bd9e" );
		$("#chewing_tobacco_" + storage_chew.toLowerCase()).parent().css( "color", "#ffffff" );
  }

  if (storage_patch !== null) {
	  $("input[name='NicotineReplacementUsage'][value='" + storage_patch + "']").prop("checked", true);
		$("input[name='NicotineReplacementUsage'][value='" + storage_patch + "']").prev('.w-radio-input').addClass('w--redirected-checked');
		$("#nicotine_replacement_" + storage_patch.toLowerCase()).parent().css( "backgroundColor", "#48bd9d" );
		$("#nicotine_replacement_" + storage_patch.toLowerCase()).parent().css( "border", "#48bd9e" );
		$("#nicotine_replacement_" + storage_patch.toLowerCase()).parent().css( "color", "#ffffff" );
  }

  if (storage_cigarette_last_smoke_month !== null) {
		$cigarette_last_smoke_month.val(storage_cigarette_last_smoke_month);
	}

  if (storage_cigarette_last_smoke_year !== null) {
		$cigarette_last_smoke_year.val(storage_cigarette_last_smoke_year);
	}

  if (storage_cigarettes_per_day !== null) {
		$cigarettes_per_day.val(storage_cigarettes_per_day);
	}

  if (storage_cigar_last_smoke_month !== null) {
		$cigar_last_smoke_month.val(storage_cigar_last_smoke_month);
	}

  if (storage_cigar_last_smoke_year !== null) {
		$cigar_last_smoke_year.val(storage_cigar_last_smoke_year);
	}

  if (storage_cigars_per_month !== null) {
		$cigars_per_month.val(storage_cigars_per_month);
	}

  if (storage_pipe_last_smoke_month !== null) {
		$pipe_last_smoke_month.val(storage_pipe_last_smoke_month);
	}

  if (storage_pipe_last_smoke_year !== null) {
		$pipe_last_smoke_year.val(storage_pipe_last_smoke_year);
	}

  if (storage_chew_last_use_month !== null) {
		$chew_last_use_month.val(storage_chew_last_use_month);
	}

  if (storage_chew_last_use_year !== null) {
		$chew_last_use_year.val(storage_chew_last_use_year);
	}

  if (storage_patch_last_use_month !== null) {
		$patch_last_use_month.val(storage_patch_last_use_month);
	}

  if (storage_patch_last_use_year !== null) {
		$patch_last_use_year.val(storage_patch_last_use_year);
	}

  submitButtonCheck();

  /* STEP 4 - Set up listeners on each field for input events & validate all date entry fields */
			$cigarette_last_smoke_month.on('input.True', function() {
				this.value = monthValuesCheck(this.value);});
			$cigarette_last_smoke_year.on('input.True', function() {
				this.value = yearValuesCheck(this.value);});
			$cigar_last_smoke_month.on('input.True', function() {
				this.value = monthValuesCheck(this.value);});
			$cigar_last_smoke_year.on('input.True', function() {
				this.value = yearValuesCheck(this.value);});
			$pipe_last_smoke_month.on('input.True', function() {
				this.value = monthValuesCheck(this.value);});
			$pipe_last_smoke_year.on('input.True', function() {
				this.value = yearValuesCheck(this.value);});
			$chew_last_use_month.on('input.True', function() {
				this.value = monthValuesCheck(this.value);});
			$chew_last_use_year.on('input.True', function() {
				this.value = yearValuesCheck(this.value);});
			$patch_last_use_month.on('input.True', function() {
				this.value = monthValuesCheck(this.value);});
			$patch_last_use_year.on('input.True', function() {
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

			$cigarette.on('focusin', function() {
					cigarette_errors = chkTobaccoErrors('cigarette', 'focusin', $cigarette, $form, last_focus);
					last_focus = "cigarette";
			});
			$cigarette_date.on('focusin', function() {
					cigarette_date_errors = chkTobaccoErrors('cigarette_date', 'focusin', $cigarette_date, $form, last_focus);
					last_focus = "cigarette_date";
			});
			$cigarette_amount.on('focusin', function() {
					cigarette_amount_errors = chkTobaccoErrors('cigarette_amount', 'focusin', $cigarette_amount, $form, last_focus);
					last_focus = "cigarette_amount";
			});

			$cigar.on('focusin', function() {
					cigar_errors = chkTobaccoErrors('cigar', 'focusin', $cigar, $form, last_focus);
					last_focus = "cigar";
			});
			$cigar_date.on('focusin', function() {
					cigar_date_errors = chkTobaccoErrors('cigar_date', 'focusin', $cigar_date, $form, last_focus);
					last_focus = "cigar_date";
			});
			$cigar_amount.on('focusin', function() {
					cigar_amount_errors = chkTobaccoErrors('cigar_amount', 'focusin', $cigar_amount, $form, last_focus);
					last_focus = "cigar_amount";
			});

			$pipe.on('focusin', function() {
					pipe_errors = chkTobaccoErrors('pipe', 'focusin', $pipe, $form, last_focus);
					last_focus = "pipe";
			});
			$pipe_date.on('focusin', function() {
					pipe_date_errors = chkTobaccoErrors('pipe_date', 'focusin', $pipe_date, $form, last_focus);
					last_focus = "pipe_date";
			});

			$chew.on('focusin', function() {
					chew_errors = chkTobaccoErrors('chew', 'focusin', $chew, $form, last_focus);
					last_focus = "chew";
			});
			$chew_date.on('focusin', function() {
					chew_date_errors = chkTobaccoErrors('chew_date', 'focusin', $chew_date, $form, last_focus);
					last_focus = "chew_date";
			});
			
			$patch.on('focusin', function() {
					patch_errors = chkTobaccoErrors('patch', 'focusin', $patch, $form, last_focus);
					last_focus = "patch";
			});
			$patch_date.on('focusin', function() {
					patch_date_errors = chkTobaccoErrors('patch_date', 'focusin', $patch_date, $form, last_focus);
					last_focus = "patch_date";
			});

			$patch.on('focusout', function() {
					patch_errors = chkTobaccoErrors('patch', 'focusout', $patch, $form, last_focus);
			});
			$patch_date.on('focusout', function() {
					patch_date_errors = chkTobaccoErrors('patch_date', 'focusout', $patch_date, $form, last_focus);
			});


			$('#tobacco-more-step').click(function(e) {
				e.preventDefault();
        submitButtonCheck();

				nextPage = getRedirectURL(currentPage);

        if (submit_errors) {
      		document.getElementById("tobacco-more-step").disabled = true;
					if (!cigarette_errors && !cigarette_date_errors && !cigarette_amount_errors && !cigar_errors && !cigar_date_errors && !cigar_amount_errors && !pipe_errors && !pipe_date_errors && !chew_errors && !chew_date_errors && !patch_errors && !patch_date_errors) {
 					  $(".page_error").show(500);
          } else {
 					  $(".page_error").hide(500);
          }
				} else {
      		document.getElementById("tobacco-more-step").disabled = false;
 				  $(".page_error").hide(500);
					location.href = nextPage;
        }
			});
      
			$('#tobacco-more-prev').click(function(e) {
				e.preventDefault();
				window.history.back();
			});

			function submitButtonCheck() {
				var cigarette_selected = $("input[name='CigaretteUsage']:checked").val(),
				cigar_selected = $("input[name='CigarUsage']:checked").val(),
				pipe_selected = $("input[name='PipeUsage']:checked").val(),
				chew_selected = $("input[name='ChewingTobaccoUsage']:checked").val(),
				patch_selected = $("input[name='NicotineReplacementUsage']:checked").val(),
				cigarettes_per_day = $cigarettes_per_day.val(),
				cigars_per_month = $cigars_per_month.val(),
				conditionals_for_cigarettes_satisfied = false,
				conditionals_for_cigars_satisfied = false,
				conditionals_for_pipes_satisfied = false,
				conditionals_for_chew_satisfied = false,
				conditionals_for_patch_satisfied = false,
				error_color = "#AC0036",
	    	no_error_color = "#DEDEDE";

			if (cigarette_selected == "Yes") {
					$(".conditional_cigarettes").show(500);
					if (	 $cigarette_last_smoke_month.val() != '' && /^([\w-]{1,2})?$/.test( $cigarette_last_smoke_month.val() ) 
							&& $cigarette_last_smoke_year.val() != '' && /^([\w-]{4,4})?$/.test( $cigarette_last_smoke_year.val() )
							&& $cigarettes_per_day.val().length > 0
					) {
						conditionals_for_cigarettes_satisfied = true;
					} else {
						conditionals_for_cigarettes_satisfied = false;
					}
			} else if (cigarette_selected == "No") {
					$(".conditional_cigarettes").hide(500);
					conditionals_for_cigarettes_satisfied = true;
					$cigarette_last_smoke_month.val(null);
					$cigarette_last_smoke_year.val(null);
					$cigarettes_per_day.val(null);
					$(".cigarette_date_error").hide(500);
					$(".cigarette_amount_error").hide(500);
          $cigarette_date.css("border-color", no_error_color);
          $cigarette_amount.css("border-color", no_error_color);
			}

      if (cigar_selected == "Yes") {
					$(".conditional_cigars").show(500);
					if (	 $cigar_last_smoke_month.val() != '' && /^([\w-]{1,2})?$/.test( $cigar_last_smoke_month.val() ) 
							&& $cigar_last_smoke_year.val() != '' && /^([\w-]{4,4})?$/.test( $cigar_last_smoke_year.val() )
							&& $cigars_per_month.val().length > 0
					) {
						conditionals_for_cigars_satisfied = true;
					} else {
						conditionals_for_cigars_satisfied = false;
					}
			} else if (cigar_selected == "No") {
					$(".conditional_cigars").hide(500);
					conditionals_for_cigars_satisfied = true;
					$cigar_last_smoke_month.val(null);
					$cigar_last_smoke_year.val(null);
					$(".cigar_date_error").hide(500);
					$(".cigar_amount_error").hide(500);
          $cigar_date.css("border-color", no_error_color);
          $cigar_amount.css("border-color", no_error_color);
			}

			if (pipe_selected == "Yes") {
					$(".conditional_pipe_usage").show(500);
					if (	 $pipe_last_smoke_month.val() != '' && /^([\w-]{1,2})?$/.test( $pipe_last_smoke_month.val() ) 
							&& $pipe_last_smoke_year.val() != '' && /^([\w-]{4,4})?$/.test( $pipe_last_smoke_year.val() )
					) {
						conditionals_for_pipes_satisfied = true;
					} else {
						conditionals_for_pipes_satisfied = false;
					}
			} else if (pipe_selected == "No") {
					$(".conditional_pipe_usage").hide(500);
					conditionals_for_pipes_satisfied = true;
					$pipe_last_smoke_month.val(null);
					$pipe_last_smoke_year.val(null);
					$(".pipe_date_error").hide(500);
          $pipe_date.css("border-color", no_error_color);
			}

			if (chew_selected == "Yes") {
					$(".conditional_chew").show(500);
					if (	 $chew_last_use_month.val() != '' && /^([\w-]{1,2})?$/.test( $chew_last_use_month.val() ) 
							&& $chew_last_use_year.val() != '' && /^([\w-]{4,4})?$/.test( $chew_last_use_year.val() )
					) {
						conditionals_for_chew_satisfied = true;
					} else {
						conditionals_for_chew_satisfied = false;
					}
			} else if (chew_selected == "No") {
					$(".conditional_chew").hide(500);
					conditionals_for_chew_satisfied = true;
					$chew_last_use_month.val(null);
					$chew_last_use_year.val(null);
					$(".chew_date_error").hide(500);
          $chew_date.css("border-color", no_error_color);
			}

			if (patch_selected == "Yes") {
					$(".conditional_patch").show(500);
					if (	 $patch_last_use_month.val() != '' && /^([\w-]{1,2})?$/.test( $patch_last_use_month.val() ) 
							&& $patch_last_use_year.val() != '' && /^([\w-]{4,4})?$/.test( $patch_last_use_year.val() )
					) {
						conditionals_for_patch_satisfied = true;
					} else {
						conditionals_for_patch_satisfied = false;
					}
			} else if (patch_selected == "No") {
					$(".conditional_patch").hide(500);
					conditionals_for_patch_satisfied = true;
					$patch_last_use_month.val(null);
					$patch_last_use_year.val(null);
					$(".patch_date_error").hide(500);
          $patch_date.css("border-color", no_error_color);
			}
        
				if (cigarette_selected != undefined
				 && cigar_selected != undefined
				 && pipe_selected != undefined
				 && chew_selected != undefined
				 && patch_selected != undefined
				 && conditionals_for_cigarettes_satisfied
				 && conditionals_for_cigars_satisfied
				 && conditionals_for_pipes_satisfied
				 && conditionals_for_chew_satisfied
				 && conditionals_for_patch_satisfied
				) {
       		document.getElementById("tobacco-more-step").disabled = false;
					$tobacco_more_next.toggleClass(className, true);
					submit_errors = false;
				  $(".page_error").hide(500);
				} else {
       		document.getElementById("tobacco-more-step").disabled = true;
					$tobacco_more_next.toggleClass(className, false);
					submit_errors = true;
				}

				storage.setItem('tobacco_cigarettes', cigarette_selected);
				storage.setItem('tobacco_cigarette_last_smoke_month', $cigarette_last_smoke_month.val());
				storage.setItem('tobacco_cigarette_last_smoke_year', $cigarette_last_smoke_year.val());
				storage.setItem('tobacco_cigarettes_per_day', cigarettes_per_day);
				storage.setItem('tobacco_cigars', cigar_selected);
				storage.setItem('tobacco_cigar_last_smoke_month', $cigar_last_smoke_month.val());
				storage.setItem('tobacco_cigar_last_smoke_year', $cigar_last_smoke_year.val());
				storage.setItem('tobacco_cigars_per_month', cigars_per_month);
				storage.setItem('tobacco_pipe', pipe_selected);
				storage.setItem('tobacco_pipe_last_smoke_month', $pipe_last_smoke_month.val());
				storage.setItem('tobacco_pipe_last_smoke_year', $pipe_last_smoke_year.val());
				storage.setItem('tobacco_chew', chew_selected);
				storage.setItem('tobacco_chew_last_use_month', $chew_last_use_month.val());
				storage.setItem('tobacco_chew_last_use_year', $chew_last_use_year.val());
				storage.setItem('tobacco_patch', patch_selected);
				storage.setItem('tobacco_patch_last_use_month', $patch_last_use_month.val());
				storage.setItem('tobacco_patch_last_use_year', $patch_last_use_year.val());
				}
			});
		})(jQuery, window, document);
	})


function chkTobaccoErrors(objectAffected, focusState, object, $form, last_focus) {
	var error_color = "#AC0036",
	    no_error_color = "#DEDEDE",
	    $cigarette = $form.find('#cigarette'),
	    $cigarette_date = $form.find('#cigarette-date'),
	    $cigarette_amount = $form.find('#cigarette-amount'),
	    $cigar = $form.find('#cigar'),
	    $cigar_date = $form.find('#cigar-date'),
	    $cigar_amount = $form.find('#cigar-amount'),
	    $pipe = $form.find('#pipe'),
	    $pipe_date = $form.find('#pipe-date'),
	    $chew = $form.find('#chew'),
	    $chew_date = $form.find('#chew-date'),
	    $patch = $form.find('#patch'),
	    $patch_date = $form.find('#patch-date'),

			cigarette_selected = $("input[name='CigaretteUsage']:checked").val(),
      $cigarette_last_smoke_month = $form.find('input[id="cigarette_last_smoke_month"]'),
      $cigarette_last_smoke_year = $form.find('input[id="cigarette_last_smoke_year"]'),
			$cigarettes_per_day = $form.find('input[id="cigarettes_per_day"]'),

			cigar_selected = $("input[name='CigarUsage']:checked").val(),
      $cigar_last_smoke_month = $form.find('input[id="cigar_last_smoke_month"]'),
      $cigar_last_smoke_year = $form.find('input[id="cigar_last_smoke_year"]'),
			$cigars_per_month = $form.find('input[id="cigars_per_month"]'),

			pipe_selected = $("input[name='PipeUsage']:checked").val(),
      $pipe_last_smoke_month = $form.find('input[id="pipe_last_smoke_month"]'),
      $pipe_last_smoke_year = $form.find('input[id="pipe_last_smoke_year"]'),

			chew_selected = $("input[name='ChewingTobaccoUsage']:checked").val(),
      $chew_last_use_month = $form.find('input[id="chew_last_use_month"]'),
      $chew_last_use_year = $form.find('input[id="chew_last_use_year"]'),

			patch_selected = $("input[name='NicotineReplacementUsage']:checked").val(),
      $patch_last_use_month = $form.find('input[id="patch_last_use_month"]'),
      $patch_last_use_year = $form.find('input[id="patch_last_use_year"]');

//	console.log("objectAffected="+objectAffected+"\nfocusState="+focusState+"\nlast_focus="+last_focus); // Use for debugging
	if (focusState == 'focusin') {
		$("."+objectAffected+"_error").hide(500);
    if (objectAffected == 'cigarette') {
        $cigarette.css("border-color", "black");
//        if (last_focus == "cigarette") {chkTobaccoErrors('cigarette', 'focusout', object, $form, last_focus);}
        if (last_focus == "cigarette_date") {chkTobaccoErrors('cigarette_date', 'focusout', object, $form, last_focus);}
        if (last_focus == "cigarette_amount") {chkTobaccoErrors('cigarette_amount', 'focusout', object, $form, last_focus);}
        if (last_focus == "cigar") {chkTobaccoErrors('cigar', 'focusout', object, $form, last_focus);}
        if (last_focus == "cigar_date") {chkTobaccoErrors('cigar_date', 'focusout', object, $form, last_focus);}
        if (last_focus == "cigar_amount") {chkTobaccoErrors('cigar_amount', 'focusout', object, $form, last_focus);}
        if (last_focus == "pipe") {chkTobaccoErrors('pipe', 'focusout', object, $form, last_focus);}
        if (last_focus == "pipe_date") {chkTobaccoErrors('pipe_date', 'focusout', object, $form, last_focus);}
        if (last_focus == "chew") {chkTobaccoErrors('chew', 'focusout', object, $form, last_focus);}
        if (last_focus == "chew_date") {chkTobaccoErrors('chew_date', 'focusout', object, $form, last_focus);}
        if (last_focus == "patch") {chkTobaccoErrors('patch', 'focusout', object, $form, last_focus);}
        if (last_focus == "patch_date") {chkTobaccoErrors('patch_date', 'focusout', object, $form, last_focus);}
    } else if (objectAffected == 'cigarette_date') {
        $cigarette_date.css("border-color", "black");
        if (last_focus == "cigarette") {chkTobaccoErrors('cigarette', 'focusout', object, $form, last_focus);}
//        if (last_focus == "cigarette_date") {chkTobaccoErrors('cigarette_date', 'focusout', object, $form, last_focus);}
        if (last_focus == "cigarette_amount") {chkTobaccoErrors('cigarette_amount', 'focusout', object, $form, last_focus);}
        if (last_focus == "cigar") {chkTobaccoErrors('cigar', 'focusout', object, $form, last_focus);}
        if (last_focus == "cigar_date") {chkTobaccoErrors('cigar_date', 'focusout', object, $form, last_focus);}
        if (last_focus == "cigar_amount") {chkTobaccoErrors('cigar_amount', 'focusout', object, $form, last_focus);}
        if (last_focus == "pipe") {chkTobaccoErrors('pipe', 'focusout', object, $form, last_focus);}
        if (last_focus == "pipe_date") {chkTobaccoErrors('pipe_date', 'focusout', object, $form, last_focus);}
        if (last_focus == "chew") {chkTobaccoErrors('chew', 'focusout', object, $form, last_focus);}
        if (last_focus == "chew_date") {chkTobaccoErrors('chew_date', 'focusout', object, $form, last_focus);}
        if (last_focus == "patch") {chkTobaccoErrors('patch', 'focusout', object, $form, last_focus);}
        if (last_focus == "patch_date") {chkTobaccoErrors('patch_date', 'focusout', object, $form, last_focus);}
    } else if (objectAffected == 'cigarette_amount') {
        $cigarette_amount.css("border-color", "black");
        if (last_focus == "cigarette") {chkTobaccoErrors('cigarette', 'focusout', object, $form, last_focus);}
        if (last_focus == "cigarette_date") {chkTobaccoErrors('cigarette_date', 'focusout', object, $form, last_focus);}
//        if (last_focus == "cigarette_amount") {chkTobaccoErrors('cigarette_amount', 'focusout', object, $form, last_focus);}
        if (last_focus == "cigar") {chkTobaccoErrors('cigar', 'focusout', object, $form, last_focus);}
        if (last_focus == "cigar_date") {chkTobaccoErrors('cigar_date', 'focusout', object, $form, last_focus);}
        if (last_focus == "cigar_amount") {chkTobaccoErrors('cigar_amount', 'focusout', object, $form, last_focus);}
        if (last_focus == "pipe") {chkTobaccoErrors('pipe', 'focusout', object, $form, last_focus);}
        if (last_focus == "pipe_date") {chkTobaccoErrors('pipe_date', 'focusout', object, $form, last_focus);}
        if (last_focus == "chew") {chkTobaccoErrors('chew', 'focusout', object, $form, last_focus);}
        if (last_focus == "chew_date") {chkTobaccoErrors('chew_date', 'focusout', object, $form, last_focus);}
        if (last_focus == "patch") {chkTobaccoErrors('patch', 'focusout', object, $form, last_focus);}
        if (last_focus == "patch_date") {chkTobaccoErrors('patch_date', 'focusout', object, $form, last_focus);}
    } else if (objectAffected == 'cigar') {
        $cigar.css("border-color", "black");
        if (last_focus == "cigarette") {chkTobaccoErrors('cigarette', 'focusout', object, $form, last_focus);}
        if (last_focus == "cigarette_date") {chkTobaccoErrors('cigarette_date', 'focusout', object, $form, last_focus);}
        if (last_focus == "cigarette_amount") {chkTobaccoErrors('cigarette_amount', 'focusout', object, $form, last_focus);}
//        if (last_focus == "cigar") {chkTobaccoErrors('cigar', 'focusout', object, $form, last_focus);}
        if (last_focus == "cigar_date") {chkTobaccoErrors('cigar_date', 'focusout', object, $form, last_focus);}
        if (last_focus == "cigar_amount") {chkTobaccoErrors('cigar_amount', 'focusout', object, $form, last_focus);}
        if (last_focus == "pipe") {chkTobaccoErrors('pipe', 'focusout', object, $form, last_focus);}
        if (last_focus == "pipe_date") {chkTobaccoErrors('pipe_date', 'focusout', object, $form, last_focus);}
        if (last_focus == "chew") {chkTobaccoErrors('chew', 'focusout', object, $form, last_focus);}
        if (last_focus == "chew_date") {chkTobaccoErrors('chew_date', 'focusout', object, $form, last_focus);}
        if (last_focus == "patch") {chkTobaccoErrors('patch', 'focusout', object, $form, last_focus);}
        if (last_focus == "patch_date") {chkTobaccoErrors('patch_date', 'focusout', object, $form, last_focus);}
    } else if (objectAffected == 'cigar_date') {
        $cigar_date.css("border-color", "black");
        if (last_focus == "cigarette") {chkTobaccoErrors('cigarette', 'focusout', object, $form, last_focus);}
        if (last_focus == "cigarette_date") {chkTobaccoErrors('cigarette_date', 'focusout', object, $form, last_focus);}
        if (last_focus == "cigarette_amount") {chkTobaccoErrors('cigarette_amount', 'focusout', object, $form, last_focus);}
        if (last_focus == "cigar") {chkTobaccoErrors('cigar', 'focusout', object, $form, last_focus);}
//        if (last_focus == "cigar_date") {chkTobaccoErrors('cigar_date', 'focusout', object, $form, last_focus);}
        if (last_focus == "cigar_amount") {chkTobaccoErrors('cigar_amount', 'focusout', object, $form, last_focus);}
        if (last_focus == "pipe") {chkTobaccoErrors('pipe', 'focusout', object, $form, last_focus);}
        if (last_focus == "pipe_date") {chkTobaccoErrors('pipe_date', 'focusout', object, $form, last_focus);}
        if (last_focus == "chew") {chkTobaccoErrors('chew', 'focusout', object, $form, last_focus);}
        if (last_focus == "chew_date") {chkTobaccoErrors('chew_date', 'focusout', object, $form, last_focus);}
        if (last_focus == "patch") {chkTobaccoErrors('patch', 'focusout', object, $form, last_focus);}
        if (last_focus == "patch_date") {chkTobaccoErrors('patch_date', 'focusout', object, $form, last_focus);}
    } else if (objectAffected == 'cigar_amount') {
        $cigar_amount.css("border-color", "black");
        if (last_focus == "cigarette") {chkTobaccoErrors('cigarette', 'focusout', object, $form, last_focus);}
        if (last_focus == "cigarette_date") {chkTobaccoErrors('cigarette_date', 'focusout', object, $form, last_focus);}
        if (last_focus == "cigarette_amount") {chkTobaccoErrors('cigarette_amount', 'focusout', object, $form, last_focus);}
        if (last_focus == "cigar") {chkTobaccoErrors('cigar', 'focusout', object, $form, last_focus);}
        if (last_focus == "cigar_date") {chkTobaccoErrors('cigar_date', 'focusout', object, $form, last_focus);}
//        if (last_focus == "cigar_amount") {chkTobaccoErrors('cigar_amount', 'focusout', object, $form, last_focus);}
        if (last_focus == "pipe") {chkTobaccoErrors('pipe', 'focusout', object, $form, last_focus);}
        if (last_focus == "pipe_date") {chkTobaccoErrors('pipe_date', 'focusout', object, $form, last_focus);}
        if (last_focus == "chew") {chkTobaccoErrors('chew', 'focusout', object, $form, last_focus);}
        if (last_focus == "chew_date") {chkTobaccoErrors('chew_date', 'focusout', object, $form, last_focus);}
        if (last_focus == "patch") {chkTobaccoErrors('patch', 'focusout', object, $form, last_focus);}
        if (last_focus == "patch_date") {chkTobaccoErrors('patch_date', 'focusout', object, $form, last_focus);}
    } else if (objectAffected == 'pipe') {
        $pipe.css("border-color", "black");
        if (last_focus == "cigarette") {chkTobaccoErrors('cigarette', 'focusout', object, $form, last_focus);}
        if (last_focus == "cigarette_date") {chkTobaccoErrors('cigarette_date', 'focusout', object, $form, last_focus);}
        if (last_focus == "cigarette_amount") {chkTobaccoErrors('cigarette_amount', 'focusout', object, $form, last_focus);}
        if (last_focus == "cigar") {chkTobaccoErrors('cigar', 'focusout', object, $form, last_focus);}
        if (last_focus == "cigar_date") {chkTobaccoErrors('cigar_date', 'focusout', object, $form, last_focus);}
        if (last_focus == "cigar_amount") {chkTobaccoErrors('cigar_amount', 'focusout', object, $form, last_focus);}
//        if (last_focus == "pipe") {chkTobaccoErrors('pipe', 'focusout', object, $form, last_focus);}
        if (last_focus == "pipe_date") {chkTobaccoErrors('pipe_date', 'focusout', object, $form, last_focus);}
        if (last_focus == "chew") {chkTobaccoErrors('chew', 'focusout', object, $form, last_focus);}
        if (last_focus == "chew_date") {chkTobaccoErrors('chew_date', 'focusout', object, $form, last_focus);}
        if (last_focus == "patch") {chkTobaccoErrors('patch', 'focusout', object, $form, last_focus);}
        if (last_focus == "patch_date") {chkTobaccoErrors('patch_date', 'focusout', object, $form, last_focus);}
    } else if (objectAffected == 'pipe_date') {
        $pipe_date.css("border-color", "black");
        if (last_focus == "cigarette") {chkTobaccoErrors('cigarette', 'focusout', object, $form, last_focus);}
        if (last_focus == "cigarette_date") {chkTobaccoErrors('cigarette_date', 'focusout', object, $form, last_focus);}
        if (last_focus == "cigarette_amount") {chkTobaccoErrors('cigarette_amount', 'focusout', object, $form, last_focus);}
        if (last_focus == "cigar") {chkTobaccoErrors('cigar', 'focusout', object, $form, last_focus);}
        if (last_focus == "cigar_date") {chkTobaccoErrors('cigar_date', 'focusout', object, $form, last_focus);}
        if (last_focus == "cigar_amount") {chkTobaccoErrors('cigar_amount', 'focusout', object, $form, last_focus);}
        if (last_focus == "pipe") {chkTobaccoErrors('pipe', 'focusout', object, $form, last_focus);}
//        if (last_focus == "pipe_date") {chkTobaccoErrors('pipe_date', 'focusout', object, $form, last_focus);}
        if (last_focus == "chew") {chkTobaccoErrors('chew', 'focusout', object, $form, last_focus);}
        if (last_focus == "chew_date") {chkTobaccoErrors('chew_date', 'focusout', object, $form, last_focus);}
        if (last_focus == "patch") {chkTobaccoErrors('patch', 'focusout', object, $form, last_focus);}
        if (last_focus == "patch_date") {chkTobaccoErrors('patch_date', 'focusout', object, $form, last_focus);}
    } else if (objectAffected == 'chew') {
        $chew.css("border-color", "black");
        if (last_focus == "cigarette") {chkTobaccoErrors('cigarette', 'focusout', object, $form, last_focus);}
        if (last_focus == "cigarette_date") {chkTobaccoErrors('cigarette_date', 'focusout', object, $form, last_focus);}
        if (last_focus == "cigarette_amount") {chkTobaccoErrors('cigarette_amount', 'focusout', object, $form, last_focus);}
        if (last_focus == "cigar") {chkTobaccoErrors('cigar', 'focusout', object, $form, last_focus);}
        if (last_focus == "cigar_date") {chkTobaccoErrors('cigar_date', 'focusout', object, $form, last_focus);}
        if (last_focus == "cigar_amount") {chkTobaccoErrors('cigar_amount', 'focusout', object, $form, last_focus);}
        if (last_focus == "pipe") {chkTobaccoErrors('pipe', 'focusout', object, $form, last_focus);}
        if (last_focus == "pipe_date") {chkTobaccoErrors('pipe_date', 'focusout', object, $form, last_focus);}
//        if (last_focus == "chew") {chkTobaccoErrors('chew', 'focusout', object, $form, last_focus);}
        if (last_focus == "chew_date") {chkTobaccoErrors('chew_date', 'focusout', object, $form, last_focus);}
        if (last_focus == "patch") {chkTobaccoErrors('patch', 'focusout', object, $form, last_focus);}
        if (last_focus == "patch_date") {chkTobaccoErrors('patch_date', 'focusout', object, $form, last_focus);}
    } else if (objectAffected == 'chew_date') {
        $chew_date.css("border-color", "black");
        if (last_focus == "cigarette") {chkTobaccoErrors('cigarette', 'focusout', object, $form, last_focus);}
        if (last_focus == "cigarette_date") {chkTobaccoErrors('cigarette_date', 'focusout', object, $form, last_focus);}
        if (last_focus == "cigarette_amount") {chkTobaccoErrors('cigarette_amount', 'focusout', object, $form, last_focus);}
        if (last_focus == "cigar") {chkTobaccoErrors('cigar', 'focusout', object, $form, last_focus);}
        if (last_focus == "cigar_date") {chkTobaccoErrors('cigar_date', 'focusout', object, $form, last_focus);}
        if (last_focus == "cigar_amount") {chkTobaccoErrors('cigar_amount', 'focusout', object, $form, last_focus);}
        if (last_focus == "pipe") {chkTobaccoErrors('pipe', 'focusout', object, $form, last_focus);}
        if (last_focus == "pipe_date") {chkTobaccoErrors('pipe_date', 'focusout', object, $form, last_focus);}
        if (last_focus == "chew") {chkTobaccoErrors('chew', 'focusout', object, $form, last_focus);}
//        if (last_focus == "chew_date") {chkTobaccoErrors('chew_date', 'focusout', object, $form, last_focus);}
        if (last_focus == "patch") {chkTobaccoErrors('patch', 'focusout', object, $form, last_focus);}
        if (last_focus == "patch_date") {chkTobaccoErrors('patch_date', 'focusout', object, $form, last_focus);}
    } else if (objectAffected == 'patch') {
        $patch.css("border-color", "black");
        if (last_focus == "cigarette") {chkTobaccoErrors('cigarette', 'focusout', object, $form, last_focus);}
        if (last_focus == "cigarette_date") {chkTobaccoErrors('cigarette_date', 'focusout', object, $form, last_focus);}
        if (last_focus == "cigarette_amount") {chkTobaccoErrors('cigarette_amount', 'focusout', object, $form, last_focus);}
        if (last_focus == "cigar") {chkTobaccoErrors('cigar', 'focusout', object, $form, last_focus);}
        if (last_focus == "cigar_date") {chkTobaccoErrors('cigar_date', 'focusout', object, $form, last_focus);}
        if (last_focus == "cigar_amount") {chkTobaccoErrors('cigar_amount', 'focusout', object, $form, last_focus);}
        if (last_focus == "pipe") {chkTobaccoErrors('pipe', 'focusout', object, $form, last_focus);}
        if (last_focus == "pipe_date") {chkTobaccoErrors('pipe_date', 'focusout', object, $form, last_focus);}
        if (last_focus == "chew") {chkTobaccoErrors('chew', 'focusout', object, $form, last_focus);}
        if (last_focus == "chew_date") {chkTobaccoErrors('chew_date', 'focusout', object, $form, last_focus);}
//        if (last_focus == "patch") {chkTobaccoErrors('patch', 'focusout', object, $form, last_focus);}
        if (last_focus == "patch_date") {chkTobaccoErrors('patch_date', 'focusout', object, $form, last_focus);}
    } else if (objectAffected == 'patch_date') {
        $patch_date.css("border-color", "black");
        if (last_focus == "cigarette") {chkTobaccoErrors('cigarette', 'focusout', object, $form, last_focus);}
        if (last_focus == "cigarette_date") {chkTobaccoErrors('cigarette_date', 'focusout', object, $form, last_focus);}
        if (last_focus == "cigarette_amount") {chkTobaccoErrors('cigarette_amount', 'focusout', object, $form, last_focus);}
        if (last_focus == "cigar") {chkTobaccoErrors('cigar', 'focusout', object, $form, last_focus);}
        if (last_focus == "cigar_date") {chkTobaccoErrors('cigar_date', 'focusout', object, $form, last_focus);}
        if (last_focus == "cigar_amount") {chkTobaccoErrors('cigar_amount', 'focusout', object, $form, last_focus);}
        if (last_focus == "pipe") {chkTobaccoErrors('pipe', 'focusout', object, $form, last_focus);}
        if (last_focus == "pipe_date") {chkTobaccoErrors('pipe_date', 'focusout', object, $form, last_focus);}
        if (last_focus == "chew") {chkTobaccoErrors('chew', 'focusout', object, $form, last_focus);}
        if (last_focus == "chew_date") {chkTobaccoErrors('chew_date', 'focusout', object, $form, last_focus);}
        if (last_focus == "patch") {chkTobaccoErrors('patch', 'focusout', object, $form, last_focus);}
//        if (last_focus == "patch_date") {chkTobaccoErrors('patch_date', 'focusout', object, $form, last_focus);}
	  } else {
        object.css("border-color", "black");
    }
		return false;
	} else if (focusState == 'focusout') {
    if (objectAffected == 'cigarette') {
	    	if (cigarette_selected != undefined) {
					$("."+objectAffected+"_error").hide(500);
          $cigarette.css("border-color", no_error_color);
					return false;
				} else {
					$("."+objectAffected+"_error").show(500);
          $(".page_error").hide(500);
          $cigarette.css("border-color", error_color);
          return true;
				}
		}
    if (objectAffected == 'cigarette_date') {
				if ($cigarette_last_smoke_month.val().length > 0 && $cigarette_last_smoke_year.val().length == 4) {
					$("."+objectAffected+"_error").hide(500);
          $cigarette_date.css("border-color", no_error_color);
					return false;
  		  } else {
					$("."+objectAffected+"_error").show(500);
          $(".page_error").hide(500);
          $cigarette_date.css("border-color", error_color);
					return true;
				}
		}
    if (objectAffected == 'cigarette_amount') {
				if ($cigarettes_per_day.val().length > 0) {
					$("."+objectAffected+"_error").hide(500);
          $cigarette_amount.css("border-color", no_error_color);
					return false;
 		    } else {
					$("."+objectAffected+"_error").show(500);
          $(".page_error").hide(500);
          $cigarette_amount.css("border-color", error_color);
					return true;
				}
		}
    if (objectAffected == 'cigar') {
	    	if (cigar_selected != undefined) {
					$("."+objectAffected+"_error").hide(500);
          $cigar.css("border-color", no_error_color);
					return false;
				} else {
					$("."+objectAffected+"_error").show(500);
          $(".page_error").hide(500);
          $cigar.css("border-color", error_color);
          return true;
				}
		}
    if (objectAffected == 'cigar_date') {
				if ($cigar_last_smoke_month.val().length > 0 && $cigar_last_smoke_year.val().length == 4) {
					$("."+objectAffected+"_error").hide(500);
          $cigar_date.css("border-color", no_error_color);
					return false;
 		    } else {
					$("."+objectAffected+"_error").show(500);
          $(".page_error").hide(500);
          $cigar_date.css("border-color", error_color);
					return true;
				}
		}
    if (objectAffected == 'cigar_amount') {
				if ($cigars_per_month.val().length > 0) {
					$("."+objectAffected+"_error").hide(500);
          $cigar_amount.css("border-color", no_error_color);
					return false;
 		    } else {
					$("."+objectAffected+"_error").show(500);
          $(".page_error").hide(500);
          $cigar_amount.css("border-color", error_color);
					return true;
				}
		}

    if (objectAffected == 'pipe') {
	    	if (pipe_selected != undefined) {
					$("."+objectAffected+"_error").hide(500);
          $pipe.css("border-color", no_error_color);
					return false;
				} else {
					$("."+objectAffected+"_error").show(500);
          $(".page_error").hide(500);
          $pipe.css("border-color", error_color);
          return true;
				}
		}
    if (objectAffected == 'pipe_date') {
				if ($pipe_last_smoke_month.val().length > 0 && $pipe_last_smoke_year.val().length == 4) {
					$("."+objectAffected+"_error").hide(500);
          $pipe_date.css("border-color", no_error_color);
					return false;
 		    } else {
					$("."+objectAffected+"_error").show(500);
          $(".page_error").hide(500);
          $pipe_date.css("border-color", error_color);
					return true;
				}
		}
    if (objectAffected == 'chew') {
	    	if (chew_selected != undefined) {
					$("."+objectAffected+"_error").hide(500);
          $chew.css("border-color", no_error_color);
					return false;
				} else {
					$("."+objectAffected+"_error").show(500);
          $(".page_error").hide(500);
          $chew.css("border-color", error_color);
          return true;
				}
		}
    if (objectAffected == 'chew_date') {
				if ($chew_last_use_month.val().length > 0 && $chew_last_use_year.val().length == 4) {
					$("."+objectAffected+"_error").hide(500);
          $chew_date.css("border-color", no_error_color);
					return false;
 		    } else {
					$("."+objectAffected+"_error").show(500);
          $(".page_error").hide(500);
          $chew_date.css("border-color", error_color);
					return true;
				}
		}
    if (objectAffected == 'patch') {
	    	if (patch_selected != undefined) {
					$("."+objectAffected+"_error").hide(500);
          $patch.css("border-color", no_error_color);
					return false;
				} else {
					$("."+objectAffected+"_error").show(500);
          $(".page_error").hide(500);
          $patch.css("border-color", error_color);
          return true;
				}
		}
    if (objectAffected == 'patch_date') {
				if ($patch_last_use_month.val().length > 0 && $patch_last_use_year.val().length == 4) {
					$("."+objectAffected+"_error").hide(500);
          $patch_date.css("border-color", no_error_color);
					return false;
 		    } else {
					$("."+objectAffected+"_error").show(500);
          $(".page_error").hide(500);
          $patch_date.css("border-color", error_color);
					return true;
				}
		}
	}
}
