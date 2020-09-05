<?php
    //si la BD está en un servidor distinto, se pone la IP en vez del localhost
    //después va usuario y contraseña, nombre de la BD y puerto
    $conn = new mysqli('localhost', 'root', '', 'uptask', 3310);

    //Se comprueba la conexión
    // echo "<pre>";
    // // var_dump($conn);
    // var_dump($conn->ping());
    // echo "</pre>";

    //Si hay algún error, que lo muestre
    if($conn->connect_error) {
        echo $conn->connect_error;
    }

    //Esto es para que muestre los acentos propios del español
    $conn->set_charset('utf8');
?>