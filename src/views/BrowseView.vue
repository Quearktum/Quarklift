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
    <div v-if="paginatedExercises.length" class="row">
      <h3 class="mb-4">Results:</h3>
      <div v-for="result in paginatedExercises" :key="result.id" class="col-md-4 mb-4">
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

    <!-- Pagination Controls -->
    <nav aria-label="Page navigation" v-if="totalPages > 1">
      <ul class="pagination justify-content-center">
        <li class="page-item" :class="{ disabled: currentPage === 1 }">
          <a class="page-link" href="#" @click.prevent="prevPage">Previous</a>
        </li>
        <li class="page-item" v-if="visiblePages[0] > 1">
          <a class="page-link" href="#" @click.prevent="goToPage(1)">1</a>
        </li>
        <li class="page-item" v-if="visiblePages[0] > 2">
          <span class="page-link">...</span>
        </li>
        <li
          class="page-item"
          v-for="page in visiblePages"
          :key="page"
          :class="{ active: currentPage === page }"
        >
          <a class="page-link" href="#" @click.prevent="goToPage(page)">{{ page }}</a>
        </li>
        <li class="page-item" v-if="visiblePages[visiblePages.length - 1] < totalPages - 1">
          <span class="page-link">...</span>
        </li>
        <li class="page-item" v-if="visiblePages[visiblePages.length - 1] < totalPages">
          <a class="page-link" href="#" @click.prevent="goToPage(totalPages)">{{ totalPages }}</a>
        </li>
        <li class="page-item" :class="{ disabled: currentPage === totalPages }">
          <a class="page-link" href="#" @click.prevent="nextPage">Next</a>
        </li>
      </ul>
    </nav>
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
      },
      currentPage: 1,
      pageSize: 9
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
    },
    paginatedExercises() {
      const start = (this.currentPage - 1) * this.pageSize;
      const end = start + this.pageSize;
      return this.filteredExercises.slice(start, end);
    },
    totalPages() {
      return Math.ceil(this.filteredExercises.length / this.pageSize);
    },
    visiblePages() {
      const maxPagesToShow = 5;
      const pages = [];
      const halfMaxPagesToShow = Math.floor(maxPagesToShow / 2);
      let startPage = Math.max(this.currentPage - halfMaxPagesToShow, 1);
      let endPage = Math.min(startPage + maxPagesToShow - 1, this.totalPages);

      if (endPage - startPage + 1 < maxPagesToShow) {
        startPage = Math.max(endPage - maxPagesToShow + 1, 1);
      }

      // Ensure startPage is greater than 1 to avoid duplication of page 1
      if (startPage === 1 && endPage < this.totalPages) {
        endPage = Math.min(startPage + maxPagesToShow - 1, this.totalPages);
      }

      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }

      return pages;
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
      this.currentPage = 1; // Reset to first page after search
    },
    prevPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
      }
    },
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
      }
    },
    goToPage(page) {
      this.currentPage = page;
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
