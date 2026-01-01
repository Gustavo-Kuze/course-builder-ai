import Groq from "groq-sdk"

let groqInstance: Groq | null = null

export function getGroq(): Groq {
  if (!groqInstance) {
    if (!process.env.GROQ_API_KEY) {
      throw new Error("GROQ_API_KEY environment variable is required")
    }
    groqInstance = new Groq({
      apiKey: process.env.GROQ_API_KEY,
    })
  }
  return groqInstance
}
