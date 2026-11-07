// ============================================
// MOTOR
// Administra las instancias de las vistas
// ============================================

import { construirModuloVista } from "../VISTAS/construirModuloVista.js";

export class Motor {
  constructor() {
    // Almacén de instancias de vistas ya construidas
    this.instancias = new Map();
    console.log("Motor creado");
  }

  /**
   * Construye la vista con el factory y la guarda en el almacén
   * @param {string} nombre - Nombre de la vista (ej: "Prueba")
   */
  guardarVista(nombre) {
    if (!nombre) {
      console.error("guardarVista: debes indicar un nombre");
      return;
    }

    // Evitar construir dos veces la misma vista
    if (this.instancias.has(nombre)) {
      console.warn(`La vista "${nombre}" ya está guardada`);
      return;
    }

    // El factory se encarga de instanciar la clase correcta
    const vista = construirModuloVista(nombre);

    if (!vista) {
      console.error(`No se pudo construir la vista "${nombre}"`);
      return;
    }

    this.instancias.set(nombre, vista);
    console.log(`Vista "${nombre}" guardada`);
  }

  /**
   * Busca la instancia y la monta en #app
   * @param {string} nombre
   */
  cambiarVista(nombre) {
    const vista = this.instancias.get(nombre);

    if (!vista) {
      console.error(`cambiarVista: no existe la vista "${nombre}"`);
      return;
    }

    const app = document.getElementById("app");
    if (!app) {
      console.error("No se encontró el contenedor #app");
      return;
    }

    // Limpia y deja que la vista se renderice
    app.innerHTML = "";
    vista.render(app);

    console.log(`Vista activa: "${nombre}"`);
  }

  /**
   * Útil para depurar
   */
  listarVistas() {
    console.log("Vistas en memoria:", [...this.instancias.keys()]);
  }
}

// ============================================
// ARRANQUE
// ============================================

const session = new Motor();

// Por ahora solo preparamos "Prueba"
session.guardarVista("Prueba");
session.cambiarVista("Prueba");

window.session = session;
