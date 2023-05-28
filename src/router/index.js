import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/dayz-spawn-builder',
    name: 'DayzSpawnBuilder',
    component: () => import(/* webpackChunkName: "dayz-spawn-builder" */ '../views/DayzSpawnBuilder.vue')
  },
  {
    path: '/dayz-types',
    name: 'DayzTypes',
    component: () => import(/* webpackChunkName: "dayz-types" */ '../views/DayzTypes.vue')
  },
  {
    path: '/xml-browser',
    name: 'XMLBrowser',
    component: () => import(/* webpackChunkName: "dayz-spawn-builder" */ '../views/XMLBrowser.vue')
  },
  {
    path: '/',
    name: 'About',
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  },
  {
    path: '/airlift/:hash',
    name: 'Airlift',
    component: () => import(/* webpackChunkName: "playground" */ '../views/Airlift.vue')
  },
  {
    path: '/playground',
    name: 'Playground',
    component: () => import(/* webpackChunkName: "playground" */ '../views/Playground.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
