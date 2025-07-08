require("dotenv").config();
const express = require("express");
const cors = require("cors");
const authRoute = require("./Routes/authRoute");
const emailRoute = require("./Routes/emailRoute");
const atsRoute = require("./Routes/atsRoute");
const aiRoute = require("./Routes/aiRoutes");
require('./Models/db');

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());

app.use('/ai', aiRoute);

app.use('/auth', authRoute);

app.use("/email", emailRoute);

app.use("/ats", atsRoute);

app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`)
})

module.exports = app;
