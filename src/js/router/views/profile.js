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
  const profileContainer = document.getElementById("user-profile");
  profileContainer.innerHTML = "";

  if (!username) {
    profileContainer.innerHTML = `<p class="text-gray-600 font-body">No user logged in.</p>`;
    return;
  }

  try {
    const profileData = await readProfile(username);
    if (!profileData) throw new Error("No profile data");

    const avatarUrl = profileData.avatar?.url || "/src/assets/default-avatar.png";

    const card = document.createElement("div");
    card.className = `
      bg-white rounded-2xl shadow-lg max-w-xl mx-auto p-6 flex flex-col items-center gap-4
    `;

    const avatar = document.createElement("img");
    avatar.src = avatarUrl;
    avatar.alt = `${profileData.name} avatar`;
    avatar.className = "w-28 h-28 rounded-full object-cover border-4 border-brand-triadic";
    card.appendChild(avatar);

    const name = document.createElement("h1");
    name.textContent = profileData.name;
    name.className = "text-2xl font-heading font-bold";
    card.appendChild(name);

    const bio = document.createElement("p");
    bio.textContent = profileData.bio || "No bio available.";
    bio.className = "text-gray-600 text-sm text-center font-body";
    card.appendChild(bio);

    const stats = document.createElement("div");
    stats.className = "flex justify-center gap-6 mt-4 text-sm font-body";

    stats.innerHTML = `
      <div class="text-center">
        <p class="font-bold text-lg">${profileData._count.posts}</p>
        <p class="text-gray-500">Posts</p>
      </div>
      <div class="text-center">
        <p class="font-bold text-lg">${profileData._count.followers}</p>
        <p class="text-gray-500">Followers</p>
      </div>
      <div class="text-center">
        <p class="font-bold text-lg">${profileData._count.following}</p>
        <p class="text-gray-500">Following</p>
      </div>
    `;
    card.appendChild(stats);

    profileContainer.appendChild(card);
  } catch (error) {
    console.error("Error loading profile info:", error);
    profileContainer.innerHTML = `<p class="text-red-600 font-body">Error loading profile information.</p>`;
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
  const currentUser = localStorage.getItem("username");
  const postElement = document.createElement("div");
  postElement.className = `
    relative
    bg-white rounded-2xl overflow-hidden shadow-md flex flex-col
    hover:shadow-lg transition-shadow duration-200
  `;
  postElement.setAttribute("data-post-id", post.id);

  if (currentUser && post.author?.name === currentUser) {
    const controls = document.createElement("div");
    controls.className = "absolute top-2 right-2 flex gap-2 z-50 bg-black bg-opacity-60 rounded";

    const editButton = document.createElement("button");
    editButton.title = "Edit post";
    editButton.innerHTML = "✏️";
    editButton.className = `
      text-gray-600 hover:text-brand-dark text-lg
      transition transform hover:scale-110
    `;
    editButton.addEventListener("click", () => {
      window.location.href = `/post/edit/?id=${post.id}`;
    });
    controls.appendChild(editButton);

    const deleteButton = document.createElement("button");
    deleteButton.title = "Delete post";
    deleteButton.innerHTML = "🗑️";
    deleteButton.className = `
      text-gray-600 hover:text-red-600 text-lg
      transition transform hover:scale-110
    `;
    deleteButton.addEventListener("click", onDeletePost);
    controls.appendChild(deleteButton);

    postElement.appendChild(controls);
  }

  if (post.media?.url) {
    const imageWrapper = document.createElement("div");
    imageWrapper.className = "relative w-full aspect-[16/9] bg-gray-100";

    const imageElement = document.createElement("img");
    imageElement.src = post.media.url;
    imageElement.alt = post.media.alt || "Post image";
    imageElement.className = "absolute inset-0 w-full h-full object-cover";

    imageWrapper.appendChild(imageElement);
    postElement.appendChild(imageWrapper);
  }

  const contentDiv = document.createElement("div");
  contentDiv.className = "p-4 flex flex-col gap-2 flex-grow";

  const titleElement = document.createElement("h2");
  titleElement.textContent = post.title;
  titleElement.className = "font-heading text-lg font-semibold";
  contentDiv.appendChild(titleElement);

  const bodyElement = document.createElement("p");
  bodyElement.textContent = post.body;
  bodyElement.className = "font-body text-sm text-gray-700";
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
      avatarElement.alt = `${post.author.name}'s avatar`;
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
  commentsSection.className = "border-t border-gray-200 p-4 space-y-2 mt-auto";

  if (post.comments?.length) {
    post.comments.forEach(comment => {
      const commentElement = document.createElement("div");
      commentElement.className = "bg-gray-50 p-2 rounded-lg flex justify-between items-start text-sm";

      const textContainer = document.createElement("div");
      const commentBody = document.createElement("p");
      commentBody.textContent = comment.body;
      textContainer.appendChild(commentBody);

      const commentAuthor = document.createElement("small");
      commentAuthor.textContent = `by ${comment.author.name}`;
      commentAuthor.className = "text-gray-500 block";
      textContainer.appendChild(commentAuthor);

      commentElement.appendChild(textContainer);

      if (comment.author.name === currentUser) {
        const deleteButton = document.createElement("button");
        deleteButton.textContent = "×";
        deleteButton.className = "text-gray-400 hover:text-red-500 font-bold ml-2";
        deleteButton.addEventListener("click", async () => {
          const confirmDelete = window.confirm("Delete this comment?");
          if (confirmDelete) {
            try {
              const success = await deleteComment(post.id, comment.id);
              if (success) commentElement.remove();
            } catch (err) {
              console.error("Error deleting comment:", err);
            }
          }
        });
        commentElement.appendChild(deleteButton);
      }

      commentsSection.appendChild(commentElement);
    });
  } else {
    const noComments = document.createElement("p");
    noComments.textContent = "No comments yet.";
    noComments.className = "text-sm text-gray-500 font-body";
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
    const body = commentInput.value.trim();
    if (!body) return;

    try {
      const newComment = await addComment(post.id, body);
      const newCommentElement = document.createElement("div");
      newCommentElement.className = "bg-gray-50 p-2 rounded-lg flex justify-between items-start text-sm";

      const textContainer = document.createElement("div");
      const p = document.createElement("p");
      p.textContent = newComment.body;
      textContainer.appendChild(p);

      const author = document.createElement("small");
      author.textContent = `by ${newComment.author.name}`;
      author.className = "text-gray-500 block";
      textContainer.appendChild(author);

      newCommentElement.appendChild(textContainer);

      if (newComment.author.name === currentUser) {
        const deleteButton = document.createElement("button");
        deleteButton.textContent = "×";
        deleteButton.className = "text-gray-400 hover:text-red-500 font-bold ml-2";
        deleteButton.addEventListener("click", async () => {
          const confirmDelete = window.confirm("Delete this comment?");
          if (confirmDelete) {
            try {
              const success = await deleteComment(post.id, newComment.id);
              if (success) newCommentElement.remove();
            } catch (err) {
              console.error("Error deleting comment:", err);
            }
          }
        });
        newCommentElement.appendChild(deleteButton);
      }

      commentsSection.appendChild(newCommentElement);
      commentInput.value = "";
    } catch (err) {
      console.error("Error adding comment:", err);
    }
  });

  commentsSection.appendChild(commentForm);
  postElement.appendChild(commentsSection);

  return postElement;
}




displayProfilePosts();
displayUserProfile();
setLogoutListener();
toggleHamburgerMenu();
updateNav();
authGuard();