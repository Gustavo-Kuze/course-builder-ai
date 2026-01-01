import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { lessonPlanSchema } from "@/core/schemas/lessonPlan.schema"
import { lessonScriptSchema } from "@/core/schemas/lessonScript.schema"
import { refineLesson } from "@/core/orchestrator/refineLesson"
import { courseRepository } from "@/db/courseRepository"

const requestSchema = z.object({
  lessonPlan: lessonPlanSchema,
  script: lessonScriptSchema,
  feedback: z.string().min(1),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const { lessonPlan, script, feedback } = requestSchema.parse(body)

    const refinedScript = await refineLesson(lessonPlan, script, feedback)

    await courseRepository.saveRefinedScript(
      { lessonPlan, script, feedback },
      refinedScript,
      "v1"
    )

    return NextResponse.json(refinedScript, { status: 200 })
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
