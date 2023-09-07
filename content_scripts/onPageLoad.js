// This script will run when the page loads
console.log("Page has loaded!");

// Here, you can write your logic to refresh or fetch new data
function fetchData() {
    console.log("Fetching or refreshing data...");
    fetchComments();
}

function fetchComments() {
  let token = "";
  chrome.storage.local.get(["token"], function (result) {
    token = result.token;
  });

  let requestData = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      token: token,
    }
  };

  let pageUrl = window.location.href || "";
  const showCommentApiUrl = `http://localhost:8000/data/identifier?url=${pageUrl}`;
  fetch(showCommentApiUrl, requestData)
    .then((response) => response.json())
    .then((data) => {
      let mappedIdentifier = {};
      for(let index in data){
        let identifier = data[index];        
        if (mappedIdentifier[identifier.id]){
          continue;
        }
        mappedIdentifier[identifier.id] = true;
        console.log("identifier", identifier);
        chrome.runtime.sendMessage({ type: "highlightAnchorText", identifier: identifier.identifier, 
        identifierId: identifier.id}); 
      }
    })
    .catch((error) => {
      console.error("Error fetching comments:", error);
    });
}

fetchData();