// ============================================
// FORMULARIO
// ============================================

import { Contenedor } from "./Contenedor.js";
import { Boton } from "./Boton.js";

export class Formulario extends Contenedor {
  constructor(config = {}) {
    super("form", config);

    this.config = config;
    this.botonSubmit = null;

    // Interceptamos el evento submit
    this.elemento.addEventListener("submit", async (e) => {
      e.preventDefault();

      if (!this.esValido()) {
        console.warn("Formulario incompleto o inválido.");
        return;
      }

      this.bloquearEnvio(true);

      try {
        if (typeof this.config.onSubmit === "function") {
          await this.config.onSubmit(this.obtenerDatos(), this);
        }
      } catch (error) {
        console.error("Error en el envío:", error);
      } finally {
        this.verificarEstadoBoton();
      }
    });
  }

  /**
   * Sobrescribimos render para asegurarnos de crear y añadir el botón 
   * ÚNICAMENTE DESPUÉS de que todos los hijos ya fueron agregados a la vista.
   */
  render(contenedorPadre) {
    // 1. Renderizamos primero todos los hijos (inputs, títulos, etc.)
    const el = super.render(contenedorPadre);

    // 2. Si el botón por defecto aún no ha sido creado, lo creamos ahora 
    // que ya tenemos la certeza de conocer todos los hijos del formulario.
    if (!this.botonSubmit) {
      this._crearBotonPorDefecto(this.config);
    }

    return el;
  }

  _crearBotonPorDefecto(config) {
    const texto = config.textoBoton || "Enviar";
    const className = config.classNameBoton || "btn btn-submit";

    this.botonSubmit = new Boton({
      id: config.idBoton || "btn-submit-default",
      className: className,
      text: texto,
      attributes: {
        type: "submit"
      }
    });

    // Lo registramos en la lista de hijos y lo insertamos físicamente al final del DOM
    this.hijos.push(this.botonSubmit);
    this.guardarMemoria({ submit: this.botonSubmit });
    this.elemento.appendChild(this.botonSubmit.getElemento());

    // Evaluamos su estado de inmediato (aquí ya sabe si hay campos obligatorios vacíos)
    this.verificarEstadoBoton();
  }

  agregarHijo(hijo, nombre = null) {
    super.agregarHijo(hijo, nombre);

    const elDom = hijo.getElemento();
    if (elDom) {
      elDom.addEventListener("input", () => this.verificarEstadoBoton());
      elDom.addEventListener("change", () => this.verificarEstadoBoton());
    }

    // Si el botón ya existe (post-renderizado), re-evaluamos en tiempo real
    if (this.botonSubmit) {
      this.verificarEstadoBoton();
    }

    return hijo;
  }

  esValido() {
    for (const hijo of this.hijos) {
      if (hijo === this.botonSubmit) continue;

      if (typeof hijo.esValido === "function" && !hijo.esValido()) {
        return false;
      }
    }
    return true;
  }

  verificarEstadoBoton() {
    if (!this.botonSubmit) return;

    const formularioValido = this.esValido();

    if (typeof this.botonSubmit.deshabilitar === "function") {
      this.botonSubmit.deshabilitar(!formularioValido);
    } else {
      this.botonSubmit.getElemento().disabled = !formularioValido;
    }
  }

  bloquearEnvio(bloquear = true) {
    if (!this.botonSubmit) return;

    if (typeof this.botonSubmit.deshabilitar === "function") {
      this.botonSubmit.deshabilitar(bloquear);
    } else {
      this.botonSubmit.getElemento().disabled = bloquear;
    }
  }

  obtenerDatos() {
    const datos = {};

    for (const [clave, valor] of Object.entries(this.memoria)) {
      if (valor && typeof valor === "object" && valor !== this.botonSubmit) {
        if (typeof valor.obtenerValor === "function") {
          datos[clave] = valor.obtenerValor();
        } else if (typeof valor.obtenerArchivo === "function") {
          datos[clave] = valor.obtenerArchivo();
        }
      }
    }

    return datos;
  }
}
