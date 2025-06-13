---
# https://vitepress.dev/reference/default-theme-home-page
layout: home

hero:
  name: "Crackingo"
  text: "AI-Powered Learning Platform"
  tagline: Transform your learning experience with interactive AI-driven education. Master skills faster with personalized quizzes, real-time feedback, and gamified progress tracking.
  image:
    src: /img/icon_blue.png
    alt: Crackingo Logo
  actions:
    - theme: brand
      text: Get Started
      link: /guide/getting-started
    
features:
  - icon: 🎯
    title: Interactive Learning
    details: Engage with dynamic quizzes, real-time feedback, and adaptive content that adjusts to your learning pace.
  
  - icon: 🤖
    title: AI-Powered
    details: Leverage artificial intelligence for personalized learning paths, intelligent content recommendations, and smart progress tracking.
  
  - icon: 🏆
    title: Gamified Experience
    details: Earn points, unlock achievements, and compete with others through our comprehensive rewards system.
  
  - icon: ⚡
    title: Modern Technology
    details: Built with Vue 3, TypeScript, and Quasar Framework for optimal performance and developer experience.
  
  - icon: 📱
    title: Responsive Design
    details: Seamless experience across all devices - desktop, tablet, and mobile with offline capabilities.
  
  - icon: 🔒
    title: Secure & Private
    details: Enterprise-grade security with JWT authentication, data encryption, and privacy-compliant design.

---

## Quick Start

Get up and running with Crackingo in minutes:

```bash
# Clone the repository
git clone https://github.com/your-username/crackingo.git

# Install dependencies
cd crackingo
npm install

# Start development server
npm run dev
```

## What's Included

::: tip 🎓 Learning Management System
Comprehensive learning platform with structured courses, progress tracking, and adaptive content delivery.
:::

::: tip 📝 Advanced Quiz System
Multiple question types, instant feedback, retry mechanisms, and detailed explanations for better understanding.
:::

::: tip 👥 User Management
Complete authentication system with profile management, notifications, and social features.
:::

::: tip 🎮 Gamification
Points, rewards, achievements, leaderboards, and streak tracking to keep learners motivated.
:::

## Architecture Overview

Crackingo is built using modern web technologies:

- **Frontend**: Vue 3 with Composition API + TypeScript
- **UI Framework**: Quasar Framework with Tailwind CSS
- **State Management**: Pinia stores with persistence
- **API Integration**: Axios with interceptors
- **Build Tool**: Vite for fast development and builds

## Community & Support

- 📖 [Documentation](/guide/introduction)
- 🐛 [Issue Tracker](https://github.com/your-username/crackingo/issues)
- 💬 [Discussions](https://github.com/your-username/crackingo/discussions)
- 📧 [Email Support](mailto:support@crackingo.com)

---

<div class="home-footer">
  <p>Made with ❤️ by the Crackingo Team</p>
</div>

<style>
.home-footer {
  text-align: center;
  margin-top: 2rem;
  padding: 2rem 0;
  border-top: 1px solid var(--vp-c-border);
  color: var(--vp-c-text-2);
}

.home-footer p {
  margin: 0;
}
</style>