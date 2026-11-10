import { Componente } from "./Componente.js";

export class Contenedor extends Componente {

    constructor(tag = "div") {

        super(tag);

        this.hijos = [];
    }

    agregar(componente) {

        if (!(componente instanceof Componente)) {
            throw new Error(
                "Solo pueden agregarse Componentes."
            );
        }

        this.hijos.push(componente);

        this.elemento.append(
            componente.getElemento()
        );

        return this;
    }

    eliminar(componente) {

        const indice = this.hijos.indexOf(componente);

        if (indice >= 0) {

            this.hijos.splice(
                indice,
                1
            );

            componente
                .getElemento()
                .remove();
        }

        return this;
    }

    vaciar() {

        this.hijos = [];

        this.elemento.replaceChildren();

        return this;
    }

    obtenerHijos() {
        return [...this.hijos];
    }
}
