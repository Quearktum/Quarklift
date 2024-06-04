import { createRouter, createWebHistory } from "vue-router";
import DashboardView from "../views/DashboardView.vue";
import BrowseView from "../views/BrowseView.vue";
import LeaderboardView from "../views/LeaderboardView.vue";
import Register from "../components/Register.vue";
import Login from "../components/Login.vue";
import store from "../store/store";

const routes = [
  {
    path: "/",
    redirect: "/login",
  },
  {
    path: "/dashboard",
    name: "Dashboard",
    component: DashboardView,
    meta: { requiresAuth: true },
  },
  {
    path: "/browse",
    name: "Browse",
    component: BrowseView,
    meta: { requiresAuth: true },
  },
  {
    path: "/leaderboard",
    name: "Leaderboard",
    component: LeaderboardView,
    meta: { requiresAuth: true },
  },
  { path: "/register", component: Register },
  { path: "/login", component: Login },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

router.beforeEach((to, from, next) => {
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (!store.getters.isAuthenticated) {
      next("/login");
    } else {
      next();
    }
  } else {
    next();
  }
});

export default router;
