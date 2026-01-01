# Quick Start Guide

## Installation

1. Install dependencies:
```bash
bun install
```

2. Set up environment variables:
```bash
cp .env.example .env.local
```

Edit `.env.local` and add your Groq API key:
```
GROQ_API_KEY=gsk_your-key-here
```

3. Start the development server:
```bash
bun dev
```

## Testing the API

### Step 1: Generate a Blueprint

```bash
curl -X POST http://localhost:3000/api/course/blueprint \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Introduction to TypeScript",
    "audience": "JavaScript developers wanting to learn TypeScript",
    "level": "intermediate",
    "goal": "Master TypeScript fundamentals and apply them to real-world projects",
    "teachingStyle": "Practical and example-driven with hands-on exercises",
    "language": "English"
  }' | jq
```

Save the response to use in the next steps.

### Step 2: Generate a Lesson Plan

Pick a lesson from the blueprint and generate a detailed lesson plan:

```bash
curl -X POST http://localhost:3000/api/course/lesson-plan \
  -H "Content-Type: application/json" \
  -d '{
    "courseSpec": {
      "title": "Introduction to TypeScript",
      "audience": "JavaScript developers wanting to learn TypeScript",
      "level": "intermediate",
      "goal": "Master TypeScript fundamentals and apply them to real-world projects",
      "teachingStyle": "Practical and example-driven with hands-on exercises",
      "language": "English"
    },
    "blueprint": {
      // ... paste blueprint from step 1
    },
    "lessonMeta": {
      "title": "Type Annotations and Inference",
      "objective": "Understand how to use type annotations and leverage TypeScript type inference"
    }
  }' | jq
```

### Step 3: Generate a Lesson Script

```bash
curl -X POST http://localhost:3000/api/course/lesson-script \
  -H "Content-Type: application/json" \
  -d '{
    "courseSpec": {
      "title": "Introduction to TypeScript",
      "audience": "JavaScript developers wanting to learn TypeScript",
      "level": "intermediate",
      "goal": "Master TypeScript fundamentals and apply them to real-world projects",
      "teachingStyle": "Practical and example-driven with hands-on exercises",
      "language": "English"
    },
    "lessonPlan": {
      // ... paste lesson plan from step 2
    },
    "constraints": {
      "maxLength": 2000
    }
  }' | jq
```

### Step 4: Refine the Lesson Script

```bash
curl -X POST http://localhost:3000/api/course/refine-lesson \
  -H "Content-Type: application/json" \
  -d '{
    "lessonPlan": {
      // ... paste lesson plan from step 2
    },
    "script": {
      // ... paste script from step 3
    },
    "feedback": "Add more practical examples and explain when to use explicit annotations vs inference"
  }' | jq
```

## Using with a HTTP client

You can also use tools like Postman, Insomnia, or VS Code REST Client extension to test the APIs.

See `examples/test-api.json` for sample request data.

## Troubleshooting

### Error: "GROQ_API_KEY environment variable is required"
- Make sure you created `.env.local` file
- Make sure your Groq API key is properly set
- Restart the dev server after adding the environment variable

### Error: Invalid JSON from LLM
- This can happen occasionally with LLM responses
- The system will throw an error and you can retry
- Consider adjusting the temperature parameter if needed

### Validation Errors
- Check that your request body matches the expected schema
- The API will return detailed validation errors from Zod

## Next Steps

- Explore the codebase in `src/`
- Read the full specification in `COURSE_BUILDER_SPECS.md`
- Customize prompts in `src/core/llm/prompts/`
- Implement a real database by replacing the repository in `src/db/courseRepository.ts`
