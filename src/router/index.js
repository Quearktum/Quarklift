import { createRouter, createWebHistory } from "vue-router";
import DashboardView from "../views/DashboardView.vue";
import BrowseView from "../views/BrowseView.vue";
import LeaderboardView from "../views/LeaderboardView.vue";
import Register from "../components/Register.vue";
import Login from "../components/Login.vue";

const routes = [
  {
    path: "/",
    redirect: "/dashboard"
  },
  {
    path: "/dashboard",
    name: "Dashboard",
    component: DashboardView,
  },
  {
    path: "/browse",
    name: "Browse",
    component: BrowseView,
  },
  {
    path: "/leaderboard",
    name: "Leaderboard",
    component: LeaderboardView,
  },
  { path: "/register", component: Register },
  { path: "/login", component: Login },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
