import {
    Vista,
    Modal,
    Boton,
    Tabla,
    Contenedor,
    Texto,
    InputArchivo
} from "../REGISTRO.js";


export class VistaPrueba extends Vista {
    inicializar() {
        // Contenedor principal
        this.aplicarConfiguracion({
            className:
                "container vh-100 d-flex flex-column justify-content-center align-items-center gap-4"
        });

        // ========== INSTANCIA DE INPUT ARCHIVO ==========
        const inputArchivo = new InputArchivo({
            obligatorio: true,
            className: "form-control" // Opcional, si usas Bootstrap
        });

        // Contenedor para agrupar el input y un botón de prueba
        const contenedorPrueba = new Contenedor("div", {
            className: "card p-4 shadow-sm w-50 d-flex flex-column gap-3"
        });

        const titulo = new Texto("h4", {
            texto: "Prueba de InputArchivo",
            className: "card-title"
        });

        const btnProbarArchivo = new Boton({
            texto: "Ver Datos del Archivo",
            className: "btn btn-success"
        });

        btnProbarArchivo.elemento.addEventListener("click", () => {
            if (!inputArchivo.esValido()) {
                alert("Por favor, selecciona un archivo obligatorio.");
                return;
            }

            console.log("Nombre:", inputArchivo.obtenerNombre());
            console.log("Tipo:", inputArchivo.obtenerTipo());
            console.log("Tamaño (bytes):", inputArchivo.obtenerTamano());
            console.log("Base64:", inputArchivo.obtenerBase64());

            alert(`Archivo cargado: ${inputArchivo.obtenerNombre()} (${Math.round(inputArchivo.obtenerTamano() / 1024)} KB)`);
        });

        contenedorPrueba.agregar(titulo);
        contenedorPrueba.agregar(inputArchivo);
        contenedorPrueba.agregar(btnProbarArchivo);

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

        // Agregar elementos a la vista principal
        this.agregar(contenedorPrueba);
        this.agregar(btnPruebaModal);
    }
}
