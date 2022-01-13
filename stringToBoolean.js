function stringToBoolean(string) {
    switch(string.toLowerCase().trim()){
        case "true": 
        case "yes": 
        case "1": 
          return true;
          break;
            
        case "false": 
        case "no": 
        case "0": 
        case null: 
          return false;
          break;

        default: 
          return Boolean(string);
    }
}
