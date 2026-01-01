import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { courseSpecSchema } from "@/core/schemas/courseSpec.schema"
import { lessonPlanSchema } from "@/core/schemas/lessonPlan.schema"
import { generateLessonScript } from "@/core/orchestrator/generateLessonScript"
import { courseRepository } from "@/db/courseRepository"

const requestSchema = z.object({
  courseSpec: courseSpecSchema,
  lessonPlan: lessonPlanSchema,
  constraints: z.object({
    maxLength: z.number().optional(),
    toneOverride: z.string().optional(),
  }).optional(),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const { courseSpec, lessonPlan, constraints } = requestSchema.parse(body)

    const lessonScript = await generateLessonScript(courseSpec, lessonPlan, constraints)

    await courseRepository.saveLessonScript(
      { courseSpec, lessonPlan, constraints },
      lessonScript,
      "v1"
    )

    return NextResponse.json(lessonScript, { status: 200 })
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    )
  }
}
