// Input numérico obligatorio
const inputEdad = new Input({
  id: "edad",
  tipoDato: "number",      // Automáticamente convierte el resultado a número
  obligatorio: true,       // Añade el atributo required y permite validar
  attributes: {
    type: "number",
    placeholder: "Edad"
  }
});

// Input de texto normal
const inputNombre = new Input({
  id: "nombre",
  tipoDato: "text",
  attributes: {
    type: "text",
    placeholder: "Nombre"
  }
});
