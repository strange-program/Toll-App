# API Endpoints Checklist

This document serves as a checklist for API endpoint implementation and testing.

## Endpoints

### Info Endpoints
- [X] /api/tollStations
- [X] /api/tollStationPasses
- [X] /api/passes
- [X] /api/tollStationPasses/:tollStationID/:date_from/:date_to
- [ ] /api/passAnalysis/:stationOpID/:tagOpID/:date_from/:date_to
- [ ] /api/passesCost/:tollOpID/:tagOpID/:date_from/:date_to
- [ ] /api/chargesBy/:tollOpID/:date_from/:date_to

### Admin Endpoints
- [X] /api/admin/healthcheck
- [ ] /api/admin/resetstations
- [ ] /api/admin/resetpasses
- [ ] /api/admin/addpasses

### Auth Endpoints
- [ ] /api/login
- [ ] /api/logout
      
### Diagram Endpoints
- [ ] /api/getDiagram1
- [ ] /api/getDiagram2

### Payment Endpoints
- [ ] /api/postPayment
- [ ] /api/getAmountsDue
- [ ] /api/paymentsfrequency
