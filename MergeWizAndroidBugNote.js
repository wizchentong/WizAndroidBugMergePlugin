function merge (documents) {
	for (var i = 0; i < documents.Count; i++) {

		var documentObj = documents.Item(i);
		var documentTitle = documentObj.Title;
		mergeCore(documentObj, documentTitle);

	}
}
function mergeCore(documentObj, documentTitle){

	var infos = documentTitle.split("-->");

	if(infos.length == 2){
		//针对之前已经合并过的文档
		 refreshSameTitleCount(documentObj, infos[1], parseInt(infos[0]));
	}else{
		//还未合并过的文档
		refreshSameTitleCount(documentObj, documentTitle, 1);
	}

}
function refreshSameTitleCount(documentObj, documentTitle, increment){

	//这篇文档已经存在于本次统计中
	for(index in mSameTitleDocumentArray){
		var wizSameDocument = mSameTitleDocumentArray[index];
		var title = getTitleFromWizDocumentObject(wizSameDocument.documentObj);
		if(documentTitle == title){
			wizSameDocument.documentCount += increment;
			mNeedDelDocumentArray.push(documentObj);
			return ;	
		}
	}

	//这篇文档还进入本次统计中
	var wizSameDocument = new WizSameDocument(documentObj, increment);
	mSameTitleDocumentArray.push(wizSameDocument);
}

/*
* 根据对象中获取标题。
*/
function getTitleFromWizDocumentObject (wizDocumentObj) {
	var infos = wizDocumentObj.Title.split("-->");
	if(infos.length == 2){
		return infos[1];
	}
	return infos[0];
}

var mSameTitleDocumentArray ;// 存放WizSameDocument对象
var mNeedDelDocumentArray;//存放为知返回的IWizDocument对象

function init () {
	var objApp = WizExplorerApp;
	var currentGroupFolder = objApp.Window.CategoryCtrl.SelectedTags.Item(0);
	var documents = currentGroupFolder.Documents;

	mSameTitleDocumentArray = new Array();
	mNeedDelDocumentArray = new Array();

	merge(documents);

	// // var str = "重复Bug报告统计：\n";
	// // for (index in mSameTitleDocumentArray) {
	// // 	str += getTitleFromWizDocumentObject(mSameTitleDocumentArray[index]) + " : " + mSameTitleCountArray[index] + "\n";
	// // };
	// // str += "\n需要删除Bug报告数" + mNeedDelDocumentArray.length;
	// // alert(str);

	for(index in mSameTitleDocumentArray){
		var wizSameDocument = mSameTitleDocumentArray[index];
		wizSameDocument.documentObj.Title = wizSameDocument.documentCount + "-->" + getTitleFromWizDocumentObject(wizSameDocument.documentObj);
	}
	for (index in mNeedDelDocumentArray) {
		var documentObj = mNeedDelDocumentArray[index];
		documentObj.Delete();
	}

	sortDocumentBySameDocumentCountDesc(mSameTitleDocumentArray);
	
	var collection = objApp.CreateWizObject('WizKMCore.WizDocumentCollection');
    for(index in mSameTitleDocumentArray){
    	collection.Add(mSameTitleDocumentArray[index].documentObj);
    }
	objApp.Window.DocumentsCtrl.SetDocuments2(collection, "NoSort", "");
	alert("Merge Over");
}
function sortDocumentBySameDocumentCountDesc(arr){
    for (var i = 0; i < arr.length - 1; i++) {
         for(var j = i+1; j < arr.length; j++){
            if(arr[i].documentCount < arr[j].documentCount){
                var temp = arr[i];
                arr[i] = arr[j];
                arr[j] = temp;
            }
        }
    }
}
function WizSameDocument(documentObj, documentCount){
	this.documentObj = documentObj;
	this.documentCount = documentCount;
}

init();
