const http = require("http");
const bodyparser = require("body-parser");
const mongoose = require("mongoose");
const express = require("express");
const config = require("./helper/config");
const routes = require("./routes/task.route");
const app = express();
const cors = require("cors");
const server = http.createServer(app);

app.use(bodyparser.json());
app.use(
  bodyparser.urlencoded({
    limit: "50mb",
    extended: true,
    parameterLimit: 1000000,
  })
);
app.use(cors()); //Network Configuration

mongoose.connect(config.url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const con = mongoose.connection;
con.on("open", () => {
  console.log("Database Connected...");
});

app.get("/", (req, res) => {
  res.send("App Working");
});

app.use("/api", routes);

server.listen(config.port, (err) => {
  if (err) throw err;
  console.log("Server Up And Running");
});
