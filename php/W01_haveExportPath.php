<?php
$iSubProg =1;  // 若為非系統程式必須設定
include_once("../../php/util.php");
include_once("../../php/config.php");

if ($_GET)
{
	$siteID = $_GET['siteID'];
	$arrjson = array();

	$SQL="select path, folderName from A06_M where siteID='".$siteID."' and folderType='Folder' and folderID  not in ('".$siteID."A06003', '".$siteID."A06004') order by owner";
	$result = $connecDB->query($SQL);
	while($row=$result->fetch(PDO::FETCH_ASSOC)){
		array_push($arrjson, array('path'=>$row['path'], 'folderName'=>$row['folderName']));
	}

	echo json_encode(array('arrSQL'=>$arrjson));	
}
if ($connecDB) $connecDB = null;
?>