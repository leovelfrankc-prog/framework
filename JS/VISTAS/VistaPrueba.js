// ============================================
// VISTA PRUEBA
// Utiliza la clase Formulario con botón por defecto
// ============================================

import { Formulario } from "../COMPONENTES/Formulario.js";
import { Input } from "../COMPONENTES/Input.js";
import { Componente } from "../COMPONENTES/Componente.js";
// Nota: Ya no necesitamos importar 'Boton' aquí si el formulario lo gestiona solo.

export class VistaPrueba {
  constructor() {
    // Contenedor principal (Formulario) con el botón integrado por defecto
    this.raiz = new Formulario({
      id: "vista-prueba",
      className: "vista vista-prueba",
      textoBoton: "Saludar",       // Texto que tendrá el botón generado automáticamente
      classNameBoton: "btn btn-primario", // Clases opcionales para estilizarlo
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

    // Input de nombre (obligatorio: mantendrá el botón del formulario desactivado hasta que escribas algo)
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

    // Zona de resultado
    const resultado = new Componente("p", {
      id: "resultado",
      className: "resultado",
      text: ""
    });

    // Insertamos los elementos en el formulario raíz (el botón se añade solo al final)
    this.raiz.agregarHijo(titulo, "titulo");
    this.raiz.agregarHijo(inputNombre, "nombre");
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
