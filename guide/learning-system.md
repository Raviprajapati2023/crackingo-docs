# Learning System

Cracingo's learning system provides an interactive, adaptive educational experience with progress tracking, personalized content delivery, and comprehensive analytics.

## 🎓 Overview

The learning system is designed to deliver engaging educational content through structured courses, interactive lessons, and real-time progress tracking.

### Key Features

- **Adaptive Learning Paths** - Personalized content based on performance
- **Progress Tracking** - Detailed analytics and completion metrics
- **Interactive Content** - Rich media lessons with various content types
- **Offline Support** - Download content for offline learning
- **Social Learning** - Discussion boards and peer interaction

## 🚀 Quick Start

### Basic Course Structure

```vue
<template>
  <div class="learning-container">
    <!-- Course Header -->
    <div class="course-header bg-primary text-white p-6 rounded-lg mb-6">
      <h1 class="text-2xl font-bold">{{ course.title }}</h1>
      <p class="text-primary-100 mt-2">{{ course.description }}</p>
      
      <!-- Progress Bar -->
      <div class="mt-4">
        <div class="flex justify-between text-sm mb-1">
          <span>Progress</span>
          <span>{{ Math.round(progress) }}%</span>
        </div>
        <q-linear-progress 
          :value="progress / 100" 
          color="white" 
          track-color="primary-600"
          class="h-2"
        />
      </div>
    </div>
    
    <!-- Lesson List -->
    <div class="grid gap-4">
      <LessonCard 
        v-for="lesson in course.lessons"
        :key="lesson.id"
        :lesson="lesson"
        :is-locked="isLessonLocked(lesson)"
        :is-completed="isLessonCompleted(lesson)"
        @start="startLesson"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useLearningStore } from 'stores/learningStore'
import { useRoute } from 'vue-router'

const learningStore = useLearningStore()
const route = useRoute()

const courseId = computed(() => route.params.courseId as string)
const { course, progress } = await useCourse(courseId)

const isLessonLocked = (lesson: Lesson) => {
  return !lesson.isUnlocked && !learningStore.hasCompletedPrerequisites(lesson)
}

const isLessonCompleted = (lesson: Lesson) => {
  return learningStore.completedLessons.includes(lesson.id)
}

const startLesson = (lesson: Lesson) => {
  if (!isLessonLocked(lesson)) {
    router.push({ 
      name: 'lesson', 
      params: { courseId: courseId.value, lessonId: lesson.id }
    })
  }
}
</script>
```

## 📚 Content Types

### Text-based Lessons

```vue
<template>
  <div class="lesson-content">
    <div class="prose max-w-none">
      <CEditor 
        v-model="lesson.content" 
        :toolbar="[]" 
        readonly
      />
    </div>
    
    <!-- Navigation -->
    <div class="flex justify-between mt-6">
      <CBtn 
        @click="previousLesson" 
        :disabled="isFirstLesson"
        outline
      >
        Previous
      </CBtn>
      
      <CBtn 
        @click="completeLesson"
        :loading="completing"
      >
        Complete Lesson
      </CBtn>
      
      <CBtn 
        @click="nextLesson"
        :disabled="isLastLesson"
      >
        Next
      </CBtn>
    </div>
  </div>
</template>
```

### Video Lessons

```vue
<template>
  <div class="video-lesson">
    <!-- Video Player -->
    <div class="aspect-video bg-black rounded-lg overflow-hidden mb-4">
      <video 
        ref="videoPlayer"
        :src="lesson.videoUrl"
        controls
        class="w-full h-full"
        @timeupdate="updateProgress"
        @ended="markAsWatched"
      />
    </div>
    
    <!-- Video Controls -->
    <div class="flex items-center gap-4 mb-4">
      <CBtn @click="togglePlayback" :icon="isPlaying ? 'pause' : 'play_arrow'" />
      
      <div class="flex-1">
        <q-slider 
          v-model="currentTime"
          :min="0"
          :max="duration"
          @change="seekTo"
          color="primary"
        />
      </div>
      
      <span class="text-sm text-grey-6">
        {{ formatTime(currentTime) }} / {{ formatTime(duration) }}
      </span>
    </div>
    
    <!-- Interactive Elements -->
    <div class="grid gap-4">
      <div 
        v-for="element in lesson.interactiveElements"
        :key="element.id"
        class="p-4 border rounded-lg"
      >
        <component 
          :is="getElementComponent(element.type)"
          :element="element"
          @interaction="recordInteraction"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const videoPlayer = ref<HTMLVideoElement>()
const isPlaying = ref(false)
const currentTime = ref(0)
const duration = ref(0)

const updateProgress = () => {
  if (videoPlayer.value) {
    currentTime.value = videoPlayer.value.currentTime
    duration.value = videoPlayer.value.duration
    
    // Track watching progress
    learningStore.updateVideoProgress(lesson.id, {
      currentTime: currentTime.value,
      duration: duration.value,
      watchedPercentage: (currentTime.value / duration.value) * 100
    })
  }
}

const markAsWatched = () => {
  learningStore.markVideoAsWatched(lesson.id)
}
</script>
```

