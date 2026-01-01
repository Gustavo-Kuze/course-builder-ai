# CORS Fix for Swagger UI and External API Calls

## Problem

When accessing the API hosted on Vercel from Swagger UI or other external clients, requests were failing with:
- `TypeError: Load failed`
- CORS (Cross-Origin Resource Sharing) errors
- Blocked by browser security policies

## Solution

Added proper CORS headers to all API endpoints to allow cross-origin requests.

## Changes Made

### 1. Created CORS Middleware (`src/app/api/course/middleware.ts`)

```typescript
export function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  }
}

export function handleOptions() {
  return new NextResponse(null, {
    status: 200,
    headers: corsHeaders(),
  })
}
```

### 2. Updated All API Routes

Added CORS support to all four endpoints:
- `/api/course/blueprint`
- `/api/course/lesson-plan`
- `/api/course/lesson-script`
- `/api/course/refine-lesson`

Each route now:
1. Exports an `OPTIONS` handler for preflight requests
2. Includes CORS headers in all responses (success and error)

**Example:**
```typescript
import { corsHeaders, handleOptions } from "../middleware"

export async function OPTIONS() {
  return handleOptions()
}

export async function POST(request: NextRequest) {
  try {
    // ... processing logic
    return NextResponse.json(data, {
      status: 200,
      headers: corsHeaders()
    })
  } catch (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 400, headers: corsHeaders() }
    )
  }
}
```

### 3. Updated OpenAPI Specification

Added production server URL to `public/openapi.json`:

```json
"servers": [
  {
    "url": "https://course-builder-ai.vercel.app",
    "description": "Production server"
  },
  {
    "url": "http://localhost:3000",
    "description": "Development server"
  }
]
```

## How It Works

### CORS Headers Explained

1. **Access-Control-Allow-Origin: \***
   - Allows requests from any origin
   - For production, you might want to restrict this to specific domains

2. **Access-Control-Allow-Methods**
   - Specifies which HTTP methods are allowed
   - Includes GET, POST, PUT, DELETE, OPTIONS

3. **Access-Control-Allow-Headers**
   - Specifies which headers can be sent in requests
   - Includes Content-Type and Authorization

### Preflight Requests

Browsers send an OPTIONS request before the actual request (preflight):
1. Browser sends OPTIONS request
2. Server responds with CORS headers
3. Browser checks if the actual request is allowed
4. If allowed, browser sends the actual POST/GET request

Our `OPTIONS` handler responds to these preflight requests.

## Testing the Fix

### Test in Swagger UI

1. Go to https://course-builder-ai.vercel.app/api-docs
2. Click on any endpoint
3. Click "Try it out"
4. Enter request body
5. Click "Execute"
6. Should now work without CORS errors

### Test with curl

```bash
# This should work from anywhere
curl -X POST https://course-builder-ai.vercel.app/api/course/blueprint \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Course",
    "audience": "Developers",
    "level": "intermediate",
    "goal": "Learn something",
    "teachingStyle": "Practical",
    "language": "English"
  }'
```

### Test with JavaScript (from browser)

```javascript
fetch('https://course-builder-ai.vercel.app/api/course/blueprint', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    title: "Test Course",
    audience: "Developers",
    level: "intermediate",
    goal: "Learn something",
    teachingStyle: "Practical",
    language: "English"
  })
})
.then(res => res.json())
.then(data => console.log(data))
.catch(error => console.error('Error:', error))
```

## Security Considerations

### Current Setting (Development-Friendly)

```typescript
"Access-Control-Allow-Origin": "*"
```

This allows **any** website to call your API. Fine for:
- Development
- Public APIs
- Testing

### Production Recommendations

For production, consider restricting origins:

```typescript
export function corsHeaders(origin?: string) {
  const allowedOrigins = [
    'https://your-frontend.com',
    'https://your-app.com',
  ]

  const allowOrigin = origin && allowedOrigins.includes(origin)
    ? origin
    : allowedOrigins[0]

  return {
    "Access-Control-Allow-Origin": allowOrigin,
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  }
}
```

Then in your routes:

```typescript
export async function POST(request: NextRequest) {
  const origin = request.headers.get('origin')
  // ...
  return NextResponse.json(data, {
    headers: corsHeaders(origin)
  })
}
```

### Adding Authentication

If you add authentication later, make sure to include credentials:

```typescript
// Server side
"Access-Control-Allow-Credentials": "true"

// Client side (fetch)
fetch(url, {
  credentials: 'include',
  // ...
})
```

## Troubleshooting

### Still Getting CORS Errors?

1. **Check Browser Console**
   - Look for specific CORS error messages
   - Check which header is missing

2. **Verify Headers in Response**
   - Open DevTools → Network tab
   - Look at the response headers
   - Ensure CORS headers are present

3. **Clear Browser Cache**
   - Hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
   - Or open in incognito/private window

4. **Check Vercel Deployment**
   - Ensure latest code is deployed
   - Check deployment logs for errors
   - Verify environment variables are set

### Common Issues

**Issue**: "No 'Access-Control-Allow-Origin' header is present"
- **Fix**: CORS headers not being sent. Check that middleware is imported.

**Issue**: "CORS policy: Response to preflight request doesn't pass"
- **Fix**: OPTIONS handler missing. Ensure `export async function OPTIONS()` exists.

**Issue**: "Request blocked by CORS policy"
- **Fix**: Check allowed methods and headers match what you're sending.

## Deployment

After making these changes:

1. Commit the changes
2. Push to GitHub
3. Vercel will auto-deploy
4. Test the endpoints once deployed

## Files Modified

- ✅ `src/app/api/course/middleware.ts` (new)
- ✅ `src/app/api/course/blueprint/route.ts`
- ✅ `src/app/api/course/lesson-plan/route.ts`
- ✅ `src/app/api/course/lesson-script/route.ts`
- ✅ `src/app/api/course/refine-lesson/route.ts`
- ✅ `public/openapi.json`

## Related Documentation

- [MDN: CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)
- [Next.js: Route Handlers](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)
- [Vercel: CORS](https://vercel.com/guides/how-to-enable-cors)
