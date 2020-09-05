eventListeners();

//Lista de proyectos
var listaProyectos = document.querySelector('ul#proyectos');

function eventListeners() {

    //Document Ready
    document.addEventListener('DOMContentLoaded', function() {
        actualizarProgreso();
    });

    //botón para crear proyecto
    document.querySelector('.crear-proyecto a').addEventListener('click', nuevoProyecto);

    //botón para una nueva tarea
    document.querySelector('.nueva-tarea').addEventListener('click', agregarTarea);

    //Botones para las acciones de las tareas
    document.querySelector('.listado-pendientes').addEventListener('click', accionesTareas);
}

function nuevoProyecto(e) {
    e.preventDefault();

    //Crea un <input> para el nombre del nuevo proyecto, si es que aún no existe ese input
    if (!document.querySelector('#nuevo-proyecto')) {
        var nuevoProyecto = document.createElement('li');
        nuevoProyecto.innerHTML = '<input type="text" id="nuevo-proyecto">';
        listaProyectos.appendChild(nuevoProyecto);

        //Seleccionar el ID con el nuevoProyecto
        var inputNuevoProyecto = document.querySelector('#nuevo-proyecto');

        //Al presionar ENTER crear el proyecto
        inputNuevoProyecto.addEventListener('keypress', function(e) {
            // console.log(e);
            //el which o keyCode nos da un número único asignado a cada tecla
            var tecla = e.which || e.keyCode;

            if (tecla === 13) {
                guardarProyectoDB(inputNuevoProyecto.value);
                listaProyectos.removeChild(nuevoProyecto);
            }
        });
    }

}

function guardarProyectoDB(nombreProyecto) {
    // console.log(nombreProyecto);

    //Crear llamado a Ajax
    var xhr = new XMLHttpRequest();

    //Enviar datos por FormData
    var datos = new FormData();
    datos.append('proyecto', nombreProyecto);
    datos.append('accion', 'crear');

    //Abrir la conexión
    xhr.open('POST', 'inc/modelos/modelo-proyecto.php', true);

    //En la carga
    xhr.onload = function() {
        if (this.status === 200) {
            // console.log(JSON.parse(xhr.responseText));

            //obtener datos de la respuesta
            var respuesta = JSON.parse(xhr.responseText);
            var proyecto = respuesta.nombre_proyecto,
                id_proyecto = respuesta.id_insertado,
                tipo = respuesta.tipo,
                resultado = respuesta.respuesta;

            //Comprobar la inserción
            if (resultado === 'correcto') {
                //fue exitoso
                if (tipo === 'crear') {
                    //se creó un nuevo proyecto

                    //Inyectar en el HTML
                    var nuevoProyecto = document.createElement('li');
                    nuevoProyecto.innerHTML = `
                        <a href="index.php?id_proyecto=${id_proyecto}" id="proyecto:${id_proyecto}">
                        ${proyecto}
                        </a>
                    `;
                    //agregar al HTML
                    listaProyectos.appendChild(nuevoProyecto);

                    //enviar alerta
                    Swal.fire({
                        // La validación falló
                        icon: 'success',
                        title: 'Proyecto creado',
                        text: 'El proyecto: ' + proyecto + ' se creó correctamente'
                    })

                    //Redireccionar a la nueva URL
                    .then(resultado => {
                        //console.log(resultado);
                        if (resultado.value) {
                            window.location.href = 'index.php?id_proyecto=' + id_proyecto;
                        }
                    });

                } else {
                    //se actualizó o se eliminó
                }
            } else {
                //hubo un error
                Swal.fire({
                    // La validación falló
                    icon: 'error',
                    title: 'Error',
                    text: 'Algo salió mal'
                })
            }
        }
    }

    //Enviar el request
    xhr.send(datos);
}

//Agregar una nueva tarea al proyecto actual
function agregarTarea(e) {
    e.preventDefault();

    var nombreTarea = document.querySelector('.nombre-tarea').value;
    //Validar que el campo tenga algo escrito
    if (nombreTarea === '') {
        Swal.fire({
            // La validación falló
            icon: 'error',
            title: 'Error',
            text: 'Una tarea no puede ir vacía'
        })
    } else {
        //La tarea tiene algo, insertar en PHP

        //Crear llamado a Ajax
        var xhr = new XMLHttpRequest();

        //Crear FormData
        var datos = new FormData();
        datos.append('tarea', nombreTarea);
        datos.append('accion', 'crear');
        datos.append('id_proyecto', document.querySelector('#id_proyecto').value);

        //Abrir la conexión
        xhr.open('POST', 'inc/modelos/modelo-tareas.php', true);

        //Ejecutarlo y respuesta
        xhr.onload = function() {
            if (this.status === 200) {
                //todo correcto
                var respuesta = JSON.parse(xhr.responseText);
                // console.log(respuesta);

                //Asignar valores
                var resultado = respuesta.respuesta,
                    tarea = respuesta.tarea,
                    id_insertado = respuesta.id_insertado,
                    tipo = respuesta.tipo;

                if (resultado === 'correcto') {
                    //se agregó correctamente
                    if (tipo === 'crear') {
                        //Lanzar la alerta
                        Swal.fire({
                            // La validación falló
                            icon: 'success',
                            title: 'Tarea creada',
                            text: 'La tarea: ' + tarea + ' se creó correctamente'
                        })

                        //Seleccionar el párrafo con la lista vacía
                        var parrafoListaVacia = document.querySelectorAll('.lista-vacia');
                        if (parrafoListaVacia.length > 0) {
                            // parrafoListaVacia.display = none;
                            document.querySelector('.lista-vacia').remove();
                        }

                        //Construir el template
                        var nuevaTarea = document.createElement('li');

                        //Agregamos el ID
                        nuevaTarea.id = 'tarea:' + id_insertado;

                        //Agregar la clase TAREA
                        nuevaTarea.classList.add('tarea');

                        //Construir el HTML
                        nuevaTarea.innerHTML = `
                            <p>${tarea}<p/>
                            <div class="acciones">
                                <i class="far fa-check-circle"></i>
                                <i class="fas fa-trash"></i>
                            </div>
                        `;

                        //Agregarlo al HTML
                        var listado = document.querySelector('.listado-pendientes ul');
                        listado.appendChild(nuevaTarea);

                        //Limpiar el formulario
                        document.querySelector('.agregar-tarea').reset();

                        //Actualizar el progreso
                        actualizarProgreso();
                    }
                } else {
                    //hubo un error
                    Swal.fire({
                        // La validación falló
                        icon: 'error',
                        title: 'Error',
                        text: 'Algo salió mal'
                    })
                }
            }
        }

        //Enviar la consulta
        xhr.send(datos);
    }
}

