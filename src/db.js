const fs = require("fs");
const { parse } = require("csv-parse");

//const dataFile = "./data/dft_traffic_counts_aadf_by_direction.csv";
const dataFile = "data/trafficFlow.csv";

let counter = 0;
let header = {};

const db = {
  countPoints: new Map(),
  regions: new Map(),
  localAuthorities: new Map(),
  measurements: new Map(),
};

function populateDB() {
  fs.createReadStream(dataFile)
    .pipe(parse({ delimiter: ",", trim: true, skip_empty_lines: true }))
    .on("readable", function () {
      let record;
      while ((record = this.read()) !== null) {
        if (counter == 0) {
          header = processHeader(record);
        } else {
          processRecord(record);
        }
        counter++;
      }
    })
    .on("end", function () {
      console.log("finished populating db");
      /*  console.log("finished", header);  
      console.log("countPoints", db.countPoints);
      console.log("localAuthorities", db.localAuthorities);
      console.log("regions", db.regions);
      console.log("measurements", db.measurements); */
    })
    .on("error", function (error) {
      console.log(error.message);
    });
}

// # db table header
function processHeader(data) {
  const entries = {};
  data.forEach((entry, index) => (entries[entry] = index));
  return entries;
}

function processRecord(record) {
  setRecord(
    db.countPoints,
    {
      id: record[0],
      data: new CountPoint(counter, record),
    },
    counter
  );

  setRecord(
    db.regions,
    {
      id: record[header.Region_id],
      data: new Region(counter, record),
    },
    record[header.Local_authority_id]
  );

  setRecord(
    db.localAuthorities,
    {
      id: record[header.Local_authority_id],
      data: new LocalAuthority(counter, record),
    },
    record[0]
  );

  setRecord(db.measurements, {
    id: counter,
    data: new Measurement(counter, record),
  });
}

// generic record setting function, takes the recieving map object and the record object as arguments
function setRecord(obj, record, id) {
  // if entry already exist, add measurement id, otherwise add new record
  if (obj.has(record.id)) {
    const entry = obj.get(record.id);

    if (entry.measurements) entry.measurements.add(id);
    else if (entry.localAuthorities) entry.localAuthorities.add(id);
    else if (entry.countPoints) entry.countPoints.add(id);

    obj.set(record.id, entry);
  } else {
    obj.set(record.id, record.data);
  }
}

function parseData(keys, record, numerical) {
  const obj = {};
  keys.forEach(
    (entry) =>
      (obj[entry] = numerical
        ? Number(record[header[entry]])
        : record[header[entry]])
  );
  return obj;
}

// object contructor for #countPoint
function CountPoint(id, record) {
  this.id = record[0];
  this.region = record[header.Region_id];
  this.local_authority = record[header.Local_authority_id];
  this.road = parseData(
    [
      "Road_name",
      "Road_category",
      "Road_type",
      "Start_junction_road_name",
      "End_junction_road_name",
    ],
    record
  );
  this.position = parseData(
    ["Easting", "Northing", "Latitude", "Longitude"],
    record,
    true
  );
  this.linkLength = parseData(
    ["Link_length_km", "Link_length_miles"],
    record,
    true
  );
  this.measurements = new Set([id]);
}

// object contructor for #Region
function Region(id, record) {
  this.id = record[header.Region_id];
  this.name = record[header.Region_name];
  this.ons_code = record[header.Region_ons_code];
  this.localAuthorities = new Set([record[header.Local_authority_id]]);
}

// object contructor for #LocalAuthority
function LocalAuthority(id, record) {
  this.id = record[header.Local_authority_id];
  this.name = record[header.Local_authority_name];
  this.ons_code = record[header.Local_authority_code];
  this.countPoints = new Set([record[0]]);
}

// object contructor for #Measurement
function Measurement(id, record) {
  this.id = id;
  this.countPointId = record[0];
  this.year = Number(record[header.Year]);
  this.direction_of_travel = record[header.direction_of_travel]; //N, E, S, W, C
  this.estimation_method = {
    summary: record[header.Estimation_method], //'Estimated', 'Counted'
    detail: record[header.Estimation_method_detailed],
  }; 
  this.flowData = parseData(
    [
      "Pedal_cycles",
      "Two_wheeled_motor_vehicles",
      "Cars_and_taxis",
      "Buses_and_coaches",
      "LGVs",
      "HGVs_2_rigid_axle",
      "HGVs_3_rigid_axle",
      "HGVs_4_or_more_rigid_axle",
      "HGVs_3_or_4_articulated_axle",
      "HGVs_5_articulated_axle",
      "HGVs_6_articulated_axle",
      "All_HGVs",
      "All_motor_vehicles",
    ],
    record,
    true
  );
}

const existsId = (id, type) => db[type].has(id);

const getAll = (type) => Array.from(db[type].values());

const getId = (id, type) => db[type].get(id);

module.exports = {
  populateDB,
  getAll,
  getId,
  existsId,
};
