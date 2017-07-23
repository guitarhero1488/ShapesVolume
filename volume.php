<?php
$post = file_get_contents('php://input');
$data = json_decode($post, true);
$responce = "";
foreach ($data as $key => $value) {
    if ($value["measure"] == "см") {
        $data[$key]["value"] /= 100;
    }
}
if ($data["shape"] == "Параллелепипед") {
    $length = $data["length"]["value"];
    $width  = $data["width"]["value"];
    $height = $data["p-height"]["value"];
    $volume = $length * $width * $height;
    $number = $data["number"];
    $responce = "<p>Объем 1 ".mb_strtolower($data["shape"])."а составил <span class='volume'>".$volume."</span>м<sup>3</sup></p>"
               ."<p>Объем ".$number." ".mb_strtolower($data["shape"])."ов составил ".$volume * $number."м<sup>3</sup></p>";
} else if ($data["shape"] == "Цилиндр") {
    $diameter = $data["diameter"]["value"];
    $height = $data["c-height"]["value"];
    $volume = M_PI * pow($diameter / 2, 2) * $height;
    $number = $data["number"];
    $responce = "<p>Объем 1 ".mb_strtolower($data["shape"])."а составил <span class='volume'>".$volume."</span>м<sup>3</sup></p>"
               ."<p>Объем ".$number." ".mb_strtolower($data["shape"])."ов составил ".$volume * $number."м<sup>3</sup></p>";
}
print_r($responce);
