async function checkLoginStatus() {
  console.log("--------------checkLoginStatus--------------");

  chrome.storage.local.get(['token'], function(result) {
    console.log("--------------getAuthToken--------------");
    if (result.token) {
      console.log("Token:===", result.token)
      chrome.action.setPopup({ popup: 'components/comments.html' });
    } else {
      chrome.action.setPopup({ popup: 'components/signIn.html' });
    }
  });
}

// Initial check
checkLoginStatus();

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log("--------------message.type--------------",message.type);
  if (message.type === 'checkLogin') {
    checkLoginStatus();
  }
});



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
  });
  return {status: 'checked'};
}
function showLoginPopup() {
  // Query for the active tab in the current window
  chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
    // tabs is an array, but there should only be one active tab in the current window
    console.log("tabs",tabs);
    const activeTab = tabs[0];

    // Check if activeTab is available
    if (!activeTab) {
      console.error("No active tab found.");
      return;
    }

    // Execute your content script
    chrome.scripting.executeScript({
      target: { tabId: activeTab.id },
      files: ["content_scripts/show_login.js"]
    }, function() {
      // Optional callback after the script has been injected
      if (chrome.runtime.lastError) {
        console.error(chrome.runtime.lastError);
      }
    });
  });
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log("--------------message.type--------------",message.type);
  if (message.type === 'checkLoginStatus') {
    resp = checkLoginStatus();
    sendResponse(resp);
  } else if (message.type === 'showLoginPopup') {
    showLoginPopup();
  } else {
    return false;
  }
});

// Initial check
// checkLoginStatus();

chrome.runtime.onInstalled.addListener(function() {
// Create a context menu for selected text
chrome.contextMenus.create({
    id: "annotateText",
    title: "Add Comment",
    contexts: ["selection"]
  });
  
  // Add a click event listener
  chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === "annotateText") {
      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ["content_scripts/add_comment.js"]
      });
    }
  });

//   chrome.contextMenus.create({
//     id: 'openSidePanel',
//     title: 'Open side panel',
//     contexts: ['all']
//   });
//   chrome.tabs.create({ url: 'page.html' });
// });

// chrome.contextMenus.onClicked.addListener((info, tab) => {
//   if (info.menuItemId === 'openSidePanel') {
//     // This will open the panel in all the pages on the current window.
//     chrome.sidePanel.open({ windowId: tab.windowId });
//   }
// });

// chrome.runtime.onMessage.addListener((message, sender) => {
//   // The callback for runtime.onMessage must return falsy if we're not sending a response
//   (async () => {
//     if (message.type === 'open_side_panel') {
//       console.log("sender.tab.id",sender.tab.id);
//       // This will open a tab-specific side panel only on the current tab.
//       // await chrome.sidePanel.open({ tabId: sender.tab.id });
//       await chrome.sidePanel.setOptions({
//         tabId: sender.tab.id,
//         path: 'sidepanel-tab.html',
//         enabled: true
//       });
//     }
//   })();
});