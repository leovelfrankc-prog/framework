import { Componente } from "./Componente.js";

export class InputArchivo extends Componente {

    constructor(config = {}) {

        super("input");

        this.elemento.type = "file";

        this.obligatorio = Boolean(
            config.obligatorio
        );

        this.archivo = null;
        this.base64 = null;

        if (this.obligatorio) {
            this.elemento.required = true;
        }

        this.aplicarConfiguracion(config);

        this.elemento.addEventListener(
            "change",
            async () => {

                await this.procesarArchivo();

            }
        );

    }

    async procesarArchivo() {

        this.archivo =
            this.elemento.files[0] || null;

        if (!this.archivo) {

            this.base64 = null;

            return;
        }

        this.base64 =
            await this.convertirABase64(
                this.archivo
            );

        this.guardarMemoria({
            nombre: this.archivo.name,
            tipo: this.archivo.type,
            tamano: this.archivo.size,
            base64: this.base64
        });

    }

    convertirABase64(archivo) {

        return new Promise(
            (resolve, reject) => {

                const lector =
                    new FileReader();

                lector.onload =
                    () => resolve(
                        lector.result
                    );

                lector.onerror =
                    reject;

                lector.readAsDataURL(
                    archivo
                );

            }
        );

    }

    obtenerArchivo() {

        return this.archivo;

    }

    obtenerBase64() {

        return this.base64;

    }

    obtenerNombre() {

        return this.archivo
            ? this.archivo.name
            : null;

    }

    obtenerTipo() {

        return this.archivo
            ? this.archivo.type
            : null;

    }

    obtenerTamano() {

        return this.archivo
            ? this.archivo.size
            : null;

    }

    obtenerValor() {

        return this.base64;

    }

    limpiar() {

        this.elemento.value = "";

        this.archivo = null;
        this.base64 = null;

        return this;
    }

    esValido() {

        if (!this.obligatorio) {
            return true;
        }

        return this.archivo !== null;
    }

}
