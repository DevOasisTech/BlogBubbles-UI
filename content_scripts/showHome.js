async function createLoggedInContainer() {
  let mainDivClassId = 'logged-in-modal-container';

  let mainContainerEle = document.getElementById(mainDivClassId);
  if (mainContainerEle == null) {
    await chrome.storage.local.get(["token"], function (result) {
      const token = result.token;
      console.log("tokentoken", token);
      if (token) {
        const userData = getUserDataFromToken(token);
        let mainContainer = document.createElement("div");
        mainContainer.id = mainDivClassId;
      
        mainContainer.style.position = "fixed";
        mainContainer.style.top = "0";
        mainContainer.style.right = "0";
        mainContainer.style.width = "100%";
        mainContainer.style.height = "100%";
        mainContainer.style.backgroundColor = "rgba(0, 0, 0, 0.8)";
        mainContainer.style.zIndex = "10000";
        mainContainer.style.display = "flex";
        mainContainer.style.justifyContent = "flex-end";
        
        let loggedInHeader = document.createElement("div");
        loggedInHeader.className = "modal-content";
        loggedInHeader.style.backgroundColor = "white";
        loggedInHeader.style.padding = "50px";
        loggedInHeader.style.width = "400px";
        loggedInHeader.style.height = "100vh";
        mainContainer.appendChild(loggedInHeader);
    
      const loggedInContainer = `
      <button id="close-button" class="close-button">X</button>
        <div class="logged-in-container">
            <div class="username" id="login-user-name">${userData.username}</div>
            <button id="logout-btn" class="logout-button">Logout</button>
        </div>
        `;
        
        const addCommentSection = `<div id="add-comment-section"></div>`
        const showCommentSection = `<div id="show-comment-section"></div>`

        let modalContentHtml = loggedInContainer + addCommentSection + showCommentSection;
        loggedInHeader.innerHTML = modalContentHtml;

        document.body.appendChild(mainContainer);
    
        const closeButton = document.getElementById("close-button");
        closeButton.addEventListener("click", function () {
          console.log("closeButton");
          mainContainer.style.display = 'none';
        });
    
        const logoutButton = document.getElementById("logout-btn");
        logoutButton.addEventListener("click", function () {
          console.log("logout clicked");
          chrome.storage.local.remove(["token"], function () {
            mainContainer.remove();
            chrome.runtime.sendMessage({ type: "showLoginPopup" });
          });
        });
    
        addStyles();
        mainContainerEle = mainContainer;
      }
    });
  }
  
  if (mainContainerEle){
    mainContainerEle.style.display = 'flex';
  }

}

function getUserDataFromToken(token) {
  try {
    const tokenPayload = JSON.parse(atob(token.split(".")[1]));
    const userData = {
      username: tokenPayload.email,
    };
    return userData;
  } catch (error) {
    console.error("Error decoding token or extracting user data:", error);
    return null;
  }
}

async function showHome() {
  createLoggedInContainer();
}

function addStyles() {
  const style = document.createElement("style");
  style.innerHTML = `
      .logged-in-container {
        background-color: #fff;
        padding: 20px;
        text-align: center;
      }
  
      .username {
        font-size: 16px;
        margin-bottom: 20px;
      }
      .logout-button {
        background-color: #0073e6;
        color: #fff;
        padding: 10px 20px;
        border: none;
        border-radius: 4px;
        font-size: 16px;
        cursor: pointer;
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
      .highlighted-text {
        background-color: rgb(210, 231, 209);
        color: black;
        cursor: pointer;
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
      font-size: 14px;
      margin: 20px 0px;
      padding: 15px;
      box-shadow: rgba(0, 0, 0, 0.04) 0px 1px 4px;
      border: 1px solid rgba(0, 0, 0, 0.1);
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
    `;

  document.head.appendChild(style);
}

(async function () {
  console.log("showHome popup.");
  showHome();
})();
