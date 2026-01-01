# Swagger API Documentation

## Overview

CourseBuilderAI now includes interactive API documentation using Swagger UI (OpenAPI 3.0).

## Access

**URL**: http://localhost:3000/api-docs

## Features

### 1. Interactive Testing
- Test all API endpoints directly in your browser
- No need for curl, Postman, or other HTTP clients
- Fill in request bodies using the UI
- See responses in real-time

### 2. Complete Schema Documentation
- View all request/response schemas
- See required vs optional fields
- Check data types and constraints
- View example values

### 3. Try It Out
Each endpoint has a "Try it out" button that allows you to:
1. Click "Try it out"
2. Edit the request body JSON
3. Click "Execute"
4. View the response

## Available Endpoints

### 1. POST /api/course/blueprint
Generate a complete course blueprint from specifications.

**Example Request**:
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

### 2. POST /api/course/lesson-plan
Create a detailed lesson plan for a specific lesson.

**Requires**: courseSpec, blueprint (from step 1), and lessonMeta

### 3. POST /api/course/lesson-script
Generate a spoken lesson script from a lesson plan.

**Requires**: courseSpec, lessonPlan (from step 2)
**Optional**: constraints (maxLength, toneOverride)

### 4. POST /api/course/refine-lesson
Refine an existing lesson script based on feedback.

**Requires**: lessonPlan, script (from step 3), feedback

## Quick Start

1. Start the development server:
```bash
bun dev
```

2. Open your browser to:
```
http://localhost:3000/api-docs
```

3. Make sure you have set your `GROQ_API_KEY` in `.env.local`

4. Click on any endpoint to expand it

5. Click "Try it out"

6. Edit the example JSON request body

7. Click "Execute"

8. View the response below

## Example Workflow in Swagger UI

### Step 1: Generate Blueprint
1. Expand `POST /api/course/blueprint`
2. Click "Try it out"
3. Use the example or modify:
```json
{
  "title": "Python for Beginners",
  "audience": "Complete programming novices",
  "level": "beginner",
  "goal": "Learn Python fundamentals",
  "teachingStyle": "Patient, step-by-step",
  "language": "English"
}
```
4. Click "Execute"
5. Copy the response blueprint

### Step 2: Generate Lesson Plan
1. Expand `POST /api/course/lesson-plan`
2. Click "Try it out"
3. Paste the courseSpec and blueprint from step 1
4. Pick a lesson from the blueprint and add its title/objective
5. Click "Execute"
6. Copy the response lesson plan

### Step 3: Generate Script
1. Expand `POST /api/course/lesson-script`
2. Click "Try it out"
3. Paste the courseSpec and lessonPlan from previous steps
4. Optionally add constraints
5. Click "Execute"
6. View the generated script

### Step 4: Refine (Optional)
1. Expand `POST /api/course/refine-lesson`
2. Click "Try it out"
3. Paste lessonPlan and script from previous steps
4. Add feedback like: "Add more examples and simplify language"
5. Click "Execute"
6. View the refined script

## Configuration

### OpenAPI Specification
The API specification is defined in `/public/openapi.json`

To modify:
1. Edit `/public/openapi.json`
2. Restart the dev server
3. Refresh the Swagger UI page

### Customizing Swagger UI
The Swagger UI page is at `/src/app/api-docs/page.tsx`

You can customize:
- Theme
- Layout
- Default expansions
- Filters

## Server URLs

The OpenAPI spec includes the development server by default:
```json
"servers": [
  {
    "url": "http://localhost:3000",
    "description": "Development server"
  }
]
```

For production, add your production URL to this array.

## Benefits Over curl/Postman

1. **No Installation**: Works directly in the browser
2. **Always Up-to-Date**: Schemas are version-controlled with code
3. **Self-Documenting**: Code changes are reflected in docs
4. **Easy Sharing**: Just share the URL
5. **Type Safety**: Schemas show exact data structures

## Troubleshooting

### Swagger UI Not Loading
- Check that dependencies are installed: `bun install`
- Verify `/public/openapi.json` exists
- Check browser console for errors

### CORS Errors
- Make sure you're accessing from the same origin (localhost:3000)
- API routes are on the same server, so CORS shouldn't be an issue

### 404 on /api-docs
- Verify the file exists: `/src/app/api-docs/page.tsx`
- Restart the dev server

### API Errors in Swagger
- Check that `GROQ_API_KEY` is set in `.env.local`
- Verify request body matches schema
- Check the response error message for details

## Production Deployment

When deploying:

1. Update the servers URL in `/public/openapi.json`:
```json
"servers": [
  {
    "url": "https://your-domain.com",
    "description": "Production server"
  },
  {
    "url": "http://localhost:3000",
    "description": "Development server"
  }
]
```

2. The Swagger UI will automatically use the first server URL

3. Consider adding authentication if needed

## Additional Resources

- [OpenAPI 3.0 Specification](https://swagger.io/specification/)
- [Swagger UI Documentation](https://swagger.io/tools/swagger-ui/)
- [swagger-ui-react on npm](https://www.npmjs.com/package/swagger-ui-react)
