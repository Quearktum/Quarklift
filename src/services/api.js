import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'https://wger.de/api/v2/',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000 
});

async function getAllExercises(offset = 0, exercises = []) {
  try {
    const response = await apiClient.get(`exercise/?language=2&limit=20&offset=${offset}`);
    exercises = exercises.concat(response.data.results);
    if (response.data.next) {
      return getAllExercises(offset + 20, exercises);
    } else {
      return exercises;
    }
  } catch (error) {
    console.error('Error fetching exercises:', error);
    throw error;
  }
}

async function getAllExerciseImages(offset = 0, images = []) {
  try {
    const response = await apiClient.get(`exerciseimage/?limit=20&offset=${offset}`);
    images = images.concat(response.data.results);
    if (response.data.next) {
      return getAllExerciseImages(offset + 20, images);
    } else {
      return images;
    }
  } catch (error) {
    console.error('Error fetching exercise images:', error);
    throw error;
  }
}

export default {
  async getExercises() {
    const exercises = await getAllExercises();
    const images = await getAllExerciseImages();
    // Map images to exercises
    exercises.forEach(exercise => {
      exercise.images = images.filter(image => image.exercise_base === exercise.exercise_base);
    });
    return exercises;
  }
};
