// backend/routes/print.js

const { exec } = require("child_process");
const express = require("express");
const impresoraRoutes = express.Router();
const printer = require("pdf-to-printer");
const cors = require("cors");
impresoraRoutes.post("/print", (req, res) => {
  // Simulación de datos del ticket recibidos del cliente
  const { content, options } = req.body;

  // Guardar el contenido en un archivo PDF temporal
  const pdfPath = "./temp.pdf";
  // Puedes usar alguna librería para generar PDF desde HTML o datos, como pdf-lib o pdfkit

  printer
    .print(pdfPath, options)
    .then(() => res.send("Impresión enviada"))
    .catch((error) => res.status(500).send(error.message));
});

module.exports = impresoraRoutes;
