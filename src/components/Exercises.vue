<template>
    <div>
      <h1>Exercises</h1>
      <ul>
        <li v-for="exercise in exercises" :key="exercise.id">{{ exercise.name }}</li>
      </ul>
    </div>
  </template>
  
  <script>
  import api from '../services/api';
  
  export default {
    name: 'ExercisesComponent',
    data() {
      return {
        exercises: []
      };
    },
    mounted() {
      this.fetchExercises();
    },
    methods: {
      fetchExercises() {
        api.getExercises()
          .then(data => {
            this.exercises = data.results;
          })
          .catch(error => {
            console.error('Error fetching exercises:', error);
          });
      }
    }
  };
  </script>
  
  <style scoped>
  /* Add any custom styles here */
  </style>
  