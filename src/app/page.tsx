export default function Home() {
  return (
    <main style={{ padding: "2rem", fontFamily: "system-ui, sans-serif" }}>
      <h1>CourseBuilderAI</h1>
      <p>AI-powered course generation system using Groq (Kimi K2)</p>

      <div style={{ marginTop: "2rem", padding: "1rem", background: "#f5f5f5", borderRadius: "8px" }}>
        <h2>📚 API Documentation</h2>
        <p>
          <a
            href="/api-docs"
            style={{
              color: "#0070f3",
              textDecoration: "none",
              fontSize: "1.1rem",
              fontWeight: "500"
            }}
          >
            → Open Interactive API Docs (Swagger UI)
          </a>
        </p>
        <p style={{ fontSize: "0.9rem", color: "#666" }}>
          Test all endpoints directly in your browser
        </p>
      </div>

      <h2 style={{ marginTop: "2rem" }}>Available Endpoints:</h2>
      <ul style={{ lineHeight: "1.8" }}>
        <li><code>POST /api/course/blueprint</code> - Generate course structure</li>
        <li><code>POST /api/course/lesson-plan</code> - Create detailed lesson plan</li>
        <li><code>POST /api/course/lesson-script</code> - Generate spoken lesson script</li>
        <li><code>POST /api/course/refine-lesson</code> - Refine script with feedback</li>
      </ul>
    </main>
  )
}
