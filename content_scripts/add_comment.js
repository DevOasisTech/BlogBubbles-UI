/**
 * 
 * @returns 
 */
async function getIdentifier() {
    console.log("getIdentifier==============");
    let selection1 = window.getSelection();
    let anchorNode = selection1.anchorNode;
  
    let identifier = {};
    let selectionNodeData = {
        textContent: selection1.toString(), 
        anchorOffset: selection1.anchorOffset,
        focusOffset: selection1.focusOffset,
        contextBefore: selection1.anchorNode.textContent.slice(0, selection1.anchorOffset),
        contextAfter: selection1.focusNode.textContent.slice(selection1.focusOffset),
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
      nodePath["className"] = anchorNode.className // 'stack type'
      nodePath["nodeName"] = anchorNode.nodeName // 'DIV'
      nodePath["localName"] = anchorNode.localName // 'div
      nodePath["tagName"] = anchorNode.tagName // 'DIV'
  
      nodePath["prevSiblingCount"] = 0;    
      let siblingNode = anchorNode.previousSibling;
      while (siblingNode && siblingNode != null) {
        nodePath["prevSiblingCount"] = nodePath["prevSiblingCount"] + 1;
        siblingNode = siblingNode.previousSibling;
      }
      
      nodePaths[parentLevel] = nodePath;
      
      if (nodePath["id"]) {
        identifier["idLevel"] = parentLevel;
        break;
      }else{
        anchorNode = anchorNode.parentNode;
        parentLevel++;
      }
    }
    if (!identifier["idLevel"]){
      identifier["maxLevel"] = parentLevel - 1;
    }
  
    identifier["nodePaths"] = nodePaths;
    // console.log("--------------identifier--------------",JSON.stringify(identifier));
    return identifier;  
}

/**
 * 
 * @param {*} identifier 
 * @returns 
 */
function showIdentifier(identifier) {
    console.log("--------------showIdentifier start--------------");
    let inputNodePaths = identifier["nodePaths"];
    
    let idLevel = identifier["idLevel"];
    
    if (idLevel < 0 ) {
      console.log("--------------idLevel is undefined--------------");
      return;
    }
    
    let currentLevel = idLevel;
    let currentNodePath = inputNodePaths[currentLevel];
    
    let currentElement = document.getElementById(currentNodePath.id);
    
    while(currentLevel > 0){
      if (!currentElement){
        console.log("--------------Missing currentElement--------------", currentLevel);
      }
      let nextNodePath = inputNodePaths[currentLevel - 1];
      let nextElement = currentElement.childNodes[nextNodePath.prevSiblingCount];
      currentElement = nextElement;
      currentLevel--;
    }
    let inputSelectionNodeData = identifier["selectionNodeData"];
    let startOffset = inputSelectionNodeData.anchorOffset
    let endOffset = inputSelectionNodeData.focusOffset
    let styleClass = "highlighted";
  
      // Get the element's text content
      let originalText = currentElement.textContent;
        // Check for valid offsets
    if (startOffset >= endOffset || startOffset < 0 || endOffset > originalText.length) {
      console.log("Invalid offsets!");
      return;
    }
     
    // let cloneCurrentElement = currentElement.cloneNode(true);
  
    if (currentElement.nodeType === Node.ELEMENT_NODE) {
      // Slice the text into three parts: before, highlight, and after
        let beforeText = originalText.slice(0, startOffset);
        let highlightText = originalText.slice(startOffset, endOffset);
        let afterText = originalText.slice(endOffset);
  
      // Create new HTML with the highlight text wrapped in a span
      let highlightedHTML = `
        ${beforeText}
        <span class="#{styleClass}" style="background-color:yellow;">${highlightText}</span>
        ${afterText}
      `;
  
        // Replace the element's content
        currentElement.innerHTML = highlightedHTML;
    } else if (currentElement.nodeType === Node.TEXT_NODE) {
      let textNode = currentElement;
      
      // Split the text node at the ending offset, moving text after the endOffset into a new text node.
      let endNode = textNode.splitText(endOffset);
      
      // Split the text node at the starting offset, moving text after the startOffset into a new text node.
      let middleNode = textNode.splitText(startOffset);
      
      // Now, middleNode contains the text to be highlighted. Create a new element to wrap it.
      let highlightSpan = document.createElement("span");
      highlightSpan.style.backgroundColor = "yellow";
      highlightSpan.className = styleClass;
  
      // Replace middleNode with highlightSpan, putting middleNode inside highlightSpan.
      highlightSpan.appendChild(middleNode);
      textNode.parentNode.insertBefore(highlightSpan, endNode);
  
    } else {
      console.log("--------------currentElement is not a handled node type--------------", currentElement.nodeType);
      return;
    }
}

(async function() {
  console.log("Add Comment- start");
  chrome.runtime.sendMessage({type: 'checkLoginStatus'}, response => {
      console.log('Received response:', response);
      if (response.isLoggedIn) {
          console.log("Add Comment- isLoggedIn");
          let identifier = getIdentifier();
          showIdentifier(identifier);            
      } else{
        console.log("Add Comment- isLoggedOut");
        chrome.runtime.sendMessage({type: 'showLoginPopup'}, response => {});
      }
  });
})();