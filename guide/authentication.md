# Authentication System

Cracingo provides a comprehensive authentication system with multiple sign-in methods, secure token management, and seamless user experience.

## 🔐 Overview

The authentication system handles user registration, login, verification, and password management with support for both traditional email/password and Google OAuth authentication.

### Key Features

- **Multi-provider Authentication** - Email/password and Google OAuth
- **Account Verification** - Email-based OTP verification
- **Password Recovery** - Secure password reset flow
- **Token Management** - JWT-based authentication with automatic renewal
- **Persistent Sessions** - Secure session persistence across browser sessions

## 🚀 Quick Start

### Basic Login Implementation

```vue
<template>
  <SForm @submit="handleLogin">
    <CInput 
      v-model="credentials.email" 
      type="email" 
      label="Email Address" 
      :rules="emailRules"
      required 
    />
    
    <CInput 
      v-model="credentials.password" 
      type="password" 
      label="Password" 
      :rules="passwordRules"
      required 
    />
    
    <CBtn 
      type="submit" 
      :loading="loading" 
      class="w-full"
    >
      Sign In
    </CBtn>
  </SForm>
</template>

<script setup lang="ts">
import { useAccountStore } from 'stores/accountStore'
import { useRouter } from 'vue-router'

const accountStore = useAccountStore()
const router = useRouter()

const credentials = ref({
  email: '',
  password: ''
})

const loading = ref(false)

const handleLogin = async () => {
  loading.value = true
  try {
    await accountStore.login(credentials.value)
    router.push({ name: 'dashboard' })
  } catch (error) {
    // Error handling is done in the store
  } finally {
    loading.value = false
  }
}

const emailRules = [
  (val: string) => !!val || 'Email is required',
  (val: string) => /.+@.+\..+/.test(val) || 'Invalid email format'
]

const passwordRules = [
  (val: string) => !!val || 'Password is required',
  (val: string) => val.length >= 6 || 'Password must be at least 6 characters'
]
</script>
```

## 🔑 Authentication Methods

### Email & Password Authentication

```typescript
// Login with email and password
const loginData = {
  email: 'user@example.com',
  password: 'securePassword123'
}

await accountStore.login(loginData)
```

### Google OAuth Integration

```vue
<template>
  <CBtn 
    @click="handleGoogleSignIn"
    color="white"
    text-color="grey-8"
    class="w-full border"
  >
    <q-icon name="fab fa-google" class="mr-2" />
    Continue with Google
  </CBtn>
</template>

<script setup lang="ts">
const handleGoogleSignIn = async () => {
  try {
    // Initialize Google OAuth (implementation depends on your setup)
    const googleToken = await getGoogleAuthToken()
    
    await accountStore.loginWithGoogle({ token: googleToken })
    router.push({ name: 'dashboard' })
  } catch (error) {
    console.error('Google sign-in failed:', error)
  }
}
</script>
```

## 📧 Account Verification

### Registration with Email Verification

```vue
<template>
  <div class="registration-flow">
    <!-- Step 1: Registration Form -->
    <SForm v-if="step === 'register'" @submit="handleRegister">
      <CInput v-model="userData.name" label="Full Name" required />
      <CInput v-model="userData.email" type="email" label="Email" required />
      <CInput v-model="userData.password" type="password" label="Password" required />
      <CBtn type="submit" :loading="loading">Create Account</CBtn>
    </SForm>
    
    <!-- Step 2: OTP Verification -->
    <div v-else-if="step === 'verify'" class="text-center">
      <h3>Verify Your Email</h3>
      <p class="text-grey-6 mb-4">
        We've sent a verification code to {{ userData.email }}
      </p>
      
      <COtpInput 
        v-model="otpCode" 
        :length="6" 
        auto-focus
        @complete="handleVerification"
      />
      
      <div class="mt-4">
        <CBtn 
          @click="resendCode" 
          :loading="resending"
          flat
          color="primary"
        >
          Resend Code
        </CBtn>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const step = ref<'register' | 'verify'>('register')
const userData = ref({
  name: '',
  email: '',
  password: ''
})
const otpCode = ref('')
const loading = ref(false)
const resending = ref(false)

const handleRegister = async () => {
  loading.value = true
  try {
    await accountStore.registerUser(userData.value)
    step.value = 'verify'
  } finally {
    loading.value = false
  }
}

const handleVerification = async (code: string) => {
  try {
    await accountStore.verifyAccount(userData.value.email, code)
    router.push({ name: 'dashboard' })
  } catch (error) {
    otpCode.value = '' // Clear invalid code
  }
}

const resendCode = async () => {
  resending.value = true
  try {
    await accountStore.resendVerificationEmail(userData.value.email)
  } finally {
    resending.value = false
  }
}
</script>
```

