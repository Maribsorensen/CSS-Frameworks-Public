import { addComment, deleteComment, readPostsByUser } from "../../api/post/read";
import { readProfile } from "../../api/profile/read";
import { onDeletePost } from "../../ui/post/delete";
import { authGuard } from "../../utilities/authGuard";

/**
 * Displays posts by the logged-in user in the "posts-container" element.
 * 
 * @async
 * @function
 * @throws {Error} Logs an error if fetching or displaying posts fails.
 */
async function displayProfilePosts() {
  const username = localStorage.getItem("username");
  if (!username) {
    console.error("No username found in localStorage.");
    return;
  }

  try {

    const postsData = await readPostsByUser(username);

    const postsContainer = document.getElementById("posts-container");
    postsContainer.innerHTML = "";

    postsData.data.forEach(post => {
      const postElement = createProfilePostElement(post);
      postsContainer.appendChild(postElement);
    });
  } catch (error) {
    console.error("Error displaying posts by user:", error);
  }
}

/**
 * Displays the user's profile information in the "user-profile" element.
 * 
 * @async
 * @function
 * @throws {Error} Logs an error if fetching or displaying profile data fails.
 */
async function displayUserProfile() {
  const username = localStorage.getItem("username");

  if (username) {
    const profileData = await readProfile(username);

    const profileContainer = document.getElementById("user-profile");
    profileContainer.innerHTML = "";

    if (profileData) {
      const avatarUrl = profileData.avatar?.url || "default-avatar-url.jpg";

      const contentDiv = document.createElement("div");
      contentDiv.classList.add("profile-content");

      const avatarImg = document.createElement("img");
      avatarImg.src = avatarUrl;
      avatarImg.alt = "Avatar";
      avatarImg.classList.add("avatar");
      contentDiv.appendChild(avatarImg);

      const profileName = document.createElement("h2");
      profileName.textContent = `${profileData.name}'s Profile`;
      contentDiv.appendChild(profileName);

      const bioPara = document.createElement("p");
      bioPara.textContent = `Bio: ${profileData.bio || "No bio available"}`;
      contentDiv.appendChild(bioPara);

      const postsPara = document.createElement("p");
      postsPara.textContent = `Posts: ${profileData._count.posts}`;
      contentDiv.appendChild(postsPara);

      const followersPara = document.createElement("p");
      followersPara.textContent = `Followers: ${profileData._count.followers}`;
      contentDiv.appendChild(followersPara);

      const followingPara = document.createElement("p");
      followingPara.textContent = `Following: ${profileData._count.following}`;
      contentDiv.appendChild(followingPara);

      profileContainer.appendChild(contentDiv);
    } else {
      const errorMessage = document.createElement("p");
      errorMessage.textContent = "Error loading profile information.";
      profileContainer.appendChild(errorMessage);
    }
  } else {
    const noUserMessage = document.createElement("p");
    noUserMessage.textContent = "No user logged in.";
    profileContainer.appendChild(noUserMessage);
  }
}

/**
 * Creates a DOM element for a user's post.
 * 
 * @function
 * @param {Object} post - The post data.
 * @param {string} post.title - The title of the post.
 * @param {string} post.body - The body of the post.
 * @param {Array<string>} post.tags - Tags associated with the post.
 * @param {Object} post.author - Information about the post's author.
 * @param {Object} post.media - Media attached to the post.
 * @param {Array<Object>} post.comments - Comments on the post.
 * @returns {HTMLElement} The DOM element representing the post.
 */
