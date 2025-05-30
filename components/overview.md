# Component Library Overview

Crackingo's component library provides a comprehensive set of reusable UI components built on top of Quasar Framework. Each component is designed with consistency, accessibility, and developer experience in mind.

## Design Philosophy

### 🎯 **Consistency First**
All components follow a unified design language with consistent spacing, colors, typography, and interaction patterns.

### ♿ **Accessibility Built-in**
Every component includes proper ARIA labels, keyboard navigation, and screen reader support to ensure inclusive experiences.

### 🔧 **Developer Experience**
Components are fully typed with TypeScript, include comprehensive documentation, and follow Vue 3 best practices.

### 🚀 **Performance Optimized**
Lightweight components with efficient rendering and minimal bundle impact.

## Component Categories

### Form Components
Interactive form elements for data input and validation.

| Component | Description | Key Features |
|-----------|-------------|--------------|
| [CInput](/components/cinput) | Enhanced input field | Password toggle, date picker, validation |
| [CSelect](/components/cselect) | Dropdown selection | Multi-select, search, custom options |
| [CEditor](/components/ceditor) | Rich text editor | Toolbar customization, responsive |
| [CFile](/components/cfile) | File upload | Drag & drop, validation, preview |
| [CUploader](/components/cuploader) | Advanced file uploader | Image compression, multiple files |
| [COtpInput](/components/cotpinput) | OTP code input | Auto-focus, paste support |
| [CTagsInput](/components/ctagsinput) | Tag input field | Dynamic tags, validation |

### Data Display Components
Components for displaying and manipulating data sets.

| Component | Description | Key Features |
|-----------|-------------|--------------|
| [APITable](/components/apitable) | Server-side data table | Pagination, sorting, filtering |
| [CTable](/components/ctable) | Client-side data table | Selection, custom rendering |

### UI Components
Core user interface elements and controls.

| Component | Description | Key Features |
|-----------|-------------|--------------|
| [CBtn](/components/cbtn) | Enhanced button | Tooltips, loading states |
| [CDialog](/components/cdialog) | Modal dialog | Form integration, responsive |
| [SAvatar](/components/savatar) | User avatar | Fallback initials, loading states |
| [CTimer](/components/ctimer) | Timer component | Start/stop/reset, formatted display |
| [CTooltip](/components/ctooltip) | Tooltip wrapper | Mobile-aware, customizable |

### Layout Components
Structural components for organizing content and forms.

| Component | Description | Key Features |
|-----------|-------------|--------------|
| [SForm](/components/sform) | Form wrapper | Validation, error handling |
| [SFormControl](/components/sformcontrol) | Form field wrapper | Labels, hints, required indicators |
| [SectionCard](/components/sectioncard) | Content section | Consistent styling, flexible slots |
| [CBreadcrumbs](/components/cbreadcrumbs) | Navigation breadcrumbs | Route integration, tooltips |

## Component Naming Convention

Our components follow a clear naming pattern:

### Prefixes
- **C*** - Custom components (application-specific)
- **S*** - Shared components (system-wide utilities)

### Examples
```vue
<!-- Custom form input with enhanced features -->
<CInput v-model="email" label="Email" type="email" />

<!-- Shared form wrapper with validation -->
<SForm @submit="handleSubmit">
  <!-- form content -->
</SForm>
```

## Quick Start Examples

### Basic Form
```vue
<template>
  <SForm @submit="handleSubmit">
    <CInput
      v-model="form.name"
      label="Full Name"
      required
      :rules="[val => !!val || 'Name is required']"
    />
    
    <CSelect
      v-model="form.country"
      :options="countries"
      label="Country"
      option-label="name"
      option-value="code"
      required
    />
    
    <CBtn
      label="Submit"
      type="submit"
      color="primary"
      :loading="submitting"
    />
  </SForm>
</template>

<script setup lang="ts">
const form = ref({
  name: '',
  country: ''
})

const submitting = ref(false)
const countries = ref([
  { name: 'United States', code: 'US' },
  { name: 'Canada', code: 'CA' },
  { name: 'United Kingdom', code: 'UK' }
])

const handleSubmit = async () => {
  submitting.value = true
  try {
    // Submit form logic
    await api.post('/users', form.value)
  } finally {
    submitting.value = false
  }
}
</script>
```

