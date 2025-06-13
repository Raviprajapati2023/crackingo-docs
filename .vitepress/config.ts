import { defineConfig } from 'vitepress'

export default defineConfig({
  title: "Crackingo Docs",
  description: "AI-Powered Learning Platform Documentation",
  
  // For Netlify, use "/" as base
  base: "/",
  
  // Enable clean URLs
  cleanUrls: true,
  
  head: [
    ['link', { rel: 'icon', href: '/favicon.ico' }],
    ['meta', { name: 'theme-color', content: '#3c82f6' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:locale', content: 'en' }],
    ['meta', { property: 'og:title', content: 'Crackingo | AI-Powered Learning Platform' }],
    ['meta', { property: 'og:site_name', content: 'Crackingo' }],
  ],

  themeConfig: {
    logo: '/logo.svg',
    
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Guide', link: '/guide/introduction' },
      { 
        text: 'Resources', 
        items: [
          { text: 'FAQ', link: '/guide/faq' },
        ]
      }
    ],

    sidebar: {
      '/guide/': [
        {
          text: 'Introduction',
          items: [
            { text: 'What is Crackingo?', link: '/guide/introduction' },
            { text: 'Getting Started', link: '/guide/getting-started' },
            { text: 'Installation', link: '/guide/installation' },
            { text: 'Quick Start', link: '/guide/quick-start' }
          ]
        },
        {
          text: 'Architecture',
          items: [
            { text: 'Project Structure', link: '/guide/project-structure' },
            { text: 'State Management', link: '/guide/state-management' },
            { text: 'Routing', link: '/guide/routing' }
          ]
        },
        {
          text: 'Features',
          items: [
            { text: 'Authentication', link: '/guide/authentication' },
            { text: 'Learning System', link: '/guide/learning-system' },
            { text: 'Quiz Engine', link: '/guide/quiz-engine' },
            { text: 'User Management', link: '/guide/user-management' }
          ]
        }
      ],
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/Raviprajapati2023/crackingo-docs' }
    ],

    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2024 Crackingo Team'
    },

    editLink: {
      pattern: 'https://github.com/Raviprajapati2023/crackingo-docs/edit/main/docs/:path'
    },

    search: {
      provider: 'local'
    },

    outline: {
      level: [2, 3]
    }
  },

  markdown: {
    theme: {
      light: 'github-light',
      dark: 'github-dark'
    },
    lineNumbers: true
  }
})