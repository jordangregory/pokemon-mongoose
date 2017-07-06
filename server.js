const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const mongoose = require("mongoose");
mongoose.Promise = require("bluebird");
const port = process.env.PORT || 8100;
const dbURL = "mongodb://localhost:27017/pokemon";
const mustacheExpress = require("mustache-express");
var PokemonCard = require("./models/pokemon.js");

app.engine("mustache", mustacheExpress());

app.set("view engine", "mustache");
app.set("views", __dirname + "/views");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static("public"));

app.get("/", function(req, res) {
  PokemonCard.find().then(foundCards => {
    res.render("index", { cards: foundCards });
  });
});

app.get("/addCard", function(req, res) {
  res.render("addCard", {});
});

app.post("/addCard", function(req, res) {
  console.log(req.body);
  let newCard = new PokemonCard();
  newCard.name = req.body.name;
  newCard.type = req.body.type;
  newCard.releaseDate.month = req.body.month;
  newCard.releaseDate.year = Number(req.body.year);
  newCard.rarity = req.body.rarity;
  newCard.save().then(savedCard => {
    res.redirect("/");
  });
});

app.post("/delete", (req, res) => {
  PokemonCard.deleteOne({ _id: req.body.id })
    .then(() => {
      res.redirect("/");
    })
    .catch(err => {
      res.status(500).send(err);
    });
});

app.get("/update/:id", (req, res) => {
  PokemonCard.findOne({ _id: req.params.id })
    .then(foundPokemon => {
      res.render("update", { singleCard: foundPokemon });
    })
    .catch(err => {
      res.status(500).send(err);
    });
});
app.post("/update/:id", (req, res) => {
  PokemonCard.updateOne({ _id: req.params.id }, req.body)
    .then(foundPokemon => {
      res.redirect("/");
    })
    .catch(err => {
      res.status(500).send(err);
    });
});

mongoose
  .connect(dbURL)
  .then(() => {
    console.log("Success connected to Mongodb");
  })
  .catch(err => {
    console.log("Error: ", err);
  });

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
