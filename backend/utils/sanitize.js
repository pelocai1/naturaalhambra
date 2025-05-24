const fs = require('fs');
const path = require('path');

// Cargar la lista de palabras prohibidas desde un archivo JSON
const badWordsList = JSON.parse(fs.readFileSync(path.join(__dirname, 'filtro.json'), 'utf-8')).badWords;

const sanitizeComment = (comment) => {
  // Convertir el comentario a minúsculas
  let sanitized = comment.toLowerCase();

  // Reemplazo de caracteres comunes para evitar variantes
  sanitized = sanitized.replace(/[4@]/g, 'a')
                       .replace(/[3€]/g, 'e')
                       .replace(/[1!]/g, 'i')
                       .replace(/0/g, 'o')
                       .replace(/5/g, 's');

  // Verificar si contiene palabras prohibidas
  for (const word of badWordsList) {
    const regex = new RegExp(`\\b${word}\\b`, 'gi');
    if (regex.test(sanitized)) {
      return false;  // Contiene palabra prohibida
    }
  }
  return true;  // No contiene palabras prohibidas
};

module.exports = { sanitizeComment };
