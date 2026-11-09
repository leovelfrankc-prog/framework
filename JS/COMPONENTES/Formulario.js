// ============================================
// FORMULARIO (Corrección de estado inicial del botón)
// ============================================

import { Contenedor } from "./Contenedor.js";
import { Boton } from "./Boton.js";

export class Formulario extends Contenedor {
  constructor(config = {}) {
    super("form", config);

    this.config = config;
    this.botonSubmit = null;

    // 1. Creamos el botón pero sin evaluar su estado todavía
    this._crearBotonPorDefecto(config);

    // 2. Interceptamos el evento submit
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

    // 3. CORRECCIÓN: Evaluamos el estado inicial una vez que toda la estructura 
    // y los inputs ya fueron definidos en la vista hija.
    setTimeout(() => this.verificarEstadoBoton(), 0);
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

    this.hijos.push(this.botonSubmit);
    this.elemento.appendChild(this.botonSubmit.getElemento());
    // Nota: Quitamos la llamada a verificarEstadoBoton() de aquí para que espere a los inputs
  }

  agregarHijo(hijo, nombre = null) {
    super.agregarHijo(hijo, nombre);

    const elDom = hijo.getElemento();
    if (elDom) {
      elDom.addEventListener("input", () => this.verificarEstadoBoton());
      elDom.addEventListener("change", () => this.verificarEstadoBoton());
    }

    // Cada vez que agregues un input, re-evaluamos el botón por si hay obligatorios vacíos
    this.verificarEstadoBoton();

    return hijo;
  }

  esValido() {
    for (const hijo of this.hijos) {
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
      if (valor && typeof valor === "object") {
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
