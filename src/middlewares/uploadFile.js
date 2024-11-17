const multer = require('multer');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads'); // Diretório onde os arquivos serão armazenados
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname); // Nome original do arquivo
    }
});

const uploadFile = multer({ storage });

module.exports = uploadFile;