## 🔄 Password Management

### Password Reset Flow

```vue
<template>
  <div class="password-reset">
    <!-- Step 1: Request Reset -->
    <SForm v-if="step === 'request'" @submit="requestReset">
      <h3>Reset Password</h3>
      <p class="text-grey-6 mb-4">
        Enter your email address and we'll send you a reset link.
      </p>
      
      <CInput 
        v-model="email" 
        type="email" 
        label="Email Address"
        :rules="emailRules"
        required 
      />
      
      <CBtn type="submit" :loading="loading" class="w-full">
        Send Reset Link
      </CBtn>
    </SForm>
    
    <!-- Step 2: Reset Confirmation -->
    <div v-else class="text-center">
      <q-icon name="email" size="4rem" color="primary" class="mb-4" />
      <h3>Check Your Email</h3>
      <p class="text-grey-6">
        We've sent a password reset link to {{ email }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
const step = ref<'request' | 'sent'>('request')
const email = ref('')
const loading = ref(false)

const requestReset = async () => {
  loading.value = true
  try {
    await accountStore.forgotPassword(email.value)
    step.value = 'sent'
  } finally {
    loading.value = false
  }
}
</script>
```

### Password Update (Authenticated Users)

```vue
<template>
  <SectionCard title="Change Password">
    <SForm @submit="updatePassword">
      <CInput 
        v-model="passwordData.currentPassword" 
        type="password" 
        label="Current Password"
        required 
      />
      
      <CInput 
        v-model="passwordData.newPassword" 
        type="password" 
        label="New Password"
        :rules="passwordRules"
        required 
      />
      
      <CInput 
        v-model="passwordData.confirmPassword" 
        type="password" 
        label="Confirm New Password"
        :rules="confirmPasswordRules"
        required 
      />
      
      <CBtn type="submit" :loading="updating">
        Update Password
      </CBtn>
    </SForm>
  </SectionCard>
</template>

<script setup lang="ts">
const passwordData = ref({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

const updating = ref(false)

const updatePassword = async () => {
  updating.value = true
  try {
    await accountStore.updatePassword({
      currentPassword: passwordData.value.currentPassword,
      newPassword: passwordData.value.newPassword
    })
    
    // Reset form
    passwordData.value = {
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    }
    
    // Show success message
    $q.notify({
      type: 'positive',
      message: 'Password updated successfully'
    })
  } finally {
    updating.value = false
  }
}

const passwordRules = [
  (val: string) => !!val || 'Password is required',
  (val: string) => val.length >= 8 || 'Password must be at least 8 characters',
  (val: string) => /[A-Z]/.test(val) || 'Password must contain uppercase letter',
  (val: string) => /[0-9]/.test(val) || 'Password must contain a number'
]

const confirmPasswordRules = [
  (val: string) => !!val || 'Please confirm your password',
  (val: string) => val === passwordData.value.newPassword || 'Passwords do not match'
]
</script>
```

## 🛡️ Authentication Guards

### Route Protection

```typescript
// router/guards/authGuard.ts
import { useAccountStore } from 'stores/accountStore'

export function authGuard(to: any, from: any, next: any) {
  const accountStore = useAccountStore()
  
  if (to.meta.requiresAuth && !accountStore.accessToken) {
    next({
      name: 'login',
      query: { redirect: to.fullPath }
    })
    return
  }
  
  if (to.meta.requiresGuest && accountStore.accessToken) {
    next({ name: 'dashboard' })
    return
  }
  
  next()
}
```

