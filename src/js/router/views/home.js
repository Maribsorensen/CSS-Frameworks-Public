import { addComment, deleteComment, readPosts } from "../../api/post/read";
import { toggleHamburgerMenu } from "../../ui/global/hamburger";
import { setLogoutListener } from "../../ui/global/logout";
import { updateNav } from "../../ui/global/updateNav";
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
  const currentUser = localStorage.getItem("username");
  const postElement = document.createElement("div");
  postElement.className = `
    bg-white rounded-2xl overflow-hidden shadow-md flex flex-col
    hover:shadow-lg transition-shadow duration-200
  `;

  if (post.media && post.media.url) {
    const imageWrapper = document.createElement("div");
    imageWrapper.className = "relative w-full aspect-[16/9] bg-gray-100";

    const imageElement = document.createElement("img");
    imageElement.src = post.media.url;
    imageElement.alt = post.media.alt || "Post image";
    imageElement.className = `
      absolute inset-0 w-full h-full object-cover
    `;

    imageWrapper.appendChild(imageElement);
    postElement.appendChild(imageWrapper);
  }

  const contentDiv = document.createElement("div");
  contentDiv.className = "p-4 flex flex-col gap-2 flex-grow";

  const titleElement = document.createElement("h2");
  titleElement.textContent = post.title;
  titleElement.className = "font-heading text-lg font-semibold line-clamp-2";
  contentDiv.appendChild(titleElement);

  const bodyElement = document.createElement("p");
  bodyElement.textContent = post.body;
  bodyElement.className = "font-body text-sm text-gray-700 line-clamp-3";
  contentDiv.appendChild(bodyElement);

  if (post.tags?.length) {
    const tagsElement = document.createElement("p");
    tagsElement.textContent = post.tags.map(tag => `#${tag}`).join(" ");
    tagsElement.className = "text-xs text-gray-500 font-body italic";
    contentDiv.appendChild(tagsElement);
  }

  if (post.author?.name) {
    const authorDiv = document.createElement("div");
    authorDiv.className = "flex items-center mt-3";

    if (post.author.avatar?.url) {
      const avatarElement = document.createElement("img");
      avatarElement.src = post.author.avatar.url;
      avatarElement.alt = post.author.name;
      avatarElement.className = "w-10 h-10 rounded-full mr-3 object-cover";
      authorDiv.appendChild(avatarElement);
    }

    const nameElement = document.createElement("span");
    nameElement.textContent = post.author.name;
    nameElement.className = "font-body text-sm text-gray-800 font-medium";
    authorDiv.appendChild(nameElement);

    contentDiv.appendChild(authorDiv);
  }

  postElement.appendChild(contentDiv);

  const commentsSection = document.createElement("div");
  commentsSection.className = "border-t border-gray-200 p-4 space-y-2";

  if (post.comments?.length) {
    post.comments.forEach(comment => {
      const commentElement = document.createElement("div");
      commentElement.className = "bg-gray-50 p-2 rounded-lg text-sm flex justify-between items-start";

      const textContainer = document.createElement("div");
      textContainer.innerHTML = `
      <p>${comment.body}</p>
      <small class="text-gray-500">by ${comment.owner}</small>
    `;
      commentElement.appendChild(textContainer);

      if (comment.owner === currentUser) {
        const deleteButton = document.createElement("button");
        deleteButton.textContent = "×";
        deleteButton.className = "text-gray-400 hover:text-red-500 font-bold ml-2";
        deleteButton.addEventListener("click", async () => {
          const confirmDelete = window.confirm("Delete this comment?");
          if (confirmDelete) {
            const success = await deleteComment(post.id, comment.id);
            if (success) commentElement.remove();
          }
        });

        commentElement.appendChild(deleteButton);
      }

      commentsSection.appendChild(commentElement);
    });
  } else {
    const noComments = document.createElement("p");
    noComments.textContent = "No comments yet.";
    noComments.className = "text-sm text-gray-500";
    commentsSection.appendChild(noComments);
  }

  const commentForm = document.createElement("form");
  commentForm.className = "mt-3 flex flex-col gap-2";

  const commentInput = document.createElement("textarea");
  commentInput.placeholder = "Add a comment...";
  commentInput.required = true;
  commentInput.className = "border rounded-lg p-2 text-sm font-body resize-none focus:ring focus:ring-brand-triadic";
  commentForm.appendChild(commentInput);

  const submitButton = document.createElement("button");
  submitButton.textContent = "Submit";
  submitButton.type = "submit";
  submitButton.className = "bg-brand-triadic hover:bg-brand-triadic_hover text-white text-sm font-semibold py-1.5 rounded-lg transition";
  commentForm.appendChild(submitButton);

  commentForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const commentBody = commentInput.value.trim();
    if (!commentBody) return;

    try {
      const newComment = await addComment(post.id, commentBody);
      const newCommentElement = document.createElement("div");
      newCommentElement.className = "bg-gray-50 p-2 rounded-lg text-sm flex justify-between items-start";
      newCommentElement.innerHTML = `<div><p>${newComment.body}</p><small class="text-gray-500">by ${newComment.author.name}</small></div>`;
      commentsSection.appendChild(newCommentElement);
      commentInput.value = "";
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  });

  commentsSection.appendChild(commentForm);
  postElement.appendChild(commentsSection);

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
toggleHamburgerMenu();
updateNav();
authGuard();