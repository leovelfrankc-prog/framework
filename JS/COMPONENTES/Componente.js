export class Componente {

    constructor(tag) {

        if (!tag) {
            throw new Error("Debe especificarse una etiqueta HTML.");
        }

        this.tag = tag;
        this.elemento = document.createElement(tag);
        this.memoria = {};
    }

    aplicarConfiguracion(config = {}) {

        const {
            id,
            className,
            atributos,
            eventos,
            oculto,
            deshabilitado
        } = config;

        if (id) {
            this.elemento.id = id;
        }

        if (className) {
            this.elemento.className = className;
        }

        if (atributos) {

            for (const [nombre, valor] of Object.entries(atributos)) {

                this.elemento.setAttribute(
                    nombre,
                    valor
                );

            }

        }

        if (eventos) {

            for (const [evento, handler] of Object.entries(eventos)) {

                if (typeof handler === "function") {

                    this.elemento.addEventListener(
                        evento,
                        handler
                    );

                }

            }

        }

        if (oculto) {
            this.ocultar();
        }

        if (deshabilitado) {
            this.deshabilitar();
        }

        this.guardarMemoria(config);

        return this;
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

    getElemento() {
        return this.elemento;
    }

    habilitar() {

        if ("disabled" in this.elemento) {

            this.elemento.disabled = false;

        }

        return this;
    }

    deshabilitar() {

        if ("disabled" in this.elemento) {

            this.elemento.disabled = true;

        }

        return this;
    }

    mostrar() {

        this.elemento.hidden = false;

        return this;
    }

    ocultar() {

        this.elemento.hidden = true;

        return this;
    }

}
