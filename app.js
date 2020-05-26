const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const ejs = require("ejs");

const url = "mongodb://localhost:27017/foodDB";
const app = express();

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });

const foodSchema = {
  title: String,
  detail: String,
  cost: String,
};

const Food = mongoose.model("Food", foodSchema);

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", function (req, res) {
  Food.find(function (err, foods) {
    if (!err) {
      res.render("index", { foods: foods });
    } else {
      res.send(err);
    }
  });
});

app.route("/foods").post(function (req, res) {
  const food = new Food({
    title: req.body.title,
    detail: req.body.detail,
    cost: req.body.price,
  });
  food.save(function (err) {
    if (!err) {
      res.redirect("/");
    } else {
      res.send(err);
    }
  });
});

app
  .route("/foods/:foodId")
  .get(function (req, res) {
    Food.findOne({ _id: req.params.foodId }, function (err, foundFood) {
      if (foundFood) {
        res.render("food", { foundFood: foundFood });
      } else {
        res.send("Not found");
      }
    });
  })
  .post(function (req, res) {
    Food.update(
      { _id: req.params.foodId },
      { title: req.body.title, detail: req.body.detail, cost: req.body.price },
      { overwrite: true },
      function (err) {
        if (err) {
          res.send(err);
        } else {
          res.redirect("/");
        }
      }
    );
  });

app.post("/foods/delete/:foodId", function (req, res) {
  Food.deleteOne({ _id: req.params.foodId }, function (err) {
    if (!err) {
      res.redirect("/");
    } else {
      res.send(err);
    }
  });
});

app.listen(3000, function () {
  console.log("Server started listening to post 3000");
});
