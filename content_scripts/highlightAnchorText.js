chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {

  if (message.type === "Tab-highlightAnchorText") {
    console.log(
      "--------------highlightAnchor message.type--------------",
      message.type
    );
    showIdentifier(message.params.identifier, message.params.identifierId);
    return false;
  }
});

/**
 *
 * @param {*} identifier
 * @returns
 */
function showIdentifier(identifier, identifierId) {
  console.log("--------------showIdentifier start--------------");
  // console.log("other params===", JSON.stringify(identifier), identifierId);

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
    // console.log("--------------currentLevel--------------",currentLevel, currentElement);
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

  // console.log("lastElement for selection--------------",currentLevel, currentElement, inputSelectionNodeData);

  // Check for valid offsets
  if (
    startOffset >= endOffset ||
    startOffset < 0
  ) {
    console.log("Invalid offsets!");
    return;
  }

  // console.log("--------------currentElement is Node Type--------------", currentElement.nodeType);
    
    //Todo: add data ids in mark element
  // Todo: fix offset. n position is shifted just after n+1 mark element
  // Todo: Fix getIdentifier the offsets are -1 if mark element is there. prevSiblingCount is wrong
 if (currentElement.nodeType === Node.TEXT_NODE || currentElement.localName == 'mark') {
    // console.log("==currentElement===",currentElement, startOffset, endOffset);
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
      console.log("Highlight Anchor Text - start");
      showIdentifier(identifier, identifierId);
})();
