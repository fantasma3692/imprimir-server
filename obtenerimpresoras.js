const printer = require('pdf-to-printer');

printer.getPrinters()
  .then(printers => {
    console.log(printers);
  })
  .catch(error => {
    console.error('Error al obtener las impresoras:', error);
  });