### Data Table with Actions
```vue
<template>
  <APITable
    :columns="columns"
    api-endpoint="/api/v1/users"
    :search-fields="['name', 'email']"
    :search-term="searchQuery"
    row-key="id"
  >
    <template #body-cell-actions="props">
      <q-td :props="props">
        <CBtn
          icon="edit"
          size="sm"
          flat
          tooltip="Edit User"
          @click="editUser(props.row)"
        />
        <CBtn
          icon="delete"
          size="sm"
          flat
          color="negative"
          tooltip="Delete User"
          @click="deleteUser(props.row)"
        />
      </q-td>
    </template>
  </APITable>
</template>

<script setup lang="ts">
const columns = ref([
  {
    name: 'name',
    label: 'Name',
    field: 'name',
    align: 'left',
    sortable: true
  },
  {
    name: 'email',
    label: 'Email',
    field: 'email',
    align: 'left',
    sortable: true
  },
  {
    name: 'actions',
    label: 'Actions',
    field: 'actions',
    align: 'center'
  }
])

const searchQuery = ref('')

const editUser = (user) => {
  // Edit user logic
}

const deleteUser = (user) => {
  // Delete user logic
}
</script>
```

### Quiz Interface
```vue
<template>
  <SectionCard title="Quiz Question">
    <div class="quiz-content">
      <h3 class="text-lg font-semibold mb-4">
        {{ currentQuestion.text }}
      </h3>
      
      <CSelect
        v-model="selectedAnswer"
        :options="currentQuestion.options"
        label="Select your answer"
        option-label="text"
        option-value="id"
        required
      />
      
      <div class="flex justify-between mt-6">
        <CTimer />
        
        <div class="space-x-2">
          <CBtn
            label="Skip"
            color="grey"
            outline
            @click="skipQuestion"
          />
          <CBtn
            label="Submit Answer"
            color="primary"
            :loading="submitting"
            :disabled="!selectedAnswer"
            @click="submitAnswer"
          />
        </div>
      </div>
    </div>
  </SectionCard>
</template>

<script setup lang="ts">
const currentQuestion = ref({
  id: 'q1',
  text: 'What is the capital of France?',
  options: [
    { id: 'a', text: 'London' },
    { id: 'b', text: 'Paris' },
    { id: 'c', text: 'Berlin' },
    { id: 'd', text: 'Madrid' }
  ]
})

const selectedAnswer = ref('')
const submitting = ref(false)

const submitAnswer = async () => {
  submitting.value = true
  try {
    await learningStore.submitQuiz({
      questionId: currentQuestion.value.id,
      selectedAnswer: selectedAnswer.value,
      sessionId: 'current-session'
    })
  } finally {
    submitting.value = false
  }
}

const skipQuestion = () => {
  // Skip logic
}
</script>
```

## Global Registration

All components are globally registered, so you don't need to import them:

```typescript
// In main.ts - components are auto-registered
import { createApp } from 'vue'
import { Quasar } from 'quasar'

// Components are automatically available in all templates
const app = createApp(App)
app.use(Quasar)
```

## TypeScript Support

All components include full TypeScript definitions:

```typescript
// Component props are fully typed
interface CInputProps {
  modelValue?: any
  label?: string
  type?: 'text' | 'email' | 'password' | 'date'
  required?: boolean
  rules?: ValidationRule[]
  hint?: string
  hideIcon?: boolean
}

// Events are typed too
interface CInputEmits {
  (event: 'update:modelValue', value: any): void
  (event: 'focus', event: FocusEvent): void
  (event: 'blur', event: FocusEvent): void
}
```

## Theming & Customization

Components respect Quasar's theming system:

```typescript
// quasar.config.js
module.exports = {
  framework: {
    config: {
      brand: {
        primary: '#3b82f6',
        secondary: '#1e40af',
        accent: '#10b981',
        dark: '#1f2937',
        'dark-page': '#111827',
        positive: '#10b981',
        negative: '#ef4444',
        info: '#3b82f6',
        warning: '#f59e0b'
      }
    }
  }
}
```

