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
      <select id="filter" class="form-select" v-model="selectedFilter">
        <option value="">All</option>
        <option value="chest">Chest</option>
        <option value="back">Back</option>
        <option value="leg">Leg</option>
      </select>
    </div>
    
    <div class="mb-4">
      <button class="btn btn-primary" @click="performSearch">Search</button>
    </div>
    
    <!-- Results List -->
    <div v-if="searchResults.length">
      <h3 class="mb-4">Results:</h3>
      <ul class="list-group">
        <li class="list-group-item" v-for="result in searchResults" :key="result.id">
          {{ result.name }}
        </li>
      </ul>
    </div>
    <div v-else>
      <p>No results found.</p>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      searchTerm: '',
      selectedFilter: '',
      searchResults: []
    };
  },
  methods: {
    performSearch() {
      // Replace this with actual search logic, for now using dummy data
      const allResults = [
        { id: 1, name: 'Bench Press', category: 'chest' },
        { id: 2, name: 'Assited Pull up', category: 'back' },
        { id: 3, name: 'Squat', category: 'leg' },
        { id: 4, name: 'Dumbbell Press', category: 'chest' },
        { id: 5, name: 'T-bar row', category: 'back' }
      ];
      
      this.searchResults = allResults.filter(item => {
        const matchesSearch = this.searchTerm ? item.name.toLowerCase().includes(this.searchTerm.toLowerCase()) : true;
        const matchesFilter = this.selectedFilter ? item.category === this.selectedFilter : true;
        return matchesSearch && matchesFilter;
      });
    }
  }
};
</script>

<style scoped>
.container {
  max-width: 800px;
  margin: auto;
}
</style>
