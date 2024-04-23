import axios from 'axios';

export const fetchContentById = async (id) => {
  try {
    const response = await axios.get(`http://localhost:3001/content/${id}`);
    // The response now includes both content and label, so return the whole data object
    return response.data;
  } catch (error) {
    console.error('Failed to fetch content:', error);
    // Return an object with default values for content and label
    return { content: 'Content not found from here', label: 'Untitled' };
  }
};
