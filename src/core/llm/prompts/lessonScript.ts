import type { CourseSpec, LessonPlan, ScriptConstraints } from "../../types/course"

export function getLessonScriptPrompt(
  courseSpec: CourseSpec,
  lessonPlan: LessonPlan,
  constraints?: ScriptConstraints
) {
  const system = `You are an experienced teacher delivering a spoken lesson.

Rules:
- Follow the lesson plan strictly
- Maintain course teaching style
- No new concepts
- Output valid JSON only

Output:
- script (spoken, continuous text)`

  let constraintsText = ""
  if (constraints?.maxLength) {
    constraintsText += `\nMaximum script length: approximately ${constraints.maxLength} words`
  }
  if (constraints?.toneOverride) {
    constraintsText += `\nTone override: ${constraints.toneOverride}`
  }

  const user = `Write a lesson script based on the following:

Course Context:
Teaching Style: ${courseSpec.teachingStyle}
Language: ${courseSpec.language}
Audience: ${courseSpec.audience}
Level: ${courseSpec.level}

Lesson Plan:
Objective: ${lessonPlan.lessonObjective}

Key Concepts:
${lessonPlan.keyConcepts.map((concept, i) => `${i + 1}. ${concept}`).join("\n")}

Teaching Flow:
${lessonPlan.teachingFlow.map((step, i) => `${i + 1}. ${step}`).join("\n")}

Example Suggestions:
${lessonPlan.exampleSuggestions.map((ex, i) => `${i + 1}. ${ex}`).join("\n")}

Common Misunderstandings to Address:
${lessonPlan.commonMisunderstandings.map((mis, i) => `${i + 1}. ${mis}`).join("\n")}${constraintsText}

Provide a complete spoken lesson script in JSON format with the structure:
{
  "script": "..."
}`

  return { system, user }
}
