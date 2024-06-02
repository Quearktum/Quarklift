import axios from 'axios';

// Create an axios instance
const apiClient = axios.create({
  baseURL: 'https://wger.de/api/v2/',
  headers: {
    'Content-Type': 'application/json',
  }
});

export default {
  // Example method to get a list of exercises
  getExercises() {
    return apiClient.get('exercise/')
      .then(response => response.data)
      .catch(error => {
        console.error('Error fetching exercises:', error);
        throw error;
      });
  }
};
