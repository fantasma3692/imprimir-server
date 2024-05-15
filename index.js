const express = require('express');
const bodyParser = require('body-parser');
const printer = require('printer'); // Importa la librería node-printer
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const pdf = require('html-pdf');
const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Endpoint para obtener la lista de impresoras disponibles
app.get('/printers', async (req, res) => {
  try {
    // Utiliza printer.getPrinters() para obtener la lista de impresoras
    const printers = printer.getPrinters();
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
    console.log('Generando PDF...');
    pdf.create(content).toFile(pdfPath, async (err, result) => {
      if (err) {
        console.error('Error al crear el PDF:', err);
        return res.status(500).send('Error al crear el PDF');
      }
      
      try {
        console.log('Imprimiendo PDF...');
        printer.printFile({ filename: result.filename, printer: options.printer }); // Imprime el archivo con la impresora seleccionada
        res.send('Impresión enviada');
      } catch (printError) {
        console.error('Error al imprimir el PDF:', printError);
        res.status(500).send('Error al imprimir el PDF');
      } finally {
        console.log('Eliminando archivo temporal...');
        fs.unlinkSync(result.filename);
      }
    });
  } catch (error) {
    console.error('Error general:', error);
    res.status(500).send(error.message);
  }
});

app.listen(port, () => {
  console.log(`Servidor de impresión escuchando en http://localhost:${port}`);
});
