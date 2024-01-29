const express = require("express");

const { getAll, getId, existsId } = require("../db");

const regionsRouter = express.Router();

function httpGetAllRegions(req, res) {
  return res.status(200).json(getAll("regions"));
}

function httpGetRegion(req, res) {
  const { id } = req.params;
  if (!existsId(id, "regions")) {
    return res.status(404).json({
      error: `Region not found, id : ${id}`,
    });
  }

  // convert localAuthorities set to array
  const region = getId(id, "regions");
  region.localAuthorities = [...region.localAuthorities];

  return res.status(200).json(region);
}

regionsRouter.get("/", httpGetAllRegions);
regionsRouter.get("/:id", httpGetRegion);

module.exports = regionsRouter;
