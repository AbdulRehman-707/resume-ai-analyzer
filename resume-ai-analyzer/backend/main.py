from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import fitz
import os


from skills_service import extract_skills
app = FastAPI(title="Resume AI Analyzer")
class SkillAnalysisRequest(BaseModel):
    skills: list[str]
    role: str
from role_skills import ROLE_SKILLS
from skill_analyzer import analyze_skill_gap

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://127.0.0.1:5173", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_FOLDER = "uploads"

# Create uploads folder if it does not exist
os.makedirs(UPLOAD_FOLDER, exist_ok=True)


@app.get("/")
def home():
    return {
        "message": "Resume AI Analyzer API is running"
    }


@app.post("/upload-resume")
async def upload_resume(file: UploadFile = File(...)):

    # Check file type
    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(
            status_code=400,
            detail="Only PDF files are allowed."
        )

    # Read uploaded file
    file_content = await file.read()

    # Save the PDF
    file_path = os.path.join(UPLOAD_FOLDER, file.filename)

    with open(file_path, "wb") as f:
        f.write(file_content)

    # Open PDF using PyMuPDF
    pdf_document = fitz.open(file_path)

    # Extract text from all pages
    extracted_text = ""

    for page in pdf_document:
        extracted_text += page.get_text()

    pdf_document.close()

    return {
        "filename": file.filename,
        "message": "Resume uploaded and text extracted successfully.",
        "text": extracted_text
    }
@app.post("/extract-skills")
async def extract_resume_skills(file: UploadFile = File(...)):

    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(
            status_code=400,
            detail="Only PDF files are allowed."
        )

    file_path = os.path.join(UPLOAD_FOLDER, file.filename)

    with open(file_path, "wb") as buffer:
        buffer.write(await file.read())

    pdf_document = fitz.open(file_path)

    extracted_text = ""

    for page in pdf_document:
        extracted_text += page.get_text()

    pdf_document.close()

    skills = extract_skills(extracted_text)

    return {
        "filename": file.filename,
        "skills": skills,
        "total_skills": len(skills)
    }
@app.get("/roles")
async def get_roles():
    return {
        "roles": list(ROLE_SKILLS.keys())
    }


@app.post("/analyze-resume")
async def analyze_resume(file: UploadFile = File(...), role: str = ""):
    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(
            status_code=400,
            detail="Only PDF files are allowed."
        )

    if not role:
        raise HTTPException(
            status_code=400,
            detail="A career role is required."
        )

    file_path = os.path.join(UPLOAD_FOLDER, file.filename)

    with open(file_path, "wb") as buffer:
        buffer.write(await file.read())

    pdf_document = fitz.open(file_path)
    extracted_text = "".join(page.get_text() for page in pdf_document)
    pdf_document.close()

    extracted_skills = extract_skills(extracted_text)
    result = analyze_skill_gap(extracted_skills, role)

    if "error" in result:
        raise HTTPException(status_code=404, detail=result["error"])

    return {
        **result,
        "filename": file.filename,
        "extracted_skills": extracted_skills
    }


@app.post("/analyze-skills")
async def analyze_skills(request: SkillAnalysisRequest):
    result = analyze_skill_gap(
        request.skills,
        request.role
    )

    if "error" in result:
        raise HTTPException(
            status_code=404,
            detail=result["error"]
        )

    return result

    