from fastapi import UploadFile, File, Form
import pdfplumber
import re
from sklearn.metrics.pairwise import cosine_similarity

# ---------- Text Cleaning ----------
def clean_text(text: str):
    text = text.lower()
    text = re.sub(r'\s+', ' ', text)
    text = re.sub(r'[^\w\s]', ' ', text)
    return text.strip()

# ---------- pdf -> text ----------
def extract_pdf_text(file: UploadFile):
    file.file.seek(0)   # IMPORTANT for FastAPI
    text = ""

    try:
        with pdfplumber.open(file.file) as pdf:
            for page in pdf.pages:
                page_text = page.extract_text()
                if page_text:
                    text += page_text + "\n"
    except Exception:
        return ""

    return text if text.strip() else ""


# ----------Skill Extraction + matching ----------
# now just focusing on basic tech fields
COMMON_TECH_SKILLS = [
    "python","sql","aws","docker","kubernetes","microservices",
    "react","ci/cd",
    "automation","robotics","mechatronics",
    "manufacturing","project management","cad"
]


def extract_skills(text: str):
    text = text.lower()

    # normalize ci/cd cases
    text = text.replace("ci cd", "ci/cd")
    text = text.replace("cicd", "ci/cd")

    found = []

    for skill in COMMON_TECH_SKILLS:
        pattern = r'\b' + re.escape(skill) + r'\b'
        if re.search(pattern, text):
            found.append(skill)

    return found

def skill_match(resume_text: str, jd_text: str):
    jd_skills = extract_skills(jd_text)
    resume_skills = extract_skills(resume_text)

    fit = [s for s in jd_skills if s in resume_skills]
    missing = [s for s in jd_skills if s not in resume_skills]

    return jd_skills, fit, missing
