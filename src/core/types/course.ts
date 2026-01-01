export type CourseSpec = {
  title: string
  audience: string
  level: "beginner" | "intermediate" | "advanced"
  goal: string
  teachingStyle: string
  language: string
}

export type Blueprint = {
  courseDescription: string
  learningObjectives: string[]
  modules: {
    title: string
    description: string
    lessons: {
      title: string
      objective: string
      estimatedDurationMinutes: number
    }[]
  }[]
}

export type LessonPlan = {
  lessonObjective: string
  keyConcepts: string[]
  teachingFlow: string[]
  exampleSuggestions: string[]
  commonMisunderstandings: string[]
}

export type LessonScript = {
  script: string
}

export type LessonMeta = {
  title: string
  objective: string
}

export type ScriptConstraints = {
  maxLength?: number
  toneOverride?: string
}
