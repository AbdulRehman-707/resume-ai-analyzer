from fastapi import FastAPI, UploadFile, File, HTTPException
import fitz
import os

app = FastAPI(title="Resume AI Analyzer")

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