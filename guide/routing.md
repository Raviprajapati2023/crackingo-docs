# Routing

Cracingo uses Vue Router with a structured approach to navigation, including authentication guards, breadcrumb management, and dynamic route handling.

## 🛣️ Route Structure

### **Route Organization**

```typescript
// src/router/routes.ts
import { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  // Public routes
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { 
        path: '', 
        component: () => import('pages/IndexPage.vue'),
        name: 'home',
        meta: { title: 'Home' }
      }
    ]
  },

  // Authentication routes
  {
    path: '/auth',
    component: () => import('layouts/AuthLayout.vue'),
    children: [
      {
        path: 'login',
        component: () => import('pages/auth/LoginPage.vue'),
        name: 'login',
        meta: { 
          title: 'Login',
          requiresGuest: true // Only for non-authenticated users
        }
      },
      {
        path: 'register',
        component: () => import('pages/auth/RegisterPage.vue'),
        name: 'register',
        meta: { title: 'Register', requiresGuest: true }
      },
      {
        path: 'verify',
        component: () => import('pages/auth/VerifyPage.vue'),
        name: 'verify',
        meta: { title: 'Verify Account' }
      },
      {
        path: 'forgot-password',
        component: () => import('pages/auth/ForgotPasswordPage.vue'),
        name: 'forgot-password',
        meta: { title: 'Forgot Password', requiresGuest: true }
      },
      {
        path: 'reset-password',
        component: () => import('pages/auth/ResetPasswordPage.vue'),
        name: 'reset-password',
        meta: { title: 'Reset Password' }
      }
    ]
  },

  // Protected routes
  {
    path: '/dashboard',
    component: () => import('layouts/DashboardLayout.vue'),
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        component: () => import('pages/dashboard/DashboardPage.vue'),
        name: 'dashboard',
        meta: { 
          title: 'Dashboard',
          breadcrumbs: [
            { text: 'Dashboard', icon: 'dashboard' }
          ]
        }
      },
      {
        path: 'profile',
        component: () => import('pages/dashboard/ProfilePage.vue'),
        name: 'profile',
        meta: { 
          title: 'Profile',
          breadcrumbs: [
            { text: 'Dashboard', to: { name: 'dashboard' }, icon: 'dashboard' },
            { text: 'Profile', icon: 'person' }
          ]
        }
      },
      {
        path: 'settings',
        component: () => import('pages/dashboard/SettingsPage.vue'),
        name: 'settings',
        meta: { 
          title: 'Settings',
          breadcrumbs: [
            { text: 'Dashboard', to: { name: 'dashboard' }, icon: 'dashboard' },
            { text: 'Settings', icon: 'settings' }
          ]
        }
      }
    ]
  },

  // Admin routes
  {
    path: '/admin',
    component: () => import('layouts/AdminLayout.vue'),
    meta: { 
      requiresAuth: true,
      requiresRole: 'admin'
    },
    children: [
      {
        path: '',
        component: () => import('pages/admin/AdminDashboard.vue'),
        name: 'admin-dashboard',
        meta: { 
          title: 'Admin Dashboard',
          breadcrumbs: [
            { text: 'Admin', icon: 'admin_panel_settings' }
          ]
        }
      },
      {
        path: 'users',
        component: () => import('pages/admin/UsersPage.vue'),
        name: 'admin-users',
        meta: { 
          title: 'Manage Users',
          breadcrumbs: [
            { text: 'Admin', to: { name: 'admin-dashboard' }, icon: 'admin_panel_settings' },
            { text: 'Users', icon: 'people' }
          ]
        }
      },
      {
        path: 'users/:id',
        component: () => import('pages/admin/UserDetailPage.vue'),
        name: 'admin-user-detail',
        meta: { 
          title: 'User Details',
          breadcrumbs: [
            { text: 'Admin', to: { name: 'admin-dashboard' }, icon: 'admin_panel_settings' },
            { text: 'Users', to: { name: 'admin-users' }, icon: 'people' },
            { text: 'User Details', icon: 'person' }
          ]
        }
      }
    ]
  },

  // API routes for dynamic content
  {
    path: '/courses',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        component: () => import('pages/courses/CoursesPage.vue'),
        name: 'courses',
        meta: { title: 'Courses' }
      },
      {
        path: ':courseId',
        component: () => import('pages/courses/CourseDetailPage.vue'),
        name: 'course-detail',
        meta: { 
          title: 'Course Details',
          breadcrumbs: [
            { text: 'Courses', to: { name: 'courses' }, icon: 'school' },
            { text: 'Course Details', icon: 'menu_book' }
          ]
        }
      },
      {
        path: ':courseId/learn',
        component: () => import('pages/courses/LearnPage.vue'),
        name: 'course-learn',
        meta: { 
          title: 'Learn',
          requiresAuth: true,
          breadcrumbs: [
            { text: 'Courses', to: { name: 'courses' }, icon: 'school' },
            { text: 'Learn', icon: 'play_circle' }
          ]
        }
      }
    ]
  },

  // Error pages
  {
    path: '/404',
    component: () => import('pages/ErrorNotFound.vue'),
    name: '404',
    meta: { title: 'Page Not Found' }
  },
  {
    path: '/403',
    component: () => import('pages/ErrorForbidden.vue'),
    name: '403',
    meta: { title: 'Access Forbidden' }
  },

  // Catch all 404
  {
    path: '/:catchAll(.*)*',
    redirect: '/404'
  }
]

export default routes
```

