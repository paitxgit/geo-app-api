const mongoose = require("mongoose");

const localizacaoSchema = new mongoose.Schema({
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
  googleMapsLink: { type: String, required: true },
  timestamp: { type: String, required: true },
  userIp: { type: String, required: true },
});

const Localizacao = mongoose.model("Localizacao", localizacaoSchema);

module.exports = Localizacao;
