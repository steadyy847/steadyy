function getRiskClass(document) {
	var dateObj = new Date();
	var month = dateObj.getUTCMonth() + 1; //months from 1-12
	var day = dateObj.getUTCDate();
	var year = dateObj.getUTCFullYear();
	var todayDate = year + "-" + month + "-" + day;

	var storage = window.localStorage;

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
	if (driving_moving_violations == 'Yes') {total_violations_in_past_3_years = driving_violations_last_6mo + driving_violations_last_year + driving_violations_last_2years + driving_violations_last_3years;}

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
			console.log("tobacco_risk_class="+tobacco_risk_class);
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

// Evaluate Heart Attack History

// Evaluate Stroke History

// Evaluate Diabetes History

// Evaluate Depression History

// Evaluate Asthma History

// Evaluate Sleep Apnea History



    return {
        bmi,
        bmi_risk_class,
				years_since_last_tobacco_use,
				tobacco_risk_class,
				driving_risk_class
    };
} 
