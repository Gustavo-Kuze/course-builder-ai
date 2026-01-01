import type { LessonPlan, LessonScript } from "../../types/course"

export function getRefineLessonPrompt(
  lessonPlan: LessonPlan,
  script: LessonScript,
  feedback: string
) {
  const system = `You are an expert teaching editor.

Rules:
- Apply feedback precisely
- Preserve lesson objective and flow
- No new concepts
- Output valid JSON only

Output:
- revised script`

  const user = `Refine the following lesson script based on the feedback provided:

Lesson Objective:
${lessonPlan.lessonObjective}

Original Script:
${script.script}

Feedback:
${feedback}

Provide a refined script in JSON format with the structure:
{
  "script": "..."
}`

  return { system, user }
}
