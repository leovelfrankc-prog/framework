// ============================================
// BOTON
// Hereda de Componente
// ============================================

import { Componente } from "./Componente.js";

export class Boton extends Componente {
  /**
   * @param {object} [config={}]
   * @param {string} [config.text=""] - Texto del botón
   * @param {string} [config.type="button"] - Tipo de botón (button, submit, reset)
   */
  constructor(config = {}) {
    super("button", config);

    // Texto por defecto
    if (config.text) {
      this.elemento.textContent = config.text;
    }

    // Tipo de botón por defecto
    if (!this.elemento.getAttribute("type")) {
      this.elemento.setAttribute("type", config.attributes?.type || "button");
    }

    // Eventos personalizados (ej. click)
    if (config.events && typeof config.events === "object") {
      for (const [evento, callback] of Object.entries(config.events)) {
        this.elemento.addEventListener(evento, callback);
      }
    }
  }

  /**
   * Habilita el botón
   */
  habilitar() {
    this.elemento.disabled = false;
    this.guardarMemoria({ disabled: false });
  }

  /**
   * Deshabilita el botón
   */
  deshabilitar() {
    this.elemento.disabled = true;
    this.guardarMemoria({ disabled: true });
  }

  /**
   * Cambia el estado de habilitado/deshabilitado dinámicamente
   * @param {boolean} estado - True para deshabilitar, false para habilitar
   */
  establecerDeshabilitado(estado) {
    if (estado) {
      this.deshabilitar();
    } else {
      this.habilitar();
    }
  }

  /**
   * Cambia el texto del botón
   * @param {string} texto 
   */
  establecerTexto(texto) {
    this.elemento.textContent = texto;
    this.guardarMemoria({ text: texto });
  }
}
