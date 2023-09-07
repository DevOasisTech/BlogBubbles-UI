chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log(
    "--------------Show Comment message.type--------------",
    message.type
  );
  if (message.type === "Tab-showCommentPopup") {
    shoWCommentsPopup(message.params);
    return false;
  }
});

async function shoWCommentsPopup(params) {
  console.log("params", params);
  let userPostCommentsForm = `
  <div class="container">
  <div class="success-message">You have added comment successfully.</div>
    <div class="user-name">User Name</div>
      <div class="comment-box">
       ${params?.selectionText}
      </div>
      <input type="text" class="comment-input" id="comment-input" placeholder="Write a comment...">
        <div class="cta-buttons">
          <button class="cta-button post-button" id="post-button">Post</button>
          <button class="cta-button cancel-button">Cancel</button>
        </div>
    </div>
`;
  let devider = `<div style="border-bottom: 1px solid rgb(242, 242, 242); padding: 20px 0px"></div>`;
  let responses = `<div style="font-size: 22px; font-weight: bold; padding: 20px 0px;">All Comments</div>`;
  let commentBox = `<div class="comment-container">
      <div class="comment-header">
        <span class="username">User Name</span>
        <span class="options">...</span>
      </div>
      <div class="comment-text">
        This is the comment text. It can be quite long if needed.
      </div>
    </div>
    <div style="border-bottom: 1px solid rgb(242, 242, 242); padding: 20px, 0px"></div>
    `;

  const addCommentSection = document.getElementById("add-comment-section");
  let modalContentHtml =
    userPostCommentsForm + devider + responses + commentBox;
  addCommentSection.innerHTML = modalContentHtml;

  // const closeButton = document.getElementById("close-button");
  const postButton = document.getElementById("post-button");
  const commentInput = document.getElementById("comment-input");
  const successMessage = document.querySelector(".success-message");

  // closeButton.addEventListener("click", function () {
  //   modalContainer.remove();
  // });

  fetchComments();

  function fetchComments() {
    const loadingMessage = document.createElement("div");
    loadingMessage.innerText = "Loading...";
    addCommentSection.appendChild(loadingMessage);
    const showCommentApiUrl = `http://localhost:8000/data/comments/${
      params?.identifierId || null
    }`;
    fetch(showCommentApiUrl)
      .then((response) => response.json())
      .then((data) => {
        addCommentSection.removeChild(loadingMessage);
        console.log("data", data);
      })
      .catch((error) => {
        console.error("Error fetching comments:", error);
      });
  }

  const data = {
    identifier: params?.identifier || {},
    url: window.location.href || "",
    comment: commentInput.value || "",
    identifier_id: params?.identifierId || null,
    anchor_text: params?.selectionText || "",
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
      successMessage.style.display = "block";
      setTimeout(() => {
        successMessage.style.display = "none";
      }, 2000);
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
