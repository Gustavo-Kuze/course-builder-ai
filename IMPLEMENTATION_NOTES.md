# Implementation Notes

## Build Status

✅ **TypeScript compilation**: No errors
✅ **Next.js build**: Successful
✅ **All API routes**: Registered and ready

## Implementation Highlights

### 1. Lazy OpenAI Client Initialization

The OpenAI client is initialized lazily to prevent build-time errors when the API key is not available:

```typescript
// src/core/llm/client.ts
export function getOpenAI(): OpenAI {
  if (!openaiInstance) {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error("OPENAI_API_KEY environment variable is required")
    }
    openaiInstance = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    })
  }
  return openaiInstance
}
```

This allows the app to build without an API key and only requires it at runtime when API routes are actually called.

### 2. Strict Schema Validation

All LLM outputs are validated using Zod schemas before being returned:

```typescript
const rawOutput = await runPrompt<Blueprint>({ system, user, temperature: 0.7 })
const validated = blueprintSchema.parse(rawOutput)
return validated
```

This ensures:
- Type safety
- Runtime validation
- Clear error messages for invalid outputs

### 3. Repository Pattern

The repository interface allows easy swapping of persistence layers:

```typescript
export interface CourseRepository {
  saveBlueprint(courseSpec, blueprint, promptVersion): Promise<GenerationRecord<Blueprint>>
  saveLessonPlan(input, lessonPlan, promptVersion): Promise<GenerationRecord<LessonPlan>>
  // ... etc
}
```

Current implementation uses in-memory storage for MVP. To switch to a database:

1. Create a new class implementing `CourseRepository`
2. Replace the export in `src/db/courseRepository.ts`

### 4. Versioned Prompts

All prompts are versioned (currently "v1") and stored with each generation record. This enables:
- Prompt A/B testing
- Rollback to previous prompt versions
- Debugging which prompt version produced specific outputs

### 5. Error Handling

API routes follow a consistent error handling pattern:

```typescript
try {
  const input = schema.parse(body)
  const output = await orchestrator(input)
  await repository.save(input, output, "v1")
  return NextResponse.json(output, { status: 200 })
} catch (error) {
  if (error instanceof Error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
  return NextResponse.json({ error: "Unexpected error" }, { status: 500 })
}
```

This provides:
- Validation errors with details
- LLM errors with context
- Generic fallback for unexpected errors

### 6. Type Safety Throughout

The entire codebase uses TypeScript strict mode with:
- No `any` types
- Full type inference
- Proper generics for repository and LLM functions

### 7. Separation of Concerns

Clear boundaries between layers:

```
API Routes → Orchestrators → LLM Adapter → OpenAI
     ↓            ↓
 Repository   Validation
```

Each layer has a single responsibility:
- **API Routes**: HTTP handling, request/response formatting
- **Orchestrators**: Business logic, coordination
- **LLM Adapter**: Prompt execution, JSON parsing
- **Repository**: Data persistence
- **Schemas**: Validation rules

## File Organization

Files are organized by feature, not by type:

```
core/
├── orchestrator/     # All orchestration logic
├── llm/             # All LLM-related code
├── schemas/         # All validation schemas
└── types/           # All type definitions
```

This makes it easy to:
- Find related code
- Make changes to a feature
- Understand dependencies

## Configuration

### Environment Variables

- `OPENAI_API_KEY`: Required for LLM calls
- Set in `.env.local` for development
- Set in deployment environment for production

### TypeScript Paths

The `tsconfig.json` includes path mapping:

```json
{
  "paths": {
    "@/*": ["./src/*"]
  }
}
```

This allows imports like:
```typescript
import { courseRepository } from "@/db/courseRepository"
```

### Next.js Configuration

Minimal configuration in `next.config.js` - using Next.js defaults for:
- App Router
- Server Components
- API Routes

## Testing Recommendations

### Unit Tests

Test each orchestrator independently:

```typescript
describe("generateBlueprint", () => {
  it("should generate valid blueprint from course spec", async () => {
    const spec: CourseSpec = { /* ... */ }
    const blueprint = await generateBlueprint(spec)
    expect(blueprintSchema.safeParse(blueprint).success).toBe(true)
  })
})
```

### Integration Tests

Test API routes end-to-end:

```typescript
describe("POST /api/course/blueprint", () => {
  it("should return 200 with valid blueprint", async () => {
    const response = await fetch("/api/course/blueprint", {
      method: "POST",
      body: JSON.stringify(courseSpec)
    })
    expect(response.status).toBe(200)
    const blueprint = await response.json()
    expect(blueprint.modules).toBeDefined()
  })
})
```

