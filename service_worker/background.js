
function injectedFunction(tab, info) {
  let selection1 = window.getSelection();
  console.log("--------------selection1--------------",selection1);

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
    console.log("parentLevel", parentLevel);
    console.log("anchorNode", anchorNode);
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
  
  console.log("--------------identifier--------------",JSON.stringify(identifier));
//   return identifier;  
// }

// function injectedFunction1() {
  // identifier = {"selectionNodeData":{"textContent":"extension","anchorOffset":18,"focusOffset":27,"contextBefore":"Create your first ","contextAfter":" that inserts a new element on the page."},"idLevel":6,"maxLevel":-1,"nodePaths":{"0":{"nodeType":3,"nodeName":"#text","prevSiblingCount":0},"1":{"id":"","nodeType":1,"className":"type--h5","nodeName":"P","localName":"p","tagName":"P","prevSiblingCount":1},"2":{"id":"","nodeType":1,"className":"flow-space-200 stack","nodeName":"DIV","localName":"div","tagName":"DIV","prevSiblingCount":0},"3":{"id":"","nodeType":1,"className":"measure-long pad-left-400 pad-right-400 stack width-full","nodeName":"ARTICLE","localName":"article","tagName":"ARTICLE","prevSiblingCount":0},"4":{"id":"","nodeType":1,"className":"display-flex justify-content-center width-full","nodeName":"DIV","localName":"div","tagName":"DIV","prevSiblingCount":1},"5":{"id":"","nodeType":1,"className":"display-flex gap-top-300 lg:gap-top-400","nodeName":"DIV","localName":"div","tagName":"DIV","prevSiblingCount":2},"6":{"id":"main-content","nodeType":1,"className":"","nodeName":"MAIN","localName":"main","tagName":"MAIN","prevSiblingCount":5}}};
  console.log("--------------Highlight selection start--------------");

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


// Create a context menu for selected text
chrome.contextMenus.create({
    id: "annotateText",
    title: "Annotate Text",
    contexts: ["selection"]
  });
  
  // Add a click event listener
  chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === "annotateText") {
      // Or call another file.
      // chrome.scripting.executeScript({
      //   target: { tabId: tab.id },
      //   files: ["content_scripts/add_comment.js"]
      // });

      chrome.scripting.executeScript({
        target : {tabId : tab.id},
        func : injectedFunction,
        args : [tab, info]
      });
    }
});