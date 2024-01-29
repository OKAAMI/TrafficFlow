const express = require("express");

const { getAll, getId, existsId } = require("../db");

const localAuthoritiesRouter = express.Router();

function httpGetAllLocalAuthorities(req, res) {
  return res.status(200).json(getAll("localAuthorities"));
}

function httpGetLocalAuthority(req, res) {
  const { id } = req.params;
  if (!existsId(id, "localAuthorities")) {
    return res.status(404).json({
      error: `Local Authority not found, id : ${id}`,
    });
  }

  // convert countPoints set to array

  const la = getId(id, "localAuthorities");
  la.countPoints = [...la.countPoints];

  return res.status(200).json(la);
}

localAuthoritiesRouter.get("/", httpGetAllLocalAuthorities);
localAuthoritiesRouter.get("/:id", httpGetLocalAuthority);

module.exports = localAuthoritiesRouter;
