<?php
$iSubProg =1;  // 若為非系統程式必須設定
include_once("../../php/util.php");
include_once("../../php/config.php");
date_default_timezone_set('Asia/Taipei');

if ($_GET)
{
	$siteID = $_GET['siteID'];
	$progID = isset($_GET['progID'])?$_GET['progID']:"";	
	$orderCol = $_GET['orderCol'];
	$sortDir = $_GET['sortDir'];
	if ((!$orderCol) && (!$sortDir)) {
		$orderStr = 'progID';
	} else {
		$orderStr = $orderCol." ".$sortDir;
	}
	
	$arrjson = array();	
	
	if ($progID) {
		$SQL = "select * from 001_M where siteID='".$siteID."' and progID='".$progID."'";
		$result = $connecDB->query($SQL);
		
		$row = $result->fetch(PDO::FETCH_ASSOC);
		array_push($arrjson, array('progID'=>$row['progID'], 'progName'=>$row['progName'], 'LMName'=>$row['LMName'], 'groupName'=>$row['groupName'], 'slink'=>$row['slink'], 'imgPath'=>$row['imgPath'], 'authLimit'=>$row['authLimit'], 'ownerID'=>$row['ownerID'], 'owner'=>$row['owner'], 'exportPath'=>$row['exportPath'], 'lang'=>$row['lang']));
	} else {
		$filter = "1";
		
		$page = (isset($_GET['page']))?$_GET['page']:0;  // set page
		$limit = (isset($_GET['rows']) && $_GET['rows']>0)?$_GET['rows']:10;  // set rows	
		$SQL_page = "select COUNT(*) as count from 001_M where siteID='".$siteID."' and progID<>'001'";
		$result_page = $connecDB->query($SQL_page);
		$row_p = $result_page->fetch(PDO::FETCH_ASSOC);
		$count = $row_p['count'];
		$total_pages = ($count > 0)?ceil($count/$limit):1; // get total pages
		if ($page > $total_pages) $page=$total_pages;
		// get start record
		$start = $limit*$page - $limit; 
		if ($start < 0) $start = 0; 		

		$SQL="select * from 001_M where siteID='".$siteID."' and progID<>'001' order by ".$orderStr." limit ".$start.", ".$limit;
		$result = $connecDB->query($SQL);
			
		while($row = $result->fetch(PDO::FETCH_ASSOC)) {
			array_push($arrjson, array('progID'=>$row['progID'], 'progName'=>$row['progName'], 'slink'=>$row['slink'], 'LMName'=>$row['LMName'], 'groupName'=>$row['groupName'], 'imgPath'=>$row['imgPath'], 'authLimit'=>$row['authLimit']));
		}
	}
		
	echo json_encode(array('page'=>$page, 'totalPages'=>$total_pages, 'records'=>$count, 'arrSQL'=>$arrjson));	

	if ($connecDB) $connecDB = null;
}  

