from services.ai_service import ai_service

# Test the Azure OpenAI connection
result = ai_service.generate_resume_improvements(
    resume_text="Experienced software engineer with Python and JavaScript skills.",
    jd_text="Looking for a senior developer with Python, Docker, and AWS experience.",
    match_score=65.5,
    fit_skills=["python"],
    missing_skills=["docker", "aws"]
)

if result["success"]:
    print("✅ Azure OpenAI is working!")
    print(f"Provider: {result['provider']}")
    print(f"Model: {result['model']}")
    print(f"Tokens used: {result.get('tokens_used', 'N/A')}")
    print("\nSuggestions:")
    print(result["suggestions"][:500] + "...")
else:
    print("❌ Error:", result["error"])