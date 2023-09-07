chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "Tab-showCommentPopup") {
    console.log(
      "--------------ShowComment message.type--------------",
      message.type
    );
    // showCommentsPopup(message.params);
    return false;
  }
});

async function showCommentsPopup(params) {
  // console.log("showCommentsPopup====", params);
  let commentBox = `<div class="comment-container">
        <div class="comment-header">
          <span class="show_comm_username">User Name</span>
          <span class="options">...</span>
        </div>
        <div class="comment-text">
          This is the comment text. It can be quite long if needed.
        </div>
      </div>
      <div style="border-bottom: 1px solid rgb(242, 242, 242); padding: 20px, 0px"></div>
      `;

  const showCommentSection = document.getElementById("show-comment-section");

  showCommentSection.innerHTML = commentBox;

  const loadingMessage = document.createElement("div");
  loadingMessage.innerText = "Loading...";
  showCommentSection.appendChild(loadingMessage);
  const showCommentApiUrl = `http://localhost:8000/data/comments/1`;
  fetch(showCommentApiUrl)
    .then((response) => response.json())
    .then((data) => {
      showCommentSection.removeChild(loadingMessage);
    })
    .catch((error) => {
      console.error("Error fetching comments:", error);
    });
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
