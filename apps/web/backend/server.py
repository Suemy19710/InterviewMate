from sentence_transformers import SentenceTransformer
import pandas as pd
import numpy as np
from matcher.jd_matcher import match_jd_to_resumes_method_3

model = SentenceTransformer("sentence-transformers/all-MiniLM-L6-v2")

df_resume = pd.read_parquet("data/resumes.parquet")
resume_embeddings = np.load("data/resume_embeddings.npy")

jd_text = incoming_request["jd_text"]
jd_keywords = incoming_request["keywords"]

jd_embedding = model.encode(jd_text, normalize_embeddings=True)

results = match_jd_to_resumes_method_3(
    jd_embedding,
    jd_keywords,
    df_resume,
    resume_embeddings,
    top_k=10
)
