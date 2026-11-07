// ============================================
// VISTA PRUEBA
// Une Contenedor + Input + Boton
// ============================================

import { Contenedor } from "../COMPONENTES/Contenedor.js";
import { Input } from "../COMPONENTES/Input.js";
import { Boton } from "../COMPONENTES/Boton.js";
import { Componente } from "../COMPONENTES/Componente.js";

export class VistaPrueba {
  constructor() {
    // Contenedor principal de la vista
    this.raiz = new Contenedor("section", {
      id: "vista-prueba",
      className: "vista vista-prueba"
    });

    this.construir();
  }

  /**
   * Arma la estructura de la vista
   */
  construir() {
    // Título
    const titulo = new Componente("h2", {
      text: "Vista de prueba",
      className: "titulo"
    });

    // Input de nombre
    const inputNombre = new Input({
      id: "nombre",
      className: "campo",
      attributes: {
        type: "text",
        name: "nombre",
        placeholder: "Escribe tu nombre"
      }
    });

    // Botón
    const botonSaludar = new Boton({
      id: "btn-saludar",
      className: "btn btn-primario",
      text: "Saludar",
      events: {
        click: () => this.saludar()
      }
    });

    // Zona de resultado
    const resultado = new Componente("p", {
      id: "resultado",
      className: "resultado",
      text: ""
    });

    // Insertamos todo en el contenedor raíz
    this.raiz.agregarHijo(titulo, "titulo");
    this.raiz.agregarHijo(inputNombre, "nombre");
    this.raiz.agregarHijo(botonSaludar, "saludar");
    this.raiz.agregarHijo(resultado, "resultado");
  }

  /**
   * Lógica de ejemplo: lee el input y muestra un mensaje
   */
  saludar() {
    const input = this.raiz.obtenerHijo("nombre");
    const resultado = this.raiz.obtenerHijo("resultado");

    const nombre = input.obtenerValor().trim();

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
