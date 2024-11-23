try {
  const multer = require('multer');
  const path = require('path');

    // Configuração do armazenamento para o Multer
    const storage = multer.diskStorage({
      destination: (req, file, cb) => {
        cb(null, 'uploads/activity'); // Pasta onde os arquivos serão armazenados
      },
      filename: (req, file, cb) => {
        const name = Date.now() + "----" + file.originalname;
        
        cb(null, name); // Nome único para o arquivo
      },
    });

    const upload = multer({ storage });

    module.exports = upload;

} catch (error) {
  return res.status(500).json({error: error.message});
}