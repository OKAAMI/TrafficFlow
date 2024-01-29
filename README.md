# TrafficFlow
A small Nodejs server and simple API for UK traffic flow data

## How to use the API:

### Get all regions
/regions
### Get a region and its associated local authorities
/regions/:id

### Get all local authorities
/localAuthorities
### Get a local authority and its associated count points
/localAuthorities/:id

### Get all count points ( not recommended > 20MB ) 
/countPoints
### Get a count point and its associated measurements
/countPoints/:id

### Get a list of measurements
/measurements?ids=8,9
### Get a measurement
/measurements/:id


