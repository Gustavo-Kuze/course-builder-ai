# CourseBuilderAI — Spec-Driven Development (SDD)

## 1. Project Overview

CourseBuilderAI is an AI-native web application that helps teachers and course creators design complete courses using a structured, pedagogy-first generation pipeline.

The system follows a deterministic, multi-step orchestration model:
- Course Spec (human-defined)
- Course Blueprint generation
- Lesson Plan generation
- Lesson Script generation
- Lesson Refinement

The LLM is treated as a stateless function executor. All orchestration logic, validation, persistence, and flow control are owned by the application.

---

## 2. Tech Stack

- Framework: Next.js (App Router)
- Language: TypeScript
- Runtime: Node.js
- LLM Provider: OpenAI Chat Completions API
- Schema Validation: Zod
- Persistence: Relational DB (interface-based repository)
- Styling/UI: Out of scope for this spec

---

## 3. Core Domain Models

### 3.1 CourseSpec

```ts
type CourseSpec = {
  title: string
  audience: string
  level: "beginner" | "intermediate" | "advanced"
  goal: string
  teachingStyle: string
  language: string
}

3.2 Blueprint

type Blueprint = {
  courseDescription: string
  learningObjectives: string[]
  modules: {
    title: string
    description: string
    lessons: {
      title: string
      objective: string
      estimatedDurationMinutes: number
    }[]
  }[]
}

3.3 LessonPlan

type LessonPlan = {
  lessonObjective: string
  keyConcepts: string[]
  teachingFlow: string[]
  exampleSuggestions: string[]
  commonMisunderstandings: string[]
}

3.4 LessonScript

type LessonScript = {
  script: string
}

4. System Architecture

4.1 High-Level Flow

Client
 ↓
API Route
 ↓
Orchestrator (Pure Functions)
 ↓
LLM Adapter
 ↓
Schema Validation
 ↓
Persistence

4.2 Core Principles
	•	Each LLM call has exactly one responsibility
	•	All LLM outputs must be valid JSON
	•	All outputs are schema-validated
	•	Orchestration is deterministic and replayable
	•	Prompts are versioned and isolated from business logic

5. Folder Structure

src/
 ├─ app/
 │   └─ api/
 │       └─ course/
 │           ├─ blueprint/route.ts
 │           ├─ lesson-plan/route.ts
 │           ├─ lesson-script/route.ts
 │           └─ refine-lesson/route.ts
 │
 ├─ core/
 │   ├─ orchestrator/
 │   │   ├─ generateBlueprint.ts
 │   │   ├─ generateLessonPlan.ts
 │   │   ├─ generateLessonScript.ts
 │   │   └─ refineLesson.ts
 │   │
 │   ├─ llm/
 │   │   ├─ client.ts
 │   │   ├─ runPrompt.ts
 │   │   └─ prompts/
 │   │       ├─ blueprint.ts
 │   │       ├─ lessonPlan.ts
 │   │       ├─ lessonScript.ts
 │   │       └─ refineLesson.ts
 │   │
 │   ├─ schemas/
 │   │   ├─ blueprint.schema.ts
 │   │   ├─ lessonPlan.schema.ts
 │   │   └─ lessonScript.schema.ts
 │   │
 │   └─ types/
 │       └─ course.ts
 │
 └─ db/
     └─ courseRepository.ts

6. LLM Adapter Specification

6.1 OpenAI Client

OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

6.2 runPrompt Contract

runPrompt<T>({
  system: string
  user: string
  temperature?: number
}): Promise<T>

Rules:
	•	Always use system + user messages
	•	Must parse JSON from the model output
	•	Must throw on empty or invalid JSON

7. Prompt Specifications

7.1 Blueprint Generator Prompt

SYSTEM PROMPT:

You are an expert instructional designer and curriculum architect.

Your task is to design a high-quality course blueprint based on the provided course specification.

Principles:
- Clear learning progression
- Logical module grouping
- Lessons build on each other
- No redundancy or filler

Rules:
- Output valid JSON only
- No explanations
- Do not write lesson content

Output:
- courseDescription
- learningObjectives (5–8)
- modules → lessons with objective and estimated duration

7.2 Lesson Planner Prompt

SYSTEM PROMPT:

You are an experienced teacher and lesson designer.

Your task is to design a lesson plan for a single lesson.

Rules:
- Output valid JSON only
- Do not write lesson scripts
- Follow the lesson objective strictly

Output:
- lessonObjective
- keyConcepts
- teachingFlow
- exampleSuggestions
- commonMisunderstandings

7.3 Lesson Script Writer Prompt

SYSTEM PROMPT:

You are an experienced teacher delivering a spoken lesson.

Rules:
- Follow the lesson plan strictly
- Maintain course teaching style
- No new concepts
- Output valid JSON only

Output:
- script (spoken, continuous text)

7.4 Lesson Refinement Prompt

SYSTEM PROMPT:

You are an expert teaching editor.

Rules:
- Apply feedback precisely
- Preserve lesson objective and flow
- No new concepts
- Output valid JSON only

Output:
- revised script

8. Orchestrator Specifications

8.1 generateBlueprint(courseSpec)

Input:
	•	CourseSpec

Output:
	•	Blueprint (validated)

8.2 generateLessonPlan(courseSpec, blueprint, lessonMeta)

Input:
	•	CourseSpec
	•	Blueprint
	•	Lesson metadata (title + objective)

Output:
	•	LessonPlan (validated)

8.3 generateLessonScript(courseSpec, lessonPlan, constraints)

Input:
	•	CourseSpec
	•	LessonPlan
	•	Constraints (length, tone overrides)

Output:
	•	LessonScript (validated)

8.4 refineLesson(lessonPlan, script, feedback)

Input:
	•	LessonPlan
	•	Existing script
	•	Feedback string

Output:
	•	LessonScript (validated)

9. API Route Contracts

POST /api/course/blueprint

Input: CourseSpec
Output: Blueprint

POST /api/course/lesson-plan

Input: CourseSpec + Blueprint + LessonMeta
Output: LessonPlan

POST /api/course/lesson-script

Input: CourseSpec + LessonPlan + Constraints
Output: LessonScript

POST /api/course/refine-lesson

Input: LessonPlan + Script + Feedback
Output: LessonScript

10. Persistence Rules
	•	All generated artifacts must be persisted
	•	Each generation step stores:
	•	Input payload
	•	Output payload
	•	Prompt version
	•	Timestamp
	•	Repository interfaces must be used (no direct DB access in orchestrators)

11. Error Handling Rules
	•	Invalid LLM JSON → throw
	•	Schema validation failure → throw
	•	API routes must return structured error responses
	•	No silent retries in MVP

12. Non-Goals (Explicit)
	•	No LMS features
	•	No user collaboration
	•	No payments
	•	No student-facing UI
	•	No autonomous agents

13. Quality Bar

The system is considered complete when:
	•	A full course can be generated end-to-end
	•	Outputs are consistent and pedagogically coherent
	•	All steps are replayable and debuggable
	•	No step relies on implicit LLM behavior

