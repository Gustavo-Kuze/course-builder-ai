import type { CourseSpec } from "../../types/course"

export function getBlueprintPrompt(courseSpec: CourseSpec) {
  const system = `You are an expert instructional designer and curriculum architect.

Your task is to design a high-quality course blueprint based on the provided course specification.

Principles:
- Clear learning progression
- Logical module grouping
- Lessons build on each other
- No redundancy or filler

Rules:
- Output valid JSON only
- No explanations
- Do not write lesson content

Output:
- courseDescription
- learningObjectives (5–8)
- modules → lessons with objective and estimated duration`

  const user = `Design a course blueprint for the following specification:

Title: ${courseSpec.title}
Audience: ${courseSpec.audience}
Level: ${courseSpec.level}
Goal: ${courseSpec.goal}
Teaching Style: ${courseSpec.teachingStyle}
Language: ${courseSpec.language}

Provide a complete course blueprint in JSON format with the structure:
{
  "courseDescription": "...",
  "learningObjectives": ["...", "..."],
  "modules": [
    {
      "title": "...",
      "description": "...",
      "lessons": [
        {
          "title": "...",
          "objective": "...",
          "estimatedDurationMinutes": 30
        }
      ]
    }
  ]
}`

  return { system, user }
}
