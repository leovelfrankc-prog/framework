import { Contenedor } from "./Contenedor.js";

export class Formulario extends Contenedor {

    constructor(config = {}) {

        super("form", config);

        this.controles = {};
    }

    registrar(nombre, control) {

        this.controles[nombre] = control;

        this.agregar(control);

        return this;
    }

    obtenerControl(nombre) {

        return this.controles[nombre];

    }

    obtenerDatos() {

        const datos = {};

        for (const [nombre, control] of Object.entries(this.controles)) {

            if (
                typeof control.obtenerValor === "function"
            ) {

                datos[nombre] =
                    control.obtenerValor();

            }

        }

        return datos;
    }

    esValido() {

        return Object.values(
            this.controles
        ).every(control => {

            if (
                typeof control.esValido === "function"
            ) {
                return control.esValido();
            }

            return true;

        });

    }

    limpiar() {

        Object.values(
            this.controles
        ).forEach(control => {

            if (
                typeof control.limpiar === "function"
            ) {

                control.limpiar();

            }

        });

        return this;
    }

}
