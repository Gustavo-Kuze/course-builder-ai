import { runPrompt } from "../llm/runPrompt"
import { getRefineLessonPrompt } from "../llm/prompts/refineLesson"
import { lessonScriptSchema } from "../schemas/lessonScript.schema"
import type { LessonPlan, LessonScript } from "../types/course"

export async function refineLesson(
  lessonPlan: LessonPlan,
  script: LessonScript,
  feedback: string
): Promise<LessonScript> {
  const { system, user } = getRefineLessonPrompt(lessonPlan, script, feedback)

  const rawOutput = await runPrompt<LessonScript>({
    system,
    user,
    temperature: 0.7,
  })

  const validated = lessonScriptSchema.parse(rawOutput)

  return validated
}
