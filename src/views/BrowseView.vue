<template>
  <div class="container mt-5">
    <h1 class="mb-4">Browse</h1>

    <!-- Search Bar and Filters -->
    <div class="mb-4">
      <label for="search" class="form-label">Search:</label>
      <input
        type="text"
        id="search"
        class="form-control"
        v-model="searchTerm"
        placeholder="Enter search term"
      />
    </div>

    <div class="mb-4">
      <label for="filter" class="form-label">Filter by Category:</label>
      <select id="filter" class="form-select" v-model="selectedCategory">
        <option value="">All</option>
        <option v-for="(name, id) in categories" :key="id" :value="id">{{ name }}</option>
      </select>
    </div>

    <div class="mb-4">
      <label for="equipment-filter" class="form-label">Filter by Equipment:</label>
      <select id="equipment-filter" class="form-select" v-model="selectedEquipment">
        <option value="">All</option>
        <option v-for="(name, id) in equipment" :key="id" :value="id">{{ name }}</option>
      </select>
    </div>

    <div class="mb-4">
      <button class="btn btn-primary" @click="performSearch">Search</button>
    </div>

    <!-- Results Grid -->
    <div v-if="filteredExercises.length" class="row">
      <h3 class="mb-4">Results:</h3>
      <div v-for="result in filteredExercises" :key="result.id" class="col-md-4 mb-4">
        <div class="card h-100">
          <img 
            :src="result.images[0]?.image || placeholderImage" 
            alt="Exercise image" 
            class="card-img-top" 
          />
          <div class="card-body d-flex flex-column">
            <h5 class="card-title">{{ result.name }}</h5>
            <p class="card-text" :class="{ 'collapsed': !result.expanded }">
              {{ result.description }}
            </p>
            <button class="btn btn-link mt-auto p-0" @click="result.expanded = !result.expanded">
              {{ result.expanded ? 'Less' : 'More...' }}
            </button>
          </div>
        </div>
      </div>
    </div>
    <div v-else>
      <p>No results found.</p>
    </div>
  </div>
</template>

<script>
import api from '@/services/api';

export default {
  data() {
    return {
      searchTerm: '',
      selectedCategory: '',
      selectedEquipment: '',
      exercises: [],
      error: null,
      placeholderImage: 'https://via.placeholder.com/150', // URL for the placeholder image
      categories: {
        10: "Abs",
        8: "Arms",
        12: "Back",
        14: "Calves",
        15: "Cardio",
        11: "Chest",
        9: "Legs",
        13: "Shoulders"
      },
      equipment: {
        1: "Barbell",
        8: "Bench",
        3: "Dumbbell",
        4: "Gym mat",
        9: "Incline bench",
        10: "Kettlebell",
        6: "Pull-up bar",
        2: "SZ-Bar",
        5: "Swiss Ball",
        7: "none (bodyweight exercise)"
      }
    };
  },
  computed: {
    filteredExercises() {
      return this.exercises.filter(exercise => {
        const matchesSearch = this.searchTerm ? exercise.name.toLowerCase().includes(this.searchTerm.toLowerCase()) : true;
        const matchesCategory = this.selectedCategory ? exercise.category === parseInt(this.selectedCategory) : true;
        const matchesEquipment = this.selectedEquipment ? exercise.equipment.includes(parseInt(this.selectedEquipment)) : true;
        return matchesSearch && matchesCategory && matchesEquipment;
      });
    }
  },
  created() {
    this.fetchExercises();
  },
  methods: {
    async fetchExercises() {
      try {
        const data = await api.getExercises();
        this.exercises = data.map(exercise => ({
          id: exercise.id,
          name: exercise.name,
          description: exercise.description,
          category: exercise.category,
          equipment: exercise.equipment,
          images: exercise.images || [],
          expanded: false
        }));
        console.log('Fetched exercises:', this.exercises); // Log fetched exercises
      } catch (err) {
        this.error = 'Failed to load exercises';
        console.error(err);
      }
    },
    performSearch() {
      // The search logic is handled by the computed property
    }
  }
};
</script>


<style scoped>
.container {
  max-width: 800px;
  margin: auto;
}
.error {
  color: red;
}
.card {
  height: 100%; /* Ensure the card takes full height */
  display: flex;
  flex-direction: column;
}
.card-img-top {
  max-height: 200px;
  object-fit: cover;
}
.card-body {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
}
.card-title {
  margin-bottom: 10px;
}
.card-text.collapsed {
  max-height: 50px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.card-text {
  flex: 1;
  max-height: 100%;
}
.btn-link {
  align-self: flex-start;
}
</style>
