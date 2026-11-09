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

    // 1. Solo creamos la instancia del botón y lo guardamos en memoria, 
    // pero NO lo insertamos en el DOM todavía para que quede al final.
    this._crearInstanciaBoton(config);

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
   * Crea la instancia lógica del botón por defecto sin agregarlo prematuramente al DOM
   */
  _crearInstanciaBoton(config) {
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

    // Guardamos la referencia en memoria y en la lista de hijos lógicos
    this.hijos.push(this.botonSubmit);
    this.guardarMemoria({ submit: this.botonSubmit });
  }

  /**
   * Sobrescribimos render para asegurar que el botón por defecto 
   * se adjunte físicamente al final de todo el contenido del formulario.
   */
  render(contenedorPadre) {
    // Primero dejamos que el contenedor renderice sus elementos hijos (títulos, inputs, etc.)
    const el = super.render(contenedorPadre);

    // Si tenemos un botón por defecto y aún no está en el DOM del form, lo anexamos al final
    if (this.botonSubmit && !this.elemento.contains(this.botonSubmit.getElemento())) {
      this.elemento.appendChild(this.botonSubmit.getElemento());
    }

    // Evaluamos el estado inicial una vez que todo está montado en el DOM
    this.verificarEstadoBoton();

    return el;
  }

  agregarHijo(hijo, nombre = null) {
    super.agregarHijo(hijo, nombre);

    const elDom = hijo.getElemento();
    if (elDom) {
      elDom.addEventListener("input", () => this.verificarEstadoBoton());
      elDom.addEventListener("change", () => this.verificarEstadoBoton());
    }

    // Re-evaluamos cada vez que se añade un elemento
    this.verificarEstadoBoton();

    return hijo;
  }

  esValido() {
    for (const hijo of this.hijos) {
      // Ignoramos el propio botón al validar
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
