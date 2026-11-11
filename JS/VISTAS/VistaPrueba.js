import {
    Vista,
    Modal,
    Boton,
    Tabla
} from "../REGISTRO.js";

export class VistaPrueba extends Vista {
    inicializar() {
        // Contenedor principal
        this.aplicarConfiguracion({
            className:
                "container vh-100 d-flex justify-content-center align-items-center"
        });

        // ========== TABLA ==========
        const tabla = new Tabla({
            striped: true,
            hover: true,
            small: true
        });

        tabla.establecerEncabezados(["ID", "Nombre", "Email", "Acciones"]);

        // Datos de ejemplo
        const datos = [
            { id: 1, nombre: "Juan Pérez", email: "juan@correo.com" },
            { id: 2, nombre: "María López", email: "maria@correo.com" },
            { id: 3, nombre: "Pedro Gómez", email: "pedro@correo.com" },
            { id: 4, nombre: "Ana Torres", email: "ana@correo.com" }
        ];

        // Cargar datos + botones por fila
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

        // ========== MODAL ==========
        this.modal = new Modal({
            titulo: "Listado de prueba"
        });

        this.modal.establecerTamaño("lg"); // un poco más ancho para la tabla
        this.modal.establecerCuerpo(tabla);

        // Botones del modal
        this.modal.agregarBotonesAceptarCancelar({
            textoAceptar: "Cerrar",
            textoCancelar: "Cancelar"
        });

        // ========== BOTÓN QUE ABRE EL MODAL ==========
        const btnPrueba = new Boton({
            texto: "Prueba",
            className: "btn btn-primary btn-lg"
        });

        btnPrueba.elemento.addEventListener("click", () => {
            this.modal.abrir();
        });

        // Agregar el botón a la vista
        this.agregar(btnPrueba);
    }
}
