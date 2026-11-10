import { Contenedor } from "./Contenedor.js";

export class Vista extends Contenedor {

    constructor(id) {

        super("div");

        this.id = id;

        this.elemento.classList.add(
            "vista"
        );
    }

    construir() {
        // Sobrescribir
    }

}
