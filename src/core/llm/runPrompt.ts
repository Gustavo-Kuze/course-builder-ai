import { getOpenAI } from "./client"

export interface PromptInput {
  system: string
  user: string
  temperature?: number
}

export async function runPrompt<T>(input: PromptInput): Promise<T> {
  const { system, user, temperature = 0.7 } = input

  const openai = getOpenAI()

  const response = await openai.chat.completions.create({
    model: "gpt-4-turbo-preview",
    messages: [
      { role: "system", content: system },
      { role: "user", content: user },
    ],
    temperature,
    response_format: { type: "json_object" },
  })

  const content = response.choices[0]?.message?.content

  if (!content) {
    throw new Error("Empty response from LLM")
  }

  try {
    const parsed = JSON.parse(content)
    return parsed as T
  } catch (error) {
    throw new Error(`Invalid JSON from LLM: ${error}`)
  }
}
