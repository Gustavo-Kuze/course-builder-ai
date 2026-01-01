import type { CourseSpec, Blueprint, LessonPlan, LessonScript } from "../core/types/course"

export interface GenerationRecord<T> {
  id: string
  input: unknown
  output: T
  promptVersion: string
  createdAt: Date
}

export interface CourseRepository {
  saveBlueprint(
    courseSpec: CourseSpec,
    blueprint: Blueprint,
    promptVersion: string
  ): Promise<GenerationRecord<Blueprint>>

  saveLessonPlan(
    input: { courseSpec: CourseSpec; blueprint: Blueprint; lessonMeta: { title: string; objective: string } },
    lessonPlan: LessonPlan,
    promptVersion: string
  ): Promise<GenerationRecord<LessonPlan>>

  saveLessonScript(
    input: { courseSpec: CourseSpec; lessonPlan: LessonPlan; constraints?: unknown },
    lessonScript: LessonScript,
    promptVersion: string
  ): Promise<GenerationRecord<LessonScript>>

  saveRefinedScript(
    input: { lessonPlan: LessonPlan; script: LessonScript; feedback: string },
    refinedScript: LessonScript,
    promptVersion: string
  ): Promise<GenerationRecord<LessonScript>>

  getBlueprintById(id: string): Promise<GenerationRecord<Blueprint> | null>
  getLessonPlanById(id: string): Promise<GenerationRecord<LessonPlan> | null>
  getLessonScriptById(id: string): Promise<GenerationRecord<LessonScript> | null>
}

class InMemoryCourseRepository implements CourseRepository {
  private blueprints: Map<string, GenerationRecord<Blueprint>> = new Map()
  private lessonPlans: Map<string, GenerationRecord<LessonPlan>> = new Map()
  private lessonScripts: Map<string, GenerationRecord<LessonScript>> = new Map()

  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
  }

  async saveBlueprint(
    courseSpec: CourseSpec,
    blueprint: Blueprint,
    promptVersion: string
  ): Promise<GenerationRecord<Blueprint>> {
    const record: GenerationRecord<Blueprint> = {
      id: this.generateId(),
      input: courseSpec,
      output: blueprint,
      promptVersion,
      createdAt: new Date(),
    }
    this.blueprints.set(record.id, record)
    return record
  }

  async saveLessonPlan(
    input: { courseSpec: CourseSpec; blueprint: Blueprint; lessonMeta: { title: string; objective: string } },
    lessonPlan: LessonPlan,
    promptVersion: string
  ): Promise<GenerationRecord<LessonPlan>> {
    const record: GenerationRecord<LessonPlan> = {
      id: this.generateId(),
      input,
      output: lessonPlan,
      promptVersion,
      createdAt: new Date(),
    }
    this.lessonPlans.set(record.id, record)
    return record
  }

  async saveLessonScript(
    input: { courseSpec: CourseSpec; lessonPlan: LessonPlan; constraints?: unknown },
    lessonScript: LessonScript,
    promptVersion: string
  ): Promise<GenerationRecord<LessonScript>> {
    const record: GenerationRecord<LessonScript> = {
      id: this.generateId(),
      input,
      output: lessonScript,
      promptVersion,
      createdAt: new Date(),
    }
    this.lessonScripts.set(record.id, record)
    return record
  }

  async saveRefinedScript(
    input: { lessonPlan: LessonPlan; script: LessonScript; feedback: string },
    refinedScript: LessonScript,
    promptVersion: string
  ): Promise<GenerationRecord<LessonScript>> {
    const record: GenerationRecord<LessonScript> = {
      id: this.generateId(),
      input,
      output: refinedScript,
      promptVersion,
      createdAt: new Date(),
    }
    this.lessonScripts.set(record.id, record)
    return record
  }

  async getBlueprintById(id: string): Promise<GenerationRecord<Blueprint> | null> {
    return this.blueprints.get(id) ?? null
  }

  async getLessonPlanById(id: string): Promise<GenerationRecord<LessonPlan> | null> {
    return this.lessonPlans.get(id) ?? null
  }

  async getLessonScriptById(id: string): Promise<GenerationRecord<LessonScript> | null> {
    return this.lessonScripts.get(id) ?? null
  }
}

export const courseRepository: CourseRepository = new InMemoryCourseRepository()
