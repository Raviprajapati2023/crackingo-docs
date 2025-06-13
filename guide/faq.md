# Frequently Asked Questions

Common questions and answers about using Cracingo's component library and features.

## 🎯 Getting Started

### How do I use components without importing them?

All Cracingo components are globally registered, so you can use them directly in your templates:

```vue
<template>
  <!-- No imports needed! -->
  <CInput v-model="name" label="Your Name" />
  <CBtn @click="submit">Submit</CBtn>
</template>
```

### What's the difference between C-prefixed and S-prefixed components?

- **C-prefixed components** (CInput, CBtn, CDialog): Feature-rich wrapper components with enhanced functionality
- **S-prefixed components** (SForm, SAvatar, SCheckbox): Simpler, foundational components for basic use cases

### How do I handle form validation?

Use the built-in `rules` prop on form components:

```vue
<CInput 
  v-model="email"
  :rules="[
    val => !!val || 'Email is required',
    val => /.+@.+\..+/.test(val) || 'Invalid email'
  ]"
/>
```

## 🔧 Component Usage

### How do I customize component styling?

Components accept standard CSS classes and support Tailwind utilities:

```vue
<CBtn class="w-full bg-red-500 hover:bg-red-600">
  Custom Styled Button
</CBtn>
```

### Can I use Quasar components directly?

Yes! Cracingo components are built on top of Quasar, so you can mix both:

```vue
<template>
  <CInput v-model="search" />
  <q-separator />
  <q-btn label="Quasar Button" />
</template>
```

### How do I handle file uploads?

Use the `CUploader` component for drag-and-drop file uploads:

```vue
<CUploader 
  v-model="file" 
  accept="image/*"
  label="Upload Image"
/>
```

## 📊 Data Management

### How do I implement server-side pagination?

Use the `APITable` component with your endpoint:

```vue
<APITable
  api-endpoint="/api/users"
  :columns="columns"
  :search-fields="['name', 'email']"
  :raw-filters="{ status: 'active' }"
/>
```

### How do I manage application state?

Use Pinia stores following the established pattern:

```javascript
export const useMyStore = defineStore('myStore', {
  state: () => ({
    data: [],
    loading: false
  }),
  
  actions: {
    async fetchData() {
      this.loading = true
      try {
        const response = await api.get('/api/data')
        this.data = response.data
      } finally {
        this.loading = false
      }
    }
  },
  
  persist: true
})
```

### How do I handle API errors?

Errors are automatically handled by the Axios interceptor, but you can add custom handling:

```javascript
try {
  await api.post('/api/data', payload)
} catch (error) {
  $q.notify({
    type: 'negative',
    message: 'Custom error message'
  })
}
```

## 🎨 Styling & Theming

### How do I customize the color scheme?

Modify the Quasar color palette in your configuration:

```javascript
// quasar.config.js
framework: {
  config: {
    brand: {
      primary: '#1976d2',
      secondary: '#26a69a',
      // ... other colors
    }
  }
}
```

### Can I use custom fonts?

Yes, import fonts in your CSS and apply them:

```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

body {
  font-family: 'Inter', sans-serif;
}
```

### How do I make components responsive?

Use Quasar's screen utilities and Tailwind classes:

```vue
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
  <CInput :dense="$q.screen.lt.md" />
</div>
```

## 🔐 Authentication & Security

### How do I protect routes?

Use the authentication guard in your router:

```javascript
router.beforeEach((to, from, next) => {
  const accountStore = useAccountStore()
  
  if (to.meta.requiresAuth && !accountStore.accessToken) {
    next('/login')
  } else {
    next()
  }
})
```

### How do I implement role-based access?

Check user roles in components and routes:

```vue
<CBtn v-if="user.role === 'admin'" @click="adminAction">
  Admin Only
</CBtn>
```

### How do I handle token expiration?

The Axios interceptor automatically handles 401 responses by redirecting to login.

## 📱 Mobile & Responsive Design

### How do I make my app mobile-friendly?

Components are responsive by default. Use Quasar's screen utilities:

