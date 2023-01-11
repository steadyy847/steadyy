function getRiskClass(document) {
	var storage = window.localStorage,
			tobacco = storage.getItem('tobacco'),
			height_ft = storage.getItem('height_ft'),
			height_in = storage.getItem('height_in');

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
  }

// Evaluate Tobacco Use
	var tobacco = storage.getItem('tobacco'),
			last_cigarette_date = storage.getItem('tobacco_cigarettes_last_smoke_year')+"-"+storage.getItem('tobacco_cigarettes_last_smoke_month')+"01",
			last_cigar_date = storage.getItem('tobacco_cigar_last_smoke_year')+"-"+storage.getItem('tobacco_cigar_last_smoke_month')+"01",
			last_pipe_date = storage.getItem('tobacco_pipe_last_smoke_year')+"-"+storage.getItem('tobacco_pipe_last_smoke_month')+"01",
			last_chew_date = storage.getItem('tobacco_chew_last_use_year')+"-"+storage.getItem('tobacco_chew_last_use_month')+"01",
			last_patch_date = storage.getItem('tobacco_patch_last_use_year')+"-"+storage.getItem('tobacco_patch_last_use_month')+"01";
	var dateObj = new Date();
	var month = dateObj.getUTCMonth() + 1; //months from 1-12
	var day = dateObj.getUTCDate();
	var year = dateObj.getUTCFullYear();
	var = todayDate = year + "-" + month + "-" + day;
	var time_since_last_cigarette = dateDiff(last_cigarette_date, todayDate),
			time_since_last_cigar = dateDiff(last_cigar_date, todayDate),
			time_since_last_pipe = dateDiff(last_pipe_date, todayDate),
			time_since_last_chew = dateDiff(last_chew_date, todayDate),
			time_since_last_patch = dateDiff(last_patch_date, todayDate);

  if (tobacco == 'Yes') {
			console.log("time_since_last_cigarette="+time_since_last_cigarette);
			console.log("time_since_last_cigar="+time_since_last_cigar);
			console.log("time_since_last_pipe="+time_since_last_pipe);
			console.log("time_since_last_chew="+time_since_last_chew);
			console.log("time_since_last_patch="+time_since_last_patch);
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