## 🛡️ Navigation Guards

### **Authentication Guard**

```typescript
// router/guards/authGuard.ts
import { NavigationGuardNext, RouteLocationNormalized } from 'vue-router'
import { useAccountStore } from 'stores/accountStore'

export function authGuard(
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext
) {
  const accountStore = useAccountStore()
  
  // Check if route requires authentication
  if (to.meta.requiresAuth) {
    if (!accountStore.accessToken) {
      // Redirect to login with return URL
      next({
        name: 'login',
        query: { redirect: to.fullPath }
      })
      return
    }
    
    // Check role-based access
    if (to.meta.requiresRole) {
      const userRole = accountStore.user.role
      const requiredRole = to.meta.requiresRole
      
      if (userRole !== requiredRole) {
        next({ name: '403' })
        return
      }
    }
  }
  
  // Check if route is for guests only
  if (to.meta.requiresGuest && accountStore.accessToken) {
    next({ name: 'dashboard' })
    return
  }
  
  next()
}
```

### **Route Setup with Guards**

```typescript
// router/index.ts
import { route } from 'quasar/wrappers'
import { createRouter, createWebHistory } from 'vue-router'
import routes from './routes'
import { authGuard } from './guards/authGuard'

export default route(function (/* { store, ssrContext } */) {
  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,
    history: createWebHistory(process.env.VUE_ROUTER_BASE)
  })

  // Global navigation guards
  Router.beforeEach(authGuard)
  
  // Title management
  Router.afterEach((to) => {
    document.title = to.meta.title 
      ? `${to.meta.title} - Cracingo` 
      : 'Cracingo'
  })

  return Router
})
```

## 🍞 Breadcrumb Management

### **CBreadcrumbs Component Usage**

```vue
<template>
  <CBreadcrumbs :items="breadcrumbItems" />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const breadcrumbItems = computed(() => {
  return route.meta.breadcrumbs || []
})
</script>
```

### **Dynamic Breadcrumbs**

```typescript
// composables/useBreadcrumbs.ts
import { computed } from 'vue'
import { useRoute } from 'vue-router'

export function useBreadcrumbs() {
  const route = useRoute()
  
  const breadcrumbs = computed(() => {
    const items = [...(route.meta.breadcrumbs || [])]
    
    // Add dynamic breadcrumb based on route params
    if (route.name === 'course-detail' && route.params.courseId) {
      // You can fetch course name from store or API
      items.push({
        text: 'Course Name', // Replace with actual course name
        icon: 'menu_book'
      })
    }
    
    if (route.name === 'admin-user-detail' && route.params.id) {
      items.push({
        text: `User #${route.params.id}`,
        icon: 'person'
      })
    }
    
    return items
  })
  
  return { breadcrumbs }
}
```

## 🔗 Navigation Helpers

### **Programmatic Navigation**

```typescript
// composables/useNavigation.ts
import { useRouter, useRoute } from 'vue-router'
import { useAccountStore } from 'stores/accountStore'

export function useNavigation() {
  const router = useRouter()
  const route = useRoute()
  const accountStore = useAccountStore()
  
  const goToDashboard = () => {
    router.push({ name: 'dashboard' })
  }
  
  const goToProfile = () => {
    router.push({ name: 'profile' })
  }
  
  const goToCourse = (courseId: string) => {
    router.push({ 
      name: 'course-detail', 
      params: { courseId } 
    })
  }
  
  const goToLogin = (returnUrl?: string) => {
    router.push({ 
      name: 'login',
      query: { redirect: returnUrl || route.fullPath }
    })
  }
  
  const logout = async () => {
    await accountStore.logout()
    router.push({ name: 'login' })
  }
  
  const goBack = () => {
    router.go(-1)
  }
  
  return {
    goToDashboard,
    goToProfile,
    goToCourse,
    goToLogin,
    logout,
    goBack
  }
}
```

### **Route-based Component State**

```vue
<template>
  <div>
    <CBreadcrumbs :items="breadcrumbs" />
    
    <div v-if="isLoading">Loading...</div>
    <div v-else>
      <!-- Content based on route -->
    </div>
  </div>
