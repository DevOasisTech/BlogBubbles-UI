  // Function to hide tooltip
  function hideTooltip() {
    const tooltip = document.getElementById('myTooltip');
    if (tooltip == null) {
      return;
    }
    tooltip.style.display = 'none';
  }


/**
 *
 * @returns
 */
function getIdentifier() {
 
  console.log("getIdentifier==============");
  let selection = window.getSelection();
  let anchorNode = selection.anchorNode;
  
  
  let parentElement = anchorNode.parentElement;
  let identifierId = null;
  if (parentElement.localName == 'mark') {
      if(parentElement.textContent == selection.toString()){
        identifierId = parentElement.getAttribute('data-identifier-id');
      }
  }

  let identifier = {};
  let selectionText = selection.toString();

  //Todo: Handle opposite selection for anchorOffset and focusOffset
  let selectionNodeData = {
    textContent: selection.toString(),
    anchorOffset: selection.anchorOffset, // chaange for mark
    focusOffset: selection.focusOffset, // change for mark
  };
  identifier["selectionNodeData"] = selectionNodeData;
  identifier["idLevel"] = -1;
  identifier["maxLevel"] = -1;

  let nodePaths = {};
  let parentLevel = 0;
  // Navigate up to find the closest element with an ID
  while (anchorNode) {
    let nodePath = {};
    nodePath["id"] = anchorNode.id;
    nodePath["nodeType"] = anchorNode.nodeType;
    nodePath["className"] = anchorNode.className; // 'stack type'
    nodePath["nodeName"] = anchorNode.nodeName; // 'DIV'
    nodePath["localName"] = anchorNode.localName; // 'div
    nodePath["tagName"] = anchorNode.tagName; // 'DIV'
    nodePath["prevSiblingCount"] = 0;
    let ignoreTextNode = false;
    if (!nodePath["id"]){
      if (anchorNode.localName == 'mark' || anchorNode.nodeType === Node.TEXT_NODE){
        ignoreTextNode = true;
      }

      let siblingNode =  anchorNode.previousSibling;
      while (siblingNode && siblingNode != null) {
        if (ignoreTextNode && (siblingNode.localName == 'mark' || 
            siblingNode.nodeType === Node.TEXT_NODE)) {
              ignoreTextNode = true;
          if (parentLevel == 0 && nodePath["prevSiblingCount"] == 0){
            // fetch the text in mark and add in offsets in anchorOffset & focusOffset
            let prevText = siblingNode.textContent;
            let prevTextLength = prevText.length;
            identifier["selectionNodeData"]["anchorOffset"] = 
              identifier["selectionNodeData"]["anchorOffset"] + prevTextLength;
            
            identifier["selectionNodeData"]["focusOffset"] = 
              identifier["selectionNodeData"]["focusOffset"] + prevTextLength;
          }
        }else{
          nodePath["prevSiblingCount"] = nodePath["prevSiblingCount"] + 1;
          if (siblingNode.localName == 'mark' || 
              siblingNode.nodeType === Node.TEXT_NODE){
                ignoreTextNode = true; 
          }
          ignoreTextNode = false;
        }
  
        siblingNode = siblingNode.previousSibling;
      }
    }

    nodePaths[parentLevel] = nodePath;

    if (nodePath["id"]) {
      identifier["idLevel"] = parentLevel;
      break;
    } else {
      anchorNode = anchorNode.parentNode;
      parentLevel++;
    }
  }
  if (!identifier["idLevel"]) {
    identifier["maxLevel"] = parentLevel - 1;
  }

  identifier["nodePaths"] = nodePaths;
  console.log("--------------identifier--------------",JSON.stringify(identifier));
  return {identifier, identifierId, selectionText};
}

(async function () {
  console.log("Add Comment- start");
  chrome.runtime.sendMessage({ type: "checkLoginStatus" }, (response) => {
    console.log("Received response:", response);
    if (response.isLoggedIn) {
      console.log("Add Comment- isLoggedIn");
      let {identifier, identifierId, selectionText} = getIdentifier();
      hideTooltip();
      chrome.runtime.sendMessage({ type: "ShowHome" }, () => {
        chrome.runtime.sendMessage({ type: "addCommentPopup", identifier: identifier, 
        identifierId: identifierId, selectionText: selectionText });
        chrome.runtime.sendMessage({ type: "showCommentPopup", identifier: identifier, 
        identifierId: identifierId, selectionText: selectionText, kind: "selection" });
      });
    } else {
      console.log("Add Comment- isLoggedOut");
      chrome.runtime.sendMessage({ type: "showLoginPopup" });
    }
  });
})();
