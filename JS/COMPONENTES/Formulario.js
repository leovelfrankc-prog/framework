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
    this.tieneCamposObligatorios = false;

    // Interceptamos el evento submit
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
   * Cuando el motor manda a renderizar, sabemos que la estructura está completa, 
   * por lo que creamos y nacemos el botón evaluando los campos previos.
   */
  render(contenedorPadre) {
    // 1. Renderizamos primero todos los hijos ya recolectados
    const el = super.render(contenedorPadre);

    // 2. UNA VEZ insertados los hijos, creamos y nacemos el botón al final
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

    // Lo registramos y lo colocamos físicamente al final del DOM del formulario
    this.hijos.push(this.botonSubmit);
    this.guardarMemoria({ submit: this.botonSubmit });
    this.elemento.appendChild(this.botonSubmit.getElemento());

    // Nace evaluando inmediatamente el estado de los hijos ya insertados
    this.verificarEstadoBoton();
  }

  esValido() {
    for (const hijo of this.hijos) {
      if (hijo === this.botonSubmit) continue;

      if (typeof hijo.esValido === "function" && !hijo.esValido()) {
        return false;
      }
    }
    return true;
  }

  verificarEstadoBoton() {
    if (!this.botonSubmit) return;

    let debeDeshabilitar = false;

    if (this.tieneCamposObligatorios) {
      debeDeshabilitar = !this.esValido();
    }

    if (typeof this.botonSubmit.deshabilitar === "function") {
      this.botonSubmit.deshabilitar(debeDeshabilitar);
    } else {
      this.botonSubmit.getElemento().disabled = debeDeshabilitar;
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
