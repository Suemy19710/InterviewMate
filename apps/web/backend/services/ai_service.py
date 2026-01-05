import os 
from typing import Dict, List
from openai import AzureOpenAI, OpenAI
from dotenv import load_dotenv

load_dotenv()

class AIService: 
    def __init__(self):
        self.provider = os.getenv("AI_PROVIDER", "openai")
        if self.provider == "azure":
            # Aure OpenAi Configuration 
            self.client = AzureOpenAI(
                api_key=os.getenv("AZURE_OPENAI_API_KEY"), 
                api_version=os.getenv("AZURE_OPENAI_API_VERSION"), 
                azure_endpoint=os.getenv("AZURE_OPENAI_ENDPOINT")
            )
            self.model=os.getenv("AZURE_OPENAI_DEPLOYMENT_NAME")
            print(f"✅ Initialized Azure OpenAI with deployment: {self.model}")

        elif self.provider == "openai":
            # Regular OpenAI Configuration 
            self.client = OpenAI(api_key=os.getenv("OPEN_API_KEY"))
            self.model = os.getenv("OPENAI_MODEL", "gpt-4o-mini")
            print(f"✅ Initialized OpenAI with model: {self.model}")
        elif self.provider == "hugging-face":
            self.client = OpenAI(
                base_url=os.getenv("HF_BASE_URL"), 
                api_key=os.getenv("HF_TOKEN"), 

            )
            self.model=os.getenv("HF_MODEL", "MiniMaxAI/MiniMax-M2.1:novita")
            print(f"✅ Initialized OpenAI with model: {self.model}")

        else:
            raise ValueError(f"Unknown AI provider: {self.provider}")
        
    def generate_resume_improvements(
            self, 
            resume_text: str, 
            jd_text:str, 
            match_score:float, 
            fit_skills: List[str], 
            missing_skills: List[str]
    ) -> Dict: 
        """
        Generate AI-powered resume improvement suggestions 
        """
        prompt = self._build_improvement_prompt(
            resume_text, jd_text, match_score, fit_skills, missing_skills
        )
        try:
            response = self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {
                        "role": "system", 
                        "content": "You are an expert resume coach and ATS specialist. Provide specific, actionable advice to improve resume-job match scores."
                    }
                    , 
                    {
                        "role":"user", 
                        "content": prompt
                    }
                ], 
                temperature=0.7, 
                max_tokens=2000
            )
            suggestions = response.choices[0].message.content

            return{
                "success": True, 
                "suggestions": suggestions, 
                "provider": self.provider, 
                "model": self.model, 
                "tokens_used": response.usage.total_tokens if response.usage else 0 
            }
        except Exception as e:
            print(f"❌ AI Error: {str(e)}")
            return {
                "success": False,
                "error": str(e),
                "provider": self.provider
            }            
        
    def _build_improvement_prompt(
        self, 
        resume_text:str, 
        jd_text:str, 
        match_score:float, 
        fit_skills:List[str], 
        missing_skills:List[str]
    ) -> str:
        """Build the prompt for AI"""
        return f"""You are an expert career coach and ATS (Applicant Tracking System) specialist. Analyze this resume against the job description and provide specific, actionable improvement suggestions.

**Job Description:**
{jd_text[:1500]}

**Resume Content:**
{resume_text[:2000]}

**Current Match Analysis:**
- Match Score: {match_score}%
- Skills Present: {', '.join(fit_skills) if fit_skills else 'None identified'}
- Missing Skills: {', '.join(missing_skills) if missing_skills else 'None'}

**Provide improvements in the following structure:**

**1. Critical Changes** (Top 3-4 must-do items to increase match score)
- Focus on adding missing keywords strategically
- Suggest concrete examples to add
- Prioritize highest-impact changes

**2. Skill Gap Solutions** (For each missing skill)
- How to incorporate if candidate has experience
- Alternative ways to demonstrate related skills
- Specific phrasing suggestions

**3. ATS Optimization** (Technical improvements)
- Keyword placement strategies
- Format improvements for better parsing
- Section restructuring recommendations

**4. Content Enhancement** (Quality improvements)
- Stronger action verbs and metrics
- Quantifiable achievements to add
- Relevance alignment with job requirements

**5. Quick Wins** (Immediate, easy changes)
- Simple additions or word substitutions
- Low-effort, high-impact modifications

Keep suggestions:
- Specific and actionable
- Relevant to THIS exact job description
- Concise with bullet points
- Prioritized by impact

Use markdown formatting with ** for bold headers."""

# Singleton instance
ai_service = AIService()


    

