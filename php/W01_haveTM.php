<?php
$iSubProg =1;  // 若為非系統程式必須設定
include_once("../../php/util.php");
include_once("../../php/config.php");

if ($_GET)
{
	$siteID = $_GET['siteID'];
	
	$SQL="select count(progID) as iRec from 001_M where siteID='".$siteID."'";
	$result = $connecDB->query($SQL);
	$row = $result->fetch(PDO::FETCH_ASSOC);
	$iRec = $row['iRec'];
	
	success($iRec, '');

	if ($connecDB) $connecDB = null;	
}

?>