```vue
<template>
  <div :class="$q.screen.lt.md ? 'p-2' : 'p-6'">
    <CInput :dense="$q.screen.lt.md" />
  </div>
</template>
```

### How do I handle mobile navigation?

Use Quasar's drawer component with responsive breakpoints:

```vue
<q-drawer 
  v-model="drawer" 
  :breakpoint="500"
  show-if-above
>
  <!-- Navigation content -->
</q-drawer>
```

## 🚀 Performance

### How do I optimize component performance?

- Use `v-show` instead of `v-if` for frequently toggled content
- Implement lazy loading for large lists
- Use computed properties for expensive calculations

```vue
<script setup>
const expensiveValue = computed(() => {
  return heavyCalculation(props.data)
})
</script>
```

### How do I handle large datasets?

Use server-side pagination with `APITable` or implement virtual scrolling:

```vue
<APITable
  api-endpoint="/api/large-dataset"
  :rows-per-page-options="[25, 50, 100]"
/>
```

## 🔍 Debugging & Development

### How do I debug API calls?

Check the browser's Network tab or add logging:

```javascript
// In store actions
console.log('API Request:', endpoint, payload)
const response = await api.post(endpoint, payload)
console.log('API Response:', response)
```

### How do I handle development vs production differences?

Use environment variables:

```javascript
const apiUrl = process.env.NODE_ENV === 'production' 
  ? 'https://api.cracingo.com'
  : 'http://localhost:3000'
```

### Why isn't my component updating?

Common issues:
- Missing `v-model` or event handlers
- Not using reactive references (`ref()` or `reactive()`)
- Mutating props directly instead of emitting events

```vue
<!-- ❌ Wrong -->
<script>
let data = { value: '' }
</script>

<!-- ✅ Correct -->
<script setup>
const data = ref({ value: '' })
</script>
```

## 🔄 Common Patterns

### How do I implement a master-detail view?

```vue
<template>
  <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
    <!-- Master List -->
    <div class="lg:col-span-1">
      <SectionCard title="Items">
        <div 
          v-for="item in items"
          @click="selectedItem = item"
          class="cursor-pointer p-2 hover:bg-grey-50"
        >
          {{ item.name }}
        </div>
      </SectionCard>
    </div>
    
    <!-- Detail View -->
    <div class="lg:col-span-2">
      <ItemDetail v-if="selectedItem" :item="selectedItem" />
    </div>
  </div>
</template>
```

### How do I implement search with filters?

```vue
<template>
  <div>
    <div class="filters mb-4">
      <CInput v-model="search" placeholder="Search..." />
      <CSelect v-model="category" :options="categories" />
    </div>
    
    <div v-for="item in filteredItems" :key="item.id">
      {{ item.name }}
    </div>
  </div>
</template>

<script setup>
const search = ref('')
const category = ref('')

const filteredItems = computed(() => {
  return items.value.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(search.value.toLowerCase())
    const matchesCategory = !category.value || item.category === category.value
    return matchesSearch && matchesCategory
  })
})
</script>
```

## 💡 Best Practices

### What are the recommended coding patterns?

1. **Use composition over inheritance**: Combine small components
2. **Keep components focused**: One responsibility per component
3. **Use TypeScript**: Leverage type safety throughout
4. **Follow naming conventions**: C/S prefixes, descriptive names
5. **Handle loading states**: Always show feedback during async operations

### How should I structure my components?

```vue
<template>
  <!-- Template content -->
</template>

<script setup lang="ts">
// 1. Imports
import { useMyStore } from 'stores/myStore'

// 2. Props and emits
const props = defineProps<{...}>()
const emit = defineEmits<{...}>()

// 3. Reactive data
const loading = ref(false)

// 4. Computed properties
const computed = computed(() => ...)

// 5. Methods
const handleAction = () => {...}

// 6. Lifecycle hooks
onMounted(() => {...})
</script>
```

### When should I create a new component?

Create a new component when:
- Code is used in multiple places
- Logic becomes complex (>50 lines)
- You need to test functionality in isolation
- Component has a single, clear responsibility