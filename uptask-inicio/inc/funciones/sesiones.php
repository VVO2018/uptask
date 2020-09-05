<?php
    function usuario_autenticado() {
        //verifica que el usuario haya hecho su login 
        if(!revisar_usuario()) {
            header('Location:login.php');
            //si no, pues lo redirecciona al login
            exit();
        }
    }

    function revisar_usuario() {
        //verifica que haya una sesión iniciada
        return isset($_SESSION['nombre']);
    }

    //sesiones: info almacenada dentro del servidor
    //primero se inician. Esta permite ir de una página a otra sin loguearse todo el tiempo.
    session_start();
    usuario_autenticado();
?>