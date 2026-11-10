export class Componente {

    constructor(tag) {

        if (!tag) {
            throw new Error("Debe indicar un tag HTML.");
        }

        this.tag = tag;
        this.elemento = document.createElement(tag);
        this.memoria = {};
    }

    getElemento() {
        return this.elemento;
    }

    guardarMemoria(datos = {}) {

        Object.assign(
            this.memoria,
            datos
        );

        return this;
    }

    obtenerMemoria() {
        return { ...this.memoria };
    }
}
