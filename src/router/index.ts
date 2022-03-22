import { createRouter, createWebHashHistory, Router } from 'vue-router';

const router: Router = createRouter({
  history: createWebHashHistory(),
  routes: [{
    path: '/',
    meta: { title: 'index page' },
    component: () => import('@/views/Index.vue')
  },]
});

export default router;
