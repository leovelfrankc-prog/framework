import { Vista } from "./Vista.js";
import { Formulario } from "../COMPONENTES/Formulario.js";
import { InputTexto } from "../COMPONENTES/InputTexto.js";
import { Select } from "../COMPONENTES/Select.js";
import { Boton } from "../COMPONENTES/Boton.js";

export class VistaPrueba extends Vista {

    inicializar() {

        const formulario = new Formulario();

        const txtNombre = new InputTexto({
            obligatorio: true,
            atributos: {
                placeholder: "Escriba algo"
            }
        });

        const selOpciones = new Select();

        selOpciones
            .agregarOpcion("", "Seleccione...")
            .agregarOpcion("opcion1", "Opción 1")
            .agregarOpcion("opcion2", "Opción 2")
            .agregarOpcion("opcion3", "Opción 3");

        const btnMostrar = new Boton({
            texto: "Mostrar selección"
        });

        btnMostrar.deshabilitar();

        txtNombre.obtenerElemento().addEventListener("input", () => {

            if (txtNombre.esValido()) {
                btnMostrar.habilitar();
            } else {
                btnMostrar.deshabilitar();
            }

        });

        btnMostrar.obtenerElemento().addEventListener("click", () => {

            alert(
                `Valor seleccionado: ${selOpciones.obtenerValor()}`
            );

        });

        formulario
            .registrar("nombre", txtNombre)
            .registrar("opcion", selOpciones);

        formulario.agregar(btnMostrar);

        this.agregar(formulario);
    }

}
