import { createRouter, createWebHashHistory } from "vue-router";
import Agent from "./views/Agent.vue";
import Main from "./views/Main.vue";
import PathNotFound from "./views/PathNotFound.vue";

const routes = [
  {
    path: "/",
    name: "main",
    component: Main
  },
  {
    path: "/agent",
    name: "agent",
    component: Agent
  },
  { path: "/:pathMatch(.*)*", component: PathNotFound }
];

const router = createRouter({
  history: createWebHashHistory(),
  routes
});

export default router;
