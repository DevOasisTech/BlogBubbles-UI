chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "Tab-showCommentPopup") {
    console.log(
      "--------------ShowComment message.type--------------",
      message.type
    );
    showCommentsPopup(message.params);
    return false;
  }
});

async function showCommentsPopup(params) {
  console.log("345678", params);

  let commentBox = `<div class="comment-container" id="comment-container">`;
  const showCommentSection = document.getElementById("show-comment-section");
  showCommentSection.innerHTML = commentBox;

  const loadingMessage = document.createElement("div");
  loadingMessage.innerText = "Loading...";
  fetchComments(params?.identifierId);
}

function fetchComments(identifierId) {
  const showCommentApiUrl = `http://localhost:8000/v1/comments/${
    identifierId || null
  }`;

  fetch(showCommentApiUrl)
    .then((response) => response.json())
    .then((data) => {
      console.log("34567", data);
      displayComments(data);
    })
    .catch((error) => {
      console.error("Error fetching comments:", error);
      noCommentsPresent();
    });
}

function displayComments(data) {
  const commentContainer = document.getElementById("comment-container");

  if (data?.length > 0) {
    data.forEach((entity) => {
      const headerContainer = document.createElement("div");
      headerContainer.className = "comment-header";

      const usernameElement = document.createElement("div");
      usernameElement.className = "show_comm_username";
      usernameElement.textContent = entity.user.name;

      headerContainer.appendChild(usernameElement);

      const commentTextElement = document.createElement("div");
      commentTextElement.className = "comment-text";
      commentTextElement.textContent = entity.comment;

      const divider = document.createElement("div");
      divider.style.borderBottom = "1px solid rgb(242, 242, 242)";
      divider.style.padding = "20px 0px";

      commentContainer.appendChild(headerContainer);
      commentContainer.appendChild(commentTextElement);
      commentContainer.appendChild(divider);
    });
  } else {
    noCommentsPresent();
  }
}

function noCommentsPresent() {
  const commentContainer = document.getElementById("comment-container");
  const noCommentsMessage = document.createElement("div");
  noCommentsMessage.textContent = "No comments found for this selection";
  noCommentsMessage.style.opacity = "0.8";
  noCommentsMessage.style.color = "black";
  commentContainer.appendChild(noCommentsMessage);
}

function addStyles() {
  const style = document.createElement("style");
  style.innerHTML = `
    .comment-container {
        display: flex;
        flex-direction: column;
        padding: 10px;
        margin-bottom: 10px;
        position: relative;
        }

        .show_comm_username {
        font-size: 16px;
        }
    `;
  document.head.appendChild(style);
}
addStyles();
