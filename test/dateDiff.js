        function dateDiff(startingDate, endingDate) {
            var startDate = new Date(new Date(startingDate).toISOString().substr(0, 10));
            if (!endingDate) {
                endingDate = new Date().toISOString().substr(0, 10);    // need date in YYYY-MM-DD format
            }
            var endDate = new Date(endingDate);
            if (startDate > endDate) {
                var swap = startDate;
                startDate = endDate;
                endDate = swap;
            }
            var startYear = startDate.getFullYear();
            var february = (startYear % 4 === 0 && startYear % 100 !== 0) || startYear % 400 === 0 ? 29 : 28;
            var daysInMonth = [31, february, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

            var yearDiff = endDate.getFullYear() - startYear;
            var monthDiff = endDate.getMonth() - startDate.getMonth();
            if (monthDiff < 0) {
                yearDiff--;
                monthDiff += 12;
            }
            var dayDiff = endDate.getDate() - startDate.getDate();
            if (dayDiff < 0) {
                if (monthDiff > 0) {
                    monthDiff--;
                } else {
                    yearDiff--;
                    monthDiff = 11;
                }
                dayDiff += daysInMonth[startDate.getMonth()];
            }

//            return yearDiff + 'Y ' + monthDiff + 'M ' + dayDiff + 'D';
            return yearDiff + (monthDiff/12) + (dayDiff/365);
        } 

				function submitButtonCheck() {
					var gender_selected = $("input[name='Gender']:checked").val(),
							citizenship_selected = $("input[name='Citizenship']:checked").val(),
							tobacco_selected = $("input[name='Tobacco']:checked").val(),
							license_selected = $("input[name='License']:checked").val(),
							asthma_CB = document.getElementById('asthma').checked,
							depression_CB = document.getElementById('depression').checked,
							heart_attack_CB = document.getElementById('heart_attack').checked,
							stroke_CB = document.getElementById('stroke').checked,
							cancer_CB = document.getElementById('cancer').checked,
							sleep_apnea_CB = document.getElementById('sleep_apnea').checked,
							diabetes_CB = document.getElementById('diabetes').checked,
							no_conditions_CB = document.getElementById('no_conditions').checked;
//storage = window.localStorage,
							
					// Check that all required fields are complete, & if so, enable the submit button
					$submit.toggleClass(className,  $dob_month.val() != '' && /^([\w]{1,2})?$/.test($dob_month.val()) &&
															$dob_day.val() != '' && /^([\w]{1,2})?$/.test($dob_day.val()) &&
															$dob_year.val() != '' && /^([\w]{4,4})?$/.test($dob_year.val()) &&
															$zip.val() != '' && /^([\w]{5,5})?$/.test($zip.val()) &&
															$annual_income.val().length > 5 && $annual_income.val().length < 14 &&
															$height_feet.val() != '' && /^([\w\']{2,2})?$/.test($height_feet.val()) &&
															$height_inches.val() != '' && /^([\w\"]{2,3})?$/.test($height_inches.val()) &&
															$weight.val() != '' && /^([\w]{2,3})?$/.test($weight.val()) &&
															gender_selected != undefined &&
															citizenship_selected != undefined &&
															tobacco_selected != undefined &&
															license_selected != undefined &&
															(asthma_CB || depression_CB || heart_attack_CB || stroke_CB || cancer_CB || sleep_apnea_CB || diabetes_CB || no_conditions_CB)
															);
//					storage.setItem('gender', gender_selected);
				}

