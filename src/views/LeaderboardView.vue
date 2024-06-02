<template>
  <div class="container mt-5">
    <h1 class="mb-4">Leaderboard</h1>
    
    <!-- Filter by Category -->
    <div class="mb-4">
      <label for="category" class="form-label">Filter by Category:</label>
      <select id="category" class="form-select" v-model="selectedCategory" @change="filterLeaderboard">
        <option value="">All</option>
        <option value="Bench Press">Bench Press</option>
        <option value="Deadlift">Deadlift</option>
        <option value="Squat">Squat</option>
      </select>
    </div>

    <!-- Sort by Score -->
    <div class="mb-4">
      <label for="sort" class="form-label">Sort by 1RM:</label>
      <select id="sort" class="form-select" v-model="sortOrder" @change="sortLeaderboard">
        <option value="desc">Biggest to Smallest</option>
        <option value="asc">Smallest to Biggest</option>
      </select>
    </div>
    
    <!-- Leaderboard Table -->
    <table class="table table-striped">
      <thead>
        <tr>
          <th scope="col">#</th>
          <th scope="col">Name</th>
          <th scope="col">1 Rep Max</th>
          <th scope="col">Cagetory</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in paginatedLeaderboard" :key="item.id">
          <th scope="row">{{ (currentPage - 1) * pageSize + index + 1 }}</th>
          <td>{{ item.name }}</td>
          <td>{{ item.score }}</td>
          <td>{{ item.category }}</td>
        </tr>
      </tbody>
    </table>
    
    <!-- Pagination Controls -->
    <nav aria-label="Page navigation">
      <ul class="pagination justify-content-center">
        <li class="page-item" :class="{ disabled: currentPage === 1 }">
          <a class="page-link" href="#" @click.prevent="prevPage">Previous</a>
        </li>
        <li class="page-item" v-for="page in totalPages" :key="page" :class="{ active: currentPage === page }">
          <a class="page-link" href="#" @click.prevent="goToPage(page)">{{ page }}</a>
        </li>
        <li class="page-item" :class="{ disabled: currentPage === totalPages }">
          <a class="page-link" href="#" @click.prevent="nextPage">Next</a>
        </li>
      </ul>
    </nav>
  </div>
</template>

<script>
export default {
  data() {
    return {
      leaderboard: [
        { id: 1, name: 'User 1', score: 100, category: 'Bench Press' },
        { id: 2, name: 'User 2', score: 90, category: 'Deadlift' },
        { id: 3, name: 'User 3', score: 80, category: 'Squat' },
        { id: 4, name: 'User 4', score: 70, category: 'Bench Press' },
        { id: 5, name: 'User 5', score: 60, category: 'Deadlift' },
        { id: 6, name: 'User 6', score: 50, category: 'Squat' },
        { id: 7, name: 'User 7', score: 40, category: 'Bench Press' },
        { id: 8, name: 'User 8', score: 30, category: 'Deadlift' },
        { id: 9, name: 'User 9', score: 20, category: 'Squat' },
        { id: 10, name: 'User 10', score: 10, category: 'Bench Press' },
        { id: 11, name: 'User 11', score: 110, category: 'Deadlift' },
        { id: 12, name: 'User 12', score: 120, category: 'Squat' },
        { id: 13, name: 'User 13', score: 130, category: 'Bench Press' },
        { id: 14, name: 'User 14', score: 140, category: 'Deadlift' },
        { id: 15, name: 'User 15', score: 150, category: 'Squat' },
        { id: 16, name: 'User 16', score: 160, category: 'Bench Press' },
        { id: 17, name: 'User 17', score: 170, category: 'Deadlift' },
        { id: 18, name: 'User 18', score: 180, category: 'Squat' },
        { id: 19, name: 'User 19', score: 190, category: 'Bench Press' },
        { id: 20, name: 'User 20', score: 200, category: 'Deadlift' },
      ],
      selectedCategory: '',
      sortOrder: 'desc', // default sort order
      currentPage: 1,
      pageSize: 5
    };
  },
  computed: {
    filteredLeaderboard() {
      let filtered = this.leaderboard;
      if (this.selectedCategory) {
        filtered = filtered.filter(item => item.category === this.selectedCategory);
      }
      return filtered.sort((a, b) => {
        if (this.sortOrder === 'asc') {
          return a.score - b.score;
        } else {
          return b.score - a.score;
        }
      });
    },
    paginatedLeaderboard() {
      const start = (this.currentPage - 1) * this.pageSize;
      const end = start + this.pageSize;
      return this.filteredLeaderboard.slice(start, end);
    },
    totalPages() {
      return Math.ceil(this.filteredLeaderboard.length / this.pageSize);
    }
  },
  methods: {
    filterLeaderboard() {
      this.currentPage = 1; // Reset to first page after filtering
    },
    sortLeaderboard() {
      this.currentPage = 1; // Reset to first page after sorting
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
.pagination {
  margin-top: 20px;
}
</style>
