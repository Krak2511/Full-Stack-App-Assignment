// set up node modules
const bodyParser = require("body-parser");
const express = require("express");
const mongoose = require("mongoose");

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

// set up empty database on default mongoDB port
mongoose.connect("mongodb://localhost:27017/nameDB", { useNewUrlParser: true, useUnifiedTopology: true });
// create schema and model, each data item is just a String
const nameSchema = new mongoose.Schema({ name: String });
const Name = mongoose.model("Name", nameSchema);
// drop collection in case the database has been modified
Name.collection.drop();
// add default names that will return success
Name.create([{ name: "Alfred" }, { name: "Bob" }, { name: "Charlie" }, { name: "Danny" }, { name: "Eddie" }]);

// set up server to listen so the page can be accessed via localhost:3000
app.listen(3000, function (req, res) {
  console.log("Server started on port 3000");
});

// open main page
app.get("/", function (req, res) {
  res.sendFile(__dirname + "/index.html");
});

// receive data from form and check if name is in database
app.post("/", function (req, res) {
  // find name in database
  Name.findOne({ name: req.body.name }, function (err, result) {
    if (err) {
      console.log(err);
    } else {
      // send appropriate response, input is case sensitive
      if (result === null) {
        res.send("failure");
      } else {
        res.send("success");
      }
    }

    // add mongoose.connection.close() here if this is a real app, but for this it is easier to leave it open to refresh and test various names
  });
});
