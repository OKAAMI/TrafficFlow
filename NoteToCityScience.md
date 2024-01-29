# Dear CityScience

These is my notes on how I approached this backend dev task and some additional thoughts.

### First I started with understanding the task.

- To build an API with traffic volume data from the DfT 'Road level Annual Average Daily Flow (AADF) estimates - Data by direction'
- Deploy the API server on a host so that it can be used externally
- Use JavaScript & PostgreSQL ( if needed, is it? )
- Make code available

### Analysed the the data:

- The dataset has over a million entries.
- It is large, 295 MB.
- Each row represents a measurement
- The same count point ( the spot the measurement was taken) can have more than one entry, with measurements taken in different years.

## CountPoint

- id ( #int )
- region ( #Location )
- local_authority ( #Location )
- road ( #Road )
- position ( #Position )
- length ( #Length )
- measurements ( #Array of #Measurement )

## Location

{ id ( #int ), name ( #string ), ons_code ( #string )}

## Road

{ name, type, category, start_junction, end_junction } (( #string ), all but type & category is optional)

## Position

{ latitude ( #float ), longitude ( #float ), easting ( #int ), northing ( #int )}

## LinkLength

{ km ( #float ), miles ( #float )}

## Measurement

- id ( #int )
- countPointId ( #int )
- year ( #int )
- data ( #FlowData )
- direction_of_travel ( #string - N, E, S, W, C )
- estimation_method { summary ( #string - 'Estimated', 'Counted') , detailed ( #string ) }

## FlowData

- Pedal_cycles ( #int )
- Two_wheeled_motor_vehicles ( #int )
- Cars_and_taxis ( #int )
- Buses_and_coaches ( #int )
- LGVs ( #int )
- HGVs_2_rigid_axle ( #int )
- HGVs_3_rigid_axle ( #int )
- HGVs_4_or_more_rigid_axle ( #int )
- HGVs_3_or_4_articulated_axle ( #int )
- HGVs_5_articulated_axle ( #int )
- HGVs_6_articulated_axle ( #int )
- All_HGVs ( #int )
- All_motor_vehicles ( #int )

### Thought of what the API needs to do and a rough design. The data will not change; we only need to retrieve it, there is no create, update or delete functionality. This omits the requirements for security.

- get Measurements, per id
- get CountPoints ( including location data to place on a map ), all (?) & per id
- get Region locations, all & per id
- get LocalAuthority locations, all & per id

### Made some technology decisions

- Nodejs, JavaScript backend JS engine
- Express, for server
- fs.createReadStream ( nodejs native) - use streams to read data without loading to disk - this is crucial as the data is so large.
- csv-parse to parse the streamed csv
- I decided against using a SQL database as I wanted it to be lightweight and all in JavaScript.

### Set up the node environment and express server

### Created the db.js file which reads the csv stream and parse the tabular data to javascript objects and added some getter functions

### Wrote the routers for the api:

Region

- Get all regions : /api/regions
- Get a region and its associated local authorities : /api/regions/:id

LocalAuthorities

- Get all local authorities : /api/localAuthorities
- Get a local authority and its associated count points: /api/localAuthorities/:id

CountPoints

- Get all count points ( not recommended > 20MB ): /api/countPoints
- Get a count point and its associated measurements: /api/countPoints/:id

Measurements

- Get a list of measurements: /api/measurements?ids=8,9
- Get a measurement: /api/measurements/:id

### committed to GitHub

### Hosting. Tried to run on Vercel, but run into a problem so exposing localhost for quick (temp) fix!

Here:

### Improvements & what I could have done differently if I had more time:

- Set up a SQL database, hosting environment and loading and unzipping the data file on the fly.

### A final note:

I don't normally build APIs but it was a fun little project to test out builing an API using only nodejs and JavaScript

### Ps. The Data..

Monitoring the traffic flow for the entire UK is obviously a big task, but reading the DfT notes on how the traffic data is collected is surprising. The data is collected in 2-12 years intervals manually by a person ( trained enumerator) sitting by the roadside over a 12-hour interval taking notes on the volume and type of traffic, or the data is estimated from a representable sample. Not only must this be a very boring job, but surely with a drone and computer vision analysis this task could be done far more efficiently, accurately and regularly?

## Thank you,

### Liv