export function createProfilePostElement(post) {
  const postElement = document.createElement("div");
  postElement.classList.add("post");

  const titleElement = document.createElement("h2");
  titleElement.textContent = post.title;
  postElement.appendChild(titleElement);

  const bodyElement = document.createElement("p");
  bodyElement.textContent = post.body;
  postElement.appendChild(bodyElement);

  const tagsElement = document.createElement("p");
  tagsElement.textContent = `Tags: ${post.tags.join(", ")}`;
  postElement.appendChild(tagsElement);

  if (post.author && post.author.name) {
    const authorElement = document.createElement("p");
    authorElement.textContent = `Written by: ${post.author.name}`;
    postElement.appendChild(authorElement);

    if (post.author.avatar && post.author.avatar.url) {
      const avatarElement = document.createElement("img");
      avatarElement.setAttribute("src", post.author.avatar.url);
      avatarElement.setAttribute("alt", post.author.name);
      avatarElement.classList.add("author-avatar");
      postElement.appendChild(avatarElement);
    }
  }

  if (post.media && post.media.url) {
    const imageElement = document.createElement("img");
    imageElement.setAttribute("src", post.media.url);
    imageElement.setAttribute("alt", post.media.alt || "Post image");
    postElement.appendChild(imageElement);
  }

  const commentsSection = document.createElement("div");
  commentsSection.classList.add("comments-section");

  if (post.comments && post.comments.length > 0) {
    post.comments.forEach(comment => {
      const commentElement = document.createElement("div");
      commentElement.classList.add("comment");

      const commentBody = document.createElement("p");
      commentBody.textContent = comment.body;
      commentElement.appendChild(commentBody);

      const commentAuthor = document.createElement("small");
      commentAuthor.textContent = `by ${comment.author.name}`;
      commentElement.appendChild(commentAuthor);

      const deleteButton = document.createElement("button");
      deleteButton.textContent = "Delete";
      deleteButton.classList.add("delete-comment-button");
      deleteButton.addEventListener("click", async () => {
        try {
          const confirmDelete = window.confirm("Are you sure you want to delete this comment?");
          if (confirmDelete) {
            const success = await deleteComment(post.id, comment.id);
            if (success) {
              commentElement.remove();
            }
          }
        } catch (error) {
          console.error("Error deleting comment:", error);
        }
      });

      commentElement.appendChild(deleteButton);
      commentsSection.appendChild(commentElement);
    });
  } else {
    const noCommentsMessage = document.createElement("p");
    noCommentsMessage.textContent = "No comments yet.";
    commentsSection.appendChild(noCommentsMessage);
  }

  const commentForm = document.createElement("form");
  commentForm.classList.add("comment-form");

  const commentInput = document.createElement("textarea");
  commentInput.placeholder = "Add a comment...";
  commentInput.required = true;
  commentForm.appendChild(commentInput);

  const submitButton = document.createElement("button");
  submitButton.textContent = "Submit Comment";
  submitButton.type = "submit";
  commentForm.appendChild(submitButton);

  commentForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const commentBody = commentInput.value;

    try {
      const newComment = await addComment(post.id, commentBody);
      const newCommentElement = document.createElement("div");
      newCommentElement.classList.add("comment");
      newCommentElement.innerHTML = `<p>${newComment.body}</p><small>by ${newComment.author.name}</small>`;

      const deleteButton = document.createElement("button");
      deleteButton.textContent = "Delete";
      deleteButton.addEventListener("click", async () => {
        try {
          const confirmDelete = window.confirm("Are you sure you want to delete this comment?");
          if (confirmDelete) {
            const success = await deleteComment(post.id, newComment.id);
            if (success) {
              newCommentElement.remove();
            }
          }
        } catch (error) {
          console.error("Error deleting comment:", error);
        }
      });

      newCommentElement.appendChild(deleteButton);
      commentsSection.appendChild(newCommentElement);
      commentInput.value = "";
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  });

  const username = localStorage.getItem("username");
  if (username && post.author && post.author.name === username) {
    const editButton = document.createElement("button");
    editButton.textContent = "Edit Post";
    editButton.addEventListener("click", () => {
      const postId = post.id;
      window.location.href = `/post/edit/?id=${postId}`;
    });
    postElement.appendChild(editButton);

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete Post";
    deleteButton.addEventListener("click", onDeletePost);
    postElement.appendChild(deleteButton);
  }

  postElement.appendChild(commentsSection);
  postElement.appendChild(commentForm);
  postElement.setAttribute("data-post-id", post.id);

  return postElement;
}


displayProfilePosts();
displayUserProfile();
authGuard();
