// ============================================
// FACTORY DE VISTAS
// Construye la instancia de la vista según su nombre
// ============================================

// Más adelante importaremos las vistas reales:
// import { VistaPrueba } from "./VistaPrueba.js";

/**
 * Mapa nombre → clase (o función constructora)
 * Por ahora usamos un mock hasta crear VistaPrueba
 */
const registroVistas = new Map([
  // ["Prueba", VistaPrueba],  // ← cuando exista la clase real
]);

/**
 * Construye y devuelve una instancia de la vista
 * @param {string} nombre
 * @returns {object|null} instancia con método render()
 */
export function construirModuloVista(nombre) {
  if (!nombre) {
    console.error("construirModuloVista: falta el nombre");
    return null;
  }

  // Si la vista está registrada, la instanciamos
  const ClaseVista = registroVistas.get(nombre);

  if (ClaseVista) {
    console.log(`Construyendo vista real: "${nombre}"`);
    return new ClaseVista();
  }

  // Fallback temporal (mock) mientras no existan las clases
  console.warn(`Vista "${nombre}" no registrada. Usando mock.`);
  return {
    render(contenedor) {
      contenedor.innerHTML = `
        <h2>Vista mock: ${nombre}</h2>
        <p>Esta vista aún no tiene clase real.</p>
      `;
    }
  };
}
