$(function () {
	
	var progID = '001';
	sessionStorage.setItem('progID', progID);
	sessionStorage.setItem('isSubProg', 1);
	PageInit();
	
	var progID='';
	var userID = sessionStorage.getItem('userID'),
		userName = sessionStorage.getItem('username'),
		siteID = sessionStorage.getItem('siteID');
	var actions = 'view';
	var itemIndex = -1, iPage=1, iRows=10;
	var sOrderCol = '', sSortDir = '';	
	var iMoreIndex = -1;	
	var keydata = {					 
					'siteID': siteID,
					'progID':'',
					'page':iPage,
					'rows': iRows,
					'orderCol': sOrderCol,
					'sortDir':sSortDir
				};	
	var arrMSelect = [];
	var bMultiDel = 0;
		
	// 取得 progID
	var arrParam = new Array();
	arrParam = parseSearch();
	if (arrParam.length > 0) {
		progID = arrParam[0]['value'];
		if (arrParam.length > 1) {
			var actionTmp = arrParam[1]['value'];
			actions = (actionTmp)? actionTmp: 'view';			
		}
		if (progID!=='') {
			setDialog(progID);
		}
	} else {
		var iRec = haveTMRec();
		clearinput();	
		if (iRec > 0) {
			$('#edPage').val(iPage);
			showGridTM(iPage);
		}				
	}	
		
	$('#divGroupName, #divOwner, #divExportPath').dropdiv();
	Init_setLayout();	
	
	// editorPanel 的處理 starts	
	$('.wrapperPanel.TM input').change(function(){
		var bFlag = $('.saveBlock.TM').hasClass('hidden');
		if (bFlag) {
			$('.saveBlock.TM').removeClass('hidden');
			$('.msg.TM').text('是否儲存?');
			actions = (itemIndex == -1)? 'add':'edit';
			var barMsg = (itemIndex == -1)?'新增系統模組':'編輯系統模組';
			$('.barPanel.TM').text(barMsg);
		}
	});
	
	$('#ownerList, #exportPathList, #groupNameList').on('click', 'li', function(){
		var sObjName = $(this).parent().attr('id');
		if (sObjName == 'groupNameList') {
			var sPath = $(this).attr('data-src');
			if (sPath) {
				$('#imgPath').attr('src', sPath);
			} else {
				$('#imgPath').attr('src', '');
				$('#dlgFile>input#fileinput').click();
			}
		}

		var bFlag = $('.saveBlock.TM').hasClass('hidden');
		if (bFlag) {
			$('.saveBlock.TM').removeClass('hidden');
			$('.msg.TM').text('是否儲存?');
			actions = (itemIndex == -1)? 'add':'edit';
			var barMsg = (itemIndex == -1)?'新增系統模組':'編輯系統模組';
			$('.barPanel.TM').text(barMsg);
		}		
	});

	$('#fileinput').on('change', function(){
		var preview = $('#imgPath');
		var file = document.querySelector('#fileinput').files[0];
		var sFilename = file.name;
		var reader = new FileReader();
		
		reader.onload = function(e) {
			preview.attr('src', e.target.result);
			preview.attr('data-file', sFilename);
		}
		
		if (file) {
			reader.readAsDataURL(file);
		}
				
		var bFlag = $('.saveBlock.TM').hasClass('hidden');
		if (bFlag) {
			$('.saveBlock.TM').removeClass('hidden');
			$('.msg.TM').text('是否儲存?');
			actions = (itemIndex == -1)? 'add':'edit';
			var barMsg = (itemIndex == -1)?'新增系統模組':'編輯系統模組';
			$('.barPanel.TM').text(barMsg);
		}
	});		
	
	$('.top-icon.cancel.TM').click(function(){
		if (actions=='add') clearinput();
		if (actions=='edit') setDialog(progID);		
		actions = 'view';
		$('.msg.TM').text('');
		$('.savePanel.TM').addClass('hidden');	
		$('.barPanel').text('系統模組資料');
	});
	
	$('.top-icon.save.TM').click(function(){	
		var sCheck = checkCols();		
		if (!sCheck) {
			var sImgPathTmp = $('#imgPath').attr('src');
			var sPicHead = sImgPathTmp.substr(0, 5);
			var sImgPath = (sPicHead=='data:')? sImgPathTmp: sImgPathTmp.substr(3);
			var mydata = {
				'siteID': siteID,
				'userID': userID,
				'userName': $('#acct').text(),
				'progID':$('#progID').val(),	
				'progName':$('#progName').val(),
				'LMName':$('#LMName').val(),
				'slink':$('#slink').val(),
				'authLimit':$('#authLimit').val(),
				'ownerID':$('#owner').attr('data-id'),
				'owner':$('#owner').val(),
				'exportPath':$('#exportPath').val(),
				'lang':$('#lang').val(),
				'groupName':$('#groupName').val(),
				'imgPath':sImgPath,
				'actions': actions
			};			
			//var datastr = JSON.stringify(mydata);
			//alert(datastr);
			$.ajax({
				url: 'php/001_edit.php',
				data:mydata,
				dataType: "JSON",
				type: "POST",
				async: false,
				success: function(data){					
					var sMsg = data.message;
					if (sMsg) {
						showModalMsg(sMsg);
					} else {	
						if (actions == 'add') {
							progID = data.key;
						}
						actions = 'view';
						$('.msg.TM').text('');
						$('.savePanel.TM').addClass('hidden');
						$('.barPanel').text('系統模組資料');
					}
				}
			});		
		} else {
			showMsg(sCheck);
		}
	});		
	
	// $('.top-icon.import').click(function(){
	// 	$('#dlgFile>input#fileinput').click();
	// });		

	$('.bar-icon.add').click(function(){
		$('.barPanel.TM').text('新增系統模組');
		clearinput();
		setLayout();
	});	
	
	$('.bar-icon.menu').click(function(){
		// 判斷 url 是否有search string
		var sSearchString = window.location.search;
		if (sSearchString) {
			var slink = window.location.protocol+'//'+window.location.hostname+window.location.pathname;
			$(location).attr('href', slink);
		} else {
			var iWidth = $(window).width();
			$('.editorPanel.TM').addClass('hidden');
			$('.gridPanel.TM').removeClass('hidden');
			setLayout();
			var nu_HTmp = parseInt($('.mainPanel').css('min-height'), 10);
			var nu_H = (iWidth < 601)? nu_HTmp+160:nu_H;
			$('.mainPanel').height(nu_H);	
			setListPanel(iPage);
		}
		var bFlag = $('.saveBlock.TM').hasClass('hidden');
		if (!bFlag) $('.saveBlock.TM').addClass('hidden');
	});		
	// .editorPanel 的處理 ends

	// .gridPanel.TM 的處理 starts	
	$('.bar-icon.Dfilter').on('click', function(){
		$('.liwaModal.filter').removeClass('hidden');
	});	

	$('.bar-icon.addOne').click(function(){
		$('.barPanel.TM').text('新增系統模組');
		$('.gridPanel.TM').addClass('hidden');
		$('.editorPanel.TM').removeClass('hidden');
		clearinput();
		setLayout();
	});	

	$('.bar-icon.batchDel').click(function(){
		bMultiDel = 1;
		$('.liwaModal.delete').removeClass('hidden');	
		actions = 'delete';		
	});

	$('.listPanel.TM').on('click', '.rowBox>.dataPanel>.tcPanel.iPhone>.btnFunc.selBox', function(event){
		event.stopPropagation();
		var bSelFlag = $(this).hasClass('selectd');
		var sID = $(this).parent().parent().parent().attr('data-ID');
		if (bSelFlag) {
			// 已選, 移 MSelect Class及 arrMSelect[]中的元素
			$(this).removeClass('selectd');
			arrMSelect.splice($.inArray(sID, arrMSelect),1);
			var bChxAllFlag = $('.top-icon.selOption').hasClass('chxAll');
			if (bChxAllFlag) $('.top-icon.selOption').removeClass('chxAll');
		} else {
			// 未選, 加 MSelect Class及 arrMSelect[]
			$(this).addClass('selectd');
			arrMSelect.push(sID);
		}
	});		
		
	$('.listPanel.TM').on('click', '.rowBox', function(){
		progID = $(this).attr('data-ID');
		itemIndex = $(this).index();
		$('.gridPanel.TM').addClass('hidden');
		$('.editorPanel.TM').removeClass('hidden');
		$('.barPanel').text('編輯系統模組');	
		setLayout();
		setDialog(progID);
	});
	
	$('.top-icon.DCancel.inModal.delete').click(function(){
		$(this).parent().addClass('hidden');
		$('.listPanel.TM').children('.rowBox').eq(itemIndex).children('.funcPanel').addClass('hidden');
		$('.listPanel.TM').children('.rowBox').eq(itemIndex).children('.dataPanel').css('margin-left', '0px');		
		actions = 'view';
	});
	
	$('.top-icon.DOK.inModal.delete').click(function(){
		var mydata = {
			'siteID': siteID,
			'userID':userID,
			'progID': progID,
			'details':arrMSelect,
			'actions':actions
		};
		$.ajax({
			url:"php/001_edit.php",
			data:mydata,
			dataType:"JSON",
			type:"POST",
			async: false,
			success:function(data){
				$('.liwaModal.delete').addClass('hidden');
				var sMsg = data.message;
				if (sMsg) {
					showModalMsg(sMsg);
				} else {
					arrMSelect = [];
					iPage = 1;						
					setListPanel(iPage);
					progID='';
					itemIndex = -1;
					clearinput();
					actions='view';
				}
			}
		});
	});
	
	$('.gridPanel.TM').on('click', '.theadPanel>.dataPanel>.thPanel', function(){
		var strOrderCol = $(this).attr('data-order');
		// 新欄位則回到預設
		if (strOrderCol !== sOrderCol) {
			sOrderCol = '';
			sSortDir = '';
			$(this).parent().children('.thPanel[class*="asc"]').removeClass('asc');
			$(this).parent().children('.thPanel[class*="desc"]').removeClass('desc');				
		}
		var strDesc = $(this).hasClass('desc');
		var strAsc = $(this).hasClass('asc');		
		if (strOrderCol) {
			if ((!strDesc) & (!strAsc)) {
				sSortDir = 'asc';
				$(this).addClass('asc');
			} else {
				if (strAsc) {
					sSortDir = 'desc';
					$(this).removeClass('asc');
					$(this).addClass('desc');
				} else {
					sSortDir = 'asc';
					$(this).removeClass('desc');
					$(this).addClass('asc');					
				}
			}
			sOrderCol = strOrderCol;
		} else {
			// 非排序欄位回到預設
			sOrderCol = '';
			sSortDir = '';
			$(this).parent().children('.thPanel[class*="asc"]').removeClass('asc');
			$(this).parent().children('.thPanel[class*="desc"]').removeClass('desc');			
		}	
		keydata.orderCol = sOrderCol;
		keydata.sortDir = sSortDir;
		setListPanel(iPage);			
	});	
	
	$('.pagePanel').on('click', '.pageBox', function(){
		// 取得所點擊的頁碼
		var iIndex = $(this).index();		

		// 設定 pagePanel, iPage or iPageD1
		var pagePanel;
		var iTotalpages;
		pagePanel = $('.pagePanel');
		iTotalpages = pagePanel.children('.pageBox').eq(12).attr('data-allpages');
		if ((iIndex > 1) && (iIndex < 12)) {
			iPage = pagePanel.children('.pageBox').eq(iIndex).text();	
		} else {
			if (iIndex ==1) {
				iPage = (iPage==1)? 1: iPage-1;
			}
			if (iIndex == 15) {
				iPage = (iPage==iTotalpages)? iTotalpages: iPage+1;
			}
			if (iIndex ==0) {
				iPage = 1;
			}
			if (iIndex == 12) {
				iPage = iTotalpages;
			}
		}					
		setListPanel(iPage);		
	});
	
	$('#edPage').on('keyup', function(event){
		if (event.which == 13) {
			var iTemp = parseInt($(this).val(),10);
			var iTotalTemp = $(this).parent().parent().siblings('.pageNote').attr('data-Allpages');
			var iTotalpages = parseInt(iTotalTemp, 10);
			if (!isNaN(iTemp)) {
				if ((iTemp > 0) && (iTemp < iTotalpages+1)) {
					iPage = iTemp;					
				}
			}
			setListPanel(iPage);
		}
	});

	$('.listPanel.TM').on('click', '.rowBox>.dataPanel>.btnFunc.More', function(event){
		event.stopPropagation();
		var iRowIndex = $(this).parent().parent().index();
		var objItem = $('.listPanel.TM').children('.rowBox').eq(iRowIndex).children('.dataPanel');		
		var iWidth = $(window).width();
		// 先判斷iMoreIndex == -1
		if (iMoreIndex == -1) {
			if ((iWidth < 801) && (iWidth > 600)) {
				objItem.children('.tcPanel.PC').addClass('more');
			} else if (iWidth < 601) {
				objItem.children('.tcPanel.PC').addClass('more');
				objItem.children('.tcPanel.iPad').addClass('more');
			}
			iMoreIndex = iRowIndex;
		} else {
			// 先清掉所有 .rowBox的 .tcPanel.PC 的more class
			clearMoreClass();
			// 若iMoreIndex !== iRowIndex, 依 iWidth 新增 more class
			if (iMoreIndex == iRowIndex) {
				iMoreIndex = -1;
			} else {
				if ((iWidth < 801) && (iWidth > 600)) {
					objItem.children('.tcPanel.PC').addClass('more');
				} else if (iWidth < 601) {
					objItem.children('.tcPanel.PC').addClass('more');
					objItem.children('.tcPanel.iPad').addClass('more');
				}
				iMoreIndex = iRowIndex;
			}								
		}
	});				
	// .gridPanel.TM 的處理 ends
	
	// 以下為自訂functions
	function haveTMRec() {
		var AA = 0;
		var mydata = {
			'siteID': siteID
		};		
		$.ajax({
			url: "php/001_haveTM.php",
			data:mydata,
			dataType: "JSON",
			async: false,
			success: function(data){
				var sMsg = data.message;
				if (sMsg > 0) AA = parseInt(sMsg, 10);
			}
		});  
		return AA;
	}

	function clearinput(){
		$('.editorPanel.TM input').val('');
		$('#dsLevel').val('1');
		$('#dsPercent').val('100');
		$('.barPanel').text('新增系統模組');	
		$('#owner').attr('data-id', siteID+'010001');	
		$('#owner').val('');
		$('#exportPath').val('');
		progID='';
		itemIndex = -1;
		actions = 'view';		
	}
	
	function setDialog(sID){
		var bFlag = $('#isPublic').hasClass('selectd');
		if (bFlag) $('#isPublic').removeClass('selectd');
		// 加入欄位資料
		var mydata= {
			'siteID': siteID,
			'progID':sID
		};
		$.ajax({
			url:"php/001_edit.php",
			data:mydata,
			dataType:"JSON",
			async: false,
			success:function(data) {
				if (data.arrSQL.length > 0) {
					$.each(data.arrSQL, function(){
						var sImgPathTmp = (this['imgPath']==null)? "": this['imgPath'];
						var sImgPath = renewPicpath(sImgPathTmp);
						$('#progID').val(this['progID']);
						$('#progName').val(this['progName']);
						$('#LMName').val(this['LMName']);
						$('#slink').val(this['slink']);
						$('#lang').val(this['lang']);
						$('#authLimit').val(this['authLimit']);
						$('#groupName').val(this['groupName']);
						$('#imgPath').attr('src', sImgPath);
						$('#owner').attr('data-ID', this['ownerID']);
						$('#owner').val(this['owner']);
						$('#exportPath').val(this['exportPath']);
					});				
				}
			}
		});		
	}
	
	function checkCols(){
		var AA='';
		var err1 = $('#progID').val();
		if (!err1) AA+='程式ID欄不得空白;';
		var err2 = $('#progName').val();
		if (!err2) AA+='程式模組欄不得空白;';
		var err3 = $('#LMName').val();
		if (!err3) AA+='表單庫名稱欄不得空白;';
		var err4 = $('#authLimit').val();
		if (!err4) AA+='最低權限欄不得空白;';
		var err5 = $('#slink').val();
		if (!err5) AA+='程式路徑欄不得空白;';	
		var err6 = checkProgID(err1);
		if ((err6) && (actions == 'add')) AA+='程式ID已存在;';				
		return AA;
	}

	function checkProgID(str){
		var AA = '';
		var mydata={
			'siteID': siteID,
			'progID':str
		};
		$.ajax({
			url:"php/001_haveProgID.php",
			data:mydata,
			dataType:"JSON",
			async:false,
			success:function(data){
				AA = data.message;
			}
		});
		return AA;
	}

	function showGridTM(iNum){
		var iWidth = $(window).width();
		$('.editorPanel.TM').addClass('hidden');
		$('.gridPanel.TM').removeClass('hidden');
		setLayout();
		setListPanel(iNum);	
	}		
	
	function setListPanel(iNum){
		// 刪除所有的 .div
		var objItem = $('.listPanel.TM').children('.rowBox').eq(0);
		if (objItem) $('.listPanel.TM').children('.rowBox').remove();
		// 新增 rowBox
		keydata.page = iNum;
		//var datastr = JSON.stringify(keydata);
		//alert(datastr);	
		$.ajax({
			url:'php/001_edit.php',
			data:keydata,
			dataType:"JSON",
			async: false,
			success:function(data){
				if (data.arrSQL.length > 0) {
					$('.top-icon.selOption').removeClass('chxAll');
					var iRowCount = 0;
					var iGridOption = parseInt($('.gridPanel.TM').attr('data-option'), 10);					
					$.each(data.arrSQL, function(){	
						var sID=this['progID'];
						var sImgPath = this['imgPath'];
						var sBaseHead = sImgPath.substr(0, 5);
						var sPHP = (sBaseHead == 'data:')? "":"../";
						var sMSelect = ((iGridOption == 1) && ($.inArray(sID, arrMSelect) !== -1))?" selectd":"";
						if (sMSelect == ' selectd') iRowCount = iRowCount + 1;
						var sSelClass = (iGridOption == 1)?" w4SelBox":"";
						var sSelHidden = (iGridOption == 1)?"":" hidden";						
						var sGroupName = this['groupName'];
						if (sImgPath) {
							sImgPath = renewPicpath(sImgPath);
						}
						var sContent = '<div class="rowBox" data-id="'+sID+'"><div class="dataPanel"><div class="tcPanel iPhone"><div class="btnFunc selBox'+sMSelect+sSelHidden+'"></div><div class="tdPanel iconPath"><img src="'+sImgPath+'" width="42" height="42"/></div><div class="tdPanel progName">'+this['progName']+'</div></div><div class="tcPanel iPad"><div class="tdPanel slink">'+this['slink']+'</div><div class="tdPanel LMName">'+this['LMName']+'</div></div><div class="tcPanel PC"><div class="tdPanel groupName">'+sGroupName+'</div><div class="tdPanel authLimit">'+this['authLimit']+'</div></div><div class="btnFunc More"></div></div></div>';
						$('.listPanel.TM').append(sContent);
					});
					var totalPages = data.totalPages;
					var records = data.records;
					var SQL = data.SQL;
					// 設定 .navPanel
					setPagePanel(iNum, totalPages, records);
				} else {
					setPagePanel(1, 1, 0);
				}
			}
		});	
	}

	function setPagePanel(iPageNo, iAllpages, iTotalRec) {
		// 先將所有的pageBox 移除 hidden class
		$('.pagePanel').children('.pageBox').removeClass('hidden');
		$('.pagePanel').children('.pageBox').removeClass('active');
		if ((iPageNo==iAllpages) && (iPageNo==1)) {
			$('.pagePanel').children('.pageBox').eq(1).addClass('hidden');
			$('.pagePanel').children('.pageBox').eq(13).addClass('hidden');
		}			
		$('.pagePanel').children('.pageNote').text('/'+iAllpages+'頁');
		$('.pagePanel').children('.pageNote').attr('data-Allpages', iAllpages);		
		
		var iStart = (iPageNo>iAllpages-4)?iAllpages-9:iPageNo-5;
		if (iStart < 1) iStart = 1;
		if (iStart == 1) $('.pagePanel').children('.pageBox').eq(0).addClass('hidden');
		var iEnd = iStart+9;
		if (iEnd > iAllpages) iEnd = iAllpages;
		if (iEnd==iAllpages) {
			$('.pagePanel').children('.pageBox').eq(12).addClass('hidden');
		} else {
			$('.pagePanel').children('.pageBox').eq(12).attr('data-Allpages', iAllpages).text('...'+iAllpages);				
		}
		var j =iStart;
		for (var i=2; i<12; i++) {
			if (j > iAllpages) {
				$('.pagePanel').children('.pageBox').eq(i).text('');
				$('.pagePanel').children('.pageBox').eq(i).addClass('hidden');
			} else {
				$('.pagePanel').children('.pageBox').eq(i).text(j);
				if (j==iPageNo) $('.pagePanel').children('.pageBox').eq(i).addClass('active');
			}		
			j++;
		}
	}

	function haveOwner(){
		// 先清掉 ownerList所有 li
		var objItem = $('#ownerList').children('li').eq(0);
		if (objItem) $('#ownerList').children('li').remove();
		// 加入所有 li
		$.ajax({
			url:"php/001_haveOwner.php",
			data: {'siteID': siteID},
			dataType: "json",
			async: false,
			success: function(data){
				if (data.arrSQL.length > 0){
					$.each(data.arrSQL, function(){
						var sContent = '<li data-ID="'+this['ownerID']+'">'+this['owner']+'</li>';
						$('#ownerList').append(sContent);
					});
				}
			}
		});
	}

	function haveExportPath(){
		// 先清掉 ownerList所有 li
		var objItem = $('#exportPathList').children('li').eq(0);
		if (objItem) $('#exportPathList').children('li').remove();
		// 加入所有 li
		$.ajax({
			url:"php/001_haveExportPath.php",
			data: {'siteID': siteID},
			dataType: "json",
			async: false,
			success: function(data){
				if (data.arrSQL.length > 0){
					$.each(data.arrSQL, function(){
						var exportPath = (this['path']=='/')?this['path']+this['folderName']: this['path']+'/'+this['folderName'];
						var sContent = '<li>'+exportPath+'</li>';
						$('#exportPathList').append(sContent);
					});
				}
			}
		});
	}	

	function Init_setLayout(){
		var iWidth = $(window).width();
		if (iWidth < 1025) {
			$('.settingsPanel').addClass('hidden');
		}
		haveOwner();
		haveExportPath();
		setLayout();
	}
	
	function setLayout(){
		let iWidth = $(window).width();
		let iMinH = parseInt($('.mainPanel').css('min-height'), 10);
		let bFlag = $('.gridPanel.TM').hasClass('hidden');
		let iMainH = (bFlag)?$('.wrapperPanel.TM').height()+60:iMinH;

		$('.mainPanel').height(iMainH);	
	}		
	
}); 