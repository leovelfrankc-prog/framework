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

    // Estado booleano: se vuelve true en cuanto al menos un hijo es obligatorio
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
   * Sobrescribimos render para asegurarnos de crear y añadir el botón 
   * DESPUÉS de que todos los hijos ya fueron agregados a la vista.
   */
  render(contenedorPadre) {
    const el = super.render(contenedorPadre);

    if (!this.botonSubmit) {
      this._crearBotonPorDefecto(this.config);
    }

    return el;
  }

  _crearBotonPorDefecto(config) {
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

    // Evaluamos el estado inicial consultando directamente nuestra bandera
    this.verificarEstadoBoton();
  }

  /**
   * Evaluamos la obligatoriedad en tiempo de incorporación de cada hijo
   */
  agregarHijo(hijo, nombre = null) {
    super.agregarHijo(hijo, nombre);

    // Si el hijo recién agregado tiene la propiedad obligatorio en true, 
    // encendemos permanentemente la bandera del formulario.
    if (hijo && hijo.obligatorio === true) {
      this.tieneCamposObligatorios = true;
    }

    const elDom = hijo.getElemento();
    if (elDom) {
      elDom.addEventListener("input", () => this.verificarEstadoBoton());
      elDom.addEventListener("change", () => this.verificarEstadoBoton());
    }

    if (this.botonSubmit) {
      this.verificarEstadoBoton();
    }

    return hijo;
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

    // Regla solicitada: si existen campos obligatorios, evaluamos si el formulario es válido.
    // Si hay obligatorios y aún no están llenos/válidos -> el botón se desactiva.
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
