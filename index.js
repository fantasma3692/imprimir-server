const express = require('express');
const bodyParser = require('body-parser');
 const printer = require('pdf-to-printer');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const app = express();
// const printer = require('printer');
// const wmi = require('wmi-client');
const { exec } = require('child_process');
const port = process.env.PORT || 3000; // Usar el puerto definido por la variable de entorno PORT o 10000 como valor predeterminado
app.use(cors()); 
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// Función para obtener la lista de impresoras disponibles
function getPrinters() {
  return new Promise((resolve, reject) => {
    const command = process.platform === 'win32' ? 'wmic printer get name' : 'lpstat -p -d';
    exec(command, (error, stdout, stderr) => {
      if (error) {
        reject(error);
      } else {
        const printerList = stdout.split('\n').slice(1).filter(Boolean);
        resolve(printerList);
      }
    });
  });
}
// Endpoint para obtener la lista de impresoras disponibles
app.get('/printers', async (req, res) => {
  try {
    // Utiliza printer.getPrinters() para obtener la lista de impresoras
    const printers = await getPrinters();
    res.json(printers);
  } catch (error) {
    console.error('Error al obtener las impresoras:', error);
    res.status(500).send('Error al obtener las impresoras');
  }
});

app.post('/print', async (req, res) => {
  const { content, options } = req.body;

  if (!content) {
    return res.status(400).send('El contenido es requerido');
  }

  const pdfPath = path.join(__dirname, 'temp.pdf');
  
  try {
    // Aquí deberías generar el PDF a partir del contenido
    // Para simplicidad, asumiremos que content es un HTML y usamos una librería para convertirlo en PDF
    // const command = `lp -d ${options.printer} ${result.filename}`;
    // Comando para imprimir en sistemas Windows usando net use
     const command = `net use USB001: POS-80/persistent:yes && copy ${result.filename}`;
    
    // Ejecuta el comando de impresión del propio sistema operativo
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error('Error al imprimir el PDF:', error);
        res.status(500).send('Error al imprimir el PDF');
      } else {
        console.log('Impresión enviada');
        res.send('Impresión enviada');
      }
      // Elimina el archivo temporal después de imprimir
      console.log('Eliminando archivo temporal...');
      fs.unlinkSync(result.filename);
    });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.listen(port, () => {
  console.log(`Servidor de impresión escuchando en http://localhost:${port}`);
});
