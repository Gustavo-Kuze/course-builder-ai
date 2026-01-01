# API Test Examples

Complete request body examples for testing all CourseBuilderAI endpoints.

## Endpoint 1: Generate Blueprint

**URL**: `POST http://localhost:3000/api/course/blueprint`

### Example 1: Machine Learning Course

```json
{
  "title": "Introduction to Machine Learning",
  "audience": "Computer science students with basic programming knowledge in Python",
  "level": "intermediate",
  "goal": "Understand core ML concepts and implement basic algorithms from scratch",
  "teachingStyle": "Practical, hands-on with real examples and interactive coding exercises",
  "language": "English"
}
```

### Example 2: Web Development Course

```json
{
  "title": "Modern Web Development with React",
  "audience": "Junior developers familiar with HTML, CSS, and basic JavaScript",
  "level": "intermediate",
  "goal": "Build professional single-page applications using React and modern tooling",
  "teachingStyle": "Project-based learning with step-by-step guidance",
  "language": "English"
}
```

### Example 3: Beginner Course

```json
{
  "title": "Python Programming for Complete Beginners",
  "audience": "Anyone with no prior programming experience",
  "level": "beginner",
  "goal": "Learn Python fundamentals and write simple programs to solve real problems",
  "teachingStyle": "Patient, step-by-step explanations with lots of practice exercises",
  "language": "English"
}
```

---

## Endpoint 2: Generate Lesson Plan

**URL**: `POST http://localhost:3000/api/course/lesson-plan`

**Note**: You need to first generate a blueprint, then use it here.

### Example Request

```json
{
  "courseSpec": {
    "title": "Introduction to Machine Learning",
    "audience": "Computer science students with basic programming knowledge in Python",
    "level": "intermediate",
    "goal": "Understand core ML concepts and implement basic algorithms from scratch",
    "teachingStyle": "Practical, hands-on with real examples and interactive coding exercises",
    "language": "English"
  },
  "blueprint": {
    "courseDescription": "This comprehensive course introduces students to the fundamental concepts of machine learning, covering both theoretical foundations and practical implementation. Students will learn to build and train various ML models using Python.",
    "learningObjectives": [
      "Understand the core concepts of supervised and unsupervised learning",
      "Implement linear regression and classification algorithms from scratch",
      "Apply feature engineering and data preprocessing techniques",
      "Evaluate model performance using appropriate metrics",
      "Use popular ML libraries like scikit-learn effectively"
    ],
    "modules": [
      {
        "title": "Introduction to Machine Learning",
        "description": "Understanding what machine learning is and its applications",
        "lessons": [
          {
            "title": "What is Machine Learning?",
            "objective": "Understand the definition, types, and real-world applications of machine learning",
            "estimatedDurationMinutes": 45
          },
          {
            "title": "Setting Up Your ML Environment",
            "objective": "Install and configure Python, Jupyter, and essential ML libraries",
            "estimatedDurationMinutes": 30
          }
        ]
      },
      {
        "title": "Supervised Learning Fundamentals",
        "description": "Learning about regression and classification problems",
        "lessons": [
          {
            "title": "Linear Regression Basics",
            "objective": "Understand and implement simple linear regression",
            "estimatedDurationMinutes": 60
          },
          {
            "title": "Classification with Logistic Regression",
            "objective": "Learn binary classification using logistic regression",
            "estimatedDurationMinutes": 60
          }
        ]
      }
    ]
  },
  "lessonMeta": {
    "title": "Linear Regression Basics",
    "objective": "Understand and implement simple linear regression"
  }
}
```

---

## Endpoint 3: Generate Lesson Script

**URL**: `POST http://localhost:3000/api/course/lesson-script`

**Note**: You need a lesson plan from Endpoint 2.

### Example Request (without constraints)

```json
{
  "courseSpec": {
    "title": "Introduction to Machine Learning",
    "audience": "Computer science students with basic programming knowledge in Python",
    "level": "intermediate",
    "goal": "Understand core ML concepts and implement basic algorithms from scratch",
    "teachingStyle": "Practical, hands-on with real examples and interactive coding exercises",
    "language": "English"
  },
  "lessonPlan": {
    "lessonObjective": "Understand and implement simple linear regression",
    "keyConcepts": [
      "Linear relationship between variables",
      "Hypothesis function (y = mx + b)",
      "Cost function (Mean Squared Error)",
      "Gradient descent optimization",
      "Model training and prediction"
    ],
    "teachingFlow": [
      "Introduce the concept of linear regression with a real-world example",
      "Explain the mathematical foundation: y = mx + b",
      "Demonstrate how to visualize data and relationships",
      "Show the cost function and why we minimize it",
      "Walk through gradient descent step-by-step",
      "Implement linear regression from scratch in Python",
      "Test the model with example data",
      "Discuss when to use linear regression"
    ],
    "exampleSuggestions": [
      "Predicting house prices based on square footage",
      "Estimating salary based on years of experience",
      "Forecasting temperature based on historical data"
    ],
    "commonMisunderstandings": [
      "Confusing correlation with causation",
      "Thinking linear regression works for all relationships",
      "Not understanding the role of the cost function",
      "Confusing the learning rate with the slope"
    ]
  }
}
```

