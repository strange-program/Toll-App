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
- [ ] /api/admin/resetpasses
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
- [ ] /api/paymentsfrequency
