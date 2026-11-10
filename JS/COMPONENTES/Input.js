// ============================================
// INPUT
// Hereda de Componente
// ============================================

import { Componente } from "./Componente.js";

export class Input extends Componente {
  /**
   * @param {object} [config={}]
   * @param {string} [config.tipoDato="text"] - "text" o "number" para el valor devuelto
   * @param {boolean} [config.obligatorio=false] - Si el campo es obligatorio
   */
  constructor(config = {}) {
    super("input", config);

    this.tipoDato = config.tipoDato || "text";
    this.obligatorio = config.obligatorio || false;

    if (!this.elemento.getAttribute("type")) {
      const typeDefault = this.tipoDato === "number" ? "number" : "text";
      this.elemento.setAttribute("type", typeDefault);
    }

    if (this.obligatorio) {
      this.elemento.setAttribute("required", "true");
    }

    this.elemento.addEventListener("input", () => {
      this.guardarMemoria({ value: this.obtenerValor() });
    });
  }

  /**
   * Obtiene el valor adaptado al tipo especificado (texto o número)
   */
  obtenerValor() {
    const valorCrudo = this.elemento.value;

    if (this.tipoDato === "number") {
      if (valorCrudo === "") return null;
      return Number(valorCrudo);
    }

    return valorCrudo;
  }

  establecerValor(valor) {
    this.elemento.value = valor !== null && valor !== undefined ? valor : "";
    this.guardarMemoria({ value: this.obtenerValor() });
  }

  /**
   * Valida si el campo cumple con la regla de obligatoriedad de forma robusta
   */
  esValido() {
    if (!this.obligatorio) {
      return true;
    }

    const valor = this.obtenerValor();

    // Si es null, undefined o una cadena vacía tras hacer trim, no es válido
    if (valor === null || valor === undefined) {
      return false;
    }

    if (typeof valor === "string" && valor.trim() === "") {
      return false;
    }

    return true;
  }

  limpiar() {
    this.establecerValor("");
  }

  deshabilitar(estado = true) {
    this.elemento.disabled = estado;
    this.guardarMemoria({ disabled: estado });
  }
}
