// Importación de módulos necesarios
const express = require("express");
const fs = require("fs");
const cors = require("cors");
const path = require("path");

// Configuración inicial del servidor
const app = express();
app.use(express.json()); // Middleware para procesar JSON en las solicitudes
app.use(cors()); // Habilita CORS para permitir consultas desde otros orígenes
app.use(express.static(path.join(__dirname, "../public"))); // Sirve archivos estáticos

// Ruta del archivo JSON donde se almacenan las canciones
const dataPath = path.join(__dirname, "../data/repertorio.json");

// Ruta para obtener todas las canciones
app.get("/canciones", (req, res) => {
  const canciones = JSON.parse(fs.readFileSync(dataPath, "utf-8"));
  res.json(canciones); // Devuelve el JSON con las canciones
});

// Ruta para agregar una nueva canción
app.post("/canciones", (req, res) => {
  const canciones = JSON.parse(fs.readFileSync(dataPath, "utf-8"));
  canciones.push(req.body); // Agrega la nueva canción al arreglo
  fs.writeFileSync(dataPath, JSON.stringify(canciones, null, 2)); // Sobrescribe el archivo JSON
  res.send("Canción agregada");
});

// Ruta para editar una canción existente
app.put("/canciones/:id", (req, res) => {
  const canciones = JSON.parse(fs.readFileSync(dataPath, "utf-8"));
  const index = canciones.findIndex((c) => c.id == req.params.id);
  if (index >= 0) {
    canciones[index] = req.body; // Actualiza los datos de la canción
    fs.writeFileSync(dataPath, JSON.stringify(canciones, null, 2)); // Guarda los cambios
    res.send("Canción modificada");
  } else {
    res.status(404).send("Canción no encontrada");  
  }
});

// Ruta para eliminar una canción
app.delete("/canciones/:id", (req, res) => {
  const canciones = JSON.parse(fs.readFileSync(dataPath, "utf-8"));
  const nuevasCanciones = canciones.filter((c) => c.id != req.params.id); // Filtra la canción a eliminar
  fs.writeFileSync(dataPath, JSON.stringify(nuevasCanciones, null, 2)); // Actualiza el archivo JSON
  res.send("Canción eliminada");
});

// Inicio del servidor en el puerto 4000
app.listen(4000, () => console.log("Servidor corriendo en http://localhost:4000"));
