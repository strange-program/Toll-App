#!/usr/bin/env node

/*
 MUST RUN COMMAND npm install
*/

/* MUST ADD THE FOLLOWING LINES IN package.json

"bin": {
    "se2420": "cli.js"
  }

*/

// May also need to run npm link

// Connection with API
const axios = require("axios");
const API_BASE_URL = "http://localhost:9115";


// Date validation
const { parse, isValid } = require("date-fns");
function validateDate(dateStr) {
    if (!/^\d{8}$/.test(dateStr)) return false; // Ensure it's exactly 8 digits
    const parsedDate = parse(dateStr, "yyyyMMdd", new Date());
  return isValid(parsedDate);
}


// Function to format output based on user preference
function formatOutput(format) {
  switch (format) {
    case "json":
      return "json";
    case "csv":
      return "csv";
    default:
      return "csv";
  }
}

// Handle status codes of api calls
function handleStatus(status) {
  switch(status) {
    case 204: 
      console.log("No data available for the given query.");
      break;

    case 400:
      console.log("Error: Bad request. Check your parameters.");
      break;

    case 401:
      console.log("Error: Unauthorized. Check your API key or authentication.");
      break;

    case 500: 
      console.log("Server Error: Something went wrong on the API's side.");
      break;
    
    case 200:
      return true;
  }
  return false;
}


// Commands
const fs = require("fs");
const path = require("path");
const FormData = require('form-data');
const { Command } = require("commander");
const program = new Command();

program
  .name("se2420")
  .version("1.0.0")
  .description("A CLI tool for the tolls app");


// Toll Station passes command
program
  .command("tollstationpasses")
  .description("Returns information of tag traversals through the toll specified by --station during the time period specified by --from and --to")
  .option("--station <station_id>", "Toll station ID")
  .option("--from <start_date>", "Start date (YYYYMMDD)")
  .option("--to <end_date>", "End date (YYYYMMDD)")
  .option("--format <format>", "Output format (json, csv)", "text")
  .action(async(options) => {
    
    // Check validity of input
    if (!options.station || !options.from || !options.to) {
      console.log("Error: --station, --from, and --to are required parameters:\n --station: ID of the the toll station\n --from: start date of search\n --to: end date of search");
      return;
    }

    if (!validateDate(options.from)) {
      console.log("Error: Invalid date format used in parameter --from. Use YYYYMMDD.");
    }

    if (!validateDate(options.to)) {
      console.log("Error: Invalid date format used in parameter --to. Use YYYYMMDD.");
      return;
    }
    
    // Perform API call

    if (!fs.existsSync(path.join(__dirname, "token.txt"))) {
      console.log("No user is currently logged in.");
      return;
    }

    const format = formatOutput(options.format);
    const token = fs.readFileSync(path.join(__dirname, "token.txt"), "utf-8");
    
    try {
      axios.defaults.headers.common["X-OBSERVATORY-AUTH"] = token;
      const response = await axios.get(API_BASE_URL + "/api/tollStationPasses/" + options.station + "/" + options.from + "/" + options.to + "?format=" + format);

      // Check for error status codes
      if (!handleStatus(response.status)) return;

      const data = response.data;
      console.log(data);

  } catch (error) {
    console.error("Error fetching data:", error.response ? error.response.data : error.message);
  }

});


