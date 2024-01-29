const express = require("express");

const { getAll, getId, existsId } = require("../db");

const measurementsRouter = express.Router();

//this doesn't seem like a good idea
/*  function httpGetAllMeasurements(req, res) {
  return res.status(200).json(getAll("measurements"));
} */
 
function httpGetMeasurement(req, res) {
  const { id } = req.params;
  if (!existsId(Number(id), "measurements")) {
    return res.status(404).json({
      error: `Measurement not found, id : ${id}`,
    });
  }
  return res.status(200).json(getId(Number(id), "measurements"));
}

function httpGetMeasurements(req, res) {
  const { ids } = req.query; //?ids=4,5

  if (!ids) {
    return res.status(418).send({ message: "List of ids is required" });
  }

  const arrayOfIds = ids.split(",");

  if (!ids.length) {
    res.status(418).send({ message: "List of ids is can not be empty" });
  }

  const measurements = arrayOfIds.map((id) => {
    if (!existsId(Number(id), "measurements")) {
      return `Measurement not found, id : ${id}`;
    }

    return getId(Number(id), "measurements");
  });

  return res.status(200).json(measurements);
}

//measurementsRouter.get("/", httpGetAllMeasurements);
measurementsRouter.get("/", httpGetMeasurements);
measurementsRouter.get("/:id", httpGetMeasurement);

module.exports = measurementsRouter;
