<?php
    error_reporting(E_ALL ^ E_NOTICE);

    // echo json_encode($_POST);

    $accion = $_POST['accion'];
    //para asegurarnos de que será un entero el ID
    $id_proyecto = (int) $_POST['id_proyecto'];
    $tarea = $_POST['tarea'];
    $estado = $_POST['estado'];
    $id_tarea = $_POST['id'];

    if($accion === 'crear') {

        //importar la conexión a la BD
        include '../funciones/conexion.php';

        try {
            //Realizar la consulta a la base de datos
            //el ESTADO de TAREAS no lo agregamos porque por default va a ser cero
            $stmt = $conn->prepare("INSERT INTO tareas (nombre, id_proyecto) VALUES (?, ?)");
            $stmt->bind_param('si', $tarea, $id_proyecto);
            $stmt->execute();
            if($stmt->affected_rows > 0) {
                $respuesta = array(
                    'respuesta' => 'correcto',
                    'id_insertado' => $stmt->insert_id,
                    'tipo' => $accion,
                    'tarea' => $tarea
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

    if($accion === 'actualizar') {

        //importar la conexión a la BD
        include '../funciones/conexion.php';

        try {
            //Realizar la consulta a la base de datos
            //el ESTADO de TAREAS no lo agregamos porque por default va a ser cero
            $stmt = $conn->prepare("UPDATE tareas SET estado = ? WHERE id = ?");
            $stmt->bind_param('ii', $estado, $id_tarea);
            $stmt->execute();
            if($stmt->affected_rows > 0) {
                $respuesta = array(
                    'respuesta' => 'correcto'
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

    if($accion === 'eliminar') {

        //importar la conexión a la BD
        include '../funciones/conexion.php';

        try {
            //Realizar la consulta a la base de datos
            //el ESTADO de TAREAS no lo agregamos porque por default va a ser cero
            $stmt = $conn->prepare("DELETE FROM tareas WHERE id = ?");
            $stmt->bind_param('i', $id_tarea);
            $stmt->execute();
            if($stmt->affected_rows > 0) {
                $respuesta = array(
                    'respuesta' => 'correcto'
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
?>