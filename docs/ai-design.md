# InterviewMate – AI Design

## 1. Overview

This document describes the AI/ML design of InterviewMate, including:
- Resume parsing
- Job description parsing
- Semantic matching
- Interview question generation
- Context-aware answer scoring

It also defines prompt templates used when integrating LLMs.

---

## 2. Resume Parsing

### 2.1 Goals
- Extract structured information from user CVs:
  - Personal info (optional)
  - Skills (languages, frameworks, tools)
  - Experience (companies, roles, durations)
  - Education
- Generate a normalized **Resume Profile** object for matching and question generation.

### 2.2 Pipeline

1. **File ingestion**
   - Input: PDF/DOCX file (URL from object storage)
   - Libraries:
     - PDF: e.g., `pdfplumber`
     - DOCX: e.g., `python-docx`

2. **Text normalization**
   - Remove headers/footers where possible
   - Normalize whitespace
   - Split into sections using headings (e.g., "Experience", "Education", "Skills")

3. **Skill extraction**
   - Maintain a skill dictionary for common languages/tools/frameworks.
   - Use:
     - Keyword lookup
     - Embedding similarity for fuzzy matching of skills

4. **Experience extraction**
   - Use regex + simple patterns for:
     - Company name
     - Job title
     - Duration (e.g., `2022–2024` or `Jan 2022 - Present`)
   - Optionally use an LLM to convert raw text into structured JSON.

5. **Resume profile**
   - Construct a JSON object like:

```json
{
  "summary": "Software engineering student with AI specialization...",
  "skills": ["Python", "PyTorch", "Docker", "REST API"],
  "languages": ["English", "Vietnamese"],
  "experience": [
    {
      "company": "ABC Labs",
      "title": "AI Intern",
      "start_date": "2024-06-01",
      "end_date": "2024-09-01",
      "highlights": ["Trained classification model", "Deployed REST API"]
    }
  ],
  "education": [
    {
      "school": "XYZ University",
      "degree": "BSc Software Engineering",
      "start_date": "2022-09-01",
      "expected_graduation": "2026-06-01"
    }
  ],
  "focus_areas": ["Backend", "Machine Learning"]
}

```
## 3. Job Requirement Profile 
``` json
{
  "title": "Junior Backend Engineer",
  "level": "Junior",
  "tech_stack": ["Java", "Spring Boot", "PostgreSQL", "Docker"],
  "core_skills": ["REST API design", "OOP", "Database modeling"],
  "soft_skills": ["communication", "teamwork", "problem solving"],
  "focus_areas": ["scalability", "clean architecture", "code quality"]
}

```
## 4. Semantic Matching ( CV - JD)
### 4.1 Goals

Compute:
- Overall match score
- Skill overlap and gaps
- Summary of fit

### 4.2 Method

1. Vector-based similarity

- Use embeddings of resume and JD chunks.

- Compute cosine similarity between: 
+ Resume skills vs JD skills
+ Resume experience descriptions vs JD responsibilities

2. Rule-based signals

- Overlap between discrete skill sets (exact match).

- Bonus for direct match in job titles or tech stack.

3. Score Aggregation

- Combine signals into a final score:

`score=0.6⋅similarity+0.4⋅skill_overlap`

``` json 
{
  "match_score": 0.78,
  "overlap_skills": ["Java", "REST API", "PostgreSQL"],
  "missing_skills": ["Spring Boot", "Docker"],
  "summary": "Good backend fundamentals but limited Spring Boot experience."
}
```
## 5. Interview Question 
### SYSTEM:
You are an expert technical interviewer designing questions for a software engineer candidate.
You must generate a JSON array of questions only.

Each question must include:
- id: short unique string
- category: one of ["technical", "system_design", "behavioral"]
- difficulty: one of ["easy", "medium", "hard"]
- question: the question text
- rubric: an object describing how to score the answer with criteria and weights for a 0–10 scale.

### USER:
Candidate resume profile (JSON):
{resume_profile}

Job requirement profile (JSON):
{job_profile}

Match analysis (JSON):
{match_profile}

### Constraints:
- Focus on the technologies and skills in the job requirement profile.
- Include some questions that explore the candidate's weaker or missing skills.
- Include at least 5 and at most 15 questions.
- Return ONLY a JSON array with no comments or explanation.

``` json 
[
  {
    "id": "q1",
    "category": "technical",
    "difficulty": "medium",
    "question": "Explain how you would design and implement a REST API in Spring Boot to manage user accounts, including validation and error handling.",
    "rubric": {
      "criteria": [
        {"name": "HTTP and REST understanding", "weight": 0.25},
        {"name": "Spring Boot concepts and layers", "weight": 0.25},
        {"name": "Validation and error handling", "weight": 0.25},
        {"name": "Clarity and structure of explanation", "weight": 0.25}
      ]
    }
  }
]

```
## 6. Context-Aware Answer Scoring 
### SYSTEM:
You are an experienced technical interviewer.
Your task is to evaluate a candidate's answer based on a rubric and job context.
You MUST output a JSON object only.

### USER:
Job requirement profile (JSON):
{job_profile}

Question object (JSON):
{question}

Candidate answer (plain text):
{answer}

### Instructions:
1. Use the rubric from the question to score each criterion from 0 to 10.
2. Consider the job's focus areas and adjust your evaluation accordingly.
3. Provide:
   - overall_score: number from 0 to 10
   - criterion_scores: array of {name, score}
   - strengths: array of short bullet points
   - weaknesses: array of short bullet points
   - improved_answer: an example of a better answer written concisely.
4. Return ONLY a JSON object, no explanation or commentary.

``` json 
{
  "overall_score": 7.5,
  "criterion_scores": [
    {"name": "HTTP and REST understanding", "score": 8},
    {"name": "Spring Boot concepts and layers", "score": 7},
    {"name": "Validation and error handling", "score": 6.5},
    {"name": "Clarity and structure of explanation", "score": 8}
  ],
  "strengths": [
    "Good understanding of REST and HTTP methods",
    "Clear explanation of controller and service layers"
  ],
  "weaknesses": [
    "Limited discussion of validation strategies",
    "Error handling not covered in enough detail"
  ],
  "improved_answer": "A stronger answer would explicitly describe the controller, service, and repository layers, discuss using @Valid and Bean Validation for request bodies, and explain how to use @ControllerAdvice and exception handlers to return consistent error responses."
}

```
## 7. AI Video Interview Room
### What Feature You Are Proposing

Candidate joins a video room and system:

- records face

- monitors emotion

- monitors hesitation

- monitors engagement

- analyzes voice / speech content

- evaluates interview answers

Using Computer Vision - OpenCV