</template>

<script setup lang="ts">
import { watch } from 'vue'
import { useRoute } from 'vue-router'
import { useBreadcrumbs } from 'composables/useBreadcrumbs'

const route = useRoute()
const { breadcrumbs } = useBreadcrumbs()

const isLoading = ref(false)

// Watch for route changes
watch(
  () => route.params.courseId,
  async (newCourseId) => {
    if (newCourseId) {
      isLoading.value = true
      try {
        // Fetch course data
        await fetchCourseData(newCourseId as string)
      } finally {
        isLoading.value = false
      }
    }
  },
  { immediate: true }
)
</script>
```

## 📱 Mobile Navigation

### **Responsive Navigation**

```vue
<template>
  <q-layout>
    <!-- Mobile drawer -->
    <q-drawer
      v-if="$q.screen.lt.md"
      v-model="leftDrawerOpen"
      show-if-above
      :mini="!leftDrawerOpen || miniState"
      :width="200"
      :breakpoint="500"
      bordered
    >
      <NavigationMenu :items="menuItems" />
    </q-drawer>
    
    <!-- Desktop sidebar -->
    <q-drawer
      v-else
      v-model="leftDrawerOpen"
      show-if-above
      :mini="miniState"
      :width="200"
      bordered
    >
      <NavigationMenu :items="menuItems" />
    </q-drawer>
    
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { useQuasar } from 'quasar'

const $q = useQuasar()
const leftDrawerOpen = ref(false)
const miniState = ref(false)

const menuItems = computed(() => [
  {
    title: 'Dashboard',
    icon: 'dashboard',
    to: { name: 'dashboard' }
  },
  {
    title: 'Courses',
    icon: 'school',
    to: { name: 'courses' }
  },
  {
    title: 'Profile',
    icon: 'person',
    to: { name: 'profile' }
  }
])
</script>
```

## 🔍 Route Parameters & Queries

### **Parameter Handling**

```typescript
// pages/courses/CourseDetailPage.vue
export default defineComponent({
  async setup() {
    const route = useRoute()
    const courseId = computed(() => route.params.courseId as string)
    
    // Reactive parameter watching
    const { data: course, loading } = await useCourse(courseId)
    
    return { course, loading }
  }
})

// composables/useCourse.ts
export function useCourse(courseId: Ref<string>) {
  const course = ref(null)
  const loading = ref(false)
  
  watch(courseId, async (id) => {
    if (id) {
      loading.value = true
      try {
        course.value = await api.get(`/courses/${id}`)
      } finally {
        loading.value = false
      }
    }
  }, { immediate: true })
  
  return { data: course, loading }
}
```

### **Query Parameters**

```typescript
// Search page with query handling
export default defineComponent({
  setup() {
    const route = useRoute()
    const router = useRouter()
    
    const searchQuery = computed({
      get: () => route.query.q as string || '',
      set: (value: string) => {
        router.push({
          query: { ...route.query, q: value || undefined }
        })
      }
    })
    
    const currentPage = computed({
      get: () => parseInt(route.query.page as string) || 1,
      set: (value: number) => {
        router.push({
          query: { ...route.query, page: value > 1 ? value : undefined }
        })
      }
    })
    
    return { searchQuery, currentPage }
  }
})
```

## 🎯 Route Transitions

### **Page Transitions**

```vue
<template>
  <router-view v-slot="{ Component, route }">
    <transition
      :name="getTransitionName(route)"
      mode="out-in"
      appear
    >
      <component :is="Component" :key="route.path" />
    </transition>
  </router-view>
</template>

<script setup lang="ts">
function getTransitionName(route: any) {
  if (route.meta.transition) {
    return route.meta.transition
  }
  
  // Default transitions based on route depth
  const depth = route.path.split('/').length
  return depth > 2 ? 'slide-left' : 'fade'
}
</script>

<style>
/* Transition animations */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

.slide-left-enter-active, .slide-left-leave-active {
  transition: transform 0.3s ease;
}
.slide-left-enter-from {
  transform: translateX(100%);
}
.slide-left-leave-to {
  transform: translateX(-100%);
}
</style>
```

This routing architecture provides a comprehensive navigation system that handles authentication, authorization, breadcrumbs, and smooth user experience throughout the Cracingo application.