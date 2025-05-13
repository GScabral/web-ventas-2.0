const multer = require('multer');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Directorio de destino para almacenar archivos
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname); // Nombre de archivo original
  }
});

// Middleware de upload utilizando multer
const upload = multer({
  storage: storage,
  limits: { files: 11 } // Establece el límite máximo de archivos
}).fields([
  { name: 'variantesData[0][imagenFiles][0]' },
  { name: 'variantesData[1][imagenFiles][0]' }, // Permitir múltiples variantes de archivos
  { name: 'variantesData[2][imagenFiles][0]' },
  { name: 'variantesData[3][imagenFiles][0]' },
  { name: 'variantesData[4][imagenFiles][0]' },
  { name: 'variantesData[5][imagenFiles][0]' },
  { name: 'variantesData[6][imagenFiles][0]' },
  { name: 'variantesData[7][imagenFiles][0]' },
  { name: 'variantesData[8][imagenFiles][0]' },
  { name: 'variantesData[9][imagenFiles][0]' },
  { name: 'variantesData[10][imagenFiles][0]' },
]);

module.exports = upload;
