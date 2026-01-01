export default function Home() {
  return (
    <main>
      <h1>CourseBuilderAI</h1>
      <p>API-based course generation system</p>
      <h2>Available Endpoints:</h2>
      <ul>
        <li>POST /api/course/blueprint</li>
        <li>POST /api/course/lesson-plan</li>
        <li>POST /api/course/lesson-script</li>
        <li>POST /api/course/refine-lesson</li>
      </ul>
    </main>
  )
}
