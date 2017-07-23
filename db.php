<?php
$post = file_get_contents('php://input');
$data = json_decode($post, true);
$conn = new mysqli('localhost', 'root', 'root', 'shapes');
if ($conn->connect_error) {
    die ("Connection error (".$conn->connect_errno.") ".$conn->connect_error);
}
$fio = $data["fio"];
$email = $data["email"];
$phone = $data["phone"];
$number = $data["number"];
$date = date("Y-m-d H:i:s");
$conn->query("INSERT INTO user (`id`, `fio`, `email`, `phone`) VALUES (NULL, '".$fio."', '".$email."', '".$phone."')")
            or die("Insert error (".$conn->connect_errno.") ".$conn->connect_error);
$thisUser = $conn->query("SELECT * FROM user ORDER BY id DESC LIMIT 1");
$userId = $thisUser->fetch_object();
if ($data["shape"] == "Параллелепипед") {
    $length = $data["length"]["value"];
    $width  = $data["width"]["value"];
    $height = $data["p-height"]["value"];
    $volume = $length * $width * $height;
    $conn->query("INSERT INTO calculation (`id`, `user_id`, `shape`, `length`, `width`, `height`, `diameter`, `number`, `volume`, `date`) VALUES 
                (NULL, ".$userId->id.", '".$data["shape"]."', ".$length.", ".$width.", ".$height.", NULL, ".$number.", ".$volume.", '".$date."')")
                or die("Insert error (".$conn->connect_errno.") ".$conn->connect_error);
} else if ($data["shape"] == "Цилиндр") {
    $diameter = $data["diameter"]["value"];
    $height = $data["c-height"]["value"];
    $volume = M_PI * pow($diameter / 2, 2) * $height;
    $conn->query("INSERT INTO calculation (`id`, `user_id`, `shape`, `length`, `width`, `height`, `diameter`, `number`, `volume`, `date`) VALUES 
                (NULL, ".$userId->id.", '".$data["shape"]."', NULL, NULL, ".$height.", ".$diameter.", ".$number.", ".$volume.", '".$date."')")
                or die("Insert error (".$conn->connect_errno.") ".$conn->connect_error);
}

$message = 'Объем Вашей фигуры = '.$volume;
mail($email, "", $message);
