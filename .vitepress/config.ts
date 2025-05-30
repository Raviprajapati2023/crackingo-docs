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
      { text: 'Components', link: '/components/overview' },
      { text: 'API Reference', link: '/api/overview' },
      { 
        text: 'Resources', 
        items: [
          { text: 'Examples', link: '/examples/basic-usage' },
          { text: 'Troubleshooting', link: '/guide/troubleshooting' },
          { text: 'FAQ', link: '/guide/faq' },
          { text: 'Changelog', link: '/guide/changelog' }
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
            { text: 'API Integration', link: '/guide/api-integration' },
            { text: 'Routing', link: '/guide/routing' }
          ]
        },
        {
          text: 'Features',
          items: [
            { text: 'Authentication', link: '/guide/authentication' },
            { text: 'Learning System', link: '/guide/learning-system' },
            { text: 'Quiz Engine', link: '/guide/quiz-engine' },
            { text: 'Points & Rewards', link: '/guide/points-rewards' },
            { text: 'User Management', link: '/guide/user-management' }
          ]
        }
      ],
      
      '/components/': [
        {
          text: 'Component Library',
          items: [
            { text: 'Overview', link: '/components/overview' },
            { text: 'Design Principles', link: '/components/design-principles' },
            { text: 'Usage Guidelines', link: '/components/usage-guidelines' }
          ]
        },
        {
          text: 'Form Components',
          items: [
            { text: 'CInput', link: '/components/cinput' },
            { text: 'CSelect', link: '/components/cselect' },
            { text: 'CEditor', link: '/components/ceditor' },
            { text: 'CFile', link: '/components/cfile' },
            { text: 'CUploader', link: '/components/cuploader' },
            { text: 'COtpInput', link: '/components/cotpinput' },
            { text: 'CTagsInput', link: '/components/ctagsinput' }
          ]
        },
        {
          text: 'Data Components',
          items: [
            { text: 'APITable', link: '/components/apitable' },
            { text: 'CTable', link: '/components/ctable' }
          ]
        },
        {
          text: 'UI Components',
          items: [
            { text: 'CBtn', link: '/components/cbtn' },
            { text: 'CDialog', link: '/components/cdialog' },
            { text: 'SAvatar', link: '/components/savatar' },
            { text: 'CTimer', link: '/components/ctimer' },
            { text: 'CTooltip', link: '/components/ctooltip' }
          ]
        }
      ],
      
      '/api/': [
        {
          text: 'API Reference',
          items: [
            { text: 'Overview', link: '/api/overview' },
            { text: 'Authentication', link: '/api/authentication' },
            { text: 'Error Handling', link: '/api/error-handling' }
          ]
        },
        {
          text: 'Endpoints',
          items: [
            { text: 'Authentication', link: '/api/auth-endpoints' },
            { text: 'User Management', link: '/api/user-endpoints' },
            { text: 'Learning System', link: '/api/learning-endpoints' },
            { text: 'Quiz System', link: '/api/quiz-endpoints' },
            { text: 'Points & Rewards', link: '/api/points-endpoints' }
          ]
        }
      ]
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