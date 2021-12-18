function calcRiskClass(smoker, height_ft, height_in, weight) {
    var height_total_inches = Number(height_ft * 12) + Number(height_in),
        bmi = Math.round(((weight/height_total_inches)/height_total_inches)*703),
        risk_class;
    if (smoker == 'No') {
        risk_class = 'nt4';
        if (bmi<34) { 
            risk_class = 'nt3';
        }
        if (bmi<32) { 
            risk_class = 'nt2';
        }
        if (bmi<30) { 
            risk_class = 'nt1';
        }
    } else {
        if (smoker == 'Yes') {
            risk_class = 'smoke2';
            if (bmi<32) { 
                risk_class = 'smoke1';
            }
        }
    }
    return {
        bmi,
        risk_class
    };
}
