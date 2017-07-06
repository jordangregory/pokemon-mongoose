var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var pokemonSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true
  },

  releaseDate: {
    month: {
      type: String,
      required: true
    },
    year: {
      type: Number,
      required: true
    }
  },
  rarity: {
    type: String,
    required: true,
    enum: ["Rare", "Common"]
  }
});

module.exports = mongoose.model("PokemonCard", pokemonSchema);
