// ============================================
// FORMULARIO (Actualizado con detección robusta de botón)
// ============================================

import { Contenedor } from "./Contenedor.js";

export class Formulario extends Contenedor {
  constructor(config = {}) {
    super("form", config);

    this.config = config;
    this.botonSubmit = null;

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
   * Detecta y registra hijos, identificando automáticamente el botón de envío
   */
  agregarHijo(hijo, nombre = null) {
    super.agregarHijo(hijo, nombre);

    const elDom = hijo.getElemento();

    // Detección robusta: si se llama "submit", o su tag es button/input con type="submit"
    const esBotonSubmit = 
      nombre === "submit" || 
      (elDom && elDom.tagName === "BUTTON") || 
      (elDom && elDom.type === "submit");

    if (esBotonSubmit && !this.botonSubmit) {
      this.botonSubmit = hijo;
      // Forzamos la verificación inicial apenas se registra el botón
      this.verificarEstadoBoton();
    }

    // Escuchamos eventos de cambio en los inputs para actualizar el botón en tiempo real
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
