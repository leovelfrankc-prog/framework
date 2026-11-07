import { Input } from "./Input.js";

const email = new Input({
  id: "email",
  className: "campo",
  attributes: {
    type: "email",
    name: "email",
    placeholder: "Correo electrónico",
    required: "true"
  },
  events: {
    change: () => console.log("email cambiado")
  }
});

// Más adelante:
email.obtenerValor();
email.establecerValor("test@mail.com");
email.limpiar();
email.deshabilitar(true);