if ($_POST)
{
	$action = $_POST['actions'];
	$siteID = $_POST['siteID'];
	$userID = $_POST['userID'];
	$userName = $_POST['userName'];
	$progID = $_POST['progID'];
	$progName = $_POST['progName'];
	$LMName = $_POST['LMName'];
	$groupName = empty($_POST['groupName'])? NULL: $_POST['groupName'];	
	$slink = $_POST['slink'];
	$imgPath = $_POST['imgPath'];	
	$authLimit = $_POST['authLimit'];
	$ownerID = $_POST['ownerID'];
	$owner = $_POST['owner'];
	$exportPath = $_POST['exportPath'];
	$lang = $_POST['lang'];
	$msg = '';
	$sKey= '';

	if ($action !== 'delete') {
		switch ($action)
		{
			case 'add':
				// Insert new records in table 001_M
				if (empty($imgPath)) {
					$SQL1 = "insert into 001_M (siteID, progID, progName, LMName, groupName, slink, authLimit, ownerID, owner, exportPath, lang) values ('".$siteID."', '".$progID."', '".$progName."', '".$LMName."', '".$groupName."', '".$slink."', ".$authLimit.", '".$ownerID."', '".$owner."', '".$exportPath."', '".$lang."')";
				} else {
					$SQL1 = "insert into 001_M (siteID, progID, progName, LMName, groupName, slink, imgPath, authLimit, ownerID, owner, exportPath, lang) values ('".$siteID."', '".$progID."', '".$progName."', '".$LMName."', '".$groupName."', '".$slink."', '".$imgPath."', ".$authLimit.", '".$ownerID."', '".$owner."', '".$exportPath."', '".$lang."')";
				}
				break;
			case 'edit':
				// update records in table 001_M
				if (empty($imgPath)) {
					$SQL1 = "update 001_M set progName='".$progName."', LMName='".$LMName."', groupName='".$groupName."', slink='".$slink."', authLimit=".$authLimit.", ownerID='".$ownerID."', owner='".$owner."', exportPath='".$exportPath."', lang='".$lang."' where siteID='".$siteID."' and progID='".$progID."'";				
				} else {
					$SQL1 = "update 001_M set progName='".$progName."', LMName='".$LMName."', groupName='".$groupName."', slink='".$slink."', imgPath='".$imgPath."', authLimit=".$authLimit.", ownerID='".$ownerID."', owner='".$owner."', exportPath='".$exportPath."', lang='".$lang."' where siteID='".$siteID."' and progID='".$progID."'";				
				}
				break;
		}
		try {
			$result1 = false;
			$result1 = $connecDB->exec($SQL1);
			switch ($action) {
				case 'edit':
					// update 003_D1 table
					$SQL_edit003D1 = "update 003_D1 set LMName='".$LMName."', slink='".$slink."', lang='".$lang."' where siteID='".$siteID."' and progID='".$progID."'";
					try {
						$result_edit0003D1 = false;
						$result_edit0003D1 = $connecDB->exec($SQL_edit003D1);
					}
					catch (Exception $e) {
						$errEdit003D1 = $connecDB->errorInfo();
						if (($errEdit003D1[0]!=='00000') && ($errEdit003D1[0]!=='010000')) {
							$msg .= "Error ".$errEdit003D1[0].":無法變更003_D1的資料;".$e->getMessage().";SQL=".$SQL_edit003D1.";";
						}						
					}				
					break;
			}		
		}
		catch (Exception $e) {
			$errX = $connecDB->errorInfo();
			if (($errX[0]!=='00000') && ($errX[0]!=='01000')) {
				switch($action){
					case 'add':
						$msg .= "Error ".$errX[0].":無法新增001_M的資料;".$e->getMessage().";SQL=".$SQL1.";";
						break;
					case 'edit':
						$msg .= "Error ".$errX[0].":無法變更001_M的資料;".$e->getMessage().";SQL=".$SQL1.";";
						break;
				}		
			}		
		}		
	} else {
		$details = $_POST['details'];
		$iLength = count($details);
		for ($iCount = 0; $iCount < $iLength; $iCount++) {
			$DprogID = $details[$iCount];
			// delete records in table 001_M 
			$SQL1="delete from 001_M where siteID='".$siteID."' and progID= '".$DprogID."'";	
			try {
				$result1 = false;
				$result1 = $connecDB->exec($SQL1);

				$SQL_Del003D1 = "delete from 003_D1 where siteID='".$siteID."' and progID='".$DprogID."'";
				try {
					$result_Del003D1 = false;
					$result_Del003D1 = $connecDB->exec($SQL_Del003D1);
				}
				catch (Exception $e) {
					$errDel003D1 = $connecDB->errorInfo();
					if (($errDel003D1[0]!=='00000') && ($errDel003D1[0]!=='010000')) {
						$msg .= "Error ".$errDel003D1[0].":無法刪除 003_D1 的資料;".$e->getMessage().";SQL=".$SQL_Del003D1.";";
					}						
				}
			}
			catch (Exception $e) {
				$errX = $connecDB->errorInfo();
				if (($errX[0]!=='00000') && ($errX[0]!=='01000')) {
					$msg .= "Error ".$errX[0].":無法刪除001_M的資料;".$e->getMessage().";SQL=".$SQL1.";";
				}		
			}	
		}
			
	}

	if ($msg) {
		$sLog_Msg = $userID.", ".$msg;
		writUserLog($sLog_Msg, $siteID);
	}

	success($msg, $sKey);	
	
	if ($connecDB) $connecDB=null;
}
?>