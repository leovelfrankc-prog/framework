// ============================================
// FORMULARIO (Actualizado con control de botón)
// ============================================

import { Contenedor } from "./Contenedor.js";

export class Formulario extends Contenedor {
  /**
   * @param {object} [config={}]
   * @param {Function} [config.onSubmit] - Callback asíncrono o sincrónico al enviar
   * @param {string} [config.idBotonSubmit] - ID opcional del botón de envío si se agregó como hijo
   */
  constructor(config = {}) {
    super("form", config);

    this.config = config;
    this.botonSubmit = null;

    // Interceptamos el evento submit
    this.elemento.addEventListener("submit", async (e) => {
      e.preventDefault();

      if (!this.esValido()) {
        console.warn("Formulario incompleto o inválido.");
        return;
      }

      // Desactivar botón para evitar doble envío
      this.bloquearEnvio(true);

      try {
        if (typeof this.config.onSubmit === "function") {
          // Si la función de envío es asíncrona (como fetch a Google Apps Script), esperamos
          await this.config.onSubmit(this.obtenerDatos(), this);
        }
      } catch (error) {
        console.error("Error en el envío del formulario:", error);
      } finally {
        // Opcional: reactivar al terminar o dejarlo bloqueado según tu flujo
        this.verificarEstadoBoton();
      }
    });
  }

  /**
   * Extendemos agregarHijo para detectar inputs y escuchar cambios en tiempo real
   */
  agregarHijo(hijo, nombre = null) {
    super.agregarHijo(hijo, nombre);

    // Si el hijo es un botón de envío (puedes identificarlo por su id o clase)
    if (nombre === "submit" || hijo.getElemento().type === "submit") {
      this.botonSubmit = hijo;
      this.verificarEstadoBoton(); // Estado inicial
    }

    // Si el componente hijo emite eventos de cambio o input, actualizamos el botón
    const elDom = hijo.getElemento();
    if (elDom) {
      elDom.addEventListener("input", () => this.verificarEstadoBoton());
      elDom.addEventListener("change", () => this.verificarEstadoBoton());
    }

    return hijo;
  }

  /**
   * Revisa si todos los campos obligatorios están completos
   */
  esValido() {
    for (const hijo of this.hijos) {
      if (typeof hijo.esValido === "function" && !hijo.esValido()) {
        return false;
      }
    }
    return true;
  }

  /**
   * Activa o desactiva el botón de envío según la validez del formulario
   */
  verificarEstadoBoton() {
    if (!this.botonSubmit) return;

    const formularioValido = this.esValido();
    
    // Usamos el método deshabilitar() que ya tienen tus componentes o la propiedad directa
    if (typeof this.botonSubmit.deshabilitar === "function") {
      this.botonSubmit.deshabilitar(!formularioValido);
    } else {
      this.botonSubmit.getElemento().disabled = !formularioValido;
    }
  }

  /**
   * Bloquea o desbloquea forzosamente el botón (usado durante el envío)
   */
  bloquearEnvio(bloquear = true) {
    if (!this.botonSubmit) return;

    if (typeof this.botonSubmit.deshabilitar === "function") {
      this.botonSubmit.deshabilitar(bloquear);
    } else {
      this.botonSubmit.getElemento().disabled = bloquear;
    }
  }

  /**
   * Recorre los hijos y empaqueta sus valores
   */
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
