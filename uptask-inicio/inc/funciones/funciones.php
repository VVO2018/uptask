<?php
    //Obtiene la página actual que se ejecuta
    function obtenerPaginaActual() {
        //Esto nos regresa el nombre del archivo actual
        $archivo = basename($_SERVER['PHP_SELF']);
        //esta función reemplaza una parte de un string con otra
        //se reemplaza .php por nada. Es para quitarle esa extensión
        $pagina = str_replace(".php", "", $archivo);
        // echo $pagina;
        return $pagina;
    }

    /* CONSULTAS */

    /* Obtener todos los proyectos */
    function obtenerProyectos() {
        include 'conexion.php';
        try {
            return $conn->query('SELECT id, nombre FROM proyectos');
        } catch (Exception $e) {
            echo "Error: " . $e->getMessage();
            return false;
        }
    }


    //Obtener el nombre del proyecto
    function obtenerNombreProyecto($id = null) {
        include 'conexion.php';
        try {
        return $conn->query("SELECT nombre FROM proyectos WHERE id = {$id}");
        } catch (Exception $e) {
            echo "Error: " . $e->getMessage();
            return false;
        }
    }

    //Obtener las tareas de los proyectos
    function obtenerTareasProyecto($id = null) {
        include 'conexion.php';
        try {
        return $conn->query("SELECT id, nombre, estado FROM tareas WHERE id_proyecto = {$id}");
        } catch (Exception $e) {
            echo "Error: " . $e->getMessage();
            return false;
        }
    }
?>