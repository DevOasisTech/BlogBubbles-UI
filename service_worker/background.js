async function checkLoginStatus() {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get(['token'], function(result) {
      if (chrome.runtime.lastError) {
        return reject(chrome.runtime.lastError);
      }
      if (!result || !result.token) {
        console.log("Not logged in");
        resolve({ isLoggedIn: false });
      } else {
        console.log("Logged in");
        resolve({ isLoggedIn: true });
      }
    });
  });
}


async function getActiveTab() {
  return new Promise((resolve, reject) => {
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
      if (chrome.runtime.lastError) {
        return reject(chrome.runtime.lastError);
      }      
      if (tabs.length === 0) {
        return reject(new Error("No active tab found."));
      }
      resolve(tabs[0]);
    });
  });
}

function showSignupPopup() {
  getActiveTab().then((activeTab) => {
    if(activeTab) {
      // Execute your content script
      chrome.scripting.executeScript({
        target: { tabId: activeTab.id },
        files: ["content_scripts/showLogin.js"]
      }, function() {
        // Optional callback after the script has been injected
        if (chrome.runtime.lastError) {
          console.error(chrome.runtime.lastError);
        }
      });
    }
  });
}

function ShowSignup() {
  getActiveTab().then((activeTab) => {
    if(activeTab) {
      // Execute your content script
      chrome.scripting.executeScript({
        target: { tabId: activeTab.id },
        files: ["content_scripts/showSignup.js"]
      }, function() {
        // Optional callback after the script has been injected
        if (chrome.runtime.lastError) {
          console.error(chrome.runtime.lastError);
        }
      });
    }
  });
}

function ShowHome() {
  console.log("Called");

  getActiveTab().then((activeTab) => {
    if(activeTab) {
      console.log("before exe");

      chrome.scripting.executeScript({
        target: { tabId: activeTab.id },
        files: ["content_scripts/showHome.js"]
      }, function() {
        // Optional callback after the script has been injected
        if (chrome.runtime.lastError) {
          console.log("ShowHomeScript error");
          console.error(chrome.runtime.lastError);
        }
      });
    }
  });
}

function AddCommentScript() {
  getActiveTab().then((activeTab) => {
    if(activeTab) {
      // Execute your content script
      chrome.scripting.executeScript({
        target: { tabId: activeTab.id },
        files: ["content_scripts/addCommentInit.js"]
      }, function() {
        // Optional callback after the script has been injected
        if (chrome.runtime.lastError) {
          console.log("AddCommentScript error");
          console.error(chrome.runtime.lastError);
        }
      });
    }
  });
}

function AddCommentPopup(params) {
  getActiveTab().then((activeTab) => {
    if(activeTab) {
      chrome.tabs.sendMessage(activeTab.id, { type: "Tab-addCommentPopup", params: params });
    }
  });
}

function ShowCommentPopup(params) {
  getActiveTab().then((activeTab) => {
    if(activeTab) {
      chrome.tabs.sendMessage(activeTab.id, { type: "Tab-showCommentPopup", params: params });
    }
  });
}

function HighlightAnchorText(params) {
  getActiveTab().then((activeTab) => {
    if(activeTab) {
      chrome.tabs.sendMessage(activeTab.id, { type: "Tab-highlightAnchorText", params: params });
    }
  });
}


chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log("--------------message.type--------------",message.type);
  if (message.type === 'checkLoginStatus') {
    resp = checkLoginStatus().then((resp) => {
      console.log("resp", resp);
      sendResponse(resp);
    });
    return true;  
  } else if (message.type === 'showLoginPopup') {
    showSignupPopup(); 
    return false; 
  } else if (message.type === 'ShowSignup') {
    ShowSignup(); 
    return false; 
  } else if (message.type === 'ShowHome') {
    console.log("Inside");
    ShowHome(); 
    return false; 
  } else if (message.type === 'executeAddCommentScript') {
    AddCommentScript(); 
    return false; 
  } else if (message.type === 'addCommentPopup') {
    const params = {
      "identifier": message.identifier,
      "identifierId": message.identifierId,
      "selectionText": message.selectionText
    }
    AddCommentPopup(params); 
    return false; 
  }else if (message.type === 'showCommentPopup') {
    const params = {
      "identifier": message.identifier,
      "identifierId": message.identifierId,
      "selectionText": message.selectionText,
      "kind": message.kind 
    }
    ShowCommentPopup(params); 
    return false; 
  }  else if (message.type === 'highlightAnchorText') {
    const params = {
      "identifier": message.identifier,
      "identifierId": message.identifierId
    }
    console.log("highlightAnchorText params", params);
    HighlightAnchorText(params); 
    return false; 
  }
   else {
    return false;
  }
});


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
      AddCommentScript();
    }
  });

  chrome.action.onClicked.addListener((tab) => {
    console.log("chrome.action.onClicked", tab);
    chrome.scripting.executeScript({
      target: {tabId: tab.id},
      files: ['content_scripts/actionPopup.js']
    });
  });

});