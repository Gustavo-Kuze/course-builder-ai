import type { CourseSpec, Blueprint, LessonMeta } from "../../types/course"

export function getLessonPlanPrompt(
  courseSpec: CourseSpec,
  blueprint: Blueprint,
  lessonMeta: LessonMeta
) {
  const system = `You are an experienced teacher and lesson designer.

Your task is to design a lesson plan for a single lesson.

Rules:
- Output valid JSON only
- Do not write lesson scripts
- Follow the lesson objective strictly

Output:
- lessonObjective
- keyConcepts
- teachingFlow
- exampleSuggestions
- commonMisunderstandings`

  const user = `Design a lesson plan for the following lesson:

Course Context:
Title: ${courseSpec.title}
Audience: ${courseSpec.audience}
Level: ${courseSpec.level}
Teaching Style: ${courseSpec.teachingStyle}
Language: ${courseSpec.language}

Course Description: ${blueprint.courseDescription}

Learning Objectives:
${blueprint.learningObjectives.map((obj, i) => `${i + 1}. ${obj}`).join("\n")}

Lesson:
Title: ${lessonMeta.title}
Objective: ${lessonMeta.objective}

Provide a detailed lesson plan in JSON format with the structure:
{
  "lessonObjective": "...",
  "keyConcepts": ["...", "..."],
  "teachingFlow": ["...", "..."],
  "exampleSuggestions": ["...", "..."],
  "commonMisunderstandings": ["...", "..."]
}`

  return { system, user }
}
