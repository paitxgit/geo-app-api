const mongoose = require("mongoose");

const fotoSchema = new mongoose.Schema({
  fotoBase64: { type: String, required: true },
  timestamp: { type: String, required: true },
});

const Foto = mongoose.model("Foto", fotoSchema);

module.exports = Foto;
