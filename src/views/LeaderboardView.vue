<template>
  <div class="container mt-5">
    <h1 class="mb-4">Leaderboard</h1>

    <!-- Filter by Category -->
    <div class="mb-4">
      <label for="category" class="form-label">Filter by Category:</label>
      <select
        id="category"
        class="form-select"
        v-model="selectedCategory"
        @change="filterLeaderboard"
      >
        <option value="">All</option>
        <option value="Bench Press">Bench Press</option>
        <option value="Deadlift">Deadlift</option>
        <option value="Squat">Squat</option>
      </select>
    </div>

    <!-- Sort by Score -->
    <div class="mb-4">
      <label for="sort" class="form-label">Sort by 1RM:</label>
      <select
        id="sort"
        class="form-select"
        v-model="sortOrder"
        @change="sortLeaderboard"
      >
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
          <th scope="col">Category</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in paginatedLeaderboard" :key="item.id">
          <th scope="row">{{ (currentPage - 1) * pageSize + index + 1 }}</th>
          <td>{{ item.username }}</td>
          <td>{{ Math.round(item.weight * (1 + 0.033 * item.reps))}}</td>
          <td>{{ item.exercise }}</td>
        </tr>
      </tbody>
    </table>

    <!-- Pagination Controls -->
    <nav aria-label="Page navigation">
      <ul class="pagination justify-content-center">
        <li class="page-item" :class="{ disabled: currentPage === 1 }">
          <a class="page-link" href="#" @click.prevent="prevPage">Previous</a>
        </li>
        <li
          class="page-item"
          v-for="page in totalPages"
          :key="page"
          :class="{ active: currentPage === page }"
        >
          <a class="page-link" href="#" @click.prevent="goToPage(page)">{{
            page
          }}</a>
        </li>
        <li class="page-item" :class="{ disabled: currentPage === totalPages }">
          <a class="page-link" href="#" @click.prevent="nextPage">Next</a>
        </li>
      </ul>
    </nav>
  </div>
</template>

<script>
import { getLeaderboard } from "../services/leaderboardService";

export default {
  data() {
    return {
      leaderboard: [],
      selectedCategory: "",
      sortOrder: "desc", // default sort order
      currentPage: 1,
      pageSize: 5,
    };
  },
  computed: {
    filteredLeaderboard() {
      let filtered = this.leaderboard;
      if (this.selectedCategory) {
        filtered = filtered.filter(
          (item) => item.exercise === this.selectedCategory
        );
      }
      return filtered.sort((a, b) => {
        if (this.sortOrder === "asc") {
          return a.reps * a.sets - b.reps * b.sets; // Assuming score is reps * sets
        } else {
          return b.reps * b.sets - a.reps * a.sets;
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
    },
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
    },
    async fetchLeaderboard() {
      const token = localStorage.getItem("token");
      try {
        const response = await getLeaderboard(token);
        console.log(response.data); // Log the response to verify structure
        this.leaderboard = response.data.map((item) => ({
          id: item.id,
          username: item.username,
          weight: item.weight,
          reps: item.reps,
          sets: item.sets,
          exercise: item.exercise,
        }));
      } catch (error) {
        console.error(error);
      }
    },
  },
  created() {
    this.fetchLeaderboard();
  },
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
