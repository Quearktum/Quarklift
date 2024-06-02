import { createRouter, createWebHistory } from 'vue-router'
import DashboardView from '../views/DashboardView.vue'
import BrowseView from '../views/BrowseView.vue'
import LeaderboardView from '../views/LeaderboardView.vue'
import ExercisesComponent from '../components/Exercises.vue';

const routes = [
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: DashboardView
  },
  {
    path: '/browse',
    name: 'Browse',
    component: BrowseView
  },
  {
    path: '/leaderboard',
    name: 'Leaderboard',
    component: LeaderboardView
  },
  {
    path: '/exercises',
    name: 'Exercises',
    component: ExercisesComponent
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router


// const routes = [

// ]

// const router = new VueRouter({
//   mode: 'history',
//   base: process.env.BASE_URL,
//   routes
// })

