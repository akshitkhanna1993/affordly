import { createRouter, createWebHistory } from "vue-router";
import Home from "@/views/Home.vue";
import ProfileSetup from "@/components/ProfileSetup.vue";
import ItemEvaluation from "@/components/ItemEvaluation.vue";
import ResultsDisplay from "@/components/ResultsDisplay.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: Home,
    },
    {
      path: "/profile",
      name: "profile",
      component: ProfileSetup,
    },
    {
      path: "/evaluate",
      name: "evaluate",
      component: ItemEvaluation,
    },
    {
      path: "/results",
      name: "results",
      component: ResultsDisplay,
    },
  ],
});

export default router;