### Custom Styling

Components can be customized with Tailwind classes:

```vue
<template>
  <!-- Add custom classes while preserving component functionality -->
  <CInput
    v-model="value"
    label="Custom Input"
    class="my-custom-input"
    input-class="bg-blue-50 border-blue-200"
  />
</template>

<style scoped>
.my-custom-input {
  @apply rounded-lg shadow-md;
}
</style>
```

## Best Practices

### 1. Use Semantic Props
```vue
<!-- Good: Descriptive and clear -->
<CBtn
  label="Save Changes"
  color="primary"
  :loading="saving"
  tooltip="Save your progress"
/>

<!-- Avoid: Generic or unclear -->
<CBtn>Save</CBtn>
```

### 2. Leverage v-model
```vue
<!-- Good: Two-way binding -->
<CInput v-model="form.email" label="Email" />

<!-- Avoid: Manual event handling -->
<CInput
  :model-value="form.email"
  @update:model-value="form.email = $event"
/>
```

### 3. Include Validation
```vue
<!-- Good: Proper validation -->
<CInput
  v-model="form.email"
  label="Email"
  type="email"
  required
  :rules="[
    val => !!val || 'Email is required',
    val => /.+@.+\..+/.test(val) || 'Email must be valid'
  ]"
/>
```

### 4. Use Loading States
```vue
<!-- Good: User feedback -->
<CBtn
  label="Submit"
  :loading="submitting"
  @click="handleSubmit"
/>
```

### 5. Provide Accessibility
```vue
<!-- Good: Accessible form -->
<CInput
  v-model="password"
  label="Password"
  type="password"
  required
  hint="Password must be at least 8 characters"
  aria-describedby="password-requirements"
/>
```

## Performance Tips

### 1. Lazy Loading
```vue
<!-- For large forms, lazy load components -->
<script setup lang="ts">
const CAdvancedEditor = defineAsyncComponent(
  () => import('components/CAdvancedEditor.vue')
)
</script>
```

### 2. Memoization
```vue
<!-- Use computed for expensive operations -->
<script setup lang="ts">
const processedOptions = computed(() => {
  return expensiveOptionProcessing(rawOptions.value)
})
</script>
```

### 3. Virtual Scrolling
```vue
<!-- For large datasets -->
<APITable
  :columns="columns"
  api-endpoint="/api/v1/large-dataset"
  virtual-scroll
  :rows-per-page-options="[50, 100, 200]"
/>
```

## Migration Guide

### From Quasar Components
```vue
<!-- Before: Direct Quasar usage -->
<q-input
  v-model="text"
  outlined
  dense
  label="Input"
/>

<!-- After: Using Crackingo components -->
<CInput
  v-model="text"
  label="Input"
/>
```

### From Custom Components
```vue
<!-- Before: Custom implementation -->
<div class="form-group">
  <label>Name</label>
  <input v-model="name" />
</div>

<!-- After: Using form control -->
<CInput v-model="name" label="Name" />
```

## Contributing

Want to contribute to the component library?

1. **Follow naming conventions** (C* for custom, S* for shared)
2. **Include TypeScript definitions** for all props and events
3. **Add comprehensive documentation** with examples
4. **Write unit tests** for component functionality
5. **Ensure accessibility** compliance

### Component Template
```vue
<template>
  <SFormControl :label="label" :required="required">
    <!-- Your component implementation -->
  </SFormControl>
</template>

<script setup lang="ts">
interface Props {
  label?: string
  required?: boolean
  // Add your props here
}

const props = withDefaults(defineProps<Props>(), {
  required: false
})

const modelValue = defineModel<any>('modelValue')

// Add your component logic
</script>
```

## What's Next?

- 📖 **[Individual Component Docs](/components/cinput)** - Detailed component documentation
- 🎨 **[Design Principles](/components/design-principles)** - Learn our design philosophy
- 📝 **[Usage Guidelines](/components/usage-guidelines)** - Best practices for component usage
- 🧪 **[Testing Components](/guide/testing)** - How to test your components

Ready to build amazing interfaces with Crackingo components? Start exploring! 🚀