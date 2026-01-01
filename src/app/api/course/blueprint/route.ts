import { NextRequest, NextResponse } from "next/server"
import { courseSpecSchema } from "@/core/schemas/courseSpec.schema"
import { generateBlueprint } from "@/core/orchestrator/generateBlueprint"
import { courseRepository } from "@/db/courseRepository"
import { corsHeaders, handleOptions } from "../middleware"

export async function OPTIONS() {
  return handleOptions()
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const courseSpec = courseSpecSchema.parse(body)

    const blueprint = await generateBlueprint(courseSpec)

    await courseRepository.saveBlueprint(courseSpec, blueprint, "v1")

    return NextResponse.json(blueprint, {
      status: 200,
      headers: corsHeaders()
    })
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400, headers: corsHeaders() }
      )
    }
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500, headers: corsHeaders() }
    )
  }
}
