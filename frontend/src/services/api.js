import axios from 'axios';

const API_BASE_URL = 'http://localhost:5001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Health check
export const healthCheck = async () => {
  try {
    const response = await api.get('/health');
    return response.data;
  } catch (error) {
    throw new Error('Backend server is not responding');
  }
};

// Get available models
export const getAvailableModels = async () => {
  try {
    const response = await api.get('/models');
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch models: ' + error.message);
  }
};

// Get sample texts
export const getSampleTexts = async () => {
  try {
    const response = await api.get('/sample-texts');
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch sample texts: ' + error.message);
  }
};

// Get specific sample text
export const getSampleTextById = async (id) => {
  try {
    const response = await api.get(`/sample-texts/${id}`);
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch sample text: ' + error.message);
  }
};

// Compare summaries
export const compareSummaries = async (text, model1, model2) => {
  try {
    const response = await api.post('/summarize', {
      text,
      model1,
      model2
    });
    return response.data;
  } catch (error) {
    if (error.response && error.response.data && error.response.data.error) {
      throw new Error(error.response.data.error);
    }
    throw new Error('Failed to generate summaries: ' + error.message);
  }
};

// Clear model cache
export const clearModelCache = async () => {
  try {
    const response = await api.post('/clear-cache');
    return response.data;
  } catch (error) {
    throw new Error('Failed to clear cache: ' + error.message);
  }
};

export default api; 