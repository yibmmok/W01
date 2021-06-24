<?php
$iSubProg =1;  // 若為非系統程式必須設定
include_once("../../php/util.php");
include_once("../../php/config.php");

if ($_GET)
{
	$siteID = $_GET['siteID'];
	$arrjson = array();

	$SQL="select mainID as ownerID, clubName as owner from 010_M where siteID='".$siteID."'";
	$result = $connecDB->query($SQL);
	while($row=$result->fetch(PDO::FETCH_ASSOC)){
		array_push($arrjson, array('ownerID'=>$row['ownerID'], 'owner'=>$row['owner']));
	}

	echo json_encode(array('arrSQL'=>$arrjson));	
}
if ($connecDB) $connecDB = null;
?>