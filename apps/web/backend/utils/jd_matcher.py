import re
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity

# ---------- Helpers ----------

def normalize_for_match(text):
    if not isinstance(text, str):
        return ""
    text = text.lower()
    text = re.sub(r"[^a-z0-9\s]", " ", text)
    text = re.sub(r"\s+", " ", text).strip()
    return text


def extract_keywords(jd_keywords):
    if not isinstance(jd_keywords, str):
        return []
    jd_keywords = jd_keywords.replace(";", ",")
    return [kw.strip() for kw in jd_keywords.split(",") if kw.strip()]


def explain_fit_only(resume_text, jd_keywords):
    resume_norm = normalize_for_match(resume_text)
    resume_tokens = set(resume_norm.split())

    matched = []
    for raw_kw in extract_keywords(jd_keywords):
        kw_norm = normalize_for_match(raw_kw)
        kw_tokens = kw_norm.split()

        if kw_tokens and all(t in resume_tokens for t in kw_tokens):
            matched.append(raw_kw)

    return ", ".join(matched) if matched else "No matching keywords"


def missing_skills_only(resume_text, jd_keywords):
    resume_norm = normalize_for_match(resume_text)
    resume_tokens = set(resume_norm.split())

    missing = []
    for raw_kw in extract_keywords(jd_keywords):
        kw_norm = normalize_for_match(raw_kw)
        kw_tokens = kw_norm.split()

        if not (kw_tokens and all(t in resume_tokens for t in kw_tokens)):
            missing.append(raw_kw)

    return ", ".join(missing) if missing else "None"


# ---------- MAIN MATCH FUNCTION ----------

def match_jd_to_resumes_method_3(jd_embedding, jd_keywords,
                                 df_resume, resume_embeddings, top_k=10):

    emb = np.asarray(jd_embedding)
    if emb.ndim == 2 and emb.shape[0] == 1:
        emb = emb[0]

    scores = cosine_similarity(emb.reshape(1, -1), resume_embeddings).flatten()

    sorted_idx = scores.argsort()[::-1][:top_k]

    results = df_resume.iloc[sorted_idx].copy()
    results["score"] = scores[sorted_idx]

    results["Why it fits?"] = results["Cleaned_Text"].apply(
        lambda txt: explain_fit_only(txt, jd_keywords)
    )

    results["Missing Skills"] = results["Cleaned_Text"].apply(
        lambda txt: missing_skills_only(txt, jd_keywords)
    )

    return results
