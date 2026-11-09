// ============================================
// VISTA PRUEBA
// Utiliza la clase Formulario
// ============================================

import { Formulario } from "../COMPONENTES/Formulario.js";
import { Input } from "../COMPONENTES/Input.js";
import { Boton } from "../COMPONENTES/Boton.js";
import { Componente } from "../COMPONENTES/Componente.js";

export class VistaPrueba {
  constructor() {
    // Contenedor principal ahora es un Formulario
    this.raiz = new Formulario({
      id: "vista-prueba",
      className: "vista vista-prueba",
      onSubmit: (datos) => {
        this.saludar(datos);
      }
    });

    this.construir();
  }

  /**
   * Arma la estructura de la vista
   */
  construir() {
    // Título
    const titulo = new Componente("h2", {
      text: "Vista de prueba con Formulario",
      className: "titulo"
    });

    // Input de nombre (lo marcamos como obligatorio para que el formulario controle el botón)
    const inputNombre = new Input({
      id: "nombre",
      className: "campo",
      obligatorio: true,
      attributes: {
        type: "text",
        name: "nombre",
        placeholder: "Escribe tu nombre"
      }
    });

    // Botón de envío (submit)
    const botonSaludar = new Boton({
      id: "btn-saludar",
      className: "btn btn-primario",
      text: "Saludar",
      attributes: {
        type: "submit" // Importante para que el formulario lo identifique como disparador
      }
    });

    // Zona de resultado
    const resultado = new Componente("p", {
      id: "resultado",
      className: "resultado",
      text: ""
    });

    // Insertamos todo en el formulario raíz registrando las claves
    this.raiz.agregarHijo(titulo, "titulo");
    this.raiz.agregarHijo(inputNombre, "nombre");
    this.raiz.agregarHijo(botonSaludar, "submit"); // Identificado como "submit" para el control automático
    this.raiz.agregarHijo(resultado, "resultado");
  }

  /**
   * Lógica ejecutada automáticamente por el onSubmit del Formulario
   * @param {Object} datos - Objeto empaquetado con los valores del formulario
   */
  saludar(datos) {
    const resultado = this.raiz.obtenerHijo("resultado");
    const nombre = datos.nombre ? datos.nombre.trim() : "";

    if (!nombre) {
      resultado.getElemento().textContent = "Escribe un nombre primero.";
      return;
    }

    resultado.getElemento().textContent = `Hola, ${nombre}`;
  }

  /**
   * Motor llama a este método para montar la vista
   * @param {HTMLElement} contenedor
   */
  render(contenedor) {
    this.raiz.render(contenedor);
  }
}
