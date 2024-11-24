const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Função para garantir que a pasta exista
const ensureDirectoryExistence = (directory) => {
  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory, { recursive: true }); // Cria a pasta, incluindo subpastas, se necessário
  }
};

// Configuração do armazenamento para o Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = 'uploads/activity'; // Pasta onde os arquivos serão armazenados
    ensureDirectoryExistence(uploadPath); // Verifica e cria a pasta, se necessário
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const name = Date.now() + "----" + file.originalname;
    cb(null, name); // Nome único para o arquivo
  },
});

const upload = multer({ storage });

module.exports = upload;