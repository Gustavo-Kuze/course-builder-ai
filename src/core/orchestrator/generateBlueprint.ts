import { runPrompt } from "../llm/runPrompt"
import { getBlueprintPrompt } from "../llm/prompts/blueprint"
import { blueprintSchema } from "../schemas/blueprint.schema"
import type { CourseSpec, Blueprint } from "../types/course"

export async function generateBlueprint(courseSpec: CourseSpec): Promise<Blueprint> {
  const { system, user } = getBlueprintPrompt(courseSpec)

  const rawOutput = await runPrompt<Blueprint>({
    system,
    user,
    temperature: 0.7,
  })

  const validated = blueprintSchema.parse(rawOutput)

  return validated
}
