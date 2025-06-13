# Quiz Engine

Cracingo's quiz engine provides intelligent, adaptive assessments with multiple question types, real-time feedback, and comprehensive analytics to enhance learning outcomes.

## 🧠 Overview

The quiz engine is designed to create engaging, adaptive assessments that measure learning progress while providing immediate feedback and personalized learning recommendations.

### Key Features

- **Multiple Question Types** - MCQ, True/False, Fill-in-blanks, Code challenges
- **Adaptive Difficulty** - Dynamic question selection based on performance
- **Real-time Feedback** - Instant explanations and learning suggestions
- **Anti-cheating Measures** - Time limits, question shuffling, and monitoring
- **Detailed Analytics** - Performance tracking and learning insights

## 🚀 Quick Start

### Basic Quiz Implementation

```vue
<template>
  <div class="quiz-container">
    <!-- Quiz Header -->
    <div class="quiz-header bg-white shadow-sm p-4 rounded-lg mb-6">
      <div class="flex justify-between items-center">
        <div>
          <h2 class="text-xl font-semibold">{{ quiz.title }}</h2>
          <p class="text-grey-600 text-sm">{{ quiz.description }}</p>
        </div>
        
        <div class="text-right">
          <CTimer v-if="quiz.timeLimit" :initial-time="remainingTime" @time-up="handleTimeUp" />
          <div class="text-sm text-grey-600">
            Question {{ currentQuestionIndex + 1 }} of {{ quiz.questions.length }}
          </div>
        </div>
      </div>
      
      <!-- Progress Bar -->
      <q-linear-progress 
        :value="quizProgress"
        color="primary"
        class="mt-3"
      />
    </div>
    
    <!-- Question Display -->
    <div class="question-container bg-white shadow-sm p-6 rounded-lg">
      <QuestionRenderer 
        :question="currentQuestion"
        :user-answer="userAnswers[currentQuestion.id]"
        :show-feedback="showFeedback"
        @answer-change="handleAnswerChange"
      />
      
      <!-- Navigation -->
      <div class="flex justify-between mt-6">
        <CBtn 
          @click="previousQuestion"
          :disabled="currentQuestionIndex === 0"
          outline
        >
          Previous
        </CBtn>
        
        <div class="flex gap-2">
          <CBtn 
            v-if="!isLastQuestion"
            @click="nextQuestion"
            :disabled="!hasAnswered"
          >
            Next
          </CBtn>
          
          <CBtn 
            v-else
            @click="submitQuiz"
            :loading="submitting"
            color="green"
          >
            Submit Quiz
          </CBtn>
        </div>
      </div>
    </div>
    
    <!-- Question Navigator -->
    <div class="question-navigator bg-white shadow-sm p-4 rounded-lg mt-4">
      <h4 class="font-medium mb-3">Quick Navigation</h4>
      <div class="grid grid-cols-10 gap-2">
        <CBtn
          v-for="(question, index) in quiz.questions"
          :key="question.id"
          @click="goToQuestion(index)"
          :color="getQuestionButtonColor(index)"
          size="sm"
          class="aspect-square"
        >
          {{ index + 1 }}
        </CBtn>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useQuizStore } from 'stores/quizStore'
import { useRoute } from 'vue-router'

const quizStore = useQuizStore()
const route = useRoute()

const quizId = computed(() => route.params.quizId as string)
const { quiz, userAnswers } = await useQuiz(quizId)

const currentQuestionIndex = ref(0)
const showFeedback = ref(false)
const submitting = ref(false)
const remainingTime = ref(quiz.value.timeLimit * 60) // Convert to seconds

const currentQuestion = computed(() => quiz.value.questions[currentQuestionIndex.value])
const quizProgress = computed(() => (currentQuestionIndex.value + 1) / quiz.value.questions.length)
const isLastQuestion = computed(() => currentQuestionIndex.value === quiz.value.questions.length - 1)
const hasAnswered = computed(() => !!userAnswers.value[currentQuestion.value.id])

const handleAnswerChange = (answer: any) => {
  userAnswers.value[currentQuestion.value.id] = answer
  quizStore.saveAnswer(quizId.value, currentQuestion.value.id, answer)
}

const nextQuestion = () => {
  if (!isLastQuestion.value) {
    currentQuestionIndex.value++
  }
}

const submitQuiz = async () => {
  submitting.value = true
  try {
    const result = await quizStore.submitQuiz(quizId.value, userAnswers.value)
    router.push({ 
      name: 'quiz-results', 
      params: { quizId: quizId.value, resultId: result.id }
    })
  } finally {
    submitting.value = false
  }
}
</script>
```

## 📝 Question Types

### Multiple Choice Questions

