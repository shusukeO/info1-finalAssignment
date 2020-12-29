<?php
$file='board.txt';
if (file_exists($file)) {
	$board=json_decode(file_get_contents($file));
}
$board[]=$_REQUEST['score'];
file_put_contents($file, json_encode($board));

?>