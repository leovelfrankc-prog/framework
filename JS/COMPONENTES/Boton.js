// ============================================
// BOTON
// Hereda de Componente
// ============================================

import { Componente } from "./Componente.js";

export class Boton extends Componente {
  /**
   * @param {object} [config={}]
   * config puede incluir:
   * - id, className, text
   * - attributes: { type, disabled, ... }
   * - events: { click, ... }
   */
  constructor(config = {}) {
    super("button", config);

    // Si no trajeron type, usamos "button" (evita submit accidental en forms)
    if (!this.elemento.getAttribute("type")) {
      this.elemento.setAttribute("type", "button");
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

  /**
   * Devuelve el texto actual
   */
  obtenerTexto() {
    return this.elemento.textContent;
  }

  /**
   * Habilita o deshabilita el botón
   * @param {boolean} estado
   */
  deshabilitar(estado = true) {
    this.elemento.disabled = estado;
    this.guardarMemoria({ disabled: estado });
  }

  /**
   * Asigna (o reemplaza) el handler de click
   * @param {Function} handler
   */
  alHacerClick(handler) {
    if (typeof handler !== "function") return;

    this.elemento.addEventListener("click", handler);
    this.guardarMemoria({ tieneClick: true });
  }
}
