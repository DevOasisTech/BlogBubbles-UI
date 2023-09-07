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
    // textContent: selection.toString(),
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
  // console.log("--------------identifier--------------",JSON.stringify(identifier));


  return {identifier, identifierId, selectionText};
}

/**
 *
 * @param {*} identifier
 * @returns
 */
function showIdentifier(identifier, identifierId, selectionText) {

  console.log("--------------showIdentifier start--------------", JSON.stringify(identifier));
  console.log("other params===", identifierId, selectionText);

  if (!identifierId) {
    identifierId = "dummy-id";
  }

  let inputNodePaths = identifier["nodePaths"];

  let idLevel = identifier["idLevel"];

  if (idLevel < 0) {
    console.log("--------------idLevel is undefined--------------");
    return;
  }

  let currentLevel = idLevel;
  let currentNodePath = inputNodePaths[currentLevel];

  let currentElement = document.getElementById(currentNodePath.id);


  while (currentLevel >= 0) {
    console.log("--------------currentLevel--------------",currentLevel, currentElement);
    if (!currentElement) {
      console.log("--------------Missing currentElement--------------",currentLevel);
      return;
    }



    let currentSiblingCount = currentNodePath.prevSiblingCount;
    let ignoreTextNode = false;
    while(currentSiblingCount > 0){
      if (!currentElement){
        console.log("--------------Missing Sibling--------------",currentSiblingCount);
        return;
      }

      if (!ignoreTextNode || (currentElement.localName != 'mark' && currentElement.nodeType != Node.TEXT_NODE)){
        currentSiblingCount--;
        if (currentElement.localName == 'mark' && currentElement.nodeType == Node.TEXT_NODE){
          ignoreTextNode = true;
        } else {
          ignoreTextNode = false;
        }
      }
      currentElement = currentElement.nextSibling;    
    }

    if (currentLevel == 0) {
      break;
    }

    currentLevel--;
    currentNodePath = inputNodePaths[currentLevel];
    currentElement = currentElement.childNodes[0];
  }

  let inputSelectionNodeData = identifier["selectionNodeData"];
  let startOffset = inputSelectionNodeData.anchorOffset;
  let endOffset = inputSelectionNodeData.focusOffset;

  console.log("lastElement for selection--------------",currentLevel, currentElement, inputSelectionNodeData);

  // Check for valid offsets
  if (
    startOffset >= endOffset ||
    startOffset < 0
  ) {
    console.log("Invalid offsets!");
    return;
  }

  console.log("--------------currentElement is Node Type--------------", currentElement.nodeType);
    
    //Todo: add data ids in mark element
  // Todo: fix offset. n position is shifted just after n+1 mark element
  // Todo: Fix getIdentifier the offsets are -1 if mark element is there. prevSiblingCount is wrong
 if (currentElement.nodeType === Node.TEXT_NODE || currentElement.localName == 'mark') {
    console.log("==currentElement===",currentElement, startOffset, endOffset);
    while(endOffset > 0){
      if (!currentElement){
        console.log("--------------Missing Sibling--------------",currentLevel);
        return;
      }

      if (currentElement.localName == 'mark'){
        let alreadyHighlightedTextLength = currentElement.textContent.length;
        endOffset = endOffset - alreadyHighlightedTextLength;
        startOffset = startOffset - alreadyHighlightedTextLength;
        currentElement =  currentElement.nextSibling;
        continue;
      } else{
        let textNode = currentElement;
        let totalLength = textNode.textContent.length;
        
        if (startOffset >= totalLength){
          startOffset = startOffset - totalLength;
          endOffset = endOffset - totalLength;     
          currentElement =  currentElement.nextSibling;    
          continue;
        }

        if (startOffset < 0){
          startOffset = 0;
        }

        let currentLocalEndOffset = endOffset;
        let currentLocalStartOffset = startOffset;

        if (endOffset > totalLength){
          currentLocalEndOffset = totalLength;
        }
        // Split the text node at the ending offset, moving text after the endOffset into a new text node.
        let endNode = textNode.splitText(currentLocalEndOffset);

        // Split the text node at the starting offset, moving text after the startOffset into a new text node.
        let middleNode = textNode.splitText(currentLocalStartOffset);

        // Now, middleNode contains the text to be highlighted. Create a new element to wrap it.
        let highlightMark = document.createElement("mark");
        highlightMark.className = "highlighted-text";
        highlightMark.setAttribute('data-identifier-id', identifierId);


        // Replace middleNode with highlightMark, putting middleNode inside highlightMark.
        highlightMark.appendChild(middleNode);
        textNode.parentNode.insertBefore(highlightMark, endNode);

        startOffset =   startOffset - currentLocalStartOffset;
        endOffset = endOffset - currentLocalEndOffset;
        if (endOffset <= 0){
         return;
        }

        // check the correct logic here if nextElementSibling is needed
        currentElement = currentElement.nextElementSibling || currentElement.nextSibling;    
        currentElement = currentElement.nextSibling;    
      }
    }
  } else {
    console.log(
      "--------------currentElement is not a handled node type--------------",
      currentElement.nodeType, currentElement.localName
    );
    return;
  }
}


(async function () {
  console.log("Add Comment- start");
  chrome.runtime.sendMessage({ type: "checkLoginStatus" }, (response) => {
    console.log("Received response:", response);
    if (response.isLoggedIn) {
      console.log("Add Comment- isLoggedIn");
      let {identifier, identifierId, selectionText} = getIdentifier();
      hideTooltip();
      chrome.runtime.sendMessage({ type: "showCommentPopup", identifier: identifier, 
        identifierId: identifierId, selectionText: selectionText });
      // showIdentifier(identifier, identifierId, selectionText);
    } else {
      console.log("Add Comment- isLoggedOut");
      chrome.runtime.sendMessage({ type: "showLoginPopup" });
    }
  });
})();
