# Getting Started

Welcome to Crackingo! This guide will help you set up and start using the AI-powered learning platform in just a few minutes.

## Prerequisites

Before you begin, ensure you have the following installed on your system:

### Required Software
- **Node.js** (version 18.0 or higher)
- **npm** (version 8.0 or higher) or **yarn** (version 1.22 or higher)
- **Git** (for version control)

### Recommended Tools
- **VS Code** with Vue.js extensions
- **Vue DevTools** browser extension
- **Postman** or similar API testing tool

::: tip System Requirements
- **OS**: Windows 10+, macOS 10.15+, or Linux (Ubuntu 18.04+)
- **RAM**: Minimum 4GB, recommended 8GB+
- **Storage**: At least 2GB free space for dependencies
:::

## Quick Installation

### 1. Clone the Repository

```bash
# Clone the project
git clone https://github.com/your-username/crackingo.git

# Navigate to project directory
cd crackingo
```

### 2. Install Dependencies

::: code-group

```bash [npm]
npm install
```

```bash [yarn]
yarn install
```

```bash [pnpm]
pnpm install
```

:::

### 3. Environment Setup

Create a `.env` file in the root directory:

```bash
# Copy the example environment file
cp .env.example .env
```

Configure your environment variables:

```env
# Application Configuration
VITE_APP_NAME=Crackingo
VITE_APP_ENV=development
VITE_APP_DEBUG=true

# API Configuration
VITE_API_BASE_URL=http://localhost:3000/api/v1
VITE_API_TIMEOUT=30000

# Authentication
VITE_JWT_SECRET=your-jwt-secret-key
VITE_GOOGLE_CLIENT_ID=your-google-client-id

# Database (if running locally)
DATABASE_URL=postgresql://username:password@localhost:5432/crackingo

# External Services
VITE_ANALYTICS_ID=your-analytics-id
VITE_SENTRY_DSN=your-sentry-dsn
```

### 4. Start Development Server

```bash
# Start the development server
npm run dev

# Or with yarn
yarn dev
```

Your application will be available at `http://localhost:9000`

## Project Structure

Once installed, your project structure will look like this:

```
crackingo/
├── public/                 # Static assets
│   ├── icons/             # App icons
│   └── favicon.ico
├── src/
│   ├── assets/            # Images, fonts, etc.
│   ├── boot/              # Quasar boot files
│   │   ├── axios.ts       # HTTP client setup
│   │   └── pinia.ts       # State management
│   ├── components/        # Vue components
│   │   ├── custom/        # Custom components (C*)
│   │   ├── shared/        # Shared components (S*)
│   │   └── layout/        # Layout components
│   ├── composables/       # Vue composables
│   ├── constants/         # App constants
│   │   ├── endpoint.ts    # API endpoints
│   │   └── urls.ts        # Route URLs
│   ├── layouts/           # Page layouts
│   ├── pages/             # Page components
│   │   ├── auth/          # Authentication pages
│   │   ├── dashboard/     # Dashboard pages
│   │   ├── learning/      # Learning module pages
│   │   └── quiz/          # Quiz pages
│   ├── router/            # Vue Router configuration
│   ├── stores/            # Pinia stores
│   │   ├── accountStore.ts
│   │   └── learningStore.ts
│   ├── types/             # TypeScript definitions
│   ├── utils/             # Utility functions
│   ├── App.vue            # Root component
│   └── main.ts            # Application entry point
├── .env.example           # Environment variables template
├── package.json           # Dependencies and scripts
├── quasar.config.js       # Quasar configuration
├── tsconfig.json          # TypeScript configuration
└── vite.config.ts         # Vite configuration
```

## First Steps

### 1. Explore the Dashboard

Navigate to `http://localhost:9000` and you'll see the main dashboard. The interface includes:

- **Navigation Bar**: Access to different sections
- **Learning Modules**: Available courses and lessons
- **Progress Tracking**: Your learning statistics
- **Quick Actions**: Common tasks and shortcuts

### 2. Authentication Flow

Test the authentication system:

```typescript
// Example: Login with email/password
const loginData = {
  email: 'demo@crackingo.com',
  password: 'demo123'
}

// The login will be handled by accountStore
await accountStore.login(loginData)
```