```vue
<template>
  <div class="mcq-question">
    <div class="question-content mb-6">
      <h3 class="text-lg font-medium mb-2">{{ question.content }}</h3>
      <div v-if="question.image" class="mb-4">
        <img :src="question.image" :alt="question.imageAlt" class="max-w-full h-auto rounded" />
      </div>
    </div>
    
    <div class="options space-y-3">
      <div 
        v-for="(option, index) in question.options"
        :key="index"
        @click="selectOption(option.id)"
        :class="getOptionClass(option.id)"
        class="p-4 border rounded-lg cursor-pointer transition-all"
      >
        <div class="flex items-center">
          <div class="option-indicator mr-3">
            <div 
              :class="getIndicatorClass(option.id)"
              class="w-4 h-4 rounded-full border-2"
            ></div>
          </div>
          
          <div class="flex-1">
            <div class="font-medium">{{ option.text }}</div>
            <div v-if="option.explanation && showFeedback" class="text-sm text-grey-600 mt-1">
              {{ option.explanation }}
            </div>
          </div>
          
          <!-- Feedback Icons -->
          <div v-if="showFeedback" class="ml-2">
            <q-icon 
              v-if="option.isCorrect"
              name="check_circle"
              color="green"
              size="sm"
            />
            <q-icon 
              v-else-if="selectedAnswer === option.id"
              name="cancel"
              color="red"
              size="sm"
            />
          </div>
        </div>
      </div>
    </div>
    
    <!-- Explanation -->
    <div v-if="showFeedback && question.explanation" class="mt-6 p-4 bg-blue-50 rounded-lg">
      <h4 class="font-medium text-blue-800 mb-2">Explanation:</h4>
      <p class="text-blue-700">{{ question.explanation }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  question: MCQQuestion
  userAnswer?: string
  showFeedback?: boolean
}>()

const emit = defineEmits<{
  answerChange: [answer: string]
}>()

const selectedAnswer = ref(props.userAnswer || '')

const selectOption = (optionId: string) => {
  if (!props.showFeedback) {
    selectedAnswer.value = optionId
    emit('answerChange', optionId)
  }
}

const getOptionClass = (optionId: string) => {
  if (!props.showFeedback) {
    return {
      'border-primary bg-primary-50': selectedAnswer.value === optionId,
      'border-grey-300 hover:border-grey-400': selectedAnswer.value !== optionId
    }
  }
  
  const option = props.question.options.find(o => o.id === optionId)
  return {
    'border-green-500 bg-green-50': option?.isCorrect,
    'border-red-500 bg-red-50': selectedAnswer.value === optionId && !option?.isCorrect,
    'border-grey-300': selectedAnswer.value !== optionId && !option?.isCorrect
  }
}
</script>
```

### Code Challenge Questions

```vue
<template>
  <div class="code-challenge">
    <div class="question-content mb-6">
      <h3 class="text-lg font-medium mb-4">{{ question.title }}</h3>
      <div class="prose max-w-none mb-4">
        <p>{{ question.description }}</p>
      </div>
      
      <!-- Example -->
      <div v-if="question.example" class="bg-grey-100 p-4 rounded-lg mb-4">
        <h4 class="font-medium mb-2">Example:</h4>
        <pre class="text-sm"><code>{{ question.example }}</code></pre>
      </div>
      
      <!-- Constraints -->
      <div v-if="question.constraints" class="bg-yellow-50 p-4 rounded-lg mb-4">
        <h4 class="font-medium mb-2">Constraints:</h4>
        <ul class="list-disc list-inside text-sm">
          <li v-for="constraint in question.constraints" :key="constraint">
            {{ constraint }}
          </li>
        </ul>
      </div>
    </div>
    
    <!-- Code Editor -->
    <div class="code-editor-container">
      <div class="flex justify-between items-center mb-2">
        <h4 class="font-medium">Your Solution:</h4>
        <div class="flex gap-2">
          <CSelect 
            v-model="selectedLanguage"
            :options="supportedLanguages"
            dense
            @update:model-value="changeLanguage"
          />
          <CBtn @click="resetCode" size="sm" outline>Reset</CBtn>
        </div>
      </div>
      
      <CodeEditor 
        v-model="userCode"
        :language="selectedLanguage"
        :initial-code="question.starterCode[selectedLanguage]"
        @run="runCode"
      />
      
      <!-- Test Controls -->
      <div class="flex gap-2 mt-4">
        <CBtn @click="runCode" :loading="running" color="blue">
          Run Code
        </CBtn>
        <CBtn @click="runTests" :loading="testing">
          Run Tests
        </CBtn>
        <CBtn @click="submitSolution" :loading="submitting" color="green">
          Submit
        </CBtn>
      </div>
    </div>
    
    <!-- Output Display -->
    <div v-if="output || testResults" class="output-container mt-6">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <!-- Console Output -->
        <div v-if="output" class="bg-dark text-white p-4 rounded-lg">
          <h4 class="text-green-400 mb-2">Console Output:</h4>
          <pre class="text-sm overflow-auto"><code>{{ output }}</code></pre>
        </div>
        
        <!-- Test Results -->
        <div v-if="testResults" class="bg-white border rounded-lg p-4">
          <h4 class="font-medium mb-3">Test Results:</h4>
          <div class="space-y-2">
            <div 
              v-for="(test, index) in testResults"
              :key="index"
              :class="getTestResultClass(test)"
              class="p-3 rounded border"
            >
              <div class="flex justify-between items-center">
                <span class="font-medium">Test {{ index + 1 }}</span>
                <q-icon 
                  :name="test.passed ? 'check_circle' : 'cancel'"
                  :color="test.passed ? 'green' : 'red'"
                />
              </div>
              <div class="text-sm text-grey-600 mt-1">
                Input: {{ test.input }}
              </div>
              <div class="text-sm">
                Expected: {{ test.expected }}
              </div>
              <div class="text-sm">
                Got: {{ test.actual }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  question: CodeChallengeQuestion
  userAnswer?: CodeSolution
  showFeedback?: boolean
}>()

const emit = defineEmits<{
  answerChange: [answer: CodeSolution]
}>()

const selectedLanguage = ref('javascript')