// PassAnalysis command
program
  .command("passanalysis")
  .description("Get a list of all the traversal events of cars with tag ID that belong to --tagop in tolls that belong to --stationop during the time period specified with --from and --to")
  .option("--stationop <station_id>", "Toll station operator ID")
  .option("--tagop <tag_id>", "Tag operator ID")
  .option("--from <start_date>", "Start date (YYYYMMDD)")
  .option("--to <end_date>", "End date (YYYYMMDD)")
  .option("--format <format>", "Output format (json, csv)", "text")
  .action(async(options) => {
    
    // Check validity of input    
    if (!options.stationop || !options.tagop || !options.from || !options.to) {
      console.log("Error: --stationop, --tagop, --from, and --to are required parameters:\n --stationop: ID of the operator the toll station\n --tagop: ID of the operator of the tag\n --from: start date of search\n --to: end date of search");
      return;
    }

    if (!validateDate(options.from)) {
      console.log("Error: Invalid date format used in parameter --from. Use YYYYMMDD.");
    }

    if (!validateDate(options.to)) {
      console.log("Error: Invalid date format used in parameter --to. Use YYYYMMDD.");
      return;
    }

    // Perform API call

    if (!fs.existsSync(path.join(__dirname, "token.txt"))) {
      console.log("No user is currently logged in.");
      return;
    }

    const format = formatOutput(options.format);
    const token = fs.readFileSync(path.join(__dirname, "token.txt"), "utf-8");

    try {
      axios.defaults.headers.common["X-OBSERVATORY-AUTH"] = token;
      const response = await axios.get(
        API_BASE_URL + "/api/passAnalysis/" + options.stationop + "/" + options.tagop + "/" + options.from + "/" + options.to + "?format=" + format);

      // Check for error status codes
      if (!handleStatus(response.status)) return;

      const data = response.data;
      console.log(data);
    
  } catch (error) {
    console.error("Error fetching data:", error.response ? error.response.data : error.message);
  }

});


// PassesCost command
program
  .command("passescost")
  .description("Returns the total number of cars with tags that belong to --tagop that passed through toll stations that belong to --stationop in a given period. Also includes the total cost of all the passes.")
  .option("--stationop <station_id>", "Toll station operator ID")
  .option("--tagop <tag_id>", "Tag operator ID")
  .option("--from <start_date>", "Start date (YYYYMMDD)")
  .option("--to <end_date>", "End date (YYYYMMDD)")
  .option("--format <format>", "Output format (json, csv)", "text")
  .action(async(options) => {
    
    // Check validity of input
    if (!options.stationop || !options.tagop || !options.from || !options.to) {
      console.log("Error: --stationop, --tagop, --from, and --to are required parameters:\n --stationop: ID of the operator of the toll station\n --tagop: ID of the operator of the tag\n --from: start date of search\n --to: end date of search");
      return;
    }

    if (!validateDate(options.from)) {
      console.log("Error: Invalid date format used in parameter --from. Use YYYYMMDD.");
    }

    if (!validateDate(options.to)) {
      console.log("Error: Invalid date format used in parameter --to. Use YYYYMMDD.");
      return;
    }

    // Perform API call

    if (!fs.existsSync(path.join(__dirname, "token.txt"))) {
      console.log("No user is currently logged in.");
      return;
    }

    const format = formatOutput(options.format);
    const token = fs.readFileSync(path.join(__dirname, "token.txt"), "utf-8");

    try {
      axios.defaults.headers.common["X-OBSERVATORY-AUTH"] = token;
      const response = await axios.get(API_BASE_URL + "/api/passesCost/" + options.stationop + "/" + options.tagop + "/" + options.from + "/" + options.to + "?format=" + format)

      // Check for error status codes
      if (!handleStatus(response.status)) return;

      const data = response.data;
      console.log(data);
    
    } catch (error) {
      console.error("Error fetching data:", error.response ? error.response.data : error.message);
  }

  });