### Example Request (with constraints)

```json
{
  "courseSpec": {
    "title": "Python Programming for Complete Beginners",
    "audience": "Anyone with no prior programming experience",
    "level": "beginner",
    "goal": "Learn Python fundamentals and write simple programs",
    "teachingStyle": "Patient, step-by-step explanations with lots of practice",
    "language": "English"
  },
  "lessonPlan": {
    "lessonObjective": "Understand what variables are and how to use them in Python",
    "keyConcepts": [
      "What is a variable",
      "Variable naming rules",
      "Different data types (strings, numbers, booleans)",
      "Assignment operator",
      "Printing variables"
    ],
    "teachingFlow": [
      "Explain what a variable is using real-world analogies",
      "Show how to create a variable in Python",
      "Demonstrate different data types",
      "Practice with interactive examples",
      "Common mistakes to avoid"
    ],
    "exampleSuggestions": [
      "Storing a name in a variable",
      "Storing age and calculating birth year",
      "Creating a simple greeting program"
    ],
    "commonMisunderstandings": [
      "Variables are not 'boxes' but labels pointing to values",
      "Variable names are case-sensitive",
      "You can change what a variable points to"
    ]
  },
  "constraints": {
    "maxLength": 1500,
    "toneOverride": "very friendly and encouraging, like talking to a friend"
  }
}
```

---

## Endpoint 4: Refine Lesson Script

**URL**: `POST http://localhost:3000/api/course/refine-lesson`

**Note**: You need a lesson plan and script from previous steps.

### Example Request 1: Request More Examples

```json
{
  "lessonPlan": {
    "lessonObjective": "Understand and implement simple linear regression",
    "keyConcepts": [
      "Linear relationship between variables",
      "Hypothesis function (y = mx + b)",
      "Cost function (Mean Squared Error)",
      "Gradient descent optimization",
      "Model training and prediction"
    ],
    "teachingFlow": [
      "Introduce the concept of linear regression with a real-world example",
      "Explain the mathematical foundation",
      "Show the cost function",
      "Walk through gradient descent",
      "Implement in Python"
    ],
    "exampleSuggestions": [
      "Predicting house prices based on square footage",
      "Estimating salary based on years of experience"
    ],
    "commonMisunderstandings": [
      "Confusing correlation with causation",
      "Not understanding the cost function"
    ]
  },
  "script": {
    "script": "Welcome to our lesson on linear regression! Today we're going to explore one of the most fundamental algorithms in machine learning. Linear regression is used when we want to predict a continuous value based on one or more input features. Let's start with a simple example: imagine you want to predict house prices based on their size in square feet. This is a perfect use case for linear regression because there's typically a linear relationship - bigger houses tend to cost more..."
  },
  "feedback": "Add more concrete examples with actual numbers. Show a step-by-step calculation for at least one example so students can follow along."
}
```

### Example Request 2: Simplify Language

```json
{
  "lessonPlan": {
    "lessonObjective": "Understand what variables are and how to use them in Python",
    "keyConcepts": [
      "What is a variable",
      "Variable naming rules",
      "Different data types",
      "Assignment operator"
    ],
    "teachingFlow": [
      "Explain variables using analogies",
      "Show how to create variables",
      "Practice with examples"
    ],
    "exampleSuggestions": [
      "Storing a name",
      "Storing age"
    ],
    "commonMisunderstandings": [
      "Variables are labels, not boxes"
    ]
  },
  "script": {
    "script": "Hello everyone! In this lesson, we'll delve into the concept of variables in Python. Variables serve as symbolic references to values stored in your computer's memory allocation. When you instantiate a variable, you're essentially creating a binding between an identifier and a memory address that contains your data..."
  },
  "feedback": "This is too technical for complete beginners. Please use much simpler language, avoid jargon like 'instantiate', 'binding', 'memory allocation'. Use everyday analogies that anyone can understand."
}
```

### Example Request 3: Add Interactive Elements

