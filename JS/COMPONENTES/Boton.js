import { Componente } from "./Componente.js";

export class Boton extends Componente {

    constructor(config = {}) {

        super("button");

        this.elemento.type = "button";

        if (config.id) {
            this.elemento.id = config.id;
        }

        if (config.className) {
            this.elemento.className = config.className;
        }

        if (config.texto) {
            this.elemento.textContent = config.texto;
        }

        if (typeof config.onClick === "function") {

            this.elemento.addEventListener(
                "click",
                config.onClick
            );
        }
    }

    establecerTexto(texto) {

        this.elemento.textContent = texto;

        return this;
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
