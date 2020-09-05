// console.log('FUNCIONA');

//esto es para que nuestras funciones listeners no estén globalmente
eventListeners();

function eventListeners() {
    //submit se usa mucho para formularios. Cuando el usuario presiona el botón.
    document.querySelector('#formulario').addEventListener('submit', validarRegistro);

}

function validarRegistro(e) {
    e.preventDefault();

    var usuario = document.querySelector('#usuario').value,
        password = document.querySelector('#password').value,
        tipo = document.querySelector('#tipo').value;

    // console.log(usuario + " " + password);

    if (usuario === '' || password === '') {
        Swal.fire({
            // La validación falló
            icon: 'error',
            title: '¡Error!',
            text: 'Ambos campos son obligatorios'
        })
    } else {
        //Ambos campos son correctos, mandar a ejecutar Ajax

        //Datos que se envían al servidor
        //FormData permite estructurar el llamado a Ajax. Dar una llave y un valor.
        //Se suele utilizar con formularios
        var datos = new FormData();
        datos.append('usuario', usuario);
        datos.append('password', password);
        datos.append('accion', tipo);

        //Los 3 puntos crean una copia de los datos para poder visualizarlos
        // console.log(...datos);
        // console.log(datos.get('usuario'));

        //crear el llamado a Ajax
        var xhr = new XMLHttpRequest();

        //abrir la conexión
        xhr.open('POST', 'inc/modelos/modelo-admin.php', true);

        //retorno de datos
        xhr.onload = function() {
            if (this.status === 200) {
                //esta es una respuesta que viene desde el servidor. Desde modelo-admin.php en este caso
                var respuesta = JSON.parse(xhr.responseText);

                console.log(respuesta);
                //si la respuesta es correcta y es un nuevo usuario
                if (respuesta.respuesta === 'correcto' && respuesta.tipo === 'crear') {
                    Swal.fire({
                        // La validación falló
                        icon: 'success',
                        title: 'Usuario creado',
                        text: 'El usuario se creó correctamente'
                    })
                } else if (respuesta.respuesta === 'correcto' && respuesta.tipo === 'login') {
                    Swal.fire({
                            // La validación falló
                            icon: 'success',
                            title: 'Login correcto',
                            text: 'Presiona OK para abrir el dashboard'
                        })
                        .then(resultado => {
                            //console.log(resultado);
                            if (resultado.value) {
                                window.location.href = 'index.php';
                            }
                        });
                } else {
                    //Hubo un error
                    Swal.fire({
                        // La validación falló
                        icon: 'error',
                        title: 'Error',
                        text: 'Algo salió mal'
                    })
                }
            }
        }

        //enviar la petición
        xhr.send(datos);
    }
}