const multer = require('multer');
const fs = require('fs');

// Função para verificar e criar o diretório, se necessário
const ensureDirectoryExistence = (directory) => {
  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory, { recursive: true });
  }
};

// Configuração do armazenamento para o Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = './uploads'; // Diretório onde os arquivos serão armazenados
    ensureDirectoryExistence(uploadDir); // Garante que o diretório exista
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname); // Nome original do arquivo
  },
});

const uploadFile = multer({ storage });

module.exports = uploadFile;
