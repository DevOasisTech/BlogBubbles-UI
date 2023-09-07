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

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function showCommentsPopup(params) {
  console.log("showCommentsPopup", params);

  let commentBox = `<div class="comment-container" id="comment-container">`;
  const showCommentSection = document.getElementById("show-comment-section");
  await sleep(40);
  showCommentSection.innerHTML = commentBox;

  const loadingMessage = document.createElement("div");
  loadingMessage.innerText = "Loading...";
  fetchComments(params);
}

function fetchComments(params) {
  if (params?.kind == 'selection' ){
    fetchCommentsForSelection(params?.identifierId);
  }else if (params?.kind == 'page'){
    fetchCommentsForPage();
  }
}

function fetchCommentsForPage() {

}

function fetchCommentsForSelection(identifierId) {
  console.log("fetchCommentsForSelection", identifierId);
  if (identifierId == null){
    noCommentsPresent();
    return;
  }

  const showCommentApiUrl = `http://localhost:8000/v1/comments?identifier_id=${
    identifierId || null
  }`;

  fetch(showCommentApiUrl)
    .then((response) => response.json())
    .then((data) => {
      console.log("showCommentApi", data);
      displayComments(data);
    })
    .catch((error) => {
      console.error("Error fetching comments:", error);
      noCommentsPresent();
    });
}

function displayComments(data) {
  const commentContainer = document.getElementById("comment-container");

  let htmlBlocks = '';
  if (data?.length > 0) {
    data.forEach((entity) => {
      const commentboxUi = `
         <div class="box-background">
              <div class="comments-header">
              <div class="user-avatar">${entity?.user?.name[0].toUpperCase()}</div>
              <div class="user-details">
                <div class="show_comm_username">${entity?.user?.name}</div>
                <div class="comment-time">${formatDateAndTime(
                  entity.created_at
                )}</div>
              </div>
            </div>
            <div class="comment-box">
              <mark class="comment-text">${entity.archor_text}</mark>
            </div>
            <div class="show_comm_username">${entity.comment}</div>
         </div>
        `;
        htmlBlocks = htmlBlocks +   commentboxUi;    
    });
    commentContainer.innerHTML = htmlBlocks;
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
function formatDateAndTime(timestamp) {
  if (!timestamp) {
    return;
  }
  const date = new Date(timestamp);

  const year = date.getUTCFullYear();
  const month = (date.getUTCMonth() + 1).toString().padStart(2, "0");
  const day = date.getUTCDate().toString().padStart(2, "0");
  const hours = date.getUTCHours().toString().padStart(2, "0");
  const minutes = date.getUTCMinutes().toString().padStart(2, "0");

  const ampm = hours >= 12 ? "PM" : "AM";

  const hours12 = hours % 12 || 12;

  const formattedDate = `${day}/${month}/${year} ${hours12}:${minutes} ${ampm}`;

  return formattedDate;
}

function addStyles() {
  const style = document.createElement("style");
  style.innerHTML = `
    .box-background{
      padding: 16px;
      border-radius: 8px;
      background-color: #F5F5F5;
      margin-bottom: 10px;
    }

    .comment-container {
        display: flex;
        flex-direction: column;
        padding: 10px;
        margin-bottom: 10px;
        position: relative;
        }

        .show_comm_username {
        font-size: 14px;
        }
        .comment-time {
          font-size: 11px;
        }
        .comments-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 10px;
          gap: 10px
        }
    
        .user-avatar{
          width: 35px;
          height: 35px;
          background-color: #3498db;
          border-radius: 50%;
          display: flex;
          justify-content: center;
          align-items: center;
          color: white;
          font-size: 16px;
      }

      .user-details {
        flex-grow: 1;
      }
    `;
  document.head.appendChild(style);
}
addStyles();
