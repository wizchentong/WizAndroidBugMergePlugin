function merge (documents) {
	for (var i = 0; i < documents.Count; i++) {

		var documentObj = documents.Item(i);
		var documentTitle = documentObj.Title;

		if(isTitleExists(documentTitle)){
			mNeedDelDocumentArray.push(documentObj);
		}else{
			mSameTitleDocumentArray.push(documentObj);
		}
	}
}
function isTitleExists(documentTitle){
	var infos = documentTitle.split("-->");
	if(infos.length == 2){
		return refreshSameTitleCount(infos[1], parseInt(infos[0]));
	}
	return refreshSameTitleCount(documentTitle, 1);
}
function refreshSameTitleCount(documentTitle, increment){
	for(index in mSameTitleDocumentArray){
		var title = getTitleFromWizDocumentObject(mSameTitleDocumentArray[index]);
		if(documentTitle == title){
			mSameTitleCountArray[index] += increment;
			return true;	
		}
	}
	mSameTitleCountArray.push(increment);
	return false;
}
function getTitleFromWizDocumentObject (wizDocumentObj) {
	var infos = wizDocumentObj.Title.split("-->");
	if(infos.length == 2){
		return infos[1];
	}
	return infos[0];
}
var mSameTitleDocumentArray ;
var mSameTitleCountArray;
var mNeedDelDocumentArray;
function init () {
	var objApp = WizExplorerApp;
	var currentGroupFolder = objApp.Window.CategoryCtrl.SelectedTags.Item(0);
	var documents = currentGroupFolder.Documents;

	mSameTitleDocumentArray = new Array();
	mSameTitleCountArray = new Array();
	mNeedDelDocumentArray = new Array();

	merge(documents);

	var str = "重复Bug报告统计：\n";
	for (index in mSameTitleDocumentArray) {
		str += getTitleFromWizDocumentObject(mSameTitleDocumentArray[index]) + " : " + mSameTitleCountArray[index] + "\n";
	};
	str += "\n需要删除Bug报告数" + mNeedDelDocumentArray.length;
	alert(str);

	for(index in mSameTitleDocumentArray){
		var documentObj = mSameTitleDocumentArray[index];
		documentObj.Title = mSameTitleCountArray[index] + "-->" + getTitleFromWizDocumentObject(documentObj);
	}
	for (index in mNeedDelDocumentArray) {
		var documentObj = mNeedDelDocumentArray[index];
		documentObj.Delete();
	};
}
init();
