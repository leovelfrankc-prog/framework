export function construirModuloVista(nombre) {
  console.log(`(stub) construirModuloVista("${nombre}")`);

  // Mock temporal hasta que creemos las vistas reales
  return {
    render(contenedor) {
      contenedor.innerHTML = `<h2>Vista mock: ${nombre}</h2>`;
    }
  };
}
