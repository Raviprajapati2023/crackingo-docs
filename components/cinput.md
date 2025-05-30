# CInput

Enhanced input component that wraps Quasar's QInput with additional features like automatic password visibility toggle, built-in date picker, and integrated form validation.

## Basic Usage

```vue
<template>
  <CInput
    v-model="email"
    label="Email Address"
    type="email"
    placeholder="Enter your email"
  />
</template>

<script setup lang="ts">
const email = ref('')
</script>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `modelValue` | `any` | `undefined` | The input value (v-model) |
| `label` | `string` | `undefined` | Input label text |
| `type` | `string` | `'text'` | Input type (text, email, password, date, etc.) |
| `placeholder` | `string` | `undefined` | Placeholder text |
| `required` | `boolean` | `false` | Mark field as required |
| `readonly` | `boolean` | `false` | Make input read-only |
| `disabled` | `boolean` | `false` | Disable the input |
| `rules` | `ValidationRule[]` | `[]` | Validation rules array |
| `hint` | `string` | `undefined` | Helper text below input |
| `hideIcon` | `boolean` | `false` | Hide password toggle icon |
| `dateOptions` | `function` | `undefined` | Date picker options function |
| `mask` | `string` | `undefined` | Input mask pattern |
| `error` | `boolean` | `false` | Show error state |
| `errorMessage` | `string` | `undefined` | Error message text |

## Events

| Event | Payload | Description |
|-------|---------|-------------|
| `update:modelValue` | `any` | Emitted when value changes |
| `focus` | `FocusEvent` | Emitted when input gains focus |
| `blur` | `FocusEvent` | Emitted when input loses focus |
| `keyup` | `KeyboardEvent` | Emitted on key release |
| `enter` | `KeyboardEvent` | Emitted when Enter key is pressed |

## Slots

| Slot | Description |
|------|-------------|
| `prepend` | Content before the input field |
| `append` | Content after the input field (replaces default icons) |

## Features

### Password Toggle
Automatically shows/hides password visibility toggle for password inputs:

```vue
<template>
  <CInput
    v-model="password"
    label="Password"
    type="password"
    hint="Password must be at least 8 characters"
  />
</template>
```

### Date Picker
Built-in date picker for date type inputs:

```vue
<template>
  <CInput
    v-model="birthDate"
    label="Birth Date"
    type="date"
    :date-options="dateOptions"
  />
</template>

<script setup lang="ts">
const birthDate = ref('')

// Restrict selectable dates
const dateOptions = (date: string) => {
  const today = new Date()
  const selected = new Date(date)
  return selected <= today // Only past dates allowed
}
</script>
```

### Input Validation
Integrate with form validation rules:

```vue
<template>
  <CInput
    v-model="email"
    label="Email Address"
    type="email"
    required
    :rules="emailRules"
    hint="We'll never share your email"
  />
</template>

<script setup lang="ts">
const email = ref('')

const emailRules = [
  (val: string) => !!val || 'Email is required',
  (val: string) => /.+@.+\..+/.test(val) || 'Email must be valid',
  (val: string) => val.length <= 100 || 'Email must be less than 100 characters'
]
</script>
```

### Input Masking
Apply input masks for formatted data entry:

```vue
<template>
  <CInput
    v-model="phone"
    label="Phone Number"
    mask="(###) ###-####"
    placeholder="(555) 123-4567"
  />
</template>
```

## Examples

### Basic Text Input
```vue
<template>
  <CInput
    v-model="firstName"
    label="First Name"
    placeholder="Enter your first name"
    required
  />
</template>

<script setup lang="ts">
const firstName = ref('')
</script>
```

### Email Input with Validation
```vue
<template>
  <CInput
    v-model="userEmail"
    label="Email Address"
    type="email"
    required
    :rules="[
      val => !!val || 'Email is required',
      val => /.+@.+\..+/.test(val) || 'Please enter a valid email'
    ]"
    hint="Used for account verification"
  />
</template>

<script setup lang="ts">
const userEmail = ref('')
</script>
```

### Password Input
```vue
<template>
  <CInput
    v-model="userPassword"
    label="Password"
    type="password"
    required
    :rules="passwordRules"
    hint="Must contain at least 8 characters"
  />
</template>

<script setup lang="ts">
const userPassword = ref('')

const passwordRules = [
  (val: string) => !!val || 'Password is required',
  (val: string) => val.length >= 8 || 'Password must be at least 8 characters',
  (val: string) => /[A-Z]/.test(val) || 'Password must contain uppercase letter',
  (val: string) => /[0-9]/.test(val) || 'Password must contain a number'
]
</script>
```

### Date Input with Restrictions
```vue
<template>
  <CInput
    v-model="appointmentDate"
    label="Appointment Date"
    type="date"
    :date-options="isWeekday"
    required
  />
</template>

<script setup lang="ts">
const appointmentDate = ref('')

// Only allow weekdays for appointments
const isWeekday = (date: string) => {
  const day = new Date(date).getDay()
  return day !== 0 && day !== 6 // Not Sunday (0) or Saturday (6)
}
</script>
```

### Textarea Input
```vue
<template>
  <CInput
    v-model="description"
    label="Description"
    type="textarea"
    :rows="4"
    placeholder="Enter a detailed description..."
    counter
    maxlength="500"
  />
