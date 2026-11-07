// ============================================
// INPUT
// Hereda de Componente
// ============================================

import { Componente } from "./Componente.js";

export class Input extends Componente {
  /**
   * @param {object} [config={}]
   */
  constructor(config = {}) {
    super("input", config);

    if (!this.elemento.getAttribute("type")) {
      this.elemento.setAttribute("type", "text");
    }

    this.elemento.addEventListener("input", () => {
      this.guardarMemoria({ value: this.elemento.value });
    });
  }

  obtenerValor() {
    return this.elemento.value;
  }

  establecerValor(valor) {
    this.elemento.value = valor;
    this.guardarMemoria({ value: valor });
  }

  limpiar() {
    this.establecerValor("");
  }

  deshabilitar(estado = true) {
    this.elemento.disabled = estado;
    this.guardarMemoria({ disabled: estado });
  }
}
