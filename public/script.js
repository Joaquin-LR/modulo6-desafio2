// URL base de las rutas del servidor
const url = "http://localhost:4000/canciones";

// Referencias a elementos del DOM
const tbody = document.getElementById("cuerpo");
const cancion = document.getElementById("cancion");
const artista = document.getElementById("artista");
const tono = document.getElementById("tono");

// Arreglo que almacenará las canciones cargadas desde el servidor
let canciones = [];

// Carga inicial de datos al abrir la página
window.onload = getData;

// Función para obtener todas las canciones del servidor
async function getData() {
  const response = await axios.get(url);
  canciones = response.data;

  // Limpia la tabla antes de rellenarla
  tbody.innerHTML = "";

  // Rellena la tabla con los datos de las canciones
  canciones.forEach((c, i) => {
    tbody.innerHTML += `
      <tr>
        <td>${i + 1}</td>
        <td>${c.titulo}</td>
        <td>${c.artista}</td>
        <td>${c.tono}</td>
        <td>
          <button class="btn btn-warning" onclick="prepararCancion(${i},'${c.id}')">Editar</button>
          <button class="btn btn-danger" onclick="eliminarCancion(${i},'${c.id}')">Eliminar</button>
        </td>
      </tr>`;
  });

  // Limpia los inputs después de cargar los datos
  cancion.value = "";
  artista.value = "";
  tono.value = "";
}

// Función para agregar una nueva canción
function nuevaCancion() {
  const data = {
    id: Math.floor(Math.random() * 9999), // Genera un ID aleatorio
    titulo: cancion.value,
    artista: artista.value,
    tono: tono.value,
  };

  // Envía la nueva canción al servidor y recarga los datos
  axios.post(url, data).then(() => getData());
}

// Función para eliminar una canción por su ID
function eliminarCancion(i, id) {
  axios.delete(`${url}/${id}`).then(() => {
    alert(`Canción "${canciones[i].titulo}" eliminada`);
    getData(); // Recarga los datos después de eliminar
  });
}

// Prepara el formulario para editar una canción existente
function prepararCancion(i, id) {
  // Llena los inputs con los datos de la canción seleccionada
  cancion.value = canciones[i].titulo;
  artista.value = canciones[i].artista;
  tono.value = canciones[i].tono;

  // Configura el botón de edición
  document.getElementById("editar").style.display = "block";
  document.getElementById("agregar").style.display = "none";
  document.getElementById("editar").setAttribute("onclick", `editarCancion('${id}')`);
}

// Función para editar una canción
function editarCancion(id) {
  const data = {
    id, // Mantiene el mismo ID
    titulo: cancion.value,
    artista: artista.value,
    tono: tono.value,
  };

  // Envía la actualización al servidor y recarga los datos
  axios.put(`${url}/${id}`, data).then(() => {
    document.getElementById("editar").style.display = "none";
    document.getElementById("agregar").style.display = "block";
    getData();
  });
}
