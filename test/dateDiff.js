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
                alert("Inside the DateDiff function");
            return yearDiff + (monthDiff/12) + (dayDiff/365);
        }

        function calcRiskClass() {
//            var storage = window.localStorage,
//                height_feet = document.getElementById("height_feet").value,
//                height_inches = document.getElementById("height_inches").value,
//                height_total_inches = (height_feet*12)+height_inches,
//                weight = document.getElementById("weight").value,
//                tobacco_selected = $("input[name='Tobacco']:checked").val(),
//                bmi = Math.round(((weight/height_total_inches)/height_total_inches)*703),
                var bmi,
                risk_class;

            alert("BMI="+bmi);

//            if (tobacco_selected = false) {
//                risk_class = 'nt4';
//                if (bmi<34) { 
//                    risk_class = 'nt3';
//                }
//                if (bmi<32) { 
//                    risk_class = 'nt2';
//                }
//                if (bmi<30) { 
//                    risk_class = 'nt1';
//                }
//            } else {
//                if (tobacco_selected = true) {
//                    risk_class = 'smoke2';
//                    if (bmi<32) { 
//                        risk_class = 'smoke1';
//                    }
//                }
//            }
//            alert("Risk Class="+risk_class);
//            storage.setItem('risk_class', risk_class);
        }
