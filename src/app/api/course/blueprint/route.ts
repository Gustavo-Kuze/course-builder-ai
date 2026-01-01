import { NextRequest, NextResponse } from "next/server"
import { courseSpecSchema } from "@/core/schemas/courseSpec.schema"
import { generateBlueprint } from "@/core/orchestrator/generateBlueprint"
import { courseRepository } from "@/db/courseRepository"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const courseSpec = courseSpecSchema.parse(body)

    const blueprint = await generateBlueprint(courseSpec)

    await courseRepository.saveBlueprint(courseSpec, blueprint, "v1")

    return NextResponse.json(blueprint, { status: 200 })
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
