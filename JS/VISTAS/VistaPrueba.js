import {
    Vista,
    Formulario,
    InputTexto,
    Select,
    Modal
} from "../REGISTRO.js";

export class VistaPrueba extends Vista {
    inicializar() {
        // Contenedor principal
        this.aplicarConfiguracion({
            className:
                "container vh-100 d-flex justify-content-center align-items-center"
        });

        // Creamos el modal una sola vez
        this.modal = new Modal({
            titulo: "Confirmar selección"
        });

        this.modal.establecerTamaño("md");

        // Guardamos los datos actuales para usarlos en el Accept
        this.datosActuales = null;

        // Botones Aceptar / Cancelar (solo se agregan una vez)
        this.modal.agregarBotonesAceptarCancelar({
            textoAceptar: "Aceptar",
            textoCancelar: "Cancelar",
            onAceptar: () => {
                if (this.datosActuales) {
                    alert(
                        `Nombre: ${this.datosActuales.nombre}\nOpción: ${this.datosActuales.opcion}`
                    );
                }
            }
            // onCancelar se puede dejar vacío (solo cierra)
        });

        // Formulario
        const formulario = new Formulario({
            className: "card shadow p-4",
            textoBoton: "Mostrar selección",
            onSubmit: (datos) => {
                // Guardamos los datos
                this.datosActuales = datos;

                // Actualizamos el contenido del modal
                const contenido = document.createElement("div");
                contenido.innerHTML = `
                    <p class="mb-2"><strong>Nombre:</strong> ${datos.nombre}</p>
                    <p class="mb-0"><strong>Opción:</strong> ${datos.opcion}</p>
                `;

                this.modal.establecerCuerpo(contenido);
                this.modal.abrir();
            }
        });

        formulario.obtenerElemento().style.width = "350px";

        // Campo requerido
        const txtNombre = new InputTexto({
            obligatorio: true,
            className: "form-control mb-3",
            atributos: {
                placeholder: "Escriba algo"
            }
        });

        // Select
        const selOpciones = new Select({
            className: "form-select mb-3"
        });

        selOpciones
            .agregarOpcion("", "Seleccione...")
            .agregarOpcion("opcion1", "Opción 1")
            .agregarOpcion("opcion2", "Opción 2")
            .agregarOpcion("opcion3", "Opción 3");

        // Registrar controles
        formulario
            .registrar("nombre", txtNombre)
            .registrar("opcion", selOpciones);

        // Agregar formulario a la vista
        this.agregar(formulario);
    }
}