// ChargesBy command
program
  .command("chargesby")
  .description("Return the owes of other companies towards the company specified by --opid")
  .option("--opid <operator_id>", "Operator ID")
  .option("--from <start_date>", "Start date (YYYYMMDD)")
  .option("--to <end_date>", "End date (YYYYMMDD)")
  .option("--format <format>", "Output format (json, csv)", "text")
  .action(async(options) => {

    // Check validity of input
    if (!options.opid || !options.from || !options.to) {
      console.log("Error: --opid, --from, and --to are required parameters:\n --opid: ID of the the operator\n --from: start date of search\n --to: end date of search");
      return;
    }
    
    if (!validateDate(options.from)) {
      console.log("Error: Invalid date format used in parameter --from. Use YYYYMMDD.");
    }

    if (!validateDate(options.to)) {
      console.log("Error: Invalid date format used in parameter --to. Use YYYYMMDD.");
      return;
    }

    if (!fs.existsSync(path.join(__dirname, "token.txt"))) {
      console.log("No user is currently logged in.");
      return;
    }

    const format = formatOutput(options.format);
    const token = fs.readFileSync(path.join(__dirname, "token.txt"), "utf-8");

    // Perform API call
    try {

      axios.defaults.headers.common["X-OBSERVATORY-AUTH"] = token;
      const response = await axios.get(API_BASE_URL + "/api/chargesBy/"+ options.opid + "/" + options.from + "/" + options.to + "?format=" + format);

      // Check for error status codes
      if (!handleStatus(response.status)) return;

      const data = response.data;
      console.log(data);
    
  } catch (error) {
    console.error("Error fetching data:", error.response ? error.response.data : error.message);
  }

});


// Healthcheck command
program
  .command("healthcheck")
  .description("Check end-to-end connectivity with the database")
  .action(async(options) => {
    if (!fs.existsSync(path.join(__dirname, "token.txt"))) {
      console.log("No user is currently logged in.");
      return;
    }

    const token = fs.readFileSync(path.join(__dirname, "token.txt"), "utf-8");
    
    // Perform API call
    try {
      axios.defaults.headers.common["X-OBSERVATORY-AUTH"] = token;
      const response = await axios.post(API_BASE_URL + "/api/admin/healthcheck");

      // Check for error status codes
      switch(response.status) {
        case 401:
          console.log("Healthcheck: Database connection failed");
          break;
        case 200:
          console.log("Healthcheck: Connection is OK");
          break;
        default:
          console.log("Healtchcheck: Unknown error occured");
          return;
      }

      const data = response.data;
      console.log(data);
    
  } catch (error) {
    console.error("Error fetching data:", error.response ? error.response.data : error.message);
  }

});


// Resetstations command
program
  .command("resetstations")
  .description("Reset toll station information")
  .action(async(options) => {
    if (!fs.existsSync(path.join(__dirname, "token.txt"))) {
      console.log("No user is currently logged in.");
      return;
    }

    const token = fs.readFileSync(path.join(__dirname, "token.txt"), "utf-8");

    try {
      axios.defaults.headers.common["X-OBSERVATORY-AUTH"] = token;
      const response = await axios.post(API_BASE_URL + "/api/admin/resetstations");
  
      const data = response.data;
      console.log(data);
      
    } catch (error) {
      console.error("Error fetching data:", error.response ? error.response.data : error.message);
    }

});


// Resetpasses command
program
  .command("resetpasses")
  .description("Reset passes data")
  .action(async(options) => {
    if (!fs.existsSync(path.join(__dirname, "token.txt"))) {
      console.log("No user is currently logged in.");
      return;
    }

    const token = fs.readFileSync(path.join(__dirname, "token.txt"), "utf-8");

    try {
      axios.defaults.headers.common["X-OBSERVATORY-AUTH"] = token;
      const response = await axios.post(API_BASE_URL + "/api/admin/resetpasses");
  
      const data = response.data;
      console.log(data);
      
    } catch (error) {
      console.error("Error:", error.response ? error.response.data : error.message);
    }
});


