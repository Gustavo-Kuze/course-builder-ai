# API Test Examples

This folder contains ready-to-use JSON examples for testing all CourseBuilderAI API endpoints.

## Quick Start

1. Start the development server:
   ```bash
   bun dev
   ```

2. Go to http://localhost:3000/api-docs

3. For each endpoint, copy the corresponding JSON file content

## Files

### Blueprint Generation
- `1-blueprint-request.json` - Machine Learning course (intermediate)
- `1-blueprint-request-beginner.json` - Python course (beginner)

### Lesson Plan Generation
- `2-lesson-plan-request.json` - Complete example with courseSpec + blueprint

### Lesson Script Generation
- `3-lesson-script-request.json` - Includes courseSpec, lessonPlan, and constraints

### Lesson Refinement
- `4-refine-lesson-request.json` - Example with feedback for improvements

### Complete Documentation
- `api-test-examples.md` - Detailed examples for all endpoints with multiple variations
- `test-api.json` - Legacy test data

## Usage in Swagger UI

1. Open http://localhost:3000/api-docs
2. Click on the endpoint you want to test
3. Click "Try it out"
4. Copy content from the corresponding JSON file
5. Paste into the request body
6. Click "Execute"

## Usage with curl

```bash
# Example: Generate Blueprint
curl -X POST http://localhost:3000/api/course/blueprint \
  -H "Content-Type: application/json" \
  -d @examples/1-blueprint-request.json

# Example: Save response to file
curl -X POST http://localhost:3000/api/course/blueprint \
  -H "Content-Type: application/json" \
  -d @examples/1-blueprint-request-beginner.json \
  > my-blueprint.json
```

## Workflow

The typical workflow is:

1. **Generate Blueprint** using `1-blueprint-request.json`
2. Copy the response
3. **Generate Lesson Plan** - Use the blueprint from step 1 in `2-lesson-plan-request.json`
4. Copy the lesson plan response
5. **Generate Script** - Use the lesson plan from step 3 in `3-lesson-script-request.json`
6. **Refine** (optional) - Use the script from step 4 in `4-refine-lesson-request.json`

## Tips

- Start with the beginner examples - they're simpler and faster to test
- Save responses to files so you can reuse them in subsequent steps
- The Swagger UI is the easiest way to test - it handles formatting automatically
- Check `api-test-examples.md` for more variations and detailed explanations
