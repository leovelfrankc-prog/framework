import { Componente } from "./Componente.js";
import { Contenedor } from "./Contenedor.js";
import { Boton } from "./Boton.js";

export class Modal extends Contenedor {
    constructor(config = {}) {
        super("div", {
            className: "modal fade",
            atributos: {
                tabindex: "-1",
                "aria-hidden": "true"
            },
            ...config
        });

        this.estaAbierto = false;
        this.cerrarAlClickFuera = config.cerrarAlClickFuera !== false;
        this.cerrarConEscape = config.cerrarConEscape !== false;

        // Estructura Bootstrap
        this.dialogo = new Contenedor("div", {
            className: "modal-dialog"
        });

        this.contenido = new Contenedor("div", {
            className: "modal-content"
        });

        this.cabecera = new Contenedor("div", {
            className: "modal-header"
        });

        this.titulo = new Componente("h5");
        this.titulo.elemento.className = "modal-title";
        this.titulo.elemento.textContent = config.titulo || "";

        // Botón cerrar (X)
        this.botonCerrar = new Boton({
            className: "btn-close",
            atributos: {
                "aria-label": "Cerrar"
            }
        });

        this.cuerpo = new Contenedor("div", {
            className: "modal-body"
        });

        this.pie = new Contenedor("div", {
            className: "modal-footer"
        });

        // Armar estructura
        this.cabecera
            .agregar(this.titulo)
            .agregar(this.botonCerrar);

        this.contenido
            .agregar(this.cabecera)
            .agregar(this.cuerpo)
            .agregar(this.pie);

        this.dialogo.agregar(this.contenido);
        this.agregar(this.dialogo);

        // Eventos
        this.botonCerrar.elemento.addEventListener("click", () => this.cerrar());

        this.elemento.addEventListener("click", (e) => {
            if (this.cerrarAlClickFuera && e.target === this.elemento) {
                this.cerrar();
            }
        });

        this._manejarEscape = (e) => {
            if (e.key === "Escape" && this.estaAbierto && this.cerrarConEscape) {
                this.cerrar();
            }
        };

        // Estado inicial
        this.ocultar();
        this.guardarMemoria({ estaAbierto: false });
    }

    establecerTitulo(texto = "") {
        this.titulo.elemento.textContent = texto;
        return this;
    }

    establecerCuerpo(componenteOElemento) {
        this.cuerpo.vaciar();

        if (componenteOElemento instanceof Componente) {
            this.cuerpo.agregar(componenteOElemento);
        } else if (componenteOElemento instanceof HTMLElement) {
            this.cuerpo.elemento.append(componenteOElemento);
        }

        return this;
    }

    agregarAlCuerpo(componente) {
        this.cuerpo.agregar(componente);
        return this;
    }

    establecerPie(componenteOElemento) {
        this.pie.vaciar();

        if (componenteOElemento instanceof Componente) {
            this.pie.agregar(componenteOElemento);
        } else if (componenteOElemento instanceof HTMLElement) {
            this.pie.elemento.append(componenteOElemento);
        }

        return this;
    }

    agregarAlPie(componente) {
        this.pie.agregar(componente);
        return this;
    }

    /**
     * Agrega uno o varios botones personalizados al footer
     */
    agregarBotones(...botones) {
        botones.forEach(boton => {
            if (boton instanceof Componente) {
                this.pie.agregar(boton);
            }
        });
        return this;
    }

    /**
     * Agrega los botones Aceptar y Cancelar (solo si se necesitan)
     * @param {Object} opciones
     * @param {string} [opciones.textoAceptar="Aceptar"]
     * @param {string} [opciones.textoCancelar="Cancelar"]
     * @param {string} [opciones.claseAceptar="btn btn-primary"]
     * @param {string} [opciones.claseCancelar="btn btn-secondary"]
     * @param {Function|null} [opciones.onAceptar=null] - Callback al pulsar Aceptar
     * @param {Function|null} [opciones.onCancelar=null] - Callback al pulsar Cancelar
     * @param {boolean} [opciones.cerrarAlAceptar=true] - Cerrar el modal al aceptar
     * @param {boolean} [opciones.cerrarAlCancelar=true] - Cerrar el modal al cancelar
     */
    agregarBotonesAceptarCancelar(opciones = {}) {
        const {
            textoAceptar = "Aceptar",
            textoCancelar = "Cancelar",
            claseAceptar = "btn btn-primary",
            claseCancelar = "btn btn-secondary",
            onAceptar = null,
            onCancelar = null,
            cerrarAlAceptar = true,
            cerrarAlCancelar = true
        } = opciones;

        const btnCancelar = new Boton({
            texto: textoCancelar,
            className: claseCancelar
        });

        const btnAceptar = new Boton({
            texto: textoAceptar,
            className: claseAceptar
        });

        btnCancelar.elemento.addEventListener("click", () => {
            if (typeof onCancelar === "function") {
                onCancelar();
            }
            if (cerrarAlCancelar) {
                this.cerrar();
            }
        });

        btnAceptar.elemento.addEventListener("click", () => {
            if (typeof onAceptar === "function") {
                onAceptar();
            }
            if (cerrarAlAceptar) {
                this.cerrar();
            }
        });

        this.agregarBotones(btnCancelar, btnAceptar);

        // Guardamos referencias por si se necesitan después
        this.botonCancelar = btnCancelar;
        this.botonAceptar = btnAceptar;

        return this;
    }

    /**
     * Tamaño del modal (Bootstrap)
     * @param {"sm"|"lg"|"xl"|null} tamaño
     */
    establecerTamaño(tamaño = null) {
        this.dialogo.elemento.classList.remove(
            "modal-sm",
            "modal-lg",
            "modal-xl"
        );

        if (tamaño) {
            this.dialogo.elemento.classList.add(`modal-${tamaño}`);
        }

        return this;
    }

    abrir() {
        if (this.estaAbierto) return this;

        if (!this.elemento.isConnected) {
            document.body.append(this.elemento);
        }

        this.elemento.classList.add("show");
        this.elemento.style.display = "block";
        this.elemento.setAttribute("aria-modal", "true");
        this.elemento.removeAttribute("aria-hidden");

        this._crearBackdrop();

        document.body.classList.add("modal-open");
        document.body.style.overflow = "hidden";

        this.estaAbierto = true;
        this.guardarMemoria({ estaAbierto: true });

        document.addEventListener("keydown", this._manejarEscape);

        return this;
    }

    cerrar() {
        if (!this.estaAbierto) return this;

        this.elemento.classList.remove("show");
        this.elemento.style.display = "none";
        this.elemento.setAttribute("aria-hidden", "true");
        this.elemento.removeAttribute("aria-modal");

        this._eliminarBackdrop();

        document.body.classList.remove("modal-open");
        document.body.style.overflow = "";

        this.estaAbierto = false;
        this.guardarMemoria({ estaAbierto: false });

        document.removeEventListener("keydown", this._manejarEscape);

        return this;
    }

    alternar() {
        return this.estaAbierto ? this.cerrar() : this.abrir();
    }

    estaVisible() {
        return this.estaAbierto;
    }

    // Métodos privados
    _crearBackdrop() {
        if (this._backdrop) return;

        this._backdrop = document.createElement("div");
        this._backdrop.className = "modal-backdrop fade show";
        document.body.append(this._backdrop);
    }

    _eliminarBackdrop() {
        if (this._backdrop) {
            this._backdrop.remove();
            this._backdrop = null;
        }
    }
}
