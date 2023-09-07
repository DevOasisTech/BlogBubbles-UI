// This script will run when the page loads
console.log("Page has loaded!");

function addStyles() {
  const style = document.createElement("style");
  style.innerHTML = `
  .modal-content{
    display: flex;
    flex-direction: column;
  }
      .logo-container{
        display: flex;
        align-items: center;
        gap: 8px;
      }
      .logo-text{        
        font-size: 24px;
        font-weight: 600;
        background: -webkit-linear-gradient(#d522e4 0%, #2c28d8 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      }
      #add-comment-section{
        margin-top: 30px;
      }
      .logged-in-container {
        background-color: #fff;
        text-align: center;
        margin-top: auto;
        display: flex;
        align-items: center;
        gap: 10px;
        justify-content: space-between;
      }
      .username {
        font-size: 16px;
      }
      .logout-button {
        border: 1px solid #0073e6;
        color: #0073e6;
        padding: 10px 20px;
        border-radius: 4px;
        font-size: 16px;
        cursor: pointer;
        background-color: #fff;

      }
      .close-button {
        position: absolute;
        top: 10px;
        right: 10px;
        padding: 5px 10px;
        background: none;
        border: none;
        font-size: 24px;
        cursor: pointer;
        color: #333;
      }
      .success-message {
        background-color: lightgreen;
        color: black;
        padding: 10px;
        text-align: center;
        display: none;
        position: absolute;
        top: 0;
        left: 0;
        border-radius: 5px;
        width: 100%;
        font-size: 12px;
      }
      
      .comment-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 10px;
      }
    
    .comment-container {
        display: flex;
        flex-direction: column;
        padding: 10px;
        margin-bottom: 10px;
        position: relative;
      }
      .input-container textarea {
        padding: 10px;
        border: 1px solid #ccc;
        border-radius: 4px;
        font-size: 14px;
        text-decoration: none;
        outline: none;
        width: 100%;
      }
    
      .post-comment-button {
        background-color: #0073e6;
        color: #fff;
        padding: 10px 20px;
        border: none;
        border-radius: 4px;
        font-size: 16px;
        cursor: pointer;
      }
      
      .container {
        position: relative;
        width: 300px;
        padding: 20px;
        background-color: white;
        box-shadow: rgba(0, 0, 0, 0.12) 0px 2px 8px;
    }
    
    .user-name {
      font-size: 18px;
      margin-bottom: 10px;
    }
    
    .comment-box {
      border-radius: 4px;
      font-size: 16px;
    padding: 15px 0px;
    }

    .comment-text{
      background-color : #C7F6B6;
    }
    
    .comment-input {
        width: 100%;
        padding: 14px 10px !important;
        margin-bottom: 20px;
        border: 1px solid #ccc;
        border-radius: 4px;
        outline: none;
    }
    
    .cta-buttons {
        display: flex;
        justify-content: space-between;
    }
    
    .cta-button {
        padding: 8px 16px;
        border: none;
        cursor: pointer;
    }
    
    .post-button {
      background-color: #0073e6;
      color: #fff;
      padding: 10px 20px;
      border: none;
      border-radius: 4px;
      font-size: 16px;
      cursor: pointer;
    }   
   
    .highlighted-text {
      position: relative; 
      cursor: pointer;
  }
     
`;

  document.head.appendChild(style);
}

// Here, you can write your logic to refresh or fetch new data
function fetchData() {
  addStyles();  
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
  const showCommentApiUrl = `http://localhost:8000/v1/identifier?link=${pageUrl}`;
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