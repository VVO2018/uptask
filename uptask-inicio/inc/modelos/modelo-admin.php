<?php
    // die(json_encode($_POST));

    //como usaremos prepared statements, no necesitamos limpiar la entrada de los usuarios
    $accion = $_POST['accion'];
    $password = $_POST['password'];
    $usuario = $_POST['usuario'];

    if($accion === 'crear') {
        //Código para crear los administradores

        //Hashear passwords

        $opciones = array(
            //lo recomendable es 10
            'cost' => 12
        );
        //toma 3 parámetros: el passw que quiero hashear, el algoritmo de encriptación y las opciones
        $hash_password = password_hash($password, PASSWORD_BCRYPT, $opciones);

        //importar la conexión a la BD
        include '../funciones/conexion.php';

        try {
            //Realizar la consulta a la base de datos
            $stmt = $conn->prepare("INSERT INTO usuarios (usuario, password) VALUES (?, ?)");
            $stmt->bind_param('ss', $usuario, $hash_password);
            $stmt->execute();
            if($stmt->affected_rows > 0) {
                $respuesta = array(
                    'respuesta' => 'correcto',
                    'id_insertado' => $stmt->insert_id,
                    'tipo' => $accion
                );
            } else {
                $respuesta = array(
                    'respuesta' => 'error'
                );
            }
            $stmt->close();
            $conn->close();
        } catch (Exception $e) {
            //En caso de un error, tomar la excepción
            $respuesta = array(
                'error' => $e->getMessage()
            );
        }

        echo json_encode($respuesta);
    }

    if($accion === 'login') {
        //Código que loguee a los administradores

        include '../funciones/conexion.php';

        try {
            //Seleccionar el administrador de la base de datos
            $stmt = $conn->prepare("SELECT * FROM usuarios WHERE usuario = ?");
            $stmt->bind_param('s', $usuario);
            $stmt->execute();
            //Loguear el usuario
            //Aquí se deben crear las variables a las que se les asignarán los datos de la BD
            $stmt->bind_result($id_usuario, $nombre_usuario, $pass_usuario);
            $stmt->fetch();
            if($nombre_usuario) {
                //El usuario existe. Verificar el password.
                //esta función toma como parámetros la contraseña escrita por el usuario
                //y la contraseña hasheada que viene de la BD
                if(password_verify($password, $pass_usuario)) {
                    //Iniciar la sesión
                    session_start();
                    $_SESSION['nombre'] = $usuario;
                    $_SESSION['id'] = $id_usuario;
                    $_SESSION['login'] = true;
                    
                    //Login correcto
                    $respuesta = array (
                        'respuesta' => 'correcto',
                        'nombre' => $nombre_usuario,
                        'tipo' => $accion
                    );
                } else {
                    //Login incorrecto. Enviar error.
                    $respuesta = array(
                        'resultado' => 'Password incorrecto'
                    );
                }   
            } else {
                $respuesta = array(
                    'error' => 'Usuario no existe'
                );
            }
            $stmt->close();
            $conn->close();
        } catch (Exception $e) {
            //En caso de un error, tomar la excepción
            $respuesta = array(
                'error' => $e->getMessage()
            );
        }

        echo json_encode($respuesta);
    }
?>