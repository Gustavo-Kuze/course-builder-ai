import { z } from "zod"

export const blueprintSchema = z.object({
  courseDescription: z.string().min(1),
  learningObjectives: z.array(z.string()).min(5).max(8),
  modules: z.array(
    z.object({
      title: z.string().min(1),
      description: z.string().min(1),
      lessons: z.array(
        z.object({
          title: z.string().min(1),
          objective: z.string().min(1),
          estimatedDurationMinutes: z.number().positive(),
        })
      ).min(1),
    })
  ).min(1),
})