</template>

<script setup lang="ts">
const description = ref('')
</script>
```

### Number Input with Formatting
```vue
<template>
  <CInput
    v-model.number="price"
    label="Price"
    type="number"
    :min="0"
    :step="0.01"
    prefix="$"
    hint="Enter price in USD"
  />
</template>

<script setup lang="ts">
const price = ref(0)
</script>
```

### Input with Custom Slots
```vue
<template>
  <CInput
    v-model="searchQuery"
    label="Search"
    placeholder="Search for products..."
  >
    <template #prepend>
      <q-icon name="search" />
    </template>
    
    <template #append>
      <CBtn
        icon="clear"
        flat
        round
        dense
        @click="clearSearch"
        v-if="searchQuery"
      />
    </template>
  </CInput>
</template>

<script setup lang="ts">
const searchQuery = ref('')

const clearSearch = () => {
  searchQuery.value = ''
}
</script>
```

### Readonly Input for Display
```vue
<template>
  <CInput
    v-model="userId"
    label="User ID"
    readonly
    hint="This value is automatically generated"
  />
</template>

<script setup lang="ts">
const userId = ref('USR-12345')
</script>
```

## Advanced Usage

### Custom Validation with Async Rules
```vue
<template>
  <CInput
    v-model="username"
    label="Username"
    :rules="usernameRules"
    :loading="checkingUsername"
    debounce="500"
  />
</template>

<script setup lang="ts">
const username = ref('')
const checkingUsername = ref(false)

const usernameRules = [
  (val: string) => !!val || 'Username is required',
  (val: string) => val.length >= 3 || 'Username must be at least 3 characters',
  async (val: string) => {
    if (val.length < 3) return true
    
    checkingUsername.value = true
    try {
      const available = await checkUsernameAvailability(val)
      return available || 'Username is already taken'
    } finally {
      checkingUsername.value = false
    }
  }
]

const checkUsernameAvailability = async (username: string) => {
  // API call to check username availability
  const response = await api.get(`/users/check-username?username=${username}`)
  return response.data.available
}
</script>
```

### Dynamic Input Type
```vue
<template>
  <div>
    <CSelect
      v-model="inputType"
      :options="typeOptions"
      label="Input Type"
    />
    
    <CInput
      v-model="dynamicValue"
      label="Dynamic Input"
      :type="inputType"
      :rules="getDynamicRules(inputType)"
    />
  </div>
</template>

<script setup lang="ts">
const inputType = ref('text')
const dynamicValue = ref('')

const typeOptions = [
  { label: 'Text', value: 'text' },
  { label: 'Email', value: 'email' },
  { label: 'Number', value: 'number' },
  { label: 'Date', value: 'date' }
]

const getDynamicRules = (type: string) => {
  switch (type) {
    case 'email':
      return [(val: string) => /.+@.+\..+/.test(val) || 'Invalid email']
    case 'number':
      return [(val: string) => !isNaN(Number(val)) || 'Must be a number']
    default:
      return []
  }
}
</script>
```

## Styling

The component respects Quasar's theming and can be customized:

```vue
<template>
  <CInput
    v-model="styledInput"
    label="Custom Styled Input"
    class="custom-input"
    input-class="text-blue-600"
    label-color="primary"
  />
</template>

<style scoped>
.custom-input {
  @apply rounded-lg border-2 border-blue-200;
}

.custom-input:focus-within {
  @apply border-blue-500 shadow-lg;
}
</style>
```

## Accessibility

CInput includes built-in accessibility features:

- **ARIA Labels**: Proper labeling for screen readers
- **Keyboard Navigation**: Full keyboard support
- **Focus Management**: Clear focus indicators
- **Error Announcements**: Screen reader error notifications

```vue
<template>
  <CInput
    v-model="accessibleInput"
    label="Accessible Input"
    aria-describedby="input-help"
    required
  />
  <div id="input-help" class="sr-only">
    This field is required and must contain valid data
  </div>
</template>
```

## Best Practices

### ✅ Do
- Use descriptive labels for all inputs
- Provide helpful hints for complex fields
- Include appropriate validation rules
- Use proper input types for better UX
- Handle loading states for async validation

### ❌ Don't
- Use placeholder text as labels
- Skip validation for user inputs
- Use generic error messages
- Forget to handle edge cases
- Make inputs too wide on desktop

## Related Components

- **[CSelect](/components/cselect)** - For dropdown selections
- **[CEditor](/components/ceditor)** - For rich text editing
- **[SFormControl](/components/sformcontrol)** - For custom form controls
- **[SForm](/components/sform)** - For form validation and submission

## Migration from QInput

```vue
<!-- Before: Quasar QInput -->
<q-input
  v-model="text"
  outlined
  dense
  label="Input"
  :rules="[val => !!val || 'Required']"
/>

<!-- After: Crackingo CInput -->
<CInput
  v-model="text"
  label="Input"
  :rules="[val => !!val || 'Required']"
/>
```

The main differences:
- `outlined` and `dense` are defaults in CInput
- Built-in form control wrapper with consistent styling
- Enhanced password and date input handling
- Improved accessibility features