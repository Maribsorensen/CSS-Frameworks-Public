import { API_KEY, API_SOCIAL_POSTS, API_SOCIAL_PROFILES } from "../constants";



/**
 * Reads a single post by its ID.
 *
 * @param {string|number} id - The ID of the post to read.
 * @returns {Promise<object>} The response data.
 * @throws {Error} If the API request fails.
 */
export async function readPost(id) { }

/**
 * Reads multiple posts with optional pagination and tagging.
 *
 * @param {number} [limit=12] - The maximum number of posts to return.
 * @param {number} [page=1] - The page number for pagination.
 * @param {string} [tag] - An optional tag to filter posts.
 * @returns {Promise<Object>} An object containing an array of posts in the `data` field, and information in a `meta` field.
 * @throws {Error} If the API request fails.
 */

export async function readPosts(limit = 12, page = 1, tag = "") {
  const url = new URL(API_SOCIAL_POSTS);

  url.searchParams.append("limit", limit);
  url.searchParams.append("page", page);
  url.searchParams.append("_author", "true");
  url.searchParams.append("_comments", "true");
  if (tag) {
    url.searchParams.append("tag", tag);
  }


  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "X-Noroff-API-Key": API_KEY,
      },
    });


    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to fetch posts");
    }

    const data = await response.json();

    return data;
  } catch (error) {
    console.error("Error fetching posts:", error);
    throw error;
  }
}

/**
 * Reads multiple posts by a specific user with optional pagination and tagging.
 *
 * @param {string} username - The username of the user whose posts to read.
 * @param {number} [limit=12] - The maximum number of posts to return.
 * @param {number} [page=1] - The page number for pagination.
 * @param {string} [tag] - An optional tag to filter posts.
 * @returns {Promise<object>} Object with data and meta fields.
 * @throws {Error} If the API request fails.
 */
/**
 * Reads multiple posts by a specific user with optional pagination and tagging.
 *
 * @param {string} username - The username of the user whose posts to read.
 * @param {number} [limit=12] - The maximum number of posts to return.
 * @param {number} [page=1] - The page number for pagination.
 * @param {string} [tag] - An optional tag to filter posts.
 * @returns {Promise<object>} Object with data and meta fields.
 * @throws {Error} If the API request fails.
 */
export async function readPostsByUser(username, limit = 12, page = 1, tag = "") {
  const url = new URL(`${API_SOCIAL_PROFILES}/${username}/posts`);

  url.searchParams.append("limit", limit);
  url.searchParams.append("page", page);
  url.searchParams.append("_author", "true");
  url.searchParams.append("author", username);
  url.searchParams.append("_comments", "true");

  if (tag) {
    url.searchParams.append("tag", tag);
  }

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "X-Noroff-API-Key": API_KEY,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to fetch posts");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching posts:", error);
    throw error;
  }
}



/**
 * Adds a comment to a specified post.
 * 
 * @async
 * @function
 * @param {string} postId - The ID of the post to which the comment is being added.
 * @param {string} commentBody - The content of the comment to add.
 * @throws {Error} Will throw an error if the user is not authenticated or if the request fails.
 * @returns {Promise<Object>} Resolves to the added comment data.
 */

export async function addComment(postId, commentBody) {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("User is not authenticated.");
  }

  const url = new URL(`${API_SOCIAL_POSTS}/${postId}/comment`);

  url.searchParams.append("_author", "true");

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "X-Noroff-API-Key": API_KEY,
      },
      body: JSON.stringify({ body: commentBody }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error("Error details:", error);
      throw new Error(error.message || "Failed to add comment");
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error("Error adding comment:", error);
    throw error;
  }
}

/**
 * Deletes a comment from a specified post.
 * 
 * @async
 * @function
 * @param {string} postId - The ID of the post containing the comment to delete.
 * @param {string} commentId - The ID of the comment to delete.
 * @throws {Error} Will throw an error if the request fails.
 * @returns {Promise<boolean>} Resolves to `true` if the comment is successfully deleted.
 */
export async function deleteComment(postId, commentId) {
  const url = new URL(`${API_SOCIAL_POSTS}/${postId}/comment/${commentId}`);

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
      console.error("Error details:", error);
      throw new Error(error.message || "Failed to delete comment");
    }

    return true;
  } catch (error) {
    console.error("Error deleting comment:", error);
    throw error;
  }
}