import { API_KEY, API_SOCIAL_POSTS } from "../constants";

/**
 * Updates an existing post by sending updated data to the API.
 *
 * @param {string|number} id - The ID of the post to update.
 * @param {Object} params - The updated post parameters.
 * @param {string} [params.title] - The updated title of the post.(optional)
 * @param {string} [params.body] - The updated body of the post.(optional)
 * @param {string[]} [params.tags] - Array of updated tags associated with the post.(optional)
 * @param {Object} [params.media] - Updated media object containing URL and alt text.(optional)
 * @param {string} [params.media.url] - The updated URL of the media.
 * @param {string} [params.media.alt] - Updated alt text for the media.
 * @returns {Promise<Object>} The updated post data from the API.
 * @throws {Error} If the API request fails.
 */
export async function updatePost(id, { title, body, tags, media }) {
  const url = new URL(`${API_SOCIAL_POSTS}/${id}`);

  const data = {
    title,
    body,
    tags,
    media
  };

  try {
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'X-Noroff-API-Key': API_KEY
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to update post');
    }

    const updatedPost = await response.json();
    return updatedPost;
  } catch (error) {
    console.error('Error updating post:', error);
    throw error;
  }
}

/**
 * Extracts the post ID from the URL.
 * Assumes the URL contains the post ID as the last segment or as a query parameter.
 * @returns {string|null} The post ID, or null if not found.
 */
export function getPostIdFromURL() {
  const url = new URL(window.location.href);

  const pathSegments = url.pathname.split('/');
  const postId = pathSegments[pathSegments.length - 1];

  if (postId && !isNaN(postId)) {
    return postId;
  }

  return url.searchParams.get('id') || null;
}
