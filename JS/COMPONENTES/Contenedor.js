// ============================================
// CONTENEDOR
// Hereda de Componente y agrupa hijos
// ============================================

import { Componente } from "./Componente.js";

export class Contenedor extends Componente {
  /**
   * @param {string} [tag="div"]
   * @param {object} [config={}]
   */
  constructor(tag = "div", config = {}) {
    super(tag, config);

    // Lista ordenada de hijos
    this.hijos = [];
  }

  /**
   * Agrega un hijo y guarda la instancia (no solo su memoria)
   * @param {Componente} hijo
   * @param {string} [nombre] - Clave para acceder luego: this.memoria[nombre]
   */
  agregarHijo(hijo, nombre = null) {
    if (!hijo || typeof hijo.getElemento !== "function") {
      console.error("agregarHijo: el hijo debe ser un Componente válido");
      return;
    }

    this.hijos.push(hijo);
    this.elemento.appendChild(hijo.getElemento());

    // Guardamos la instancia completa
    const clave = nombre || `hijo_${this.hijos.length - 1}`;
    this.guardarMemoria({
      [clave]: hijo
    });

    return hijo;
  }

  /**
   * Agrega varios hijos
   * @param {Array} lista - componentes o { nombre, componente }
   */
  agregarHijos(lista = []) {
    for (const item of lista) {
      if (item && item.componente) {
        this.agregarHijo(item.componente, item.nombre);
      } else {
        this.agregarHijo(item);
      }
    }
  }

  /**
   * Devuelve todos los hijos
   */
  obtenerHijos() {
    return this.hijos;
  }

  /**
   * Busca un hijo por la clave con la que se guardó en memoria
   * @param {string} nombre
   */
  obtenerHijo(nombre) {
    return this.memoria[nombre] || null;
  }

  /**
   * Renderiza el contenedor (con sus hijos ya dentro)
   * @param {HTMLElement} contenedorPadre
   */
  render(contenedorPadre) {
    if (contenedorPadre && this.elemento) {
      contenedorPadre.appendChild(this.elemento);
    }
    return this.elemento;
  }
}
