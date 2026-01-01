import { runPrompt } from "../llm/runPrompt"
import { getLessonScriptPrompt } from "../llm/prompts/lessonScript"
import { lessonScriptSchema } from "../schemas/lessonScript.schema"
import type { CourseSpec, LessonPlan, LessonScript, ScriptConstraints } from "../types/course"

export async function generateLessonScript(
  courseSpec: CourseSpec,
  lessonPlan: LessonPlan,
  constraints?: ScriptConstraints
): Promise<LessonScript> {
  const { system, user } = getLessonScriptPrompt(courseSpec, lessonPlan, constraints)

  const rawOutput = await runPrompt<LessonScript>({
    system,
    user,
    temperature: 0.7,
  })

  const validated = lessonScriptSchema.parse(rawOutput)

  return validated
}
