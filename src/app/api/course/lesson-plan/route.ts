import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { courseSpecSchema } from "@/core/schemas/courseSpec.schema"
import { blueprintSchema } from "@/core/schemas/blueprint.schema"
import { generateLessonPlan } from "@/core/orchestrator/generateLessonPlan"
import { courseRepository } from "@/db/courseRepository"

const requestSchema = z.object({
  courseSpec: courseSpecSchema,
  blueprint: blueprintSchema,
  lessonMeta: z.object({
    title: z.string().min(1),
    objective: z.string().min(1),
  }),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const { courseSpec, blueprint, lessonMeta } = requestSchema.parse(body)

    const lessonPlan = await generateLessonPlan(courseSpec, blueprint, lessonMeta)

    await courseRepository.saveLessonPlan(
      { courseSpec, blueprint, lessonMeta },
      lessonPlan,
      "v1"
    )

    return NextResponse.json(lessonPlan, { status: 200 })
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
