from fastapi import FastAPI
from pydantic import BaseModel
import pandas as pd
import numpy as np
from pathlib import Path
from sentence_transformers import SentenceTransformer
from fastapi.middleware.cors import CORSMiddleware

from utils.jd_matcher import match_jd_to_resumes_method_3

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
    import uvicorn
    uvicorn.run(app, port=10000)