```json
{
  "lessonPlan": {
    "lessonObjective": "Learn how to use if statements in Python",
    "keyConcepts": [
      "Boolean conditions",
      "if, elif, else keywords",
      "Indentation",
      "Comparison operators"
    ],
    "teachingFlow": [
      "Explain conditional logic",
      "Show if statement syntax",
      "Demonstrate elif and else",
      "Practice with examples"
    ],
    "exampleSuggestions": [
      "Checking if someone is old enough to vote",
      "Temperature-based clothing suggestions"
    ],
    "commonMisunderstandings": [
      "Forgetting the colon after conditions",
      "Incorrect indentation"
    ]
  },
  "script": {
    "script": "Welcome to our lesson on if statements! If statements allow your program to make decisions based on conditions. The syntax is simple: you write 'if', then a condition, then a colon, and then the code to run if the condition is true. For example, if age is greater than 18, we print 'You can vote'. Let's look at some examples..."
  },
  "feedback": "Add pause points where students should try coding along. Include challenges or questions for them to think about before you reveal the answer. Make it more interactive."
}
```

### Example Request 4: Shorten the Script

```json
{
  "lessonPlan": {
    "lessonObjective": "Understand list comprehensions in Python",
    "keyConcepts": [
      "List comprehension syntax",
      "Filtering with conditions",
      "Transforming data"
    ],
    "teachingFlow": [
      "Show traditional loops first",
      "Introduce list comprehension syntax",
      "Compare readability"
    ],
    "exampleSuggestions": [
      "Squaring numbers",
      "Filtering even numbers"
    ],
    "commonMisunderstandings": [
      "Overusing list comprehensions for complex logic"
    ]
  },
  "script": {
    "script": "Hello everyone! Today we're diving deep into list comprehensions, one of Python's most elegant features. List comprehensions provide a concise way to create lists based on existing lists. Before we get into list comprehensions, let me first show you how we would traditionally create a new list by iterating through an existing list. Imagine we have a list of numbers from 1 to 10, and we want to create a new list containing the squares of these numbers. Using a traditional for loop, we would first create an empty list, then iterate through each number, square it, and append it to our new list. This works perfectly fine, but it takes multiple lines of code. Now, let me show you the list comprehension way of doing the exact same thing..."
  },
  "feedback": "This script is too long. Cut it down to focus only on the essential points. Remove the lengthy introduction and get to the examples faster. Target 50% of the current length."
}
```

---

## Quick Test Workflow

### Step 1: Generate Blueprint
Copy and paste Example 1 from Endpoint 1 into Swagger UI or your HTTP client.

### Step 2: Generate Lesson Plan
1. Copy the blueprint response from Step 1
2. Pick any lesson from the blueprint
3. Use the full example from Endpoint 2, replacing the `lessonMeta` with your chosen lesson's title and objective

### Step 3: Generate Script
1. Use the courseSpec from Step 1
2. Use the lessonPlan from Step 2
3. Optionally add constraints

### Step 4: Refine Script (Optional)
1. Use the lessonPlan from Step 2
2. Use the script from Step 3
3. Add specific feedback about what to change

---

## Testing in Swagger UI

1. Go to http://localhost:3000/api-docs
2. Click on the endpoint you want to test
3. Click "Try it out"
4. Delete the example JSON
5. Copy and paste one of the examples above
6. Click "Execute"
7. Scroll down to see the response

---

## Testing with curl

### Blueprint Example
```bash
curl -X POST http://localhost:3000/api/course/blueprint \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Python Programming for Complete Beginners",
    "audience": "Anyone with no prior programming experience",
    "level": "beginner",
    "goal": "Learn Python fundamentals and write simple programs",
    "teachingStyle": "Patient, step-by-step explanations",
    "language": "English"
  }'
```

### Save Response to File
```bash
curl -X POST http://localhost:3000/api/course/blueprint \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Python Programming for Complete Beginners",
    "audience": "Anyone with no prior programming experience",
    "level": "beginner",
    "goal": "Learn Python fundamentals",
    "teachingStyle": "Patient, step-by-step",
    "language": "English"
  }' > blueprint.json
```

---

## Common Issues

### Issue: "Validation failed"
**Solution**: Check that all required fields are present:
- title, audience, level, goal, teachingStyle, language (for courseSpec)

### Issue: "Invalid JSON from LLM"
**Solution**: The LLM occasionally returns malformed JSON. Just retry the request.

### Issue: Empty response
**Solution**: Check that your GROQ_API_KEY is set in .env.local

### Issue: Timeout
**Solution**: LLM responses can take 10-30 seconds. Be patient or increase timeout settings.
