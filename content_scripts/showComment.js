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
  const showCommentApiUrl = `http://localhost:8000/v1/comments?identifier_id=${
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
      headerContainer.className = "comments-header";

      const userAvatarElement = document.createElement("div");
      userAvatarElement.className = "user-avatar";
      userAvatarElement.textContent = "A";

      const userDetailsContainer = document.createElement("div");
      userDetailsContainer.className = "user-details";

      const usernameElement = document.createElement("div");
      usernameElement.className = "show_comm_username";
      usernameElement.textContent = entity.user.name;

      const timeElement = document.createElement("div");
      timeElement.className = "comment-time";
      timeElement.textContent = formatDateAndTime(entity.created_at);

      userDetailsContainer.appendChild(usernameElement);
      userDetailsContainer.appendChild(timeElement);

      headerContainer.appendChild(userAvatarElement);
      headerContainer.appendChild(userDetailsContainer);

      const commentTextElement = document.createElement("div");
      commentTextElement.className = "comment-box comment-text";
      commentTextElement.textContent = entity.archor_text;

      const addedCommentElement = document.createElement("div");
      addedCommentElement.className = "show_comm_username";
      addedCommentElement.textContent = entity.comment ;

      const divider = document.createElement("div");
      divider.style.borderBottom = "1px solid black";
      divider.style.margin = "30px 0px";

      commentContainer.appendChild(headerContainer);
      commentContainer.appendChild(commentTextElement);
      commentContainer.appendChild(addedCommentElement);
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
function formatDateAndTime(timestamp) {
  if (!timestamp) {
    return 
  }
  const date = new Date(timestamp);

  const year = date.getUTCFullYear();
  const month = (date.getUTCMonth() + 1).toString().padStart(2, '0');
  const day = date.getUTCDate().toString().padStart(2, '0');
  const hours = date.getUTCHours().toString().padStart(2, '0');
  const minutes = date.getUTCMinutes().toString().padStart(2, '0');

  const ampm = hours >= 12 ? 'PM' : 'AM';

  const hours12 = (hours % 12) || 12;

  const formattedDate = `${day}/${month}/${year} ${hours12}:${minutes} ${ampm}`;

  return formattedDate;
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