### Interactive Exercises

```vue
<template>
  <div class="interactive-exercise">
    <h3 class="text-lg font-semibold mb-4">{{ exercise.title }}</h3>
    
    <!-- Code Exercise -->
    <div v-if="exercise.type === 'code'" class="space-y-4">
      <div class="bg-grey-100 p-4 rounded-lg">
        <h4 class="font-medium mb-2">Instructions:</h4>
        <p>{{ exercise.instructions }}</p>
      </div>
      
      <CodeEditor 
        v-model="userCode"
        :language="exercise.language"
        :initial-code="exercise.starterCode"
        @run="runCode"
      />
      
      <div class="flex gap-2">
        <CBtn @click="runCode" :loading="running">Run Code</CBtn>
        <CBtn @click="submitSolution" :loading="submitting">Submit</CBtn>
      </div>
      
      <!-- Output Display -->
      <div v-if="output" class="bg-dark text-white p-4 rounded-lg font-mono text-sm">
        <pre>{{ output }}</pre>
      </div>
    </div>
    
    <!-- Drag & Drop Exercise -->
    <div v-else-if="exercise.type === 'drag-drop'" class="space-y-4">
      <DragDropExercise 
        :items="exercise.items"
        :targets="exercise.targets"
        @complete="handleDragDropComplete"
      />
    </div>
    
    <!-- Fill in the Blanks -->
    <div v-else-if="exercise.type === 'fill-blanks'" class="space-y-4">
      <FillBlanksExercise 
        :content="exercise.content"
        :blanks="exercise.blanks"
        @submit="handleFillBlanksSubmit"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
const userCode = ref('')
const output = ref('')
const running = ref(false)
const submitting = ref(false)

const runCode = async () => {
  running.value = true
  try {
    // Send code to execution service
    const result = await api.post('/code/execute', {
      code: userCode.value,
      language: exercise.language
    })
    output.value = result.output
  } finally {
    running.value = false
  }
}

const submitSolution = async () => {
  submitting.value = true
  try {
    const result = await learningStore.submitExercise(exercise.id, {
      code: userCode.value,
      output: output.value
    })
    
    if (result.correct) {
      $q.notify({
        type: 'positive',
        message: 'Excellent! Solution is correct.'
      })
    } else {
      $q.notify({
        type: 'warning',
        message: result.feedback || 'Not quite right. Try again!'
      })
    }
  } finally {
    submitting.value = false
  }
}
</script>
```

## 📊 Progress Tracking

### Learning Analytics Dashboard

