// ============================================
// FORMULARIO (Versión Final Unificada)
// ============================================

import { Contenedor } from "./Contenedor.js";
import { Boton } from "./Boton.js";

export class Formulario extends Contenedor {
  constructor(config = {}) {
    super("form", config);

    this.config = config;
    this.botonSubmit = null;
    this.tieneCamposObligatorios = false;

    // Interceptamos el evento submit
    this.elemento.addEventListener("submit", async (e) => {
      e.preventDefault();

      // 1. Opcional: Validación nativa del navegador por si acaso
      if (typeof this.elemento.checkValidity === "function" && !this.elemento.checkValidity()) {
        this.elemento.reportValidity();
        return;
      }

      // 2. Validación estricta propia de las clases
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
   * Registra los hijos y evalúa si existen campos obligatorios
   */
  agregarHijo(hijo, nombre = null) {
    super.agregarHijo(hijo, nombre);

    if (hijo && hijo.obligatorio === true) {
      this.tieneCamposObligatorios = true;
    }

    const elDom = hijo.getElemento();
    if (elDom) {
      elDom.addEventListener("input", () => this.verificarEstadoBoton());
      elDom.addEventListener("change", () => this.verificarEstadoBoton());
    }

    // Si el botón ya fue creado, actualizamos su estado en tiempo real
    if (this.botonSubmit) {
      this.verificarEstadoBoton();
    }

    return hijo;
  }

  /**
   * ORDEN CORRECTO: Primero se agregan todos los hijos. 
   * Cuando el motor manda a renderizar, creamos el botón al final y evaluamos.
   */
  render(contenedorPadre) {
    const el = super.render(contenedorPadre);

    if (!this.botonSubmit) {
      this._crearBotonAlFinal(this.config);
    }

    return el;
  }

  _crearBotonAlFinal(config) {
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
    this.guardarMemoria({ submit: this.botonSubmit });
    this.elemento.appendChild(this.botonSubmit.getElemento());

    // Nace evaluando inmediatamente el estado (sale deshabilitado si está vacío)
    this.verificarEstadoBoton();
  }

  /**
   * Validación estricta para el envío (solo campos obligatorios)
   */
  esValido() {
    for (const hijo of this.hijos) {
      if (hijo === this.botonSubmit) continue;

      if (typeof hijo.esValido === "function" && !hijo.esValido()) {
        return false;
      }
    }
    return true;
  }

  /**
   * Determina si el formulario tiene suficiente contenido para habilitar el botón.
   * - Si hay campos obligatorios → todos deben estar válidos.
   * - Si NO hay campos obligatorios → al menos un campo debe tener contenido.
   */
  tieneContenidoSuficiente() {
    // 1. Todos los campos obligatorios deben estar completos
    if (!this.esValido()) {
      return false;
    }

    // 2. Si no hay campos obligatorios, exigimos al menos un campo con valor
    if (!this.tieneCamposObligatorios) {
      let tieneAlMenosUno = false;
      for (const hijo of this.hijos) {
        if (hijo === this.botonSubmit) continue;

        if (typeof hijo.obtenerValor === "function") {
          const valor = hijo.obtenerValor();
          if (valor !== null && valor !== undefined && String(valor).trim() !== "") {
            tieneAlMenosUno = true;
            break;
          }
        } else if (typeof hijo.obtenerArchivo === "function") {
          if (hijo.obtenerArchivo()) {
            tieneAlMenosUno = true;
            break;
          }
        }
      }
      return tieneAlMenosUno;
    }

    // Si hay campos obligatorios y ya pasaron esValido(), está listo
    return true;
  }

  verificarEstadoBoton() {
    if (!this.botonSubmit) return;

    const debeDeshabilitar = !this.tieneContenidoSuficiente();

    if (debeDeshabilitar) {
      this.botonSubmit.deshabilitar();
    } else {
      this.botonSubmit.habilitar();
    }
  }

  bloquearEnvio(bloquear = true) {
    if (!this.botonSubmit) return;

    if (bloquear) {
      this.botonSubmit.deshabilitar();
    } else {
      this.botonSubmit.habilitar();
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
