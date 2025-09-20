class Tarea {
  constructor(id, titulo, completada = false) {
    this.id = id;
    this.titulo = titulo;
    this.completada = completada;
  }
  toggleEstado() {
    this.completada = !this.completada;
  }
}

class GestorTareas {
  constructor() {
    this.tareas = [];
  }

  agregarTarea(titulo) {
    const nueva = new Tarea(Date.now(), titulo); // id único con timestamp
    this.tareas.push(nueva);
    this.guardarEnLocalStorage();
    return nueva;
  }

  eliminarTarea(id) {
    this.tareas = this.tareas.filter(t => t.id !== id);
    this.guardarEnLocalStorage();
  }

  listarTareas() {
    this.tareas.forEach(t => console.log(`${t.id} - ${t.titulo} [${t.completada ? "✔" : "✘"}]`));
  }

  buscarPorTitulo(titulo) {
    return this.tareas.find(t => t.titulo.toLowerCase() === titulo.toLowerCase());
  }

  listarCompletadas() {
    return this.tareas.filter(t => t.completada);
  }

  guardarEnLocalStorage() {
    localStorage.setItem("tareas", JSON.stringify(this.tareas));
  }

  cargarDesdeLocalStorage() {
    const data = JSON.parse(localStorage.getItem("tareas")) || [];
    this.tareas = data.map(obj => new Tarea(obj.id, obj.titulo, obj.completada));
  }
}

// --- DOM ---
const gestor = new GestorTareas();
gestor.cargarDesdeLocalStorage();

const listaTareas = document.getElementById("listaTareas");
const listaCompletadas = document.getElementById("listaCompletadas");
const inputTarea = document.getElementById("nuevaTarea");
const btnAgregar = document.getElementById("agregarBtn");
const mensajeError = document.getElementById("mensajeError");
const totalSpan = document.getElementById("total");
const completadasSpan = document.getElementById("completadas");

function renderizar() {
  listaTareas.innerHTML = "";
  listaCompletadas.innerHTML = "";

  gestor.tareas.forEach(t => {
    const li = document.createElement("li");
    li.textContent = t.titulo;
    if (t.completada) li.classList.add("completada");

    // Botón completar/desmarcar
    const btnToggle = document.createElement("button");
    btnToggle.textContent = t.completada ? "⏪ Desmarcar" : "✔ Completar";
    btnToggle.onclick = () => {
      t.toggleEstado();
      gestor.guardarEnLocalStorage();
      renderizar();
    };

    // Botón borrar
    const btnBorrar = document.createElement("button");
    btnBorrar.textContent = "🗑 Borrar";
    btnBorrar.style.background = "#e74c3c";
    btnBorrar.onclick = () => {
      gestor.eliminarTarea(t.id);
      renderizar();
    };

    const acciones = document.createElement("div");
    acciones.style.display = "flex";
    acciones.style.gap = "0.5rem";
    acciones.appendChild(btnToggle);
    acciones.appendChild(btnBorrar);

    li.appendChild(acciones);
    listaTareas.appendChild(li);
  });

  gestor.listarCompletadas().forEach(t => {
    const li = document.createElement("li");
    li.textContent = t.titulo;
    listaCompletadas.appendChild(li);
  });

  totalSpan.textContent = gestor.tareas.length;
  completadasSpan.textContent = gestor.listarCompletadas().length;
}

btnAgregar.addEventListener("click", () => {
  const titulo = inputTarea.value.trim();
  if (titulo === "") {
    mensajeError.textContent = "⚠ Debes escribir una tarea.";
    return;
  }
  mensajeError.textContent = "";
  gestor.agregarTarea(titulo);
  inputTarea.value = "";
  renderizar();
});

// --- Flujo inicial ---
(async () => {
  // Si ya hay en localStorage no simulamos carga inicial
  if (gestor.tareas.length === 0) {
    const tareasIniciales = await new Promise(resolve => {
      setTimeout(() => {
        resolve([
          new Tarea(Date.now() + 1, "Estudiar JavaScript", true),
          new Tarea(Date.now() + 2, "Practicar con clases", false),
          new Tarea(Date.now() + 3, "Subir proyecto a GitHub", false)
        ]);
      }, 2000);
    });
    gestor.tareas = tareasIniciales;
    gestor.guardarEnLocalStorage();
    console.log("✅ Tareas cargadas correctamente");
  }
  renderizar();
})();
// ... (resto del código igual)

const borrarCompletadasBtn = document.getElementById("borrarCompletadasBtn");

function renderizar() {
  listaTareas.innerHTML = "";
  listaCompletadas.innerHTML = "";

  gestor.tareas.forEach(t => {
    const li = document.createElement("li");
    li.textContent = t.titulo;
    if (t.completada) li.classList.add("completada");

    // Botón completar/desmarcar
    const btnToggle = document.createElement("button");
    btnToggle.textContent = t.completada ? "⏪ Desmarcar" : "✔ Completar";
    btnToggle.onclick = () => {
      t.toggleEstado();
      gestor.guardarEnLocalStorage();
      renderizar();
    };

    // Botón borrar individual
    const btnBorrar = document.createElement("button");
    btnBorrar.textContent = "🗑 Borrar";
    btnBorrar.style.background = "#e74c3c";
    btnBorrar.onclick = () => {
      gestor.eliminarTarea(t.id);
      renderizar();
    };

    const acciones = document.createElement("div");
    acciones.style.display = "flex";
    acciones.style.gap = "0.5rem";
    acciones.appendChild(btnToggle);
    acciones.appendChild(btnBorrar);

    li.appendChild(acciones);
    listaTareas.appendChild(li);
  });

  gestor.listarCompletadas().forEach(t => {
    const li = document.createElement("li");
    li.textContent = t.titulo;
    listaCompletadas.appendChild(li);
  });

  totalSpan.textContent = gestor.tareas.length;
  completadasSpan.textContent = gestor.listarCompletadas().length;
}

// Evento del botón "Borrar completadas"
borrarCompletadasBtn.addEventListener("click", () => {
  gestor.tareas = gestor.tareas.filter(t => !t.completada);
  gestor.guardarEnLocalStorage();
  renderizar();
});
