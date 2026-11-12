import {
    Vista,
    Modal,
    Boton,
    Tabla,
    Contenedor,
    Texto,
    Formulario,
    InputArchivo
} from "../REGISTRO.js";


export class VistaPrueba extends Vista {
    inicializar() {
        // Contenedor principal de la vista
        this.aplicarConfiguracion({
            className:
                "container vh-100 d-flex flex-column justify-content-center align-items-center gap-4"
        });

        // ========== FORMULARIO CON INPUT ARCHIVO ==========
        const formulario = new Formulario({
            textoBoton: "Ver contenido del archivo",
            className: "card p-4 shadow-sm w-50 d-flex flex-column gap-3",
            onSubmit: (datos) => {
                const base64 = datos.archivo;

                if (!base64) {
                    alert("No se ha seleccionado ningún archivo.");
                    return;
                }

                // Muestra el contenido Base64 (o los datos) en una alerta
                alert(`Contenido almacenado (Base64):\n\n${base64.substring(0, 100)}... (truncado por longitud)`);
                console.log("Contenido completo del archivo en Base64:", base64);
            }
        });

        const inputArchivo = new InputArchivo({
            obligatorio: true,
            className: "form-control"
        });

        // Registramos el input en el formulario bajo la clave "archivo"
        formulario.registrar("archivo", inputArchivo);

        // Contenedor tarjeta para envolver el formulario
        const tarjetaFormulario = new Contenedor("div", {
            className: "card p-4 shadow-sm w-50 d-flex flex-column gap-3"
        });

        const tituloForm = new Texto("h4", {
            texto: "Formulario con Input Archivo",
            className: "card-title text-center"
        });

        tarjetaFormulario.agregar(tituloForm);
        tarjetaFormulario.agregar(formulario);

        // ========== TABLA Y MODAL EXISTENTES ==========
        const tabla = new Tabla({
            striped: true,
            hover: true,
            small: true
        });

        tabla.establecerEncabezados(["ID", "Nombre", "Email", "Acciones"]);

        const datos = [
            { id: 1, nombre: "Juan Pérez", email: "juan@correo.com" },
            { id: 2, nombre: "María López", email: "maria@correo.com" },
            { id: 3, nombre: "Pedro Gómez", email: "pedro@correo.com" },
            { id: 4, nombre: "Ana Torres", email: "ana@correo.com" }
        ];

        tabla.cargarDatos(datos, ["id", "nombre", "email"], (registro) => {
            const acciones = new Contenedor("div", {
                className: "d-flex gap-1"
            });

            const btnEditar = new Boton({
                texto: "Editar",
                className: "btn btn-sm btn-outline-primary"
            });

            const btnEliminar = new Boton({
                texto: "Eliminar",
                className: "btn btn-sm btn-outline-danger"
            });

            btnEditar.elemento.addEventListener("click", () => {
                alert(`Editar: ${registro.nombre}`);
            });

            btnEliminar.elemento.addEventListener("click", () => {
                alert(`Eliminar: ${registro.nombre}`);
            });

            acciones.agregar(btnEditar).agregar(btnEliminar);
            return acciones;
        });

        this.modal = new Modal({
            titulo: "Listado de prueba"
        });

        this.modal.establecerTamaño("lg");
        this.modal.establecerCuerpo(tabla);
        this.modal.agregarBotonesAceptarCancelar({
            textoAceptar: "Cerrar",
            textoCancelar: "Cancelar"
        });

        const btnPruebaModal = new Boton({
            texto: "Abrir Tabla (Modal)",
            className: "btn btn-outline-secondary btn-lg"
        });

        btnPruebaModal.elemento.addEventListener("click", () => {
            this.modal.abrir();
        });

        // ========== AGREGAR A LA VISTA ==========
        this.agregar(tarjetaFormulario);
        this.agregar(btnPruebaModal);
    }
}
