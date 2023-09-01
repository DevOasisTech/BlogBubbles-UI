function injectedFunction(tab, info, color) {
  console.log("executeScript via function",info, tab, color);
  console.log("selectionText", info.selectionText);
  // console.log("pageUrl",info.pageUrl);
  // console.log("favIconUrl", tab.favIconUrl);
  // console.log("title", tab.title);
  // console.log("height", tab.height);
  // console.log("width", tab.width);
  // console.log("highlighted", tab.highlighted);
  // console.log("selected", tab.selected);
  // console.log("id", tab.id);
  // console.log("index", tab.index);

  // document.body.style.backgroundColor = color;
  // Logged in current tab's console
  console.log("--------------executeScript via function--------------");
  const data = document.getElementById("ember25")
  console.log("--------------data--------------", data);

  const selection = window.getSelection();
  console.log("--------------selection--------------",selection);

  const activeElement = document.activeElement;
  console.log("--------------activeElement--------------",activeElement);
}

// On Action Button Click
// chrome.action.onClicked.addListener((tab) => {
//   chrome.scripting.executeScript({
//     target: { tabId: tab.id },
//     files: ["content_scripts/content.js"]
//   });
// });

// chrome.runtime.onInstalled.addListener(async () => {
// Create a context menu for selected text
chrome.contextMenus.create({
    id: "annotateText",
    title: "Annotate Text",
    contexts: ["selection"]
  });
  
  // Add a click event listener
  chrome.contextMenus.onClicked.addListener((info, tab) => {

//   chrome.windows.create({
//     width: 350,
//     height: 250,
//     top: 200,
//     left: 400,
//     type: "popup",
//     url: "alert.html"
//   });   
// Service worker cannot access the DOM, so alert() isn't available.





    if (info.menuItemId === "annotateText") {
      // Or call another file.
      // chrome.scripting.executeScript({
      //   target: { tabId: tab.id },
      //   files: ["content_scripts/add_comment.js"]
      // });

      chrome.scripting.executeScript({
        target : {tabId : tab.id},
        func : injectedFunction,
        args : [tab, info, "yellow"]
      });
    }
 
    // console.log("--------------annotateText--------------");
  //     chrome.scripting.executeScript({
  //       target: {tabId: tab.id},
  //       function: () => {

  //         let node = selection.anchorNode;
  //         console.log("--------------node--------------",node);
  //         // Navigate up the DOM tree to find the closest element with an ID
  //         while (node && node.nodeType !== Node.ELEMENT_NODE) {
  //           console.log("--------------node.nodeType--------------",node.id,node.nodeType, node);
  //           node = node.parentNode;
  //         }
  
  //         let elementWithId = null;
  
  //         while (node) {
  //           if (node.id) {
  //             elementWithId = node;
  //             break;
  //           }
  //           node = node.parentNode;
  //         }
  
  //         return elementWithId ? elementWithId.id : null;
  //       }
  //     }, (result) => {
  //       if (chrome.runtime.lastError) {
  //         console.error(chrome.runtime.lastError);
  //       } else {
  //         console.log(`ID of element or nearest parent with an ID: ${result[0]?.result}`);
  //       }
  //     });
  //   }
  // });

});