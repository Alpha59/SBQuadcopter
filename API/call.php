<?php
include_once('../Core/lux-functions.php');
include_once('../Core/output.php');
include_once('../Core/db.php');
include_once('../Core/auth.php');

$db = new Db();
$OUTPUT = new Output();
$collection = $db->selectCollection("APIs");
$AUTH = new Auth();
$LF = new LuxFunctions();

//$service = $collection->query(array("service"=>$LF->fetch_avail("service")));
	$file = file_get_contents($LF->fetch_avail("url"));
	echo $file;
	die();
if(isset($service)){
	 //$service["key_name"];
	 //$service["base_url"];
	 //$LF->fetch_avail("reqType");
	 //$LF->fetch_avail("params");
	 // need to process variables into either a POST or GET request
	$file = file_get_contents($LF->fetch_avail("url"));
	echo $file;
}else{
	$OUTPUT->error("Service Could not be found");
}

