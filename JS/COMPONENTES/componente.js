// ============================================
// COMPONENTE (clase padre)
// Base de todos los elementos de la UI
// ============================================

export class Componente {
  /**
   * @param {string} tag - Etiqueta HTML (div, input, button, etc.)
   * @param {object} [config] - Configuración inicial opcional
   */
  constructor(tag = "div", config = {}) {
    this.tag = tag;

    // Memoria interna del componente
    this.memoria = {};

    // Referencia al elemento DOM
    this.elemento = null;

    // Guardamos la config inicial en memoria
    this.guardarMemoria(config);

    // Creamos el elemento
    this.crearElemento(tag);

    // Aplicamos la configuración al DOM
    this.aplicarConfiguracion(config);
  }

  /**
   * Crea el elemento DOM
   * @param {string} tag
   */
  crearElemento(tag) {
    this.elemento = document.createElement(tag);
    return this.elemento;
  }

  /**
   * Guarda información en la memoria interna
   * @param {object} datos
   */
  guardarMemoria(datos = {}) {
    this.memoria = {
      ...this.memoria,
      ...datos
    };
  }

  /**
   * Aplica configuración al elemento DOM
   * Apariencia visual → solo con className (CSS)
   * @param {object} config
   */
  aplicarConfiguracion(config = {}) {
    if (!this.elemento) return;

    const { id, className, text, value, attributes, events } = config;

    if (id) {
      this.elemento.id = id;
    }

    // La apariencia se controla solo con clases CSS
    if (className) {
      this.elemento.className = className;
    }

    if (text !== undefined) {
      this.elemento.textContent = text;
    }

    if (value !== undefined && "value" in this.elemento) {
      this.elemento.value = value;
    }

    // Atributos HTML (placeholder, type, disabled, etc.)
    if (attributes && typeof attributes === "object") {
      for (const [clave, valor] of Object.entries(attributes)) {
        this.elemento.setAttribute(clave, valor);
      }
    }

    // Eventos (click, input, change, etc.)
    if (events && typeof events === "object") {
      for (const [evento, handler] of Object.entries(events)) {
        if (typeof handler === "function") {
          this.elemento.addEventListener(evento, handler);
        }
      }
    }

    // Actualizamos la memoria con lo aplicado
    this.guardarMemoria(config);
  }

  /**
   * Devuelve el elemento DOM
   */
  getElemento() {
    return this.elemento;
  }

  /**
   * Lee la memoria interna
   */
  obtenerMemoria() {
    return this.memoria;
  }

  /**
   * Inserta el elemento en un contenedor
   * @param {HTMLElement} contenedor
   */
  render(contenedor) {
    if (contenedor && this.elemento) {
      contenedor.appendChild(this.elemento);
    }
    return this.elemento;
  }
}
