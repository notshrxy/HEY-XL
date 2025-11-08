from flask import Flask, request, jsonify
from flask_cors import CORS
import pickle
import os
import pandas as pd
import re
from nltk.corpus import stopwords
from nltk.stem import PorterStemmer
import nltk
from docx import Document

# ===============================
# 🔧 INITIAL SETUP
# ===============================
app = Flask(__name__)
CORS(app)

UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# ===============================
# 🧠 LOAD TRAINED MODEL + VECTORIZER
# ===============================
with open("kmeans_model.pkl", "rb") as f:
    kmeans = pickle.load(f)

with open("tfidf_vectorizer.pkl", "rb") as f:
    vectorizer = pickle.load(f)

print("✅ Model and vectorizer loaded successfully!")

# ===============================
# 🔤 NLP PREPROCESSING
# ===============================
nltk.download('stopwords', quiet=True)
stop_words = set(stopwords.words('english'))
stemmer = PorterStemmer()

def clean_text(text):
    text = str(text).lower()
    text = re.sub(r'[^a-z\s]', '', text)
    words = [stemmer.stem(word) for word in text.split() if word not in stop_words]
    return ' '.join(words)

# ===============================
# 📄 DOCX FILE READER
# ===============================
def extract_questions_from_docx(file_path):
    doc = Document(file_path)
    questions = []

    for para in doc.paragraphs:
        text = para.text.strip()
        if len(text) > 5:  # ignore empty lines
            questions.append(text)

    return questions

# ===============================
# 🔍 MAIN ROUTE — FILE UPLOAD
# ===============================
@app.route("/upload", methods=["POST"])
def upload_file():
    if "file" not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    file = request.files["file"]

    if not file.filename.endswith(".docx"):
        return jsonify({"error": "Please upload a .docx file"}), 400

    save_path = os.path.join(UPLOAD_FOLDER, file.filename)
    file.save(save_path)

    # Extract questions
    questions = extract_questions_from_docx(save_path)

    if not questions:
        return jsonify({"error": "No questions found in document"}), 400

    # Preprocess
    clean_questions = [clean_text(q) for q in questions]
    X = vectorizer.transform(clean_questions)

    # Predict clusters
    clusters = kmeans.predict(X)

    # Combine into DataFrame for easy analysis
    df = pd.DataFrame({"question": questions, "cluster": clusters})

    # Count frequency of each cluster
    cluster_counts = df["cluster"].value_counts().sort_index().to_dict()

    # Find repeated / similar questions (based on identical cleaned text)
    duplicates = df["question"].value_counts()
    most_repeated = duplicates[duplicates > 1].head(10).to_dict()

    # Prepare JSON response
    response = {
        "total_questions": len(df),
        "cluster_summary": cluster_counts,
        "most_repeated": most_repeated,
        "sample_per_cluster": {
            str(i): df[df["cluster"] == i]["question"].head(3).tolist()
            for i in range(kmeans.n_clusters)
        }
    }

    return jsonify(response)

# ===============================
# 🚀 START SERVER
# ===============================
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
