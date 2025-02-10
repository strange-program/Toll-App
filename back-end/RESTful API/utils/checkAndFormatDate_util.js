// takes the a path parameter YYYYMMDD and a time of our choosing hhmm, checks if they are valid and formats them to "YYYYMMDD hh:mm" 
function checkAndFormatDate(yyyymmdd, hhmm) {
    // checks if the date is an 8-digit string and the hour a 4-digit string
    if (!/^\d{8}$/.test(yyyymmdd) || !/^\d{4}$/.test(hhmm)) {
        throw new Error("Invalid input format. Expected YYYYMMDD and hhmm.");
    }
  
    const year = yyyymmdd.substring(0, 4);
    const month = yyyymmdd.substring(4, 6);
    const day = yyyymmdd.substring(6, 8);
    const hours = hhmm.substring(0, 2);
    const minutes = hhmm.substring(2, 4);
  
    // Create a Date object (Month is 0-based in JavaScript) and check for validity
    const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day), parseInt(hours), parseInt(minutes));
    if (
        date.getFullYear() === parseInt(year) &&
        date.getMonth() === parseInt(month) - 1 &&
        date.getDate() === parseInt(day) &&
        date.getHours() === parseInt(hours) &&
        date.getMinutes() === parseInt(minutes)
    ) {
      return `${year}-${month}-${day} ${hours}:${minutes}`;
    }
    else {
      throw new Error("Invalid input format. Expected YYYYMMDD and hhmm.");
    } 
    
}

module.exports = { checkAndFormatDate };