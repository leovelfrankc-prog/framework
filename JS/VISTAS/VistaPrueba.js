import {
    Vista,
    Formulario,
    InputTexto,
    Select
} from "../REGISTRO.js";
export class VistaPrueba extends Vista {

    inicializar() {

        // Contenedor principal
        this.aplicarConfiguracion({
            className:
                "container vh-100 d-flex justify-content-center align-items-center"
        });

        // Formulario
        const formulario = new Formulario({

            className: "card shadow p-4",

            textoBoton: "Mostrar selección",

            onSubmit: datos => {

                alert(
                    `Nombre: ${datos.nombre}
Opción: ${datos.opcion}`
                );

            }

        });

        formulario.obtenerElemento().style.width =
            "350px";

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
