<template>
  <div class="container mt-5">
    <h1 class="mb-4 text-center">Leaderboard</h1>

    <!-- Filter and Sort Row -->
    <div class="row mb-4">
      <div class="col-md-6 mb-2 mb-md-0">
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
      <div class="col-md-6">
        <label for="sort" class="form-label">Sort by:</label>
        <select
          id="sort"
          class="form-select"
          v-model="sortOrder"
          @change="sortLeaderboard"
        >
          <option value="1rm-desc">1RM: Biggest to Smallest</option>
          <option value="1rm-asc">1RM: Smallest to Biggest</option>
          <option value="likes-desc">Likes: Most to Least</option>
          <option value="likes-asc">Likes: Least to Most</option>
        </select>
      </div>
    </div>

    <!-- Leaderboard Table -->
    <div class="table-responsive">
      <table class="table table-striped">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">Name</th>
            <th scope="col">1 Rep Max</th>
            <th scope="col">Category</th>
            <th scope="col">Likes</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in paginatedLeaderboard" :key="item.id">
            <th scope="row">{{ (currentPage - 1) * pageSize + index + 1 }}</th>
            <td>{{ item.username }}</td>
            <td>{{ Math.round(item.weight * (1 + 0.033 * item.reps)) }}</td>
            <td>{{ item.exercise }}</td>
            <td>
              {{ item.likes }}
              <button
                class="btn btn-primary custom-button"
                :disabled="item.liked"
                @click="likeWorkout(item)"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  fill="currentColor"
                  class="bi bi-arrow-up-short custom-icon"
                  viewBox="0 0 16 16"
                >
                  <path
                    fill-rule="evenodd"
                    d="M8 12a.5.5 0 0 0 .5-.5V5.707l2.146 2.147a.5.5 0 0 0 .708-.708l-3-3a.5.5 0 0 0-.708 0l-3 3a.5.5 0 1 0 .708.708L7.5 5.707V11.5a.5.5 0 0 0 .5.5"
                  />
                </svg>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
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
import { mapGetters, mapActions } from 'vuex';
import { getLeaderboard } from "../services/leaderboardService";

export default {
  data() {
    return {
      leaderboard: [],
      selectedCategory: "",
      sortOrder: "1rm-desc",
      currentPage: 1,
      pageSize: 5,
    };
  },
  computed: {
    ...mapGetters(['leaderboard']),
    filteredLeaderboard() {
      let filtered = this.leaderboard;
      if (this.selectedCategory) {
        filtered = filtered.filter(
          (item) => item.exercise === this.selectedCategory
        );
      }
      return filtered.sort((a, b) => {
        const a1RM = a.weight * (1 + 0.033 * a.reps);
        const b1RM = b.weight * (1 + 0.033 * b.reps);
        if (this.sortOrder === "1rm-asc") {
          return a1RM - b1RM;
        } else if (this.sortOrder === "1rm-desc") {
          return b1RM - a1RM;
        } else if (this.sortOrder === "likes-asc") {
          return a.likes - b.likes;
        } else if (this.sortOrder === "likes-desc") {
          return b.likes - a.likes;
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
    ...mapActions(['fetchLeaderboard', 'likeWorkoutAction']),
    filterLeaderboard() {
      this.currentPage = 1; 
    },
    sortLeaderboard() {
      this.currentPage = 1; 
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
        this.leaderboard = response.data.map((item) => ({
          id: item.id, 
          username: item.username,
          weight: item.weight,
          reps: item.reps,
          sets: item.sets,
          exercise: item.exercise,
          likes: item.likes, 
          liked: false 
        }));
      } catch (error) {
        console.error(error);
      }
    },
    async likeWorkout(item) {
      try {
        await this.likeWorkoutAction(item.id);
        item.liked = true;
        item.likes += 1;
      } catch (error) {
        console.error('Error liking workout:', error);
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
.custom-button {
  padding: 2px 6px; 
}
.custom-icon {
  width: 24px; 
  height: 24px; 
}
</style>
