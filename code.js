/*
 * variables
 */
// init properties
var properties = PropertiesService.getScriptProperties();

// about slack
var webhookUrl = properties.getProperty("webhookUrl");
var slackMessage = "今週のアジェンダです。";

// docs
var templateFileID = properties.getProperty("templateFileID");
var mainDocsFileID = properties.getProperty("mainDocsFileID");

// other
var TARGET_TXT = "Do Not Delete this sentence. Bot will write here";

/*
 * Function
 */
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
    Logger.log(child.getText());
  }
}

function getTemplateFile(fID){
  return DriveApp.getFileById(fID);
}

function getBodyFromDocument(fID) {
  var doc = DocumentApp.openById(fID);
  var body= doc.getBody(); 
  return body;
}

function getTemplateBody(fID) {
  return getBodyFromDocument(fID);
}

function getMainFile(fID) {
  return getTemplateFile(fID);
}

function getMainBody(templateFile) {
  return getBodyFromDocument(templateFile.getId());
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
      offset = i + 1;
      break;
    } 
    // else {
    //   Logger.log("not Paragraph");
    // }
  }
  //Logger.log(`targetOffset: ${offset}`);  
  return offset;
}

// Get the formatted date yyyy/mm/dd day
function getFormattedDate(num) {
  num = num ? num : 0;
  var d = new Date();
  d.setDate(d.getDate() + num);
  //Logger.log(Utilities.formatDate(d, 'Asia/Tokyo', 'yyyy/MM/dd E'));
  return Utilities.formatDate(d, 'Asia/Tokyo', 'yyyy/MM/dd E');
}

function createSlackMessage(url) {
  return slackMessage + '\n' + url;
}

function sendPost(msg) {
  var param = { "text": msg };
  UrlFetchApp.fetch(webhookUrl, {
    method: 'POST',
    headers: {
      "Content-Type": 'application/json'
    },
    payload: JSON.stringify(param)
  });
}

/*
 * Main
 */
function main() {
  // get template Body
  var templateBody = getTemplateBody(templateFileID);
  var mainFile = getMainFile(mainDocsFileID);
  var mainBody = getMainBody(mainFile);
  var targetOffset = getTargetParagraphOffset(mainBody);

  // template Body to Element array
  var lastChildNum = templateBody.getNumChildren();
  var startIndex = 0;
  var templateElmArr = [];
  for ( i = startIndex; i < lastChildNum; i++) {
    templateElmArr.push(templateBody.getChild(i))
  }

  // insert template Element to main Body
  var startOffset = targetOffset;
  for (i = 0; i < lastChildNum - startIndex; i++)
  {
    var el = templateElmArr[i];

    // ElementType is PARAGRAPH
    if(el.getType() == DocumentApp.ElementType.PARAGRAPH) {
      var parag = el.copy().asParagraph();

      if ( parag.getText().indexOf("YYYY/mm/dd day") !== -1 ) {
        var formattedDate = getFormattedDate(1);
        var replacedElement = parag.replaceText("YYYY/mm/dd day",formattedDate);
        // Logger.log(parag.getText());
        // Logger.log(replacedElement.asParagraph().getText());
        mainBody.insertParagraph(i + startOffset, replacedElement.asParagraph());
      } else {
        mainBody.insertParagraph(i + startOffset, parag);
      }

    // ElementType is LIST_ITEM
    } else if (el.getType() == DocumentApp.ElementType.LIST_ITEM) {
      mainBody.insertListItem(i + startOffset, el.copy().asListItem());
    }
  }

  // post to slack channel
  var msg = createSlackMessage(mainFile.getUrl());
  sendPost(msg);
}