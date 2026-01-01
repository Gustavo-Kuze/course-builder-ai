import { z } from "zod"

export const courseSpecSchema = z.object({
  title: z.string().min(1),
  audience: z.string().min(1),
  level: z.enum(["beginner", "intermediate", "advanced"]),
  goal: z.string().min(1),
  teachingStyle: z.string().min(1),
  language: z.string().min(1),
})