### 3. Create Your First Quiz

Use the component library to create interactive content:

```vue
<template>
  <div class="quiz-container">
    <SectionCard title="Sample Quiz">
      <CInput
        v-model="userAnswer"
        label="What is 2 + 2?"
        placeholder="Enter your answer"
      />
      
      <CBtn
        label="Submit Answer"
        color="primary"
        @click="submitAnswer"
        :loading="submitting"
      />
    </SectionCard>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useLearningStore } from 'src/stores/learningStore'

const learningStore = useLearningStore()
const userAnswer = ref('')
const submitting = ref(false)

const submitAnswer = async () => {
  submitting.value = true
  try {
    await learningStore.submitQuiz({
      sessionId: 'demo-session',
      selectedAnswer: userAnswer.value,
      questionId: 'q1'
    })
  } finally {
    submitting.value = false
  }
}
</script>
```

## Development Workflow

### Available Scripts

::: code-group

```bash [Development]
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

```bash [Testing]
# Run unit tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run e2e tests
npm run test:e2e
```

```bash [Code Quality]
# Lint code
npm run lint

# Format code
npm run format

# Type check
npm run type-check
```

:::

### Git Workflow

We follow the Git Flow branching model:

```bash
# Create feature branch
git checkout -b feature/new-learning-module

# Make your changes
git add .
git commit -m "feat: add new learning module component"

# Push to remote
git push origin feature/new-learning-module

# Create pull request on GitHub
```

### Commit Convention

We use conventional commits for clear history:

```bash
# Feature
git commit -m "feat: add quiz retry functionality"

# Bug fix
git commit -m "fix: resolve login authentication issue"

# Documentation
git commit -m "docs: update component usage guide"

# Refactor
git commit -m "refactor: optimize quiz submission logic"
```

## Development Tips

### Hot Module Replacement (HMR)

Crackingo supports hot reloading for instant development feedback:

- **Components**: Changes reflect immediately
- **Stores**: State persists during updates
- **Styles**: Live style updates
- **Types**: Automatic type checking

### Debugging Tools

Enable debugging in development:

```typescript
// In main.ts
if (process.env.DEV) {
  // Enable Vue DevTools
  app.config.performance = true
  
  // Console logging for stores
  app.config.globalProperties.$log = console.log
}
```

### Performance Monitoring

Monitor your app's performance:

```typescript
// Performance tracking
import { useQuasar } from 'quasar'

const $q = useQuasar()

// Track loading times
console.time('component-load')
// ... component logic
console.timeEnd('component-load')
```

## Troubleshooting

### Common Issues

::: details Node version mismatch
**Problem**: `Error: The engine "node" is incompatible`

**Solution**: 
```bash
# Update Node.js to version 18+
nvm install 18
nvm use 18
```
:::

::: details Port already in use
**Problem**: `Error: Port 9000 is already in use`

**Solution**:
```bash
# Kill process on port 9000
npx kill-port 9000

# Or use different port
npm run dev -- --port 3000
```
:::

::: details TypeScript errors
**Problem**: Type errors in IDE

**Solution**:
```bash
# Restart TypeScript server in VS Code
Cmd/Ctrl + Shift + P -> "TypeScript: Restart TS Server"

# Or rebuild types
npm run type-check
```
:::

### Getting Help

If you encounter issues:

1. **Check the [FAQ](/guide/faq)** for common solutions
2. **Search [GitHub Issues](https://github.com/your-username/crackingo/issues)**
3. **Join our [Discord Community](https://discord.gg/crackingo)**
4. **Email support** at support@crackingo.com

## Next Steps

Now that you have Crackingo running locally, explore these areas:

- 📖 **[Component Library](/components/overview)** - Learn about available UI components
- 🏗️ **[Architecture Guide](/guide/project-structure)** - Understand the project structure
- 🔌 **[API Integration](/guide/api-integration)** - Connect with backend services
- 🎯 **[Learning System](/guide/learning-system)** - Build educational content
- 🧪 **[Testing Guide](/guide/testing)** - Write tests for your features

Ready to build amazing learning experiences? Let's get started! 🚀