// Admin command
program 
  .command("admin")
  .description("Perform administrator activities based on the parameters. The --addpasses parameter inports new passes on the database, based on the info of the csv given in --source parameter. The --usermod parameter creates new user with info given by parameters --username and --passw. Lastly, with the --users param it returns a list of all users")
  .option("--addpasses","Add passes to the database using the csv file give at --source")
  .option("--source <source_csv>","Source file (csv type) that contains the new passes to be added to the database")
  .option("--usermod","Add new users or change password of existing user")
  .option("--username <usr>","Username to create/modify")
  .option("--passw <passw>","Password of user")
  .option("--users","Request all the usernames in the Database")
  .action(async(options) => {

    if (!fs.existsSync(path.join(__dirname, "token.txt"))) {
      console.log("No user is currently logged in.");
      return;
    }
    const token = fs.readFileSync(path.join(__dirname, "token.txt"), "utf-8");

    if (options.addpasses) {
      if (!options.source) {
        console.log("Error: --source is a required parameter:\n --source: name of the file containing passes");
        return;
      }
        
      try {
        // Ensure the file exists
        if (!fs.existsSync(options.source)) {
          console.error('Error: File does not exist.');
          return;
        }
    
        // Create FormData object
        const formData = new FormData();
        formData.append('file', fs.createReadStream(options.source), path.basename(options.source));
    
        // Get headers for multipart/form-data
        const headers = {
          ...formData.getHeaders(),
            //'X-OBSERVATORY-AUTH': 'your-auth-token', // Replace with actual auth token
        };

        // Send request
        axios.defaults.headers.common["X-OBSERVATORY-AUTH"] = token;
        const response = await axios.post(API_BASE_URL + "/api/admin/addpasses", 
          formData,
          { headers });
    
        console.log('Upload successful:', response.data);
      } catch (error) {
        console.error('Error uploading file:', error.response?.data || error.message);
      }

    }
    else if (options.usermod) {
      if (!options.username || !options.passw) {
        console.log("Error: --username and --passw are required parameters:\n --username: username to insert/modify\n --passw: user password");
        return;
      }

      try {
        axios.defaults.headers.common["X-OBSERVATORY-AUTH"] = token;
        const response = await axios.post(API_BASE_URL + "/api/admin/register", {
          username: options.username,
          password: options.passw,
        });

        console.log(response.data);

      } catch (error) {
        console.error("Error creating user:", error.response?.data || error.message);
      }

    }
    else if (options.users) {
      try {
        axios.defaults.headers.common["X-OBSERVATORY-AUTH"] = token;
        const response = await axios.get(API_BASE_URL + "/api/admin/getUsers");
        console.log(response.data);

      } catch (error) {
        console.error("Error fetchig users:", error.response?.data || error.message);
      }
    }
    else {
      console.log("Error: Use parameter --usermod to add/modify users or --addpasses to add toll info");
      return;
    }

});


// Login command
program
  .command("login")
  .description("Log in the app as a user")
  .option("--username <usr>","Username used to log in")
  .option("--passw <passw>","Password of user")
  .action(async(options) => {
    try {
      const response = await axios.post(API_BASE_URL + "/api/login", {
        username: options.username,
        password: options.passw,
      });
  
      const token = response.data.token;
      fs.writeFileSync(path.join(__dirname, "token.txt"), token);
      console.log("Login successful. Token saved.");
    } catch (error) {
      console.error("Login failed:", error.response?.data || error.message);
    }
  
  });


// Logout command
program 
  .command("logout")
  .description("Logout from the app")
  .action(async(options) => {
    try {
      
      if (!fs.existsSync(path.join(__dirname, "token.txt"))) {
        console.log("No user is currently logged in.");
        return;
      }

      const token = fs.readFileSync(path.join(__dirname, "token.txt"), "utf-8");

      const response = await axios.post(
        API_BASE_URL + "/api/logout",
        {}, // Empty body for logout
        {
        headers: {
          "X-OBSERVATORY-AUTH": token, // Send token as required
        },
      });
      fs.unlinkSync(path.join(__dirname, "token.txt"));
      console.log("Logged out successfully:");

    } catch (error) {
      console.error("Error fetching passes cost:", error.response?.data || error.message);
    }
  });

// Parse CLI arguments
program.parse(process.argv);