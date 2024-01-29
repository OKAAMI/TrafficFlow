const express = require("express");

const { getAll, getId, existsId } = require("../db");

const countPointsRouter = express.Router();

function httpGetAllCountPoints(req, res) {
  return res.status(200).json(getAll("countPoints"));
}

function httpGetCountPoint(req, res) {
  const { id } = req.params;
  if (!existsId(id, "countPoints")) {
    return res.status(404).json({
      error: `CountPoint not found, id : ${id}`,
    });
  }

  // convert localAuthorities set to array
  const cP = getId(id, "countPoints");
  cP.measurements = [...cP.measurements];

  return res.status(200).json(cP);
}

countPointsRouter.get("/", httpGetAllCountPoints);
countPointsRouter.get("/:id", httpGetCountPoint);

module.exports = countPointsRouter;
