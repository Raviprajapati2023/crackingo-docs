# State Management

Cracingo uses **Pinia** for centralized state management, providing a modern, type-safe, and intuitive way to manage application state across components.

## 🏪 Store Architecture

### Store Structure Pattern

```typescript
// stores/exampleStore.ts
import { defineStore } from 'pinia'
import { api } from 'boot/axios'
import { Loading } from 'quasar'

interface State {
  data: any[]
  loading: boolean
  error: string | null
}

export const useExampleStore = defineStore('example', {
  state: (): State => ({
    data: [],
    loading: false,
    error: null
  }),
  
  getters: {
    filteredData: (state) => (filter: string) => 
      state.data.filter(item => item.name.includes(filter))
  },
  
  actions: {
    async fetchData() {
      this.loading = true
      try {
        const response = await api.get('/api/data')
        this.data = response.data
      } catch (error) {
        this.error = error.message
      } finally {
        this.loading = false
      }
    }
  },
  
  persist: true // Enable persistence
})
```

## 🔐 Account Store Deep Dive

The `accountStore` manages authentication and user state:

### State Structure

```typescript
interface State {
  user: IUser              // Current user data
  accessToken: string      // JWT access token
  totalPoints: number      // User's total points
}
```

### Key Actions

#### **Authentication Flow**

```typescript
// Google Sign-in
await accountStore.loginWithGoogle({ token: googleToken })

// Regular login
await accountStore.login({ email, password })

// Account verification
await accountStore.verifyAccount(email, otp)
```

#### **Profile Management**

```typescript
// Get user profile
await accountStore.getProfileDetail()

// Update profile
await accountStore.updateProfileDetail(profileData)

// Update password
await accountStore.updatePassword({ 
  currentPassword, 
  newPassword 
})
```

#### **Points System**

```typescript
// Get user points
const points = await accountStore.getPoints()

// Get total points
await accountStore.getPointsTotal()

// Add coins (admin function)
await accountStore.addCoins({
  userId: 'user123',
  coins: 100,
  message: 'Bonus reward'
})
```

## 🎯 Usage Patterns

### **In Components**

```vue
<script setup lang="ts">
import { useAccountStore } from 'stores/accountStore'

const accountStore = useAccountStore()

// Reactive state access
const { user, accessToken, totalPoints } = storeToRefs(accountStore)

// Action calls
const handleLogin = async (credentials) => {
  try {
    await accountStore.login(credentials)
    // Redirect or show success
  } catch (error) {
    // Handle error
  }
}
</script>

<template>
  <div v-if="user.id">
    <SAvatar :src="user.avatar" :label="user.name" />
    <p>Points: {{ totalPoints }}</p>
  </div>
</template>
```

### **Authentication Guard**

```typescript
// In router or middleware
const accountStore = useAccountStore()

if (!accountStore.accessToken) {
  // Redirect to login
  router.push('/login')
}
```

## 🔄 State Persistence

### **Automatic Persistence**

```typescript
export const useAccountStore = defineStore('account', {
  // ... store definition
  persist: true  // Automatically saves to localStorage
})
```

### **Custom Persistence**

```typescript
export const useAppStore = defineStore('app', {
  // ... store definition
  persist: {
    storage: sessionStorage,
    paths: ['user', 'preferences'], // Only persist specific paths
    beforeRestore: (context) => {
      // Custom logic before restoring
    }
  }
})
```

## 🛡️ Error Handling

### **Centralized Error Management**

```typescript
// stores/errorStore.ts
export const useErrorStore = defineStore('error', {
  state: () => ({
    errors: [] as string[],
    hasError: false
  }),
  
  actions: {
    addError(message: string) {
      this.errors.push(message)
      this.hasError = true
    },
    
    clearErrors() {
      this.errors = []
      this.hasError = false
    }
  }
})
```

### **API Error Handling**

```typescript
// In store actions
async fetchData() {
  Loading.show()
  try {
    const response = await api.get(endpoint.DATA)
    this.data = response.data
  } catch (error) {
    const errorStore = useErrorStore()
    errorStore.addError('Failed to fetch data')
    throw error
  } finally {
    Loading.hide()
  }
}
```

## 🔄 Store Composition

### **Cross-Store Communication**

```typescript
// stores/notificationStore.ts
export const useNotificationStore = defineStore('notification', {
  actions: {
    async markAsRead(notificationId: string) {
      const accountStore = useAccountStore()
      
      if (!accountStore.accessToken) {
        throw new Error('User not authenticated')
      }
      
      await api.patch(`/notifications/${notificationId}`, {
        read: true
      })
      
      // Update local state
      await this.fetchNotifications()
    }
  }
})
```

### **Modular Store Design**

```typescript
// stores/index.ts
export { useAccountStore } from './accountStore'
export { useNotificationStore } from './notificationStore'
export { useErrorStore } from './errorStore'
export { useUIStore } from './uiStore'

// Usage
import { useAccountStore, useNotificationStore } from 'stores'
```

## ⚡ Performance Optimization

### **Selective Reactivity**

```vue
<script setup>
// Only make specific properties reactive
const accountStore = useAccountStore()
const { user } = storeToRefs(accountStore)

// Don't make actions reactive
const { login, logout } = accountStore
</script>
```

### **Computed Getters**

```typescript
export const useAccountStore = defineStore('account', {
  getters: {
    isAuthenticated: (state) => !!state.accessToken,
    userInitials: (state) => {
      const name = state.user.name || ''
      return name.split(' ').map(n => n[0]).join('').toUpperCase()
    },
    hasPermission: (state) => (permission: string) => {
      return state.user.permissions?.includes(permission) || false
    }
  }
})
```

## 🧪 Testing Stores

### **Unit Testing**

```typescript
import { setActivePinia, createPinia } from 'pinia'
import { useAccountStore } from 'stores/accountStore'

describe('Account Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('should login user successfully', async () => {
    const store = useAccountStore()
    
    await store.login({ email: 'test@test.com', password: 'password' })
    
    expect(store.accessToken).toBeTruthy()
    expect(store.user.email).toBe('test@test.com')
  })
})
```

## 🔧 Development Tools

### **Pinia DevTools**

```typescript
// main.ts
import { createPinia } from 'pinia'

const pinia = createPinia()

// Enable devtools in development
if (process.env.NODE_ENV === 'development') {
  pinia.use(({ store }) => {
    store.$subscribe((mutation, state) => {
      console.log('Store mutation:', mutation.type, state)
    })
  })
}
```

### **HMR Support**

```typescript
// Automatic HMR for stores
if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useAccountStore, import.meta.hot))
}
```

This state management architecture ensures scalable, maintainable, and type-safe state handling throughout the Cracingo application.