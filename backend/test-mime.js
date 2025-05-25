const mime = require('mime-types');

console.log('>> Función:', typeof mime.getType);
console.log('>> Resultado:', mime.getType('foto.jpeg'));
