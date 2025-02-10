# API Endpoints Checklist

This document serves as a checklist for API endpoint implementation and testing.

## Endpoints

### Info Endpoints
- [X] /api/tollStations
- [X] /api/tollStationPasses
- [X] /api/passes
- [X] /api/tollStationPasses/:tollStationID/:date_from/:date_to
- [X] /api/passAnalysis/:stationOpID/:tagOpID/:date_from/:date_to
- [X] /api/passesCost/:tollOpID/:tagOpID/:date_from/:date_to
- [X] /api/chargesBy/:tollOpID/:date_from/:date_to

### Admin Endpoints
- [X] /api/admin/healthcheck
- [X] /api/admin/resetstations
- [X] /api/admin/resetpasses
- [X] /api/admin/addpasses
- [X] /api/admin/register

### Auth Endpoints
- [X] /api/login
- [X] /api/logout
      
### Diagram Endpoints
- [X] /api/getDiagram1
- [X] /api/getDiagram2

### Payment Endpoints
- [X] /api/postPayment
- [X] /api/getAmountsDue

# Quickstart Guide
- Copy all the folders over to your workspace
- Run "npm install" on the vscode terminal to install all the dependecies present in the package.json
- Run "npm run start" on the vscode terminal to start the API :)

# How to add an endpoint
- In server.js and under the //Import route files add the line: `const {endpointName}Routes = require('./routes/{endpointName}Routes');`
- In server.js and under the //Define routes add the line: `app.use('/api/{endpointName}', {endpointName}Routes);`

  
- In the routes folder add a file named "{endpointName}Routes.js" and paste inside the following:
```javascript
    const express = require('express');
    const { {endpointName} } = require('../controllers/{endpointName}Controller');
    const router = express.Router();

    router.get('/{your_path_parameters}', {endpointName});
    module.exports = router;
```


- In the controllers folder add a file named "{endpointName}Controller.js and paste inside the following:
```javascript
    const Pass = require('../models/passModel');
    ... (add any utils needed)

    const {endpointName} = async (req, res) => {
        ...
    };

    module.exports = { {endpointName} };
    
```
and fill the function accordingly.

where {endpointName} the name or service of our endpoint

