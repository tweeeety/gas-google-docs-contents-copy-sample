/*
 * variables
 */
// about slack
var webhookUrl = "https://hooks.slack.com/services/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";
var displayName = "HRDM Scrum Bot";
var slackMessage = "今週のアジェンダです。";

// docs
// Template
var templateFolderID = "18_bOhvVig26IbQ3LxEs8pD6qkNjXk7lT";
var templateFileID = "1q-i7cGiY2mjQnqFeCDzI8AB4wkjdQqJK5ELlMGehBpI";
var templateName = "DailyScrum";
var mainDocsFileID = "1N3l9auzn5k9hvuTEIUtEABrWVC2zK8MenPAJMPBGUcE";

 // other
var days_from_today = 1;
var TARGET_TXT = "Do Not Delete this sentence. Bot will write here";

/*
 * Function
 */
// YYYYMMDD形式に日付を取得する
function getCalcDate(num) {
  var d = new Date();
  d.setDate(d.getDate() + num);
  return Utilities.formatDate(d, 'Asia/Tokyo', 'yyyyMMdd');
}

function sendPost(file) {
  var param = {
    "text": slackMessage + '\n' + file.getUrl(),
    "username": displayName
  };

  var res = UrlFetchApp.fetch(webhookUrl, {
    method: 'POST',
    headers: {
      "Content-Type": 'application/json'
    },
    payload: JSON.stringify(param)
  });
}

/*
 * Paragraph NumとChild Numが違うことがある
 * Childのほうが正しそう
 */
function researchBodyChild(body) {
  var lastChildNum = body.getNumChildren();
  var paragraphs = body.getParagraphs();
  Logger.log(`lastChildNum: ${lastChildNum}`);
  Logger.log(`paragraphsNum: ${paragraphs.length}`);

  for (i = 0; i < lastChildNum; i++) {
    var child = body.getChild(i);
    Logger.log(child.getType());
  }
}

function getTemplateBody() {
  var templateAsFile = DriveApp.getFileById(templateFileID)
  var templateAsDocs = DocumentApp.openById(templateAsFile.getId());
  var templateBody = templateAsDocs.getBody();  
  return templateBody;
}

function getMainBody() {
  var mainDoc = DocumentApp.openById(mainDocsFileID);
  var mainBody= mainDoc.getBody();
  return mainBody;
}

function getTargetParagraphOffset(body){
  var offset;
  var lastChildNum = body.getNumChildren();
  for (i = 0; i < lastChildNum; i++) {
    var child = body.getChild(i);
    if (
      child.getType() == DocumentApp.ElementType.PARAGRAPH 
      && TARGET_TXT == child.asParagraph().getText()
    ) {
      // Logger.log("hit");
      // Logger.log(child.asParagraph().getText());
      offset = i + 1;
      break;
    } 
    // else {
    //   Logger.log("not Paragraph");
    // }
  }
  return offset;
}

/*
 * Main
 */
function main() {

  // manipulate template document
  var templateBody = getTemplateBody();
  var mainBody = getMainBody();
  var targetOffset = getTargetParagraphOffset(mainBody);

  // research
  // Logger.log("---- templateBody ----");
  // researchBodyChild(templateBody);
  // Logger.log("---- mainBody ----");
  // researchBodyChild(mainBody);
  //Logger.log(`targetOffset: ${targetOffset}`);

  // template to array
  var lastChildNum = templateBody.getNumChildren();
  var startIndex = 0;
  var templateElmArr = [];
  for ( i = startIndex; i < lastChildNum; i++) {
    templateElmArr.push(templateBody.getChild(i))
  }

  // copy
  var startOffset = targetOffset;
  for (i = 0; i < lastChildNum - startIndex; i++)
  {
    var el = templateElmArr[i];
    if(el.getType() == DocumentApp.ElementType.PARAGRAPH) {
      mainBody.insertParagraph(i + startOffset, el.copy().asParagraph());
    } else if (el.getType() == DocumentApp.ElementType.LIST_ITEM) {
      mainBody.insertListItem(i + startOffset, el.copy().asListItem());
    }
  }
}

// /*
//  * Main
//  */
// function main() {
//   // Get File Object from Drive Service
//   // ref: https://developers.google.com/apps-script/reference/drive
//   // ref: https://developers.google.com/drive/api/v3/reference/files 
//   //var files = Drive.Files.list({
//   //   q: '"' + templateFolderID + '" in parents and mimeType contains "document"',
//   //   spaces: 'drive',
//   //   orderBy: 'title desc'
//   // });
  
//   // Search specific template file in Drive
//   // var templateAsFile = "";
//   // if(files.items.length > 0) {
//   //   files.items.some(function(file) {
//   //     Logger.log(file.title　+ ":" + file.id);
//   //     if( file.title == templateName ){
//   //       Logger.log(`Hit File: id=${file.id}, name=${templateName}`);
//   //       templateAsFile = DriveApp.getFileById(file.id);
//   //       return true;
//   //     }
//   //   });
//   // }

//   // Get specific Template file as File
//   var templateAsFile = DriveApp.getFileById(templateFileID)

//   // Convert File into Document 
//   var templateAsDocs = DocumentApp.openById(templateAsFile.getId());
//   Logger.log(`templateAsDocs: ${templateAsDocs.getName()}`);

//   var body = templateAsDocs.getBody();  
//   //Logger.log(body.getText());
  
//   // Get Main Docs File to insert template
//   //メインファイルをDocsとして取得
//   var mainDoc = DocumentApp.openById(mainDocsFileID);
//   Logger.log(mainDoc.getName());
//   Logger.log("bbbbbb");
//   Logger.log("cccccc");


//   // ================ 以下、研究中 ================
//   var body= mainDoc.getBody();
//   Logger.log(body);
//   var rangeElement= body.findText("Do Not Delete this sentence. Bot will write here");
//   Logger.log(rangeElement.getElement().asText());
//   Logger.log(rangeElement.getStartOffset());
//   Logger.log(rangeElement.getEndOffsetInclusive());
//   //var par = searchResult.getElement().asParagraph();
//   //Logger.log(searchResult);
//   //Logger.log(par);
//   //Logger.log(searchResult.getStartOffset());
//   Logger.log("dddddd");

//   //mainDoc.insertParagraph(20, "hogehogehogehogehogehogehogehogehogehogehogehogehogehogehogehoge")
//   body.insertParagraph(11, "piyopiyopiyopiyo1002")

//   // ================

//   // if (templateAsFile != "") {
//   //   var folder = DriveApp.getFolderById(templateFolderID);
//   //   var d = getCalcDate(days_from_today);
//   //   var filename = d + templateName;
//   //   var copy_file = templateAsFile.makeCopy(filename, folder);
//   //   sendPost(copy_file);
//   // } 
// }
