const bcrypt = require('bcrypt');

// Esta es la contraseña real
const plainPassword = 'admin1234';

// Esta es la contraseña hasheada que tienes en tu BD (copia tal cual)
const hashedPassword = '$2b$10$mIpN1EwOgl7.al9nJrABBeLVxDRY0LnCA2Mvr6JAFyceXjl7ygWCi';

bcrypt.compare(plainPassword, hashedPassword).then(result => {
  console.log('¿Coincide la contraseña?', result); // true o false
});