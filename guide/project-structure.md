# Project Structure

Cracingo follows a well-organized Vue 3 + Quasar + TypeScript architecture with global component registration and Pinia for state management.

## 📁 Directory Overview

```
cracingo/
├── src/
│   ├── components/           # Global UI Components
│   │   ├── forms/           # Form-related components
│   │   │   ├── CInput.vue   # Custom input with date/password support
│   │   │   ├── CSelect.vue  # Enhanced select with multi-select
│   │   │   ├── CFile.vue    # File upload component
│   │   │   ├── CEditor.vue  # Rich text editor
│   │   │   ├── CTagsInput.vue # Tags input component
│   │   │   ├── COtpInput.vue # OTP verification input
│   │   │   └── CUploader.vue # Drag & drop file uploader
│   │   ├── ui/              # UI components
│   │   │   ├── CBtn.vue     # Enhanced button with tooltip
│   │   │   ├── CDialog.vue  # Modal dialog component
│   │   │   ├── CTable.vue   # Data table component
│   │   │   ├── CTimer.vue   # Timer component
│   │   │   └── CTooltip.vue # Tooltip component
│   │   ├── layout/          # Layout components
│   │   │   ├── CBreadcrumbs.vue # Breadcrumb navigation
│   │   │   ├── SectionCard.vue  # Section wrapper card
│   │   │   └── SMenu.vue        # Context menu
│   │   └── shared/          # Shared base components
│   │       ├── SForm.vue    # Base form wrapper
│   │       ├── SFormControl.vue # Form control wrapper
│   │       ├── SCheckbox.vue    # Base checkbox
│   │       ├── SAvatar.vue      # Avatar component
│   │       ├── SDialog.vue      # Base dialog
│   │       └── STimer.vue       # Simple timer
│   ├── stores/              # Pinia stores
│   │   └── accountStore.ts  # Account & authentication state
│   ├── types/               # TypeScript type definitions
│   │   ├── authentication.types.ts
│   │   ├── user.types.ts
│   │   └── base.types.ts
│   ├── constants/           # Application constants
│   │   └── endpoint.ts      # API endpoints
│   ├── utils/               # Utility functions
│   │   └── ui-utils.ts      # UI helper functions
│   └── boot/                # Quasar boot files
│       └── axios.ts         # API client configuration
```

## 🧩 Component Architecture

### Component Naming Convention

Our components follow a clear naming pattern:

- **C-prefixed components**: Custom wrapper components (`CInput`, `CBtn`, `CDialog`)
- **S-prefixed components**: Shared/base components (`SForm`, `SFormControl`, `SAvatar`)
- **Descriptive names**: Self-explanatory component purposes (`APITable`, `QMenuHover`)

### Component Categories

#### 🎨 **Form Components**
Enhanced form controls with built-in validation and styling:

```vue
<!-- Input with automatic masking and date picker -->
<CInput v-model="date" type="date" label="Select Date" />

<!-- Multi-select with checkboxes -->
<CSelect v-model="selected" :options="options" multiple />

<!-- Rich text editor -->
<CEditor v-model="content" label="Description" />

<!-- File uploader with compression -->
<CUploader v-model="file" accept="image/*" />
```

#### 🔧 **UI Components**
Reusable interface elements:

```vue
<!-- Enhanced button with tooltip -->
<CBtn color="primary" tooltip="Save changes">Save</CBtn>

<!-- Modal dialog with form integration -->
<CDialog v-model="showDialog" title="Edit Item" @save="handleSave" />

<!-- Data table with server-side pagination -->
<CTable :columns="columns" :rows="rows" @request="onRequest" />
```

#### 📊 **Data Components**
Components for displaying and managing data:

```vue
<!-- Server-side paginated table -->
<APITable 
  api-endpoint="/api/users" 
  :columns="userColumns"
  :search-fields="['name', 'email']"
/>
```

## 🏗️ Global Registration

All components are globally registered, eliminating the need for imports:

```typescript
// No imports needed! Use components directly
<template>
  <SForm @submit="handleSubmit">
    <CInput v-model="name" label="Name" required />
    <CSelect v-model="category" :options="categories" />
    <CBtn type="submit">Submit</CBtn>
  </SForm>
</template>
```

## 🎯 Design Principles

### **Composition Over Configuration**
Components are designed to work together seamlessly:

```vue
<SFormControl label="User Info" required>
  <CInput v-model="user.name" placeholder="Enter name" />
</SFormControl>
```

### **TypeScript Integration**
Full TypeScript support with proper type definitions:

```typescript
interface UserFormData {
  name: string
  email: string
  avatar: File | null
}

const formData = ref<UserFormData>({
  name: '',
  email: '',
  avatar: null
})
```

### **Quasar Foundation**
Built on top of Quasar components for consistency and performance:

```vue
<!-- CInput extends QInput with additional features -->
<CInput 
  v-model="password" 
  type="password"
  :rules="[val => !!val || 'Password required']"
/>
```

## 🔄 Component Lifecycle

### **Form Handling**
Standardized form validation and submission:

```vue
<SForm @submit="onSubmit" ref="formRef">
  <CInput v-model="data.name" :rules="nameRules" />
  <CBtn type="submit" :loading="submitting">Save</CBtn>
</SForm>
```

### **State Management Integration**
Components work seamlessly with Pinia stores:

```vue
<script setup>
import { useAccountStore } from 'stores/accountStore'

const accountStore = useAccountStore()
const { user, login } = accountStore
</script>
```

## 🎨 Styling Approach

### **Tailwind + Quasar**
Combination of utility classes and Quasar theming:

```vue
<template>
  <div class="bg-white shadow-sm p-4 rounded-lg">
    <CBtn color="primary" class="w-full">Full Width Button</CBtn>
  </div>
</template>
```

### **Responsive Design**
Mobile-first approach with responsive utilities:

```vue
<CEditor :dense="$q.screen.lt.md" />
```

This structure ensures maintainability, reusability, and developer experience while leveraging the power of Quasar and Vue 3's Composition API.