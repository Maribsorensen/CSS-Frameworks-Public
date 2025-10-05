import { addComment, deleteComment, readPostsByUser } from "../../api/post/read";
import { readProfile } from "../../api/profile/read";
import { toggleHamburgerMenu } from "../../ui/global/hamburger";
import { setLogoutListener } from "../../ui/global/logout";
import { updateNav } from "../../ui/global/updateNav";
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
      contentDiv.classList.add("container", "flex", "flex-col", "mx-auto", "rounded-lg", "shadow-lg", "p-1", "bg-white");

      const avatarDiv = document.createElement("div");
      avatarDiv.classList.add("avatar-container", "flex", "justify-center", "mb-4");

      const avatarImg = document.createElement("img");
      avatarImg.src = avatarUrl;
      avatarImg.alt = "Avatar";
      avatarImg.classList.add("w-2/6", "h-auto");
      avatarDiv.appendChild(avatarImg);

      contentDiv.appendChild(avatarDiv);

      const infoDiv = document.createElement("div");
      infoDiv.classList.add("profile-info", "text-center");

      const profileName = document.createElement("h1");
      profileName.textContent = `${profileData.name}'s Profile`;
      profileName.classList.add("text-xl", "font-bold", "font-heading", "mb-2");
      infoDiv.appendChild(profileName);

      const bioPara = document.createElement("p");
      bioPara.textContent = `Bio: ${profileData.bio || "No bio available"}`;
      bioPara.classList.add("text-gray-600", "mb-2", "font-body");
      infoDiv.appendChild(bioPara);

      const postsPara = document.createElement("p");
      postsPara.textContent = `Posts: ${profileData._count.posts}`;
      postsPara.classList.add("mb-1", "font-body");
      infoDiv.appendChild(postsPara);

      const followersPara = document.createElement("p");
      followersPara.textContent = `Followers: ${profileData._count.followers}`;
      followersPara.classList.add("mb-1", "font-body");
      infoDiv.appendChild(followersPara);

      const followingPara = document.createElement("p");
      followingPara.textContent = `Following: ${profileData._count.following}`;
      followingPara.classList.add("mb-1", "font-body");
      infoDiv.appendChild(followingPara);

      contentDiv.appendChild(infoDiv);

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
  postElement.classList.add("rounded-lg", "shadow-lg", "p-1", "flex", "flex-col", "justify-between", "bg-white");

  const titleElement = document.createElement("h2");
  titleElement.textContent = post.title;
  titleElement.classList.add("font-heading", "text-xl", "font-semibold");
  postElement.appendChild(titleElement);

  const bodyElement = document.createElement("p");
  bodyElement.textContent = post.body;
  bodyElement.classList.add("font-body", "text-lg");
  postElement.appendChild(bodyElement);

  const tagsElement = document.createElement("p");
  tagsElement.textContent = `Tags: ${post.tags.join(", ")}`;
  tagsElement.classList.add("font-body", "text-gray-700");
  postElement.appendChild(tagsElement);

  if (post.author && post.author.name) {
    const authorElement = document.createElement("p");
    authorElement.textContent = `Written by: ${post.author.name}`;
    authorElement.classList.add("font-body", "text-gray-700");
    postElement.appendChild(authorElement);

    if (post.author.avatar && post.author.avatar.url) {
      const avatarElement = document.createElement("img");
      avatarElement.setAttribute("src", post.author.avatar.url);
      avatarElement.setAttribute("alt", post.author.name);
      avatarElement.classList.add("author-avatar", "rounded-[50%]", "w-14", "h-14");
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
      commentBody.classList.add("font-body");
      commentElement.appendChild(commentBody);

      const commentAuthor = document.createElement("small");
      commentAuthor.textContent = `by ${comment.author.name}`;
      commentAuthor.classList.add("font-body");
      commentElement.appendChild(commentAuthor);

      const deleteButton = document.createElement("button");
      deleteButton.textContent = "Delete";
      deleteButton.classList.add("delete-comment-button", "font-body");
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
    noCommentsMessage.classList.add("font-body");
    commentsSection.appendChild(noCommentsMessage);
  }

  const commentForm = document.createElement("form");
  commentForm.classList.add("flex", "flex-col");

  const commentInput = document.createElement("textarea");
  commentInput.placeholder = "Add a comment...";
  commentInput.required = true;
  commentInput.classList.add("font-body");
  commentForm.appendChild(commentInput);

  const submitButton = document.createElement("button");
  submitButton.textContent = "Submit Comment";
  submitButton.type = "submit";
  submitButton.classList.add("font-body", "bg-brand-triadic", "hover:bg-brand-triadic_hover", "text-white", "font-semibold", "p-2", "m-2", "rounded-full");
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
    editButton.classList.add("font-body", "bg-brand-dark", "py-2", "px-4", "hover:bg-brand-hover", "my-2");
    editButton.addEventListener("click", () => {
      const postId = post.id;
      window.location.href = `/post/edit/?id=${postId}`;
    });
    postElement.appendChild(editButton);

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete Post";
    deleteButton.classList.add("font-body", "bg-brand-dark", "py-2", "px-4", "hover:bg-brand-hover");
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
setLogoutListener();
toggleHamburgerMenu();
updateNav();
authGuard();