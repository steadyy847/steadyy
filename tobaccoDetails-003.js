Webflow.push(function(){
	$("#quote").submit(function(){
		var storage = window.localStorage,
				currentPage = 2, // PAGE: tobacco = 2
				nextPage;
		nextPage = getRedirectURL(currentPage);
		location.href = nextPage;
	})
});

	$(function() {
		;
		(function($, window, document, undefined) {
			'use strict';
			var form = '.quote',
			className = 'submit_button_active',
			className2 = 'button_active',
			submit = 'input[type="submit"]',
			$tobaacco_more_next = $form.find( '#tobacco-more-step' ),
			currentPage = 2, // PAGE: tobacco = 2
			nextPage,
			submit_errors = true;

			$(form).each(function() {
			var $form = $(this),
      storage = window.localStorage,
			$submit = $form.find( submit ),
			enabled = true,
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
			$patch_last_use_year = $form.find( 'input[id="patch_last_use_year"]' );

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
      storage_cigars_per_day = storage.getItem('tobacco_cigars_per_day'),

      storage_pipe_last_smoke_month = storage.getItem('tobacco_pipe_last_smoke_month'),
      storage_pipe_last_smoke_year = storage.getItem('tobacco_pipe_last_smoke_year'),

      storage_chew_last_use_month = storage.getItem('tobacco_chew_last_use_month'),
      storage_chew_last_use_year = storage.getItem('tobacco_chew_last_use_year'),

      storage_patch_last_use_month = storage.getItem('tobacco_patch_last_use_month'),
      storage_patch_last_use_year = storage.getItem('tobacco_patch_last_use_year');

  /* STEP 3 - Evaluate whether there was data in localStorage for the page, and re-initialize it with that data, if there was */
  if (storage_cigarettes !== null) {
	  $("input[name='CigaretteUsage'][value='" + storage_cigarettes + "']").prop("checked", true);
		$("#cigarette_" + storage_cigarettes.toLowerCase()).parent().css( "backgroundColor", "#48bd9d" );
		$("#cigarette_" + storage_cigarettes.toLowerCase()).parent().css( "border", "#48bd9e" );
		$("#cigarette_" + storage_cigarettes.toLowerCase()).parent().css( "color", "#ffffff" );
  }

  if (storage_cigars !== null) {
	  $("input[name='CigarUsage'][value='" + storage_cigars + "']").prop("checked", true);
		$("#cigar_" + storage_cigars.toLowerCase()).parent().css( "backgroundColor", "#48bd9d" );
		$("#cigar_" + storage_cigars.toLowerCase()).parent().css( "border", "#48bd9e" );
		$("#cigar_" + storage_cigars.toLowerCase()).parent().css( "color", "#ffffff" );
  }

  if (storage_pipe !== null) {
	  $("input[name='PipeUsage'][value='" + storage_pipe + "']").prop("checked", true);
		$("#pipe_" + storage_pipe.toLowerCase()).parent().css( "backgroundColor", "#48bd9d" );
		$("#pipe_" + storage_pipe.toLowerCase()).parent().css( "border", "#48bd9e" );
		$("#pipe_" + storage_pipe.toLowerCase()).parent().css( "color", "#ffffff" );
  }

  if (storage_chew !== null) {
	  $("input[name='ChewingTobaccoUsage'][value='" + storage_chew + "']").prop("checked", true);
		$("#chewing_tobacco_" + storage_chew.toLowerCase()).parent().css( "backgroundColor", "#48bd9d" );
		$("#chewing_tobacco_" + storage_chew.toLowerCase()).parent().css( "border", "#48bd9e" );
		$("#chewing_tobacco_" + storage_chew.toLowerCase()).parent().css( "color", "#ffffff" );
  }

  if (storage_patch !== null) {
	  $("input[name='NicotineReplacementUsage'][value='" + storage_patch + "']").prop("checked", true);
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

  if (storage_cigars_per_day !== null) {
		$cigars_per_day.val(storage_cigars_per_day);
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

			$('#tobacco-more-step').click(function(e) {
				e.preventDefault();
        submitButtonCheck();

				nextPage = getRedirectURL(currentPage);
				console.log("nextPage = "+nextPage);

        if (submit_errors == false) {
      		document.getElementById("tobacco-more-step").disabled = false;
					location.href = nextPage;
				} else {
      		document.getElementById("tobacco-more-step").disabled = true;
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
				conditionals_for_patch_satisfied = false;

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
					document.getElementById("submit_button").disabled = false;
					$submit.toggleClass(className, true);
       		document.getElementById("tobacco-more-step").disabled = false;
					$tobacco_more_next.toggleClass(className2, true);
					submit_errors = false;
				} else {
					document.getElementById("submit_button").disabled = true;
					$submit.toggleClass(className, false);
       		document.getElementById("tobacco-more-step").disabled = true;
					$tobacco_more_next.toggleClass(className2, false);
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
