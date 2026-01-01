import { runPrompt } from "../llm/runPrompt"
import { getLessonPlanPrompt } from "../llm/prompts/lessonPlan"
import { lessonPlanSchema } from "../schemas/lessonPlan.schema"
import type { CourseSpec, Blueprint, LessonMeta, LessonPlan } from "../types/course"

export async function generateLessonPlan(
  courseSpec: CourseSpec,
  blueprint: Blueprint,
  lessonMeta: LessonMeta
): Promise<LessonPlan> {
  const { system, user } = getLessonPlanPrompt(courseSpec, blueprint, lessonMeta)

  const rawOutput = await runPrompt<LessonPlan>({
    system,
    user,
    temperature: 0.7,
  })

  const validated = lessonPlanSchema.parse(rawOutput)

  return validated
}
