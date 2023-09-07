chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log("--------------Show Comment message.type--------------",message.type);
 if (message.type === 'Tab-showCommentPopup') {
    shoWCommentsPopup(message.params); 
    return false; 
  }
});

async function shoWCommentsPopup(params) {
  console.log("Show Comment - start", params);
  let modalContainer = document.createElement("div");
  modalContainer.style.position = "fixed";
  modalContainer.style.top = "0";
  modalContainer.style.right = "0";
  modalContainer.style.width = "100%";
  modalContainer.style.height = "100%";
  modalContainer.style.backgroundColor = "rgba(0, 0, 0, 0.8)";
  modalContainer.style.zIndex = "10000";
  modalContainer.style.display = "flex";
  modalContainer.style.justifyContent = "flex-end";

  let modalContent = document.createElement("div");
  modalContent.className = "modal-content";

  modalContent.style.backgroundColor = "white";
  modalContent.style.padding = "50px";
  modalContent.style.width = "400px";
  modalContent.style.height = "100vh";

  modalContainer.appendChild(modalContent);
  let userPostCommentsForm = `
  <button id="close-button" class="close-button">X</button>
  <div class="container">
    <div class="user-name">User Name</div>
      <div class="comment-box">
        Selected text
      </div>
      <input type="text" class="comment-input" id="comment-input" placeholder="Write a comment...">
        <div class="cta-buttons">
          <button class="cta-button post-button" id="post-button">Post</button>
          <button class="cta-button cancel-button">Cancel</button>
        </div>
    </div>
`;

  modalContent.innerHTML = userPostCommentsForm;
  modalContainer.appendChild(modalContent);
  document.body.appendChild(modalContainer);

  const closeButton = document.getElementById("close-button");
  const postButton = document.getElementById("post-button");
  const commentInput = document.getElementById("comment-input");

  closeButton.addEventListener("click", function () {
    modalContainer.remove();
  });

  const comment = commentInput.value;
  const data = {
    identifier: {},
    url: window.location.href || "",
    comment: comment || "",
    identifier_id: null,
    anchor_text: "string",
  };

  let requestData = {};

  chrome.storage.local.get(["token"], function (result) {
    token = result.token;
    requestData = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        token: token,
      },
      body: JSON.stringify(data),
    };
  });

  postButton.addEventListener("click", async function () {
    const addCommentApiUrl = "http://localhost:8000/data/comments";
    try {
      const response = await fetch(addCommentApiUrl, requestData);
      if (!response.ok) {
        throw new Error("Something went wrong");
      }
      const data = await response.json();
      console.log("API response:", data);
    } catch (error) {
      console.error("API error:", error);
      // errorMsg.textContent = error.message;
    }
  });
}

function getUserDataFromToken(token) {
  try {
    const tokenPayload = JSON.parse(atob(token.split(".")[1]));
    const userData = {
      username: tokenPayload.email,
    };
    console.log("Try", userData);
    return userData;
  } catch (error) {
    console.error("Error decoding token or extracting user data:", error);
    return null;
  }
}

function addStyles() {
  const style = document.createElement("style");
  style.innerHTML = `
  .highlighted-text {
    background-color: rgb(210, 231, 209);
    color: black;
    cursor: pointer;
  }


  .user-info {
    display: flex;
    align-items: center;
    margin-bottom: 20px;
  }

  .user-avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    margin-right: 10px;
  }

  .username {
    font-size: 16px;
    font-weight: bold;
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
  .container {
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

.cancel-button {
    background-color: #f0f0f0;
    color: #000;
    padding: 10px 20px;
    border: none;
    border-radius: 4px;
    font-size: 16px;
    cursor: pointer;
}
  `;

  document.head.appendChild(style);
}
addStyles();