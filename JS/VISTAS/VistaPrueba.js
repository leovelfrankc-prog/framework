import { Vista } from "../COMPONENTES/Vista.js";
import { Formulario } from "../COMPONENTES/Formulario.js";
import { InputTexto } from "../COMPONENTES/InputTexto.js";
import { Select } from "../COMPONENTES/Select.js";
import { Boton } from "../COMPONENTES/Boton.js";

export class VistaPrueba extends Vista {

    inicializar() {

        // Contenedor principal centrado
        this.aplicarConfiguracion({
            className:
                "container vh-100 d-flex justify-content-center align-items-center"
        });

        // Formulario estilo login
        const formulario = new Formulario({
            className: "card shadow p-4"
        });

        formulario.obtenerElemento().style.width = "350px";

        // Input requerido
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

        // Botón
        const btnMostrar = new Boton({
            texto: "Mostrar selección",
            className: "btn btn-primary w-100"
        });

        btnMostrar.deshabilitar();

        // Habilitar / deshabilitar botón
        txtNombre.obtenerElemento().addEventListener(
            "input",
            () => {

                if (txtNombre.esValido()) {

                    btnMostrar.habilitar();

                } else {

                    btnMostrar.deshabilitar();

                }

            }
        );

        // Acción del botón
        btnMostrar.obtenerElemento().addEventListener(
            "click",
            () => {

                alert(
                    `Valor seleccionado: ${selOpciones.obtenerValor()}`
                );

            }
        );

        // Registrar controles
        formulario
            .registrar("nombre", txtNombre)
            .registrar("opcion", selOpciones);

        formulario.agregar(btnMostrar);

        // Agregar formulario a la vista
        this.agregar(formulario);

    }

}
