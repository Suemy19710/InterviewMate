from fastapi import FastAPI, UploadFile, File, Form
from pydantic import BaseModel
import pdfplumber
import re
import pandas as pd
import numpy as np
from pathlib import Path
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity
from fastapi.middleware.cors import CORSMiddleware


from utils.jd_matcher import match_jd_to_resumes_method_3
from utils.single_cv_jd_matcher import extract_pdf_text, clean_text, skill_match

# -------- Add CORS (so frontend can call API) --------
app = FastAPI(title="AI Resume Matcher API")
app.add_middleware(
    CORSMiddleware, 
    allow_origins=["*"], 
    allow_credentials=True, 
    allow_methods=["*"], 
    allow_headers=["*"], 
)


# =========================
# LOAD LATEST MODEL VERSION
# =========================
def load_latest_version():
    backend_dir = Path(__file__).resolve().parent
    project_root = backend_dir.parents[2]   # up to InterviewMate root

    # -------- Model folder --------
    model_root = project_root / "notebook" / "model" / "2025-12-31"
    # versions = sorted([v for v in model_root.iterdir() if v.is_dir()])
    # latest = versions[0]

    print(f"Loading model version: {model_root.name}")

    # -------- Load datasets --------
    df_resume = pd.read_csv(
        project_root / "data" / "data" / "processed_data" / "pdf_data.csv"
    )

    df_jd = pd.read_csv(
        project_root / "data" / "data" / "processed_data" / "jd_data.csv"
    )

    # -------- Load resume embeddings --------
    resume_embeddings = np.load(model_root / "resume_embeddings.npy")

    # -------- Load SentenceTransformer model --------
    model = SentenceTransformer("sentence-transformers/all-MiniLM-L6-v2")

    print(f"Resumes loaded: {len(df_resume)}")
    print(f"JDs loaded: {len(df_jd)}")

    return df_jd, df_resume, resume_embeddings, model


df_jd, df_resume, resume_embeddings, model = load_latest_version()



# =========================
# REQUEST MODEL
# =========================
class JDRequest(BaseModel):
    jd_text: str
    keywords: str
    top_k: int = 10



# =========================
# API ENDPOINT
# =========================
@app.post("/match-jd")
def match_jd(request: JDRequest):
    jd_embedding = model.encode(request.jd_text, normalize_embeddings=True)

    results = match_jd_to_resumes_method_3(
        jd_embedding,
        request.keywords,
        df_resume,
        resume_embeddings,
        top_k=request.top_k
    )

    return results[[
        "Filename",
        "Category",
        "score",
        "Why it fits?",
        "Missing Skills"
    ]].to_dict(orient="records")

# ----------Single Match Endpoint ----------
@app.post("/single-match")
async def single_match(
    resume: UploadFile = File(...),
    jd_text: str = Form(...)
):
    # 1️⃣ Extract resume text
    resume_text = extract_pdf_text(resume)
    resume_clean = clean_text(resume_text)
    jd_clean = clean_text(jd_text)

    # 2️⃣ Embedding similarity
    resume_vec = model.encode([resume_clean])
    jd_vec = model.encode([jd_clean])
    score = float(cosine_similarity(resume_vec, jd_vec)[0][0])
    match_percentage = round(score * 100, 2)

    # 3️⃣ Skills
    jd_skills, fit_skills, missing_skills = skill_match(resume_clean, jd_clean)

    # 4️⃣ Result label
    if match_percentage >= 80:
        result = "⭐ Strong Match – Great Fit"
    elif match_percentage >= 60:
        result = "👍 Moderate Match – Trainable Fit"
    else:
        result = "⚠️ Weak Match – Needs Improvement"

    return {
        "match_score": match_percentage,
        "result": result,
        "total_jd_skills": len(jd_skills),
        "fit_skills": fit_skills,
        "missing_skills": missing_skills
    }





# =========================
# ROOT / HEALTH
# =========================
@app.get("/")
def root():
    return {
        "status": "running",
        "message": "AI ATS Backend Ready",
        "version": "Method 3 - Semantic Matching + Explanation"
    }

@app.get("/health")
def health():
    return {"status": "ok"}



# =========================
# RUN (optional local run)
# =========================
if __name__ == "__main__":
    try:
        import uvicorn
        uvicorn.run(app, port=10000)
    except ImportError:
        print("Error: uvicorn is not installed. Install it with: pip install uvicorn")