```vue
<template>
  <div class="analytics-dashboard">
    <!-- Overview Cards -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <StatCard 
        title="Courses Completed"
        :value="analytics.completedCourses"
        icon="school"
        color="green"
      />
      
      <StatCard 
        title="Total Study Time"
        :value="formatDuration(analytics.totalStudyTime)"
        icon="schedule"
        color="blue"
      />
      
      <StatCard 
        title="Streak Days"
        :value="analytics.streakDays"
        icon="local_fire_department"
        color="orange"
      />
      
      <StatCard 
        title="Points Earned"
        :value="analytics.pointsEarned"
        icon="stars"
        color="purple"
      />
    </div>
    
    <!-- Progress Charts -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Weekly Progress -->
      <SectionCard title="Weekly Progress">
        <canvas ref="weeklyChart"></canvas>
      </SectionCard>
      
      <!-- Skill Radar -->
      <SectionCard title="Skill Assessment">
        <canvas ref="skillChart"></canvas>
      </SectionCard>
    </div>
    
    <!-- Recent Activity -->
    <SectionCard title="Recent Activity" class="mt-6">
      <div class="space-y-3">
        <div 
          v-for="activity in recentActivities"
          :key="activity.id"
          class="flex items-center p-3 bg-grey-50 rounded-lg"
        >
          <q-icon 
            :name="getActivityIcon(activity.type)" 
            :color="getActivityColor(activity.type)"
            class="mr-3"
          />
          <div class="flex-1">
            <p class="font-medium">{{ activity.title }}</p>
            <p class="text-sm text-grey-600">{{ activity.description }}</p>
          </div>
          <span class="text-xs text-grey-500">
            {{ formatRelativeTime(activity.timestamp) }}
          </span>
        </div>
      </div>
    </SectionCard>
  </div>
</template>

<script setup lang="ts">
import { Chart } from 'chart.js/auto'

const analytics = await learningStore.getAnalytics()
const recentActivities = await learningStore.getRecentActivities()

const weeklyChart = ref<HTMLCanvasElement>()
const skillChart = ref<HTMLCanvasElement>()

onMounted(() => {
  initializeCharts()
})

const initializeCharts = () => {
  // Weekly progress chart
  new Chart(weeklyChart.value!, {
    type: 'line',
    data: {
      labels: analytics.weeklyData.labels,
      datasets: [{
        label: 'Study Time (hours)',
        data: analytics.weeklyData.studyTime,
        borderColor: '#1976d2',
        backgroundColor: 'rgba(25, 118, 210, 0.1)',
        fill: true
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: false }
      }
    }
  })
  
  // Skill radar chart
  new Chart(skillChart.value!, {
    type: 'radar',
    data: {
      labels: analytics.skills.map(s => s.name),
      datasets: [{
        label: 'Skill Level',
        data: analytics.skills.map(s => s.level),
        borderColor: '#9c27b0',
        backgroundColor: 'rgba(156, 39, 176, 0.2)'
      }]
    },
    options: {
      responsive: true,
      scales: {
        r: {
          beginAtZero: true,
          max: 100
        }
      }
    }
  })
}
</script>
```

## 🎯 Adaptive Learning

### Personalized Content Delivery

```typescript
// stores/learningStore.ts
export const useLearningStore = defineStore('learning', {
  state: () => ({
    userProfile: {} as LearningProfile,
    adaptiveSettings: {} as AdaptiveSettings,
    currentPath: [] as Lesson[]
  }),
  
  actions: {
    async generateAdaptivePath(courseId: string) {
      const userPerformance = await this.analyzeUserPerformance()
      const courseContent = await this.getCourseContent(courseId)
      
      // AI-powered content recommendation
      const adaptivePath = await api.post('/learning/adaptive-path', {
        userId: this.userProfile.id,
        courseId,
        performance: userPerformance,
        preferences: this.userProfile.preferences
      })
      
      this.currentPath = adaptivePath.data.lessons
      return this.currentPath
    },
    
    async adjustDifficulty(lessonId: string, performance: Performance) {
      const adjustment = await api.post('/learning/adjust-difficulty', {
        lessonId,
        performance,
        userId: this.userProfile.id
      })
      
      // Update adaptive settings
      this.adaptiveSettings = {
        ...this.adaptiveSettings,
        ...adjustment.data
      }
    }
  }
})
```

### Performance-based Recommendations

```vue
<template>
  <div class="recommendations">
    <h3 class="text-lg font-semibold mb-4">Recommended for You</h3>
    
    <div class="grid gap-4">
      <RecommendationCard 
        v-for="recommendation in recommendations"
        :key="recommendation.id"
        :recommendation="recommendation"
        @accept="acceptRecommendation"
        @dismiss="dismissRecommendation"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
const recommendations = computed(() => {
  return learningStore.getPersonalizedRecommendations({
    weakAreas: learningStore.identifyWeakAreas(),
    interests: learningStore.userProfile.interests,
    learningStyle: learningStore.userProfile.learningStyle
  })
})
</script>
```

## 🏆 Achievement System

### Badges and Milestones

```vue
<template>
  <div class="achievements">
    <!-- Achievement Categories -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <!-- Progress Badges -->
      <SectionCard title