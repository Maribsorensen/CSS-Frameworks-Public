import { addComment, deleteComment, readPosts } from "../../api/post/read";
import { setLogoutListener } from "../../ui/global/logout";
import { authGuard } from "../../utilities/authGuard";

/**
 * Creates a DOM element representing a post and its details.
 *
 * @function
 * @param {Object} post - The post object containing its details.
 * @param {string} post.id - The unique ID of the post.
 * @param {string} post.title - The title of the post.
 * @param {string} post.body - The body content of the post.
 * @param {Array<string>} post.tags - An array of tags associated with the post.
 * @param {Object} [post.author] - The author information of the post.
 * @param {string} post.author.name - The name of the author.
 * @param {Object} [post.author.avatar] - The avatar object of the author.
 * @param {string} post.author.avatar.url - The URL of the author's avatar image.
 * @param {Object} [post.media] - Media associated with the post.
 * @param {string} post.media.url - The URL of the media file.
 * @param {string} [post.media.alt] - Alternative text for the media.
 * @param {Array<Object>} [post.comments] - Array of comments on the post.
 * @returns {HTMLElement} A DOM element representing the post.
 */
export function createPostElement(post) {
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

  postElement.appendChild(commentsSection);
  postElement.appendChild(commentForm);

  return postElement;
}



/**
 * Fetches and displays posts in the designated container on the page.
 *
 * @async
 * @function
 * @returns {Promise<void>} Resolves once posts are successfully displayed.
 * @throws {Error} Logs an error if fetching or rendering posts fails.
 */
export async function displayPosts() {
  try {
    const postsData = await readPosts();
    const postsContainer = document.getElementById("posts-container");

    postsContainer.innerHTML = "";

    postsData.data.forEach(post => {
      const postElement = createPostElement(post);
      postsContainer.appendChild(postElement);
    });
  } catch (error) {
    console.error("Error displaying posts:", error);
  }
}

displayPosts();
setLogoutListener();

authGuard();
