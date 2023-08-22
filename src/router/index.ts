import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import formPage from "../views/formPage.vue";
import previewPage from "../views/previewPage.vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/form",
    name: "formPage",
    component: formPage,
  },
  {
    path: "/preview",
    name: "previewPage",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/previewPage.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
