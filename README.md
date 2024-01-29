# TrafficFlow

A small Nodejs server and simple API for UK traffic flow data

## How to use the API:

### Get all regions

/api/regions

### Get a region and its associated local authorities

/api/regions/:id

### Get all local authorities

/api/localAuthorities

### Get a local authority and its associated count points

/api/localAuthorities/:id

### Get all count points ( not recommended > 20MB )

/api/countPoints

### Get a count point and its associated measurements

/api/countPoints/:id

### Get a list of measurements

/api/measurements?ids=8,9

### Get a measurement

/api/measurements/:id