### Component-level Protection

```vue
<script setup lang="ts">
import { useAccountStore } from 'stores/accountStore'
import { useRouter } from 'vue-router'

const accountStore = useAccountStore()
const router = useRouter()

// Redirect if not authenticated
if (!accountStore.accessToken) {
  router.push({ name: 'login' })
}

// Check specific permissions
const hasAdminAccess = computed(() => 
  accountStore.user.role === 'admin'
)
</script>
```

## 📱 User Session Management

### Automatic Token Refresh

```typescript
// utils/tokenManager.ts
class TokenManager {
  private refreshTimer: NodeJS.Timeout | null = null
  
  setupAutoRefresh(token: string) {
    // Decode JWT to get expiration
    const payload = JSON.parse(atob(token.split('.')[1]))
    const expiresIn = (payload.exp * 1000) - Date.now() - 60000 // Refresh 1 min before expiry
    
    this.refreshTimer = setTimeout(async () => {
      try {
        await this.refreshToken()
      } catch (error) {
        // Redirect to login if refresh fails
        window.location.href = '/login'
      }
    }, expiresIn)
  }
  
  clearAutoRefresh() {
    if (this.refreshTimer) {
      clearTimeout(this.refreshTimer)
      this.refreshTimer = null
    }
  }
  
  private async refreshToken() {
    // Implementation depends on your backend
    const response = await api.post('/auth/refresh')
    const newToken = response.data.access_token
    
    const accountStore = useAccountStore()
    accountStore.accessToken = newToken
    
    this.setupAutoRefresh(newToken)
  }
}

export const tokenManager = new TokenManager()
```

### Logout Implementation

```typescript
// Complete logout with cleanup
const logout = async () => {
  try {
    // Call logout endpoint if needed
    await api.post('/auth/logout')
  } catch (error) {
    // Continue with local cleanup even if API fails
  } finally {
    // Clear store
    accountStore.$reset()
    
    // Clear local storage
    localStorage.removeItem('access_token')
    
    // Clear token refresh timer
    tokenManager.clearAutoRefresh()
    
    // Redirect to login
    router.push({ name: 'login' })
  }
}
```

## 🔒 Security Best Practices

### Input Validation

```typescript
// Validation rules for security
export const securityRules = {
  email: [
    (val: string) => !!val || 'Email is required',
    (val: string) => /.+@.+\..+/.test(val) || 'Invalid email format',
    (val: string) => val.length <= 255 || 'Email too long'
  ],
  
  password: [
    (val: string) => !!val || 'Password is required',
    (val: string) => val.length >= 8 || 'Minimum 8 characters required',
    (val: string) => val.length <= 128 || 'Password too long',
    (val: string) => /[A-Z]/.test(val) || 'Must contain uppercase letter',
    (val: string) => /[a-z]/.test(val) || 'Must contain lowercase letter',
    (val: string) => /[0-9]/.test(val) || 'Must contain number',
    (val: string) => /[!@#$%^&*]/.test(val) || 'Must contain special character'
  ]
}
```

### Rate Limiting

```typescript
// Client-side rate limiting for auth attempts
class AuthRateLimiter {
  private attempts = new Map<string, number>()
  private lastAttempt = new Map<string, number>()
  
  canAttempt(identifier: string): boolean {
    const now = Date.now()
    const attempts = this.attempts.get(identifier) || 0
    const lastTime = this.lastAttempt.get(identifier) || 0
    
    // Reset after 15 minutes
    if (now - lastTime > 15 * 60 * 1000) {
      this.attempts.set(identifier, 0)
      return true
    }
    
    return attempts < 5 // Max 5 attempts
  }
  
  recordAttempt(identifier: string) {
    const attempts = this.attempts.get(identifier) || 0
    this.attempts.set(identifier, attempts + 1)
    this.lastAttempt.set(identifier, Date.now())
  }
}
```

The authentication system provides a secure, user-friendly experience while maintaining high security standards and flexibility for different authentication needs.