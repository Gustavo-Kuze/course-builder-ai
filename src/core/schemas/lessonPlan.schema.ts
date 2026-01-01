import { z } from "zod"

export const lessonPlanSchema = z.object({
  lessonObjective: z.string().min(1),
  keyConcepts: z.array(z.string()).min(1),
  teachingFlow: z.array(z.string()).min(1),
  exampleSuggestions: z.array(z.string()).min(1),
  commonMisunderstandings: z.array(z.string()).min(1),
})
