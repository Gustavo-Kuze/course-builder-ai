import { z } from "zod"

export const lessonScriptSchema = z.object({
  script: z.string().min(1),
})
