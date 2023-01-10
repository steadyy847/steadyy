function getRiskClass(document) {
	var storage = window.localStorage,
			tobacco = storage.getItem('tobacco'),
			height_ft = storage.getItem('height_feet'),
			height_in = storage.getItem('height_inches'),
			weight = storage.getItem('weight');
// Evaluate Driving Record

// Evaluate Body Mass Index (BMI)
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
			console.log("In the *.js file.  RISK_CLASS="+bmi_risk_class);

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
	var dateObj = new Date();
	var month = dateObj.getUTCMonth() + 1; //months from 1-12
	var day = dateObj.getUTCDate();
	var year = dateObj.getUTCFullYear();
	var todayDate = year + "-" + month + "-" + day;

	var years_since_last_tobacco_use,
			years_since_last_cigarette,
			years_since_last_cigar,
			years_since_last_pipe,
			years_since_last_chew,
			years_since_last_patch;

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
					years_since_last_tobacco_use = Math.max(years_since_last_cigarette, years_since_last_cigar, years_since_last_pipe, years_since_last_chew, years_since_last_patch);
			} else {
					years_since_last_tobacco_use = Math.max(years_since_last_cigarette, years_since_last_pipe, years_since_last_chew, years_since_last_patch);
			}
  			console.log("Years Sinec Last Tobacco Use="+years_since_last_tobacco_use);
	}
// Evaluate Cancer History

// Evaluate Heart Attack History

// Evaluate Stroke History

// Evaluate Diabetes History

// Evaluate Depression History

// Evaluate Asthma History

// Evaluate Sleep Apnea History



    return {
        bmi,
        bmi_risk_class
    };
} 

