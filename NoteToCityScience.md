Dear CityScience

These is my notes on how I approached this backend dev task and some additional thoughts.

First I started with understanding the task.

- To build an API with traffic volume data from the DfT 'Road level Annual Average Daily Flow (AADF) estimates - Data by direction'
- Deploy the API server on a host so that it can be used externally
- Use JavaScript & PostgreSQL ( if needed, is it? )
- Make code available

then I analysed the the data:

- The dataset has over a million entries.
- It is large, 295 MB.
- Each row represents a measurement
- The same count point ( the spot the measurement was taken) can have more than one entry, with measurements taken in different years.

# CountPoint

- id ( #int )
- region ( #Location )
- local_authority ( #Location )
- road ( #Road )
- position ( #Position )
- length ( #Length )
- measurements ( #Array of #Measurement )

# Location

{ id ( #int ), name ( #string ), ons_code ( #string )}

# Road

{ name, type, category, start_junction, end_junction } (( #string ), all but type & category is optional)

# Position

{ latitude ( #float ), longitude ( #float ), easting ( #int ), northing ( #int )}

# LinkLength

{ km ( #float ), miles ( #float )}

# Measurement

- id ( #int )
- countPointId ( #int )
- year ( #int )
- data ( #FlowData )
- direction_of_travel ( #string - N, E, S, W, C )
- estimation_method { summary ( #string - 'Estimated', 'Counted') , detailed ( #string ) }

# FlowData

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

then I spec'ed out of what the API needs to do and a rough design. The data will not change; we only need to retrieve it, there is no create, update or delete functionality. This omits the requirements for security.

- get Measurements per Id, CountPoint, Region and LocalAuthority
- get CountPoints ( including location data to place on a map )
- get Region and LocalAuthority locations

then I made some technology decisions

- Nodejs, JavaScript backend JS engine
- Express, for server
- fs.createReadStream ( nodejs native) - use streams to read data without loading to disk - this is crucial as the data is so large.
- csv-parse to parse the streamed csv
- I decided against using a SQL database as I wanted it to be lightweight and all in JavaScript.

Improvements & what I could have done differently if I had more time:

A final note

Ps. The Data..

Monitoring the traffic flow for the entire UK is obviously a big task, but reading the DfT notes on how the traffic data is collected is surprising. The data is collected in 2-12 years intervals manually by a person ( trained enumerator) sitting by the roadside over a 12-hour interval taking notes on the volume and type of traffic, or the data is estimated from a representable sample. Not only must this be a very boring job, but surely with a drone and computer vision analysis this task could be done far more efficiently, accurately and regularly?
