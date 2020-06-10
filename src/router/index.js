import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  },
  {
    path: '/topicdetail',
    name: 'TopicDetail',
    meta: {
      scrollTop: true
    },
    component: () => import('../views/TopicDetail.vue')
  },
  {
    path: '/userinfo',
    name: 'UserInfo',
    component: () => import('../views/UserInfo.vue'),
    children: [
      {
        path: '/userinfo/profile',
        name: 'UserProfile',
        meta: {
          background: '#fff'
        },
        component: () => import('../views/UserProfile')
      },
      {
        path: '/userinfo/record',
        name: 'UserRecord',
        meta: {
          background: '#fff'
        },
        component: () => import('../views/UserRecord')
      },
      {
        path: '/userinfo/safe',
        name: 'UserSafe',
        meta: {
          background: '#fff'
        },
        component: () => import('../views/UserSafe')
      }
    ]
  },
  {
    path: '/room',
    name: 'Room',
    component: () => import('../views/Room.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition || to.matched[0].path === from.matched[0].path) {
      return savedPosition
    } else {
      return { x: 0, y: 0 }
    }
  },
  routes
})

router.beforeEach((to, from, next) => {
  if (to.meta.background) {
    window.document.body.style.background = to.meta.background
    document.getElementById('app').style.background = to.meta.background
  } else {
    window.document.body.style.background = '#F5F5F5'
    document.getElementById('app').style.background = '#F5F5F5'
  }
  next()
})

export default router
