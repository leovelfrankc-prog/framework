import { Componente } from "./Componente.js";

export class InputTexto extends Componente {

    constructor(config = {}) {

        super("input");

        this.elemento.type = "text";

        this.obligatorio = Boolean(config.obligatorio);

        if (config.id) {
            this.elemento.id = config.id;
        }

        if (config.className) {
            this.elemento.className = config.className;
        }

        if (config.placeholder) {
            this.elemento.placeholder = config.placeholder;
        }

        if (this.obligatorio) {
            this.elemento.required = true;
        }

        this.elemento.addEventListener("input", () => {
            this.guardarMemoria({
                valor: this.obtenerValor()
            });
        });

        this.guardarMemoria({
            valor: ""
        });
    }

    obtenerValor() {
        return this.elemento.value;
    }

    establecerValor(valor = "") {

        this.elemento.value = valor;

        this.guardarMemoria({
            valor
        });

        return this;
    }

    limpiar() {
        return this.establecerValor("");
    }

    esValido() {

        if (!this.obligatorio) {
            return true;
        }

        return this.obtenerValor().trim() !== "";
    }

    deshabilitar() {
        this.elemento.disabled = true;
        return this;
    }

    habilitar() {
        this.elemento.disabled = false;
        return this;
    }
}
