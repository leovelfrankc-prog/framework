import {
    Vista,
    Formulario,
    InputTexto,
    Select,
    Modal,
    Boton
} from "../REGISTRO.js";

export class VistaPrueba extends Vista {
    inicializar() {
        // Contenedor principal
        this.aplicarConfiguracion({
            className:
                "container vh-100 d-flex justify-content-center align-items-center"
        });

        // ========== FORMULARIO ==========
        const formulario = new Formulario({
            className: "p-1",
            textoBoton: "Mostrar selección",
            onSubmit: (datos) => {
                alert(
                    `Nombre: ${datos.nombre}\nOpción: ${datos.opcion}`
                );
                this.modal.cerrar(); // Cerrar el modal al enviar
            }
        });

        // Campo nombre
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

        // ========== MODAL ==========
        this.modal = new Modal({
            titulo: "Formulario de prueba"
        });

        this.modal.establecerTamaño("md");
        this.modal.establecerCuerpo(formulario);

        
        // ========== BOTÓN QUE ABRE EL MODAL ==========
        const btnPrueba = new Boton({
            texto: "Prueba",
            className: "btn btn-primary btn-lg"
        });

        btnPrueba.elemento.addEventListener("click", () => {
            this.modal.abrir();
        });

        // Agregar el botón a la vista
        this.agregar(btnPrueba);
    }
}
