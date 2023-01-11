function getRiskClass(document) {
	var dateObj = new Date();
	var month = dateObj.getUTCMonth() + 1; //months from 1-12
	var day = dateObj.getUTCDate();
	var year = dateObj.getUTCFullYear();
	var todayDate = year + "-" + month + "-" + day;

	var storage = window.localStorage;

// Evaluate Residency & Citizenship
	var citizenship = storage.getItem('citizenship');

	if (citizenship == 'Yes') {
			citizenship_risk_class = 'nt1';
	}

// Evaluate Driving Record
	var driving_drunk_dui = storage.getItem('driving_drunk_dui'),
			driving_reckless = storage.getItem('driving_reckless'),
			driving_license_suspension = storage.getItem('driving_license_suspension'),
			driving_moving_violations = storage.getItem('driving_moving_violations'),
			driving_violations_last_6mo = storage.getItem('driving_violations_last_6mo'),
			driving_violations_last_year = storage.getItem('driving_violations_last_year'),
			driving_violations_last_2years = storage.getItem('driving_violations_last_2years'),
			driving_violations_last_3years = storage.getItem('driving_violations_last_3years'),
			driving_violations_last_5years = storage.getItem('driving_violations_last_5years'),
			last_dui_date = storage.getItem('driving_last_dui_year')+"-"+storage.getItem('driving_last_dui_month')+"-01",
			last_reckless_date = storage.getItem('driving_last_reckless_year')+"-"+storage.getItem('driving_last_reckless_month')+"-01",
			last_suspension_date = storage.getItem('driving_last_suspension_year')+"-"+storage.getItem('driving_last_suspension_month')+"-01",
			years_since_dui = 99,
			years_since_reckless = 99,
			years_since_suspension = 99,
			total_violations_in_past_3_years = 0;

	if (driving_drunk_dui == 'Yes') {years_since_dui = dateDiff(last_dui_date, todayDate);}
	if (driving_reckless == 'Yes') {years_since_reckless = dateDiff(last_reckless_date, todayDate);}
	if (driving_license_suspension == 'Yes') {years_since_suspension = dateDiff(last_suspension_date, todayDate);}
	if (driving_moving_violations == 'Yes') {total_violations_in_past_3_years = Number(driving_violations_last_6mo) + Number(driving_violations_last_year) + Number(driving_violations_last_2years) + Number(driving_violations_last_3years);}

	console.log("years_since_dui="+years_since_dui);
	console.log("years_since_reckless="+years_since_reckless);
	console.log("years_since_suspension="+years_since_suspension);
	console.log("total_violations_in_past_3_years="+total_violations_in_past_3_years);

	var driving_risk_class = 'refer';
	switch(true) {
		case (years_since_dui > 5 && years_since_reckless > 5 && years_since_suspension > 5 && total_violations_in_past_3_years < 3):
			driving_risk_class = "nt1";
			break;
		case (years_since_dui > 3 && years_since_reckless > 3 && years_since_suspension > 3 && total_violations_in_past_3_years < 4):
			driving_risk_class = "nt3";
			break;
		case (years_since_dui > 2 && years_since_reckless > 2 && years_since_suspension > 2 && total_violations_in_past_3_years < 5):
			driving_risk_class = "nt4";
			break;
		default:
			driving_risk_class = 'refer';
			break;
	}
	console.log("driving_risk_class="+driving_risk_class);

// Evaluate Tobacco Use
	var tobacco = storage.getItem('tobacco'),
			tobacco_cigarettes = storage.getItem('tobacco_cigarettes'),
			tobacco_cigars = storage.getItem('tobacco_cigars'),
			tobacco_cigars_per_month = storage.getItem('tobacco_cigars_per_month'),
			tobacco_pipe = storage.getItem('tobacco_pipe'),
			tobacco_chew = storage.getItem('tobacco_chew'),
			tobacco_patch = storage.getItem('tobacco_patch'),

			last_cigarette_date = storage.getItem('tobacco_cigarette_last_smoke_year')+"-"+storage.getItem('tobacco_cigarette_last_smoke_month')+"-01",
			last_cigar_date = storage.getItem('tobacco_cigar_last_smoke_year')+"-"+storage.getItem('tobacco_cigar_last_smoke_month')+"-01",
			last_pipe_date = storage.getItem('tobacco_pipe_last_smoke_year')+"-"+storage.getItem('tobacco_pipe_last_smoke_month')+"-01",
			last_chew_date = storage.getItem('tobacco_chew_last_use_year')+"-"+storage.getItem('tobacco_chew_last_use_month')+"-01",
			last_patch_date = storage.getItem('tobacco_patch_last_use_year')+"-"+storage.getItem('tobacco_patch_last_use_month')+"-01";

	var years_since_last_tobacco_use = 99,
			years_since_last_cigarette = 99,
			years_since_last_cigar = 99,
			years_since_last_pipe = 99,
			years_since_last_chew = 99,
			years_since_last_patch = 99;

	if (tobacco_cigarettes == 'Yes') {years_since_last_cigarette = dateDiff(last_cigarette_date, todayDate);}
	if (tobacco_cigars == 'Yes') {years_since_last_cigar = dateDiff(last_cigar_date, todayDate);}
	if (tobacco_pipe == 'Yes') {years_since_last_pipe = dateDiff(last_pipe_date, todayDate);}
	if (tobacco_chew == 'Yes') {years_since_last_chew = dateDiff(last_chew_date, todayDate);}
	if (tobacco_patch == 'Yes') {years_since_last_patch = dateDiff(last_patch_date, todayDate);}

  if (tobacco == 'No') {
		tobacco_risk_class = 'nt1';
	}

  if (tobacco == 'Yes') {
			console.log("years_since_last_cigarette="+years_since_last_cigarette);
			console.log("years_since_last_cigar="+years_since_last_cigar);
			console.log("cigars_per_month="+tobacco_cigars_per_month);
			console.log("years_since_last_pipe="+years_since_last_pipe);
			console.log("years_since_last_chew="+years_since_last_chew);
			console.log("years_since_last_patch="+years_since_last_patch);

			if (tobacco_cigars == 'Yes' && tobacco_cigars_per_month > 1) {
					years_since_last_tobacco_use = Math.min(years_since_last_cigarette, years_since_last_cigar, years_since_last_pipe, years_since_last_chew, years_since_last_patch);
			} else {
					years_since_last_tobacco_use = Math.min(years_since_last_cigarette, years_since_last_pipe, years_since_last_chew, years_since_last_patch);
			}
			console.log("Years Since Last Tobacco Use="+years_since_last_tobacco_use);

			var tobacco_risk_class = 'refer';
			switch(true) {
				case (years_since_last_tobacco_use > 5):
					tobacco_risk_class = "nt1";
					tobacco = 'No';
					break;
				case (years_since_last_tobacco_use > 3):
					tobacco_risk_class = "nt2";
					tobacco = 'No';
					break;
				case (years_since_last_tobacco_use > 2):
					tobacco_risk_class = "nt3";
					tobacco = 'No';
					break;
				case (years_since_last_tobacco_use > 1):
					tobacco_risk_class = "nt4";
					tobacco = 'No';
					break;
				default:
					tobacco_risk_class = "smoke1";
					tobacco = 'Yes';
					break;
			}
	}

// Evaluate Body Mass Index (BMI)
	var	height_ft = storage.getItem('height_feet'),
			height_in = storage.getItem('height_inches'),
			weight = storage.getItem('weight');

	var height_total_inches = Number(height_ft * 12) + Number(height_in),
//		bmi = Math.round(((weight/height_total_inches)/height_total_inches)*703),
			bmi = ((weight/height_total_inches)/height_total_inches)*703,
      bmi_risk_class = 'refer';

  if (tobacco == 'No') {
      if (bmi<=38 && bmi>=18) { 
          bmi_risk_class = 'nt4';
      }
      if (bmi<=32.5 && bmi>=18) { 
          bmi_risk_class = 'nt3';
      }
      if (bmi<=30 && bmi>=18) { 
          bmi_risk_class = 'nt2';
      }
      if (bmi<=28 && bmi>=18) { 
          bmi_risk_class = 'nt1';
      }
  } else {
  if (tobacco == 'Yes') {
      if (bmi<=38 && bmi>=18) { 
          bmi_risk_class = 'smoke2';
      }
      if (bmi<=32.5 && bmi>=18) { 
          bmi_risk_class = 'smoke1';
      }
  }}

// Evaluate Cancer History
	var cancer = storage.getItem('cancer'),
			cancer_type = storage.getItem('cancer_type'),
			orig_cancer_diag = storage.getItem('cancer_diag_year')+"-"+storage.getItem('cancer_diag_month')+"-01",
			cancer_risk_class = 'not rated';

	if(Boolean(cancer)) {
			var years_since_cancer_diag = dateDiff(orig_cancer_diag, todayDate);

			if (cancer_type == 'Basal' || cancer_type == 'Squamous') {
				cancer_risk_class = 'nt1';
			} else {
				cancer_risk_class = 'refer';
			}
	}

// Evaluate Heart Attack History
	var heart_attack = storage.getItem('heart_attack'),
			last_heart_attack = storage.getItem('heart_attack_episode_year')+"-"+storage.getItem('heart_attack_episode_month')+"-01",
			heart_attack_risk_class = 'not rated';

	if(Boolean(heart_attack)) {
			var years_since_heart_attack = dateDiff(last_heart_attack, todayDate);

			if (years_since_heart_attack > 0.5) {
				heart_attack_risk_class = 'nt4';
			} else {
				heart_attack_risk_class = 'refer';
			}
	}

// Evaluate Stroke History
	var stroke = storage.getItem('stroke'),
			last_stroke = storage.getItem('stroke_episode_month')+"-"+storage.getItem('stroke_episode_month')+"-01",
			stroke_risk_class = 'not rated';

	if (Boolean(stroke)) {
			var years_since_stroke = dateDiff(last_stroke, todayDate);

			if (years_since_stroke > 1) {
				stroke_risk_class = 'nt4';
			} else {
				stroke_risk_class = 'refer';
			}
	}

// Evaluate Diabetes History
	var diabetes = storage.getItem('diabetes'),
			diabetes_type = storage.getItem('diabetes_type'),
			diabetes_risk_class = 'not rated';

	if (Boolean(diabetes)) {
			if (diabetes_type == 'Type-2') {
				diabetes_risk_class = 'nt3';
			} else {
				diabetes_risk_class = 'refer';
			}
	} 

// Evaluate Depression History
	var depression = storage.getItem('depression'),
			depression_diagnosis = storage.getItem('depression_diagnosis'),
			orig_depression_diag = storage.getItem('depression_diag_year')+"-"+storage.getItem('depression_diag_month')+"-01",
			depression_treatment = storage.getItem('depression_treatment'),
			depression_meds = storage.getItem('depression_medications'),
			depression_hospitalization = storage.getItem('depression_hospitalization'),
			depression_risk_class = 'not rated';

	if (Boolean(depression)) {
			years_since_depression_diag = dateDiff(orig_depression_diag, todayDate);

			if (depression_treatment == 'Yes') {
					if (typeof depression_meds === 'undefined') {
						depression_meds = 0;
					} else {
						depression_meds = Number(depression_meds);
					}
			} else {
				depression_meds = 0;
			}

			if (depression_diagnosis != "Severe" && years_since_depression_diag > 1 && depression_hospitalization == 'No') {
					switch(true) {
						case (depression_meds == 0):
							depression_risk_class = 'nt1';
							break;
						case (depression_meds == 1):
							depression_risk_class = 'nt2';
							break;
						case (depression_meds == 2):
							depression_risk_class = 'nt3';
							break;
						default:
							depression_risk_class = 'refer';
							break;
					}
			}
	}

// Evaluate Asthma History
	var asthma = storage.getItem('asthma'),
			asthma_diagnosis = storage.getItem('asthma_diagnosis'),
			orig_asthma_diag = storage.getItem('asthma_diag_year')+"-"+storage.getItem('asthma_diag_month')+"-01",
			asthma_treatment_current = storage.getItem('asthma_treatment_current'),
			inhaled_bronchodilators = storage.getItem('inhaled_bronchodilators'),
			inhaled_corticosteroids = storage.getItem('inhaled_corticosteroids'),
			asthma_hospitalization = storage.getItem('asthma_hospitalization'),
			asthma_risk_class = 'not rated';

	if (Boolean(asthma)) {
			years_since_asthma_diag = dateDiff(orig_asthma_diag, todayDate);
		
			switch(true) {
				case (asthma_diagnosis == "Mild" && asthma_hospitalization == 'No' && !inhaled_bronchodilators && !inhaled_corticosteroids):
					asthma_risk_class = 'nt1';
					break;
				case (asthma_hospitalization == 'No' && asthma_treatment_current && (inhaled_bronchodilators || inhaled_corticosteroids) && tobacco == 'No'):
					asthma_risk_class = 'nt2';
					break;
				default:
					asthma_risk_class = 'refer';
					break;
			}
	}

// Evaluate Sleep Apnea History
	var sleep_apnea = storage.getItem('sleep_apnea'),
			sleep_apnea_diagnosis = storage.getItem('sleep_apnea_diagnosis'),
			orig_sleep_apnea_diag = storage.getItem('sleep_apnea_diag_year')+"-"+storage.getItem('sleep_apnea_diag_month')+"-01",
			sleep_apnea_cpap = storage.getItem('sleep_apnea_cpap'),
			sleep_apnea_sleep_study = storage.getItem('sleep_apnea_sleep_study'),
			sleep_apnea_apnea_index = storage.getItem('sleep_apnea_apnea_index'),
			sleep_apnea_rdi = storage.getItem('sleep_apnea_respiratory_disturbance_index'),
			sleep_apnea_oxygen_saturation = storage.getItem('sleep_apnea_oxygen_saturation'),
			sleep_apnea_risk_class = 'not rated';

	if (Boolean(sleep_apnea)) {
			years_since_sleep_apnea_diag = dateDiff(orig_sleep_apnea_diag, todayDate);
			console.log("years_since_sleep_apnea_diag="+years_since_sleep_apnea_diag);
	
			if (sleep_apnea_sleep_study == 'Yes') {
					if (typeof sleep_apnea_apnea_index === 'undefined') {
						sleep_apnea_apnea_index = 99;
					} else {
						sleep_apnea_apnea_index = Number(sleep_apnea_apnea_index);
					}
					if (typeof sleep_apnea_rdi === 'undefined') {
						sleep_apnea_rdi = 99;
					} else {
						sleep_apnea_rdi = Number(sleep_apnea_rdi);
					}
					if (typeof sleep_apnea_oxygen_saturation === 'undefined') {
						sleep_apnea_oxygen_saturation = 0;
					} else {
						sleep_apnea_oxygen_saturation = Number(sleep_apnea_oxygen_saturation);
					}
			}
			console.log("sleep_apnea_sleep_study="+sleep_apnea_sleep_study);
			console.log("sleep_apnea_apnea_index="+sleep_apnea_apnea_index);
			console.log("sleep_apnea_rdi="+sleep_apnea_rdi);
			console.log("sleep_apnea_oxygen_saturation="+sleep_apnea_oxygen_saturation);

			switch(true) {
				case (sleep_apnea && sleep_apnea_diagnosis == "Mild" && sleep_apnea_sleep_study == "Yes" && (sleep_apnea_apnea_index < 20 || sleep_apnea_rdi < 30) && sleep_apnea_oxygen_saturation > 85):
					sleep_apnea_risk_class = 'nt2';
					break;
				case (sleep_apnea && sleep_apnea_diagnosis != "Mild" && sleep_apnea_cpap == "Yes" && years_since_sleep_apnea_diag > 0):
					sleep_apnea_risk_class = 'nt3';
					break;
				default:
					sleep_apnea_risk_class = 'refer';
					break;
			}
	}


console.log("bmi_risk_class="+bmi_risk_class+"\n"+
						"driving_risk_class="+driving_risk_class+"\n"+
						"years_since_cancer_diag="+years_since_cancer_diag+"\n"+
						"cancer_risk_class="+cancer_risk_class+"\n"+
						"years_since_heart_attack="+years_since_heart_attack+"\n"+
						"heart_attack_risk_class="+heart_attack_risk_class+"\n"+
						"years_since_stroke="+years_since_stroke+"\n"+
						"stroke_risk_class="+stroke_risk_class+"\n"+
						"diabetes_type="+diabetes_type+"\n"+
						"diabetes_risk_class="+diabetes_risk_class+"\n"+
						"depression_risk_class="+depression_risk_class+"\n"+
						"asthma_risk_class="+asthma_risk_class+"\n"+
						"sleep_apnea_risk_class="+sleep_apnea_risk_class);

    return {
        citizenship_risk_class,
				driving_risk_class,
				years_since_last_tobacco_use,
				tobacco_risk_class,
				bmi,
        bmi_risk_class,
				years_since_cancer_diag,
				cancer_risk_class,
				years_since_heart_attack,
				heart_attack_risk_class,
				years_since_stroke,
				stroke_risk_class,
				diabetes_type,
				diabetes_risk_class,
				depression_risk_class,
				asthma_risk_class,
				sleep_apnea_risk_class
    };
} 

