# CourseBuilderAI

An AI-native web application that helps teachers and course creators design complete courses using a structured, pedagogy-first generation pipeline.

## Architecture

CourseBuilderAI follows a deterministic, multi-step orchestration model:

1. **Course Spec** (human-defined)
2. **Course Blueprint** generation
3. **Lesson Plan** generation
4. **Lesson Script** generation
5. **Lesson Refinement**

The LLM is treated as a stateless function executor. All orchestration logic, validation, persistence, and flow control are owned by the application.

## Tech Stack

- **Framework**: Next.js (App Router)
- **Language**: TypeScript
- **Runtime**: Node.js
- **LLM Provider**: OpenAI Chat Completions API
- **Schema Validation**: Zod
- **Persistence**: In-memory repository (interface-based for future DB integration)

## Setup

1. Install dependencies:
```bash
bun install
```

2. Create a `.env.local` file with your OpenAI API key:
```bash
cp .env.example .env.local
```

Then edit `.env.local` and add your key:
```
OPENAI_API_KEY=sk-...
```

3. Run the development server:
```bash
bun dev
```

The app will be available at http://localhost:3000

## API Endpoints

### 1. Generate Blueprint

**POST** `/api/course/blueprint`

Creates a course blueprint from a course specification.

**Request Body:**
```json
{
  "title": "Introduction to Machine Learning",
  "audience": "Computer science students with basic programming knowledge",
  "level": "intermediate",
  "goal": "Understand core ML concepts and implement basic algorithms",
  "teachingStyle": "Practical, hands-on with real examples",
  "language": "English"
}
```

**Response:**
```json
{
  "courseDescription": "...",
  "learningObjectives": ["...", "..."],
  "modules": [
    {
      "title": "...",
      "description": "...",
      "lessons": [
        {
          "title": "...",
          "objective": "...",
          "estimatedDurationMinutes": 45
        }
      ]
    }
  ]
}
```

### 2. Generate Lesson Plan

**POST** `/api/course/lesson-plan`

Creates a detailed lesson plan for a specific lesson.

**Request Body:**
```json
{
  "courseSpec": { /* same as blueprint input */ },
  "blueprint": { /* blueprint from previous step */ },
  "lessonMeta": {
    "title": "Introduction to Neural Networks",
    "objective": "Understand the basic structure and function of neural networks"
  }
}
```

**Response:**
```json
{
  "lessonObjective": "...",
  "keyConcepts": ["...", "..."],
  "teachingFlow": ["...", "..."],
  "exampleSuggestions": ["...", "..."],
  "commonMisunderstandings": ["...", "..."]
}
```

### 3. Generate Lesson Script

**POST** `/api/course/lesson-script`

Generates a spoken lesson script based on the lesson plan.

**Request Body:**
```json
{
  "courseSpec": { /* course specification */ },
  "lessonPlan": { /* lesson plan from previous step */ },
  "constraints": {
    "maxLength": 2000,
    "toneOverride": "conversational and enthusiastic"
  }
}
```

**Response:**
```json
{
  "script": "Welcome to today's lesson on neural networks..."
}
```

### 4. Refine Lesson

**POST** `/api/course/refine-lesson`

Refines an existing lesson script based on feedback.

**Request Body:**
```json
{
  "lessonPlan": { /* original lesson plan */ },
  "script": { /* current script */ },
  "feedback": "Add more concrete examples and simplify the technical jargon"
}
```

**Response:**
```json
{
  "script": "Welcome to today's lesson on neural networks. Let me start with a simple example..."
}
```

## Project Structure

```
src/
 ├─ app/
 │   ├─ layout.tsx
 │   ├─ page.tsx
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
 │   │   ├─ courseSpec.schema.ts
 │   │   ├─ blueprint.schema.ts
 │   │   ├─ lessonPlan.schema.ts
 │   │   └─ lessonScript.schema.ts
 │   │
 │   └─ types/
 │       └─ course.ts
 │
 └─ db/
     └─ courseRepository.ts
```

## Core Principles

- Each LLM call has exactly one responsibility
- All LLM outputs must be valid JSON
- All outputs are schema-validated using Zod
- Orchestration is deterministic and replayable
- Prompts are versioned and isolated from business logic
- All generated artifacts are persisted with input, output, prompt version, and timestamp

## Example Usage Flow

```bash
# 1. Generate a blueprint
curl -X POST http://localhost:3000/api/course/blueprint \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Python for Beginners",
    "audience": "Complete programming novices",
    "level": "beginner",
    "goal": "Learn Python fundamentals and write simple programs",
    "teachingStyle": "Patient, step-by-step with lots of examples",
    "language": "English"
  }'

# 2. Use the blueprint to generate a lesson plan
# (Use the blueprint from step 1 and pick a lesson)

# 3. Generate a script from the lesson plan

# 4. Refine the script based on feedback
```

## Development

The system is built following Spec-Driven Development (SDD) principles. See `COURSE_BUILDER_SPECS.md` for the complete specification.

## Quality Bar

The system is considered complete when:
- A full course can be generated end-to-end
- Outputs are consistent and pedagogically coherent
- All steps are replayable and debuggable
- No step relies on implicit LLM behavior

## License

Private project
