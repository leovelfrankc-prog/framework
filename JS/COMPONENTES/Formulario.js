// ============================================
// FORMULARIO (Con botón de submit por defecto)
// ============================================

import { Contenedor } from "./Contenedor.js";
import { Boton } from "./Boton.js"; // Asegúrate de importar tu clase Boton

export class Formulario extends Contenedor {
  /**
   * @param {object} [config={}]
   * @param {string} [config.textoBoton="Enviar"] - Texto por defecto del botón
   * @param {string} [config.classNameBoton=""] - Clases CSS opcionales para el botón
   * @param {Function} [config.onSubmit] - Callback al enviar
   */
  constructor(config = {}) {
    super("form", config);

    this.config = config;
    this.botonSubmit = null;

    // 1. Creamos el botón de envío por defecto automáticamente
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
  }

  /**
   * Genera e inserta el botón de envío al final del formulario por defecto
   */
  _crearBotonPorDefecto(config) {
    const texto = config.textoBoton || "Enviar";
    const className = config.classNameBoton || "btn btn-submit";

    // Instanciamos tu clase Boton
    this.botonSubmit = new Boton({
      id: config.idBoton || "btn-submit-default",
      className: className,
      text: texto,
      attributes: {
        type: "submit"
      }
    });

    // Lo agregamos internamente al contenedor DOM y registramos su instancia
    this.hijos.push(this.botonSubmit);
    this.elemento.appendChild(this.botonSubmit.getElemento());

    // Evaluamos su estado inicial (desactivado si hay campos obligatorios vacíos)
    this.verificarEstadoBoton();
  }

  /**
   * Sobrescribimos agregarHijo para escuchar cambios y actualizar el botón
   */
  agregarHijo(hijo, nombre = null) {
    super.agregarHijo(hijo, nombre);

    const elDom = hijo.getElemento();
    if (elDom) {
      elDom.addEventListener("input", () => this.verificarEstadoBoton());
      elDom.addEventListener("change", () => this.verificarEstadoBoton());
    }

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
