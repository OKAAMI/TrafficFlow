const express = require("express");

const countPointsRouter = require("./routes/countPoints.router");
const regionsRouter = require("./routes/regions.router");
const localAuthoritiesRouter = require("./routes/localAuthorities.router");
const measurementsRouter = require("./routes/measurements.router");

const { populateDB } = require("./db");

const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.json());

app.listen(PORT, () => console.log(`Live on port ${PORT}...`));

// routers
app.use("/countPoints", countPointsRouter);
app.use("/regions", regionsRouter);
app.use("/localAuthorities", localAuthoritiesRouter);
app.use("/measurements", measurementsRouter);

populateDB();

/* app.use("/", (req, res) => {
  return res.status(200).send("Hello Traffic Flow");
}); */