### Mocking LLM Calls

For faster tests, mock the `runPrompt` function:

```typescript
jest.mock("@/core/llm/runPrompt", () => ({
  runPrompt: jest.fn().mockResolvedValue(mockBlueprint)
}))
```

## Performance Considerations

### Current Performance

- Blueprint generation: ~10-30 seconds (depends on LLM)
- Lesson plan generation: ~10-20 seconds
- Script generation: ~15-30 seconds
- Refinement: ~10-20 seconds

### Optimization Options

1. **Parallel Generation**: Generate multiple lesson plans in parallel
2. **Caching**: Cache blueprints for similar course specs
3. **Streaming**: Use streaming responses for long scripts
4. **Model Selection**: Use faster models (gpt-3.5-turbo) for drafts

## Security Considerations

### Input Validation

All inputs are validated before processing:
- Zod schemas catch malformed data
- Type system prevents incorrect data shapes

### API Key Protection

- Never expose API key to client
- Store in environment variables only
- Rotate regularly

### Rate Limiting

Consider adding rate limiting for production:
- Per-user limits
- Per-endpoint limits
- Global limits

## Deployment Recommendations

### Vercel (Recommended)

```bash
vercel deploy
```

Add `OPENAI_API_KEY` in Vercel environment variables.

### Docker

Create a `Dockerfile`:

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package.json bun.lockb ./
RUN npm install -g bun && bun install
COPY . .
RUN bun run build
CMD ["bun", "start"]
```

### Environment Variables

Required in production:
- `OPENAI_API_KEY`
- `NODE_ENV=production`

## Monitoring Recommendations

### Metrics to Track

1. **LLM Calls**
   - Success rate
   - Latency (p50, p95, p99)
   - Token usage
   - Cost per generation

2. **API Endpoints**
   - Request count
   - Error rate
   - Response time
   - Validation failures

3. **Generation Quality**
   - Schema validation failures
   - User refinement frequency
   - Average refinement iterations

### Logging

Add structured logging:

```typescript
logger.info("blueprint_generated", {
  courseTitle: courseSpec.title,
  moduleCount: blueprint.modules.length,
  duration: Date.now() - startTime,
  promptVersion: "v1"
})
```

## Future Enhancements

### Database Migration

Replace in-memory repository with PostgreSQL:

```typescript
export class PostgresCourseRepository implements CourseRepository {
  async saveBlueprint(spec, blueprint, version) {
    return await db.insert(blueprints).values({
      input: spec,
      output: blueprint,
      promptVersion: version,
      createdAt: new Date()
    })
  }
}
```

### Prompt Versioning System

Create a prompt registry:

```typescript
const promptRegistry = {
  blueprint: {
    v1: getBlueprintPromptV1,
    v2: getBlueprintPromptV2,
  }
}
```

### Streaming Responses

For long scripts, stream tokens as they're generated:

```typescript
const stream = await openai.chat.completions.create({
  model: "gpt-4",
  messages,
  stream: true
})

for await (const chunk of stream) {
  // Send chunk to client
}
```

## Troubleshooting

### Build Failures

**Error**: "OPENAI_API_KEY environment variable is required"
- **Solution**: This should not happen after the lazy initialization fix. If it does, check that `getOpenAI()` is only called at runtime, not at module load time.

### Type Errors

**Error**: "Type 'unknown' is not assignable to type 'Blueprint'"
- **Solution**: Ensure Zod schema parsing is applied after LLM call

### Validation Failures

**Error**: "Expected array of length 5-8, got 4"
- **Solution**: LLM didn't follow prompt instructions. Retry or adjust prompt

### JSON Parsing Errors

**Error**: "Invalid JSON from LLM"
- **Solution**: LLM returned non-JSON. Check response_format is set to "json_object"

## Maintenance

### Updating Dependencies

```bash
bun update
```

Test thoroughly after updates, especially:
- `next`: May change App Router behavior
- `openai`: May change API interface
- `zod`: May change validation behavior

### Prompt Updates

When updating prompts:
1. Increment version (v1 → v2)
2. Create new prompt function
3. Test thoroughly with various inputs
4. Keep old version for rollback
5. Monitor generation quality

### Schema Updates

When updating schemas:
1. Ensure backward compatibility
2. Update corresponding TypeScript types
3. Update prompts if needed
4. Add migration for existing data
