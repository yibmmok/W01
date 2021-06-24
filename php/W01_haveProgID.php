<?php
$iSubProg =1;  // 若為非系統程式必須設定
include_once("../../php/util.php");
include_once("../../php/config.php");

if ($_GET)
{
	$siteID = $_GET['siteID'];
	$progID = $_GET['progID'];

	$SQL="select progID from 001_M where siteID='".$siteID."' and progID='".$progID."'";
	$result = $connecDB->query($SQL);
	$row = $result->fetch(PDO::FETCH_ASSOC);
	$nuProgID = (empty($row['progID']))? "": $row['progID'];


	success($nuProgID, "");
}
if ($connecDB) $connecDB = null;
?>