//Cambia el estado de las tareas o las elimina
function accionesTareas(e) {
    e.preventDefault();

    //DELEGATION
    // console.log(e.target);
    if (e.target.classList.contains('fa-check-circle')) {
        if (e.target.classList.contains('completo')) {
            e.target.classList.remove('completo');
            cambiarEstadoTarea(e.target, 0);
        } else {
            e.target.classList.add('completo');
            cambiarEstadoTarea(e.target, 1);
        }
    } else if (e.target.classList.contains('fa-trash')) {
        Swal.fire({
            title: '¿Estás seguro(a)?',
            text: "Esta acción no se puede deshacer",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.value) {
                var tareaEliminar = e.target.parentElement.parentElement;

                //Borrar de la base de datos
                eliminarTareaBD(tareaEliminar);

                //Borrar del HTML
                tareaEliminar.remove();

                Swal.fire(
                    '¡Eliminado!',
                    'Tu tarea ha sido eliminada correctamente',
                    'success'
                )
            }
        })
    }
}

//Completa o descompleta la tarea
function cambiarEstadoTarea(tarea, estado) {
    //traversing el DOM: del hijo al padre
    //el split separa cuando esté en esos dos puntos
    var idTarea = tarea.parentElement.parentElement.id.split(':');
    // console.log(idTarea[1]);

    //Crear llamado a Ajax
    var xhr = new XMLHttpRequest();

    //información
    var datos = new FormData();
    datos.append('id', idTarea[1]);
    datos.append('accion', 'actualizar');
    datos.append('estado', estado);

    //Abrir la conexión
    xhr.open('POST', 'inc/modelos/modelo-tareas.php', true);

    //on load
    xhr.onload = function() {
        if (this.status === 200) {
            console.log(JSON.parse(xhr.responseText));

            //Actualizar el progreso
            actualizarProgreso();
        }
    }

    //enviar la petición
    xhr.send(datos);
}

//Elimina las tareas de la base de datos
function eliminarTareaBD(tarea) {
    // console.log(tarea);

    var idTarea = tarea.id.split(':');
    // console.log(idTarea[1]);

    //Crear llamado a Ajax
    var xhr = new XMLHttpRequest();

    //información
    var datos = new FormData();
    datos.append('id', idTarea[1]);
    datos.append('accion', 'eliminar');

    //Abrir la conexión
    xhr.open('POST', 'inc/modelos/modelo-tareas.php', true);

    //on load
    xhr.onload = function() {
        if (this.status === 200) {
            console.log(JSON.parse(xhr.responseText));

            //Comprobar que haya tareas restantes
            var listaTareasRestantes = document.querySelectorAll('li.tarea');
            if (listaTareasRestantes.length == 0) {
                document.querySelector('.listado-pendientes ul').innerHTML = '<p class="lista-vacia">No hay tareas en este proyecto</p>';
            }

            //Actualizar el progreso
            actualizarProgreso();
        }
    }

    //enviar la petición
    xhr.send(datos);
}

//Actualiza el avance del proyecto
function actualizarProgreso() {
    //Obtener todas las tareas
    const tareas = document.querySelectorAll('li.tarea');

    //Obtener las tareas completadas
    const tareasCompletadas = document.querySelectorAll('i.completo');

    // console.log(tareas.length);
    // console.log(tareasCompletadas.length);

    //Determinar el avance
    const avance = Math.round((tareasCompletadas.length / tareas.length) * 100);
    //console.log(avance);

    //Asignar el avance a la barra
    const porcentaje = document.querySelector('#porcentaje');
    porcentaje.style.width = avance + '%';

    //Mostrar una alerta al completar el 100%
    if (avance === 100) {
        Swal.fire({
            // La validación falló
            icon: 'success',
            title: '¡Proyecto terminado!',
            text: 'Ya no tienes tareas pendientes'
        })
    }
}