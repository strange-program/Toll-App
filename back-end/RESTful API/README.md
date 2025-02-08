# API Endpoints Checklist

This document serves as a checklist for API endpoint implementation and testing.

## Endpoints

### Info Endpoints
- [X] /tollStations
- [X] /tollStationPasses
- [X] /tollStationPasses/:tollStationID/:date_from/:date_to
- [ ] /passAnalysis/:stationOpID/:tagOpID/:date_from/:date_to
- [ ] /passesCost/:tollOpID/:tagOpID/:date_from/:date_to
- [ ] /chargesBy/:tollOpID/:date_from/:date_to

### Admin Endpoints
- [X] /admin/healthcheck
- [ ] /admin/resetstations
- [ ] /admin/resetpasses
- [ ] /admin/addpasses

### Auth Endpoints
- [ ] /login
- [ ] /logout
      
