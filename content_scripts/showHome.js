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
    `;

  document.head.appendChild(style);
}

(async function () {
  console.log("showHome popup.");
  showHome();
})();
