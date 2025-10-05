import { deletePost } from "../../api/post/delete";

/**
 * Passes data to the createPost function in api/post and handles the response
 */
export async function onDeletePost(event) {
  const postElement = event.target.closest(".post");
  const postId = postElement.getAttribute("data-post-id");

  if (!postId) {
    console.error("Post ID not found.");
    return;
  }

  const confirmDelete = window.confirm("Are you sure you want to delete this post?");
  if (!confirmDelete) {
    return;
  }

  try {
    const success = await deletePost(postId);

    if (success) {
      postElement.remove();
    }
  } catch (error) {
    console.error("Error deleting post:", error);
    alert("Failed to delete post. Please try again.");
  }
}