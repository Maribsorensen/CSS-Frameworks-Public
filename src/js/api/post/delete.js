import { API_KEY, API_SOCIAL_POSTS } from "../constants";

/**
 * Deletes a post by its ID.
 *
 * @param {?} id - The ID of the post to delete. Fill in the appropriate type.
 * @returns {?} What the function returns. Choose an appropriate return type.
 * @throws {Error} If the API request fails.
 */
export async function deletePost(id) {
  const url = new URL(`${API_SOCIAL_POSTS}/${id}`);

  try {
    const response = await fetch(url, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "X-Noroff-API-Key": API_KEY,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to delete post");
    }
    return true;
  } catch (error) {
    console.error("Error deleting post:", error);
    throw error;
  }
}