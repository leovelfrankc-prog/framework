// ============================================
// INPUT ARCHIVO / IMAGEN
// ============================================

import { Componente } from "./Componente.js";

export class InputArchivo extends Componente {
  /**
   * @param {object} [config={}]
   */
  constructor(config = {}) {
    super("input", config);

    // Asegurar que sea de tipo file y acepte imágenes por defecto si se requiere
    this.elemento.setAttribute("type", "file");
    if (!this.elemento.getAttribute("accept")) {
      this.elemento.setAttribute("accept", "image/*");
    }

    // Escuchamos el cambio para guardar el archivo en la memoria
    this.elemento.addEventListener("change", (e) => {
      const archivo = e.target.files[0] || null;
      
      this.guardarMemoria({ 
        file: archivo,
        nombre: archivo ? archivo.name : null
      });
    });
  }

  /**
   * Devuelve el objeto File seleccionado
   */
  obtenerArchivo() {
    return this.elemento.files[0] || null;
  }

  /**
   * Genera una URL temporal para vista previa de la imagen
   */
  obtenerURLTemporal() {
    const archivo = this.obtenerArchivo();
    return archivo ? URL.createObjectURL(archivo) : null;
  }

  limpiar() {
    this.elemento.value = "";
    this.guardarMemoria({ file: null, nombre: null });
  }
}
