const express = require("express");

const countPointsRouter = require("./src/routes/countPoints.router");
const regionsRouter = require("./src/routes/regions.router");
const localAuthoritiesRouter = require("./src/routes/localAuthorities.router");
const measurementsRouter = require("./src/routes/measurements.router");

const { populateDB } = require("./src/db");

const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.json());

app.listen(PORT, () => console.log(`Live on port ${PORT}...`));

// routers
app.use("/api/countPoints", countPointsRouter);
app.use("/api/regions", regionsRouter);
app.use("/api/localAuthorities", localAuthoritiesRouter);
app.use("/api/measurements", measurementsRouter);

app.use("/", (req, res) => {
  return res
    .status(200)
    .send("Hello Traffic Flow -  there is currently no FrontEnd, just an API");
});

populateDB();

module.exports = app;
