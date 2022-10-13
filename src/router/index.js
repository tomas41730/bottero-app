import Vue from 'vue'
import VueRouter from 'vue-router'
import { auth } from '../services/firebase'
import Home from '../views/Home.vue'
// import store from '../store/index';

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: { requiresAuth: true }
  },
  {
    path: '/users',
    name: 'Users',
    component: () => import('../views/Users.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/customers',
    name: 'customers',
    component: () => import('../views/Customers.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/stores',
    name: 'Stores',
    component: () => import('../views/Stores.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/inventory',
    name: 'Inventory',
    component: () => import('../views/Inventory.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/inventory2',
    name: 'Inventory2',
    component: () => import('../views/Inventory2.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/roles',
    name: 'Roles',
    component: () => import('../views/Roles.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/about',
    name: 'About',
    component: () => import('../views/About.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/batchChanges',
    name: 'Batch-Products',
    component: () => import('../views/BatchProducts.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/batchChanges2',
    name: 'Batch-Products2',
    component: () => import('../views/BatchProducts2.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue')
  },
  {
    path: '/sales',
    name: 'Sales',
    component: () => import('../views/Sales.vue'),
    meta: { requiresAuth: true },
    // beforeEnter(to, from, next) {
    //   // check vuex store //
    //   if (store.state.salesGuard === true) 
    //   {
    //     console.log('1: ' + store.state.salesGuard)
    //     next()
    //   } 
    //   else 
    //   {
    //     console.log('3: ' + from.name + ', ' + store.state.salesGuard)
    //     next({
    //       name: "Sidebar" // back to safety route //
    //     });
    //   }
    // }
  },
  {
    path: '/transfers',
    name: 'Transfers',
    component: () => import('../views/Transfers.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/salesControl',
    name: 'SalesControl',
    component: () => import('../views/SalesReports.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/reservesControl',
    name: 'ReservesControl',
    component: () => import('../views/ReservesReports.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/transfersControl',
    name: 'TransfersControl',
    component: () => import('../views/TransfersReports.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/dailyReport',
    name: 'DailyReport',
    component: () => import('../views/DailyReport.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/subinventory',
    name: 'Subinventory',
    component: () => import('../views/Subinventory.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/sidebar',
    name: 'Sidebar',
    component: () => import('../views/Sidebar.vue'),
    meta: { requiresAuth: true }
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next)=>{
  const isAuthenticated = auth.currentUser;
  if(to.name !== 'Login' && !isAuthenticated)
  {
    next('/login');
  }
  // if(to.name === 'Sales'  && store.state.salesGuard === false && isAuthenticated)
  // {    
  //   next();
  // }
  else{
    next();
  }
})

export default router
