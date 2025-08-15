import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', name: 'task-list', component: () => import('pages/IndexPage.vue') },
      { path: 'task/add', name: 'add-task', component: () => import('pages/TaskForm.vue') },
      { path: 'task/edit/:id', name: 'edit-task', component: () => import('pages/TaskForm.vue'), props: true },
    ],
  },
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;
